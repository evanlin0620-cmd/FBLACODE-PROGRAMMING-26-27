---
name: ServeHub
description: A volunteer desk for Riverside Community Partners that shows the reason behind every rule.
colors:
  riverside-green: "#15803d"
  on-green: "#ffffff"
  green-wash: "#ecfdf5"
  green-ink: "#14532d"
  approved-bg: "#dcfce7"
  sidebar-green-wash: "#e8f5ec"
  waiting-amber: "#b45309"
  waiting-bg: "#fef3c7"
  error-red: "#dc2626"
  page-white: "#ffffff"
  ink: "#09090b"
  sidebar-zinc: "#fafafa"
  soft-zinc: "#f4f4f5"
  muted-ink: "#52525b"
  line-zinc: "#e4e4e7"
  input-zinc: "#d4d4d8"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: "-0.025em"
    fontFeature: "'ss01', 'tnum'"
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
    fontFeature: "'ss01'"
  stat:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
    fontFeature: "'ss01', 'tnum'"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
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
    fontWeight: 500
    lineHeight: 1.33
    fontFeature: "'ss01'"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
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
    backgroundColor: "{colors.riverside-green}"
    textColor: "{colors.on-green}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.page-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline-hover:
    backgroundColor: "{colors.green-wash}"
    textColor: "{colors.green-ink}"
  input:
    backgroundColor: "{colors.page-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  panel:
    backgroundColor: "{colors.page-white}"
    rounded: "{rounded.xl}"
    padding: "20px"
  activity-card:
    backgroundColor: "{colors.page-white}"
    rounded: "{rounded.xl}"
    padding: "16px"
  pill-approved:
    backgroundColor: "{colors.approved-bg}"
    textColor: "{colors.green-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "24px"
  pill-waiting:
    backgroundColor: "{colors.waiting-bg}"
    textColor: "{colors.waiting-amber}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "24px"
  pill-neutral:
    backgroundColor: "{colors.soft-zinc}"
    textColor: "{colors.muted-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 8px"
    height: "24px"
  nav-item-active:
    backgroundColor: "{colors.sidebar-green-wash}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.md}"
    height: "36px"
  capacity-bar:
    backgroundColor: "{colors.soft-zinc}"
    rounded: "{rounded.full}"
    height: "6px"
---

# Design System: ServeHub

## Overview

**Creative North Star: "The Volunteer Desk"**

ServeHub looks like a clean front desk at a community center. White work areas sit next to a light gray sidebar. Thin gray borders split things up instead of heavy shadows. Green means "go" or "done". Amber means "waiting". Red means "something is wrong". Nothing else gets a color.

The point of the look is to show the rule right where it applies. A shift card shows how full it is with a bar. A full shift turns the bar amber and says how many people are waiting. A recommendation says why it matched. Hours and dates use numbers that line up in columns, so they are easy to read in a table or a stat.

The screens are calm and fairly dense, built for a 1280x800 laptop window. Every screen has one clear main action at the top right. Light and dark mode use the same layout and the same color meanings.

**Key Characteristics:**
- White cards with 1px zinc borders and 12px corners, flat at rest.
- One green for actions, selection, approved states, and charts.
- Amber only for waiting (waitlist, pending, "needs review").
- Red only for errors and rejections.
- Geist sans everywhere, semibold for titles, tabular numbers for hours and dates.
- Every status has a word, not just a color.

## Colors

A white and zinc base with one green voice and two signal colors (amber and red) that only show up when they mean something.

### Primary
- **Riverside Green** (riverside-green): primary buttons, the active nav item's icon area, sidebar badges, the brand tile, capacity and goal bars while there is room, and every chart bar. In dark mode it becomes a brighter green so it still stands out.
- **Green Wash** (green-wash): hover fill for outline and ghost buttons, and the avatar circle behind initials.
- **Green Ink** (green-ink): text on green-tinted fills (approved pills, active nav item, hovered outline buttons).
- **Approved Fill** (approved-bg): background of "Confirmed", "Approved", and "% of goal" pills.
- **Sidebar Green Wash** (sidebar-green-wash): background of the current page in the sidebar.

### Secondary
- **Waiting Amber** (waiting-amber): text and bar color for anything waiting: "Waitlist #2", "Pending", "Full · waitlist open", "Needs review", and skill gaps. Never used for decoration.
- **Waiting Fill** (waiting-bg): background behind amber pill text.

