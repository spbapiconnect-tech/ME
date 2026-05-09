# Role / Access Standardization Plan

Latest stable reference point:

- `f5a89d7 docs: add settings integration final audit`

## Goal

This phase turns Roles and Access Control into a professional SaaS permission-preview center while preserving the current metadata-only boundary.

The goal is not to add real authentication, route guards, authorization, sessions, or permission enforcement.

The goal is to organize:

- role profiles
- role workspace previews
- visible module previews
- branch and foundation scope previews
- access contracts
- plan registry
- permission requirements
- audit / workflow / notification preview links
- package / report visibility references

## Covered Routes

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

Main role sources:

- `config/roles.ts`
- `lib/role-workspace.ts`

Access route:

- `/access-control` renders `AccessControlPage`

Main access sources:

- `config/access/access-rules.ts`
- `config/access/access-policy.ts`
- `config/access/plan-registry.ts`
- `lib/access.ts`

## Current Findings

### Roles

Current strengths:

- Role profile config has zh/en names and descriptions.
- Role workspace helpers return profile, metrics, modules, actions, navigation preview, and foundation preview.
- Role detail pages clearly state no real auth/session/permission enforcement.
- Role previews connect to navigation, branches, reports, PSI, packages, and system foundation.

Current polish needs:

- `/roles` main page contains many English-only UI labels.
- Role action labels can sound operational, such as `Assign training` and `Open permissions`.
- The page should better frame itself as role experience preview, not real assignment or permission editing.
- Role pages should keep using preview-safe language.

### Access Control

Current strengths:

- Access Control page already states metadata-only access contracts.
- It explicitly says no real authentication or authorization is implemented.
- AccessPreviewCard clearly states metadata preview only.
- Audit, workflow, notification, package, rule, and report links are surfaced.
- `lib/access.ts` remains metadata-only.

Current polish needs:

- Top action links are crowded.
- Some labels still feel like a tool stack rather than a polished SaaS permissions center.
- Need clearer grouping between Role Registry, Plan Registry, Access Rules, and Preview.
- Need document the duplicate access config files before touching them.

## Important Duplicate Config Finding

These files appear to contain overlapping access rule definitions:

- `config/access/access-policy.ts`
- `config/access/access-rules.ts`

Decision for this phase:

- Do not delete either file yet.
- First document current usage.
- Later audit imports to identify the true source of truth.
- If one is legacy, mark it as legacy in a separate migration step.

## Target IA

Role / Access should be treated as a governance cluster.

Recommended surfaces:

1. Roles
2. Role Detail
3. Access Control
4. Plan Registry
5. Permission Contract Preview
6. Audit / Workflow / Notification linkage
7. Package / Report visibility reference

## Role Page Responsibilities

`/roles` should frame:

- business roles
- platform roles
- staff mapping
- access groups
- branch scope
- training visibility
- security administration preview

It should not imply:

- real user assignment
- real permission editing
- real training assignment
- real session change
- real route hiding

## Role Detail Responsibilities

`/roles/[roleKey]` should frame:

- role purpose
- visible modules
- default route
- foundation visibility preview
- role-specific actions
- navigation preview
- branch context preview

It should not imply:

- actual auth role switching
- production permission enforcement
- real module gating
- real staff identity mapping

## Access Control Responsibilities

`/access-control` should frame:

- role registry
- plan registry
- access rule registry
- scope filters
- status filters
- module filters
- action preview
- metadata preview result
- linked audit / workflow / notification / package / report references

It should not imply:

- login enforcement
- middleware
- production hiding
- plan billing gate
- real action execution
- real permission granting or revoking

## Preview-Safe Wording Rules

Avoid action labels such as:

- Assign
- Grant
- Revoke
- Enable
- Disable
- Apply Permission
- Save Permission
- Switch Role
- Activate Plan

Prefer:

- Review
- Preview
- Open Preview
- Inspect
- View Contract
- Check Mapping
- Review Scope
- Preview Access

## Boundary Rules

This phase must not add:

- auth runtime
- session logic
- middleware
- route guards
- permission enforcement
- database access
- API calls
- user creation
- role assignment
- plan billing
- production hiding
- workflow execution
- notification sending
- audit capture

Everything remains UI/config-only and metadata-only.

## Recommended L3 Next Step

Run a focused risky wording audit for:

- `components/roles/role-workspace-page.tsx`
- `components/roles/role-workspace-detail-page.tsx`
- `components/access/access-control-page.tsx`
- `components/access/access-preview-card.tsx`
- `lib/role-workspace.ts`
- `lib/access.ts`

Look for:

- Assign
- Grant
- Revoke
- Enable
- Disable
- Save
- Apply
- Switch
- Authenticate
- Authorize
- Enforce
- Hide
- Activate

Then decide whether to do a small copy polish or write an audit doc first.

## Validation

After each change:

- `npm run build`
- `npm test`
- do not commit `.write_test`
- confirm `/roles` imports
- confirm `/roles/owner` imports
- confirm `/access-control` imports
- confirm no fetch / axios / prisma / supabase / storage usage is added
