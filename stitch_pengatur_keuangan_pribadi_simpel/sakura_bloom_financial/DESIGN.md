---
name: Sakura Bloom Financial
colors:
  surface: '#fff7f9'
  surface-dim: '#dfd8da'
  surface-bright: '#fff7f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2f4'
  surface-container: '#f4ecee'
  surface-container-high: '#eee6e8'
  surface-container-highest: '#e8e1e3'
  on-surface: '#1e1b1c'
  on-surface-variant: '#594046'
  inverse-surface: '#332f31'
  inverse-on-surface: '#f7eff1'
  outline: '#8d7075'
  outline-variant: '#e0bec4'
  surface-tint: '#b81059'
  primary: '#970046'
  on-primary: '#ffffff'
  primary-container: '#be185d'
  on-primary-container: '#ffd5dd'
  inverse-primary: '#ffb1c3'
  secondary: '#af275a'
  on-secondary: '#ffffff'
  secondary-container: '#fe6696'
  on-secondary-container: '#6a002f'
  tertiary: '#8a1a5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#a93577'
  on-tertiary-container: '#ffd4e5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#ffb1c3'
  on-primary-fixed: '#3f0019'
  on-primary-fixed-variant: '#8f0042'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#ffb1c3'
  on-secondary-fixed: '#3f0019'
  on-secondary-fixed-variant: '#8e0542'
  tertiary-fixed: '#ffd8e7'
  tertiary-fixed-dim: '#ffafd3'
  on-tertiary-fixed: '#3d0026'
  on-tertiary-fixed-variant: '#85145a'
  background: '#fff7f9'
  on-background: '#1e1b1c'
  surface-variant: '#e8e1e3'
  sakura-pink: '#ec4899'
  sakura-petal: '#fce7f3'
  sakura-mist: '#fdf2f4'
  berry-plum-deep: '#831843'
  text-primary: '#4c0519'
  text-muted: '#9f1239'
  income-emerald: '#047857'
  income-bg: '#ecfdf5'
  expense-rose: '#be185d'
  expense-bg: '#fff1f2'
  border-petal: '#fbcfe8'
typography:
  display-currency:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-currency-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-currency-prefix:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1.25rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system reimagines personal finance management through a serene, elegant, and mindful Japanese floral aesthetic. Tailored for users managing daily budgets, cash flows, and investments, the interface relieves financial anxiety by replacing rigid, sterile banking environments with the organic tranquility and beauty of cherry blossoms in full bloom. 

The emotional tone balances poetic calm with uncompromising precision and empowerment. The visual style merges soft, contemporary minimalism with warm, tactile card architecture. Generous breathing room, creamy petal-tinted surfaces, and sharp, high-legibility typography provide a comforting sanctuary for daily financial reflection while honoring WCAG-compliant legibility across all lighting environments.

## Colors

The color palette centers around a refined cherry blossom spectrum. It balances airy, comforting petal pinks with deep, high-contrast berry plums to guarantee impeccable readability and strict WCAG AA/AAA compliance on all informative text and interactive controls.

### Core Roles
- **Primary (`#be185d`)**: Deep berry plum used for high-emphasis primary buttons, active interactive elements, and critical financial signifiers.
- **Secondary (`#9d174d`)**: Ultra-deep rose plum for prominent wallet headers, large balance summaries, and foundational structural accents.
- **Tertiary (`#f472b6`)**: Vibrant sakura blossom pink for interactive accents, active tabs, floating highlights, and decorative touches.
- **Neutral (`#fff7f9`)**: Creamy warm floral canvas that eliminates glare while providing a soothing, radiant base for cards and widgets.

### Semantic & Surface Mappings
- **Canvas Base**: `#fff7f9`
- **Surface Clean (Cards, Overlays)**: `#ffffff`
- **Surface Subtle (Inputs, Secondary Wells)**: `#fdf2f4`
- **Surface Tint Highlight (Tags, Selected Items)**: `#fce7f3`
- **Text Primary**: `#4c0519` (high-contrast deep rose plum for optimal contrast on light surfaces)
- **Text Secondary / Muted**: `#881337` (rich plum offering greater than 4.5:1 contrast against soft backgrounds)
- **Currency Prefix (`Rp`)**: `#9f1239` (visually subordinate without sacrificing clarity)
- **Borders & Dividers**: `#fbcfe8` (soft petal outline preserving crisp card separation)
- **Income Status**: `#047857` text on `#ecfdf5` background
- **Expense Status**: `#be185d` text on `#fff1f2` background

## Typography

Typography relies on **Plus Jakarta Sans**, celebrating geometric clarity, tall x-height, and contemporary elegance. 

### Financial Readability & Formatting
- **Tabular Figures**: Tabular numbers (`tnum` OpenType feature) must be enabled across all transaction records, budgets, and balance amounts to maintain vertical numerical alignment.
- **Rupiah (`Rp`) Prefix**: Sized down using `label-currency-prefix` and colored in `#9f1239` to anchor amounts cleanly without competing with the monetary value.
- **Numeric Thousand Delimiters**: Formatted with standard dot separation (`Rp 1.250.000,00`) per local conventions.
- **Responsive Currency Sizing**: `display-currency` dynamically scales down to `display-currency-mobile` on viewports narrower than 380px to prevent awkward numerical truncation or balance wrapping.

## Layout & Spacing

