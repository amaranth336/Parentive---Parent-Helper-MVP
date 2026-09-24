import { NextResponse } from "next/server";
import {
  HELPERS_ERRORS,
  MAX_HELPERS_REQUEST_BYTES,
} from "@/lib/helpers/copy";
import { resolveClientIp } from "@/lib/helpers/client-ip";
import { handleHelpersSubmission } from "@/lib/helpers/handler";

export async function POST(request: Request) {
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

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: HELPERS_ERRORS.validation },
      { status: 400 },
    );
  }

  const result = await handleHelpersSubmission(formData, {
    ip: resolveClientIp(request),
  });

  return NextResponse.json(result.body, { status: result.status });
}
