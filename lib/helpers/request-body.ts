/**
 * Bounded body read for helpers multipart POSTs.
 *
 * Streams the request body and rejects once the cumulative byte count exceeds
 * maxBytes. Does not buffer an unbounded payload into memory.
 */

export class HelpersBodyTooLargeError extends Error {
  readonly code = "HELPERS_BODY_TOO_LARGE" as const;

  constructor(message = "Request body exceeds the allowed size.") {
    super(message);
    this.name = "HelpersBodyTooLargeError";
  }
}

/**
 * Read the request body up to maxBytes inclusive.
 * Throws HelpersBodyTooLargeError when the stream exceeds the cap.
 */
export async function readHelpersBodyWithLimit(
  request: Request,
  maxBytes: number,
): Promise<Uint8Array> {
  if (!Number.isFinite(maxBytes) || maxBytes < 0) {
    throw new RangeError("maxBytes must be a non-negative finite number");
  }

  const body = request.body;
  if (!body) {
    return new Uint8Array(0);
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!value || value.byteLength === 0) {
        continue;
      }

      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel("body too large").catch(() => undefined);
        throw new HelpersBodyTooLargeError();
      }

      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof HelpersBodyTooLargeError) {
      throw error;
    }
    await reader.cancel("read failed").catch(() => undefined);
    throw error;
  }

  if (chunks.length === 0) {
    return new Uint8Array(0);
  }
  if (chunks.length === 1) {
    return chunks[0]!;
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

/**
 * Rebuild a Request carrying a already-capped body so callers can use formData().
 */
export function rebuildRequestWithBody(
  request: Request,
  body: Uint8Array,
): Request {
  const headers = new Headers(request.headers);
  // Content-Length must match the buffered body we will parse.
  headers.set("content-length", String(body.byteLength));

  return new Request(request.url, {
    method: request.method,
    headers,
    body: body.byteLength > 0 ? body : undefined,
    // duplex required by undici when providing a body on some Node versions
    duplex: "half",
  } as RequestInit);
}