The layout is built upon a mobile-first fluid container designed for effortless one-handed thumb interaction, expanding gracefully to tablet and desktop layouts.

- **Mobile Viewports (<640px)**: 4-column fluid layout with an outer margin of `margin` (20px) and column gaps of `gutter` (16px). This grants generous tap zones while maximizing horizontal width for extended financial values.
- **Tablet / Responsive Expand (640px - 1024px)**: Centers to a maximum mobile container of 560px for single-stream views, or shifts to an 8-column layout with `gutter-tablet` (24px) and `margin-tablet` (32px) for side-by-side dashboard analytics.
- **Spacing Rhythm**: Internal component padding follows multiples of 4px. Micro spaces (`space-xs` and `space-sm`) structure item groups, while `space-md`, `space-lg`, and `space-xl` define content sections to preserve an uncluttered, serene atmosphere.

## Elevation & Depth

Visual depth is achieved through translucent floral tinting, soft ambient shadows, and crisp petal outlines rather than heavy grey drops.

- **Surface Level 0 (Base)**: `#fff7f9` creamy floral canvas.
- **Surface Level 1 (Resting Cards, List Rows)**: Pure white `#ffffff` elevated by soft berry-diffused ambient shadow:
  - `box-shadow: 0 4px 20px -2px rgba(157, 23, 77, 0.05), 0 2px 6px -1px rgba(157, 23, 77, 0.02);`
  - Border: 1px solid `#fbcfe8` to maintain crisp separation in direct daylight.
- **Surface Level 2 (Active Cards, Quick-Filter Trays, Sheets)**: Crisp `#ffffff` lifted with:
  - `box-shadow: 0 12px 30px -4px rgba(157, 23, 77, 0.10), 0 4px 12px -2px rgba(157, 23, 77, 0.04);`
- **Surface Level 3 (Floating Action Buttons & Dialogs)**:
  - `box-shadow: 0 10px 24px -2px rgba(190, 24, 93, 0.35);`

## Shapes

The design uses **Rounded (`2`)** geometry to mirror the gentle curvature of cherry blossom petals, delivering warmth and modern sophistication.

- Standard buttons, input fields, and category tag tiles utilize `0.5rem` (8px) corner radii.
- Content cards, transaction panels, and modular dashboard widgets use `rounded-lg` at `1rem` (16px).
- Bottom sheets, modal dialogues, and primary balance overview cards implement `rounded-xl` at `1.5rem` (24px).
- Status chips, currency badge indicators, and floating icon buttons use fully circular/pill contours (`9999px`) to create organic visual counterpoints to card surfaces.

## Components

### Buttons
- **Primary Button**: Solid deep berry plum (`#be185d`) background with crisp white text (`#ffffff`), 48px standard touch height, 8px (`0.5rem`) corner radius, using `label-lg`. Active/pressed state transitions to `#9d174d` with a scale down of `0.98`.
- **Secondary Button**: Background `#fce7f3` with deep plum text (`#9d174d`) and no border; delivers approachable, low-stress secondary actions like "Batalkan" or "Simpan Draf".
- **Floating Action Button (FAB)**: 56x56px circular button (`rounded-full`) resting on the bottom navigation plane, coated in `#be185d` with a high-contrast white plus icon and a soft rose glow elevation.

### Cards
- **Master Balance Card**: Styled either in an elegant gradient from `#9d174d` to `#be185d` with white and soft petal pink typography, or pure white `#ffffff` with a delicate `#fbcfe8` outline and a soft rose glow. Houses master net worth, quick transaction buttons, and monthly budget progress.
- **Transaction Item Row**: White `#ffffff` container or bordered pill. Left column holds a 40x40px soft pink container (`#fdf2f4`) with plum or emerald iconography. Center column displays the title and category in `#4c0519` and date in `#9f1239`. Right column displays tabular currency formatted in `#047857` (income) or `#be185d` (expense).

### Input Fields
- Standard touch height of 48px with `0.5rem` border radius.
- Resting state uses `#fdf2f4` background with a subtle border in `#fbcfe8`.
- Focused state transitions to `#ffffff` background with a 1.5px `#be185d` border and faint rose outer glow (`rgba(190, 24, 93, 0.15)`).
- Rupiah input fields anchor an uneditable `Rp` prefix label in `#9f1239` with auto-formatted dot groupings.

### Chips & Badges
- Filter and status chips use a pill format (`9999px`):
  - **Income Chip**: `#ecfdf5` background with `#047857` text.
  - **Expense Chip**: `#fff1f2` background with `#be185d` text.
  - **Filter Chip (Default)**: `#fdf2f4` background with `#881337` text and `#fbcfe8` border.
  - **Filter Chip (Selected)**: `#be185d` background with `#ffffff` text.

### Checkboxes & Radio Buttons
- 20x20px dimension with 4px corner radius for checkboxes; circular 20x20px for radio controls.
- Unchecked: 1.5px border `#f472b6`, background transparent.
- Checked: Solid `#be185d` fill with an inset white check icon or center radio pip.

### Financial Health Bar / Budget Progress
- 8px height track with `9999px` pill radius and `#fce7f3` track background.
- Dynamic fill progression:
  - 0% - 70% budget used: Soft Blossom Rose (`#ec4899`).
  - 71% - 89% budget used: Vibrant Plum Rose (`#be185d`).
  - 90%+ budget exceeded: Alert Deep Berry (`#831843`).