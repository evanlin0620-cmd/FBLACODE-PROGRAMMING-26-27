# ServeHub (FBLA Coding & Programming 2026-27)

An offline Electron desktop app that runs a nonprofit's volunteer program: volunteers find shifts and log hours, coordinators approve them and report impact. The app is in `app/`; everything else in this repo is docs and Claude tooling.

Read only what the task needs:

| For | Read |
|---|---|
| Where work stands, open decisions | `handoff.md` |
| Layers, data flow, what each file does | `docs/architecture.md` |
| Commands, code conventions, checks | `app/CLAUDE.md` (loads when you work in `app/`) |
| Colors, type, components, do's and don'ts | `app/DESIGN.md` (UI work only) |
| Users, purpose, FBLA rating criteria | `app/PRODUCT.md` |
| Which skill, plugin or code map to use | `docs/claude-setup.md` |

Working here:

- Windows, Git Bash and PowerShell. For multi-file text edits use Edit or a Node script; PowerShell 5.1 text cmdlets corrupt UTF-8 punctuation.
- Commit and push only when asked. `main` is the only branch.
- After code edits, `graphify update .` keeps the knowledge graph current (no LLM cost).
