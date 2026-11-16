# Graph Report - fblacode26-27  (2026-11-10)

## Corpus Check
- 175 files · ~158,120 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1408 nodes · 3471 edges · 89 communities (75 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8faab20e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Apple Fluid Motion
- Break UI & Prototyping
- Rederive Structure Script
- Animation Audit Workflow
- Sonner & UI Libraries
- Smoke Test Harness
- Swift Language Skills
- Gesture Dismiss Recipes
- activities.tsx
- animate skill
- Mobile Web Baseline
- Animation Performance
- Rederive Learning Loop
- Animation Standards Reference
- review-animations skill
- types.ts
- reports.ts
- app-shell.tsx
- Press Feedback
- npx
- Expo Animation Recipes
- electron-builder.yml
- Choreographing Motion
- Animation Recipes
- activities.ts
- app/package.json
- cn
- Worst-Case Catalog
- Components
- Animation Standards Reference
- signups.ts
- smart.test.ts
- Animation Audit Playbook
- Write Swift
- session.tsx
- sidebar.tsx
- Apple Design
- The Fixes
- Prototyping Variants
- Glossary
- components.json
- dependencies
- Animation Performance
- auth.ts
- utils.ts
- Finding Animation Opportunities
- scripts
- Removing Animations
- Gesture-Driven UI
- chart.tsx
- app.ts
- eslint.config.mjs
- radix-ui
- Working With Sonner
- Product
- sheet.tsx
- compilerOptions
- The list
- compilerOptions
- shadcn-registry.md
- Design Engineering
- ServeHub
- help.ts
- Component Building Principles
- Emil Design Engineering skill
- Break UI skill
- electron.vite.config.ts
- tsconfig.json
- The Animation Decision Framework
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- Core Philosophy
- Debugging Animations
- ServeHub — Figma design
- package.json
- ServeHub app (all renderer screens)
- preload/index.ts
- index.d.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 150 edges
2. `Button()` - 56 edges
3. `react` - 44 edges
4. `PageBody()` - 38 edges
5. `PageHeader()` - 37 edges
6. `Loader()` - 34 edges
7. `useQuery()` - 34 edges
8. `Approvals()` - 33 edges
9. `EmptyState()` - 31 edges
10. `Reports()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Smoke Test Page (deliberately flawed UI)` --conceptually_related_to--> `Before/After/Why review table format`  [AMBIGUOUS]
  test-env/fixtures/ui-sample.html → .agents/skills/emil-design-eng/SKILL.md
- `Test on real hardware` --semantically_similar_to--> `Emil Design Engineering skill`  [INFERRED] [semantically similar]
  .agents/skills/mobile-native/SKILL.md → .agents/skills/emil-design-eng/SKILL.md
- `Never disable zoom; 16px inputs` --conceptually_related_to--> `Smoke Test Page (deliberately flawed UI)`  [INFERRED]
  .agents/skills/mobile-native/SKILL.md → test-env/fixtures/ui-sample.html
- `Animation Audit Playbook` --semantically_similar_to--> `Animation Standards Reference`  [INFERRED] [semantically similar]
  .agents/skills/improve-animations/AUDIT.md → .agents/skills/review-animations/STANDARDS.md
- `EASE_OUT / EASE_IN_OUT / EASE_SHEET Easing.bezier constants` --semantically_similar_to--> `--ease-out / --ease-in-out / --ease-drawer tokens`  [INFERRED] [semantically similar]
  .agents/skills/animate-expo/SKILL.md → .agents/skills/animate/SKILL.md

## Import Cycles
- 2-file cycle: `app/src/main/services/activities.ts -> app/src/main/services/signups.ts -> app/src/main/services/activities.ts`

## Hyperedges (group relationships)
- **Emil Kowalski animation skill suite (build, perf, name, find, audit, remove, review)** — agents_skills_animate_skill_animate, agents_skills_animate_expo_skill_animate_expo, agents_skills_animation_performance_skill_animation_performance, agents_skills_animation_vocabulary_skill_animation_vocabulary, agents_skills_find_animation_opportunities_skill_find_animation_opportunities, agents_skills_improve_animations_skill_improve_animations, agents_skills_remove_animations_skill_remove_animations, agents_skills_review_animations_skill_review_animations [EXTRACTED 1.00]
- **Skills derived from Emil Kowalski's design engineering philosophy** — agents_skills_emil_design_eng_skill_emil_design_eng, agents_skills_ask_sonner_skill_ask_sonner, agents_skills_break_ui_skill_break_ui, agents_skills_mobile_native_skill_mobile_native, agents_skills_pick_ui_library_skill_pick_ui_library, agents_skills_prototype_skill_prototype [EXTRACTED 1.00]
- **Environment smoke test harness** — claude_skills_env_smoke_test_skill_env_smoke_test, claude_skills_env_smoke_test_skill_verify_setup_ps1, test_env_fixtures_ai_sounding_ai_sounding_text, test_env_fixtures_ui_sample_smoke_test_page, claude_project_overview [EXTRACTED 1.00]
- **Fluid gesture-driven motion (springs, velocity, interruptibility, boundaries)** — agents_skills_apple_design_skill_interruptibility, agents_skills_apple_design_skill_spring_damping_response, agents_skills_apple_design_skill_velocity_handoff, agents_skills_apple_design_skill_momentum_projection, agents_skills_apple_design_skill_rubber_banding, agents_skills_emil_design_eng_skill_momentum_dismissal [INFERRED 0.85]
- **Velocity-based gesture dismissal with boundary resistance** — agents_skills_animate_expo_recipes_project, agents_skills_animate_expo_recipes_rubberband, agents_skills_animate_expo_recipes_bottom_sheet_drag_to_dismiss, agents_skills_animate_recipes_drag_to_dismiss, agents_skills_review_animations_standards_momentum_dismissal [INFERRED 0.85]
- **Should-it-animate frequency/purpose gates** — agents_skills_review_animations_standards_frequency_table, agents_skills_animate_skill_build_sequence, agents_skills_find_animation_opportunities_skill_four_question_gate, agents_skills_remove_animations_skill_removal_gate_tree, agents_skills_animate_skill_purpose_categories [INFERRED 0.85]

## Communities (89 total, 14 thin omitted)

### Community 0 - "Apple Fluid Motion"
Cohesion: 0.20
Nodes (3): Apple Design skill, Designing Fluid Interfaces (WWDC 2018), Apple's eight design principles

### Community 1 - "Break UI & Prototyping"
Cohesion: 0.20
Nodes (5): Demo data / Worst case toggle, Picker behavior contract (keys 1-N, arrows, R, ?v= param), setActive(), Prototype Picker spec, Prototype skill

### Community 2 - "Rederive Structure Script"
Cohesion: 0.18
Nodes (3): lines(), list_files(), read()

### Community 3 - "Animation Audit Workflow"
Cohesion: 0.21
Nodes (9): Opportunity hunt seams, Animation Audit Playbook, Eight audit categories, Plan Template, plans/README.md index, improve-animations skill, HIGH / MEDIUM / LOW severity, Block / Approve verdict (+1 more)

### Community 4 - "Sonner & UI Libraries"
Cohesion: 0.24
Nodes (9): Sonner API Reference, toast() options and functions, <Toaster /> props, Ask Sonner skill, Sonner toast library, Sonner troubleshooting table, Emil Kowalski, Curated library list (base-ui, cmdk, motion, recharts, Virtuoso, zustand...) (+1 more)

### Community 5 - "Smoke Test Harness"
Cohesion: 0.29
Nodes (9): .mcp.json project MCP servers, fblacode26-27 Claude setup test environment, test-env/settings.template.json, env-smoke-test skill, Smoke test checks (doctor, humanizer, impeccable, chrome-devtools, browser, connectors), scripts/verify-setup.ps1 (doctor script), AI-sounding text fixture, [env-smoke-test] page loaded console log (+1 more)

### Community 6 - "Swift Language Skills"
Cohesion: 0.29
Nodes (5): Sendable and data-race fixes, Structured concurrency (async let, task groups), Swift 6 migration order, Swift Testing (@Test, #expect), Write Swift skill

### Community 8 - "activities.tsx"
Cohesion: 0.08
Nodes (129): router, ActivityCard(), DateTile(), SignupButton(), WhenWhere(), CertificateView(), FieldProps, FormField() (+121 more)

### Community 9 - "animate skill"
Cohesion: 0.24
Nodes (6): Expo Animation Recipes, EASE_OUT / EASE_IN_OUT / EASE_SHEET Easing.bezier constants, Animation Recipes (web), animate skill, --ease-out / --ease-in-out / --ease-drawer tokens, Six animation purposes

### Community 11 - "Animation Performance"
Cohesion: 0.20
Nodes (8): CADisableMinimumFrameDurationOnPhone (120fps), animate-expo skill, Reanimated spring configs (duration + dampingRatio), animation-performance skill, Find / diagnose / report workflow, Frame budget (16.7ms / 8ms at 120Hz), Layout / paint / composite property tiers, Jank symptom table

### Community 12 - "Rederive Learning Loop"
Cohesion: 0.40
Nodes (4): history.sh script, Decision map (.rederive/map.md), Learning log (.rederive/log.md), Rederive skill

### Community 13 - "Animation Standards Reference"
Cohesion: 0.20
Nodes (8): Main thread vs hardware-accelerated drivers, Motion 14.2+ hardware-accelerated x/y/scale, animation-vocabulary skill, Motion effect glossary, /vocabulary page, Emil Kowalski animation philosophy, Animation Standards Reference, Feel debugging (slow motion, frame-by-frame, real device, fresh eyes)

### Community 14 - "review-animations skill"
Cohesion: 0.19
Nodes (8): Never Ship table (web), find-animation-opportunities skill, "You Don't Need Animations" (Emil Kowalski), Invocation variants (quick, deep, plan, execute, reconcile), Reducing table, remove-animations skill, Aggressive escalation triggers, review-animations skill

### Community 15 - "types.ts"
Cohesion: 0.09
Nodes (44): ApiMap, ApiName, ActivityFilter, activityFilterSchema, ActivityInput, activitySchema, availabilitySchema, certificateCodeSchema (+36 more)

### Community 17 - "reports.ts"
Cohesion: 0.15
Nodes (37): all(), one(), ActivityRow, loadActivities(), parse(), requireVolunteer(), approvedTotal(), hourLogsFor() (+29 more)

### Community 19 - "app-shell.tsx"
Cohesion: 0.10
Nodes (29): ADMIN_NAV, AppShell(), NavItem, NavItemLink(), useNavCounts(), VOLUNTEER_NAV, DropdownMenu(), DropdownMenuCheckboxItem() (+21 more)

### Community 26 - "Expo Animation Recipes"
Cohesion: 0.06
Nodes (33): Bottom sheet you can drag to dismiss, Collapsing header on scroll, Expo Animation Recipes, Firing something once at a threshold, Keyboard-synced UI, List entrances, Press feedback, Screen transitions (Expo Router) (+25 more)

### Community 27 - "electron-builder.yml"
Cohesion: 0.06
Nodes (33): appId, appImage, artifactName, asarUnpack, directories, buildResources, dmg, artifactName (+25 more)

### Community 28 - "Choreographing Motion"
Cohesion: 0.06
Nodes (32): Carry: steer a shared layout animation through its parent, Choreography Recipes, Direction-aware steps, Imperative orchestration (`useAnimate`), Overlap: CSS stagger with an index variable, Overlap: Motion variants with a non-uniform stagger, Sequence: morph between two rich states with a crossfade, Sequence: one draw after another (+24 more)

### Community 29 - "Animation Recipes"
Cohesion: 0.06
Nodes (31): Accordion / collapse, Animation Recipes, Button press, Drag to dismiss, Drawer / sheet, Dropdown, popover, menu, select, Hold to confirm, Masking a crossfade that won't settle (+23 more)

### Community 30 - "activities.ts"
Cohesion: 0.23
Nodes (28): run(), tx(), activeSignups(), cancelActivity(), checkSkillsExist(), createActivity(), deleteActivity(), getActivity() (+20 more)

### Community 31 - "app/package.json"
Cohesion: 0.09
Nodes (30): author, description, devDependencies, electron@^44.7.2, electron-builder@^26.15.3, @electron-toolkit/tsconfig@^2.0.0, prettier@^3.9.10, react@^19.3.0 (+22 more)

### Community 32 - "cn"
Cohesion: 0.11
Nodes (27): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+19 more)

### Community 33 - "Worst-Case Catalog"
Cohesion: 0.06
Nodes (29): Collections, Emails, URLs, identifiers, Environment, Images and media, Labels, titles, and copy from data, Numbers and money, People and names, States (+21 more)

### Community 34 - "Components"
Cohesion: 0.07
Nodes (28): Buttons, Capacity Bar (signature), Cards / Containers, Chips (Pills), Colors, Components, Date Tile, Design System: ServeHub (+20 more)

### Community 35 - "Animation Standards Reference"
Cohesion: 0.07
Nodes (26): Aggressive Escalation Triggers, Guidelines, Initial Response, Operating Posture, Part 1 — Findings table (REQUIRED), Part 2 — Verdict (REQUIRED), Remedial Preference Hierarchy, Required Output Format (+18 more)

### Community 36 - "signups.ts"
Cohesion: 0.17
Nodes (14): Db, openDb(), SCHEMA, createWindow(), isAppUrl(), Handlers, handlers, registerIpc() (+6 more)

### Community 37 - "smart.test.ts"
Cohesion: 0.14
Nodes (17): ACTIVITIES, DEMO_ADMIN, DEMO_VOLUNTEER, seedDemo(), SKILLS, VOLUNTEERS, hashPassword(), minutes() (+9 more)

### Community 38 - "Animation Audit Playbook"
Cohesion: 0.08
Nodes (22): 1. Purpose & frequency, 2. Easing & duration, 3. Physicality & origin, 4. Interruptibility, 5. Performance, 6. Accessibility, 7. Cohesion & tokens, 8. Missed opportunities (+14 more)

### Community 39 - "Write Swift"
Cohesion: 0.09
Nodes (22): 10. ARC and object lifetime, 11. Testing — Swift Testing by default, 12. Macros, 13. Logging and debugging, 14. Unsafe code and interop, 15. Modern syntax you should be using, 16. Migrating an existing codebase to Swift 6, 1. Model data with value types (+14 more)

### Community 40 - "session.tsx"
Cohesion: 0.11
Nodes (16): App(), ErrorBoundary, FriendlyError(), home(), PublicOnly(), RequireRole(), RouteError(), ThemedToaster() (+8 more)

### Community 41 - "sidebar.tsx"
Cohesion: 0.15
Nodes (19): SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarInput(), SidebarMenuAction(), SidebarMenuButton(), sidebarMenuButtonVariants, SidebarMenuSub() (+11 more)

### Community 42 - "Apple Design"
Cohesion: 0.09
Nodes (21): 10. Gesture design details (the "feel" checklist), 11. Frame-level smoothness, 12. Materials & depth — translucency conveys hierarchy, 13. Multimodal feedback — motion + sound + haptics, 14. Reduced motion & accessibility, 15. Typography — optical sizing, tracking, leading, 16. Design foundations — the eight principles, 17. Process (+13 more)

### Community 43 - "The Fixes"
Cohesion: 0.09
Nodes (21): 10. Status bar color doesn't match, 11. Right in Chrome, wrong on phone, 1. Hover state stuck after tap, 2. Gray/blue flash on tap, 3. Layout has the wrong height, 4. Page zooms into the input, 5. Tap feels laggy, 6. Pull-to-refresh hijacks scroll (+13 more)

### Community 44 - "Prototyping Variants"
Cohesion: 0.10
Nodes (19): Behavior contract, Markup, Reference wiring, Rules, Styles, The Picker, Hard Rules, Initial Response (+11 more)

### Community 45 - "Glossary"
Cohesion: 0.11
Nodes (18): Animation Vocabulary, Easing — how speed changes over an animation, Entrances & Exits — how elements appear and disappear, Examples, Feedback & Interaction — responding to the user's actions, Glossary, Initial Response, Instructions (+10 more)

### Community 46 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 47 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @electron-toolkit/utils@^4.0.0, @fontsource-variable/geist@^5.3.0, lucide-react@^1.69.0, radix-ui@^1.8.1, react-router@^8.5.1 (+10 more)

### Community 48 - "Animation Performance"
Cohesion: 0.11
Nodes (17): Animation Performance, Hard Rules, Initial Response, Operating Posture, Phase 1: Find what animates, Phase 2: Diagnose, Phase 3: Report, React: Don't Animate Through State (+9 more)

### Community 49 - "auth.ts"
Cohesion: 0.19
Nodes (10): createAdmin(), createUser(), login(), signup(), toSession(), UserRow, verifyPassword(), makeWorld() (+2 more)

### Community 50 - "utils.ts"
Cohesion: 0.17
Nodes (13): Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator(), FieldSet() (+5 more)

### Community 51 - "Finding Animation Opportunities"
Cohesion: 0.12
Nodes (16): 1. Frequency — how often will a user see this?, 2. Purpose — why does this animate?, 3. Speed — can it stay inside budget?, 4. Function — does motion help or hinder here?, Finding Animation Opportunities, Hard Rules, Initial Response, Operating Posture (+8 more)

### Community 52 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:linux, build:mac, build:unpack, build:win, dev, format (+8 more)

### Community 53 - "Removing Animations"
Cohesion: 0.12
Nodes (15): Cleanup, Hard Rules, Initial Response, Operating Posture, Part 1 — Removed and reduced, Part 2 — Kept (REQUIRED), Part 3 — Cleanup and verdict, Reducing (+7 more)

### Community 54 - "Gesture-Driven UI"
Cohesion: 0.13
Nodes (14): First decision: build it, or use a solution that exists?, Gesture-Driven UI, Hold gestures are asymmetric, Interruptibility is non-negotiable, Linked values, Motion drag props, Reduced motion, Release phase rules (+6 more)

### Community 55 - "chart.tsx"
Cohesion: 0.20
Nodes (13): recharts@^3.8.0, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+5 more)

