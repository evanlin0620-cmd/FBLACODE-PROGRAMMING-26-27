# Graph Report - fblacode26-27  (2026-11-03)

## Corpus Check
- 36 files · ~52,785 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 177 nodes · 228 edges · 27 communities (14 shown, 13 thin omitted)
- Extraction: 80% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.85)
- Token cost: 322,031 input · 0 output

## Community Hubs (Navigation)
- Apple Fluid Motion
- Break UI & Prototyping
- Rederive Structure Script
- Animation Audit Workflow
- Sonner & UI Libraries
- Smoke Test Harness
- Swift Language Skills
- Gesture Dismiss Recipes
- Animation Skill Suite
- Should-It-Animate Gates
- Mobile Web Baseline
- Animation Performance
- Rederive Learning Loop
- Animation Standards
- Removing Animations
- Shared Easing Tokens
- Motion Vocabulary
- Never-Ship Rules
- Press Feedback

## God Nodes (most connected - your core abstractions)
1. `review-animations skill` - 12 edges
2. `Emil Design Engineering skill` - 11 edges
3. `Apple Design skill` - 10 edges
4. `animate-expo skill` - 9 edges
5. `Animation Standards Reference` - 9 edges
6. `Write Swift skill` - 9 edges
7. `animate skill` - 8 edges
8. `find-animation-opportunities skill` - 8 edges
9. `Mobile Native skill` - 8 edges
10. `improve-animations skill` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Smoke Test Page (deliberately flawed UI)` --conceptually_related_to--> `Before/After/Why review table format`  [AMBIGUOUS]
  test-env/fixtures/ui-sample.html → .agents/skills/emil-design-eng/SKILL.md
- `Test on real hardware` --semantically_similar_to--> `Emil Design Engineering skill`  [INFERRED] [semantically similar]
  .agents/skills/mobile-native/SKILL.md → .agents/skills/emil-design-eng/SKILL.md
- `Never disable zoom; 16px inputs` --conceptually_related_to--> `Smoke Test Page (deliberately flawed UI)`  [INFERRED]
  .agents/skills/mobile-native/SKILL.md → test-env/fixtures/ui-sample.html
- `EASE_OUT / EASE_IN_OUT / EASE_SHEET Easing.bezier constants` --semantically_similar_to--> `--ease-out / --ease-in-out / --ease-drawer tokens`  [INFERRED] [semantically similar]
  .agents/skills/animate-expo/SKILL.md → .agents/skills/animate/SKILL.md
- `Animation Audit Playbook` --semantically_similar_to--> `Animation Standards Reference`  [INFERRED] [semantically similar]
  .agents/skills/improve-animations/AUDIT.md → .agents/skills/review-animations/STANDARDS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Emil Kowalski animation skill suite (build, perf, name, find, audit, remove, review)** — agents_skills_animate_skill_animate, agents_skills_animate_expo_skill_animate_expo, agents_skills_animation_performance_skill_animation_performance, agents_skills_animation_vocabulary_skill_animation_vocabulary, agents_skills_find_animation_opportunities_skill_find_animation_opportunities, agents_skills_improve_animations_skill_improve_animations, agents_skills_remove_animations_skill_remove_animations, agents_skills_review_animations_skill_review_animations [EXTRACTED 1.00]
- **Should-it-animate frequency/purpose gates** — agents_skills_review_animations_standards_frequency_table, agents_skills_animate_skill_build_sequence, agents_skills_find_animation_opportunities_skill_four_question_gate, agents_skills_remove_animations_skill_removal_gate_tree, agents_skills_animate_skill_purpose_categories [INFERRED 0.85]
- **Velocity-based gesture dismissal with boundary resistance** — agents_skills_animate_expo_recipes_project, agents_skills_animate_expo_recipes_rubberband, agents_skills_animate_expo_recipes_bottom_sheet_drag_to_dismiss, agents_skills_animate_recipes_drag_to_dismiss, agents_skills_review_animations_standards_momentum_dismissal [INFERRED 0.85]
- **Skills derived from Emil Kowalski's design engineering philosophy** — agents_skills_emil_design_eng_skill_emil_design_eng, agents_skills_ask_sonner_skill_ask_sonner, agents_skills_break_ui_skill_break_ui, agents_skills_mobile_native_skill_mobile_native, agents_skills_pick_ui_library_skill_pick_ui_library, agents_skills_prototype_skill_prototype [EXTRACTED 1.00]
- **Fluid gesture-driven motion (springs, velocity, interruptibility, boundaries)** — agents_skills_apple_design_skill_interruptibility, agents_skills_apple_design_skill_spring_damping_response, agents_skills_apple_design_skill_velocity_handoff, agents_skills_apple_design_skill_momentum_projection, agents_skills_apple_design_skill_rubber_banding, agents_skills_emil_design_eng_skill_momentum_dismissal [INFERRED 0.85]
- **Environment smoke test harness** — claude_skills_env_smoke_test_skill_env_smoke_test, claude_skills_env_smoke_test_skill_verify_setup_ps1, test_env_fixtures_ai_sounding_ai_sounding_text, test_env_fixtures_ui_sample_smoke_test_page, claude_project_overview [EXTRACTED 1.00]

## Communities (27 total, 13 thin omitted)

### Community 0 - "Apple Fluid Motion"
Cohesion: 0.15
Nodes (6): Apple Design skill, Designing Fluid Interfaces (WWDC 2018), Apple's eight design principles, Emil Design Engineering skill, Before/After/Why review table format, motion (Framer Motion)

### Community 1 - "Break UI & Prototyping"
Cohesion: 0.13
Nodes (10): Environment worst cases (320px, zoom, dark, RTL, touch), Unbreakable strings (emails, URLs, IDs), Worst-Case Catalog, Break UI skill, Demo data / Worst case toggle, UI failure signatures table, Picker behavior contract (keys 1-N, arrows, R, ?v= param), setActive() (+2 more)

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

### Community 8 - "Animation Skill Suite"
Cohesion: 0.39
Nodes (7): animate-expo skill, Reanimated spring configs (duration + dampingRatio), animate skill, animation-performance skill, Invocation variants (quick, deep, plan, execute, reconcile), Emil Kowalski animation philosophy, review-animations skill

### Community 11 - "Animation Performance"
Cohesion: 0.29
Nodes (5): CADisableMinimumFrameDurationOnPhone (120fps), Find / diagnose / report workflow, Frame budget (16.7ms / 8ms at 120Hz), Layout / paint / composite property tiers, Jank symptom table

### Community 12 - "Rederive Learning Loop"
Cohesion: 0.40
Nodes (4): history.sh script, Decision map (.rederive/map.md), Learning log (.rederive/log.md), Rederive skill

### Community 13 - "Animation Standards"
Cohesion: 0.40
Nodes (4): Main thread vs hardware-accelerated drivers, Motion 14.2+ hardware-accelerated x/y/scale, Animation Standards Reference, Feel debugging (slow motion, frame-by-frame, real device, fresh eyes)

### Community 14 - "Removing Animations"
Cohesion: 0.50
Nodes (3): find-animation-opportunities skill, "You Don't Need Animations" (Emil Kowalski), remove-animations skill

### Community 15 - "Shared Easing Tokens"
Cohesion: 0.50
Nodes (4): Expo Animation Recipes, EASE_OUT / EASE_IN_OUT / EASE_SHEET Easing.bezier constants, Animation Recipes (web), --ease-out / --ease-in-out / --ease-drawer tokens

### Community 17 - "Motion Vocabulary"
Cohesion: 0.50
Nodes (3): animation-vocabulary skill, Motion effect glossary, /vocabulary page

## Ambiguous Edges - Review These
- `Before/After/Why review table format` → `Smoke Test Page (deliberately flawed UI)`  [AMBIGUOUS]
  test-env/fixtures/ui-sample.html · relation: conceptually_related_to

## Knowledge Gaps
- **20 isolated node(s):** `rubberband() boundary resistance worklet`, `PressableScale component`, `Reanimated spring configs (duration + dampingRatio)`, `Never Ship table (web)`, `Motion 14.2+ hardware-accelerated x/y/scale` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 68 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Emil Design Engineering skill` connect `Apple Fluid Motion` to `Break UI & Prototyping`, `Mobile Web Baseline`, `Sonner & UI Libraries`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `animate-expo skill` (e.g. with `Should it animate? frequency table` and `Reduced motion: fewer and gentler, not zero`) actually correct?**
  _`animate-expo skill` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `rubberband() boundary resistance worklet`, `PressableScale component`, `Reanimated spring configs (duration + dampingRatio)` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Break UI & Prototyping` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Why does `review-animations skill` connect `Animation Skill Suite` to `Animation Audit Workflow`, `Should-It-Animate Gates`, `Animation Standards`, `Removing Animations`, `Never-Ship Rules`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Animation Standards Reference` (e.g. with `--ease-out / --ease-in-out / --ease-drawer tokens` and `Animation Audit Playbook`) actually correct?**
  _`Animation Standards Reference` has 2 INFERRED edges - model-reasoned connections that need verification._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Before/After/Why review table format` and `Smoke Test Page (deliberately flawed UI)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._