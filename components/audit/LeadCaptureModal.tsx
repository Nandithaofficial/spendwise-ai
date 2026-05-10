"use client";

import { useState } from "react";

interface Props {
  auditId: string;
  isOptimal: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadCaptureModal({ auditId, isOptimal, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, email, companyName: company || undefined, role: role || undefined, website }),
      });
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,7,18,0.85)", backdropFilter: "blur(6px)" }}>
      <div className="glass rounded-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-xl leading-none">×</button>
        <h2 className="font-semibold text-white text-xl mb-1">{isOptimal ? "Stay in the loop" : "Get your full report"}</h2>
        <p className="text-slate-400 text-sm mb-6">{isOptimal ? "We'll notify you when new optimisations apply to your stack." : "We'll email you the full breakdown and flag Credex savings."}</p>
        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Work Email <span className="text-red-400">*</span></label>
            <input type="email" className="input-field" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Company Name <span className="text-slate-600">(optional)</span></label>
            <input type="text" className="input-field" placeholder="Acme Inc." value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Your Role <span className="text-slate-600">(optional)</span></label>
            <input type="text" className="input-field" placeholder="Eng Manager, CTO, Founder…" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className="w-full mt-5 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: loading ? "#1e293b" : "linear-gradient(135deg, #16a34a, #22c55e)", color: loading ? "#64748b" : "#000" }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Sending…
            </span>
          ) : "Send Report →"}
        </button>
        <p className="text-center text-xs text-slate-600 mt-3">No spam. Unsubscribe any time.</p>
      </div>
    </div>
  );
}