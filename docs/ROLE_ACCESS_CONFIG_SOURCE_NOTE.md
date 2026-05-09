# Role / Access Config Source Note

Latest stable reference point before this note:

- `b51ab8a docs: add role access standardization plan`

## Purpose

This note records the current source-of-truth decision for Role / Access config files.

## Current Access Config Files

The codebase currently contains two overlapping access rule files:

- `config/access/access-rules.ts`
- `config/access/access-policy.ts`

## Current Source of Truth

Current source of truth:

- `config/access/access-rules.ts`

Reason:

- `config/access/index.ts` exports `accessRules` and `accessRulesByKey` from `./access-rules`.
- `components/access/access-control-page.tsx` imports from `@/config/access`.
- `lib/access.ts` imports from `@/config/access`.
- Current tests reference `config/access/access-rules.ts`.

## Legacy Candidate

Legacy candidate:

- `config/access/access-policy.ts`

Decision:

- Do not delete this file in the current phase.
- Do not migrate it until a separate source cleanup pass.
- Treat it as a duplicate legacy candidate unless future imports prove otherwise.

## Boundary

This note does not add:

- auth runtime
- sessions
- route guards
- middleware
- database access
- API calls
- permission enforcement
- production hiding
- plan billing
- workflow execution
- notification sending
