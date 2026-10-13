# Maintenance guide — what to update where

This document is the **operating manual** for the WardSeal brand UI system. Follow it so tokens, components, and product apps stay in sync.

---

## Repositories & roles

| Location | Role | Edit here? |
|----------|------|------------|
| **`wardseal-ui-kit`** (this repo) | **Source of truth** — tokens, Tailwind preset, components, layouts, Storybook | **Yes — always start here** |
| **`wardseal/web/ui`** | Workspace **mirror** so monorepo apps resolve `@dhawalhost/wardseal-ui-kit` via symlink | **No** (overwrite from kit) |
| **`wardseal/web/admin`** (and `app`, `id`, …) | Product apps — pages, routes, API wiring | App logic only; import kit for UI |
| **`wardseal/design-system/wardseal/MASTER.md`** | Brand intent (palette, type, spacing philosophy) | When brand strategy changes; then update kit tokens to match |

```
wardseal-ui-kit  ──sync──►  wardseal/web/ui  ──import──►  admin / app / id / …
      ▲                              │
      │                              └── package name: @dhawalhost/wardseal-ui-kit
      └── also publish to GitHub Packages (optional for external / CI)
```

**Rule:** Never invent a second palette or layout system inside an app. If something is missing, add it to the kit, sync, then use it.

---

## “I want to change X” → update Y

### Colors / theme / spacing / fonts

| Goal | Edit these files (in **ui-kit**) | Also update |
|------|----------------------------------|-------------|
| Brand colors (navy, CTA blue, surfaces) | `src/styles/tokens.css` (both `:root,.light` and `.dark`) | `src/tokens.ts` (`brandHex`), `THEMES.md` table, optionally `MASTER.md` |
| Soft fill vs CTA meaning | `tokens.css` + comment in `THEMES.md` | `MASTER.md` runtime mapping note |
| Spacing (page / section / card) | `tokens.css` (`--space-*`) | `src/tokens.ts` (`space`), `LAYOUT.md`, Tailwind still maps via preset |
| Radius / shadows | `tokens.css` | `src/tokens.ts` (`radius`) if documented |
| Font family | `tokens.css` (`--font-display`) | `src/tailwind-preset.ts` `fontFamily`, `src/tokens.ts` |
| New semantic color (e.g. `info`) | `tokens.css` + `src/tailwind-preset.ts` `colors` | Story / docs |
| Default theme (light vs dark) | `src/components/ThemeProvider/ThemeProvider.tsx` | `.storybook/preview.ts`, `THEMES.md` |

**Do not** put brand hex in component `className`s. Use `bg-primary`, `text-muted-foreground`, etc.

**Button / on-* text:** use `text-primary-foreground` and `text-secondary-foreground` (not `text-on-primary`). Storybook’s Tailwind config only reliably emits the `*-foreground` utilities from the nested color map.

After token changes: **Storybook Light + Dark**, then **sync → web/ui**, then hard-refresh admin.

---

### Tailwind utilities (how tokens become classes)

| Goal | Edit |
|------|------|
| Map CSS vars → `bg-*` / `p-card` / `gap-section` | `src/tailwind-preset.ts` |
| App-only one-off utilities | Prefer kit preset; if app-specific, `web/admin/tailwind.config.js` `theme.extend` only |

Apps must use:

```js
presets: [tailwindPreset] // from @dhawalhost/wardseal-ui-kit/tailwind-preset
```

---

### Components (Button, Card, Dialog, …)

| Goal | Edit |
|------|------|
| Look / variants / a11y of a primitive | `src/components/<Name>/<Name>.tsx` |
| Stories | `src/components/<Name>/<Name>.stories.tsx` |
| Export public API | `src/index.ts` |

Checklist before merging:

- [ ] Uses tokens only (no `border-white/5`, neon hex)
- [ ] Works in Storybook **Light** and **Dark**
- [ ] Exported from `src/index.ts` if public
- [ ] Sync to `web/ui`

---

### Layouts (page structure)

