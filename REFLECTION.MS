# REFLECTION

##1. The hardest bug I hit this week, and how I debugged it

The hardest bug I faced was related to audit persistence and shareable report generation. Initially, the generated report URLs worked locally but failed inconsistently on the deployed Vercel environment. Some reports returned empty audit data even though the frontend displayed the correct result before navigation.

My first hypothesis was that localStorage hydration timing was causing stale state during route transitions. I added console logs around the state lifecycle and confirmed that the audit data existed before navigation. Then I suspected serialization issues because some nested fields in the audit object were undefined during JSON conversion.

I tested by simplifying the payload and discovered the failure happened only when optional recommendation fields were missing. The backend save endpoint expected a strict structure, while the frontend sometimes omitted unused fields.

To debug further, I inspected the request payloads directly in the browser network tab and compared successful versus failed requests. I then added schema validation and fallback defaults before saving reports. I also introduced defensive parsing on the backend to avoid crashing on partially missing data.

The final fix was normalizing the audit payload before persistence and ensuring every generated report followed the same schema. After deploying the patch, shareable URLs became stable across refreshes and deployments.

This bug taught me the importance of treating frontend-generated data as unreliable input, even when both frontend and backend are written by me.

---

## 2. A decision I reversed mid-week, and what made me reverse it

One major decision I reversed was trying to make the audit engine AI-driven instead of rule-driven.

At the beginning of the project, I experimented with generating savings recommendations directly using Claude prompts. The output sounded convincing, but the recommendations were inconsistent and sometimes financially incorrect. For example, the AI occasionally recommended switching to plans that were not actually cheaper when team sizes increased.

After testing several prompts, I realized the assignment specifically valued defensible reasoning and reliable calculations. Financial recommendations need deterministic logic, not probabilistic text generation.

I decided to rebuild the audit engine using hardcoded pricing rules and usage heuristics. AI was then limited only to generating the personalized narrative summary. This made the results more trustworthy, easier to test, and significantly easier to debug.

Reversing that decision improved both the product quality and my confidence in the system. It also reinforced an important engineering lesson: AI should support the experience, not replace core business logic that requires precision.

---

## 3. What I would build in week 2 if I had it

If I had another week, I would focus on turning the project from a useful calculator into a true benchmarking platform.

The first addition would be benchmark mode. Users would see how their AI spend compares with similar startups by team size and use case. This would make the audit more persuasive because users respond strongly to peer comparison.

Second, I would improve the viral sharing loop. I would add visually polished report cards optimized for X and LinkedIn sharing, including generated charts and spend breakdown visuals.

Third, I would add PDF exports for finance teams. Many startups discuss tooling costs internally, and downloadable reports would increase the chance of reports being forwarded inside companies.

I would also improve analytics instrumentation. Right now the product captures leads, but I would add funnel tracking for audit completion, email conversion, and consultation intent.

Finally, I would expand the recommendation engine with more nuanced logic for API-heavy companies versus seat-based teams. Different startup profiles overspend in different ways, and personalized recommendations would improve trust significantly.

---

## 4. How I used AI tools

I used multiple AI tools throughout the project, mainly ChatGPT, Claude, and Cursor.

Cursor helped me move faster while building repetitive UI sections and refactoring TypeScript components. ChatGPT was useful for brainstorming architecture decisions, debugging ideas, and improving copywriting. Claude helped generate and refine the personalized audit summaries because its writing quality felt more natural for user-facing explanations.

However, I intentionally did not trust AI for pricing logic or financial calculations. I manually verified all pricing data against official vendor pricing pages and wrote the audit rules myself because accuracy mattered more than speed.

One specific case where AI was wrong was during recommendation generation. Claude suggested that ChatGPT Team was always more cost-effective than ChatGPT Plus for small teams, which was incorrect for certain seat counts. I caught this by manually calculating monthly totals and testing multiple team-size scenarios.

That moment reinforced the importance of verification. AI accelerated development, but every critical business rule still needed human validation and reasoning.

---

## 5. Self-rating

### Discipline — 8/10
I consistently worked across multiple days, documented progress in the devlog, and kept shipping even when features became more complex than expected.

### Code quality — 7.5/10
The codebase is modular, typed, and readable, though with more time I would improve abstraction consistency and add stronger backend validation.

### Design sense — 8/10
I focused heavily on making the audit results visually clear and shareable rather than building a generic dashboard UI.

### Problem-solving — 8.5/10
I debugged several deployment and state-management issues independently and adapted quickly when initial architectural decisions failed.

### Entrepreneurial thinking — 8/10
I treated the project like a real acquisition funnel instead of only a coding assignment, especially around lead capture, trust, and viral sharing.