import { nanoid } from "nanoid";
import type { AuditInput, AuditResult, ToolAuditResult, ToolEntry, UseCase } from "@/types";
import { TOOL_MAP } from "./pricing-data";

function auditCursor(entry: ToolEntry, useCase: UseCase): ToolAuditResult {
  const { seats, monthlySpend, plan } = entry;
  const base = { toolId: "cursor" as const, displayName: "Cursor", currentPlan: plan, currentSpend: monthlySpend, recommendedAction: "optimal" as const, credexOpportunity: false, reasoning: "" };

  if (plan === "Business" && seats <= 3) {
    const projected = seats * 20;
    const savings = monthlySpend - projected;
    return { ...base, recommendedAction: "downgrade", recommendedPlan: "Pro", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: savings > 50, reasoning: `Business at $40/seat adds SSO and admin controls — unnecessary for a ${seats}-person team. Pro ($20/seat) gives identical coding capability. Save $${savings}/mo.` };
  }
  if (useCase === "coding" && plan === "Pro") {
    return { ...base, projectedSpend: monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "Cursor Pro is well-matched for coding use cases at this team size." };
  }
  if (useCase !== "coding" && plan === "Pro") {
    const projected = seats * 10;
    const savings = monthlySpend - projected;
    if (savings > 0) return { ...base, recommendedAction: "switch", recommendedTool: "GitHub Copilot Individual", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: savings > 50, reasoning: `For a ${useCase} team, Cursor's advanced agentic features go largely unused. GitHub Copilot Individual ($10/seat) covers inline completions at half the price.` };
  }
  return { ...base, projectedSpend: monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "Current plan and spend appear well-optimised for your team." };
}

function auditGithubCopilot(entry: ToolEntry): ToolAuditResult {
  const { seats, monthlySpend, plan } = entry;
  const base = { toolId: "github_copilot" as const, displayName: "GitHub Copilot", currentPlan: plan, currentSpend: monthlySpend, recommendedAction: "optimal" as const, credexOpportunity: false, reasoning: "" };

  if (plan === "Business" && seats <= 2) {
    const projected = seats * 10;
    const savings = monthlySpend - projected;
    return { ...base, recommendedAction: "downgrade", recommendedPlan: "Individual", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: savings > 30, reasoning: `GitHub Copilot Business adds org-wide policy — useful at 10+ devs but overhead for ${seats} seats. Individual ($10/seat) provides the same IDE completions.` };
  }
  if (plan === "Enterprise" && seats < 20) {
    const projected = seats * 19;
    const savings = monthlySpend - projected;
    return { ...base, recommendedAction: "downgrade", recommendedPlan: "Business", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: savings > 100, reasoning: `Copilot Enterprise unlocks custom models — meaningful at 20+ devs. At ${seats} seats, Business ($19/seat) provides equal day-to-day value.` };
  }
  return { ...base, projectedSpend: monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "GitHub Copilot plan is well-matched to your team size." };
}

function auditClaude(entry: ToolEntry, useCase: UseCase): ToolAuditResult {
  const { seats, monthlySpend, plan } = entry;
  const base = { toolId: "claude" as const, displayName: "Claude", currentPlan: plan, currentSpend: monthlySpend, recommendedAction: "optimal" as const, credexOpportunity: false, reasoning: "" };

  if (plan === "Team" && seats < 5) {
    const projected = seats * 20;
    const savings = monthlySpend - projected;
    if (savings > 0) return { ...base, recommendedAction: "downgrade", recommendedPlan: "Pro (individual)", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: savings > 30, reasoning: `Claude Team has a 5-seat minimum at $30/seat. With ${seats} actual users, individual Pro plans ($20/seat) deliver the same capability at lower cost.` };
  }
  if (plan === "Max" && useCase === "coding" && seats >= 2) {
    const projected = seats * 20;
    const savings = monthlySpend - projected;
    if (savings > 50) return { ...base, recommendedAction: "switch", recommendedTool: "Claude API direct", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: true, reasoning: `Max at $100/seat is for power users with extremely high volume. A dev team typically gets better ROI via API ($3/MTok for Sonnet) with usage-based billing.` };
  }
  if (plan === "Enterprise" && seats < 40) {
    const projected = seats * 30;
    const savings = monthlySpend - projected;
    if (savings > 0) return { ...base, recommendedAction: "downgrade", recommendedPlan: "Team", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: savings > 100, reasoning: `Claude Enterprise is optimised for 40+ seat orgs. At ${seats} seats, Team ($30/seat) provides shared Projects and admin controls at a third of the cost.` };
  }
  return { ...base, projectedSpend: monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "Claude plan is appropriate for your team size and use case." };
}

