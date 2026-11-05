# fblacode26-27 — Claude setup test environment

This folder is a sandbox for initializing and verifying skills, plugins and MCP servers.

- `scripts/verify-setup.ps1` — doctor script: runtimes, installed plugins, skill frontmatter, MCP stdio handshakes.
- `.claude/skills/env-smoke-test/` — project skill; ask "run the smoke test" to exercise every skill/plugin/MCP live.
- `test-env/fixtures/` — inputs for the checks (AI-sounding text for humanizer, a flawed UI page for impeccable / chrome-devtools / a11y skills).
- `test-env/settings.template.json` — project plugin config; copy to `.claude/settings.json` to enable it.
- `.mcp.json` — add project-scoped MCP servers here, then rerun the doctor script.

Requirements: Node >= 20.19 (chrome-devtools-mcp), git, Chrome.
