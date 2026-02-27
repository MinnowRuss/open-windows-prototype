# Open Windows Member App — Claude Context

This file provides Claude with persistent context for the Open Windows Member App project.
Always read this before making decisions about architecture, design, or implementation.

---

## Project Overview

**Open Windows** is a hospice and palliative care patient-facing web application. It reduces cognitive and emotional burden for patients and families by centralizing care information — medications, care plans, team contacts, messages, and education — in one accessible, trauma-informed interface.

**Full PRD**: `docs/PRD.md`

---

## North-Star Principles

1. **Trauma-informed design** — Users are hospice patients and their families. Every interaction must be calm, clear, and compassionate. Never use alarming colors or language unnecessarily.
2. **Accessibility first** — WCAG 2.2 AA minimum. 44px touch targets. High contrast. Keyboard navigable. No exceptions.
3. **Plain language** — 8th-grade reading level. No medical jargon. Side effects in plain terms.
4. **Performance** — Lighthouse 90+. Load time < 1s. No layout shift.
5. **Privacy** — HIPAA-eligible. No third-party tracking. All PHI encrypted in transit and at rest.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Hosting | Vercel (frontend) + Supabase Cloud (backend) |
| Styling | CSS custom properties (design tokens from prototype) |
| Analytics | None in MVP (privacy-first) |

---

## Design System

From `docs/PRD.md` Section 12 and the existing prototype:

**Colors** (CSS token families):
- `--color-cardinal-*` — Primary (red, 50–900)
- `--color-coral-*` — Secondary (orange, 50–900)
- `--color-slate-*` — Neutral (gray, 50–900)
- `--color-emerald-*` — Success (green, 50–900)
- `--color-amber-*` — Warning (yellow, 50–900)
- `--color-rose-*` — Error (red, 50–900)

**Typography**:
- Display/Headings: `Cormorant` (serif, elegant)
- Body: `DM Sans` (clean, readable)
- Data/Values: `DM Mono`
- Scale: 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56px

**Spacing**: Base-4 grid (4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48px...)

**Motion**: 100ms–1000ms durations, ease-in-out default

---

## Database Schema (Supabase / PostgreSQL)

Tables: `users`, `patients`, `medications`, `care_plans`, `care_team_members`, `messages`, `educational_content`

See `docs/PRD.md` Section 5.2 for full field definitions.

**Key RLS rules** (Row Level Security):
- Patients see only their own data
- Family members see only explicitly shared data
- Audit log all data access

---

## MVP Feature Scope (Week 1–4)

| Feature | Status |
|---------|--------|
| Authentication (Supabase Auth) | P0 |
| Home Dashboard | P0 |
| Medications (list + detail + delivery) | P0 |
| Care Plan (goals + advance directive) | P0 |
| Care Team (list + contact) | P0 |
| Messages (view + send) | P0 |
| Education (articles + search) | P0 |
| Dark mode | P0 |
| Text size adjustment | P1 |
| Appointments | P1 |
| Family member login | P1 |

---

## Pages & Routes

| Route | Page | Priority |
|-------|------|----------|
| `/login` | Login | P0 |
| `/` | Home Dashboard | P0 |
| `/medications` | Medication List | P0 |
| `/medications/:id` | Medication Detail | P0 |
| `/care-plan` | Care Plan | P0 |
| `/care-team` | Care Team | P0 |
| `/messages` | Messages | P0 |
| `/education` | Education Articles | P0 |
| `/education/:id` | Article Detail | P0 |
| `/settings` | Settings (text size, dark mode) | P1 |
| `/appointments` | Appointments | P1 |

---

## Project Structure

```
open-windows-prototype/
├── CLAUDE.md                  # This file — Claude's persistent context
├── README.md                  # Human-facing project overview
├── docs/
│   ├── PRD.md                 # Full Product Requirements Document
│   ├── schema.sql             # Supabase database schema
│   └── design-decisions.md   # Key design decisions log
├── design/                    # Design assets, mockups, tokens
├── src/                       # Application source code (React/Vite)
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Page-level components
│   ├── lib/                   # Supabase client, utilities
│   ├── styles/                # CSS tokens, global styles
│   └── data/                  # Mock data for prototyping
└── scripts/                   # DB seed scripts, utilities
```

---

## Key Constraints & Non-Goals (MVP)

- NO provider dashboard
- NO real-time push notifications
- NO EHR integration
- NO e-signature for advance directives
- NO analytics dashboard
- NO mobile native app

---

## Workflow Notes

- All design decisions logged in `docs/design-decisions.md`
- Database schema kept in `docs/schema.sql` and applied via Supabase console
- Mock data lives in `src/data/` for prototype phase
- Commits use conventional style: `feat:`, `fix:`, `design:`, `docs:`, `chore:`
