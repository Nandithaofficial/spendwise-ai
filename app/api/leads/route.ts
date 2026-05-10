import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveAudit, saveLead, getAudit } from "@/lib/store";

const LeadSchema = z.object({
  auditId: z.string().min(1),
  email: z.string().email(),
  companyName: z.string().max(200).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().int().min(1).max(100000).optional(),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 422 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const { auditId, email, companyName, role, teamSize } = parsed.data;
  const stored = await getAudit(auditId);
  if (!stored) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const monthlySavings = stored.auditResult.totalMonthlySavings;
  await saveAudit(stored.auditResult, email);
  await saveLead({ auditId, email, companyName, role, teamSize, monthlySavings });

  return NextResponse.json({ success: true, monthlySavings }, { status: 200 });
}