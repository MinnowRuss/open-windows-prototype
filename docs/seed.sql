-- ============================================================
-- OPEN WINDOWS — SEED DATA
-- Patient: Margaret Chen, age 74 (test/pilot data)
--
-- HOW TO USE:
-- 1. Create Margaret's user in Supabase Auth (Auth → Users → Add User)
-- 2. Copy her user UUID
-- 3. Replace 'PASTE-MARGARET-UUID-HERE' below with that UUID
-- 4. Run this entire file in the SQL Editor
-- ============================================================

-- Set Margaret's Auth user UUID here ↓
-- Get this from: Authentication → Users → Margaret's row → UUID column
DO $$
DECLARE
  margaret_user_id  UUID := '2ccdd11d-564b-4601-ac80-71382a16fe34';
  patient_id        UUID := gen_random_uuid();
  cp_id             UUID := gen_random_uuid();

  -- Care team member IDs
  ct_nurse          UUID := gen_random_uuid();
  ct_doctor         UUID := gen_random_uuid();
  ct_social_worker  UUID := gen_random_uuid();
  ct_chaplain       UUID := gen_random_uuid();
  ct_aide           UUID := gen_random_uuid();
  ct_volunteer      UUID := gen_random_uuid();

BEGIN

-- ============================================================
-- 1. PROFILE (links Auth user to app)
-- ============================================================
INSERT INTO public.profiles (id, email, role, created_at, last_login)
VALUES (
  margaret_user_id,
  'margaret@test.openwindows.app',
  'patient',
  now() - interval '30 days',
  now() - interval '1 day'
)
ON CONFLICT (id) DO NOTHING;   -- row already exists if Supabase auto-created it on auth signup

-- ============================================================
-- 2. PATIENT
-- ============================================================
INSERT INTO public.patients (id, user_id, first_name, last_name, dob, phone, address, current_status, created_at)
VALUES (
  patient_id,
  margaret_user_id,
  'Margaret',
  'Chen',
  '1951-09-14',
  '(617) 555-0142',
  '48 Maple Street, Lexington, MA 02420',
  'active',
  now() - interval '30 days'
);

-- ============================================================
-- 3. MEDICATIONS (6 total, mix of statuses)
-- ============================================================
INSERT INTO public.medications
  (id, patient_id, name, dosage, unit, frequency, route, purpose, side_effects, prescriber, status, delivery_date, expected_delivery, created_at, updated_at)
VALUES

-- 1. Furosemide — delivered
(gen_random_uuid(), patient_id,
 'Furosemide', '40', 'mg',
 'Once every morning', 'By mouth (oral tablet)',
 'Helps your body remove extra fluid, which makes it easier to breathe and reduces swelling in your legs and feet.',
 '["You may urinate more often — this is normal and expected",
   "Drink plenty of water unless your care team says otherwise",
   "You may feel dizzy when standing up quickly — rise slowly",
   "Contact your nurse if you have muscle cramps or feel very weak"]'::jsonb,
 'Dr. Anita Patel', 'delivered',
 now() - interval '2 days', NULL,
 now() - interval '30 days', now() - interval '2 days'),

-- 2. Metoprolol Succinate — delivered
(gen_random_uuid(), patient_id,
 'Metoprolol Succinate', '25', 'mg',
 'Once every morning', 'By mouth (oral tablet)',
 'Slows your heart rate and reduces strain on your heart, helping it beat more steadily and comfortably.',
 '["You may feel more tired than usual, especially at first",
   "Some people notice cold hands or feet",
   "Do not stop taking this suddenly — always talk to your care team first",
   "Call your nurse if you feel faint or your heart is beating very slowly"]'::jsonb,
 'Dr. Anita Patel', 'delivered',
 now() - interval '2 days', NULL,
 now() - interval '30 days', now() - interval '2 days'),

-- 3. Morphine Sulfate — delivered
(gen_random_uuid(), patient_id,
 'Morphine Sulfate', '2.5', 'mg',
 'Every 4 hours as needed for shortness of breath or discomfort', 'By mouth (liquid, measured with dropper)',
 'Relieves the feeling of breathlessness and discomfort. It does not hasten death — it helps you breathe more easily and feel more comfortable.',
 '["Makes most people feel drowsy — rest if you need to",
   "Can cause constipation — your nurse will help manage this",
   "You may feel slightly confused or have vivid dreams, especially at first",
   "Call immediately if breathing becomes very slow or you cannot be woken"]'::jsonb,
 'Dr. Anita Patel', 'delivered',
 now() - interval '2 days', NULL,
 now() - interval '30 days', now() - interval '2 days'),

