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
*(fill this in tomorrow when you work)*

---

## Day 4 — 2026-05-12
*(fill this in on that day)*

---

## Day 5 — 2026-05-13
*(fill this in on submission day)*