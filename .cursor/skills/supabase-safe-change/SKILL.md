---
name: supabase-safe-change
description: Apply whenever Parentive work changes or depends on Supabase database schema, migrations, RLS, authentication, authorization, storage, server/client queries or sensitive customer data.
---

# Supabase Safe Change

Use this skill whenever work touches Supabase.

# Before Changing Anything

Inspect:
- existing schema
- existing migrations
- relevant tables
- foreign keys
- indexes
- constraints
- existing RLS policies
- current queries
- generated/database TypeScript types where present
- auth assumptions
- server/client boundaries

Do not create a parallel data model if an existing one already represents the
concept.

# Security

RLS is part of the security model, not an obstacle to implementation.

Never weaken or disable RLS merely to make a feature work.

Never expose:
- service-role keys
- privileged database credentials
- server-only secrets

to browser/client code.

Do not rely on UI hiding as authorization.

Authorization must be enforced at a trusted boundary.

Validate untrusted input before using it in privileged operations.

Use least privilege.

# Schema Changes

Prefer explicit, migration-backed schema changes.

Before adding a required/non-null field, consider existing records.

Before renaming/removing data, consider:
- current code references
- existing rows
- migration sequencing
- deploy compatibility
- rollback implications

Avoid destructive changes unless explicitly required.

When a safe additive migration can accomplish the objective, prefer it over a
destructive rewrite.

# RLS

When introducing a table accessible through Supabase clients:

Determine:
- who may SELECT
- who may INSERT
- who may UPDATE
- who may DELETE

Create only the permissions actually required.

Check ownership predicates carefully.

Do not assume authenticated users should automatically access all records.

# Queries

Prefer:
- explicit data selection
- typed results
- appropriate error handling
- server-side privileged actions where required

Avoid:
- broad data retrieval when only a few fields are required
- silently swallowing Supabase errors
- exposing internal/sensitive fields unnecessarily

# Authentication

When auth is involved verify:
- anonymous state
- authenticated state
- unauthorized state
- session expiry/failure where relevant
- server-side authorization for privileged actions

Do not confuse authentication ("who are you?") with authorization
("are you allowed to do this?").

# Validation

After a data/security change, verify where applicable:
- expected authorized read
- expected authorized write
- denied unauthorized read
- denied unauthorized write
- anonymous behaviour
- existing-record compatibility
- type compatibility
- application error handling

# Reporting

If a requested implementation would require weakening security, stop and
report the architectural conflict rather than creating the insecure shortcut.