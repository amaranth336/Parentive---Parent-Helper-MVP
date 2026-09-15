---
name: pre-merge-verification
description: Apply before recommending that meaningful Parentive work be committed, merged, deployed or considered complete. Runs repository-appropriate quality checks and reviews the final diff.
---

# Parentive Pre-Merge Verification

Use this workflow before recommending merge/deploy/completion for meaningful
changes.

# Determine Available Checks

Inspect `package.json` and repository configuration.

Do not invent script names.

Identify available:
- type checking
- lint
- unit tests
- integration tests
- end-to-end tests
- build commands

Use the repository's actual package manager.

# Diff Review

Review changed files for:
- unintended changes
- debug code
- commented-out temporary code
- accidental formatting churn
- duplicate implementation
- unrelated refactoring
- hard-coded secrets
- environment values
- placeholder content
- unfinished TODOs directly related to the feature

# Static Checks

Run applicable configured checks.

Common categories include:
- TypeScript
- lint
- tests

Only report checks as passing when their commands completed successfully.

# Build

For meaningful changes, run the production build when feasible and appropriate.

If it cannot be run, explain why.

Do not represent an unexecuted build as successful.

# UI Verification

For UI changes verify where relevant:
- page loads
- primary interaction works
- mobile layout
- desktop layout
- navigation
- links
- loading state
- empty state
- error state
- success state
- browser console

# Data / Auth

For data-sensitive changes verify the appropriate:
- authenticated behaviour
- anonymous behaviour
- unauthorized behaviour
- expected failure behaviour

# Requirements

Return to the original requirement.

Verify every acceptance criterion.

Do not approve based solely on code quality when requested behaviour is
missing.

# Result

Report:

## Checks passed

Only checks actually performed successfully.

## Failures

Blocking failures with evidence.

## Not verified

Anything that could not be tested.

## Recommendation

Use:

`READY`

only when there is no known blocking failure.

Otherwise use:

`NOT READY`