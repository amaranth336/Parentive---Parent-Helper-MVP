import { NextResponse } from "next/server";
import { handleEarlyAccessSubmission } from "@/lib/early-access/handler";

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
  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const result = await handleEarlyAccessSubmission(body, {
    ip: clientIp(request),
  });

  return NextResponse.json(result.body, { status: result.status });
}
