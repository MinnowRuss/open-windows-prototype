# Open Windows Member App — Product Requirements Document

**Version**: 1.0
**Date**: February 27, 2026
**Status**: Ready for Development
**Phase**: MVP (Version 1.0) → Phased Iterations

---

## 1. Problem Statement

Hospice and palliative care patients and their families face significant cognitive and emotional burden when trying to understand their care plan, manage medications, and communicate with their care team. Fragmented information across multiple systems (paper forms, phone calls, scattered emails) creates anxiety, missed information, and delays in critical communications.

**User pain points:**
- Patients don't understand their medications, delivery schedules, or side effects
- Families can't easily reach care team members or understand the care plan
- No centralized place to view appointments, educational resources, or advance directives
- Constant back-and-forth on the phone instead of self-service information access

**Market opportunity:**
The hospice and palliative care market is adopting digital tools for the first time. Early movers will set the standard. Currently, no single platform serves this demographic effectively—most solutions are built for acute care or chronic disease management.

---

## 2. Goals

### User Goals
1. **Reduce care coordination friction** — Patients and families can access their complete care information in one place, reducing phone calls and confusion by 50%
2. **Increase medication understanding** — Patients can view their medications, delivery schedules, and side effects, improving medication adherence and reducing adverse events
3. **Enable self-directed care** — Patients feel informed and empowered to make care decisions with less dependency on caregiver guidance

### Business Goals
1. **Validate product-market fit** — Launch MVP with 50+ pilot users and achieve 70%+ weekly active usage
2. **Build foundation for scale** — Create architecture that supports 1000+ concurrent users and integrates with major EHR systems
3. **Differentiate in market** — Establish "trauma-informed design for hospice" as a brand differentiator with positive NPS and media coverage

### Success Definition
- MVP ships within 4 weeks with core features: medications, care plan, care team, messages
- Users spend avg. 5+ min/session and return 3+ times/week
- NPS > 50 (hospice is highly motivated audience)
- Zero critical accessibility failures (WCAG 2.2 AA maintained)

---

## 3. Non-Goals (v1)

The following are explicitly **out of scope for MVP** and will be addressed in Phase 2+:

1. **Provider dashboard** — This version is patient/family only. Provider tools (patient list, documentation, orders) are Phase 2. *Reasoning: Focuses first release on strongest user need (patient experience); provider features require deeper EHR integration.*

2. **Advanced directive e-signature** — Will show advance directive as read-only reference, not legal signing capability. *Reasoning: Requires compliance review, legal framework, and multi-state requirements beyond MVP scope.*

3. **Real-time messaging with notifications** — Messages display but do NOT trigger push notifications or real-time sync. *Reasoning: Adds complexity; polling-based message check is sufficient for MVP.*

4. **Integration with external EHR systems** — Will use Supabase as source of truth. EHR sync is Phase 2. *Reasoning: MVP focuses on proving value with internal data; integration adds weeks of work.*

5. **Analytics and usage tracking** — Basic server logs only, no analytics dashboard. *Reasoning: Privacy-first approach; detailed analytics can wait until product-market fit is clear.*

---

## 4. User Stories

### Priority 1: Core Patient Access (Must-Have for MVP)

**US-001: Patient Login**
- As a hospice patient, I want to log in securely with email and password so that I can access my personal health information safely
- Acceptance Criteria:
  - [ ] Email/password login works via Supabase Auth
  - [ ] Incorrect credentials show helpful error message (not generic "login failed")
  - [ ] Successful login redirects to home dashboard
  - [ ] Session persists for 30 days (long-lived for elderly users who may not use daily)
  - [ ] Logout clears session completely

**US-002: Family Member Access**
- As a family member (caregiver), I want to log in and view the patient's care information with appropriate permissions so that I can stay informed without needing to ask the patient repeatedly
- Acceptance Criteria:
  - [ ] Family members have read-only access to patient's care data
  - [ ] Patient can control which family members see which information
  - [ ] Family member login is via same email/password system
  - [ ] Clear indication on screen who is viewing ("Viewing as Caregiver for Margaret Chen")