-- 4. Lorazepam — scheduled (pending delivery)
(gen_random_uuid(), patient_id,
 'Lorazepam', '0.5', 'mg',
 'Every 6 hours as needed for anxiety or restlessness', 'Dissolves under the tongue (sublingual)',
 'Helps relieve anxiety, restlessness, and the panicked feeling that sometimes comes with difficulty breathing. It helps you feel calmer.',
 '["You will likely feel sleepy after taking this — this is expected",
   "Do not drive or operate machinery",
   "May cause mild confusion in some people",
   "Your family members may notice you are harder to wake — this is normal"]'::jsonb,
 'Dr. Anita Patel', 'scheduled',
 NULL, 'by Friday, February 28',
 now() - interval '14 days', now() - interval '14 days'),

-- 5. Senna — delivered
(gen_random_uuid(), patient_id,
 'Senna', '2', 'tablets',
 'Twice daily — morning and evening', 'By mouth (oral tablet)',
 'Prevents constipation, which is a common side effect of morphine and other pain medicines. Keeping things moving is important for your comfort.',
 '["Stomach cramping is possible, especially if taken without food",
   "Your stools may be darker — this is normal",
   "Call your nurse if you have no bowel movement for 3 or more days"]'::jsonb,
 'Sarah Thompson, RN', 'delivered',
 now() - interval '2 days', NULL,
 now() - interval '30 days', now() - interval '2 days'),

-- 6. Haloperidol — not yet scheduled
(gen_random_uuid(), patient_id,
 'Haloperidol', '0.5', 'mg',
 'As needed for agitation or confusion (no more than every 4 hours)', 'By mouth (liquid) or under the tongue',
 'Helps with confusion, seeing things that aren''t there, or severe restlessness. It can make the mind feel quieter and more settled.',
 '["May cause drowsiness",
   "Some people notice stiffness or restlessness in legs — tell your nurse",
   "Call your care team if symptoms seem to get worse rather than better"]'::jsonb,
 'Dr. Anita Patel', 'not_scheduled',
 NULL, NULL,
 now() - interval '7 days', now() - interval '7 days');

-- ============================================================
-- 4. CARE PLAN
-- ============================================================
INSERT INTO public.care_plans
  (id, patient_id, comfort_goals, medical_goals, advance_directive_text,
   advance_directive_signed_at, healthcare_proxy_name, last_updated_by, created_at, updated_at)
VALUES (
  cp_id,
  patient_id,

  -- Comfort goals
  '[
    {
      "id": "cg-001",
      "goal": "Manage breathlessness and make breathing easier",
      "status": "in-progress",
      "progress": 65,
      "notes": "Morphine and positioning changes are helping. We are still adjusting the dose to find the right balance between relief and alertness."
    },
    {
      "id": "cg-002",
      "goal": "Stay comfortable and free from pain",
      "status": "in-progress",
      "progress": 80,
      "notes": "Margaret reports pain is well-managed most of the time. She rates it 2-3 out of 10 on most days."
    },
    {
      "id": "cg-003",
      "goal": "Stay alert and present for family visits",
      "status": "achieved",
      "progress": 100,
      "notes": "Medication timing has been adjusted so Margaret is most alert during afternoon family visits. This is working well."
    },
    {
      "id": "cg-004",
      "goal": "Reduce anxiety and fear around breathing difficulties",
      "status": "in-progress",
      "progress": 50,
      "notes": "Lorazepam is available and helps during acute episodes. Chaplain visits are also providing meaningful emotional support."
    }
  ]'::jsonb,

  -- Medical goals
  '[
    {
      "id": "mg-001",
      "goal": "Keep fluid levels stable and prevent severe congestion",
      "status": "in-progress",
      "progress": 70,
      "notes": "Furosemide is helping. We are monitoring daily weights and adjusting as needed."
    },
    {
      "id": "mg-002",
      "goal": "Maintain heart rate in a comfortable, steady range",
      "status": "achieved",
      "progress": 100,
      "notes": "Heart rate has been consistently between 60-75 bpm. The Metoprolol dose is working well."
    },
    {
      "id": "mg-003",
      "goal": "Prevent unnecessary hospitalizations",
      "status": "in-progress",
      "progress": 90,
      "notes": "Margaret and family have a clear plan for when to call the hospice line versus going to the hospital. They are following it well."
    }
  ]'::jsonb,

  -- Advance directive
  'Margaret Chen has expressed clear wishes about her care:

