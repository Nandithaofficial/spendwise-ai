export type ToolId =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolEntry {
  toolId: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

export interface PlanPrice {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
  maxSeats?: number;
  capabilities: string[];
}

export interface ToolPricing {
  toolId: ToolId;
  displayName: string;
  plans: PlanPrice[];
  bestFor: UseCase[];
}

export type RecommendationType =
  | "downgrade"
  | "switch"
  | "credits"
  | "optimal"
  | "consolidate";

export interface ToolAuditResult {
  toolId: ToolId;
  displayName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: RecommendationType;
  recommendedPlan?: string;
  recommendedTool?: string;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  credexOpportunity: boolean;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  results: ToolAuditResult[];
  totalMonthlySpend: number;
  totalProjectedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  isOptimal: boolean;
}

export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  monthlySavings: number;
}

export interface StoredAudit {
  id: string;
  auditResult: AuditResult;
  leadEmail?: string;
  createdAt: string;
}