**US-003: View Dashboard**
- As a patient, I want to see an at-a-glance dashboard on login so that I immediately understand my status without searching
- Acceptance Criteria:
  - [ ] Dashboard shows: next appointment, current medications count, unread messages, care plan status
  - [ ] Dashboard is mobile-optimized (readable at 375px width)
  - [ ] Each dashboard item links to detailed view
  - [ ] Dashboard refreshes when page loads (no stale data)

### Priority 2: Medications Management (Must-Have for MVP)

**US-004: View Medication List**
- As a patient, I want to see all my current medications with dosage and schedule so that I understand what I'm taking and when
- Acceptance Criteria:
  - [ ] Medication list shows: name, dosage, frequency, route (oral, IV, patch, etc.)
  - [ ] Medications are sorted by time of day taken
  - [ ] Each medication has color-coded status badge (scheduled, delivered, not yet filled)
  - [ ] Medications can be expanded to show more details

**US-005: View Medication Details**
- As a patient, I want to see detailed information about each medication including side effects and delivery status so that I know what to expect and whether it arrived
- Acceptance Criteria:
  - [ ] Medication detail view shows: full name, dosage, frequency, purpose, common side effects, delivery status, prescriber name
  - [ ] Side effects listed in plain language (not medical jargon)
  - [ ] Delivery status shows expected delivery date and actual delivery date if applicable
  - [ ] "Back" button returns to medication list

**US-006: Track Medication Delivery**
- As a patient, I want to see when my medications were delivered and by whom so that I know what to expect
- Acceptance Criteria:
  - [ ] Delivery status shows pending, delivered, or not yet scheduled
  - [ ] Delivered medications show delivery date and care team member name
  - [ ] Pending medications show expected delivery window ("by Friday")
  - [ ] Delivery history is viewable for past medications

### Priority 3: Care Plan (Must-Have for MVP)

**US-007: View Care Plan Overview**
- As a patient, I want to see my complete care plan in one place so that I understand the overall goals for my care
- Acceptance Criteria:
  - [ ] Care plan shows major sections: comfort goals, medical goals, advance directives summary, visit schedule
  - [ ] Each section is expandable
  - [ ] Plain language used (no medical jargon)
  - [ ] Last updated date is shown

**US-008: View Comfort Goals**
- As a patient with advanced illness, I want to see my comfort-related goals so that I know my priorities are being followed
- Acceptance Criteria:
  - [ ] Goals listed clearly (e.g., "Manage pain," "Stay alert and present")
  - [ ] Each goal shows current status (in progress, achieved, being worked on)
  - [ ] Progress notes on each goal are visible
  - [ ] Visual progress indicator (simple bar chart, not complex graph)

**US-009: View Advance Directive**
- As a patient, I want to see my advance directive on file so that I know what care preferences have been documented
- Acceptance Criteria:
  - [ ] Advance directive displays as read-only text
  - [ ] Shows date when signed
  - [ ] Shows name of healthcare proxy or decision-maker
  - [ ] Does NOT show edit/sign capability (read-only in MVP)

### Priority 4: Care Team (Must-Have for MVP)

**US-010: View Care Team Member List**
- As a patient, I want to see all my care team members and their contact information so that I know who to call and why they're on my team
- Acceptance Criteria:
  - [ ] List shows each team member: name, role (nurse, doctor, social worker, chaplain), phone, email
  - [ ] Team members can be sorted by role or alphabetically
  - [ ] Each team member has a photo placeholder (or actual photo if available)
  - [ ] Contact info is one-tap callable and email-able on mobile

**US-011: Contact Care Team Member**
- As a patient, I want to quickly call or email my care team so that I can reach them when needed
- Acceptance Criteria:
  - [ ] Phone number is clickable (initiates call on mobile, shows number on desktop)
  - [ ] Email is clickable (opens email client)
  - [ ] Confirmation message shows after contact attempt
  - [ ] Does NOT auto-send messages (respects user intention)

### Priority 5: Messages (Must-Have for MVP)

**US-012: View Messages from Care Team**
- As a patient, I want to see messages from my care team so that I can stay informed without checking email constantly
- Acceptance Criteria:
  - [ ] Messages display in chronological order (newest at top)
  - [ ] Each message shows: sender name, role, timestamp, message text
  - [ ] Unread messages are visually distinct
  - [ ] Messages can be marked as read/unread

