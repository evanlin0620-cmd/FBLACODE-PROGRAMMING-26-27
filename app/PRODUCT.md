# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Volunteers: often high-school students who need documented community service hours. They browse shifts, sign up, log hours, and download a certificate.
- Nonprofit coordinators (admins): they create activities, approve logged hours, find volunteers with specific skills, and report on community impact.
- FBLA judges watch a live 7-minute demo of the app and then ask questions. They don't use it themselves.

## Product Purpose

ServeHub helps a nonprofit recruit, schedule, and track volunteers in one place. A volunteer can find a shift that fits, sign up, and get credit for the hours. A coordinator can fill shifts and see the impact. For the competition, success means a judge watching the demo sees every part of the 2026-27 FBLA prompt working, without errors.

## Positioning

Shift matching that explains itself: each recommendation shows a match score and the reasons behind it (skills, availability, interests). The waitlist fills open spots automatically. Every certificate has a code an admin can verify. The Help assistant answers typed questions offline.

## Operating Context

- A Windows desktop app (Electron) that runs offline on a laptop with its own SQLite database. The demo runs on battery with no projector.
- Demo nonprofit: Riverside Community Partners. It runs food bank, tutoring, environmental, animal care, senior care, health, fundraising, and event-support activities.
- Two roles with strict separation. Volunteers see only their own records and the catalog. Admins see everything.

## Capabilities and Constraints

- Profiles with skills, availability, interests, and an hour goal. Activity create/edit/cancel/delete. Sign-ups with overlap checks and an automatic waitlist. Hour logging with approve/reject. Search and filters. An impact dashboard. Customizable reports exported to CSV or PDF. Certificates. A simulated email outbox. An audit log. A one-click demo reset.
- The FBLA rating sheet rewards: UX rationale, the user journey, and accessibility features; an interactive help menu with an intelligent Q&A; input validation of both format and meaning; customizable reports; no spelling or navigation errors.
- Window minimum size is 960x640; it's designed at 1280x800.

## Brand Commitments

- Name: ServeHub. Approved mockups are in Figma (file tJfyvE4fPnORzU8PZv0IHr), listed in ../docs/design/figma.md.
- Voice: plain, short, friendly. No jargon. Errors say what to do next.

## Evidence on Hand

- The demo data is made up (src/main/db/seed.ts). There are no real testimonials, partners, or usage numbers, so none should be shown or invented.

## Product Principles

1. Every rule the prompt asks for is visible in the UI, with a clear message when it blocks something.
2. Show why: match reasons, waitlist position, rejection reasons, and the shift length behind each hour limit.
3. A judge should be able to follow any screen in seconds: one main action per screen, with familiar app patterns.
4. Never lose data. Prefer cancelling to deleting, and show a friendly error page instead of crashing.

## Accessibility & Inclusion

- WCAG 2.2 AA: text contrast of 4.5:1, visible focus rings, a label on every input, full keyboard use, and no meaning carried by color alone.
- Respect reduced motion.
