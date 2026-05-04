# ME Demo QA Checklist

## A. Route QA

- [ ] `/`
- [ ] `/modules`
- [ ] `/templates`
- [ ] `/components`
- [ ] `/layout-engine`
- [ ] `/demo`
- [ ] `/demo/procurement`
- [ ] `/demo/supplier`
- [ ] `/demo/inventory`
- [ ] `/demo/pos-report`
- [ ] `/demo/education`
- [ ] `/tasks`
- [ ] `/tasks/TASK-1001`

## B. Theme QA

- [ ] Bright
- [ ] Dark
- [ ] Moon
- [ ] Cards readable
- [ ] Chips readable
- [ ] Tables readable
- [ ] Drawer/panel contrast readable
- [ ] No hardcoded color breaks

## C. Language QA

- [ ] Chinese
- [ ] English
- [ ] No button overflow
- [ ] No card title overflow
- [ ] No table header overflow
- [ ] Long English labels clamp or truncate safely

## D. Responsive QA

- [ ] Mobile < 768px
- [ ] Tablet 768px - 1199px
- [ ] Desktop >= 1200px
- [ ] No horizontal scroll on mobile
- [ ] Tablet split view readable
- [ ] Desktop panels not too cramped

## E. Demo Data QA

- [ ] Mock-data labels visible
- [ ] Module IDs consistent
- [ ] Cross-module demo flow clear
- [ ] No real API implied
- [ ] No real database implied

## Layout Engine / Skin System Foundation

- [ ] `/layout-engine` route opens successfully
- [ ] Layout registry preview cards are visible
- [ ] Skin registry preview cards are visible
- [ ] Display model preview renders without implying real API or database connectivity
- [ ] ModulePageRenderer preview remains metadata-first and preview-only
- [ ] No persisted skin preference is implied in the current UX
- [ ] CTA entry points to `/layout-engine` are visible from key ME surfaces
- [ ] Copy does not claim production readiness or customer-specific live skin switching

## F. Sales Demo QA

- [ ] Dashboard entry clear
- [ ] Module Center entry clear
- [ ] Demo workspace entry clear
- [ ] Task Engine entry clear
- [ ] Component and template demos explain platform structure
- [ ] Buyer can understand the value in 3 minutes
