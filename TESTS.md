# TESTS

## Test Setup

Framework: Jest

Run all tests:

```bash
npm run test
```

---

# Automated Tests

## 1. src/__tests__/audit-engine.test.ts

### Covers:
- Cursor downgrade recommendations
- Copilot pricing optimization
- Claude Enterprise downgrade logic
- Anthropic API credit recommendations
- Monthly savings calculations
- Multi-tool aggregation logic
- Redundant tool detection
- Audit result validation
- Windsurf recommendation logic
- Zero-savings edge cases

### Purpose:
Ensures the audit engine produces financially accurate recommendations and valid audit outputs across multiple AI tooling scenarios.

---

# Current Test Results

```bash
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

---

# CI Validation

All tests are configured to run through:

- Jest
- TypeScript
- ESLint

Run locally:

```bash
npm run test
```

CI workflow file:

```bash
.github/workflows/ci.yml
```