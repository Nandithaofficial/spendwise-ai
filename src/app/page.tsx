"use client";

import { useState } from "react";
import AuditForm from "@/components/form/AuditForm";
import AuditResults from "@/components/audit/AuditResults";
import type { AuditResult } from "@/types";

export default function Home() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen grid-bg relative">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {!auditResult ? (
          <>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 badge badge-green mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Free · No login required
              </div>
              <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mb-6" style={{ fontWeight: 800 }}>
                Stop overpaying
                <br />
                <span className="text-green-400 text-glow">for AI tools.</span>
              </h1>
              <p className="text-slate-400 text-xl max-w-xl mx-auto leading-relaxed">
                Input your AI subscriptions. Get an instant audit showing exactly where you're overspending and what to do about it.
              </p>
              <div className="flex items-center justify-center gap-8 mt-10 text-sm text-slate-500">
                <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Instant results</div>
                <div className="flex items-center gap-2"><span className="text-green-400">✓</span> No signup needed</div>
                <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Shareable report</div>
              </div>
            </div>
            <AuditForm onResult={(result) => setAuditResult(result)} setIsLoading={setIsLoading} isLoading={isLoading} />
          </>
        ) : (
          <AuditResults result={auditResult} onReset={() => setAuditResult(null)} />
        )}
      </div>
      <footer className="relative z-10 border-t border-white/5 mt-24 py-8">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-sm text-slate-600">
          <span className="font-display font-600">SpendWise AI</span>
          <span>Powered by <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-400 transition-colors">Credex</a> — discounted AI credits</span>
        </div>
      </footer>
    </div>
  );
}