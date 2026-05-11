# DEVLOG

## Day 1 — 2026-05-09
**Hours worked:** 5
**What I did:** Read the full brief twice. Set up Next.js 14 with TypeScript and Tailwind. Created type definitions, scaffolded project structure. Wrote pricing data for all 8 tools from official vendor pages. Built full audit engine with per-tool evaluators and overlap detection. Wrote 10 Jest tests — all pass. Built API routes with Zod validation and rate limiting. Integrated Anthropic API for AI summary with fallback template.
**What I learned:** nanoid v5 uses ESM which breaks Jest — downgraded to v3.3.7 to fix. Overlap detection works best as a post-processing step rather than inside each tool evaluator.
**Blockers / what I'm stuck on:** Jest config needed moduleNameMapper for @/ path alias. Solved by updating jest.config.js.
**Plan for tomorrow:** Build UI components, set up CI, deploy to Vercel.

---

## Day 2 — 2026-05-10
**Hours worked:** 6
**What I did:** Built AuditForm with localStorage persistence, AuditResults with savings hero and per-tool cards, LeadCaptureModal with honeypot spam protection. Fixed folder structure conflict between app/ and src/app/. Set up GitHub Actions CI — lint and tests pass. Deployed to Vercel at https://spendwise-ai-nine.vercel.app. Fixed ESLint apostrophe error. GitHub push protection blocked first push — .env.example had real API key accidentally. Fixed with git filter-branch and regenerated key immediately.
**What I learned:** SSR hydration in Next.js requires lazy state initialisation — useState(() => loadState()) ensures localStorage is read before first render, avoiding flicker.
**Blockers / what I'm stuck on:** CI lint failing due to unescaped apostrophe in page.tsx — fixed with &apos;.
**Plan for tomorrow:** Add all markdown files, improve UI, add Supabase storage.

---

## Day 3 — 2026-05-11
**Hours worked:** 3
**What I did:** Conducted 3 user interviews with students, freelancers, and a startup intern to validate assumptions around AI tool spending behavior. Asked questions about tool usage, monthly spend awareness, and trust in automated audit tools. Recorded responses and extracted key insights for product direction. Noticed a strong pattern of users not tracking subscriptions properly and relying on memory or bank notifications instead of structured tracking. Identified emotional retention of tools (“keeping just in case”) and lack of visibility in team-based subscriptions. Updated feature ideas based on findings, especially around usage tracking and team cost breakdowns.

**What I learned:** Most users don’t actively manage AI tool subscriptions — they either forget them or justify keeping tools without actual usage. Trust is a major factor; users are skeptical of any tool that analyzes their spending unless it is transparent and non-intrusive. Team users have even less visibility than individual users, which creates hidden overspending.

**Blockers / what I'm stuck on:** Difficulty in reaching enough real users quickly for interviews — had to rely on peers and indirect contacts. Some responses were vague, requiring follow-up questions to extract actionable insights.

**Plan for tomorrow:** Translate insights into product improvements (subscription tracker, usage analytics dashboard, and team visibility module). Start improving UI based on real user pain points and refine audit explanations for better clarity and trust.

---

## Day 4 — 2026-05-12
*(fill this in on that day)*

---

## Day 5 — 2026-05-13
*(fill this in on submission day)*