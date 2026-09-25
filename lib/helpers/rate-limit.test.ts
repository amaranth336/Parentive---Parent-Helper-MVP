import {
  checkHelpersApplicationRateLimit,
  createSlidingWindowHelpersLimiter,
  isHelpersMemoryRateLimitAllowed,
} from "./rate-limit";
import type { ServiceRoleClient } from "./submit";

function createRpcClient(
  rpcImpl: (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>,
): ServiceRoleClient {
  return {
    rpc: rpcImpl,
  } as unknown as ServiceRoleClient;
}

/** Mutex-backed mock that mirrors the SQL FOR UPDATE semantics. */
function createAtomicMutexRpc(maxRequests: number) {
  let hitCount = 0;
  let chain: Promise<unknown> = Promise.resolve();

  function withLock<T>(fn: () => T | Promise<T>): Promise<T> {
    const run = chain.then(() => fn());
    chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  return createRpcClient(async (fn) => {
    expect(fn).toBe("check_helper_application_rate_limit");
    return withLock(async () => {
      if (hitCount >= maxRequests) {
        return { data: true, error: null };
      }
      hitCount += 1;
      return { data: false, error: null };
    });
  });
}

describe("checkHelpersApplicationRateLimit", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns limited:false when RPC allows (false)", async () => {
    const client = createRpcClient(async () => ({ data: false, error: null }));
    const result = await checkHelpersApplicationRateLimit("1.1.1.1", {
      getClient: () => client,
    });
    expect(result).toEqual({ limited: false });
  });

  it("returns limited:true when RPC denies (true)", async () => {
    const client = createRpcClient(async () => ({ data: true, error: null }));
    const result = await checkHelpersApplicationRateLimit("1.1.1.1", {
      getClient: () => client,
    });
    expect(result).toEqual({ limited: true });
  });

  it("returns unavailable when the service-role client is missing", async () => {
    process.env = { ...originalEnv, NODE_ENV: "production" };
    delete process.env.HELPERS_ALLOW_MEMORY_RATE_LIMIT;

    const result = await checkHelpersApplicationRateLimit("1.1.1.1", {
      getClient: () => null,
    });
    expect(result).toEqual({ unavailable: true });
  });

  it("returns unavailable when the RPC errors (fail closed)", async () => {
    process.env = { ...originalEnv, NODE_ENV: "test" };
    delete process.env.HELPERS_ALLOW_MEMORY_RATE_LIMIT;

    const client = createRpcClient(async () => ({
      data: null,
      error: { message: "rpc failed" },
    }));
    const result = await checkHelpersApplicationRateLimit("1.1.1.1", {
      getClient: () => client,
    });
    expect(result).toEqual({ unavailable: true });
  });

  it("does not use memory fallback with only NODE_ENV=development", async () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "development",
    };
    delete process.env.HELPERS_ALLOW_MEMORY_RATE_LIMIT;

    expect(isHelpersMemoryRateLimitAllowed(process.env)).toBe(false);

    const result = await checkHelpersApplicationRateLimit("1.1.1.1", {
      getClient: () => null,
    });
    expect(result).toEqual({ unavailable: true });
  });

  it("does not use memory fallback with only the env flag set", async () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "production",
      HELPERS_ALLOW_MEMORY_RATE_LIMIT: "1",
    };

    expect(isHelpersMemoryRateLimitAllowed(process.env)).toBe(false);

    const result = await checkHelpersApplicationRateLimit("1.1.1.1", {
      getClient: () => null,
    });
    expect(result).toEqual({ unavailable: true });
  });

  it("uses memory fallback only when both development gates are set", async () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: "development",
      HELPERS_ALLOW_MEMORY_RATE_LIMIT: "1",
    };

    expect(isHelpersMemoryRateLimitAllowed(process.env)).toBe(true);

    const memory = createSlidingWindowHelpersLimiter({ maxRequests: 2 });
    const first = await checkHelpersApplicationRateLimit("9.9.9.9", {
      getClient: () => null,
      memoryFallback: memory,
      maxRequests: 2,
    });
    const second = await checkHelpersApplicationRateLimit("9.9.9.9", {
      getClient: () => null,
      memoryFallback: memory,
      maxRequests: 2,
    });
    const third = await checkHelpersApplicationRateLimit("9.9.9.9", {
      getClient: () => null,
      memoryFallback: memory,
      maxRequests: 2,
    });

    expect(first).toEqual({ limited: false });
    expect(second).toEqual({ limited: false });
    expect(third).toEqual({ limited: true });
  });

  it("parallel Promise.all cannot exceed max allows with atomic RPC mock", async () => {
    const maxRequests = 3;
    const client = createAtomicMutexRpc(maxRequests);

    const results = await Promise.all(
      Array.from({ length: 20 }, () =>
        checkHelpersApplicationRateLimit("parallel-key", {
          getClient: () => client,
          maxRequests,
        }),
      ),
    );

    const allowed = results.filter(
      (result) => "limited" in result && result.limited === false,
    );
    const limited = results.filter(
      (result) => "limited" in result && result.limited === true,
    );

    expect(allowed).toHaveLength(maxRequests);
    expect(limited).toHaveLength(20 - maxRequests);
    expect(results.some((result) => "unavailable" in result)).toBe(false);
  });
});
