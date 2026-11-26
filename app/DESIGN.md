---
name: Turnout
description: The paper sign-up sheet at a community hall, for any nonprofit's volunteer program; every shift is a card you handle.
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

# Design System: Turnout

## Overview

**Creative North Star: "The sign-up sheet at the community hall"**

Turnout (called ServeHub until 2026-11-25) is for any nonprofit's volunteer program, not one organization. The look borrows from the paper sheet pinned up at a community hall: neighborly, steady, plainspoken. App surfaces stay neutral. Graphite dark is the default theme (2026-11-19): #111 canvas and sidebar, #181818 panels, hairline borders, no glows; light mode is the same layout on near-white. Brand green is kept for the primary action and one key figure per screen. Amber means waiting. Red means something is wrong.

The signature is **slot marks**: a shift's capacity drawn as the lines of a sign-up sheet, filled or open. They appear wherever spots appear and nowhere else.

The second idea (direction "The deck", chosen 2026-11-17): **every shift is a card you handle**. Each activity type has its own colour band, so a shift is recognisable from the corner of a card. Sign-up deals a fanned deck of real shifts, the volunteer's next shift is a ticket, and hour logs are reviewed as a stack.

The organization's name is a setting (admin Settings → Your organization), stored in SQLite and shown on sign-in, under the brand in the sidebar, reports and certificates. A demo reset keeps it.

The screens are calm and fairly dense, built for a 1280x800 laptop window, with 960x640 as the smallest size.

**Key Characteristics:**
- Panels one surface step above the canvas, with hairline borders (7-8% ink) and 16px corners, flat at rest.
- Green for the main button, approved hours and the Impact chart line. Activity types carry their own tint, only on card bands and the ticket.
- Headlines on the sign-in screen and the certificate in a system serif (Sitka, falling back to Georgia). No font packages beyond Geist.
- Medium (500) weight for titles and big numbers; no semibold headlines.
- Every status has a word, not just a color.

## Colors

### Primary
- **Brand Green** (brand-green): primary buttons, the app icon, approved hours in the ring, count badges, the month in progress on the Impact chart, focus rings. Never a page wash.
- **Approved Fill / Success ink** (approved-bg, success-fg): "Confirmed" and "Approved" pills, and the goal-reached note.

### Secondary
- **Waiting Amber** (waiting-amber, waiting-bg): waitlist, pending, "Full · waitlist open". Hours waiting for approval are a pale green arc in the ring, with the number in words beside it.

### Activity tints
One per activity type, in `lib/activity-style.ts` (`TYPE_STYLE`, `typeGradient`), each with a Lucide mark: Food Bank #b4532a, Tutoring #4a55b8, Environmental #2f7d4f, Animal Care #8a5a14, Senior Care #8a4f9e, Fundraising #a8364f, Event Support #3d6680, Health #12737c. Every tint keeps white text at 4.5:1 or better. Used only for the band at the top of a shift card and the next-shift ticket; they look the same in light and dark. The type is always written next to the band, so colour never carries the meaning alone.

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
**The Three Signals Rule.** Green means go or done, amber means waiting, red means wrong. Activity tints name a type, never a status. Everything else is neutral.

**The Selection Is a Step Rule.** The current sidebar row is one surface step up with a hairline, not a green wash or an ink pill.

## Typography

**Body and UI:** Geist Variable, stylistic set 1. **Serif:** `font-serif` (Sitka Heading → Georgia), only for the sign-in and sign-up headlines, the clipboard title, the next-shift ticket title and the certificate title. **Hand:** `font-hand` (Ink Free → Segoe Print), only for the names written on the clipboard sheet; Windows ships it, so it stays offline. **Mono:** system mono for slot-mark counts ("18 of 20 spots left") and codes.

### Hierarchy
- **Display** (500, 44px, -0.02em): the all-time approved hours on Impact, and the hours on a review card.
- **Headline** (500, 1.25rem): the page title in every page header, with the subtitle beside it on the same baseline.
- **Stat** (500, 32px): stat cards and the number inside the hours ring.
- **Title** (500, 15px): panel and section titles.
- **Body** (400, 0.875rem) and **Label** (400, 0.75rem).

### Named Rules
**The Lined-Up Numbers Rule.** Hours, dates, times, counts and stats use tabular numbers.

**The One Title Rule.** One headline per screen, in the page header.

## Layout

A 240px sidebar on the canvas colour: the brand with the organization name under it; "Menu" with the everyday pages (volunteers also get Notifications, with an unread count in mono); "Coming up" (the volunteer's next four shifts) or "Open shifts" (a coordinator's next four), each with its activity-type dot and a mono date; then, pinned to the bottom, Help (with a ? keycap) and the account row. The account menu opens upward and holds the occasional pages (My profile; Email outbox, Audit log, Settings for admins), the theme switch and Log out. To the right, a scrolling work area.

Every screen starts with a 64px page header: title and subtitle on one baseline at left, one or two buttons at right, a bottom border. The body is centered, at most 1200px wide, with 32px padding.