I want to remain at home for as long as possible. I do not want to go back to the hospital unless absolutely necessary for my comfort.

I do not want CPR (cardiopulmonary resuscitation) or any attempts to restart my heart if it stops. I understand this means allowing a natural death.

I do not want to be placed on a breathing machine (ventilator).

I want all treatments focused on keeping me comfortable, pain-free, and able to spend meaningful time with my family.

I trust my daughter, Jennifer Chen Park, to make decisions for me if I am not able to speak for myself. She knows my wishes and I trust her completely.',

  '2025-11-12 10:00:00+00',
  'Jennifer Chen Park (daughter)',
  'Dr. Anita Patel',
  now() - interval '30 days',
  now() - interval '7 days'
);

-- ============================================================
-- 5. CARE TEAM MEMBERS (6 members)
-- ============================================================
INSERT INTO public.care_team_members
  (id, patient_id, name, role, phone, email, created_at)
VALUES
  (ct_nurse,        patient_id, 'Sarah Thompson',  'nurse',        '(617) 555-0210', 'sthompson@openhospice.org',  now() - interval '30 days'),
  (ct_doctor,       patient_id, 'Dr. Anita Patel', 'doctor',       '(617) 555-0201', 'apatel@openhospice.org',     now() - interval '30 days'),
  (ct_social_worker,patient_id, 'Marcus Williams', 'social_worker','(617) 555-0223', 'mwilliams@openhospice.org',  now() - interval '30 days'),
  (ct_chaplain,     patient_id, 'Rev. Diana Rivera','chaplain',    '(617) 555-0234', 'drivera@openhospice.org',    now() - interval '30 days'),
  (ct_aide,         patient_id, 'Linda Okafor',    'other',        '(617) 555-0245', 'lokafor@openhospice.org',    now() - interval '30 days'),
  (ct_volunteer,    patient_id, 'Tom Nguyen',      'other',        '(617) 555-0256', 'tnguyen@openhospice.org',    now() - interval '30 days');

-- ============================================================
-- 6. MESSAGES (9 messages, mix of read/unread)
-- ============================================================
INSERT INTO public.messages
  (id, patient_id, sender_name, sender_role, recipient_type, message_text, is_from_patient, sent_at, read_at, created_at)
VALUES

-- Oldest first
(gen_random_uuid(), patient_id,
 'Dr. Anita Patel', 'Hospice Physician', 'team',
 'Dear Margaret, I reviewed your care plan this morning. Overall, I''m pleased with how things are going. I''d like to slightly increase the available dose of morphine for difficult episodes — Sarah will explain this in more detail on Friday. Please don''t hesitate to reach out if you have concerns. — Dr. Patel',
 false, now() - interval '5 days', now() - interval '5 days', now() - interval '5 days'),

(gen_random_uuid(), patient_id,
 'Margaret Chen', NULL, 'team',
 'The pillows have made a huge difference at night. My breathing feels much better when I''m propped up. Thank you for suggesting that.',
 true, now() - interval '4 days 13 hours 30 minutes', now() - interval '4 days 13 hours', now() - interval '4 days 13 hours 30 minutes'),

(gen_random_uuid(), patient_id,
 'Sarah Thompson', 'Registered Nurse', 'team',
 'Margaret, I reviewed your recent notes and your breathing has been more stable over the past few days — that''s wonderful news. Keep doing what you''re doing. The positioning pillows seem to be really helping.',
 false, now() - interval '4 days', now() - interval '4 days', now() - interval '4 days'),

(gen_random_uuid(), patient_id,
 'Marcus Williams', 'Social Worker', 'team',
 'Hi Margaret, I wanted to let you know that the paperwork for the supplemental benefit was approved. You''ll receive a letter in the mail this week. No action needed on your part — I''ve handled everything. Let me know if you have any questions.',
 false, now() - interval '3 days', now() - interval '3 days', now() - interval '3 days'),

