# Role / Access Final Audit

Latest stable reference point:

- `23c4ef1 ui: make role access action wording preview safe`

## Validation

- `npm run build` passed
- `npm test` passed
- 293 tests passed

## Scope

This audit closes the current Role / Access polish phase.

Covered routes:

- `/roles`
- `/roles/[roleKey]`
- `/access-control`

Related routes:

- `/packages`
- `/audit-trail`
- `/workflow`
- `/notifications`
- `/rules`
- `/reports`
- `/system-foundation`
- `/navigation`

## Current Implementation

Role routes:

- `/roles` renders `RoleWorkspacePage`
- `/roles/[roleKey]` renders `RoleWorkspaceDetailPage`

Role sources:

- `config/roles.ts`
- `lib/role-workspace.ts`

Access route:

- `/access-control` renders `AccessControlPage`

Access sources:

- `config/access/index.ts`
- `config/access/access-rules.ts`
- `config/access/plan-registry.ts`
- `config/access/role-registry.ts`
- `lib/access.ts`

## Completed Work

### L1: Audit Inspect

Confirmed:

- `/roles` is not an empty placeholder.
- `/roles/[roleKey]` exists.
- `/access-control` is not an empty placeholder.
- Roles, plans, and access rules already have zh/en config.
- Access control already states metadata-only access behavior.
- Role detail already states no real auth/session/permission enforcement.

### L2: Standardization Plan

Created:

- `docs/ROLE_ACCESS_STANDARDIZATION_PLAN.md`

Purpose:

- Define Role / Access as a governance cluster.
- Preserve metadata-only behavior.
- Prevent real auth, session, middleware, permission enforcement, DB, API, workflow, notification, or plan billing behavior from being added.

### L3: Risky Wording + Duplicate Config Source Audit

Found one UI wording issue:

- `Assign training`

Confirmed duplicate config situation:

- `config/access/access-rules.ts`
- `config/access/access-policy.ts`

Confirmed current source of truth:

- `config/access/index.ts` exports from `./access-rules`
- `components/access/access-control-page.tsx` imports from `@/config/access`
- `lib/access.ts` imports from `@/config/access`
- no app/lib/component imports directly from `access-policy.ts`

### L4: Preview-Safe Wording + Config Source Note

Updated:

- `components/roles/role-workspace-page.tsx`
- `docs/ROLE_ACCESS_CONFIG_SOURCE_NOTE.md`

Changes:

- `Assign training` → `Preview training scope`
- documented `access-rules.ts` as current source of truth
- documented `access-policy.ts` as duplicate legacy candidate
- did not delete or migrate duplicate config

### L5: Final Wording + Source Audit

Confirmed:

- no risky UI action wording remains in role/access inspected files
- `Preview training scope` exists
- `access-rules.ts` is documented as source of truth
- `access-policy.ts` is documented as legacy candidate
- `config/access/index.ts` exports from `./access-rules`
- no direct app/lib/components imports from `access-policy.ts`

## Accepted Residuals

The following terms are accepted because they appear as guardrail / metadata wording, not real execution:

- auth
- session
- authorization
- permission enforcement
- hide
- futureEnforcementKey
- Assign Task Action inside access contract metadata

These should remain because they clarify that the current system does not perform real enforcement.

## Boundary Rules Preserved

This phase did not add:

- auth runtime
- session logic
- middleware
- route guards
- permission enforcement
- production route hiding
- database access
- API calls
- user creation
- role assignment
- plan billing
- workflow execution
- notification sending
- audit capture

Role / Access remains:

- UI preview only
- metadata-first
- contract-driven
- read-only from a business runtime perspective
- safe for SaaS governance demo

## Current Status

Role / Access is stable for this phase.

It now communicates:

- role profiles as experience previews
- access control as contract preview
- plan registry as metadata preview
- no real permission granting / revoking / enforcement
- no real auth or session behavior

## Recommended Next Work

After this phase, recommended next phases:

1. Package / Plan surface polish
2. Demo Readiness / Stakeholder Summary recap
3. Legacy shell migration plan
4. Optional Role / Access bilingual UI copy-map pass
5. Optional access-policy duplicate cleanup pass
