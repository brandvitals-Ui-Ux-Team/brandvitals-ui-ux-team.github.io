# Vitals Forecast data

`forecast-benchmarks.json` feeds the Vitals Forecast tool (`forecast.html`). The math lives in `assets/js/forecast.js` and is tested in `tests/forecast.test.mjs`.

## The rule

Every value ships as `null` until it comes from a real source. No typical, average or remembered numbers. While a value is `null` the tool still shows break-even ROAS and "what has to be true" (they only need the visitor's own numbers). For everything else it shows: "We're updating benchmarks for this market and industry. A strategist will send yours today."

## What to fill, once a month

1. **`benchmarks[market][industry][goal]`** for `eg`, `sa` and `both`:
   - `cpm`, `ctr`, `cvr` and `cost_per_result`, each with `low`, `mid` and `high`. CPM and cost per result are money in the market's currency (EGP for `eg` and `both`, SAR for `sa`). CTR and CVR are fractions: `0.012` means 1.2%.
   - `close_rate` (leads only) is a fraction.
   - Fill `cost_per_result` when you have it directly. The tool uses it before CPM × CTR × CVR.
   - Set `source` to a short note (for example "BV clients, anonymized, Sep 2026" or "Meta delivery estimate") and `updated` to the date in `YYYY-MM-DD`.
2. **`scenario_factors`**: the multiplier on cost per result for each column (Conservative, Expected, Strong). The forecast table stays hidden until all three are set.
3. **`learning_phase_factor`**: the extra multiplier on cost per result in month 1.
4. **`stretch_max_gap`**: the team's rule for the reality label. A gap up to this fraction reads "Stretch"; above it, "Unrealistic".
5. **`seasons`**: start and end dates (`YYYY-MM-DD`) for the next occurrence of each season. Ramadan and White Friday need new dates every year. The tool shows a season note when one falls in the next 60 days.
6. **`min_budget`**: the smallest monthly budget we take on, per currency. EGP is 30,000 (the brief forms use the same). SAR is waiting on a decision.
7. Set the top-level `updated` date.

## Sources to use

- Brand Vitals' own anonymized client results (preferred).
- Meta delivery estimates (Ads Manager, at planning time).
- Google Keyword Planner (CPC ranges for search).

Platform API integrations and ad-account connections are a later phase. Don't add them here.

## Check before publishing

```bash
npm run test:forecast
```

The test that guards "no numbers in the file" fails once you add real benchmarks. Update that test in the same commit and note the source.
