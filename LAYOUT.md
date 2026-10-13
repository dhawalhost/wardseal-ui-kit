# WardSeal layout system

**Source of truth:** `@dhawalhost/wardseal-ui-kit`  
Use these primitives across admin, portal, and any brand app so spacing and structure stay consistent.

## Tokens (do not hardcode)

| Token | Value | Tailwind |
|-------|-------|----------|
| `--space-page` | 40px | `p-page` / `gap-page` / `space-y-page` |
| `--space-section` | 32px | `gap-section` |
| `--space-card` | 24px | `p-card` / `gap-card` |

Apps must load tokens:

```ts
import "@dhawalhost/wardseal-ui-kit/tokens.css";
```

Tailwind:

```js
import { tailwindPreset } from "@dhawalhost/wardseal-ui-kit/tailwind-preset";
export default { presets: [tailwindPreset], /* ... */ };
```

## Brand color roles

| Role | Token | Usage |
|------|-------|--------|
| Navy ink | `--primary` | Strong text, dark actions |
| CTA blue | `--secondary` | Primary buttons / links (MASTER “accent”) |
| Soft tint | `--accent` | Subtle fills, not CTA |
| Surfaces | `--background` / `--card` | Page vs card |

Theme default is **light**. Toggle with `ThemeProvider`.

## Layout recipe (admin page)

```tsx
import {
  AdminShell,
  PageLayout,
  PageHeader,
  Section,
  Grid,
  GridItem,
  Stack,
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@dhawalhost/wardseal-ui-kit";

export function DashboardPage() {
  return (
    <AdminShell {/* nav props */}>
      <PageLayout>
        <PageHeader
          title="Dashboard"
          description="Monitor identities and security posture."
          actions={/* buttons */}
        />

        <Section title="Key metrics" srOnlyTitle>
          <Grid cols={{ base: 1, sm: 2, xl: 4 }} gap="section">
            <GridItem><StatCard label="Users" value={128} /></GridItem>
            <GridItem><StatCard label="Pending" value={3} variant="warning" /></GridItem>
            {/* ... */}
          </Grid>
        </Section>

        <Section title="Activity">
          <Grid cols={{ base: 1, lg: 12 }} gap="section">
            <GridItem span={{ base: 12, lg: 7 }}>
              <Card>
                <CardHeader><CardTitle>System activity</CardTitle></CardHeader>
                <CardContent>{/* chart */}</CardContent>
              </Card>
            </GridItem>
            <GridItem span={{ base: 12, lg: 5 }}>
              <Card>
                <CardHeader><CardTitle>Security posture</CardTitle></CardHeader>
                <CardContent>{/* score */}</CardContent>
              </Card>
            </GridItem>
          </Grid>
        </Section>
      </PageLayout>
    </AdminShell>
  );
}
```

## Primitives

| Component | Role |
|-----------|------|
| `AdminShell` / `PortalLayout` | App chrome — **no page padding** |
| `PageLayout` | Responsive gutters + 1280px column + section stack |
| `PageHeader` | Title, description, actions, optional icon/meta/breadcrumbs |
| `Container` | Width bound only (`sm`–`xl` / `full`) |
| `Stack` | Flex row/column with token gaps |
| `Section` | Labeled block inside a page |
| `Grid` / `GridItem` | 12-col responsive grid (`gap="page" \| "section" \| "card"`) |

## Rules

1. Never put `p-page` on `AdminShell` main — wrap page content in `PageLayout`.
2. Prefer `gap="section"` between cards; `p-6` / `p-card` inside cards.
3. Do not invent one-off max-widths; use `PageLayout` or `Container`.
4. Keep local app wrappers thin — fork only when the kit cannot express the need, then upstream.
