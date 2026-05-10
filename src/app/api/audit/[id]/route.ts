import { NextRequest, NextResponse } from "next/server";
import { getAudit } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const stored = await getAudit(params.id);
  if (!stored) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }
  return NextResponse.json(stored.auditResult, { status: 200 });
}