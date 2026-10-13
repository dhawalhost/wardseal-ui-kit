# @dhawalhost/wardseal-ui-kit

**WardSeal brand UI library — source of truth** for components, tokens, layouts, and themes across the WardSeal ecosystem.

- React 18 + Tailwind + Radix
- Light-first navy + blue CTA (see `THEMES.md`, `LAYOUT.md`)
- Dual theme via `ThemeProvider` (`.light` / `.dark`)

Monorepo apps (`wardseal/web/*`) consume a **workspace mirror** at `wardseal/web/ui`. Edit **this repo**, then sync into `web/ui`.

### Documentation map

| Doc | Purpose |
|-----|---------|
| **[MAINTENANCE.md](./MAINTENANCE.md)** | **What to update where** — sync workflow, anti-patterns |
| **[THEMES.md](./THEMES.md)** | Tokens, light/dark, white-label |
| **[LAYOUT.md](./LAYOUT.md)** | PageLayout, Grid, Section, Stack, Container |
| `src/styles/tokens.css` | Authoritative CSS variables |

## Install

```ini
# .npmrc
@dhawalhost:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

```bash
npm install @dhawalhost/wardseal-ui-kit
```

## Quick start

```tsx
// main.tsx
import "@dhawalhost/wardseal-ui-kit/tokens.css";
import { ThemeProvider } from "@dhawalhost/wardseal-ui-kit";

<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>
```

```js
// tailwind.config.js
import { tailwindPreset } from "@dhawalhost/wardseal-ui-kit/tailwind-preset";

export default {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@dhawalhost/wardseal-ui-kit/dist/**/*.js"],
};
```

Plus Jakarta Sans is pulled in by `tokens.css`. Prefer that over Inter.

## Layout system

See **[LAYOUT.md](./LAYOUT.md)** for `PageLayout`, `PageHeader`, `Container`, `Stack`, `Section`, `Grid`.

```tsx
import {
  AdminShell,
  PageLayout,
  PageHeader,
  Section,
  Grid,
  GridItem,
  StatCard,
} from "@dhawalhost/wardseal-ui-kit";
```

## Themes & tokens

See **[THEMES.md](./THEMES.md)**.

| Role | Token | Tailwind |
|------|-------|----------|
| Navy ink | `--primary` | `bg-primary` |
| CTA blue | `--secondary` | `bg-secondary` |
| Soft tint | `--accent` | `bg-accent` |
| Page / card | `--background` / `--card` | `bg-background` / `bg-card` |
| Spacing | `--space-page` etc. | `p-page`, `gap-section`, `p-card` |

JS helpers: `import { brandHex, space, tokenMeta } from "@dhawalhost/wardseal-ui-kit"`.

## Package exports

| Export | Purpose |
|--------|---------|
| `@dhawalhost/wardseal-ui-kit` | Components + layouts |
| `@dhawalhost/wardseal-ui-kit/tokens.css` | Design tokens only |
| `@dhawalhost/wardseal-ui-kit/styles.css` | Tokens + base utilities |
| `@dhawalhost/wardseal-ui-kit/tailwind-preset` | Tailwind preset |

## Develop

```bash
npm install
npm run storybook   # Light theme default; toggle in toolbar
npm run build
```

### Sync into WardSeal monorepo

See **[MAINTENANCE.md](./MAINTENANCE.md)** for the full matrix. Short form:

```bash
rsync -a --delete --exclude '.DS_Store' src/ ../wardseal/web/ui/src/
# bump package.json version in BOTH repos to the same value
```

## Publish

```bash
git tag ui/v0.2.0
git push origin ui/v0.2.0
```

## Rules

1. This kit is SoT — product apps should not fork tokens/layouts long-term.
2. No hard-coded emerald/neon or `border-white/5` surfaces — use tokens.
3. Default CTA buttons use `variant="secondary"` (blue).
