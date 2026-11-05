---
name: env-smoke-test
description: Smoke-test this Claude setup. Use when the user says "smoke test", "test my setup", or "check skills/plugins/MCPs". Exercises each installed skill, plugin and MCP server against the fixtures in test-env/.
---

# Environment smoke test

Run each check in order and report a pass/fail table at the end.

1. **Doctor script** – run `./scripts/verify-setup.ps1` and capture its output.
2. **Project skill** – you are reading this file, so project skill loading works. Mark PASS.
3. **humanizer plugin** – invoke the `humanizer:humanizer` skill on `test-env/fixtures/ai-sounding.txt`. PASS if it returns a rewrite.
4. **impeccable plugin** – if an `impeccable` skill is listed, run its audit/critique on `test-env/fixtures/ui-sample.html`. If it is not listed, mark NOT INSTALLED.
5. **chrome-devtools MCP** – call ToolSearch with `chrome-devtools`. If tools load, open `test-env/fixtures/ui-sample.html` (file:// URL), take a snapshot, and list console messages. PASS if the console shows `[env-smoke-test] page loaded`.
6. **Built-in browser** – open the same fixture with `mcp__Claude_Browser__preview_start` and read its text.
7. **Connectors** (Slack, Docs, etc.) – call ToolSearch for each and report whether tools load. Do not send messages or create documents.

Never perform outward-facing actions (sending messages, publishing) during the smoke test.