| Goal | Edit |
|------|------|
| Page gutters / max width | `src/layouts/PageLayout/PageLayout.tsx` |
| Page title block | `src/layouts/PageHeader/PageHeader.tsx` |
| Width-only wrapper | `src/layouts/Container/Container.tsx` |
| Flex rhythm | `src/layouts/Stack/Stack.tsx` |
| Labeled section | `src/layouts/Section/Section.tsx` |
| 12-col grid | `src/components/Grid/Grid.tsx` |
| Admin chrome | `src/layouts/AdminShell/AdminShell.tsx` |
| Portal chrome | `src/layouts/PortalLayout/PortalLayout.tsx` |
| How to compose pages | `LAYOUT.md` + `src/layouts/Layout.stories.tsx` |

**Apps:** wrap page content in `PageLayout`. Do not add padding on `AdminShell` main.

---

### Product app screens (dashboard, users, …)

| Goal | Where |
|------|-------|
| Page content, data fetching, routes | `wardseal/web/admin/src/pages/…` (or app/id) |
| Reuse kit layout | `import { PageLayout, PageHeader, … } from '@dhawalhost/wardseal-ui-kit'` |
| Local one-off UI that might be shared | Promote into kit first, then import |

**Avoid:** long-lived forks of `PageLayout` / tokens inside the app. Temporary local wrappers are OK only until migrated.

---

### Docs

| Doc | Update when |
|-----|-------------|
| `THEMES.md` | Token roles, theme behavior, white-label |
| `LAYOUT.md` | Layout recipe / primitives |
| `MAINTENANCE.md` (this file) | New repos, new sync steps, new “what to update” rows |
| `README.md` | Install, exports, quick start |
| `MASTER.md` (wardseal) | Brand strategy / hex intent (not day-to-day CSS) |

---

## Sync workflow (kit → monorepo)

Assume sibling folders:

```text
~/go/src/wardseal-ui-kit
~/go/src/wardseal
```

### 1. Change & verify in the kit

```bash
cd ~/go/src/wardseal-ui-kit
npm install
npm run storybook    # verify Light + Dark
npm run build
```

### 2. Mirror into WardSeal

```bash
cd ~/go/src/wardseal-ui-kit
rsync -a --delete --exclude '.DS_Store' src/ ../wardseal/web/ui/src/
```

Bump version in **both** `package.json` files to the same value (e.g. `0.3.0` → `0.3.1`).

Keep `wardseal/web/ui/package.json` **exports** pointing at `./src/…` (workspace-friendly). Do not replace that file with the kit’s publish-oriented `package.json`.

### 3. Verify product apps

```bash
cd ~/go/src/wardseal/web
# admin already depends on @dhawalhost/wardseal-ui-kit → symlink to web/ui
# hard-refresh manage.wardseal.local
```

Confirm admin loads:

```css
@import '@dhawalhost/wardseal-ui-kit/tokens.css';
```

### 4. Optional: publish the kit

```bash
cd ~/go/src/wardseal-ui-kit
npm run build
git tag ui/v0.3.1
git push origin ui/v0.3.1
```

External consumers / CI that are not in the monorepo install from GitHub Packages.

---

## Versioning

| Change type | Version bump |
|-------------|--------------|
| Token / visual bugfix | patch (`0.3.0` → `0.3.1`) |
| New component / layout / token | minor (`0.3.0` → `0.4.0`) |
| Breaking API / rename tokens | major (`0.x` → `1.0.0`) |

Keep **ui-kit** and **web/ui** versions identical after every sync.

---

## Anti-patterns (do not)

| Don’t | Do instead |
|-------|------------|
| Edit colors only in `web/admin/src/index.css` | Edit `ui-kit` `tokens.css`, sync |
| Copy a Button into admin and diverge | Fix kit Button, sync, import |
| Emerald / neon hex in components | Brand tokens only |
| Pad `AdminShell` main | Use `PageLayout` |
| Two packages named `@dhawalhost/wardseal-ui-kit` with different themes | One SoT (this repo) + mirror |

---

## Quick reference card

```text
Colors / spacing / fonts     →  src/styles/tokens.css  (+ tokens.ts, THEMES.md)
Tailwind mapping             →  src/tailwind-preset.ts
Component look               →  src/components/...
Page structure               →  src/layouts/...  (+ LAYOUT.md)
Theme toggle default         →  ThemeProvider + .storybook/preview.ts
Brand strategy (hex intent)  →  wardseal/design-system/wardseal/MASTER.md
App pages / API              →  wardseal/web/<app>/src/...
After kit edits              →  rsync → web/ui  →  bump versions  →  refresh apps
```
