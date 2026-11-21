# Claude setup for this repo

What is installed, grouped by job, and which one to pick when several overlap. Skill folders have to stay flat (`.claude/skills/<name>/`), so the grouping lives here rather than in folders.

## Skills by department

**Motion** (project skills, from `emilkowalski/skills`)
- Build: `animate`, `choreograph` (several elements together), `gestures` (drag and swipe)
- Review: `review-animations` (one diff), `improve-animations` (whole codebase, plan only), `animation-performance` (dropped frames)
- Decide: `find-animation-opportunities`, `remove-animations`, `animation-vocabulary` (name an effect)

**Design and polish**
- `impeccable` (plugin): critique, audit, polish, document the design system. Its hook scans UI files after each edit.
- `unslop` (plugin): remove the AI-generated look, find a direction.
- `emil-design-eng`, `apple-design`: interaction details and physical feel.
- `learn-taste`: record design preferences in `docs/design-taste.md`.

**Prototyping and testing UI**
- `prototype`: side-by-side variants before committing to one.
- `break-ui`: worst-case data behind a toggle.
- `chrome-devtools-mcp` (plugin): a11y, console, performance on browser-runnable pages. For the Electron window use Playwright's `_electron` (see `app/tests/e2e/app.ts`).

**Components**
- `pick-ui-library`, `ask-sonner`, and the `shadcn` MCP server (`.mcp.json`).

**Code quality**
- `ponytail` (plugin): smallest-change mode, plus `/ponytail-review` and `/ponytail-audit`.
- `code-review`, `simplify`, `security-review` (built in).
- `fable-playbook` (project skill): how to plan, split and verify a multi-step task here.

**Understanding the code**
- `graphify`: knowledge graph in `graphify-out/` (code and docs).
- `codebase-memory` (MCP + hooks): symbol and call graph.
- `floorplan` (plugin): the visual map in `floorplan/`.
- `rederive` (plugin): quiz yourself on the design decisions before FBLA Q&A.

**Writing**
- `humanizer` (plugin): make prose read less like AI.

**Setup checks**
- `env-smoke-test` + `scripts/verify-setup.ps1` + `test-env/`: verify plugins and MCP servers load.

## When tools overlap

- **Three code maps.** For "what calls this / what does this touch", ask `codebase-memory` (it indexes itself). For "how does this feature connect to the docs and design", ask `graphify`. For an exact string or a file you can already name, just grep or read it. No map has to come first.
- **Three design reviewers.** `impeccable` for a scored critique or an audit, `unslop` when the problem is "looks generated", `emil-design-eng` for how one component feels. Running all three on one screen mostly repeats findings.
- **Two animation reviewers.** `review-animations` for a change, `improve-animations` for a roadmap.

## Keeping context light

- Every installed skill costs a description line in every session, used or not. Remove skills that can't apply (the Swift, Expo and mobile-web skills were removed for this reason).
- `CLAUDE.md` at the root stays a short index. Detail goes in the file the index points to, and `app/CLAUDE.md` only loads when work happens in `app/`.
- The user-level hooks in `~/.claude/settings.json` run `codebase-memory-mcp hook-augment` on every Grep, Glob, Bash and Read. If sessions feel noisy, that is the first thing to trim.
- `.claude/skills/*` are links to `.agents/skills/*`, but Git on Windows stores them as full copies, so each skill is in the repo twice. Harmless; `.graphifyignore` already skips both.
