import { NextResponse } from "next/server";
import {
  HELPERS_ERRORS,
  MAX_HELPERS_REQUEST_BYTES,
} from "@/lib/helpers/copy";
import { resolveClientIp } from "@/lib/helpers/client-ip";
import { handleHelpersSubmission } from "@/lib/helpers/handler";
import { checkHelpersApplicationRateLimit } from "@/lib/helpers/rate-limit";
import {
  HelpersBodyTooLargeError,
  readHelpersBodyWithLimit,
  rebuildRequestWithBody,
} from "@/lib/helpers/request-body";

export async function POST(request: Request) {
  const ip = resolveClientIp(request);

  const rate = await checkHelpersApplicationRateLimit(ip);
  if ("unavailable" in rate && rate.unavailable) {
    return NextResponse.json(
      { ok: false, error: HELPERS_ERRORS.unavailable },
      { status: 503 },
    );
  }
  if (rate.limited) {
    return NextResponse.json(
      { ok: false, error: HELPERS_ERRORS.rateLimit },
      { status: 429 },
    );
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_HELPERS_REQUEST_BYTES
    ) {
      return NextResponse.json(
        { ok: false, error: HELPERS_ERRORS.payloadTooLarge },
        { status: 413 },
      );
    }
  }

  let bodyBytes: Uint8Array;
  try {
    bodyBytes = await readHelpersBodyWithLimit(
      request,
      MAX_HELPERS_REQUEST_BYTES,
    );
  } catch (error) {
    if (error instanceof HelpersBodyTooLargeError) {
      return NextResponse.json(
        { ok: false, error: HELPERS_ERRORS.payloadTooLarge },
        { status: 413 },
      );
    }
    return NextResponse.json(
      { ok: false, error: HELPERS_ERRORS.validation },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    const rebuilt = rebuildRequestWithBody(request, bodyBytes);
    formData = await rebuilt.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: HELPERS_ERRORS.validation },
      { status: 400 },
    );
  }

  // Rate limit already enforced above; handler skips RL on this path.
  const result = await handleHelpersSubmission(formData, { ip });

  return NextResponse.json(result.body, { status: result.status });
}
