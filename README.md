# @bytesrc/ach-banking-days

ACH-focused banking day utilities for the U.S. (FedACH closures), written in TypeScript and published with ESM + CJS + types.

## Install

```bash
npm i @bytesrc/ach-banking-days
# pnpm add @bytesrc/ach-banking-days
# yarn add @bytesrc/ach-banking-days
```

## Quick start

```ts
import {
  isBankingDay,
  nextBankingDay,
  addBankingDays,
  roll,
} from "@bytesrc/ach-banking-days";

isBankingDay("2026-01-01");        // false
nextBankingDay("2026-01-01");      // "2026-01-02"
addBankingDays("2026-01-02", 3);   // skips weekends/closures
roll("2026-07-04", "following");   // next banking day
```

## Inputs: `LocalDate` and `Date`

The canonical input/output type is:

- `LocalDate` = `"YYYY-MM-DD"`

If you have a JS `Date`, convert it:

```ts
import { toLocalDate, nextBankingDay } from "@bytesrc/ach-banking-days";

const d = new Date("2026-01-01T15:23:00Z");
const local = toLocalDate(d, { tz: "America/New_York" });
const next = nextBankingDay(local);
```

## Overrides (custom closures, exclusions)

```ts
import {
  createCalendar,
  usFedAchCalendar,
  nextBankingDay,
} from "@bytesrc/ach-banking-days";

const calendar = createCalendar({
  base: usFedAchCalendar,
  exclude: ["columbus_day"], // exclude by stable holiday id (all years)
  addHolidays: [{ date: "2026-12-24", name: "Bank Xmas Eve" }], // one-off closure
  removeDates: ["2026-01-19"], // remove a specific occurrence
});

nextBankingDay("2026-12-24", { calendar });
```

## API (MVP)

- `toLocalDate(input, { tz? }) -> LocalDate`
- `isBankingDay(date, opts?) -> boolean`
- `nextBankingDay(date, opts?) -> LocalDate`
- `prevBankingDay(date, opts?) -> LocalDate`
- `addBankingDays(date, n, opts?) -> LocalDate`
- `roll(date, convention, opts?) -> LocalDate`
- `usFedAchCalendar` (default calendar provider)
- `createCalendar(config)` (override helper)

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
```

### Scripts (recommended)
- `typecheck`: `tsc --noEmit`
- `test`: `vitest run`
- `build`: `tsup src/index.ts --format esm,cjs --dts`

## Publishing (recommended approach)

This repo is intended to publish via GitHub Actions + npm **Trusted Publishing (OIDC)**:
- CI validates PRs (typecheck + tests + build)
- Changesets manages version bumps and changelog entries
- Release workflow publishes to npm on merge to `main`

See `TASKS.md` for the full setup checklist and milestones.

## License
MIT