**US-013: Send Message to Care Team**
- As a patient, I want to send a message to my care team so that I can ask questions without making a phone call
- Acceptance Criteria:
  - [ ] Message compose form is simple (text box + send button)
  - [ ] Recipient is pre-selected to "Care Team" (or user selects specific member)
  - [ ] Sent message appears in message thread immediately
  - [ ] Confirmation shows message was sent
  - [ ] Clear indication when messages are being processed vs. sent

### Priority 6: Education/Resources (Must-Have for MVP)

**US-014: Browse Educational Articles**
- As a patient or family member, I want to read plain-language articles about my condition and care so that I understand what to expect
- Acceptance Criteria:
  - [ ] Articles listed by category (e.g., "What is Hospice," "Managing Pain," "Talking with Family")
  - [ ] Each article shows title, summary, read time, and publication date
  - [ ] Articles are readable in plain language (8th-grade reading level)
  - [ ] Articles can be favorited/bookmarked
  - [ ] Search by keyword works

**US-015: Read Individual Article**
- As a patient, I want to read an educational article so that I can learn at my own pace
- Acceptance Criteria:
  - [ ] Full article text displays clearly (good typography, adequate spacing)
  - [ ] Text is readable on mobile and desktop
  - [ ] "Back to articles" link returns to list
  - [ ] Related articles suggested at bottom

### Priority 7: Appointments (Nice-to-Have for MVP, but important for Phase 1.1)

**US-016: View Upcoming Appointments**
- As a patient, I want to see upcoming care visits so that I know when my care team is coming
- Acceptance Criteria:
  - [ ] Appointments shown in calendar view (or simple list with dates)
  - [ ] Each appointment shows: date, time, type (nurse visit, doctor visit), care team member
  - [ ] Next appointment highlighted at top of dashboard
  - [ ] Appointment details show location/instructions if applicable

**US-017: Confirm Appointment**
- As a patient, I want to confirm that I'll be available for my appointment so that the care team knows I'm expecting them
- Acceptance Criteria:
  - [ ] "Confirm" and "Reschedule" buttons on each appointment
  - [ ] Confirmation shows on screen and sends notification to care team
  - [ ] Rescheduling shows available times (or contact info to call for rescheduling)

### Priority 8: Theme and Settings (Nice-to-Have, but important for accessibility)

**US-018: Toggle Dark Mode**
- As a patient who uses the app at night, I want dark mode so that I don't strain my eyes
- Acceptance Criteria:
  - [ ] Toggle button in top-right or settings menu
  - [ ] Dark mode respects system preference on first load
  - [ ] Preference is saved in localStorage
  - [ ] All pages render correctly in dark mode

**US-019: Adjust Text Size**
- As an elderly patient with vision challenges, I want to increase text size so that I can read comfortably
- Acceptance Criteria:
  - [ ] Settings menu has text size options (small, medium, large, extra-large)
  - [ ] Font size increases across all pages
  - [ ] Layout adjusts gracefully with larger text
  - [ ] Preference is saved

---

## 5. Requirements

### Must-Have (P0): MVP Scope

These features must ship in Week 1-4. Without them, the app is not viable.

#### 5.1 Authentication & Security
- **Supabase Auth Integration**
  - Email/password authentication via Supabase
  - Session management (30-day session for patient accessibility)
  - Secure logout (session cleared, tokens revoked)
  - Password reset via email
  - Acceptance Criteria:
    - [ ] Login succeeds with valid credentials
    - [ ] Login fails gracefully with invalid credentials
    - [ ] Logged-in user cannot access login page (redirected to dashboard)
    - [ ] Logged-out user cannot access protected pages (redirected to login)

#### 5.2 Data Models & Database Schema
- **Users Table**
  - Fields: id, email, password_hash (managed by Supabase), role (patient/family/admin), created_at, last_login
  - Relationships: One user can have multiple patient records (for admins managing multiple patients)

- **Patients Table**
  - Fields: id, user_id, first_name, last_name, dob, phone, address, current_status, created_at
  - Relationships: One patient has many medications, one care plan, one care team, many messages

