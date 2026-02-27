# Open Windows Member App

A trauma-informed patient portal for hospice and palliative care patients and their families.

## What It Does

Open Windows reduces cognitive and emotional burden for patients by centralizing all care information in one place:

- **Medications** — What you're taking, when, why, side effects, delivery status
- **Care Plan** — Comfort goals, medical goals, and advance directive on file
- **Care Team** — Everyone involved in your care, with one-tap contact
- **Messages** — Communicate with your care team without phone calls
- **Education** — Plain-language articles about your condition and care

## Design Philosophy

- **Trauma-informed** — Calm, clear, and compassionate at every interaction
- **Accessible** — WCAG 2.2 AA, 44px touch targets, keyboard navigable
- **Plain language** — 8th-grade reading level, no medical jargon
- **Privacy-first** — HIPAA-eligible, no tracking, all data encrypted

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel + Supabase Cloud |
| Styling | CSS custom properties (design tokens) |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Run dev server
npm run dev
```

## Project Structure

```
open-windows-prototype/
├── docs/           # PRD, schema, design decisions
├── design/         # Design assets and tokens
├── src/
│   ├── components/ # Reusable UI components
│   ├── pages/      # Page-level components
│   ├── lib/        # Supabase client, utilities
│   ├── styles/     # CSS tokens, global styles
│   └── data/       # Mock data for development
└── scripts/        # DB seed scripts
```

## Documentation

- [Product Requirements Document](docs/PRD.md) — Full feature spec, user stories, success metrics
- [Database Schema](docs/schema.sql) — Supabase PostgreSQL schema
- [Design Decisions](docs/design-decisions.md) — Key decisions and rationale

## Status

**Phase**: MVP Development (Week 1–4)
**Target**: Patient-facing app with authentication, medications, care plan, messages, care team, education.

See [PRD](docs/PRD.md) for full roadmap.

---

*Built with care for the people who need it most.*
