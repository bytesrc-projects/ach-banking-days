# @bytesrc/ach-banking-days — Task Plan

A task-oriented plan for delivering `v0.1 → v0.2 → v1.0 → v2`, including tech choices, testing, and deployment.

---

## Project principles

- **Canonical internal type:** `LocalDate = "YYYY-MM-DD"` (date-only).
- **Pure functions first:** avoid global mutable state to prevent dual ESM/CJS hazards.
- **Calendar-provider architecture:** keep holiday logic pluggable.
- **Small core, expandable edges:** adapters and cutoff-time logic come later as optional modules.
- **Ship ESM + CJS + Types:** to support modern and older Node projects.

---

## Tech stack decisions

### Runtime & language
- Node.js: **>= 18** (recommend 20 in CI)
- TypeScript: **strict**
- Module outputs: **ESM + CJS**
- Types: **.d.ts** generated on build

### Build
- `tsup` for `esm,cjs,dts`
- `exports` map in `package.json` to route `import` vs `require`

### Testing
- `vitest` for unit tests
- Separate smoke tests for:
  - ESM import (`test/esm.test.ts`)
  - CJS require (`test/cjs.test.cjs`)

### Release & publishing
- `changesets` for versioning + changelog
- GitHub Actions:
  - `CI` workflow on PRs
  - `Release` workflow on `main`
- npm publish via **Trusted Publishing (OIDC)** (preferred; no long-lived token)

---

## Repo structure (target)

```text
.
├─ src/
│  ├─ index.ts
│  ├─ types.ts
│  ├─ localDate/
│  │  ├─ parse.ts
│  │  └─ math.ts
│  ├─ calendars/
│  │  ├─ usFedAch.ts
│  │  └─ createCalendar.ts
│  └─ bankingDays.ts
├─ test/
│  ├─ esm.test.ts
│  ├─ cjs.test.cjs
│  ├─ holidays.test.ts
│  └─ bankingDays.test.ts
├─ .github/workflows/
│  ├─ ci.yml
│  └─ release.yml
├─ package.json
├─ tsconfig.json
├─ README.md
├─ GOAL.md
├─ TASKS.md
└─ LICENSE
```

---

## v0.1 — Core engine + US FedACH + basic math

### 0.1.1 — Initialize project scaffolding
- [ ] Create repo and initialize npm package under scope: `@bytesrc/ach-banking-days`
- [ ] Add MIT `LICENSE`
- [ ] Add `.editorconfig` (optional) and formatting config (`prettier`) (optional)
- [ ] Configure TypeScript strict mode (`tsconfig.json`)
- [ ] Install deps:
  - [ ] `tsup`
  - [ ] `typescript`
  - [ ] `vitest`
- [ ] Add npm scripts:
  - [ ] `build`, `typecheck`, `test`, `lint` (optional)
- [ ] Add `package.json` exports for dual ESM/CJS + types

**Acceptance**
- `npm run build` produces `dist/` with ESM, CJS, and `.d.ts`
- `npm test` passes locally

---

### 0.1.2 — Implement `LocalDate` utilities (date-only core)
- [ ] Define `LocalDate` type and validation (must match `YYYY-MM-DD`)
- [ ] Implement `compare(a,b)`, `addDays(d,n)`, `weekday(d)` (deterministic)
- [ ] Implement `toLocalDate(input, { tz? })`
  - [ ] Accept `LocalDate` passthrough
  - [ ] Accept `Date`
  - [ ] Accept ISO string / timestamp (optional)
  - [ ] Clearly define timezone behavior for `Date` inputs (document it)

**Acceptance**
- Unit tests cover:
  - [ ] parsing/validation
  - [ ] addDays across month/year boundaries
  - [ ] weekday correctness on known dates

---

### 0.1.3 — Calendar provider interface + US FedACH calendar
- [ ] Define `HolidayCalendar` interface:
  - [ ] `isHoliday(LocalDate): boolean`
  - [ ] `holidayName?(LocalDate): string | null`
  - [ ] `holidays?(year): HolidayOccurrence[]`
- [ ] Define stable `HolidayId` union and `HolidayOccurrence` type:
  - [ ] `{ id, name, date, observed }`
- [ ] Implement `usFedAchCalendar` using holiday **rules** (not hard-coded year tables):
  - [ ] Fixed-date holidays w/ observance handling
  - [ ] Nth weekday holidays
  - [ ] “Last weekday” holiday (Memorial Day)
  - [ ] Thanksgiving rule
- [ ] Implement `createCalendar({ base, exclude, removeDates, addHolidays })`

