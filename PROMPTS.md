# PROMPTS.md

## AI-Generated Personalized Summary

### Where it's used

After the audit engine produces a structured result (per-tool breakdown, savings totals, recommendations), the Anthropic API is called to generate a ~100-word personalized paragraph summarising the user's situation. This appears at the top of the results page as the "Your AI Spend Summary" section.

---

### Final prompt (production)

```
You are a concise, financially-literate AI analyst writing a personalized spend summary for a startup founder or engineering manager.

Given the following audit data, write a 90–110 word paragraph (no headers, no bullet points, flowing prose) that:
1. Names the user's highest-cost tools and whether they're getting value
2. States the single biggest saving opportunity in plain language
3. Ends with a clear, actionable next step

Tone: direct, credible, slightly urgent. Like a CFO giving a 60-second debrief. No filler phrases like "Great news!" or "It looks like...". No markdown formatting.

Audit data:
- Team size: {{teamSize}}
- Primary use case: {{useCase}}
- Tools in use: {{toolsList}}
- Total monthly spend: ${{totalMonthlySpend}}
- Total potential monthly savings: ${{totalMonthlySavings}}
- Biggest saving opportunity: {{topRecommendation}}
- Per-tool breakdown: {{toolBreakdown}}
```

---

### Why this prompt was written this way

**"90–110 word paragraph"** — A specific word count prevents the model from writing a one-liner or a wall of text. The results page has a fixed card height for this summary; overflows break the layout.

**"No headers, no bullet points, flowing prose"** — Early versions without this instruction produced bullet lists 40% of the time. The results page renders the summary as a paragraph, so bullets appeared as raw hyphens.

**"Like a CFO giving a 60-second debrief"** — The persona instruction was the single biggest quality improvement. Without it, the model defaulted to a friendly assistant tone ("Here are some tips to save money!") which felt inconsistent with the rest of the UI's credible, data-driven aesthetic.

**"No filler phrases"** — Explicitly blocking "Great news!" and "It looks like..." eliminated the most common AI-sounding artifacts. These phrases appeared in ~60% of outputs before this instruction was added.

**Structured data injection** — The audit data is passed as labelled key-value pairs rather than a JSON blob. Early tests with raw JSON produced outputs that quoted field names ("your tool_monthly_spend is..."). Labelled natural-language pairs produced more fluent prose.

---

### What was tried that didn't work

**Version 1 — Too open-ended:**
```
Summarise this AI spend audit in 100 words: {{auditJSON}}
```
Result: Model wrote generic advice ("Consider switching to cheaper tools") with no specific numbers. Useless.

**Version 2 — Too prescriptive:**
```
Write exactly 3 sentences. Sentence 1: current spend. Sentence 2: top saving. Sentence 3: action.
```
Result: Outputs felt robotic and formulaic. Every summary read the same. Lost the "personalized" quality.

**Version 3 — Missing tone instruction:**
```
Write a personalized 100-word audit summary for a startup founder based on: {{data}}
```
Result: Friendly but unserious tone. Phrases like "Exciting savings ahead!" appeared frequently.

**Version 4 — Final (above):** Adding the CFO persona + explicit anti-patterns produced the best balance of specificity, credibility, and natural language.

---

### Fallback behaviour

If the Anthropic API call fails (network error, 429 rate limit, timeout >8 seconds), the audit result is never blocked. A templated fallback summary is generated client-side:

```
Your team of {{teamSize}} is spending ${{totalMonthlySpend}}/month across {{toolCount}} AI tools.
Our analysis found ${{totalMonthlySavings}}/month in potential savings — ${{totalAnnualSavings}} annually.
Your biggest opportunity: {{topRecommendation}}. Review the breakdown below and consider acting on the highest-impact change first.
```

This ensures the core value (the audit math) is always delivered regardless of AI availability.