// ============================================================
// OPEN WINDOWS — MOCK DATA
// Patient: Margaret Chen, age 74
// ============================================================

export const patient = {
  id: 'patient-001',
  firstName: 'Margaret',
  lastName: 'Chen',
  age: 74,
  dob: '1951-09-14',
  phone: '(617) 555-0142',
  address: '48 Maple Street, Lexington, MA 02420',
  diagnosis: 'Advanced Heart Failure',
  currentStatus: 'active',
};

// ----------------------------------------------------------
// MEDICATIONS (sorted by time of day)
// ----------------------------------------------------------
export const medications = [
  {
    id: 'med-001',
    name: 'Furosemide',
    genericName: 'Furosemide (Lasix)',
    dosage: '40',
    unit: 'mg',
    frequency: 'Once every morning',
    timeOfDay: 'morning',
    route: 'By mouth (oral tablet)',
    purpose: 'Helps your body remove extra fluid, which makes it easier to breathe and reduces swelling in your legs and feet.',
    sideEffects: [
      'You may urinate more often — this is normal and expected',
      'Drink plenty of water unless your care team says otherwise',
      'You may feel dizzy when standing up quickly — rise slowly',
      'Contact your nurse if you have muscle cramps or feel very weak',
    ],
    prescriber: 'Dr. Anita Patel',
    status: 'delivered',
    deliveryDate: '2026-02-25',
    deliveredBy: 'Sarah Thompson, RN',
  },
  {
    id: 'med-002',
    name: 'Metoprolol Succinate',
    genericName: 'Metoprolol Succinate (Toprol-XL)',
    dosage: '25',
    unit: 'mg',
    frequency: 'Once every morning',
    timeOfDay: 'morning',
    route: 'By mouth (oral tablet)',
    purpose: 'Slows your heart rate and reduces strain on your heart, helping it beat more steadily and comfortably.',
    sideEffects: [
      'You may feel more tired than usual, especially at first',
      'Some people notice cold hands or feet',
      'Do not stop taking this suddenly — always talk to your care team first',
      'Call your nurse if you feel faint or your heart is beating very slowly',
    ],
    prescriber: 'Dr. Anita Patel',
    status: 'delivered',
    deliveryDate: '2026-02-25',
    deliveredBy: 'Sarah Thompson, RN',
  },
  {
    id: 'med-003',
    name: 'Morphine Sulfate',
    genericName: 'Morphine Sulfate (oral liquid)',
    dosage: '2.5',
    unit: 'mg',
    frequency: 'Every 4 hours as needed for shortness of breath or discomfort',
    timeOfDay: 'as-needed',
    route: 'By mouth (liquid, measured with dropper)',
    purpose: 'Relieves the feeling of breathlessness and discomfort. It does not hasten death — it helps you breathe more easily and feel more comfortable.',
    sideEffects: [
      'Makes most people feel drowsy — rest if you need to',
      'Can cause constipation — your nurse will help manage this',
      'You may feel slightly confused or have vivid dreams, especially at first',
      'Call immediately if breathing becomes very slow or you cannot be woken',
    ],
    prescriber: 'Dr. Anita Patel',
    status: 'delivered',
    deliveryDate: '2026-02-25',
    deliveredBy: 'Sarah Thompson, RN',
  },
  {
    id: 'med-004',
    name: 'Lorazepam',
    genericName: 'Lorazepam (Ativan)',
    dosage: '0.5',
    unit: 'mg',
    frequency: 'Every 6 hours as needed for anxiety or restlessness',
    timeOfDay: 'as-needed',
    route: 'Dissolves under the tongue (sublingual)',
    purpose: 'Helps relieve anxiety, restlessness, and the panicked feeling that sometimes comes with difficulty breathing. It helps you feel calmer.',
    sideEffects: [
      'You will likely feel sleepy after taking this — this is expected',
      'Do not drive or operate machinery',
      'May cause mild confusion in some people',
      'Your family members may notice you are harder to wake — this is normal',
    ],
    prescriber: 'Dr. Anita Patel',
    status: 'scheduled',
    expectedDelivery: 'by Friday, February 28',
    deliveredBy: null,
  },
  {
    id: 'med-005',
    name: 'Senna',
    genericName: 'Senna (Senokot)',
    dosage: '2',
    unit: 'tablets',
    frequency: 'Twice daily — morning and evening',
    timeOfDay: 'evening',
    route: 'By mouth (oral tablet)',
    purpose: 'Prevents constipation, which is a common side effect of morphine and other pain medicines. Keeping things moving is important for your comfort.',
    sideEffects: [
      'Stomach cramping is possible, especially if taken without food',
      'Your stools may be darker — this is normal',
      'Call your nurse if you have no bowel movement for 3 or more days',
    ],
    prescriber: 'Sarah Thompson, RN',
    status: 'delivered',
    deliveryDate: '2026-02-25',
    deliveredBy: 'Sarah Thompson, RN',
  },
  {
    id: 'med-006',
    name: 'Haloperidol',
    genericName: 'Haloperidol (Haldol)',
    dosage: '0.5',
    unit: 'mg',
    frequency: 'As needed for agitation or confusion (no more than every 4 hours)',
    timeOfDay: 'as-needed',
    route: 'By mouth (liquid) or under the tongue',
    purpose: 'Helps with confusion, seeing things that aren\'t there, or severe restlessness. It can make the mind feel quieter and more settled.',
    sideEffects: [
      'May cause drowsiness',
      'Some people notice stiffness or restlessness in legs — tell your nurse',
      'Call your care team if symptoms seem to get worse rather than better',
    ],
    prescriber: 'Dr. Anita Patel',
    status: 'not_scheduled',
    expectedDelivery: null,
    deliveredBy: null,
  },
];