The volunteer home's page title is the month ("November 2026"), never a greeting. The ticket and the hours card sit side by side (1.3fr / 1fr) from 1024px and stack below it; dealt cards run two across, three from 1280px. Impact puts the review stack beside the month chart (1fr / 1.15fr), then three stat cards, then Skill gaps beside Top activities. 16px gaps throughout.

## Elevation & Depth

Flat. Depth comes from the page/card step and hairlines. Shadows only for: the cards in the sign-up deck and the review stack (they are physical objects), the clipboard on sign-in, and floating menus and dialogs.

## Motion

Motion explains a change; it never decorates. Curves: `ease-snappy` and `ease-glide` in `main.css`.

- **Never animated:** the sidebar selection, keyboard actions, search results, theme switch. Card hover is a border colour change only (150ms), never a lift.
- **Page change:** the work area fades in and rises 4px (200ms, `animate-page`), keyed by path.
- **Handled objects:** the sign-up deck fans out on hover or focus and a picked card lifts out and tucks in on top (300ms, transforms only). A reviewed hour log flies off left or right with a stamp (260ms). The next-shift ticket tilts up to 6° toward the pointer with a soft glare. All three stay still with reduced motion.
- **Press feedback:** buttons scale to 0.97 for 150ms.
- **List refreshes** (`withViewTransition`): rows with a `viewTransitionName` slide to their new place in 220ms.
- **Once per login:** dashboard panels rise in a wave (0, 50, 90ms; 12/8/6px); the hours ring fills from zero (900ms, `animate-ring`) while its number counts up with it; the Impact line draws left to right (900ms clip-path, `animate-draw`), the all-time hours count up beside it, and the value label appears after; the stat card figures count up as their cards rise; the Top activities bars grow from their left edge (700ms `animate-grow`, scale only, 60ms apart).
- **Figures tween, never jump** (`components/count-up.tsx`): from zero on the entrance (900ms) and from the old value to the new one when it changes, such as approving an hour log (420ms). Ease-out quartic; screen readers get only the final value; reduced motion lands at once.
- **Sign-in:** the clipboard settles in once (600ms, 4px blur to sharp, 12px rise).
- **Tooltips:** the first waits 250ms; neighbours open instantly.
- **The one celebration:** a new certificate prints top to bottom (700ms clip-path).
- **Reduced motion:** everything drops to near zero.

## Shapes

Cards, panels, empty states, the ticket: 16px. Inline lists inside a card: 12px. Buttons, inputs: 6px. Sidebar rows: 8px. Sign-up toggles and badges: fully round. Slot marks 2px.

## Components

### Buttons
- **Primary:** Brand Green, white text. One per screen, top right (Sign up on dealt cards and Approve on the review stack are the exceptions).
- **Outline:** white, 1px input line. Second actions, Send back, Find volunteers.
- **Ghost:** no fill. Add free times.
- **Destructive:** red, only inside confirm dialogs.
- **Demo account buttons** on sign-in are outline toggles with `aria-pressed`; the picked one gets an ink ring and a check.

### Brand mark
`components/brand-mark.tsx` (`BrandMark`), masters and icon generator in `build/brand/` (`node build/brand/make.mjs`). Four tally bars with the fifth stroke cut out as a 30° channel: the missing stroke is the spot a volunteer fills, drawn from the slot marks. One solid shape in the current text colour; no tile, stroke, gradient or second colour in the app. At 20 px and under it switches to a three-bar cut. The wordmark is "Turnout" in Geist 500 beside the mark (24 px mark: sidebar at 15px, sign-in at 17px). Green appears only on the app icon: the mark in #3fbf74 on a #111 tile with 56/256 corners.

### Slot marks (signature)
`components/slots.tsx`. `Slots` draws one 6x12px mark per spot (filled = slot-filled, open = slot-open), up to 20 marks; bigger shifts scale and never look full or empty unless they are. `SpotsRow` adds the mono words. `CapacityBar` (status.tsx) wraps them with the words above, amber when full.

### Shift card band
`TypeBand` (components/activity.tsx): an 80px (64px in Browse) band in the type's tint with its mark, and an optional white badge in the corner for a match score. Sits at the top of every catalog card, dealt card and deck card.

### Next-shift ticket (volunteer home)
The first upcoming shift: a stub with month, day and weekday behind a dashed tear line, then "Your next shift · in N days", the title in the serif, time and place, and Spot confirmed / Waitlist #n. "+N more shifts" links to My shifts. No upcoming shift: an empty state instead.

### Hours ring
A 112px SVG ring (10px stroke, round caps): approved in green, waiting in pale green, the rest track. The number sits in the middle; the words beside it say how many are approved, how many to go, and how many are waiting. At the goal, a button offers the certificate.

