# CLAUDE.md — michelstorms.com

## Site Overview

Jekyll-based GitHub Pages site served from `stormychel/stormychel.github.io`. Custom domain: **michelstorms.com**.

All pages use inline `<style>` blocks (no external CSS files). Each page is a standalone HTML file.

## Design System

### Typography

- **Headings:** `Cormorant Garamond` (weights 600, 700) — serif, elegant
- **Body:** `Inter` (weights 300–600) — clean sans-serif
- Load via Google Fonts: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@300;400;500;600&display=swap`
- Heading letter-spacing: `-0.02em` to `-0.03em` (tight)
- Body line-height: `1.7`
- Base font size: `16px`
- `-webkit-font-smoothing: antialiased`

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--navy` | `#2d2e3a` | Primary text, dark backgrounds |
| `--navy-light` | `#3d3e4e` | Hover states on navy |
| `--navy-dark` | `#1a1b24` | Footer background |
| `--white` | `#ffffff` | Page background |
| `--off-white` | `#f8f8fa` | Card backgrounds, feature cards |
| `--gray-100` | `#f0f0f3` | Subtle background tints |
| `--gray-200` | `#e2e2e7` | Borders, dividers |
| `--gray-300` | `#c5c5ca` | Outline button borders, muted text in dark sections |
| `--gray-400` | `#8c8c92` | Footer text, secondary links |
| `--gray-500` | `#52525a` | Body text, descriptions |
| `--accent` | `#6366f1` | Default accent (indigo) — used on homepage, apps gallery |

Per-app accent overrides (set in `:root` on the app's landing page):
- **HoverCalc:** `--accent: #e07830` (orange), `--accent-light: #f0954a`
- **Unfold:** uses the default indigo `#6366f1`

### Layout

- Max content width: `1100px` (`.container`)
- Horizontal padding: `24px`
- Section vertical padding: `88px` (desktop), `64px` (tablet)

### Navigation

- Sticky top bar with `backdrop-filter: blur(12px)` and `rgba(255,255,255,0.92)` background
- Height: `64px`
- Logo in `Cormorant Garamond` bold, nav links in `Inter` 500
- Links: Home, Apps, Blog

### Page Structure (Product Landing Pages)

1. **Hero** — centered, gradient background (`white → off-white → gray-100`), decorative radial gradient circle. Contains: label (uppercase small text in accent color), `h1` title, subtitle paragraph, Mac App Store badge.
2. **Showcase** — dark (`--navy`) background, centered composite screenshot image.
3. **Features** — white background, centered header (label + title + subtitle), 3-column grid of feature cards. Each card: icon box (44px, navy bg, white SVG), heading, description.
4. **CTA** — dark (`--navy`) background, centered label + title + subtitle + App Store badge.
5. **Footer** — `--navy-dark` background. Three items in a row: copyright, legal links (underlined), email.

### Components

**Feature cards:** `--off-white` background, `1px solid --gray-200` border, `16px` border-radius, `32px 28px` padding. Hover: `translateY(-3px)` + subtle box-shadow.

**Buttons:** `8px` border-radius, `14px 32px` padding, `0.9rem` font size. Two variants:
- `.btn-primary`: navy background, white text
- `.btn-outline`: transparent background, navy text, `--gray-300` border

**Mac App Store badge:** Current URL: `https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-mac-app-store.svg`. Height: `48px`. Wrapped in a link with hover `translateY(-2px)`.

**Keyboard shortcut keys (`.kbd`):** inline-block, `0.78rem`, `--white` background, `1px solid --gray-200`, `5px` border-radius, `2px 7px` padding.

### Responsive Breakpoints

- `768px`: reduce hero padding, section padding, collapse features grid to 1 column
- `480px` / `520px`: stack buttons vertically, stack footer vertically

### Legal Pages

Simple single-column layout. Located at `/appname/terms/`, `/appname/license/`, `/appname/privacy/`. Same nav and footer as product pages.
