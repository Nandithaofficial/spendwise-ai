# ARCHITECTURE.md

## System Diagram

```mermaid
graph TD
    A[User: Browser] -->|Fills spend form| B[Next.js Frontend\napp/page.tsx]
    B -->|POST /api/audit| C[Audit API Route\napp/api/audit/route.ts]
    C -->|Runs rules engine| D[auditEngine.ts\nHardcoded rule logic]
    D -->|Returns AuditResult| C
    C -->|POST to Anthropic| E[Anthropic API\nclaude-sonnet-4]
    E -->|~100-word summary| C
    C -->|Saves audit + returns ID| F[lib/store.ts\nIn-memory store]
    C -->|Returns result + auditId| B
    B -->|Renders results| G[AuditResults Component]
    G -->|User submits email| H[POST /api/leads]
    H -->|Saves lead| F
    H -->|Sends confirmation| I[Resend API\nTransactional email]
    G -->|Share link| J[/audit/id\nPublic shareable page]
    J -->|Reads from store| F
```

---

## Data Flow: Input → Audit Result

1. **User fills the form** — selects tools (Cursor, Claude, ChatGPT, etc.), plan tier, monthly spend, number of seats, team size, and primary use case.

2. **POST /api/audit** receives the form payload. The request is validated with Zod.

3. **auditEngine.ts** runs per-tool rule evaluation:
   - Is the user on the right plan for their seat count? (e.g., ChatGPT Team for 1 user is wasteful)
   - Is there a cheaper plan from the same vendor that covers their use case?
   - Is there a substantially cheaper alternative tool for their primary use case?
   - Are they paying retail when Credex credits could apply?
   - Each evaluation produces: `currentSpend`, `recommendedAction`, `potentialSaving`, `reason`.

4. **Anthropic API** is called with the structured audit data to generate a ~100-word personalised summary. If the API call fails (timeout, 429, network error), a templated fallback summary is returned instead — the audit result is never blocked by AI availability.

5. **lib/store.ts** saves the `AuditResult` keyed by a generated `auditId` (UUID). The audit is stored with `email: null` initially.

6. **The result and `auditId` are returned** to the frontend. Results render instantly on-screen.

7. **Email capture** (optional): user submits email via POST /api/leads. The lead is validated (Zod schema + honeypot check), the audit record is updated with the email, and a confirmation email is sent via Resend. High-savings leads (>$500/mo) receive a Credex consultation prompt.

8. **Shareable URL** (`/audit/[id]`): reads the audit from the store, strips identifying details (email, company name), and renders the public version with full Open Graph tags.

---

## Stack Choices

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack in one repo — API routes and frontend colocated. File-based routing simplifies the `/audit/[id]` shareable URL pattern. SSR for OG meta tags on share pages. |
| Language | TypeScript | End-to-end type safety between form inputs, audit engine, and API contracts. Catches plan/tool mismatch bugs at compile time. |
| Styling | Tailwind CSS | Utility-first is fast for iterating on a design-heavy results page. No context-switching between files. |
| AI | Anthropic API (claude-sonnet-4) | Assignment requirement. Claude's instruction-following produces consistent JSON-structured summaries, making fallback logic simpler. |
| Email | Resend | Generous free tier (3,000 emails/month), excellent Next.js DX, reliable deliverability. |
| Storage | In-memory (lib/store.ts) | Zero infra for MVP. Fast to ship. Sufficient for a 7-day build where data persistence across restarts isn't a hard requirement. |
| Deployment | Vercel | Zero-config for Next.js. Edge network for performance. Free tier sufficient for this submission. |
| Validation | Zod | Runtime type safety on API inputs. Pairs cleanly with TypeScript types. |

---

## Scaling to 10,000 Audits/Day

The current in-memory store is the single biggest bottleneck. Here is what would change:

1. **Replace `lib/store.ts` with Supabase (Postgres).** Two tables: `audits` and `leads`. The `auditId` becomes a UUID primary key. This is a single-file change — the rest of the codebase uses the store interface.

2. **Add a Redis layer (Upstash) for rate limiting.** Current honeypot is sufficient for low traffic. At 10k audits/day, a sliding-window rate limiter on `/api/audit` by IP is necessary.

3. **Move Anthropic API calls to a background job.** At scale, waiting for the LLM in the request cycle adds latency and ties up serverless function time. Queue the summary generation (e.g., with Inngest or Trigger.dev), return the audit immediately, and patch in the summary when ready.

4. **Add a CDN-cached layer for `/audit/[id]` pages.** These are read-heavy and rarely change after creation. Vercel's edge caching with `revalidate` makes them near-instant at scale.

5. **Instrument with PostHog or Mixpanel** to track the funnel: form start → audit completed → email captured → consultation booked. At 10k/day, conversion data becomes the most valuable asset.