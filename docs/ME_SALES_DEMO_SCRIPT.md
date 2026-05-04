# ME Sales Demo Script

## Part 1: 30-second positioning

- ME is a modular store operations SaaS platform.
- It connects procurement, suppliers, inventory, POS reports, education / SOP, and tasks.
- The current build is a prototype with mock data.

## Part 2: 3-minute demo flow

1. Start at dashboard.
2. Open Module Center.
3. Show modules are configurable.
4. Open Demo Workspace.
5. Explain the cross-module flow:
   `POS Sales Signal -> Inventory Risk -> Procurement Suggestion -> Supplier Check -> Task Assignment -> Education / SOP Follow-up`
6. Open one module demo, preferably Inventory or Procurement.
7. Show listing, detail, issue, timeline, and CTA placeholders.
8. Explain that future real API will replace mock data.

## Part 3: What to say to buyers

- “You do not need to buy a huge ERP first.”
- “You can start with the modules you need.”
- “The UI shell stays the same; modules can be added later.”
- “Tasks close the loop between data and action.”
- “AI / forecasting / report assistant are roadmap items, not required to start.”

## Part 4: What not to claim yet

- Do not claim real POS integration.
- Do not claim real inventory deduction.
- Do not claim AI is implemented.
- Do not claim ERP sync is live.
- Do not claim production readiness.

## Layout Engine / Skin System Foundation

- If time allows, open `/layout-engine` after Templates or Components.
- Explain that `LayoutRegistry`, `SkinRegistry`, DisplayModel adapters, and `ModulePageRenderer` are foundation layers only.
- Say that the current route is metadata-first and preview-only.
- Say that existing module pages are not fully migrated yet.
- Do not claim persisted skin preferences, customer-specific live skin switching, real API connections, or production readiness.
- Position this route as the safer way to refresh ME UI shells before rewriting module pages.

## Part 5: Suggested demo order

1. Dashboard
2. Module Center
3. Demo Workspace
4. Inventory Demo
5. Procurement Demo
6. Templates
7. Components
8. Layout Engine
9. Close with roadmap