function auditChatGPT(entry: ToolEntry): ToolAuditResult {
  const { seats, monthlySpend, plan } = entry;
  const base = { toolId: "chatgpt" as const, displayName: "ChatGPT", currentPlan: plan, currentSpend: monthlySpend, recommendedAction: "optimal" as const, credexOpportunity: false, reasoning: "" };

  if (plan === "Team" && seats <= 2) {
    const projected = seats * 20;
    const savings = monthlySpend - projected;
    if (savings > 0) return { ...base, recommendedAction: "downgrade", recommendedPlan: "Plus", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: savings > 20, reasoning: `ChatGPT Team at $30/seat adds shared workspace — useful for 5+ people, not for ${seats}. Plus ($20/seat) gives the same model access at lower price.` };
  }
  return { ...base, projectedSpend: monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "ChatGPT plan is appropriate for current team size." };
}

function auditAPITool(entry: ToolEntry): ToolAuditResult {
  const isClaude = entry.toolId === "anthropic_api";
  const base = { toolId: entry.toolId as "anthropic_api" | "openai_api", displayName: isClaude ? "Anthropic API" : "OpenAI API", currentPlan: "Pay-as-you-go", currentSpend: entry.monthlySpend, recommendedAction: "optimal" as const, credexOpportunity: false, reasoning: "" };

  if (entry.monthlySpend > 500) {
    const projected = entry.monthlySpend * 0.75;
    const savings = entry.monthlySpend - projected;
    return { ...base, recommendedAction: "credits", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: true, reasoning: `At $${entry.monthlySpend}/mo on ${isClaude ? "Anthropic" : "OpenAI"} API, pre-purchased credits (available through Credex at a discount) typically save 20–30% vs pay-as-you-go retail rates.` };
  }
  return { ...base, projectedSpend: entry.monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "API spend is low enough that pay-as-you-go is more economical than committing to credit bundles." };
}

function auditGemini(entry: ToolEntry): ToolAuditResult {
  const { seats, monthlySpend, plan } = entry;
  const base = { toolId: "gemini" as const, displayName: "Gemini", currentPlan: plan, currentSpend: monthlySpend, recommendedAction: "optimal" as const, credexOpportunity: false, reasoning: "" };

  if ((plan === "Business" || plan === "Enterprise") && seats <= 3) {
    const projected = seats * 19.99;
    const savings = monthlySpend - projected;
    if (savings > 0) return { ...base, recommendedAction: "downgrade", recommendedPlan: "Advanced", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: false, reasoning: `For standalone AI use, Gemini Advanced ($20/seat) delivers the same model without the Workspace overhead.` };
  }
  return { ...base, projectedSpend: monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "Gemini spend appears appropriate for current usage." };
}

