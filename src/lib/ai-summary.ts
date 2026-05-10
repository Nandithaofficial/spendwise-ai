import type { AuditResult } from "@/types";

export async function generateAISummary(audit: AuditResult): Promise<string> {
  const prompt = buildPrompt(audit);
  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content.filter((b) => b.type === "text").map((b) => (b as { type: "text"; text: string }).text).join("");
    return text.trim();
  } catch (err) {
    console.warn("AI summary failed, using fallback:", err);
    return buildFallbackSummary(audit);
  }
}

function buildPrompt(audit: AuditResult): string {
  const toolList = audit.results.map((r) => `- ${r.displayName} (${r.currentPlan}): $${r.currentSpend}/mo — ${r.reasoning}`).join("\n");
  return `You are an expert AI infrastructure consultant. Write a concise, personalized 80–100 word audit summary for a ${audit.input.useCase} team of ${audit.input.teamSize} people.\n\nTheir current AI tools:\n${toolList}\n\nTotal current spend: $${audit.totalMonthlySpend}/mo\nPotential monthly savings: $${audit.totalMonthlySavings}/mo\n\nWrite in second-person, direct, and specific. Mention the biggest saving opportunity by name. Do NOT use bullet points. Do NOT use headers. Just one paragraph.`;
}

function buildFallbackSummary(audit: AuditResult): string {
  const top = [...audit.results].sort((a, b) => b.monthlySavings - a.monthlySavings)[0];
  if (audit.isOptimal) return `Your team of ${audit.input.teamSize} is spending $${audit.totalMonthlySpend}/month across your AI tools efficiently. Your current stack is well-matched to your ${audit.input.useCase} use case.`;
  return `Your team of ${audit.input.teamSize} is spending $${audit.totalMonthlySpend}/month on AI tools and leaving $${audit.totalMonthlySavings}/month on the table. The biggest opportunity is ${top?.displayName} — ${top?.reasoning} Over 12 months, that's $${audit.totalAnnualSavings} in recoverable spend.`;
}