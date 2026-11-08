# ServeHub — Figma design

File: https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr

Use these frames as the reference when building the screens. They use shadcn/ui parts (sidebar-07, login-03, dashboard-01, chart-bar-default, table, badge, progress).

## Pages and frames

**Tokens** page
- [ServeHub Tokens](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=1-64): light and dark colors, type scale, spacing, radius.
  - Variables: `Color · Light`, `Color · Dark` (same names as shadcn CSS vars), `Scale` (space/*, radius/*). The Starter plan allows only one mode per collection, so light and dark are separate collections.

**Screens** page (each frame is 1280×800)
- [Components](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=2-3): Button, Badge, Input, Sidebar / Volunteer, Sidebar / Admin
- [01 Login](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=3-2): role tabs, email field with focus ring, offline note
- [02 Volunteer Dashboard](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=3-45): hours goal progress, upcoming shifts, "Recommended for you" cards with match %
- [03 Browse Activities](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=4-79): search, date/skill/type filters, cards with spots left or "Join waitlist"
- [04 Help Assistant](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=4-365): typed question with a step-by-step answer, related questions, topics, keyboard shortcuts
- [05 Admin Impact Dashboard](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=4-575): KPI cards, approved hours by month, top events, skill gaps
- [06 Hour Approvals](https://www.figma.com/design/tJfyvE4fPnORzU8PZv0IHr?node-id=4-781): table with row approve/reject, bulk approve, flagged entry ("Check hours")

## Accessibility notes shown in the mockups
- Text colors meet WCAG AA (4.5:1) on their backgrounds.
- Focus state: a 2px `ring` outline. It is shown on the Login email field, the first "Sign up" on Browse, the Help search box, and the first "Approve" button.
- Every input has a visible label, or a label in the placeholder for search-only boxes (add `aria-label` in code).