### Community 56 - "app.ts"
Cohesion: 0.20
Nodes (5): @playwright/test@^1.65.0, launch(), shot(), Bridge, @playwright/test

### Community 57 - "eslint.config.mjs"
Cohesion: 0.15
Nodes (12): @electron-toolkit/eslint-config-prettier@^3.0.1, @electron-toolkit/eslint-config-ts@^4.0.0, eslint@^9.39.5, eslint-plugin-react@^7.37.5, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7, @electron-toolkit/eslint-config-prettier, @electron-toolkit/eslint-config-ts (+4 more)

### Community 58 - "radix-ui"
Cohesion: 0.19
Nodes (10): Badge(), badgeVariants, Progress(), Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger() (+2 more)

### Community 59 - "Working With Sonner"
Cohesion: 0.15
Nodes (11): Functions, Sonner API Reference, `toast()` options, `<Toaster />`, Initial Response, Picking the right call, Recipes, Setup (+3 more)

### Community 60 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 61 - "sheet.tsx"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 62 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, baseUrl, composite, jsx, paths, extends, include, @renderer/* (+2 more)

### Community 63 - "The list"
Cohesion: 0.18
Nodes (10): Charts, Common mismatches to catch, How to use this, Initial Response, Interaction & performance, Motion & visuals, Picking The Right Library, State & styling (+2 more)

