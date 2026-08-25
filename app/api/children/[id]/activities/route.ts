import { NextResponse } from "next/server";
import { addActivity } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, time } = (body ?? {}) as { title?: unknown; time?: unknown };

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const timeValue =
    typeof time === "string" && time.trim().length > 0 ? time.trim() : "--:--";

  const activity = await addActivity(params.id, title.trim(), timeValue);
  if (!activity) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  return NextResponse.json({ activity }, { status: 201 });
}
