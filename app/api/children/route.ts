import { NextResponse } from "next/server";
import { createChild, listChildren } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const children = await listChildren();
  return NextResponse.json({ children });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, ageYears } = (body ?? {}) as {
    name?: unknown;
    ageYears?: unknown;
  };

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const age = Number(ageYears);
  if (!Number.isFinite(age) || age < 0 || age > 25) {
    return NextResponse.json(
      { error: "ageYears must be a number between 0 and 25" },
      { status: 400 }
    );
  }

  const child = await createChild(name.trim(), Math.floor(age));
  return NextResponse.json({ child }, { status: 201 });
}
