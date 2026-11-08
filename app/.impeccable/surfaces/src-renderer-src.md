---
version: 1
slug: "src-renderer-src"
primary_target: "src/renderer/src"
related_targets: []
---

# ServeHub app (all renderer screens)

Mode: Operate. Built code-first. The visual world is pinned by the user-approved Figma file tJfyvE4fPnORzU8PZv0IHr (docs/design/figma.md).

Audience and job: volunteers find and join shifts, log hours, and get a certificate. Coordinators run activities, approve hours, find people by skill, and report impact. FBLA judges watch a 7-minute live demo.

## Direction contract

THESIS: A working volunteer desk where every rule shows its reason in place: capacity bars, waitlist position, match reasons, hour limits. It refuses the gray SaaS template where state is hidden behind clicks.

OWN-WORLD: White work areas on a zinc-50 sidebar. Riverside green #15803d carries primary actions, selection, approved states, and the chart series. Amber #b45309 on #fef3c7 marks waitlist and pending. Red is only for errors and rejection. Small rounded radii, 1px zinc borders, soft offset shadows only on floating layers. Type is a geometric sans with tabular numerals, used for hours and dates.

STORY: The visitor sees what's next, how close they are to their goal, and the one best next action. The judge sees the prompt's requirements working, each one labeled in plain words.

FIRST VIEWPORT: A left sidebar (brand, role-specific nav, Help, and the user at the bottom), then a page header with the title, a one-line subtitle, and one or two actions at the top right. On the volunteer dashboard, the goal progress card and upcoming shifts sit side by side, with recommendation cards below showing their match % and reasons.

FORM: The user pinned the direction, so no roll was made. Their words: "use shadcn regesitries for ideas, use the impeccable design skill to execute them, and also use the humanizer skill to reduce the overcomplicated words, additionally use figma mcp and playwright skill to design, build, test" , followed by approval of the Figma mockups built from those registries (sidebar-07 shell, cards, tables, badges).
seed: none

Signature move: capacity and match made visible. Every activity card carries a filled bar of its spots, which turns amber with the waitlist count once full, and every recommendation names why it matched.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
