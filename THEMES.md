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
| Primary text | `--on-surface` | `#080C16` | Body copy, headings (≥15:1) |
| Secondary text | `--on-surface-variant` / `--muted-foreground` | `#4B5768` | Descriptions, labels (≥7:1) |
| Tertiary text | `--on-surface-subtle` | `#5A6677` | Captions, placeholders, table headers (≥4.5:1) |
| Control border | `--input` / `--outline` | `#7A8A9F` | Input, select, checkbox, switch borders (≥3:1) |
| Divider | `--border` / `--outline-variant` | `#E1E7EF` | Decorative lines only |
| Focus | `--ring` | `#0369A0` | `focus-visible:ring-2` (≥3:1) |
| Status fill | `--success` `--warning` `--error` `--info` | `#157F3C` `#B35309` `#DC2828` `#0369A0` | Solid badges/buttons, with `--{status}-foreground` |
| Status tint | `--{status}-subtle` + `--{status}-subtle-foreground` | — | Toasts, inline errors, soft badges (≥4.5:1) |

`--destructive` is an alias of `--error` (shadcn compat). In dark mode the bright
status fills take dark ink foregrounds because white fails on them.

All channel values are HSL **without** `hsl()`, so opacity works: `hsl(var(--secondary) / 0.1)`.

### Contrast contract

Opacity is for **fills only**. Never fade text or control borders with `/NN`
(`text-on-surface-variant/40` measured 1.9:1). Pick the tier that carries the
contrast you need. `npm run check:tokens` verifies every pair in light and dark,
and that `src/tokens.ts` hex matches the CSS. It runs before every publish.

## Spacing

| Token | Value | Utility |
|-------|-------|---------|
| `--space-page` | 40px | `p-page`, `gap-page` |
| `--space-section` | 32px | `gap-section` |
| `--space-card` | 24px | `p-card`, `gap-card` |

Plus standard scale: `--space-xs` … `--space-3xl`.

Radius, spacing, type and motion are theme-independent and live in `:root` only.

## Motion

| Token | Value | Utility |
|-------|-------|---------|
| `--duration-fast` | 150ms | `duration-fast` — hovers, exits |
| `--duration-base` | 200ms | `duration-base` / default `transition` — enters |
| `--duration-slow` | 300ms | `duration-slow` — sheets entering |
| `--ease-standard` / `--ease-enter` / `--ease-exit` | cubic-bezier | `ease-standard`, `ease-enter`, `ease-exit` |

Animations: `animate-fade-in|out`, `animate-scale-in|out`, `animate-slide-up`,
`animate-slide-in|out-{left,right,top,bottom}`. Keyframes use the standalone
`scale` / `translate` properties so they compose with positioning transforms.
`prefers-reduced-motion` collapses all of them (see `global.css`).

## Type

`text-label` — 12px / 600 — the floor for UI labels, table headers and captions.

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
- [ ] Focus uses `focusRing` from `src/lib/styles.ts` (`focus-visible:ring-2 ring-ring` + offset)
- [ ] Floating surfaces use `overlaySurface` (solid fill, `shadow-overlay`) — no glass blur
- [ ] No `/NN` opacity on text or control borders; no text below 12px
- [ ] Icon-only buttons have an accessible name
- [ ] New custom Tailwind scales are registered in `src/lib/utils.ts` (tailwind-merge)
- [ ] `npm run check:tokens` passes
- [ ] Works in both Storybook Light and Dark toolbar modes