### Community 64 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, baseUrl, composite, paths, types, extends, include, @shared/* (+1 more)

### Community 65 - "shadcn-registry.md"
Cohesion: 0.20
Nodes (9): block (97), example (239), font (52), hook (1), internal (13), lib (1), style (2), theme (5) (+1 more)

### Community 66 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 67 - "ServeHub"
Cohesion: 0.25
Nodes (7): Demo accounts, How it meets the prompt, How it's built, Libraries and licenses, Run it, ServeHub, Validation that checks meaning, not just format

### Community 68 - "help.ts"
Cohesion: 0.32
Nodes (7): answer(), Faq, FAQS, normalize(), STOP_WORDS, SYNONYMS, Role

### Community 69 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 70 - "Emil Design Engineering skill"
Cohesion: 0.38
Nodes (3): Emil Design Engineering skill, Before/After/Why review table format, motion (Framer Motion)

### Community 71 - "Break UI skill"
Cohesion: 0.33
Nodes (5): Environment worst cases (320px, zoom, dark, RTL, touch), Unbreakable strings (emails, URLs, IDs), Worst-Case Catalog, Break UI skill, UI failure signatures table

### Community 72 - "electron.vite.config.ts"
Cohesion: 0.29
Nodes (6): electron-vite@^6.0.0, @tailwindcss/vite@^4.3.4, @vitejs/plugin-react@^6.1.2, electron-vite, @tailwindcss/vite, @vitejs/plugin-react

