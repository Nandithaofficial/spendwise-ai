"use client";

import { useState } from "react";
import type { AuditResult, ToolAuditResult } from "@/types";
import LeadCaptureModal from "./LeadCaptureModal";

interface Props {
  result: AuditResult;
  onReset?: () => void;
  readOnly?: boolean;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  downgrade: { label: "Downgrade Plan", color: "badge-amber" },
  switch: { label: "Switch Tool", color: "badge-red" },
  credits: { label: "Buy Credits", color: "badge-green" },
  optimal: { label: "Already Optimal", color: "badge-green" },
  consolidate: { label: "Consolidate", color: "badge-amber" },
};

function ToolCard({ r }: { r: ToolAuditResult }) {
  const actionMeta = ACTION_LABELS[r.recommendedAction] ?? ACTION_LABELS.optimal;
  const hasSavings = r.monthlySavings > 0;

  return (
    <div className={`rounded-xl border p-5 transition-all ${hasSavings ? "border-amber-500/20 bg-amber-500/[0.03]" : "border-white/5 bg-white/[0.02]"}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-white text-sm">{r.displayName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{r.currentPlan} · ${r.currentSpend}/mo</p>
        </div>
        <span className={`badge ${actionMeta.color} flex-shrink-0`}>{actionMeta.label}</span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed mb-3">{r.reasoning}</p>
      {hasSavings && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                style={{ width: `${Math.max(0, Math.min(100, (r.projectedSpend / r.currentSpend) * 100))}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1.5">${r.currentSpend}/mo → ${r.projectedSpend}/mo</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-green-400 font-mono font-semibold text-lg">−${r.monthlySavings.toFixed(0)}</p>
            <p className="text-xs text-slate-600">per month</p>
          </div>
        </div>
      )}
      {r.credexOpportunity && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-green-500">
          ⚡ Credex can get you this tool at a discount — ask us how
        </div>
      )}
    </div>
  );
}

export default function AuditResults({ result, onReset, readOnly }: Props) {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${result.id}` : `/share/${result.id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-count">
      <div
        className="rounded-2xl border border-green-500/20 p-8 text-center relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%), rgba(15,23,42,0.8)" }}
      >
        {result.isOptimal ? (
          <>
            <div className="inline-flex items-center gap-2 badge badge-green mb-4">✓ Already Optimal</div>
            <h2 className="font-semibold text-4xl text-white mb-2">You&apos;re spending well.</h2>
            <p className="text-slate-400 max-w-md mx-auto">Your AI stack is well-matched to your team&apos;s size and use case.</p>
          </>
        ) : (
          <>
            <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Potential Savings Identified</p>
            <div className="flex items-end justify-center gap-6 mb-2">
              <div>
                <p className="text-green-400 text-glow font-semibold text-6xl md:text-7xl">
                  ${Math.round(result.totalMonthlySavings).toLocaleString()}
                </p>
                <p className="text-slate-500 text-sm mt-1">per month</p>
              </div>
              <div className="pb-3 text-slate-600 text-2xl">·</div>
              <div>
                <p className="text-white font-semibold text-3xl">${Math.round(result.totalAnnualSavings).toLocaleString()}</p>
                <p className="text-slate-500 text-sm mt-1">per year</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mt-4">
              <span>Current: ${result.totalMonthlySpend.toFixed(0)}/mo</span>
              <span className="text-green-500">→</span>
              <span>Optimised: ${result.totalProjectedSpend.toFixed(0)}/mo</span>
            </div>
          </>
        )}
        {result.aiSummary && (
          <div className="mt-6 pt-6 border-t border-white/5 text-sm text-slate-400 leading-relaxed max-w-xl mx-auto italic">
            &quot;{result.aiSummary}&quot;
          </div>
        )}
      </div>

      {result.totalMonthlySavings > 500 && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/[0.06] p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 text-xl">⚡</div>
          <div className="flex-1">
            <p className="font-semibold text-white mb-1">$500+/mo savings? Credex can help you capture it.</p>
            <p className="text-sm text-slate-400 mb-3">Credex sells discounted AI infrastructure credits — Cursor, Claude, ChatGPT Enterprise and more — sourced from companies that overforecast.</p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition-colors">
              Book a Credex Consultation →
            </a>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-white text-lg mb-4">Tool-by-Tool Breakdown</h2>
        <div className="space-y-3">
          {result.results.map((r) => <ToolCard key={r.toolId} r={r} />)}
        </div>
      </div>

      {!readOnly && !leadCaptured && (
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6 text-center">
          <p className="font-semibold text-white mb-1">
            {result.isOptimal ? "Get notified when optimisations apply" : "Get this report in your inbox"}
          </p>
          <p className="text-sm text-slate-500 mb-4">
            {result.isOptimal ? "We'll reach out when prices change or cheaper alternatives emerge." : "Full breakdown + savings summary sent to your email."}
          </p>
          <button onClick={() => setShowLeadModal(true)}
            className="px-6 py-2.5 rounded-lg border border-green-500/30 text-green-400 text-sm font-semibold hover:bg-green-500/10 transition-all">
            {result.isOptimal ? "Notify me" : "Email me this report"}
          </button>
        </div>
      )}

      {leadCaptured && (
        <div className="badge badge-green py-2 px-4 text-sm w-fit mx-auto block text-center">✓ Report sent to your inbox</div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm hover:border-green-500/30 hover:text-green-400 transition-all">
          {copied ? "✓ Copied!" : "Copy Share Link"}
        </button>
        {!readOnly && onReset && (
          <button onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:text-slate-200 transition-all">
            ← Run New Audit
          </button>
        )}
        {readOnly && (
          <a href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition-colors">
            Run Your Own Audit →
          </a>
        )}
      </div>

      {showLeadModal && (
        <LeadCaptureModal
          auditId={result.id}
          isOptimal={result.isOptimal}
          onClose={() => setShowLeadModal(false)}
          onSuccess={() => { setShowLeadModal(false); setLeadCaptured(true); }}
        />
      )}
    </div>
  );
}