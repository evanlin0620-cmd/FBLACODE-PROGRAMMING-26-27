# ServeHub design taste

What the frontend design sessions of 2026-11-13 to 2026-11-15 taught, written so the next person (or agent) who touches the UI doesn't repeat the same mistakes. `app/DESIGN.md` is the design system itself; this file records the *why* behind the choices and the lessons that cost time.

Three kinds of entry, kept apart on purpose:

- **Your taste**: traced to something you said. Each one quotes you.
- **Learned in testing**: found by running the app, not something you said. Keep or drop them.
- **Needs your answer**: a reason I had to infer. Not a rule until you confirm it.

---

## Your taste

- **Expressive visuals and motion go on the entry screens. The working screens stay calm.** The sign-in hero borrows from the Cardova landing page you liked: a sage-green wash, a headline that rises word by word, and floating sample cards. Inside the app, motion only explains a change.
  Why: ServeHub is a tool for a nonprofit and an FBLA judged demo, not a marketing site.
  <!-- 2026-11-13: "i enjoy the way this company designed their hero page, so use as inspiration ... (also still remember that this is an app meant for fbla and for non profits)" -->
  *The "calm inside" half is my reading of your words. Confirm it below.*

- **Every design and motion choice must have a one-line reason you can say out loud to a judge.** Put it in a code comment next to the choice, or in DESIGN.md. If no reason exists, cut the choice.
  Why: you want to explain your own code during FBLA, not hand it off.
  <!-- 2026-11-13: "so I can actually understand my code for explanation during fbla, so Im not just another vibe coder" -->

- **Motion is held to Emil Kowalski's rules.** No animation on things done many times a day or from the keyboard. Entrances use a strong ease-out (`ease-snappy`). UI motion stays under 300ms; dialogs and toasts are the exceptions. Reduced motion is always handled.
  Why: *inferred.* You picked those skills (/emil-design-eng, /review-animations, /animate, /choreograph) as the bar for the redesign.
  <!-- 2026-11-15: "use /emil-design-eng and /review-animations to investigate and make critiques ... /animate and /animation-vocabulary to start with the animation redesign and /choreograph" -->

## Learned in testing

Each of these came from watching the real app, slowed down or frame by frame.

### Motion

- **Page navigation never animates, and neither does the sidebar highlight.** Both happen dozens of times a session, so motion there is only delay. This was the first thing the find-animation-opportunities skill ruled out.
- **View transitions are for rows that are added or move. Never for rows removed from inside a bordered card.** A bordered card snaps to its new height the moment the data changes. A row that slides up afterwards hangs outside the border for most of the slide (seen on Hour approvals). Additions are fine: the card grows first, then the row arrives inside it.
- **Turn off the whole-page crossfade during view transitions.** With it on, anything that moved, such as the "Recommended for you" heading, showed twice, once at its old spot and once at its new one. Only named elements animate; everything else swaps instantly (`main.css`).
- **A new row waits about 100ms before it fades in.** Without the wait, it drew on top of the neighbour that was still sliding out of its way, so the two rows looked like they passed through each other.
- **Tables that animate need fixed column widths** (`table-fixed` plus widths on the narrow columns). Otherwise adding a row re-measures every column, and each moving row shows its text twice for a moment.
- **A once-only entrance must carry its flag on every route that can land there, and clear it after use.** The sign-in screen has two redirects, and the one without the flag won, so the entrance never played. Once it did play, pressing Back replayed it. Both are fixed in `App.tsx` (`PublicOnly`) and `useWelcome` (`lib/hooks.ts`).
- **Stagger gaps shrink; they are never equal.** Equal gaps look mechanical. Hero headline: 88ms between the first words, down to about 8ms at the end. Dashboard panels: 0, 50, 90ms.
- **Skeletons wait 150ms before showing.** The database is local and answers in a few milliseconds, so an instant skeleton just flashed on every page.

### Data and layout (from the worst-case test, `?data=worst`)

- **Every count is formatted: 1,284, never 1284.** The waitlist label, the "To approve" stat and the hour goal all showed raw numbers.
- **Counts of one read as singular** ("1 of 1 spot left", not "spots").
- **Icons in a flex row get `shrink-0`.** The map-pin icon on dashboard recommendation cards shrank to a dot next to a long location.
- **Tables must still work at the 960px minimum window with an 80-character name.** On Hour approvals and Volunteers, a long name or note pushed the action buttons and skill pills out of the card.
- **Truncated text needs a way to read it in full** (a `title` attribute, or the detail page). Upcoming-shift titles and the sidebar name cut off with no way to see the rest.
- **Empty charts need an empty state.** With no data, "Approved hours by month" is a blank box with two lines in it.

### Tooling

- **New folders outside `src/renderer/src` need their own Tailwind `@source`.** The prototype page rendered without its padding or layout classes until it got its own stylesheet (`prototypes/recommendations/styles.css`).
- **Never rewrite source files with Windows PowerShell's Get-Content/Set-Content.** They read UTF-8 as the old Windows encoding and turned "·" and "’" into "Â·" and "â€™". Use the editor, or Node.

## Needs your answer

1. Is the "working screens stay calm" half of the first rule what you meant? My recommendation is yes: it keeps the demo fast and readable for judges.
2. Is "you chose those skills as the bar" the right reason for the Emil Kowalski motion rule, or is there a different reason you'd give a judge?
3. Should the testing lessons become hard rules in `app/DESIGN.md`? My recommendation: the motion ones yes (they're already in DESIGN.md › Motion), the data and layout ones only after their fixes land.

## Could be an automatic check

- **No `transition-all`.** It animates properties nobody chose, off the GPU. Today it would flag `components/ui/progress.tsx:23` and `components/ui/sidebar.tsx:292`. The check is a grep or an ESLint `no-restricted-syntax` rule matching the class string.
- **Raw counts in the UI.** A unit test for one shared `fmtCount` helper, plus a rule that labels such as the capacity text use it. That needs the helper first, so it waits on the data fixes above.