- **Medications Table**
  - Fields: id, patient_id, name, dosage, unit, frequency, route, purpose, side_effects (JSON), prescriber, status (scheduled/delivered/not_scheduled), delivery_date, created_at, updated_at
  - Relationships: One patient has many medications

- **Care Plans Table**
  - Fields: id, patient_id, comfort_goals (JSON array), medical_goals (JSON array), advance_directive_text, last_updated_by, created_at, updated_at
  - Relationships: One patient has one care plan

- **Care Team Members Table**
  - Fields: id, patient_id, name, role (nurse/doctor/social_worker/chaplain/family), phone, email, photo_url, created_at
  - Relationships: One patient has many care team members

- **Messages Table**
  - Fields: id, patient_id, sender_id, recipient_type (individual/team), message_text, sent_at, read_at, created_at
  - Relationships: One patient has many messages, one sender (care team member)

- **Educational Content Table**
  - Fields: id, title, category, summary, content_text, reading_time_minutes, published_date, is_active, created_at
  - Relationships: Not patient-specific; same content served to all patients

#### 5.3 User Interface & Pages
- **Login Page**
  - Email and password input fields
  - Login button (disabled until both fields filled)
  - "Forgot password" link
  - Error messages for failed login
  - Mobile-responsive design
  - Accessible form (labels, ARIA attributes, focus rings)

- **Home Dashboard**
  - Summary cards showing: next appointment, medication count, unread messages, care plan status
  - Quick links to each major section
  - Dark mode toggle
  - Logout button
  - Mobile-responsive, touch-friendly (44px targets)

- **Medications Page**
  - List view of all medications
  - Status badges (scheduled, delivered, pending)
  - Click to expand details (dosage, side effects, delivery status)
  - Sorted by time of day
  - Mobile list view, desktop could support grid

- **Care Plan Page**
  - Comfort goals section (expandable)
  - Medical goals section (expandable)
  - Advance directive preview
  - Last updated timestamp

- **Care Team Page**
  - List of all care team members with role, phone, email
  - Contact buttons (call/email) are one-tap on mobile
  - Photo placeholder for each member
  - Sortable by role or name

- **Messages Page**
  - Conversation view showing all messages
  - Unread vs. read message distinction
  - Compose form (text input + send button)
  - Timestamps on each message

- **Education Page**
  - List of articles by category
  - Search box
  - Article detail view with full text
  - Back navigation
  - Related articles suggestion

#### 5.4 Design System & Styling
- **Complete design system implementation** (from prototype)
  - Color tokens: 6 families, 9 shades each
  - Typography: Cormorant (display), DM Sans (body), DM Mono (code)
  - Spacing: Base-4 grid system
  - Motion: 6 durations + 5 easing curves
  - Components: buttons, cards, alerts, badges, modals, forms
  - Dark mode: Warm-tinted, system-preference aware
  - Responsive breakpoints: 320px, 768px, 1024px, 1280px

#### 5.5 Accessibility (WCAG 2.2 AA)
- 44px touch targets (exceeds AAA standard)
- Focus rings: 2px outline + 5px glow
- Keyboard navigation: Tab, Enter, Escape, Arrow keys
- Semantic HTML
- Color contrast: 4.5:1 minimum, 9.4:1 average
- Skip links on every page
- ARIA labels where needed
- Alt text on all images
- Form labels properly associated with inputs
- Responsive text sizing (no small unreadable text)

#### 5.6 Responsive Design
- Works on mobile (320px+)
- Works on tablet (768px+)
- Works on desktop (1024px+)
- Touch-friendly on mobile
- Readable typography at all sizes
- No horizontal scrolling on mobile
- Images scale appropriately

#### 5.7 Performance
- Initial page load < 1 second
- No layout shift (CLS < 0.1)
- Smooth animations (60fps, no jank)
- Lighthouse score 90+
- Gzipped bundle < 100KB (including assets)

---

### Nice-to-Have (P1): High-Priority Fast Follows

These should ship in Week 5-6 (Phase 1.1) if MVP goes well:

#### 5.8 Appointments Management
- Calendar or list view of upcoming appointments
- Appointment confirmation functionality
- Reschedule capability (or link to call)
- Appointment details (time, location, care team member)

