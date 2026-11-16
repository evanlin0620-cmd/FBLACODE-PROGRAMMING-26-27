---
name: ServeHub
description: The paper sign-up sheet at a community hall, for any nonprofit's volunteer program.
colors:
  brand-green: "#15803d"
  on-green: "#ffffff"
  success-fg: "#14532d"
  approved-bg: "#dcfce7"
  waiting-amber: "#b45309"
  waiting-bg: "#fef3c7"
  error-red: "#dc2626"
  page: "#fafafa"
  card: "#ffffff"
  ink: "#171717"
  text-2: "#525252"
  muted-ink: "#737373"
  sidebar: "#f5f5f5"
  soft: "#f4f4f5"
  surface-step: "#f0f0f0"
  track: "#ededed"
  line: "rgb(23 23 23 / 0.08)"
  input-line: "rgb(23 23 23 / 0.14)"
  slot-filled: "#404040"
  slot-open: "#e2e2e2"
  paper: "#f7f4ee"
  paper-ink: "#1f1b16"
  paper-ink-2: "#5e554a"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "'ss01', 'tnum'"
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "'ss01'"
  serif-headline:
    fontFamily: "Sitka Heading, Sitka Text, Georgia, Times New Roman, serif"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  stat:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'ss01', 'tnum'"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
    fontFeature: "'ss01'"
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "'ss01'"
  label:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    fontFeature: "'ss01'"
  hand:
    fontFamily: "Ink Free, Segoe Print, Bradley Hand, cursive"
    fontSize: "1.125rem"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  page: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.on-green}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  panel:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  nav-item-active:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "36px"
  slot-mark:
    backgroundColor: "{colors.slot-filled}"
    rounded: "2px"
    height: "12px"
    width: "6px"
---

# Design System: ServeHub

## Overview

**Creative North Star: "The sign-up sheet at the community hall"**

ServeHub is for any nonprofit's volunteer program, not one organization. The look borrows from the paper sheet pinned up at a community hall: neighborly, steady, plainspoken. App surfaces stay neutral (near-white page, white cards, a light gray sidebar). Brand green is kept for three things only: the primary action, the selection mark, and one key figure per screen. Amber means waiting. Red means something is wrong.

The signature is **slot marks**: a shift's capacity drawn as the lines of a sign-up sheet, filled or open. They appear wherever spots appear and nowhere else.

The organization's name is a setting (admin Settings → Your organization), stored in SQLite and shown on sign-in, the sidebar, reports and certificates. A demo reset keeps it.

The screens are calm and fairly dense, built for a 1280x800 laptop window, with 960x640 as the smallest size.

**Key Characteristics:**
- White cards with hairline borders (8% ink) and 16px corners, flat at rest.
- Green only for the main button, the selection, approved hour cells and the current chart bar.
- Headlines on the sign-in screen and the certificate in a system serif (Sitka, falling back to Georgia). No font packages beyond Geist.
- Medium (500) weight for titles and big numbers; no semibold headlines.
- Every status has a word, not just a color.

## Colors

### Primary
- **Brand Green** (brand-green): primary buttons, the brand tile, approved hour cells, the month in progress on the Impact chart, focus rings. Never a page wash or a nav highlight.
- **Approved Fill / Success ink** (approved-bg, success-fg): "Confirmed" and "Approved" pills, and the goal-reached note.

### Secondary
- **Waiting Amber** (waiting-amber, waiting-bg): waitlist, pending, "Full · waitlist open". The hatched "waiting" hour cell uses a pale green hatch so pending never depends on color alone.

### Tertiary
- **Error Red** (error-red): error messages, invalid fields, "Not approved", destructive buttons. Nothing else.

### Neutral
- **Page** (page) behind everything; **Card** (card) for panels, popovers and the active nav item.
- **Ink** (ink) for main text, **Text 2** (text-2) for secondary text and nav labels (7:1), **Muted Ink** (muted-ink) for helper lines and icons.
- **Sidebar** (sidebar), **Soft** (soft), **Surface step** (surface-step) and **Track** (track) for quiet fills and empty bars.
- **Line** (line) for every border and divider; **Input line** (input-line) one step darker for fields.
- **Slot filled / open** (slot-filled, slot-open) for slot marks; neutral, not green.
- **Paper** (paper, paper-ink, paper-ink-2): the sign-in panel only.

Dark mode swaps each token in the `.dark` block of `src/renderer/src/assets/main.css`. Use the token names (`text-text-2`, `bg-paper`, `bg-[var(--slot-filled)]`), never hex, except for the clipboard illustration, which stays paper-colored in both themes.

### Named Rules
**The Three Signals Rule.** Green means go or done, amber means waiting, red means wrong. Everything else is neutral.

**The Selection Is a Surface Rule.** The current page in the sidebar is a white surface with a hairline, not a green wash.

## Typography

**Body and UI:** Geist Variable, stylistic set 1. **Serif:** `font-serif` (Sitka Heading → Georgia), only for the sign-in headline, the clipboard title and the certificate title. **Hand:** `font-hand` (Ink Free → Segoe Print), only for the names written on the clipboard sheet; Windows ships it, so it stays offline. **Mono:** system mono for slot-mark counts ("18 of 20 spots left") and codes.

