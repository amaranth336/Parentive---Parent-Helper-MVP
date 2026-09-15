# Parentive Repository Instructions

## Project

Parentive is a local household and parents' helper service being built as a
production-quality MVP.

This repository is Parentive v2. Do not assume behaviour, architecture, code,
or data models from any earlier Parentive project unless they are explicitly
present in this repository or supplied in the current task.

For detailed current product scope, service boundaries, launch decisions, and
brand guidance, read:

`docs/ai/parentive-product-context.md`

Read that file before making decisions that affect:
- customer-facing functionality
- service availability
- booking behaviour
- childcare behaviour
- pricing presentation
- service-area messaging
- Parentive brand or marketing copy

An explicit current task or Linear issue may override the documented baseline.

## Technology

Primary stack:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

Local development URL:
`http://localhost:3000`

Inspect the repository before assuming framework configuration, routing
structure, package manager, testing framework, or existing implementation
patterns.

## Engineering Principles

Before editing:
1. Inspect the relevant existing code.
2. Understand the existing implementation and conventions.
3. Search for components, utilities, types, hooks, services, and patterns that
   can be reused.
4. Identify the smallest coherent change that satisfies the requirement.

During implementation:
- Prefer extending existing patterns over introducing new architecture.
- Prefer reuse over duplication.
- Keep changes scoped to the requested feature or issue.
- Do not perform unrelated refactors.
- Do not introduce a dependency unless it provides clear value that cannot
  reasonably be achieved with the existing stack.
- Do not replace working architecture merely because another pattern is
  preferred.
- Keep TypeScript strongly typed.
- Avoid `any`; if unavoidable, document why.
- Respect existing server/client boundaries.
- Keep business logic out of presentation components where practical.
- Handle failure and empty states where they are meaningful.
- Preserve accessibility and responsive behaviour.
- Avoid premature abstractions.

Do not:
- delete working functionality without an explicit requirement
- perform destructive Git operations
- reset or discard unrelated user changes
- modify secrets or production environment configuration without explicit
  instruction
- invent APIs, database tables, environment variables, service offerings,
  prices, or business rules

## Supabase and Security

Treat authentication, authorization, database schema, storage and RLS as
security-sensitive.

- Never expose Supabase service-role credentials in browser/client code.
- Never weaken RLS simply to make a feature work.
- Prefer migration-backed schema changes.
- Review existing schema and policies before adding or changing them.
- Account for existing records when changing nullability or constraints.
- Enforce authorization at an appropriate trusted boundary.
- Validate untrusted inputs.
- Do not log secrets or sensitive customer information.

Use the `supabase-safe-change` skill whenever a task touches Supabase schema,
authentication, authorization, storage, RLS or security-sensitive queries.

## UI and Brand

Parentive should feel:
- warm
- calm
- capable
- modern
- inclusive
- supportive without rescue framing

Use existing design tokens and components before introducing new visual
patterns.

Avoid:
- harsh or overly corporate presentation
- overly playful childcare branding
- gendered assumptions
- "mom" as the default customer
- queen-bee language
- overt honeycomb/hive decoration
- rescue-coded language
- unnecessary visual clutter

Use the `parentive-ui` skill for meaningful customer-facing UI work.

## Workflow

Work against one coherent requirement or Linear issue at a time.

For substantial or cross-cutting work:
1. Understand and plan.
2. Implement.
3. Independently verify.

Use `parentive-architect` before implementation when a change:
- affects multiple architectural areas
- changes routes or major workflows
- changes Supabase schema/auth/RLS
- adds an external integration
- introduces a significant shared component or abstraction
- changes material product behaviour
- has unclear technical boundaries

Use `parentive-builder` for implementation.

Use `parentive-verifier` after meaningful implementation before treating the
issue as complete.

If `parentive-verifier` returns FAIL, return the identified failures to
`parentive-builder` for correction, then re-run verification before treating
the work as complete.

Use `linear-feature-delivery` when work is associated with a Linear issue.

Use `pre-merge-verification` before recommending that meaningful work be
committed, merged, deployed, or considered complete.

## Definition of Done

Code being written does not mean the task is complete.

Before declaring meaningful work complete:
- compare implementation against the requirement
- run applicable repository-defined validation commands
- run applicable tests
- run TypeScript/lint checks where configured
- verify affected UI where practical
- verify relevant loading, empty, success and error states
- verify responsive behaviour for UI work
- verify links and navigation affected by the change
- identify anything that remains incomplete

Do not claim a check passed unless it was actually performed successfully.

If a required verification step cannot be run, explicitly report that.