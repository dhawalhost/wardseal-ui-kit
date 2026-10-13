# WardSeal themes & tokens

**Source of truth:** `src/styles/tokens.css` in `@dhawalhost/wardseal-ui-kit`.

## Architecture

```
tokens.css          ← CSS variables (light :root / .light, dark .dark)
    ↓
tailwind-preset.ts  ← maps vars → Tailwind utilities (bg-primary, p-card, …)
    ↓
components/*        ← only use Tailwind token classes or hsl(var(--…))
ThemeProvider       ← toggles .light / .dark on <html>
```

Apps never redefine brand colors ad hoc. Override by swapping `tokens.css` or setting CSS variables on a scoped parent if you need a white-label skin.

## Color roles

| Role | CSS var | Light (approx) | Use for |
|------|---------|----------------|---------|
| Ink / strong | `--primary` | `#0F172A` | Headings, dark buttons |
| **CTA** | `--secondary` | `#0369A1` | Primary actions (MASTER “Accent”) |
| Soft fill | `--accent` | sky tint | Subtle backgrounds — **not** buttons |
| Page | `--background` | `#F8FAFC` | App canvas |
| Card | `--card` | `#FFFFFF` | Panels |
| Muted text | `--muted-foreground` | slate | Descriptions |
| Border | `--border` | slate-200 | Dividers |
| Success / Warning / Danger / Info | `--success` etc. | semantic | Status only |

All channel values are HSL **without** `hsl()`, so opacity works: `hsl(var(--secondary) / 0.1)`.

## Spacing

| Token | Value | Utility |
|-------|-------|---------|
| `--space-page` | 40px | `p-page`, `gap-page` |
| `--space-section` | 32px | `gap-section` |
| `--space-card` | 24px | `p-card`, `gap-card` |

Plus standard scale: `--space-xs` … `--space-3xl`.

## Switching themes

```tsx
import { ThemeProvider } from "@dhawalhost/wardseal-ui-kit";
import "@dhawalhost/wardseal-ui-kit/tokens.css";

<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>
```

`ThemeProvider` toggles `light` / `dark` on `document.documentElement`. Defaults to **light**.

## Custom brand skin (white-label)

Override variables after importing tokens:

```css
.tenant-acme {
  --secondary: 262 83% 48%;
  --ring: 262 83% 48%;
  --secondary-container: 270 100% 96%;
}
```

```tsx
<div className="tenant-acme">…</div>
```

Components keep working because they only reference tokens.

## Checklist for new components

- [ ] No raw hex except chart/avatar palettes from `tokens.ts` / MASTER
- [ ] No `border-white/*`, `bg-black/*` for surfaces (use `border-border`, `bg-card`, `bg-muted`)
- [ ] Overlays use `.overlay-scrim` (theme `--overlay`)
- [ ] Padding uses `p-6` / `p-card` / layout primitives
- [ ] Focus uses `ring-ring` + `ring-offset-background`
- [ ] Works in both Storybook Light and Dark toolbar modes