### Community 73 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 74 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 75 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 76 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 77 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 78 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 79 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 80 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 81 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 82 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

### Community 83 - "ServeHub — Figma design"
Cohesion: 0.50
Nodes (3): Accessibility notes shown in the mockups, Pages and frames, ServeHub — Figma design

### Community 84 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, shadcn@^4.23.0, shadcn

## Ambiguous Edges - Review These
- `Before/After/Why review table format` → `Smoke Test Page (deliberately flawed UI)`  [AMBIGUOUS]
  test-env/fixtures/ui-sample.html · relation: conceptually_related_to

## Knowledge Gaps
- **22 isolated node(s):** `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Apple's eight design principles`, `Designing Fluid Interfaces (WWDC 2018)`, `Environment worst cases (320px, zoom, dark, RTL, touch)` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 644 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `activities.tsx`, `sidebar.tsx`, `utils.ts`, `app-shell.tsx`, `chart.tsx`, `radix-ui`, `sheet.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Apple's eight design principles` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `activities.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08070953436807095 - nodes in this community are weakly interconnected._
- **Why does `react` connect `activities.tsx` to `cn`, `session.tsx`, `sidebar.tsx`, `utils.ts`, `app-shell.tsx`, `chart.tsx`, `radix-ui`, `sheet.tsx`, `app/package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08865248226950355 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `activities.tsx` to `sidebar.tsx`, `dependencies`, `app-shell.tsx`, `sheet.tsx`, `app/package.json`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Before/After/Why review table format` and `Smoke Test Page (deliberately flawed UI)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._