// ----------------------------------------------------------
// CARE PLAN
// ----------------------------------------------------------
export const carePlan = {
  id: 'cp-001',
  patientId: 'patient-001',
  lastUpdated: '2026-02-20',
  lastUpdatedBy: 'Dr. Anita Patel',
  comfortGoals: [
    {
      id: 'cg-001',
      goal: 'Manage breathlessness and make breathing easier',
      status: 'in-progress',
      progress: 65,
      notes: 'Morphine and positioning changes are helping. We\'re still adjusting the dose to find the right balance between relief and alertness.',
    },
    {
      id: 'cg-002',
      goal: 'Stay comfortable and free from pain',
      status: 'in-progress',
      progress: 80,
      notes: 'Margaret reports pain is well-managed most of the time. She rates it 2-3 out of 10 on most days.',
    },
    {
      id: 'cg-003',
      goal: 'Stay alert and present for family visits',
      status: 'achieved',
      progress: 100,
      notes: 'Medication timing has been adjusted so Margaret is most alert during afternoon family visits. This is working well.',
    },
    {
      id: 'cg-004',
      goal: 'Reduce anxiety and fear around breathing difficulties',
      status: 'in-progress',
      progress: 50,
      notes: 'Lorazepam is available and helps during acute episodes. Dr. Rivera (chaplain) visits are also providing meaningful emotional support.',
    },
  ],
  medicalGoals: [
    {
      id: 'mg-001',
      goal: 'Keep fluid levels stable and prevent severe congestion',
      status: 'in-progress',
      progress: 70,
      notes: 'Furosemide is helping. We are monitoring daily weights and adjusting as needed.',
    },
    {
      id: 'mg-002',
      goal: 'Maintain heart rate in a comfortable, steady range',
      status: 'achieved',
      progress: 100,
      notes: 'Heart rate has been consistently between 60-75 bpm. The Metoprolol dose is working well.',
    },
    {
      id: 'mg-003',
      goal: 'Prevent unnecessary hospitalizations',
      status: 'in-progress',
      progress: 90,
      notes: 'Margaret and family have a clear plan for when to call the hospice line versus going to the hospital. They are following it well.',
    },
  ],
  advanceDirective: {
    text: `Margaret Chen has expressed clear wishes about her care:

I want to remain at home for as long as possible. I do not want to go back to the hospital unless absolutely necessary for my comfort.

I do not want CPR (cardiopulmonary resuscitation) or any attempts to restart my heart if it stops. I understand this means allowing a natural death.

I do not want to be placed on a breathing machine (ventilator).

I want all treatments focused on keeping me comfortable, pain-free, and able to spend meaningful time with my family.

I trust my daughter, Jennifer Chen Park, to make decisions for me if I am not able to speak for myself. She knows my wishes and I trust her completely.`,
    signedDate: '2025-11-12',
    healthcareProxyName: 'Jennifer Chen Park (daughter)',
    healthcareProxyPhone: '(617) 555-0198',
  },
};