**Acceptance**
- Tests:
  - [ ] `holidays(YYYY)` returns expected *count* and includes expected known holidays
  - [ ] observed behavior for Sat/Sun cases works as intended
  - [ ] `exclude` removes all years for a holiday id
  - [ ] `addHolidays` and `removeDates` behave correctly

---

### 0.1.4 — Banking day functions
- [ ] `isBankingDay(date, { calendar?, weekend? })`
- [ ] `nextBankingDay(date, opts)`
- [ ] `prevBankingDay(date, opts)`
- [ ] `addBankingDays(date, n, opts)`
- [ ] `roll(date, convention, opts)` with:
  - [ ] `following`
  - [ ] `preceding`
  - [ ] `modifiedFollowing`

**Acceptance**
- Tests cover:
  - [ ] skip weekends
  - [ ] skip holidays
  - [ ] add across a holiday+weekend combo
  - [ ] `modifiedFollowing` month boundary behavior

---

### 0.1.5 — Public exports + smoke tests
- [ ] Export public surface from `src/index.ts`
- [ ] Add ESM import test
- [ ] Add CJS require test

**Acceptance**
- `node --input-type=module` can import the package after build
- `node` can `require()` the CJS build after build

---

### 0.1.6 — CI + initial publish
- [ ] Add GitHub Actions `CI` workflow:
  - [ ] install
  - [ ] typecheck
  - [ ] test
  - [ ] build
- [ ] Publish `0.1.0` (manual first publish is OK)
- [ ] Set up npm org `bytesrc` and add maintainers if needed

**Acceptance**
- PRs show green checks
- Package installs and runs in a fresh project

---

## v0.2 — DX improvements + more utilities

### 0.2.1 — Additional utilities
- [ ] `diffBankingDays(start, end, opts)` (count between)
- [ ] `rangeBankingDays(start, end, opts)` (iterator or array)
- [ ] Export `isHoliday`, `holidayName`, `holidays(year)` convenience helpers

**Acceptance**
- Tests cover negative/positive ranges and edge cases

---

### 0.2.2 — Performance and ergonomics
- [ ] Year cache inside calendar provider (pure, internal)
- [ ] Better error messages for invalid dates
- [ ] Improve README examples (real scheduling scenarios)

**Acceptance**
- Benchmark sanity check (not formal): repeated calls don’t regenerate holidays every time

---

### 0.2.3 — Release automation
- [ ] Add `changesets`
- [ ] Add `release.yml` workflow:
  - [ ] PR created for versioning
  - [ ] publish on merge to `main`
- [ ] Enable npm Trusted Publishing (OIDC)

**Acceptance**
- A changeset merged to main results in an npm publish without storing an npm token

---

## v1.0 — Stability + docs + contract

### 1.0.1 — API contract freeze
- [ ] Confirm function names/signatures and mark them stable
- [ ] Add `CHANGELOG.md` generation via changesets
- [ ] Semver policy documented

### 1.0.2 — Test depth
- [ ] Expand observed-holiday tests across multiple years
- [ ] Add “known tricky dates” test table
- [ ] Add property-style tests (optional) like “nextBankingDay is always banking day”

### 1.0.3 — Documentation completeness
- [ ] Clear definition: what “ACH banking day” means in this package
- [ ] Clear timezone rules for Date inputs
- [ ] Examples for overrides + roll conventions
- [ ] Support policy (Node versions)

**Acceptance**
- Confident behavior + docs; ready for real adoption

---

## v2 — Cutoff times + effective processing date (datetime-aware)

### 2.0.1 — New datetime module (keep core date-only)
- [ ] Add `effectiveBankingDate(datetime, { cutoff, tz, calendar })`
  - [ ] Convert datetime → bank-local date
  - [ ] Apply cutoff rule
  - [ ] Roll to next banking day if needed
- [ ] Keep it separate from v1 exports if you want to avoid bloat:
  - [ ] `@bytesrc/ach-banking-days/cutoff` (subpath export)

**Acceptance**
- Tests for before/after cutoff
- Tests for cutoff on non-banking day (should roll first or after—document the rule)

---

### 2.0.2 — Optional adapters (subpath exports)
- [ ] `adapters/temporal`
- [ ] `adapters/luxon`
- [ ] `adapters/dayjs`

**Acceptance**
- No core dependency added; adapters are opt-in

---

## Definition of Done (all versions)
- [ ] `npm pack` produces correct outputs
- [ ] `exports` map works in ESM and CJS projects
- [ ] TypeScript types are accurate and documented
- [ ] CI green on `main`
- [ ] Tagged releases and changelog entries exist