function auditWindsurf(entry: ToolEntry, useCase: UseCase): ToolAuditResult {
  const { seats, monthlySpend, plan } = entry;
  const base = { toolId: "windsurf" as const, displayName: "Windsurf", currentPlan: plan, currentSpend: monthlySpend, recommendedAction: "optimal" as const, credexOpportunity: false, reasoning: "" };

  if (useCase !== "coding") {
    return { ...base, recommendedAction: "switch", recommendedTool: useCase === "writing" ? "Claude Pro" : "ChatGPT Plus", projectedSpend: 0, monthlySavings: monthlySpend, annualSavings: monthlySpend * 12, credexOpportunity: false, reasoning: `Windsurf is purpose-built for coding. For ${useCase} tasks, Claude Pro or ChatGPT Plus will outperform it at similar or lower cost.` };
  }
  if (plan === "Teams" && seats <= 2) {
    const projected = seats * 15;
    const savings = monthlySpend - projected;
    return { ...base, recommendedAction: "downgrade", recommendedPlan: "Pro", projectedSpend: projected, monthlySavings: savings, annualSavings: savings * 12, credexOpportunity: false, reasoning: `Windsurf Teams adds SSO for ${seats} devs. Pro ($15/seat) provides the same credits and model access.` };
  }
  return { ...base, projectedSpend: monthlySpend, monthlySavings: 0, annualSavings: 0, reasoning: "Windsurf plan is appropriate for a coding-focused team of this size." };
}

function detectOverlaps(entries: ToolEntry[], results: ToolAuditResult[]): ToolAuditResult[] {
  const toolIds = new Set(entries.map((e) => e.toolId));

  if (toolIds.has("cursor") && toolIds.has("windsurf")) {
    const wr = results.find((r) => r.toolId === "windsurf");
    if (wr && wr.recommendedAction === "optimal") {
      const we = entries.find((e) => e.toolId === "windsurf")!;
      wr.recommendedAction = "switch";
      wr.recommendedTool = "Cursor (already paying)";
      wr.projectedSpend = 0;
      wr.monthlySavings = we.monthlySpend;
      wr.annualSavings = we.monthlySpend * 12;
      wr.reasoning = "You're paying for both Cursor and Windsurf — both provide agentic code completion. Consolidating on Cursor eliminates this spend entirely.";
    }
  }

  if (toolIds.has("claude") && toolIds.has("chatgpt")) {
    const ce = entries.find((e) => e.toolId === "claude")!;
    const ge = entries.find((e) => e.toolId === "chatgpt")!;
    const gr = results.find((r) => r.toolId === "chatgpt");
    if (gr && gr.recommendedAction === "optimal" && ce.monthlySpend < ge.monthlySpend) {
      gr.recommendedAction = "switch";
      gr.recommendedTool = "Claude (already paying)";
      gr.projectedSpend = 0;
      gr.monthlySavings = ge.monthlySpend;
      gr.annualSavings = ge.monthlySpend * 12;
      gr.reasoning = "You're paying for both Claude and ChatGPT. For most workflows these are interchangeable. Consolidating on Claude (your lower-cost subscription) eliminates duplicate spend.";
    }
  }
  return results;
}

export function runAudit(input: AuditInput): AuditResult {
  const { tools, teamSize, useCase } = input;
  const results: ToolAuditResult[] = tools.map((entry) => {
    switch (entry.toolId) {
      case "cursor": return auditCursor(entry, useCase);
      case "github_copilot": return auditGithubCopilot(entry);
      case "claude": return auditClaude(entry, useCase);
      case "chatgpt": return auditChatGPT(entry);
      case "anthropic_api":
      case "openai_api": return auditAPITool(entry);
      case "gemini": return auditGemini(entry);
      case "windsurf": return auditWindsurf(entry, useCase);
      default: return { toolId: entry.toolId, displayName: entry.toolId, currentPlan: entry.plan, currentSpend: entry.monthlySpend, recommendedAction: "optimal" as const, projectedSpend: entry.monthlySpend, monthlySavings: 0, annualSavings: 0, credexOpportunity: false, reasoning: "No specific optimisation found." };
    }
  });

  const withOverlaps = detectOverlaps(tools, results);
  const totalMonthlySpend = tools.reduce((s, t) => s + t.monthlySpend, 0);
  const totalProjectedSpend = withOverlaps.reduce((s, r) => s + r.projectedSpend, 0);
  const totalMonthlySavings = totalMonthlySpend - totalProjectedSpend;

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    results: withOverlaps,
    totalMonthlySpend,
    totalProjectedSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isOptimal: totalMonthlySavings < 10,
  };
}