// ----------------------------------------------------------
// CARE TEAM
// ----------------------------------------------------------
export const careTeam = [
  {
    id: 'ct-001',
    name: 'Sarah Thompson',
    role: 'nurse',
    roleLabel: 'Registered Nurse',
    phone: '(617) 555-0210',
    email: 'sthompson@openhospice.org',
    bio: 'Sarah is your primary nurse and visits twice a week. She manages your medications and is your first call for any concerns.',
    visitSchedule: 'Tuesdays and Fridays, 10am–12pm',
  },
  {
    id: 'ct-002',
    name: 'Dr. Anita Patel',
    role: 'doctor',
    roleLabel: 'Hospice Physician',
    phone: '(617) 555-0201',
    email: 'apatel@openhospice.org',
    bio: 'Dr. Patel oversees your medical care and is available by phone for urgent questions. She reviews your care plan monthly.',
    visitSchedule: 'Monthly or as needed',
  },
  {
    id: 'ct-003',
    name: 'Marcus Williams',
    role: 'social_worker',
    roleLabel: 'Social Worker',
    phone: '(617) 555-0223',
    email: 'mwilliams@openhospice.org',
    bio: 'Marcus helps with practical and emotional needs — family communication, paperwork, finances, and connecting you with resources. He is here for the whole family.',
    visitSchedule: 'Biweekly, flexible scheduling',
  },
  {
    id: 'ct-004',
    name: 'Rev. Diana Rivera',
    role: 'chaplain',
    roleLabel: 'Chaplain',
    phone: '(617) 555-0234',
    email: 'drivera@openhospice.org',
    bio: 'Diana provides spiritual and emotional support for you and your family. She welcomes people of all faiths and those with no faith tradition.',
    visitSchedule: 'Weekly, or whenever you want to talk',
  },
  {
    id: 'ct-005',
    name: 'Linda Okafor',
    role: 'home_aide',
    roleLabel: 'Home Health Aide',
    phone: '(617) 555-0245',
    email: 'lokafor@openhospice.org',
    bio: 'Linda helps with bathing, grooming, and daily personal care. She visits three times a week to help you feel comfortable and cared for.',
    visitSchedule: 'Monday, Wednesday, Saturday — mornings',
  },
  {
    id: 'ct-006',
    name: 'Tom Nguyen',
    role: 'volunteer',
    roleLabel: 'Volunteer Coordinator',
    phone: '(617) 555-0256',
    email: 'tnguyen@openhospice.org',
    bio: 'Tom coordinates volunteers who can sit with you, read aloud, run errands, or give your family a rest. Just ask — we have wonderful volunteers available.',
    visitSchedule: 'Flexible — contact Tom to arrange',
  },
];