### Hierarchy
- **Display** (500, 56px, -0.03em): the hours-approved number on the volunteer dashboard.
- **Headline** (500, 1.25rem): the page title in every page header, with the subtitle beside it on the same baseline.
- **Stat** (500, 32px): stat cards and the featured match score (48px).
- **Title** (500, 15px): panel and section titles.
- **Body** (400, 0.875rem) and **Label** (400, 0.75rem).

### Named Rules
**The Lined-Up Numbers Rule.** Hours, dates, times, counts and stats use tabular numbers.

**The One Title Rule.** One headline per screen, in the page header.

## Layout

A 240px sidebar (brand row, the organization line "Volunteer at {org}" or the org name for admins, role links, then Help, the theme switch and the account menu) and a scrolling work area.

Every screen starts with a 64px page header: title and subtitle on one baseline at left, one or two buttons at right, a bottom border. The body is centered, at most 1200px wide, with 32px padding.

Dashboards use a two-column grid (1.2fr / 1fr on the volunteer side, 2fr / 1fr for the Impact chart and Top activities) with 16px gaps. Stat cards sit four across on wide windows, two at 960px.

## Elevation & Depth

Flat. Depth comes from the page/card step and hairlines. Shadows only for: the active nav item (hairline ring + 1px drop), activity cards on hover, the clipboard on sign-in, and floating menus and dialogs.

## Motion

Motion explains a change; it never decorates. Curves: `ease-snappy` and `ease-glide` in `main.css`.

- **Never animated:** navigation, the sidebar highlight, keyboard actions, search results, theme switch, chart bar heights.
- **Press feedback:** buttons scale to 0.97 for 150ms.
- **List refreshes** (`withViewTransition`): rows with a `viewTransitionName` slide to their new place in 220ms.
- **Once per login:** dashboard panels rise in a wave (0, 50, 90ms; 12/8/6px).
- **The one celebration:** a new certificate prints top to bottom (700ms clip-path).
- **Reduced motion:** everything drops to near zero.

## Shapes

Cards, panels, empty states: 16px. The featured-match factor rows and inline lists inside a card: 12px. Buttons, inputs, pills: 6px. Hour cells 4px, slot marks 2px. Bars are fully round.

## Components

### Buttons
- **Primary:** Brand Green, white text. One per screen, top right (Sign up on the featured match is the exception).
- **Outline:** white, 1px input line. Second actions, Review, Find volunteers.
- **Ghost:** no fill. Send back, Add free times.
- **Destructive:** red, only inside confirm dialogs.
- **Demo account buttons** on sign-in are outline toggles with `aria-pressed`; the picked one gets an ink ring and a check.

### Slot marks (signature)
`components/slots.tsx`. `Slots` draws one 6x12px mark per spot (filled = slot-filled, open = slot-open), up to 20 marks; bigger shifts scale and never look full or empty unless they are. `SpotsRow` adds the mono words. `CapacityBar` (status.tsx) wraps them with the words above, amber when full.

### Hour cells
The volunteer's goal as one 20px cell per hour in a 20-column grid: approved = green, waiting = hatched (`.cell-pending`), rest = track. Goals over 60 hours scale (`cellCounts` in `lib/format.ts`). At the goal, a green note offers the certificate.

### Spotlight recommendations
The best match is a large card: type, title, when/where with line icons, a 48px score, then one row per factor (label, note, a neutral 4px bar, points). Runners-up are compact cards with the strongest factor's note. If only one shift clears 50%, the second column says "Nothing else fits you well right now" with links to browse and to add free times. An info tooltip explains the 100-point score.

### Needs you (admin Impact)
A card at the top of Impact: hour logs waiting (Review expands up to 5 with in-place Approve and Send back; Send back asks for a 5+ character reason), then skill gaps with Find volunteers. Approving refreshes the stats, the chart and the sidebar count.

### Month chart
Neutral bars, the month in progress in green, dashed gridlines, a scale rounded up to a multiple of 4. Bars are focusable buttons with tooltips; a hidden table carries the numbers for screen readers.

### Sign-in
Left: the paper panel with the brand, the serif headline "Every shift's sign-up sheet, in one place", one line of explanation, and a clipboard holding a sample sign-up sheet (one labelled image). Hidden under 768px. Right: the form on white, with the org name in the subtitle. No entrance animation.

### Navigation
Links are 36px with 16px line icons (1.5 stroke, muted) and text-2 labels. Active: white surface + hairline, ink medium text. Counts are plain text-2 numbers with a screen-reader word.

### Empty and Error States
Empty: dashed 16px box with a line icon, a title, one sentence, an optional button. Error: light red panel, "We couldn't load this page.", the reason, Try again.

## Do's and Don'ts

### Do:
- **Do** use tokens by name so dark mode works.
- **Do** keep green to the main action, the selection, and one key figure.
- **Do** show capacity with slot marks.
- **Do** give every status a word as well as a color.
- **Do** read the organization's name from `useSession().org`, never a constant.

### Don't:
- **Don't** wash the sidebar selection or page backgrounds in green.
- **Don't** use amber for anything but waiting, or red for anything but errors.
- **Don't** add shadows to cards at rest, or nest panels.
- **Don't** use the serif or the hand face outside the places listed above.
- **Don't** animate layout properties (height, width) or chart bars.
