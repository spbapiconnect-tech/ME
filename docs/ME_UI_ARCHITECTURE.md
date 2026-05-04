# ME UI Architecture

## Foundation Layers

1. `app/`: Next.js App Router entry points and global styles
2. `components/`: dashboard, switchers, module cards, and shell placeholders
3. `config/`: typed module registry as the single source for module metadata
4. `messages/`: English and Chinese message catalogs
5. `types/`: platform contracts for modules, page schema, permissions, and source mapping
6. `stores/`: lightweight client preferences for theme and language

## Key Principles

- Read modules from config, never from hardcoded page arrays
- Read labels from message catalogs, never from scattered inline strings
- Read theme colors from CSS variables, never from component-level hardcoded colors
- Keep shell components responsive and placeholder-only in this milestone

## Responsive Strategy

- `MobileShell`: compact navigation-first placeholder shell
- `TabletShell`: sidebar + workspace placeholder shell
- `DesktopShell`: sidebar + canvas + rail placeholder shell
- `ResponsiveShell`: chooses the active shell by viewport width while preserving one dashboard content model