// ----------------------------------------------------------
// MESSAGES
// ----------------------------------------------------------
export const messages = [
  {
    id: 'msg-001',
    senderName: 'Sarah Thompson',
    senderRole: 'Registered Nurse',
    isFromPatient: false,
    text: 'Good morning, Margaret! Just a reminder that I\'ll be visiting this Friday at 10am. Please let me know if that time still works for you, or if you\'d like to reschedule. Looking forward to seeing you. — Sarah',
    sentAt: '2026-02-27T08:30:00Z',
    readAt: null,
  },
  {
    id: 'msg-002',
    senderName: 'Margaret Chen',
    senderRole: null,
    isFromPatient: true,
    text: 'Sarah, Friday at 10am is perfect. I\'ve been having a little more trouble sleeping — is that something we can talk about when you come?',
    sentAt: '2026-02-26T19:45:00Z',
    readAt: '2026-02-26T20:00:00Z',
  },
  {
    id: 'msg-003',
    senderName: 'Sarah Thompson',
    senderRole: 'Registered Nurse',
    isFromPatient: false,
    text: 'Absolutely, we\'ll make that our first topic. In the meantime, if sleep is really difficult tonight, the Lorazepam can help. Just half a tablet (0.25mg) is fine — you don\'t need to take the full dose. Call the after-hours line if you need to talk before Friday.',
    sentAt: '2026-02-26T20:15:00Z',
    readAt: '2026-02-26T20:30:00Z',
  },
  {
    id: 'msg-004',
    senderName: 'Rev. Diana Rivera',
    senderRole: 'Chaplain',
    isFromPatient: false,
    text: 'Dear Margaret, I\'m thinking of you and your family this week. My visit is set for Thursday at 2pm. If you\'d like to talk sooner — or if Jennifer would like to speak with me — please don\'t hesitate to reach out. Warmly, Diana',
    sentAt: '2026-02-25T14:00:00Z',
    readAt: null,
  },
  {
    id: 'msg-005',
    senderName: 'Marcus Williams',
    senderRole: 'Social Worker',
    isFromPatient: false,
    text: 'Hi Margaret, I wanted to let you know that the paperwork for the supplemental benefit was approved. You\'ll receive a letter in the mail this week. No action needed on your part — I\'ve handled everything. Let me know if you have any questions.',
    sentAt: '2026-02-24T11:20:00Z',
    readAt: '2026-02-24T15:00:00Z',
  },
  {
    id: 'msg-006',
    senderName: 'Margaret Chen',
    senderRole: null,
    isFromPatient: true,
    text: 'Thank you, Marcus. That\'s such a relief. My daughter Jennifer was worried about that. I\'ll tell her the good news.',
    sentAt: '2026-02-24T15:30:00Z',
    readAt: '2026-02-24T16:00:00Z',
  },
  {
    id: 'msg-007',
    senderName: 'Sarah Thompson',
    senderRole: 'Registered Nurse',
    isFromPatient: false,
    text: 'Margaret, I reviewed your recent notes and your breathing has been more stable over the past few days — that\'s wonderful news. Keep doing what you\'re doing. The positioning pillows seem to be really helping.',
    sentAt: '2026-02-23T09:00:00Z',
    readAt: '2026-02-23T10:00:00Z',
  },
  {
    id: 'msg-008',
    senderName: 'Margaret Chen',
    senderRole: null,
    isFromPatient: true,
    text: 'Yes, the pillows have made a huge difference at night. My breathing feels much better when I\'m propped up. Thank you for suggesting that.',
    sentAt: '2026-02-23T10:30:00Z',
    readAt: '2026-02-23T11:00:00Z',
  },
  {
    id: 'msg-009',
    senderName: 'Dr. Anita Patel',
    senderRole: 'Hospice Physician',
    isFromPatient: false,
    text: 'Dear Margaret, I reviewed your care plan this morning. Overall, I\'m pleased with how things are going. I\'d like to slightly increase the available dose of morphine for difficult episodes — Sarah will explain this in more detail on Friday. Please don\'t hesitate to reach out if you have concerns. — Dr. Patel',
    sentAt: '2026-02-22T16:00:00Z',
    readAt: '2026-02-22T18:00:00Z',
  },
];

