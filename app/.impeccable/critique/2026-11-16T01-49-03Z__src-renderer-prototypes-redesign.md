---
target: redesign prototype (sign-in, volunteer dashboard, admin impact)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\evanl\\OneDrive\\Desktop\\fblacode26-27\\app\\src\\renderer\\prototypes\\redesign"
timestamp: 2026-11-16T01-49-03Z
slug: src-renderer-prototypes-redesign
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score (pre-fix, as assessed)
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | No sign-up result or waitlist state; nav count without context |
| 2 | Match System / Real World | 3 | Mono metadata read as a dev tool |
| 3 | User Control and Freedom | 2 | Demo pick locked the email field (readOnly) |
| 4 | Consistency and Standards | 3 | Same "Sign up" filled on one card, outline on the other; green meant five things |
| 5 | Error Prevention | 2 | No full / overlap / waitlist states designed |
| 6 | Recognition Rather Than Recall | 3 | Labels visible, match factors in words |
| 7 | Flexibility and Efficiency | 1 | No fast path for admins, no bulk approve |
| 8 | Aesthetic and Minimalist Design | 3 | Chart outweighed what needs action |
| 9 | Error Recovery | 1 | No error states, sign-in failure included |
| 10 | Help and Documentation | 1 | Help missing from both navs |
| **Total** | | **22/40** | **Acceptable** |

## Design Specificity
Partly authored: clipboard, slot marks and hour cells belong to this product; the rest was generic dashboard. Detector: 14 findings (13 advisory font sizes vs the old DESIGN.md ramp, 1 Ink Free font); overlay blocked by page CSP.

## Priority Issues
- [P1] Help, Certificates, Audit log missing from navigation → added
- [P1] Too much green; featured Sign up below the fold → score in ink, check-mark statuses, one-line factor rows
- [P1] Admin screen upside down → "Needs you" strip with inline approve / send back, chart shortened
- [P1] Focus ring ~2:1; sidebar muted text 4.35:1; weak pressed state → solid 2px ring, text-2 in sidebar, inset pressed outline
- [P2] Signature hidden; headline contradicted the clipboard → whole sheet in view, new headline, slot marks on admin

## Persona red flags
Alex: no bulk approve or shortcuts. Sam: weak focus ring, locked email, unnamed "Sign up" buttons. Jordan: match % unexplained, 24% still recommended.

## Minor
Mono costume on meta; truncated addresses; 20-column hour grid limits; slot marks past ~30 spots; no empty / goal-reached states.

## Questions
Should a 24% match be recommended? What does 40 of 40 hours look like? Why does the admin never see a sheet?
