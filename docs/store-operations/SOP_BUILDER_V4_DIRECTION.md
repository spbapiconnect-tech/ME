# SOP Builder V4 Direction

## Goal

SOP Builder V4 should feel like writing a real staff handbook, not filling a backend form.

The core layout is:

    Pages / Outline | Document Canvas | Resizable Preview

SOP setup must stay inside Settings, not as a permanent column.

## Main Principles

1. The center canvas is the main working area.
2. Staff reading preview is helpful, but should be resizable / collapsible.
3. SOP setup belongs in Settings drawer.
4. Content should be created with slash command.
5. Media should appear inline, directly below text or inside step blocks.
6. Blocks should not look like big backend forms.
7. Step-by-step can include image, GIF, video, checklist, or proof requirement.
8. Mobile staff view is separate from manager builder view.

## Canvas Behavior

User can type normally.

Typing "/" opens command menu.

Commands:

    /text
    /heading
    /step
    /image
    /gif
    /video
    /pdf
    /warning
    /checklist
    /proof
    /acknowledgement

## SOP Sections

Use business-friendly section types:

- Instruction
- Step-by-step
- Photo / GIF guide
- Training video
- PDF / document
- Warning / common mistake
- Checklist
- Required proof
- Acknowledgement

Avoid technical labels such as raw block, assetUrl, body, or field.

## Step Block

Step block should support:

- Step title
- Step instruction
- Optional image / GIF
- Optional video
- Optional checklist
- Optional proof requirement

Example:

    Step 1: Prepare station
    Media: station setup photo
    Staff action: check ingredients

    Step 2: Build burger
    Media: burger build GIF
    Staff action: follow ingredient order

## Preview Behavior

Preview should support:

- Resizable width
- Collapse / expand
- Phone / tablet / desktop mode
- Open full reading preview
- Show broken media warning
- Show acknowledgement requirement

## Settings Drawer

Settings contains:

- SOP title
- Code
- Version
- Category
- Process area
- Owner
- Approver
- Target outlet
- Target role
- Acknowledgement required
- Training required
- Review cycle
- Publish rule

## Implementation Order

1. Create command map.
2. Create editor block model.
3. Create V4 canvas shell.
4. Add slash command menu.
5. Add inline media placeholder.
6. Add resizable preview.
7. Replace V3 only after V4 is usable.