#### 5.9 Family Member Permissions
- Granular access control (what family members can see)
- Patient controls which family can see medications vs. messages vs. all info
- Family member login and account management

#### 5.10 Advanced Directive Features
- Edit/update advance directive (patient-only, no signing in MVP)
- Version history of advance directive changes
- Print advance directive as PDF

#### 5.11 Better Medication Management
- Medication reminder notifications (if enabled)
- Log taken medication (simple checkbox)
- Medication side effect tracking (patient reports)

#### 5.12 Search & Discovery
- Global search across medications, messages, articles
- Filter articles by category
- Recent items quick access

---

### Future Considerations (P2): Architectural Decisions

These will NOT ship in v1 but we're designing to support them:

#### 5.13 EHR Integration
- Supabase should store data in a way that EHR systems can sync to/from
- Medication data should map to RxNorm standards (for future EHR import)
- Care plan should support HL7 FHIR format mapping

#### 5.14 Provider Dashboard
- Separate provider interface (different from patient view)
- Provider can manage multiple patients
- Provider can update care plans, add messages, record visits
- Provider can see patient engagement metrics

#### 5.15 Advanced Messaging
- Real-time message notifications (WebSocket or Supabase Realtime)
- Typing indicators
- Message attachments
- Escalation for urgent messages

#### 5.16 Analytics
- Track patient engagement (time in app, pages viewed, features used)
- Track NPS and satisfaction
- Export reports for providers
- Privacy-respecting analytics (no PII)

#### 5.17 Mobile App
- Native iOS/Android app (React Native or Flutter)
- Offline capability (sync when online)
- Push notifications
- Biometric login (fingerprint/face)

---

## 6. Success Metrics

### MVP Launch Metrics (Measure after Week 1-4)

#### Leading Indicators (Days-to-Weeks)
1. **Adoption Rate**
   - Metric: % of invited pilot users who complete signup
   - Target: 70% within first week
   - Measurement: Supabase auth table signup events
   - Non-Goal: 80% (stretch), failure threshold: < 50%

2. **Activation Rate**
   - Metric: % of signups who view at least 3 different pages
   - Target: 60% within 3 days of first login
   - Measurement: Page view events tracked in code
   - Goal: Indicates the app felt useful enough to explore

3. **Weekly Active Users (WAU)**
   - Metric: % of activated users who log in 3+ times per week
   - Target: 70%
   - Measurement: Login events in Supabase auth logs
   - Non-Goal: Indicates sustained engagement

4. **Task Completion Rate**
   - Metric: % of users who view medication details (primary value prop)
   - Target: 80%
   - Measurement: Track page visits to /medications
   - Goal: Core feature is being discovered and used

5. **Time Spent**
   - Metric: Average session duration
   - Target: 4-6 minutes per session
   - Measurement: Client-side session timer
   - Goal: Users spending meaningful time, not just logging in

#### Lagging Indicators (Weeks-to-Months)
6. **Net Promoter Score (NPS)**
   - Metric: "Would you recommend this to other patients?" (0-10 scale)
   - Target: NPS > 50 (calculated as %promoters - %detractors)
   - Measurement: In-app survey after 1 week of use
   - Goal: Hospice population is highly motivated; high NPS is realistic

7. **Feature Satisfaction**
   - Metric: Rating for each feature (medications, messages, care team) on 1-5 scale
   - Target: 4.0+ average across all features
   - Measurement: In-app feedback forms or survey
   - Goal: Identify which features need refinement before Phase 2

8. **Support Ticket Reduction**
   - Metric: # of questions/support requests from pilot users
   - Target: < 5 tickets per 50 users (suggests self-service is working)
   - Measurement: Manual count in support system
   - Goal: App is reducing, not increasing, support burden

9. **Retention at 30 Days**
   - Metric: % of activated users still active 30 days later
   - Target: 60%
   - Measurement: Login events in auth logs
   - Goal: Users maintaining engagement long-term

### Phase 1.1 Metrics (After Nice-to-Have Features)

10. **Family Member Signup**
    - Metric: # of family members invited and active
    - Target: 80% of patients invite at least 1 family member
    - Measurement: Family user accounts created
    - Goal: Validates multi-user household model