### Tertiary
- **Error Red** (error-red): error messages, invalid field borders, "Not approved" pills (on a 10% red tint), the error panel, and destructive buttons. Nothing else.

### Neutral
- **Page White** (page-white): the main work area, cards, panels, popovers.
- **Ink** (ink): all main text.
- **Sidebar Zinc** (sidebar-zinc): the sidebar background, so the work area reads as the brighter "desk".
- **Soft Zinc** (soft-zinc): neutral pills (skills, match %), the date tile, secondary buttons, and the empty part of every bar.
- **Muted Ink** (muted-ink): subtitles, descriptions, "when and where" rows, table helper text. Passes 4.5:1 on white.
- **Line Zinc** (line-zinc): every border and divider.
- **Input Zinc** (input-zinc): input borders and scrollbar thumbs, one step darker than plain lines so fields are easy to find.

Dark mode swaps each token for its own value in the `.dark` block of `src/renderer/src/assets/main.css` (near-black page, slightly lighter cards, brighter green and amber). Use the token names, never the hex values, so both modes keep working.

### Named Rules
**The Three Signals Rule.** Green means go or done, amber means waiting, red means wrong. If a color does not mean one of these, it is zinc.

**The Word-Not-Just-Color Rule.** Every colored status also says its meaning in words ("Waitlist #2", "Not approved"). Color alone never carries meaning.

## Typography

**Display Font:** Geist Variable (with ui-sans-serif, system-ui)
**Body Font:** Geist Variable (with ui-sans-serif, system-ui)
**Label/Mono Font:** the system mono font, only for codes (certificate codes, keyboard keys, error details)

**Character:** One clean geometric sans for everything, with stylistic set 1 turned on for the whole app. Weight does the work: semibold for titles and big numbers, medium for labels and buttons, regular for reading.

