# Goal: @bytesrc/ach-banking-days

## What this is
`@bytesrc/ach-banking-days` is a small, dependency-light TypeScript library for working with **U.S. ACH banking days**.

It focuses on:
- Banking-day calculations (skip weekends + FedACH closure holidays)
- Rolling dates to valid banking days (billing and settlement style conventions)
- A calendar-provider design that makes it easy to:
  - override holidays
  - exclude holiday rules by stable IDs
  - add one-off closure dates
  - expand to other calendars/countries later

## What problem it solves
In many finance apps you need consistent answers to questions like:
- “Is this date a valid ACH processing day?”
- “What is the next valid banking day?”
- “If a due date lands on a closure day, what date should it move to?”
- “How many banking days are between two dates?”

Existing libraries often:
- treat holidays loosely (“business days” but not bank closures)
- tie you to a specific date library
- require manual date lists or fragile name matching

This project standardizes around a **date-only internal representation** so calculations stay deterministic and timezone-safe.

## Design philosophy
- **Date-only core (`YYYY-MM-DD`)**: all primary computations happen on a canonical `LocalDate`.
- **Calendar providers**: calendars are pluggable modules.
- **Pure functions**: minimize shared mutable state.
- **Small surface area**: a handful of well-tested operations, expanded only when justified.
- **Compatibility**: publish ESM + CJS + types, work in modern and older Node codebases.

## Roadmap (high level)
- **v0.1**: core engine + US FedACH calendar + is/next/prev/add/roll + overrides
- **v0.2**: diff/range + convenience holiday exports + caching + DX polish
- **v1.0**: stable API contract + deeper tests + documentation completeness
- **v2**: cutoff times + datetime-aware “effective processing date” + optional adapters

## Non-goals (initially)
- Full multi-country holiday packs in v1
- Heavy dependencies on specific date libraries
- Overly complex settlement window modeling (multiple cutoffs, rail-specific rules) until there’s demand