11. **Message Volume**
    - Metric: Messages sent per patient per week
    - Target: 5+ messages/week average
    - Measurement: Message table row count
    - Goal: Messaging is replacing some phone calls

---

## 7. Open Questions

### Blocking Questions (Must Answer Before Development Starts)

1. **[Stakeholder]** Who are the 50 pilot users?
   - What hospice agencies/health systems will participate?
   - Are they already identified, or do we need recruitment?
   - Timeline for recruitment?
   - Impact: Determines when we can launch and start measuring

2. **[Stakeholder]** What is the current source of patient data?
   - Are there existing patient records we import, or start from scratch?
   - If import: in what format? (CSV, HL7, proprietary?)
   - If start from scratch: who enters data? (Admin, patient, care team?)
   - Impact: Determines data pipeline and onboarding flow

3. **[Engineering]** Can we use Supabase for this project?
   - Any data governance or compliance concerns with Supabase?
   - Is Supabase SOC 2 and HIPAA-eligible enough for this?
   - Any preference for self-hosted Postgres vs. Supabase cloud?
   - Impact: Determines database architecture and timeline

4. **[Design/Product]** What happens when patient has no upcoming appointments?
   - Should dashboard still show appointment card (empty state)?
   - Or hide it entirely?
   - Impact: Affects dashboard component design

5. **[Stakeholder]** Do we include family member login in MVP or Phase 1.1?
   - Family member access is high-value but adds complexity
   - Should we launch with patient-only and add family in Phase 1.1?
   - Impact: Scope and timeline

### Non-Blocking Questions (Can Resolve During Implementation)

6. **[Design]** What should empty states look like? (e.g., no medications, no messages)
   - Should we show encouraging messages or just blank space?
   - Impact: Low priority, can be decided during design phase

7. **[Engineering]** How do we handle patient data backups?
   - Should Supabase automatic backups be enough, or need additional backup?
   - Impact: Can be addressed in Phase 2 infrastructure work

8. **[Product]** Should educational articles be editable by admins or static?
   - If editable: need CMS-like admin interface
   - If static: articles are deployed with code
   - Impact: Affects admin tooling in Phase 2

9. **[Legal]** Do we need patient consent for using their data in the app?
   - Assuming yes, but need legal review of consent language
   - Impact: Affects onboarding flow

10. **[Engineering]** Should the app work offline?
    - If yes: requires service workers and local storage sync
    - If no: requires internet connection always
    - Impact: Low priority for MVP, can revisit if needed

---

## 8. Technical Considerations

### Tech Stack (Recommended)
- **Frontend**: React or Vue.js (we have a vanilla HTML/CSS/JS prototype, so modern framework adds minimal overhead for Phase 1)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel (for frontend) + Supabase cloud (for backend)
- **Analytics**: Plausible or Fathom (privacy-respecting)
- **Design System**: CSS tokens from prototype (reusable in framework)

### Data Security & HIPAA Compliance
- All patient data is Protected Health Information (PHI)
- Supabase must be HIPAA-eligible (requires Business Associate Agreement)
- All data must be encrypted in transit (HTTPS/TLS) and at rest
- Patient can only view their own data (enforce via RLS in Postgres)
- Family members can only view shared data (enforce via RLS)
- Audit logging of all data access
- 90-day data retention policy (or per healthcare agency agreement)

### Privacy
- No analytics cookies (use privacy-respecting analytics or none)
- No third-party scripts (no Google Analytics, etc.)
- Clear privacy policy explaining what data we store and why
- Patient data never shared with anyone without explicit consent

