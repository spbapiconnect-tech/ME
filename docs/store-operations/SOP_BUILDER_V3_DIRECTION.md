# SOP Builder V3 Direction

## Why V3

The current SOP builder is too form-heavy.

It forces users to manage SOP setup fields, page blocks, block types, and employee preview all at the same time.

This makes SOP creation feel like a backend configuration panel instead of writing a useful staff handbook.

## New Builder Structure

SOP Builder V3 should follow an IDE-style layout:

    Sidebar | Builder Canvas | Employee View

Not:

    SOP Setup | Block Form | Preview

## Top Bar

Always visible:

- Back
- SOP Title
- Status
- Settings
- Preview
- Publish / Create SOP

The setup fields should not occupy a permanent column.

## Left Sidebar

Purpose:

- Page list
- Section outline
- Publish status shortcut

Example:

- Page 1: What staff need to know
- Page 2: Step-by-step execution
- Page 3: Photo / video guide
- Page 4: Checklist

## Center Builder Canvas

This is the main working area.

It should feel like writing a handbook.

User actions:

- Write page title
- Write content
- Insert section
- Reorder sections later

Insert section types:

- Instruction Text
- Step by Step
- Photo / GIF Guide
- Training Video
- PDF / Document
- Warning / Risk
- Checklist

Do not show all block buttons permanently.

Use:

    + Insert Section

Later, this can become a slash command:

    /step
    /image
    /video
    /warning
    /checklist
    /pdf

## Right Employee View

Purpose:

- Show how staff will read it
- Show publish readiness
- Show broken media warning
- Show acknowledgement checklist

It should not look like a form.

It should look like a phone reader preview.

## SOP Setup Placement

SOP setup should move into a Settings drawer.

Fields inside Settings:

- SOP Title
- Document Code
- Version
- Category
- Process Area
- Owner
- Approver
- Target Outlet
- Target Role
- Acknowledgement Required
- Training Required
- Review Cycle
- Review Due Date

This drawer opens only when needed.

## Rule

The builder should focus on writing.

Settings are secondary.

Preview is for confidence.

Publish readiness is for control.

## Implementation Plan

### Phase 1

Do not replace the old builder yet.

Create a new isolated component:

    components/sop/sop-builder-workspace-v3.tsx

It should not be connected to /sop yet.

### Phase 2

Connect V3 only when build is stable.

Old builder remains as fallback.

### Phase 3

Move media preview to API-backed asset URLs.

Blob URLs are temporary and not reliable.

### Phase 4

Move SOP Types and Templates into Master Data / API.

