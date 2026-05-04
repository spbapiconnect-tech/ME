# ME Git Checkpoints

## Required Tags

- `v0.0.1-project-init`: base Next.js structure and ME metadata
- `v0.1.0-theme-system`: bright, dark, and moon theme system
- `v0.1.1-language-system`: bilingual language switching
- `v0.2.0-responsive-shell`: mobile, tablet, and desktop shell placeholders
- `v0.2.1-module-registry`: typed module registry and dashboard cards

## Checkpoint Rules

- Create a commit before creating a tag
- Keep tag descriptions focused on a stable milestone
- Use tags for rollback and visual regression comparison
- Avoid tagging incomplete or mixed-scope work

## Example Commands

```bash
git add .
git commit -m "feat: add ME theme system"
git tag -a v0.1.0-theme-system -m "ME theme system stable checkpoint"
```
