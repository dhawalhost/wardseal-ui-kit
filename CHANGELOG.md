# Changelog

All notable changes to `@dhawalhost/wardseal-ui-kit`.

## 0.3.0 — 2026-11-03

Accessibility and token release. Every text, control-border and status pair now
meets WCAG 2.2 AA in light and dark, guarded by `npm run check:tokens`.

### Tokens
- **New** `--on-surface-subtle` (`text-on-surface-subtle`) — tertiary text tier, ≥4.5:1. Replaces `text-on-surface-variant/30…/60`.
- **New** `--{success,warning,error,info}-subtle-foreground` — text on the `*-subtle` tints, ≥4.5:1.
- **New** motion tokens `--duration-fast|base|slow`, `--ease-standard|enter|exit` and Tailwind `duration-*` / `ease-*` utilities.
- **New** `--radius-3xl`, `--radius-full`; `text-label` (12px/600) font size.
- **New** animations `fade-out`, `scale-out`, `slide-in|out-{left,right,top,bottom}`. `fade-out` was referenced by components but never defined, so close animations silently did nothing.
- **Changed** `--input` / `--outline` darkened to ≥3:1 (control borders were 1.17:1).
- **Changed** light `--success` → `#157F3C`, `--warning` → `#B35309` (white text now ≥5:1). These match the values `tokens.ts` already documented.
- **Changed** dark `--success|warning-foreground` → dark ink (white failed at 2.7–3.4:1).
- **Changed** `--destructive` is now an alias of `--error`.
- **Changed** keyframes use standalone `scale` / `translate`, so they no longer overwrite positioning transforms. This fixes centred dialogs flashing from the corner while opening.
- **Changed** animations 300ms → 150–200ms (per DESIGN.md).
- **Fixed** `tokens.ts` hex values now equal the CSS exactly; added `brandHexDark`, `motion`.
- Radius, spacing, type and motion tokens are defined once in `:root`, no longer duplicated in `.dark`.

### Components
- **Form** — `FormField` now generates ids and wires `Label` (`htmlFor`, required marker), `FormDescription` and `FormMessage` (`aria-describedby`), and `error` → `aria-invalid` on `Input` / `SelectTrigger`. New: `FormDescription`, `FormMessage`, `useFormField`, `useFormControlProps`. `FormSection` is a named `role="group"` with `titleAs`.
- **Input** — `--input` border, `focus-visible:ring-2`, invalid state from `aria-invalid`, standalone `error` linked and announced, read-only style. Exports `controlBaseClass`.
- **Label** — 12px semibold, secondary tier, sentence case (was 10px uppercase at 60% opacity). New `required` prop.
- **Select** — shares the input surface; 14px items; solid popover with `shadow-overlay`.
- **Dialog / Sheet** — close button always visible, 32px, named; new `showClose`, `closeLabel`. Sheets slide from their edge. Dialogs keep a 16px gutter and scroll when tall.
- **Popover** — solid surface + exit animation; exports `PopoverAnchor`, `PopoverClose`.
- **Tooltip** — inverse surface, 12px sentence case, portalled.
- **Dropdown** — 14px items, unified highlight, new `variant="destructive"` item.
- **Toast** — new `info` and `warning` variants; `success` is green (was navy); close button always visible and named; destructive toasts are assertive, others polite.
- **CommandMenu** — WAI-ARIA combobox + listbox with `aria-activedescendant`, Home/End, live result count, dialog title, `label` / `emptyMessage` / `enableShortcut` props.
- **SkipLink** — new.
- **AdminShell** — mobile drawer is now a modal `Sheet` (focus trap, Esc, focus return; the closed drawer is out of the tab order). `nav` landmark, `aria-current="page"` with an indicator bar, named icon buttons, skip link. New props `unreadNotifications`, `searchLabel`, `mainId`, `NavigationItem.badgeLabel`.
- **PortalLayout** — `aria-current` with underline, status announced in text, mobile tab strip, skip link. New props `complianceBadges`, `mainId`.
- `cn()` now knows the preset's custom scales (`text-label`, `shadow-card`, `p-card`, `duration-fast`…). Previously tailwind-merge dropped `text-label` as a colour conflict.
- All overlays and glass surfaces use solid fills and `shadow-overlay`; no `backdrop-blur`.

### Migration from 0.2.x
1. **Faded text:** replace `text-on-surface-variant/{30,40,50,60}` with `text-on-surface-subtle`, and `/70`–`/80` with `text-on-surface-variant`.
2. **Status text on tints:** use `text-{status}-subtle-foreground` on `bg-{status}-subtle`.
3. **PortalLayout:** the footer no longer shows SOC 2 / ISO 27001 / CCPA by default. Pass `complianceBadges={[…]}` with only the attestations the deployment holds. The node indicator now renders only when `nodeName` is passed.
4. **AdminShell:** the notification dot only shows when `unreadNotifications > 0`.
5. **Toast:** `variant="success"` changes from navy to green. Widen app-side `ToastProps` to include `"info" | "warning"` to use the new variants.
6. **CommandMenu:** default placeholder is now “Search commands…”, and options are no longer individual Tab stops (focus stays in the search box; this is intentional).
7. **Visual:** control borders are darker, menu items 12px → 14px, labels are sentence case.

No exports were removed.

## 0.2.1
- Restore navy logo, add scroll `viewportRef`, glass card aliases, docs.

## 0.2.0
- Initial published release.
