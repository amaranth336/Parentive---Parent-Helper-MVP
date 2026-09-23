import { NextResponse } from "next/server";
import { handleHelpersSubmission } from "@/lib/helpers/handler";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please correct the highlighted fields." },
      { status: 400 },
    );
  }

  const result = await handleHelpersSubmission(formData, {
    ip: clientIp(request),
  });

  return NextResponse.json(result.body, { status: result.status });
}
