"use client";

import { useEffect, useState } from "react";
import AuditResults from "@/components/audit/AuditResults";
import type { AuditResult } from "@/types";

export default function SharePage({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/audit/${params.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setResult)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading audit…</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Audit not found or expired.</p>
          <a href="/" className="text-green-400 text-sm mt-4 block hover:underline">
            Run your own audit →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg relative">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 badge badge-green mb-4">
            Shared Audit Report
          </div>
          <p className="text-slate-500 text-sm">
            Generated with{" "}
            <a href="/" className="text-green-500 hover:underline">SpendWise AI</a>
            {" "}— run your own free audit
          </p>
        </div>
        <AuditResults result={result} readOnly />
      </div>
    </div>
  );
}