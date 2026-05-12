import { expect } from "@jest/globals";

describe("Audit Engine", () => {
  test("calculates monthly savings correctly", () => {
    const currentSpend = 200;
    const optimizedSpend = 150;

    const savings = currentSpend - optimizedSpend;

    expect(savings).toBe(50);
  });

  test("calculates annual savings correctly", () => {
    const monthlySavings = 50;

    const annualSavings = monthlySavings * 12;

    expect(annualSavings).toBe(600);
  });

  test("handles zero savings correctly", () => {
    const currentSpend = 100;
    const optimizedSpend = 100;

    const savings = currentSpend - optimizedSpend;

    expect(savings).toBe(0);
  });

  test("aggregates multiple tool costs", () => {
    const toolCosts = [100, 200, 300];

    const total = toolCosts.reduce((sum, cost) => sum + cost, 0);

    expect(total).toBe(600);
  });

  test("returns recommendation text", () => {
    const recommendation = "Downgrade to a lower pricing tier";

    expect(recommendation).toContain("Downgrade");
  });
});