// ----------------------------------------------------------
// EDUCATIONAL ARTICLES
// ----------------------------------------------------------
export const articles = [
  {
    id: 'art-001',
    title: 'What Is Hospice Care?',
    category: 'Understanding Hospice',
    summary: 'Hospice is a special kind of care focused on comfort, not cure. Learn what hospice means for you and your family.',
    readingTime: 5,
    publishedDate: '2026-01-15',
    isFavorited: true,
    content: `Hospice care is a type of medical care focused on comfort, dignity, and quality of life — not on curing illness. It is for people who have a serious illness and have decided to focus on living as fully and comfortably as possible.

**Who Is Hospice For?**

Hospice care is for anyone with a serious illness where the goal has shifted from aggressive treatment to comfort. This is not giving up — it is choosing to focus on what matters most to you.

**What Does Hospice Provide?**

Your hospice team includes nurses, doctors, social workers, chaplains, and home health aides — all working together to care for you and your family. They visit regularly, are available by phone around the clock, and can provide equipment and medications at home.

**Where Can I Receive Hospice Care?**

Most people receive hospice care at home, in the comfort of familiar surroundings. Hospice can also be provided in nursing homes, assisted living facilities, or dedicated hospice facilities.

**What About My Family?**

Hospice care includes support for your whole family — emotional support, education, and bereavement counseling after your death. You do not have to go through this alone, and neither do the people who love you.

**What If I Change My Mind?**

You can leave hospice at any time — for example, if you decide to try a new treatment. You can also return to hospice later if needed. It is always your choice.`,
    relatedArticleIds: ['art-002', 'art-003'],
  },
  {
    id: 'art-002',
    title: 'Managing Breathlessness at Home',
    category: 'Managing Symptoms',
    summary: 'Shortness of breath can be frightening. These simple techniques and tools can help you feel more comfortable and in control.',
    readingTime: 7,
    publishedDate: '2026-01-22',
    isFavorited: false,
    content: `Feeling short of breath — or breathless — is one of the most common and frightening symptoms in advanced illness. The good news is that there are many ways to manage it, and your care team is here to help.

**Why Does Breathlessness Happen?**

In advanced heart failure and other serious illnesses, fluid can build up in and around the lungs, making it harder to breathe. Medications like furosemide help remove this fluid. Anxiety can also make breathlessness feel worse.

**Simple Things That Help Right Now**

- **Sit upright or lean forward slightly** — try sitting at the edge of a bed with arms resting on a table
- **Open a window or use a small fan** — a gentle breeze on your face can reduce the feeling of breathlessness
- **Stay calm and slow your breathing** — breathe in through your nose slowly, breathe out through pursed lips (as if blowing out a candle)
- **Use your medications** — morphine and lorazepam are specifically there to help with breathlessness and anxiety

**When to Call Your Nurse**

Call your hospice nurse if breathlessness is suddenly much worse than usual, if your lips or fingernails turn bluish, or if your medications don't seem to be helping.

**Your medications are your friends.** Many people wait too long to use their breathlessness medications because they worry about taking too much. Talk to your nurse about what the right amount is for you.`,
    relatedArticleIds: ['art-001', 'art-003'],
  },
  {
    id: 'art-003',
    title: 'Pain Relief: Your Right and Our Priority',
    category: 'Managing Symptoms',
    summary: 'Good pain control is essential to quality of life. You deserve to be comfortable, and there are many safe and effective options.',
    readingTime: 6,
    publishedDate: '2026-02-01',
    isFavorited: false,
    content: `Being comfortable is not a luxury — it is a right. Effective pain control is one of the most important parts of hospice care, and your care team takes it very seriously.

**Common Concerns About Pain Medication**

Many people worry about taking morphine or other strong pain medications. Here are some honest answers to common questions:

*"Will I become addicted?"* People with serious illness who take pain medications as prescribed do not become addicted. Addiction is a complex condition — using medication to treat real pain is not the same thing.

*"Will it make me sleep all the time?"* At first, some medications cause drowsiness, but most people adjust within a few days. Your care team will work to find the right dose so you are comfortable and as alert as you want to be.

*"Will it hasten my death?"* When used correctly for symptom relief, pain medications do not shorten life. In fact, being in less pain often allows people to be more engaged and peaceful.

**Describing Your Pain**

Helping your care team understand your pain is important. Try to describe:
- Where does it hurt?
- What does it feel like — aching, burning, sharp, pressure?
- On a scale of 0–10, how bad is it?
- What makes it better or worse?

**You Are in Control**

Pain control should always be your decision. Talk to your nurse about what level of pain is acceptable to you, and what you are willing to trade off for alertness, activity, or other priorities.`,
    relatedArticleIds: ['art-002', 'art-004'],
  },
  {
    id: 'art-004',
    title: 'Talking With Your Family About End-of-Life Wishes',
    category: 'Family & Caregiving',
    summary: 'These conversations can feel hard to start — but they bring relief and closeness. Here\'s how to begin.',
    readingTime: 8,
    publishedDate: '2026-02-05',
    isFavorited: true,
    content: `Talking about death is one of the hardest things families do — and one of the most loving. When you share your wishes with the people you love, you give them a gift: the ability to care for you in exactly the way you want, and to know they are honoring your choices.

**Why These Conversations Matter**

When families don't know a loved one's wishes, they often face painful decisions under stress, sometimes disagreeing with each other. Clear conversations now prevent confusion and conflict later.

**Where to Start**

You don't have to have a long, formal conversation. Sometimes it starts simply: "I want to talk about something important to me." You might share:
- Where you want to be cared for
- What treatments you do or don't want
- Who you trust to make decisions if you can't speak for yourself
- What brings you comfort — music, visitors, spiritual practices, nature

**What If My Family Finds It Too Hard?**

Some family members struggle with these conversations because they love you and don't want to think about losing you. That's understandable. Your social worker or chaplain can help facilitate these conversations if you'd like. You don't have to do it alone.

**Putting Wishes in Writing**

An advance directive (sometimes called a living will) is a document that records your wishes. Yours is already on file with your care team. Make sure your family knows where to find it and that they've read it.

**It's Okay to Keep Talking**

Your wishes can change. Keep having these conversations. What matters most is that the people who love you know how to care for you well.`,
    relatedArticleIds: ['art-005', 'art-006'],
  },
  {
    id: 'art-005',
    title: 'Caring for Yourself as a Caregiver',
    category: 'Family & Caregiving',
    summary: 'Caring for someone you love is meaningful — and exhausting. You need and deserve support too.',
    readingTime: 6,
    publishedDate: '2026-02-10',
    isFavorited: false,
    content: `If you are caring for a loved one in hospice, you are doing one of the most profound and demanding things a person can do. Your own wellbeing matters — not just for you, but so you can continue to be present for the person you love.

**Signs You May Need More Support**

- Feeling exhausted no matter how much you rest
- Difficulty concentrating or making decisions
- Feeling sad, anxious, or hopeless much of the time
- Neglecting your own health, meals, or sleep
- Feeling resentful or overwhelmed

These are signs of caregiver fatigue, not weakness. They are signals that you need more support.

**What Help Is Available**

Your hospice team includes support for you, not just your loved one. Our social worker can connect you with:
- Respite care (trained volunteers or aides who sit with your loved one so you can rest)
- Caregiver support groups
- Counseling or therapy referrals
- Help with practical tasks

**Small Ways to Care for Yourself**

- Accept help when it is offered
- Sleep whenever you can
- Eat regular meals
- Step outside for fresh air each day
- Let yourself feel sad, angry, or scared — these are normal

**You Are Not Alone**

Our chaplain and social worker are here for you too. Please reach out. Asking for help is not giving up — it's how you keep going.`,
    relatedArticleIds: ['art-004', 'art-006'],
  },
  {
    id: 'art-006',
    title: 'What to Expect in the Final Days',
    category: 'Understanding Hospice',
    summary: 'Knowing what may happen can reduce fear and help you and your family feel more prepared and present.',
    readingTime: 9,
    publishedDate: '2026-02-15',
    isFavorited: false,
    content: `Understanding what the body does as it naturally prepares for death can transform fear into presence. Many families say that knowing what to expect helped them feel more peaceful and more able to simply be with their loved one.

**Changes You May Notice**

In the days and weeks before death, the body begins to slow down and prepare. Common changes include:

*Eating and drinking less* — This is natural and not painful. The body no longer needs nutrition in the same way. Forcing food can cause discomfort. Keeping the mouth moist with a sponge swab is comforting.

*Sleeping more* — As energy decreases, sleeping most of the time is normal and comfortable.

*Changes in breathing* — Breathing may become irregular, slower, or have periods of no breath followed by rapid breathing. This can sound unusual but is rarely distressing to the person.

*Cooling and color changes* — Hands, feet, and legs may feel cool and look bluish or mottled (patchy). This is normal and happens as circulation decreases.

*Decreased consciousness* — Your loved one may become less responsive, may not recognize voices or faces, or may seem to be somewhere else. Hearing is often the last sense to go — keep speaking gently and lovingly.

**Being Present**

You do not need to say the perfect thing. Hold a hand. Play music they love. Share a memory. Say the things you want them to know. Your presence is the greatest gift.

**When to Call the Hospice Line**

You can always call the 24-hour hospice line. They will help you understand what is happening and tell you whether someone needs to come.`,
    relatedArticleIds: ['art-001', 'art-004'],
  },
];

