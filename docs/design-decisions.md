# Design Decisions Log

A running log of key decisions made during Open Windows development, with rationale.
Add new entries at the top (newest first).

---

## 2026-02-27 — Project Initialization

**Decision**: Use React + Vite over Vue.js
**Rationale**: Team familiarity; existing prototype is HTML/CSS/JS which converts naturally to React components. Vite gives fast dev experience.

**Decision**: Use Supabase over self-hosted Postgres
**Rationale**: Managed auth, row-level security, and realtime out of the box. HIPAA-eligible with Business Associate Agreement (must confirm before launch).

**Decision**: Deploy frontend to Vercel
**Rationale**: Zero-config React deployment, automatic preview URLs per PR, free tier sufficient for MVP.

**Decision**: No analytics in MVP
**Rationale**: Privacy-first. Hospice patient data is sensitive PHI. Basic usage data (logins, page visits) tracked server-side via Supabase logs only.

**Decision**: 30-day session persistence
**Rationale**: Elderly users may not use the app daily. Forcing frequent re-login creates friction and abandonment. Longer session = better accessibility.

**Decision**: Defer family member login to Phase 1.1
**Rationale**: Adds meaningful complexity (access control, permissions UI). MVP focuses on the primary user (patient) first.

**Decision**: Defer real-time messaging (no WebSocket in MVP)
**Rationale**: Polling-based message refresh sufficient for MVP. Real-time adds infra complexity. Users check messages intentionally, not expecting instant responses.

---

*Add new decisions above this line, newest first.*