### Scalability
- Supabase can handle 1000+ concurrent users (sufficient for Phase 1-2)
- Database indexing on patient_id and user_id (for query performance)
- Paginated API responses (don't load all messages at once)
- Caching strategy for educational content (doesn't change often)

---

## 9. Phasing & Timeline

### Phase 1: MVP (Weeks 1-4)
**Deliverable**: Fully functional patient-facing app with authentication, medications, care plan, messages, care team, education.

**Weekly breakdown**:
- **Week 1**: Setup, database schema, authentication, data models
- **Week 2**: Build pages: dashboard, medications, care plan, care team
- **Week 3**: Build pages: messages, education, styling/design system
- **Week 4**: Testing, bug fixes, performance optimization, deployment

**Definition of Done**:
- All P0 requirements met
- WCAG 2.2 AA accessibility achieved
- Lighthouse score 90+
- No critical bugs
- Deployed to production
- 50 pilot users can login and use app

### Phase 1.1: Fast Follows (Weeks 5-6)
**Deliverable**: Nice-to-have features based on MVP feedback

**Candidates**:
- Appointments management
- Family member login & permissions
- Medication reminder notifications
- Text size adjustment

**Trigger**: MVP has 70%+ WAU and positive NPS feedback

### Phase 2: Scale & Provider Tools (Month 2+)
**Deliverable**: Provider dashboard, EHR integration, advanced features

**Candidates**:
- Provider interface (manage multiple patients, update records)
- EHR sync (import medications, care plans from existing systems)
- Advanced messaging (real-time, notifications)
- Analytics dashboard

---

## 10. Success Criteria for MVP Approval

The MVP is ready to move to Phase 1.1 if:

- [ ] All P0 requirements shipped
- [ ] 50+ pilot users enrolled
- [ ] 70%+ adoption (users complete signup)
- [ ] 60%+ activation (users explore 3+ pages)
- [ ] WCAG 2.2 AA accessibility verified (automated + manual audit)
- [ ] Zero critical bugs in first week
- [ ] NPS > 40 (even 40 is good for first release)
- [ ] Performance: Lighthouse > 90, load time < 1s
- [ ] Zero data security/privacy incidents
- [ ] Documentation complete (README, deployment guide, data schema)

---

## 11. Risk Register

| Risk | Impact | Likelihood | Mitigation | Owner |
|------|--------|-----------|-----------|-------|
| Pilot user recruitment delayed | Delays launch 2+ weeks | Medium | Start recruitment immediately; identify backup agencies | Stakeholder |
| Supabase HIPAA compliance unclear | Blocks development | Low | Confirm BAA and compliance path in Week 1 | Engineering |
| Accessibility audit fails | Cannot launch | Low | Implement WCAG checklist weekly; audit in Week 3 | Design |
| Patient data import format incompatible | Delays pilot launch | Medium | Test import script with sample data in Week 1 | Engineering |
| Family member scope creep | Delays MVP | Medium | Explicitly defer family features to Phase 1.1 | Product |
| Performance issues with large medication lists | App becomes slow | Low | Paginate and cache; test with 100+ medications | Engineering |

---

## 12. Appendix: Design System Reference

### Colors (from prototype)
- **Primary**: Cardinal (red) family
- **Secondary**: Coral (orange) family
- **Neutral**: Slate (gray) family
- **Success**: Emerald (green) family
- **Warning**: Amber (yellow) family
- **Error**: Rose (red) family

Each family has 9 shades (50, 100, 200, ..., 900).

### Typography
- **Display**: Cormorant (serif, elegant, used for headings)
- **Body**: DM Sans (sans-serif, clean, used for content)
- **Mono**: DM Mono (monospace, used for data/values)

12-step scale: 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px, 36px, 42px, 48px, 56px

### Spacing
Base unit: 4px (multiples of 4: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48...)

### Motion
- **Durations**: 100ms, 200ms, 300ms, 500ms, 700ms, 1000ms
- **Easings**: linear, ease-in, ease-out, ease-in-out, cubic-bezier custom

### Components (to be built/extended)
- Buttons (primary, secondary, ghost, danger)
- Cards (content container)
- Alerts (info, success, warning, error)
- Badges (status indicators)
- Modals (overlays)
- Forms (inputs, labels, validation)
- Navigation (header, sidebar if needed)
- Tabs (tabbed content)
- Progress indicators (goals, medication delivery status)

---

## 13. Stakeholder Sign-Off

| Role | Name | Approval | Date |
|------|------|----------|------|
| Product Manager | Russ | ☐ | |
| Engineering Lead | TBD | ☐ | |
| Design Lead | TBD | ☐ | |
| Compliance/Legal | TBD | ☐ | |
| Pilot User Representative | TBD | ☐ | |

---

**Document Status**: Draft → Ready for Review → Approved → Implementation

**Next Step**: Share with team, gather feedback, and move to implementation in Claude Code.
