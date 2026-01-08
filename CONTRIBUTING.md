# Contributing

Thanks for contributing! This repo uses Changesets and CI checks to keep releases clean.

## Workflow

1) Create a feature branch.
2) Make your changes.
3) Add a changeset (required for most PRs).
4) Open a PR.

## Changesets (required by CI)

Run:

```bash
npx changeset
```

Pick the semver bump:
- **patch**: bugfix or small internal change that affects output
- **minor**: new feature, additive API
- **major**: breaking change

This creates a file in `.changeset/`. CI will fail if a PR does not include a changeset.

### Docs-only exception

If a PR only changes documentation, add the **docs-only** label on the PR.
This skips the changeset check in CI.

## Release flow

- When a PR with a changeset merges to `main`, a “Version Packages” PR is created by the Changesets GitHub Action.
- Merge that PR to publish to npm via Trusted Publishing (OIDC).

## Local checks

```bash
npm run typecheck
npm test
npm run build
```