### Hierarchy
- **Display** (600, 2.25rem, tight tracking): the one big number on the volunteer dashboard (hours approved).
- **Headline** (600, 1.75rem, tight tracking): the page title in every page header. One per screen.
- **Stat** (600, 1.875rem, tight tracking): numbers in stat cards (Impact, Reports, a volunteer's record).
- **Title** (600, 1rem): panel titles, card titles, shift names.
- **Body** (400, 0.875rem): almost all text: subtitles, nav, table cells, descriptions, buttons.
- **Label** (500, 0.75rem): pills, capacity labels, dates on cards, small helper lines.

### Named Rules
**The Lined-Up Numbers Rule.** Hours, dates, times, counts, and stats always use tabular numbers (the `tabular` class, and every table gets it automatically) so digits line up.

**The One Title Rule.** Each screen has exactly one headline, in the page header. Sections below use the 1rem title size.

## Layout

The app frame is a fixed 240px (15rem) sidebar on the left and a scrolling work area on the right. The sidebar holds the brand tile, a "Menu" group of role-specific links, then Help, the dark mode switch, and the user's name at the bottom.

Every screen starts with a page header: title and one-line subtitle on the left, one or two buttons on the right, a bottom border under it (32px side padding, 24px top, 20px bottom). The page body below is centered, at most 1200px wide, with 32px side padding and 24px top and bottom.

Cards sit in a grid that fills columns at least 280px wide, with 16px gaps (three across at 1280px). Dashboards pair two panels side by side, or a wide chart panel with narrower panels stacked next to it. Stat cards sit four across.

Spacing steps are 8, 12, 16, 20, 24, and 32px. Inside cards, small groups use 8 to 12px; sections inside a panel use 16px. The window's smallest size is 960x640; it is designed at 1280x800.

## Elevation & Depth

The app is flat. Depth comes from borders and from the sidebar being a touch grayer than the work area, not from shadows. Shadows show up in only three places: when you hover a card you can open, on the login card (which floats alone on the page), and on menus, popovers, and dialogs that float above the page.

### Shadow Vocabulary
- **Card hover lift** (`box-shadow: 0 2px 4px rgb(0 0 0 / 0.04), 0 12px 28px -16px rgb(0 0 0 / 0.18)`): activity cards on hover, to show they can be opened.
- **Floating card** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.12)`): the login and sign-up card.
- **Button hairline** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): outline buttons and inputs, just enough to look pressable.

### Named Rules
**The Flat Desk Rule.** Panels and cards have no shadow at rest. Use a 1px border. A shadow means "this floats" or "you can click this".

## Shapes

Corners are small and friendly, never sharp and never pill-shaped (except bars and count badges). Cards, panels, the empty state, and the error panel use 12px corners. Buttons, inputs, and status pills use 6px. The date tile and brand tile use 8px. Bars and nav count badges are fully round. Borders are 1px zinc; the empty state uses a dashed border. The certificate is the only thing with a thick (2px) green border.

## Components

### Buttons
Quiet and solid; green only for the main action.
- **Shape:** gently rounded (6px), 36px tall; small size is 32px.
- **Primary:** Riverside Green fill, white medium-weight text, 16px side padding. Hover darkens to 90%. Used for the one main action (Sign up, Log hours, Create report).
- **Outline:** white fill, 1px border, hairline shadow. Hover fills with Green Wash and green ink. Used for the second action and for "Join waitlist" when a shift is full.
- **Ghost / Link:** no fill; ghost hovers with Green Wash. Used for "See all" and "Edit my skills".
- **Destructive:** Error Red fill, only inside confirm dialogs for cancel or delete.
- **Focus:** a 3px soft green ring plus the global 2px green outline. Disabled is 50% opacity.

### Chips (Pills)
- **Style:** 24px tall, 6px corners, 12px medium text, no border. Tones: green (Approved Fill + Green Ink), amber (Waiting Fill + Waiting Amber), red (10% red tint + Error Red), gray (Soft Zinc + Muted Ink), outline (white + 1px border, for the activity type).
- **State:** pills only show status; they are not buttons. Each has a word.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Page White (a slightly lighter near-black in dark mode).
- **Shadow Strategy:** none at rest; activity cards lift on hover (see Elevation).
- **Border:** 1px Line Zinc.
- **Internal Padding:** 20px for panels, 16px for activity cards. Panels are never nested.

### Inputs / Fields
- **Style:** 36px tall, 6px corners, 1px Input Zinc border, hairline shadow, green text cursor. Every input has a visible label.
- **Focus:** border turns green with a 3px soft green ring.
- **Error / Disabled:** red border and soft red ring, with a red message under the field that says what to do. Disabled is 50% opacity.

### Navigation
- **Style:** 240px sidebar on Sidebar Zinc. Each link is 36px tall with a 16px line icon and 14px text.
- **Active:** Sidebar Green Wash fill, Green Ink medium-weight text.
- **Hover:** same green wash.
- **Badges:** a round green count badge with white text on the right (unread notifications, hours to approve), with a screen-reader word after the number.

### Capacity Bar (signature)
The bar that shows how full a shift is. A 12px label above ("4 of 6 spots left") and a 6px round bar below on Soft Zinc. Green while there is room. When full, both the bar and label turn amber and the label says the waitlist count ("Full · 2 on waitlist"). The width animates in 500ms. A taller 8px version (the Meter) shows hours toward a goal and ranked lists.

### Date Tile
A 48px-wide Soft Zinc tile with 8px corners: short month on top (11px, semibold, uppercase, muted), day number below (18px semibold, tabular). Used at the start of shift rows.

### Empty and Error States
Empty: dashed-border 12px box with a line icon, a title, one sentence, and an optional button. Error: a light red panel with a warning icon, "We couldn't load this page.", the reason, and a "Try again" outline button.

## Do's and Don'ts

### Do:
- **Do** use the color tokens by name (primary, warning, warning-bg, success-bg, destructive, muted) so dark mode works.
- **Do** put one main green button at the top right of each page header, and at most one more outline button next to it.
- **Do** give every status a word as well as a color (pills, capacity labels).
- **Do** use tabular numbers for hours, dates, times, and stats.
- **Do** use 1px borders and 12px corners for cards and panels, with no shadow at rest.
- **Do** use Lucide line icons at 16px next to text, marked `aria-hidden`.
- **Do** keep the 2px green focus outline on every control.

### Don't:
- **Don't** use amber for anything but waiting, or red for anything but errors and rejections.
- **Don't** add shadows to panels or cards at rest.
- **Don't** nest a panel inside another panel.
- **Don't** add a second accent color. The chart uses Riverside Green only.
- **Don't** add small uppercase labels above titles; the page title and subtitle are enough.
- **Don't** show color as the only sign of a state.
