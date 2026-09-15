---
name: linear-feature-delivery
description: Apply when implementing a Parentive Linear issue or a task with defined acceptance criteria. Keeps implementation scoped, traces work to requirements and produces a clear completion report.
---

# Parentive Linear Feature Delivery

Use this workflow when work corresponds to a Linear issue or similarly defined
feature.

# Understand the Issue

Identify:
- objective
- user outcome
- acceptance criteria
- dependencies
- explicit exclusions
- product assumptions

If issue context is available through an integration, use the actual issue.

Do not invent missing issue content.

Resolve technical questions from the repository when possible rather than
asking unnecessary questions.

# Scope

Treat the issue as the unit of delivery.

Implement:
- required behaviour
- necessary supporting code
- necessary verification

Do not add unrelated improvements.

When you discover useful unrelated work:
- mention it as follow-up
- do not silently expand the current issue

# Planning

For simple work:
- inspect
- implement
- verify

For substantial or cross-cutting work:
- use `parentive-architect`
- provide its acceptance criteria to the implementation stage
- use `parentive-builder`
- use `parentive-verifier`

# Traceability

Before completion, map every acceptance criterion to actual implementation.

A criterion is not complete because:
- a component exists
- a database field exists
- a button is visible
- a TODO describes future behaviour

The requested behaviour must actually work.

# Validation

Run checks appropriate to the change and repository.

Record:
- checks run
- results
- anything not run
- known limitations

# External Issue Actions

Do not:
- mark the Linear issue Done
- change issue status
- modify priority
- reassign the issue
- close related GitHub work

unless explicitly requested and the required integration/action is available.

# Completion Summary

Return:

## Issue outcome
What user/business outcome was implemented.

## Acceptance criteria
For each criterion state:
- complete
- incomplete
- blocked

## Validation
Exactly what was verified.

## Follow-up
Only work genuinely outside the current issue.

Do not hide incomplete acceptance criteria behind a general "done" statement.