(gen_random_uuid(), patient_id,
 'Margaret Chen', NULL, 'team',
 'Thank you, Marcus. That''s such a relief. My daughter Jennifer was worried about that. I''ll tell her the good news.',
 true, now() - interval '3 days' + interval '30 minutes', now() - interval '3 days', now() - interval '3 days' + interval '30 minutes'),

(gen_random_uuid(), patient_id,
 'Margaret Chen', NULL, 'team',
 'Sarah, Friday at 10am is perfect. I''ve been having a little more trouble sleeping — is that something we can talk about when you come?',
 true, now() - interval '1 day 4 hours 15 minutes', now() - interval '1 day 4 hours', now() - interval '1 day 4 hours 15 minutes'),

(gen_random_uuid(), patient_id,
 'Sarah Thompson', 'Registered Nurse', 'team',
 'Absolutely, we''ll make that our first topic. In the meantime, if sleep is really difficult tonight, the Lorazepam can help. Just half a tablet (0.25mg) is fine — you don''t need to take the full dose. Call the after-hours line if you need to talk before Friday.',
 false, now() - interval '1 day 4 hours', now() - interval '1 day 3 hours 45 minutes', now() - interval '1 day 4 hours'),

-- Unread messages (no read_at)
(gen_random_uuid(), patient_id,
 'Rev. Diana Rivera', 'Chaplain', 'team',
 'Dear Margaret, I''m thinking of you and your family this week. My visit is set for Thursday at 2pm. If you''d like to talk sooner — or if Jennifer would like to speak with me — please don''t hesitate to reach out. Warmly, Diana',
 false, now() - interval '2 days', NULL, now() - interval '2 days'),

(gen_random_uuid(), patient_id,
 'Sarah Thompson', 'Registered Nurse', 'team',
 'Good morning, Margaret! Just a reminder that I''ll be visiting this Friday at 10am. Please let me know if that time still works for you, or if you''d like to reschedule. Looking forward to seeing you. — Sarah',
 false, now() - interval '3 hours', NULL, now() - interval '3 hours');

-- ============================================================
-- 7. EDUCATIONAL CONTENT (6 articles)
-- ============================================================
INSERT INTO public.educational_content
  (id, title, category, summary, content_text, reading_time_minutes, published_date, is_active, created_at)
VALUES

(gen_random_uuid(),
 'What Is Hospice Care?',
 'Understanding Hospice',
 'Hospice is a special kind of care focused on comfort, not cure. Learn what hospice means for you and your family.',
 'Hospice care is a type of medical care focused on comfort, dignity, and quality of life — not on curing illness. It is for people who have a serious illness and have decided to focus on living as fully and comfortably as possible.

Who Is Hospice For?

Hospice care is for anyone with a serious illness where the goal has shifted from aggressive treatment to comfort. This is not giving up — it is choosing to focus on what matters most to you.

What Does Hospice Provide?

Your hospice team includes nurses, doctors, social workers, chaplains, and home health aides — all working together to care for you and your family. They visit regularly, are available by phone around the clock, and can provide equipment and medications at home.

What About My Family?

Hospice care includes support for your whole family — emotional support, education, and bereavement counseling after your death. You do not have to go through this alone, and neither do the people who love you.',
 5, '2026-01-15', true, now() - interval '43 days'),

(gen_random_uuid(),
 'Managing Breathlessness at Home',
 'Managing Symptoms',
 'Shortness of breath can be frightening. These simple techniques and tools can help you feel more comfortable and in control.',
 'Feeling short of breath — or breathless — is one of the most common and frightening symptoms in advanced illness. The good news is that there are many ways to manage it, and your care team is here to help.

Why Does Breathlessness Happen?

In advanced heart failure and other serious illnesses, fluid can build up in and around the lungs, making it harder to breathe. Medications like furosemide help remove this fluid. Anxiety can also make breathlessness feel worse.

Simple Things That Help Right Now

Sit upright or lean forward slightly — try sitting at the edge of a bed with arms resting on a table. Open a window or use a small fan — a gentle breeze on your face can reduce the feeling of breathlessness. Stay calm and slow your breathing — breathe in through your nose slowly, breathe out through pursed lips. Use your medications — morphine and lorazepam are specifically there to help with breathlessness and anxiety.',
 7, '2026-01-22', true, now() - interval '36 days'),

