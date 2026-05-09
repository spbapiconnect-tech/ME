# UI Test Route Walkthrough Plan

Latest stable reference point:

- `446b428 docs: add demo readiness stakeholder recap final audit`

## Goal

This phase prepares a practical manual localhost UI walkthrough checklist.

This phase does not add Playwright, Cypress, CI, monitoring, analytics, tracking, production auth, real API calls, database writes, or runtime route crawling.

## Localhost Start Command

Run:

    cd /Users/mil/me
    npm run dev

Open:

    http://localhost:3000

## Confirmed Route Sequence

1. `/`
2. `/navigation`
3. `/psi`
4. `/psi/procurement`
5. `/psi/supplier`
6. `/psi/inventory`
7. `/psi/issues`
8. `/reports`
9. `/reports/pos`
10. `/branches`
11. `/branches/all-stores`
12. `/tasks`
13. `/settings`
14. `/integration`
15. `/integration/POS-KCH-PRIMARY`
16. `/roles`
17. `/access-control`
18. `/packages`
19. `/system-foundation`
20. `/demo-story`
21. `/demo-mode`
22. `/stakeholder-summary`
23. `/demo-readiness`

## Test Standard

Use:

- `PASS` when the route loads, layout is readable, and wording is preview-safe.
- `REVIEW` when the route loads but layout/copy/responsive behavior needs polish.
- `FAIL` when the route crashes, cannot be reached, has major visual breakage, or implies real execution.

## Global Checks For Every Page

Check each route for:

1. Page loads without crash.
2. Main title is clear.
3. Sidebar/topbar navigation makes sense.
4. Layout is readable.
5. Cards and sections are not broken.
6. CTA wording is preview-safe.
7. Mock/read-only/metadata boundary is visible where needed.
8. No page implies real POS sync, printer bridge, billing, auth, workflow, API, DB, or writes.
9. Desktop layout is usable.
10. Narrow/mobile layout is usable.

## Walkthrough Checklist

| # | Route | Main Check | Status |
|---|---|---|---|
| 01 | `/` | Business workspace loads and works as product entry. | PASS / REVIEW / FAIL |
| 02 | `/navigation` | Navigation IA and route hierarchy are clear. | PASS / REVIEW / FAIL |
| 03 | `/psi` | PSI overview shows procurement/supplier/inventory entry points. | PASS / REVIEW / FAIL |
| 04 | `/psi/procurement` | Procurement preview is readable and does not imply real PO creation. | PASS / REVIEW / FAIL |
| 05 | `/psi/supplier` | Supplier preview is readable and does not imply real supplier API sync. | PASS / REVIEW / FAIL |
| 06 | `/psi/inventory` | Inventory preview is readable and does not imply real stock write-back. | PASS / REVIEW / FAIL |
| 07 | `/psi/issues` | Issue loop is clear and action wording remains preview-only. | PASS / REVIEW / FAIL |
| 08 | `/reports` | Report widgets are readable and remain metadata preview. | PASS / REVIEW / FAIL |
| 09 | `/reports/pos` | POS report preview does not imply real POS/payment/export integration. | PASS / REVIEW / FAIL |
| 10 | `/branches` | Branch overview loads and branch context is clear. | PASS / REVIEW / FAIL |
| 11 | `/branches/all-stores` | All-stores aggregate branch context is clear. | PASS / REVIEW / FAIL |
| 12 | `/tasks` | Task queue/status/source mapping is readable and preview-only. | PASS / REVIEW / FAIL |
| 13 | `/settings` | Settings uses preview wording, not real save/persistence wording. | PASS / REVIEW / FAIL |
| 14 | `/integration` | Integration uses preview wording, not real sync/disable wording. | PASS / REVIEW / FAIL |
| 15 | `/integration/POS-KCH-PRIMARY` | Connector detail loads and does not imply real POS credentials/sync. | PASS / REVIEW / FAIL |
| 16 | `/roles` | Roles read as experience preview, not real role assignment. | PASS / REVIEW / FAIL |
| 17 | `/access-control` | Access control reads as contract preview, not real enforcement. | PASS / REVIEW / FAIL |
| 18 | `/packages` | Packages use Catalog Active / Preview Usable / Future Ref wording. | PASS / REVIEW / FAIL |
| 19 | `/system-foundation` | Foundation supports architecture explanation and stays secondary. | PASS / REVIEW / FAIL |
| 20 | `/demo-story` | Demo story guides the product narrative clearly. | PASS / REVIEW / FAIL |
| 21 | `/demo-mode` | Demo mode route sequence and screenshot guidance are clear. | PASS / REVIEW / FAIL |
| 22 | `/stakeholder-summary` | Summary includes v0.8.8, v0.8.9, governance, packages, and route map. | PASS / REVIEW / FAIL |
| 23 | `/demo-readiness` | Readiness checklist includes final UI walkthrough and guardrails. | PASS / REVIEW / FAIL |

## Responsive Widths

Test manually at:

- 1440px+
- 1280px
- 768px
- 390px

Check:

- sidebar/menu behavior
- card wrapping
- text overflow
- table overflow
- CTA alignment
- header spacing
- no unwanted horizontal scroll

## Manual Test Result Template

# ME UI Walkthrough Test Result

Date:
Tester:
Branch:
Commit:

| # | Route | Status | Notes |
|---|---|---|---|
| 01 | `/` | PASS / REVIEW / FAIL | |
| 02 | `/navigation` | PASS / REVIEW / FAIL | |
| 03 | `/psi` | PASS / REVIEW / FAIL | |
| 04 | `/psi/procurement` | PASS / REVIEW / FAIL | |
| 05 | `/psi/supplier` | PASS / REVIEW / FAIL | |
| 06 | `/psi/inventory` | PASS / REVIEW / FAIL | |
| 07 | `/psi/issues` | PASS / REVIEW / FAIL | |
| 08 | `/reports` | PASS / REVIEW / FAIL | |
| 09 | `/reports/pos` | PASS / REVIEW / FAIL | |
| 10 | `/branches` | PASS / REVIEW / FAIL | |
| 11 | `/branches/all-stores` | PASS / REVIEW / FAIL | |
| 12 | `/tasks` | PASS / REVIEW / FAIL | |
| 13 | `/settings` | PASS / REVIEW / FAIL | |
| 14 | `/integration` | PASS / REVIEW / FAIL | |
| 15 | `/integration/POS-KCH-PRIMARY` | PASS / REVIEW / FAIL | |
| 16 | `/roles` | PASS / REVIEW / FAIL | |
| 17 | `/access-control` | PASS / REVIEW / FAIL | |
| 18 | `/packages` | PASS / REVIEW / FAIL | |
| 19 | `/system-foundation` | PASS / REVIEW / FAIL | |
| 20 | `/demo-story` | PASS / REVIEW / FAIL | |
| 21 | `/demo-mode` | PASS / REVIEW / FAIL | |
| 22 | `/stakeholder-summary` | PASS / REVIEW / FAIL | |
| 23 | `/demo-readiness` | PASS / REVIEW / FAIL | |

## Global Issues

-

## Next Fixes

-

## Boundary

This phase does not add:

- Playwright
- Cypress
- automated browser tests
- route crawler
- monitoring
- analytics
- tracking
- CI
- production auth
- production database
- API calls
- real writes
