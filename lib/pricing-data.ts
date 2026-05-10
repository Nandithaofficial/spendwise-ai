import type { ToolPricing } from "@/types";

export const TOOL_PRICING: ToolPricing[] = [
  {
    toolId: "cursor",
    displayName: "Cursor",
    bestFor: ["coding"],
    plans: [
      { name: "Hobby", pricePerSeat: 0, capabilities: ["2000 completions/mo", "50 slow premium requests"] },
      { name: "Pro", pricePerSeat: 20, capabilities: ["Unlimited completions", "500 fast premium requests/mo"] },
      { name: "Business", pricePerSeat: 40, capabilities: ["Everything Pro", "SSO", "centralized billing"] },
      { name: "Enterprise", pricePerSeat: 60, capabilities: ["Custom contracts", "SLA", "dedicated support"] },
    ],
  },
  {
    toolId: "github_copilot",
    displayName: "GitHub Copilot",
    bestFor: ["coding"],
    plans: [
      { name: "Individual", pricePerSeat: 10, capabilities: ["Code completions", "Chat in IDE", "CLI"] },
      { name: "Business", pricePerSeat: 19, capabilities: ["Everything Individual", "org-wide policy", "audit logs"] },
      { name: "Enterprise", pricePerSeat: 39, capabilities: ["Everything Business", "Copilot Workspace"] },
    ],
  },
  {
    toolId: "claude",
    displayName: "Claude (Anthropic)",
    bestFor: ["writing", "research", "coding", "mixed"],
    plans: [
      { name: "Free", pricePerSeat: 0, capabilities: ["Limited Claude 3.5 Sonnet"] },
      { name: "Pro", pricePerSeat: 20, capabilities: ["5x more usage", "Claude 3.5 Sonnet/Opus", "Projects"] },
      { name: "Max", pricePerSeat: 100, capabilities: ["20x more usage than Pro", "Priority access"] },
      { name: "Team", pricePerSeat: 30, capabilities: ["Pro features", "shared Projects", "admin controls"], minSeats: 5 },
      { name: "Enterprise", pricePerSeat: 60, capabilities: ["Custom context window", "SSO/SAML", "SLA"], minSeats: 40 },
    ],
  },
  {
    toolId: "chatgpt",
    displayName: "ChatGPT (OpenAI)",
    bestFor: ["writing", "research", "mixed"],
    plans: [
      { name: "Free", pricePerSeat: 0, capabilities: ["GPT-4o mini", "limited GPT-4o"] },
      { name: "Plus", pricePerSeat: 20, capabilities: ["GPT-4o", "o1", "DALL·E 3"] },
      { name: "Team", pricePerSeat: 30, capabilities: ["Everything Plus", "shared workspace"], minSeats: 2 },
      { name: "Enterprise", pricePerSeat: 60, capabilities: ["Custom context", "SSO", "audit logs"], minSeats: 150 },
    ],
  },
  {
    toolId: "anthropic_api",
    displayName: "Anthropic API",
    bestFor: ["coding", "data", "research", "mixed"],
    plans: [
      { name: "Pay-as-you-go", pricePerSeat: 0, capabilities: ["Claude 3.5 Sonnet: $3/MTok in", "Claude 3 Haiku: $0.25/MTok in"] },
    ],
  },
  {
    toolId: "openai_api",
    displayName: "OpenAI API",
    bestFor: ["coding", "data", "research", "mixed"],
    plans: [
      { name: "Pay-as-you-go", pricePerSeat: 0, capabilities: ["GPT-4o: $2.50/MTok in", "GPT-4o mini: $0.15/MTok in"] },
    ],
  },
  {
    toolId: "gemini",
    displayName: "Google Gemini",
    bestFor: ["writing", "research", "mixed", "coding"],
    plans: [
      { name: "Free", pricePerSeat: 0, capabilities: ["Gemini 1.5 Flash limited"] },
      { name: "Advanced", pricePerSeat: 19.99, capabilities: ["Gemini Ultra 1.0", "2TB Drive"] },
      { name: "Business", pricePerSeat: 24, capabilities: ["Gemini for Workspace", "admin controls"] },
      { name: "Enterprise", pricePerSeat: 30, capabilities: ["Advanced security", "compliance"] },
    ],
  },
  {
    toolId: "windsurf",
    displayName: "Windsurf (Codeium)",
    bestFor: ["coding"],
    plans: [
      { name: "Free", pricePerSeat: 0, capabilities: ["Unlimited completions", "10 Flow credits/mo"] },
      { name: "Pro", pricePerSeat: 15, capabilities: ["500 credits/mo", "GPT-4o/Claude access"] },
      { name: "Teams", pricePerSeat: 35, capabilities: ["Everything Pro", "team management", "SSO"], minSeats: 2 },
    ],
  },
];

export const TOOL_MAP = new Map(TOOL_PRICING.map((t) => [t.toolId, t]));