(gen_random_uuid(),
 'Pain Relief: Your Right and Our Priority',
 'Managing Symptoms',
 'Good pain control is essential to quality of life. You deserve to be comfortable, and there are many safe and effective options.',
 'Being comfortable is not a luxury — it is a right. Effective pain control is one of the most important parts of hospice care, and your care team takes it very seriously.

Common Concerns About Pain Medication

Many people worry about taking morphine or other strong pain medications. Will I become addicted? People with serious illness who take pain medications as prescribed do not become addicted. Will it make me sleep all the time? At first, some medications cause drowsiness, but most people adjust within a few days. Will it hasten my death? When used correctly for symptom relief, pain medications do not shorten life.

You Are in Control

Pain control should always be your decision. Talk to your nurse about what level of pain is acceptable to you, and what you are willing to trade off for alertness, activity, or other priorities.',
 6, '2026-02-01', true, now() - interval '26 days'),

(gen_random_uuid(),
 'Talking With Your Family About End-of-Life Wishes',
 'Family & Caregiving',
 'These conversations can feel hard to start — but they bring relief and closeness. Here''s how to begin.',
 'Talking about death is one of the hardest things families do — and one of the most loving. When you share your wishes with the people you love, you give them a gift: the ability to care for you in exactly the way you want.

Where to Start

You don''t have to have a long, formal conversation. Sometimes it starts simply: "I want to talk about something important to me." You might share where you want to be cared for, what treatments you do or don''t want, who you trust to make decisions, and what brings you comfort.

Putting Wishes in Writing

An advance directive records your wishes. Yours is already on file with your care team. Make sure your family knows where to find it and that they''ve read it.',
 8, '2026-02-05', true, now() - interval '22 days'),

(gen_random_uuid(),
 'Caring for Yourself as a Caregiver',
 'Family & Caregiving',
 'Caring for someone you love is meaningful — and exhausting. You need and deserve support too.',
 'If you are caring for a loved one in hospice, you are doing one of the most profound and demanding things a person can do. Your own wellbeing matters — not just for you, but so you can continue to be present for the person you love.

Signs You May Need More Support

Feeling exhausted no matter how much you rest. Difficulty concentrating or making decisions. Feeling sad, anxious, or hopeless much of the time. These are signs of caregiver fatigue, not weakness.

What Help Is Available

Your hospice team includes support for you, not just your loved one. Our social worker can connect you with respite care, support groups, counseling referrals, and help with practical tasks.',
 6, '2026-02-10', true, now() - interval '17 days'),

(gen_random_uuid(),
 'What to Expect in the Final Days',
 'Understanding Hospice',
 'Knowing what may happen can reduce fear and help you and your family feel more prepared and present.',
 'Understanding what the body does as it naturally prepares for death can transform fear into presence. Many families say that knowing what to expect helped them feel more peaceful.

Changes You May Notice

Eating and drinking less — This is natural and not painful. The body no longer needs nutrition in the same way. Sleeping more — As energy decreases, sleeping most of the time is normal and comfortable. Changes in breathing — Breathing may become irregular or have periods of pause. Cooling and color changes — Hands and feet may feel cool and look different as circulation decreases.

Being Present

You do not need to say the perfect thing. Hold a hand. Play music they love. Share a memory. Say the things you want them to know. Your presence is the greatest gift.',
 9, '2026-02-15', true, now() - interval '12 days');

-- ============================================================
-- 8. APPOINTMENTS (3 upcoming)
-- ============================================================
INSERT INTO public.appointments
  (id, patient_id, care_team_member_id, appointment_type, scheduled_at, duration_minutes, location, notes, confirmed_at, created_at)
VALUES

(gen_random_uuid(), patient_id, ct_chaplain,
 'Chaplain Visit', now() + interval '3 hours',
 60, 'Your home', 'Regular weekly visit',
 NULL,
 now() - interval '7 days'),

(gen_random_uuid(), patient_id, ct_nurse,
 'Nurse Visit', now() + interval '1 day 10 hours',
 90, 'Your home', 'Medication review, sleep difficulty discussion, care plan update',
 now() - interval '1 day',
 now() - interval '7 days'),

(gen_random_uuid(), patient_id, ct_aide,
 'Home Health Aide', now() + interval '2 days 9 hours',
 120, 'Your home', 'Personal care — bathing and grooming',
 now() - interval '3 days',
 now() - interval '14 days');

END $$;
