import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAudit } from "@/lib/audit-engine";
import { generateAISummary } from "@/lib/ai-summary";
import { saveAudit } from "@/lib/store";

const ToolEntrySchema = z.object({
  toolId: z.enum(["cursor","github_copilot","claude","chatgpt","anthropic_api","openai_api","gemini","windsurf"]),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0).max(100000),
  seats: z.number().int().min(1).max(10000),
});

const AuditInputSchema = z.object({
  tools: z.array(ToolEntrySchema).min(1).max(20),
  teamSize: z.number().int().min(1).max(100000),
  useCase: z.enum(["coding","writing","data","research","mixed"]),
});

const ipCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || entry.resetAt < now) {
    ipCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AuditInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 422 });
  }

  const auditResult = runAudit(parsed.data);
  auditResult.aiSummary = await generateAISummary(auditResult);
  await saveAudit(auditResult);

  return NextResponse.json(auditResult, { status: 200 });
}