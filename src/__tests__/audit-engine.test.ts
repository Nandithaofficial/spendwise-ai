import { runAudit } from "../../lib/audit-engine";
import type { AuditInput } from "../../types";

test("recommends Cursor downgrade from Business to Pro for 3 seats", () => {
  const input: AuditInput = {
    tools: [{ toolId: "cursor", plan: "Business", monthlySpend: 120, seats: 3 }],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "cursor");
  expect(r?.recommendedAction).toBe("downgrade");
  expect(r?.monthlySavings).toBeGreaterThan(0);
});

test("returns 0 savings for Cursor Pro on a coding team", () => {
  const input: AuditInput = {
    tools: [{ toolId: "cursor", plan: "Pro", monthlySpend: 40, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "cursor");
  expect(r?.monthlySavings).toBe(0);
  expect(r?.recommendedAction).toBe("optimal");
});

test("recommends Copilot downgrade from Business to Individual for 2 seats", () => {
  const input: AuditInput = {
    tools: [{ toolId: "github_copilot", plan: "Business", monthlySpend: 38, seats: 2 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "github_copilot");
  expect(r?.recommendedAction).toBe("downgrade");
  expect(r?.monthlySavings).toBe(18);
});

test("flags Anthropic API credit opportunity above $500/mo", () => {
  const input: AuditInput = {
    tools: [{ toolId: "anthropic_api", plan: "Pay-as-you-go", monthlySpend: 800, seats: 1 }],
    teamSize: 5,
    useCase: "coding",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "anthropic_api");
  expect(r?.recommendedAction).toBe("credits");
  expect(r?.credexOpportunity).toBe(true);
});

test("does not recommend credits for low API spend", () => {
  const input: AuditInput = {
    tools: [{ toolId: "anthropic_api", plan: "Pay-as-you-go", monthlySpend: 50, seats: 1 }],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "anthropic_api");
  expect(r?.recommendedAction).toBe("optimal");
  expect(r?.monthlySavings).toBe(0);
});

test("calculates totalMonthlySavings correctly", () => {
  const input: AuditInput = {
    tools: [
      { toolId: "cursor", plan: "Business", monthlySpend: 120, seats: 3 },
      { toolId: "github_copilot", plan: "Business", monthlySpend: 38, seats: 2 },
    ],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(input);
  expect(result.totalMonthlySavings).toBeGreaterThan(0);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  expect(result.totalMonthlySpend).toBe(158);
});

test("detects Cursor + Windsurf redundancy", () => {
  const input: AuditInput = {
    tools: [
      { toolId: "cursor", plan: "Pro", monthlySpend: 40, seats: 2 },
      { toolId: "windsurf", plan: "Pro", monthlySpend: 30, seats: 2 },
    ],
    teamSize: 2,
    useCase: "coding",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "windsurf");
  expect(r?.recommendedAction).toBe("switch");
  expect(r?.monthlySavings).toBe(30);
});

test("recommends Claude Enterprise downgrade for small team", () => {
  const input: AuditInput = {
    tools: [{ toolId: "claude", plan: "Enterprise", monthlySpend: 600, seats: 10 }],
    teamSize: 10,
    useCase: "writing",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "claude");
  expect(r?.recommendedAction).toBe("downgrade");
  expect(r?.monthlySavings).toBeGreaterThan(0);
});

test("returns audit result with valid id and createdAt", () => {
  const input: AuditInput = {
    tools: [{ toolId: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 }],
    teamSize: 1,
    useCase: "coding",
  };
  const result = runAudit(input);
  expect(result.id).toBeTruthy();
  expect(new Date(result.createdAt).getTime()).not.toBeNaN();
});

test("recommends switching away from Windsurf for non-coding team", () => {
  const input: AuditInput = {
    tools: [{ toolId: "windsurf", plan: "Pro", monthlySpend: 30, seats: 2 }],
    teamSize: 2,
    useCase: "writing",
  };
  const result = runAudit(input);
  const r = result.results.find((r) => r.toolId === "windsurf");
  expect(r?.recommendedAction).toBe("switch");
  expect(r?.monthlySavings).toBe(30);
});