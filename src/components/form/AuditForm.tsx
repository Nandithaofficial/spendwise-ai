"use client";

import { useState, useEffect } from "react";
import type { AuditInput, AuditResult, ToolEntry, ToolId, UseCase } from "@/types";

const TOOLS: { id: ToolId; label: string; plans: string[] }[] = [
  { id: "cursor", label: "Cursor", plans: ["Hobby", "Pro", "Business", "Enterprise"] },
  { id: "github_copilot", label: "GitHub Copilot", plans: ["Individual", "Business", "Enterprise"] },
  { id: "claude", label: "Claude (Anthropic)", plans: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"] },
  { id: "chatgpt", label: "ChatGPT (OpenAI)", plans: ["Free", "Plus", "Team", "Enterprise", "API direct"] },
  { id: "anthropic_api", label: "Anthropic API", plans: ["Pay-as-you-go"] },
  { id: "openai_api", label: "OpenAI API", plans: ["Pay-as-you-go"] },
  { id: "gemini", label: "Google Gemini", plans: ["Free", "Advanced", "Business", "Enterprise"] },
  { id: "windsurf", label: "Windsurf", plans: ["Free", "Pro", "Teams"] },
];

const USE_CASES: { id: UseCase; label: string; emoji: string }[] = [
  { id: "coding", label: "Coding", emoji: "💻" },
  { id: "writing", label: "Writing", emoji: "✍️" },
  { id: "data", label: "Data / Analysis", emoji: "📊" },
  { id: "research", label: "Research", emoji: "🔬" },
  { id: "mixed", label: "Mixed", emoji: "🔀" },
];

const STORAGE_KEY = "spendwise_form_state";

interface FormState {
  tools: (ToolEntry & { enabled: boolean })[];
  teamSize: number;
  useCase: UseCase;
}

const defaultTools = TOOLS.map((t) => ({
  toolId: t.id,
  plan: t.plans[0],
  monthlySpend: 0,
  seats: 1,
  enabled: false,
}));

function loadState(): FormState {
  if (typeof window === "undefined") return { tools: defaultTools, teamSize: 5, useCase: "mixed" };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { tools: defaultTools, teamSize: 5, useCase: "mixed" };
}

interface Props {
  onResult: (result: AuditResult) => void;
  setIsLoading: (v: boolean) => void;
  isLoading: boolean;
}

export default function AuditForm({ onResult, setIsLoading, isLoading }: Props) {
  const [formState, setFormState] = useState<FormState>(() => loadState());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(formState)); } catch {}
  }, [formState]);

  const updateTool = (toolId: ToolId, field: keyof ToolEntry | "enabled", value: string | number | boolean) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.map((t) => t.toolId === toolId ? { ...t, [field]: value } : t),
    }));
  };

  const handleSubmit = async () => {
    const enabledTools = formState.tools.filter((t) => t.enabled && t.monthlySpend > 0);
    if (enabledTools.length === 0) {
      setError("Add at least one tool with a spend greater than $0.");
      return;
    }
    setError(null);
    setIsLoading(true);
    const input: AuditInput = {
      tools: enabledTools.map(({ enabled: _e, ...rest }) => rest),
      teamSize: formState.teamSize,
      useCase: formState.useCase,
    };
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      const result: AuditResult = await res.json();
      onResult(result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const enabledCount = formState.tools.filter((t) => t.enabled).length;
  const totalSpend = formState.tools.filter((t) => t.enabled).reduce((sum, t) => sum + t.monthlySpend, 0);

  return (
    <div className="glass rounded-2xl p-6 md:p-8 space-y-8">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Primary Use Case
        </label>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc) => (
            <button
              key={uc.id}
              onClick={() => setFormState((p) => ({ ...p, useCase: uc.id }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                formState.useCase === uc.id
                  ? "bg-green-500/10 border-green-500/40 text-green-400"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              <span>{uc.emoji}</span>{uc.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Team Size — <span className="text-white">{formState.teamSize} people</span>
        </label>
        <input
          type="range" min={1} max={200} value={formState.teamSize}
          onChange={(e) => setFormState((p) => ({ ...p, teamSize: Number(e.target.value) }))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #22c55e ${(formState.teamSize / 200) * 100}%, #1e293b ${(formState.teamSize / 200) * 100}%)` }}
        />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>Solo</span><span>200+</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          AI Tools You Pay For
        </label>
        <div className="space-y-3">
          {TOOLS.map((tool) => {
            const entry = formState.tools.find((t) => t.toolId === tool.id)!;
            return (
              <div
                key={tool.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  entry.enabled ? "border-green-500/20 bg-green-500/[0.04]" : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer"
                  onClick={() => updateTool(tool.id, "enabled", !entry.enabled)}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${entry.enabled ? "bg-green-500 border-green-500" : "border-slate-600"}`}>
                    {entry.enabled && (
                      <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${entry.enabled ? "text-white" : "text-slate-400"}`}>
                    {tool.label}
                  </span>
                </div>
                {entry.enabled && (
                  <div className="px-4 pb-4 grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Plan</label>
                      <select
                        className="input-field text-sm"
                        value={entry.plan}
                        onChange={(e) => updateTool(tool.id, "plan", e.target.value)}
                      >
                        {tool.plans.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Monthly Spend ($)</label>
                      <input
                        type="number" min={0} className="input-field text-sm" placeholder="0"
                        value={entry.monthlySpend || ""}
                        onChange={(e) => updateTool(tool.id, "monthlySpend", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Seats</label>
                      <input
                        type="number" min={1} className="input-field text-sm" placeholder="1"
                        value={entry.seats || ""}
                        onChange={(e) => updateTool(tool.id, "seats", Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-6">
        {enabledCount > 0 && (
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-slate-500">{enabledCount} tool{enabledCount !== 1 ? "s" : ""} selected</span>
            <span className="text-slate-300 font-mono">${totalSpend.toFixed(2)}<span className="text-slate-600">/mo</span></span>
          </div>
        )}
        {error && (
          <p className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{error}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-4 rounded-xl font-semibold text-base transition-all"
          style={{ background: isLoading ? "#1e293b" : "linear-gradient(135deg, #16a34a, #22c55e)", color: isLoading ? "#64748b" : "#000" }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Auditing your stack…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">Run Free Audit →</span>
          )}
        </button>
        <p className="text-center text-xs text-slate-600 mt-3">Results shown instantly. Email optional — always.</p>
      </div>
    </div>
  );
}