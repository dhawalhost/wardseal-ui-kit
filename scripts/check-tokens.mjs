#!/usr/bin/env node
/**
 * Token guard — run with `npm run check:tokens`.
 *  1. tokens.ts hex values must equal the sRGB conversion of tokens.css HSL.
 *  2. Contrast contract in tokens.css header must hold in light and dark.
 * Exits non-zero on any failure.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "src/styles/tokens.css"), "utf8");
const ts = readFileSync(join(root, "src/tokens.ts"), "utf8");

function block(selector) {
  const start = css.indexOf(selector + " {");
  if (start < 0) throw new Error(`selector not found: ${selector}`);
  const body = css.slice(start, css.indexOf("\n}", start));
  const vars = {};
  for (const [, k, v] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[k] = v.trim();
  return vars;
}

function resolve(vars, k) {
  let v = vars[k];
  const ref = v && v.match(/^var\(--([\w-]+)\)$/);
  return ref ? resolve(vars, ref[1]) : v;
}

function hslToRgb(v) {
  const m = v.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!m) return null;
  const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const hue = (t) => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
}

const hex = (rgb) => "#" + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, "0").toUpperCase()).join("");
const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const themes = {
  light: { vars: block(":root,\n.light"), tsExport: "brandHex" },
  dark: { vars: block(".dark"), tsExport: "brandHexDark" },
};

// camelCase TS key → CSS var
const tsToCss = {
  primary: "primary", onPrimary: "on-primary", secondary: "secondary", onSecondary: "on-secondary",
  accent: "accent", background: "background", foreground: "foreground", card: "card",
  muted: "muted", mutedForeground: "muted-foreground", subtleForeground: "on-surface-subtle",
  border: "border", input: "input", ring: "ring", destructive: "destructive",
  success: "success", successSubtle: "success-subtle", successSubtleForeground: "success-subtle-foreground",
  warning: "warning", warningSubtle: "warning-subtle", warningSubtleForeground: "warning-subtle-foreground",
  error: "error", errorSubtle: "error-subtle", errorSubtleForeground: "error-subtle-foreground",
  info: "info", infoSubtle: "info-subtle", infoSubtleForeground: "info-subtle-foreground",
};

const textSurfaces = ["card", "background", "muted", "surface-container-high"];
const contract = [
  ...["on-surface", "on-surface-variant", "on-surface-subtle", "muted-foreground"].flatMap((fg) =>
    textSurfaces.map((bg) => [fg, bg, 4.5])),
  ...["outline", "input"].flatMap((fg) => ["card", "background"].map((bg) => [fg, bg, 3])),
  ["ring", "card", 3], ["ring", "background", 3],
  // status colours are also used as plain text on cards (`text-destructive` etc.)
  ...["success", "warning", "error", "info"].flatMap((s) => ["card", "background"].map((bg) => [s, bg, 4.5])),
  // inline field errors sit on card/background, invalid borders need 3:1
  ...["card", "background"].flatMap((bg) => [
    ["error-subtle-foreground", bg, 4.5],
    ["error", bg, 3],
  ]),
  ["on-primary", "primary", 4.5], ["on-secondary", "secondary", 4.5],
  ["on-primary-container", "primary-container", 4.5],
  ["on-secondary-container", "secondary-container", 4.5],
  ["accent-foreground", "accent", 4.5],
  ["on-surface-inverse", "surface-inverse", 4.5],
  ...["success", "warning", "error", "info"].flatMap((s) => [
    [`${s}-foreground`, s, 4.5],
    [`${s}-subtle-foreground`, `${s}-subtle`, 4.5],
  ]),
];

let failures = 0;
const fail = (msg) => { failures++; console.error("✗ " + msg); };

for (const [name, { vars, tsExport }] of Object.entries(themes)) {
  // inherit theme-independent / light values for vars a theme doesn't override
  const all = name === "dark" ? { ...themes.light.vars, ...vars } : vars;
  const rgb = (k) => {
    const v = resolve(all, k);
    const c = v && hslToRgb(v);
    if (!c) throw new Error(`[${name}] --${k} is not an HSL channel triplet: ${v}`);
    return c;
  };

  const exp = ts.match(new RegExp(`export const ${tsExport} = \\{([\\s\\S]*?)\\}`));
  if (!exp) { fail(`[${name}] export ${tsExport} not found in tokens.ts`); continue; }
  for (const [, key, value] of exp[1].matchAll(/(\w+):\s*"(#[0-9A-Fa-f]{6})"/g)) {
    const cssVar = tsToCss[key];
    if (!cssVar) { fail(`[${name}] tokens.ts key "${key}" has no CSS mapping in check-tokens.mjs`); continue; }
    const expected = hex(rgb(cssVar));
    if (value.toUpperCase() !== expected) fail(`[${name}] ${tsExport}.${key} = ${value}, tokens.css --${cssVar} = ${expected}`);
  }

  for (const [fg, bg, min] of contract) {
    const r = ratio(rgb(fg), rgb(bg));
    if (r < min) fail(`[${name}] --${fg} on --${bg}: ${r.toFixed(2)}:1 < ${min}:1`);
  }
}

if (failures) {
  console.error(`\n${failures} token check(s) failed.`);
  process.exit(1);
}
console.log(`✓ tokens.ts in sync and ${contract.length * 2} contrast pairs pass (light + dark).`);