### Dealt for you (recommendations)
Up to three cards: the band with "N% match", "Best match for you" on the first, title and time, the strongest factor's note, then all three factor scores (Skills, Availability, Interest), slot marks and Sign up. Under three matches, a dashed "Nothing else fits you well right now" card fills the gap. An info tooltip explains the 100-point score.

### Add to calendar
`CalendarButton` (components/activity.tsx): outline, small, CalendarPlus icon, on My shifts rows and the activity page once signed up. On the next-shift ticket it is a quiet white ghost button in the top row. Saves an .ics file and confirms with a toast showing the path.

### Suggested volunteers (admin activity page)
Below the roster while a shift is upcoming with open spots: up to five volunteers at a 50% match or better who haven't signed up, each with "N% match" in text-2, the strongest reason in muted text, and an outline Invite button (Send icon) that becomes a muted "Invited" with a check. Same scoring and wording as the volunteer's own recommendations.

### Review stack (admin Impact)
Pending hour logs, oldest first, as up to three stacked cards (volunteer, activity, date, note, hours in 40px). Approve (or the right arrow while the stack has focus) throws the top card right with an "Approved" stamp; Send back (or the left arrow) asks for a 5+ character reason, then throws it left. A "Just reviewed" list keeps the last five decisions. Approving refreshes the chart, the stats and the tab badge. No undo: the backend can't reverse a review.

### Month chart
One smooth green line (`smoothPath` in `lib/chart.ts`, clamped so it never dips below zero) over a faint green fill, solid hairline gridlines, mono axis labels, a scale rounded up to a multiple of 4 with 20% headroom. Only the month in progress gets a point and a value label. Each month is a focusable column with a tooltip and a hairline on hover; a hidden table carries the numbers for screen readers.

### Sign-up
Left: the paper panel with "Pick a shift. We'll hold your spot." and a fanned deck of up to eight real upcoming shifts (`activities.preview`, public). Right: two questions as round toggles (what you like doing, which days you're free), then name, email, password (with a three-part strength bar and a show/hide button) and confirm. Answering scores every card with the real recommendation rules and brings the best fit (50% or better) to the top. "Hold my spot at …" (on by default) signs the new volunteer up for the top card right after the account is created; the answers become their starting interests and availability (free day = 08:00-20:00). The panel stays in view while the form scrolls.

### Welcome (first-run setup) and sign-in
Turnout is for any nonprofit. A fresh install opens on **Welcome** (direction C, chosen 2026-11-23): set up your organization (name, your name, email, password twice) or try the example organization as either role in one click. Once anyone has an account, Welcome is gone for good.

Both screens share the left paper panel: the brand, the serif headline "Every shift's sign-up sheet, in one place", and the sign-up-sheet clipboard (one labelled image, paper in both themes because it is an object, not a surface). The sheet fills itself once per app session: each name writes in left to right at an even pen speed (`animate-write`, 560ms linear, 640ms apart), and the moment it lands its slot mark fills from the bottom and "spots left" ticks down (`animate-tick`). Once the last name lands, a green tally stroke draws across the filled slot marks (`animate-strike`, 420ms clip-path, 160ms after), echoing the Turnout mark. Then it rests; no loop. Reduced motion shows it finished.

While the example data is loaded, the bottom of the panel offers its accounts: "Riverside Community Partners" with an amber **Example data** tag, then "Try as a volunteer" (Maria Lopez) and "Try as a coordinator" (Dana Whitfield), each a tile on a paper-ink tint with an arrow that nudges 2px on hover. With them on offer, the explainer line drops; under 760px tall the sheet steps aside so the tiles and the form stay in view. A real organization's sign-in has no tiles and the explainer returns. Hidden under 768px wide. Right: the form on the card surface, with the org name in the sign-in subtitle.

**The Example Is Labelled Rule.** The made-up organization never passes for a real one: its name only appears beside the Example data tag, and demo reset exists only while it is loaded.

### Navigation
Sidebar rows are 32px, 8px corners, 16px line icons (1.5 stroke), text-2 labels. Hover: a 4% ink fill. Active: sidebar-accent step plus an inset hairline, foreground text. Counts (Hour approvals, Notifications) are muted mono numbers at the right, with a screen-reader word.

### Empty and Error States
Empty: dashed 16px box with a line icon, a title, one sentence, an optional button. Error: light red panel, "We couldn't load this page.", the reason, Try again.

## Do's and Don'ts

### Do:
- **Do** use tokens by name so dark mode works.
- **Do** keep green to the main action and one key figure; let activity tints name types.
- **Do** show capacity with slot marks, and put a type band on every shift card.
- **Do** give every status a word as well as a color.
- **Do** read the organization's name from `useSession().org`, never a constant.

### Don't:
- **Don't** wash the sidebar selection or page backgrounds in green, or use an activity tint for a status.
- **Don't** use amber for anything but waiting, or red for anything but errors.
- **Don't** add shadows to cards at rest, or nest panels.
- **Don't** use the serif or the hand face outside the places listed above.
- **Don't** animate layout properties (height, width) or chart bars.
