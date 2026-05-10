import type { AuditResult, StoredAudit } from "@/types";

const memoryStore = new Map<string, StoredAudit>();

export async function saveAudit(auditResult: AuditResult, leadEmail?: string): Promise<string> {
  const stored: StoredAudit = { id: auditResult.id, auditResult, leadEmail, createdAt: auditResult.createdAt };
  memoryStore.set(auditResult.id, stored);
  return auditResult.id;
}

export async function getAudit(id: string): Promise<StoredAudit | null> {
  return memoryStore.get(id) ?? null;
}

export async function saveLead(params: {
  auditId: string; email: string; companyName?: string; role?: string; teamSize?: number; monthlySavings: number;
}): Promise<void> {
  console.log("Lead saved:", params);
}