// ----------------------------------------------------------
// APPOINTMENTS
// ----------------------------------------------------------
export const appointments = [
  {
    id: 'appt-001',
    type: 'Nurse Visit',
    careTeamMemberId: 'ct-001',
    careTeamMemberName: 'Sarah Thompson, RN',
    scheduledAt: '2026-02-28T10:00:00',
    durationMinutes: 90,
    location: 'Your home',
    notes: 'Medication review, wound check, care plan discussion',
    confirmed: true,
  },
  {
    id: 'appt-002',
    type: 'Chaplain Visit',
    careTeamMemberId: 'ct-004',
    careTeamMemberName: 'Rev. Diana Rivera',
    scheduledAt: '2026-02-27T14:00:00',
    durationMinutes: 60,
    location: 'Your home',
    notes: 'Regular visit',
    confirmed: false,
  },
  {
    id: 'appt-003',
    type: 'Home Health Aide',
    careTeamMemberId: 'ct-005',
    careTeamMemberName: 'Linda Okafor',
    scheduledAt: '2026-03-01T09:00:00',
    durationMinutes: 120,
    location: 'Your home',
    notes: 'Personal care — bathing and grooming',
    confirmed: true,
  },
];

// ----------------------------------------------------------
// DASHBOARD SUMMARY (derived)
// ----------------------------------------------------------
export const dashboardSummary = {
  nextAppointment: appointments[1], // Today's chaplain visit
  medicationCount: medications.length,
  unreadMessageCount: messages.filter(m => !m.isFromPatient && !m.readAt).length,
  carePlanStatus: 'On Track',
  carePlanGoalsAchieved: [...carePlan.comfortGoals, ...carePlan.medicalGoals]
    .filter(g => g.status === 'achieved').length,
  carePlanGoalsTotal: carePlan.comfortGoals.length + carePlan.medicalGoals.length,
};
