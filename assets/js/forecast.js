/* ==========================================================================
   VITALS FORECAST · the math (pure functions, no DOM)
   Used by forecast-app.js in the browser and by tests/forecast.test.mjs.
   Every function returns null when an input it needs is missing, so the
   page can show what it can (break-even, "what has to be true") and say
   what is waiting on benchmarks.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Forecast = factory();
})(typeof self !== "undefined" ? self : globalThis, function () {
  "use strict";

  const SCENARIOS = ["conservative", "expected", "strong"];
  const GOALS = ["sales", "leads", "bookings", "installs", "visits"];

  /** A usable positive number, or null. */
  const pos = v => (typeof v === "number" && isFinite(v) && v > 0 ? v : null);
  /** A usable number (zero allowed), or null. */
  const num = v => (typeof v === "number" && isFinite(v) ? v : null);

  /** cost_per_result = CPM / (1000 × CTR × CVR), or a direct cost-per-result benchmark when given. */
  function costPerResult({ cpm, ctr, cvr, cpr } = {}) {
    if (pos(cpr)) return cpr;
    if (pos(cpm) && pos(ctr) && pos(cvr)) return cpm / (1000 * ctr * cvr);
    return null;
  }

  /** results = budget / cost_per_result */
  function results(budget, cpr) {
    return pos(budget) && pos(cpr) ? budget / cpr : null;
  }

  /** Value of one result: the order value for sales-like goals, close_rate × deal_value for leads. */
  function valuePerResult({ goal, aov, closeRate, dealValue } = {}) {
    if (goal === "leads") return pos(closeRate) && pos(dealValue) ? closeRate * dealValue : null;
    return pos(aov);
  }

  /** revenue (sales) = results × AOV · revenue (leads) = results × close_rate × deal_value */
  function revenue(res, input) {
    const v = valuePerResult(input);
    return num(res) !== null && v !== null ? res * v : null;
  }

  /** ROAS = revenue / budget */
  function roas(rev, budget) {
    return num(rev) !== null && pos(budget) ? rev / budget : null;
  }

  /** profit = revenue × gross_margin − budget */
  function profit(rev, margin, budget) {
    return num(rev) !== null && pos(margin) && num(budget) !== null ? rev * margin - budget : null;
  }

  /** break_even_ROAS = 1 / gross_margin */
  function breakEvenRoas(margin) {
    return pos(margin) && margin <= 1 ? 1 / margin : null;
  }

  /** required_CPR = AOV / target_ROAS (sales) · close_rate × deal_value / target_ROAS (leads) */
  function requiredCpr(input, targetRoas) {
    const v = valuePerResult(input);
    return v !== null && pos(targetRoas) ? v / targetRoas : null;
  }

  /** The conversion rate a required cost per result implies at the benchmark CPM and CTR. */
  function requiredCvr(requiredCostPerResult, { cpm, ctr } = {}) {
    return pos(requiredCostPerResult) && pos(cpm) && pos(ctr) ? cpm / (1000 * ctr * requiredCostPerResult) : null;
  }

  /** gap_% = (benchmark_CPR − required_CPR) / benchmark_CPR. Positive: you need results cheaper than the benchmark. */
  function gapPct(benchmarkCpr, requiredCostPerResult) {
    return pos(benchmarkCpr) && pos(requiredCostPerResult) ? (benchmarkCpr - requiredCostPerResult) / benchmarkCpr : null;
  }

  /** budget_needed = target_results × cost_per_result ("I have a target" mode) */
  function budgetNeeded(targetResults, cpr) {
    return pos(targetResults) && pos(cpr) ? targetResults * cpr : null;
  }

  /** Realistic / Stretch / Unrealistic from the gap. stretchMaxGap is the team's own rule (config). */
  function reality(gap, stretchMaxGap) {
    if (num(gap) === null || num(stretchMaxGap) === null) return null;
    if (gap <= 0) return "realistic";
    return gap <= stretchMaxGap ? "stretch" : "unrealistic";
  }

  /** High / Medium / Low: benchmark present and how many "I don't know" answers were given. */
  function confidence({ unknowns = 0, hasBenchmark = false } = {}) {
    if (!hasBenchmark) return "low";
    if (unknowns === 0) return "high";
    return unknowns === 1 ? "medium" : "low";
  }

  /**
   * Three scenarios × months 1–3. Each scenario multiplies the cost per result by its factor;
   * month 1 also multiplies by the learning-phase factor. Returns null without the factors.
   * mode "budget": results from the budget · mode "target": the budget needed for targetResults.
   */
  function scenarios({ cpr, budget, input, factors, learning, mode = "budget", targetResults } = {}) {
    if (!pos(cpr) || !factors || !pos(learning)) return null;
    if (!SCENARIOS.every(k => pos(factors[k]))) return null;
    const out = {};
    for (const k of SCENARIOS) {
      out[k] = [1, 2, 3].map(month => {
        const c = cpr * factors[k] * (month === 1 ? learning : 1);
        if (mode === "target") {
          const need = budgetNeeded(targetResults, c);
          const rev = revenue(targetResults, input);
          return { month, cpr: c, results: pos(targetResults), budget: need, revenue: rev, roas: roas(rev, need) };
        }
        const res = results(budget, c);
        const rev = revenue(res, input);
        return { month, cpr: c, results: res, budget, revenue: rev, roas: roas(rev, budget) };
      });
    }
    return out;
  }

  /** Seasons whose window overlaps the next `days` days. Dates are ISO strings; missing dates are skipped. */
  function seasonsAhead(seasons, today, days = 60, market) {
    const t0 = new Date(today).getTime();
    const t1 = t0 + days * 864e5;
    return (seasons || []).filter(s => {
      if (!s || !s.start) return false;
      if (market && market !== "both" && Array.isArray(s.markets) && !s.markets.includes(market)) return false;
      const a = new Date(s.start).getTime();
      const b = new Date(s.end || s.start).getTime();
      return isFinite(a) && b >= t0 && a <= t1;
    });
  }

  /** Benchmark row for market × industry × goal, with nulls when the file has none. */
  function benchmark(data, market, industry, goal) {
    const row = data && data.benchmarks && data.benchmarks[market] && data.benchmarks[market][industry] && data.benchmarks[market][industry][goal];
    return row || null;
  }

  /** Inputs ⇄ query string, so a shared link reopens the same forecast. */
  const KEYS = ["goal", "market", "industry", "cur", "budget", "aov", "margin", "cvr", "close", "mode", "tt", "tv", "tr"];
  function toQuery(state) {
    const q = new URLSearchParams();
    for (const k of KEYS) if (state[k] !== undefined && state[k] !== null && state[k] !== "") q.set(k, String(state[k]));
    return q.toString();
  }
  function fromQuery(search) {
    const q = new URLSearchParams(search);
    const s = {};
    for (const k of KEYS) if (q.has(k)) s[k] = q.get(k);
    return s;
  }

  return {
    SCENARIOS, GOALS,
    costPerResult, results, valuePerResult, revenue, roas, profit, breakEvenRoas,
    requiredCpr, requiredCvr, gapPct, budgetNeeded, reality, confidence, scenarios,
    seasonsAhead, benchmark, toQuery, fromQuery
  };
});
