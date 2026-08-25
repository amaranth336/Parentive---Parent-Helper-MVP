import { NextResponse } from "next/server";
import { deleteActivity, toggleActivity } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string; activityId: string } }
) {
  const activity = await toggleActivity(params.id, params.activityId);
  if (!activity) {
    return NextResponse.json(
      { error: "Child or activity not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ activity });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; activityId: string } }
) {
  const ok = await deleteActivity(params.id, params.activityId);
  if (!ok) {
    return NextResponse.json(
      { error: "Child or activity not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true });
}
