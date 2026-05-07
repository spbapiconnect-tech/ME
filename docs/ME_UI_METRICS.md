# ME UI Metrics

## Purpose

This document defines the production UI measurements for **ME Branch ERP**.

These metrics exist to keep ME aligned with real B-end restaurant ERP / CRM software instead of drifting into dashboard posters, oversized concept cards, or under-detailed wireframes.

## Desktop Targets

### Viewport targets

- Desktop target width: `1440–1728`
- Primary design canvas: `1710 x 1112`
- Minimum practical desktop: `1440 x 900`
- Large desktop: `1728+`

### Shell dimensions

- Sidebar width: `216–240px`
- Topbar height: `56–64px`
- Page padding: `16–24px`
- Main content gap: `12–16px`
- Right rail width: `280–360px`
- Right rail preferred width: `300px`

### Layout rule

At `1710 x 1112` and above:

- sidebar should remain visible
- topbar should remain compact
- right rail should remain visible on major pages
- tables and detail sections should not feel squeezed
- the app must not look like a narrow centered mockup

## Typography Metrics

- Page title: `20–24px`
- Record title: `18–22px`
- Section title: `14–16px`
- Body font: `13–14px`
- Metadata label: `11–12px`
- Metadata value: `13–14px`
- Table font: `12–13px`
- Tab font: `13px`
- Button font: `12–14px`
- Badge font: `11–12px`

## Control Metrics

- Button height: `32–36px`
- Small button height: `28–32px`
- Input / select height: `32–36px`
- Card radius: `8–12px`
- Preferred standard radius: `10px`
- Dense card padding: `12–16px`
- Standard card padding: `16–20px`

## Sidebar Metrics

- Sidebar width: `216–240px`
- Parent item height: `34–38px`
- Child item height: `28–32px`
- Group spacing: `8–12px`
- Parent label size: `13px`
- Child label size: `12–13px`
- Child indent: `20–28px`

### Sidebar acceptance

- active parent is obvious
- active child is obvious
- disabled items are muted without becoming noisy
- long descriptions do not fill the sidebar
- the sidebar scrolls cleanly on smaller heights

## Topbar Metrics

- Topbar height: `56–64px`
- Breadcrumb band: `20–24px`
- Search control height: `32–36px`
- Toolbar chip height: `28–32px`
- Avatar or context pill height: `28–32px`

### Topbar acceptance

- the topbar reads as a workspace toolbar, not a large form block
- major controls fit on desktop without wasting height
- controls wrap cleanly on tablet

## Detail Page Metrics

- Detail field row height: `36–44px`
- Metadata strip item height: `32–40px`
- Summary section gap: `12–16px`
- Action bar gap: `8–12px`
- Tabs per real detail page: `4–9`
- Right rail sections: `2–5`
- Primary action max: `1–2`
- Secondary actions max: `3–6`

### Major detail page rule

Real major pages should include:

- breadcrumb
- record title
- status badge
- summary metadata
- action bar
- tabs
- information sections
- related records table
- activity timeline or log
- right context rail

## Table Metrics

- Header height: `36–40px`
- Table row height: `40–48px`
- Dense row height: `36–40px`
- Cell padding X: `12–16px`
- Cell padding Y: `8–12px`
- Table action column: compact, right aligned

### Table acceptance

- 8–10 rows should be readable on desktop without visual clutter
- row labels should look operational, not decorative
- borders should be subtle
- horizontal scroll is allowed on tablet/mobile

## Responsive Metrics

### Tablet

- Sidebar becomes drawer or compact rail
- Right rail moves below content or becomes secondary panel
- Main content collapses to one or two columns
- Tables can scroll horizontally
- Action bar can wrap

### Mobile

- Navigation becomes compact topbar + drawer pattern
- Tabs can scroll horizontally
- Action bar wraps
- Right rail moves below main content
- No destructive overflow or clipped content

## Acceptance Checklist

Use this checklist before shipping UI changes:

- Does it look like real B-end software?
- Does it have enough operational detail?
- Is it usable by branch managers, HR, finance, and operations users?
- Does it avoid demo words in customer-visible surfaces?
- Does it avoid landing-page styling inside the application shell?
- Does it support customer-facing production use?
- Does it preserve desktop, tablet, and mobile behavior?

If the answer is no to any of the above, the page is not ready.
