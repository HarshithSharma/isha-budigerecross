/**
 * Isha Place – Budigere  |  app.js
 *
 * Responsibilities:
 *  - Load programs & volunteering opportunities from Google Sheets via Apps Script
 *  - Real-time search and frequency filter for programs
 *  - WhatsApp number validation (10-digit Indian mobile)
 *  - Handle three contact forms: Volunteer Interest, General Inquiry, Program Registration
 *  - Sticky nav, mobile nav toggle, tab switcher, toast notifications
 */

/* =========================================================
   CONFIGURATION — replace with your deployed Apps Script URL
   ========================================================= */
const CONFIG = {
  /**
   * After deploying Code.gs as a Google Apps Script Web App, paste
   * the "Web App URL" here (ends with /exec).
   *
   * Example:
   *   appsScriptUrl: 'https://script.google.com/macros/s/AKfy.../exec'
   */
  appsScriptUrl: 'YOUR_APPS_SCRIPT_WEB_APP_URL',

  /**
   * Set to true to use demo/fallback data so the site works
   * without a live Apps Script deployment (useful for local dev).
   */
  useDemoData: true,
};

/* =========================================================
   DEMO DATA  (used when CONFIG.useDemoData === true)
   ========================================================= */
const DEMO_PROGRAMS = [
  {
    id: 'p1',
    title: 'Isha Kriya Guided Meditation',
    description:
      'A simple yet powerful guided meditation process created by Sadhguru. ' +
      'Suitable for complete beginners — no prior experience needed.',
    frequency: 'daily',
    schedule: 'Every day, 6:00 AM – 6:45 AM',
    venue: 'Isha Place, Budigere',
    contact: 'WhatsApp group link shared on registration',
  },
  {
    id: 'p2',
    title: 'Angamardana',
    description:
      'A series of 31 dynamic processes rooted in the yogic tradition that ' +
      'make the entire system — especially the spine — strong, flexible, and ' +
      'full of energy.',
    frequency: 'weekly',
    schedule: 'Saturdays, 7:00 AM – 8:30 AM',
    venue: 'Isha Place, Budigere',
    contact: 'Contact coordinator on registration',
  },
  {
    id: 'p3',
    title: 'Hatha Yoga – Surya Kriya',
    description:
      'A potent yogic practice of tremendous antiquity, designed as a ' +
      'holistic process for health, inner wellbeing, and as a stepping stone ' +
      'toward deeper yogic practices.',
    frequency: 'weekly',
    schedule: 'Sundays, 6:30 AM – 8:00 AM',
    venue: 'Isha Place, Budigere',
    contact: 'Contact coordinator on registration',
  },
  {
    id: 'p4',
    title: 'Sathsang – Sadhguru Talks',
    description:
      "Monthly community gathering to watch and discuss Sadhguru's talks, " +
      'share experiences, and strengthen the local Isha community.',
    frequency: 'monthly',
    schedule: 'First Sunday of every month, 5:00 PM – 7:00 PM',
    venue: 'Isha Place, Budigere',
    contact: 'Open to all — no registration required',
  },
  {
    id: 'p5',
    title: 'Inner Engineering Online – Local Support',
    description:
      'Participants who have completed Inner Engineering Online can join ' +
      'weekly support sessions to deepen their practice and clarify doubts ' +
      'with experienced meditators.',
    frequency: 'weekly',
    schedule: 'Wednesdays, 7:30 PM – 8:30 PM',
    venue: 'Online (Zoom link shared)',
    contact: 'IEO completion certificate required',
  },
  {
    id: 'p6',
    title: 'Yoga for Children',
    description:
      'Introduction to basic yogasanas, breathing, and concentration ' +
      'techniques for children aged 8–16. Builds focus, flexibility, and ' +
      'a strong foundation in well-being.',
    frequency: 'weekly',
    schedule: 'Saturdays, 10:00 AM – 11:00 AM',
    venue: 'Isha Place, Budigere',
    contact: 'Parent consent required — register below',
  },
  {
    id: 'p7',
    title: 'Isha Samskriti – Cultural Program',
    description:
      'A residential program for children and youth that integrates ' +
      'classical arts, traditional sciences, and inner-wellbeing practices. ' +
      'Orientation sessions held quarterly.',
    frequency: 'special',
    schedule: 'Quarterly — next session TBD',
    venue: 'Isha Yoga Center, Coimbatore (travel facilitated)',
    contact: 'Register early — limited seats',
  },
  {
    id: 'p8',
    title: 'Cleanliness & Green Drive',
    description:
      'Community-driven cleanliness and tree-planting initiative around ' +
      'Budigere and nearby areas, aligned with Project GreenHands.',
    frequency: 'monthly',
    schedule: 'Last Saturday of every month, 7:00 AM – 10:00 AM',
    venue: 'Meeting point shared on registration',
    contact: 'Bring your own gloves and a water bottle',
  },
];

const DEMO_VOLUNTEER_OPPORTUNITIES = [
  {
    id: 'v1',
    title: 'Program Coordinator',
    icon: '📋',
    description:
      'Help plan, schedule, and coordinate local programs and sathsangs. ' +
      'Ideal for organised individuals comfortable with logistics.',
    tags: ['Logistics', 'Planning', 'Communication'],
  },
  {
    id: 'v2',
    title: 'Yoga Facilitator',
    icon: '🧘',
    description:
      'Certified Isha Hatha Yoga teachers can facilitate weekly sessions ' +
      'in Budigere. Refresher workshops provided periodically.',
    tags: ['Yoga', 'Teaching', 'Certification required'],
  },
  {
    id: 'v3',
    title: 'Social Media & Content',
    icon: '📱',
    description:
      'Create graphics, write posts, and manage WhatsApp/Instagram channels ' +
      'for the Budigere center. Creative freedom with brand guidelines.',
    tags: ['Design', 'Writing', 'Social Media'],
  },
  {
    id: 'v4',
    title: 'IT & Web Support',
    icon: '💻',
    description:
      'Maintain the website, Google Sheets CMS, and digital tools that ' +
      'power our programs. Any web/coding skill is welcome.',
    tags: ['Web', 'Google Sheets', 'JavaScript'],
  },
  {
    id: 'v5',
    title: 'Outreach & Welfare',
    icon: '🤝',
    description:
      'Visit schools, colleges, and neighborhoods to spread awareness about ' +
      'Isha programs and run welfare activities in Bengaluru East.',
    tags: ['Community', 'Outreach', 'Communication'],
  },
  {
    id: 'v6',
    title: 'Kitchen Sevak',
    icon: '🍽️',
    description:
      'Help with prasad/food preparation and service during special events ' +
      'and sathsangs. No cooking experience required — just willingness!',
    tags: ['Service', 'Events', 'Food'],
  },
];

/* =========================================================
   STATE
   ========================================================= */
let allPrograms = [];
let currentSearch = '';
let currentFreq = 'all';

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

/**
 * Show a brief toast message.
 * @param {string} message
 * @param {'success'|'error'|''} type
 */
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show' + (type ? ' toast-' + type : '');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast';
  }, 3500);
}

/**
 * Validate a 10-digit Indian WhatsApp number.
 * Must start with 6, 7, 8, or 9 followed by 9 more digits.
 * @param {string} num
 * @returns {boolean}
 */
function isValidIndianMobile(num) {
  return /^[6-9]\d{9}$/.test(num.trim());
}

/**
 * Validate a basic email address.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Set or clear a field error.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorEl
 * @param {string} message  — empty string to clear error
 */
function setFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  if (message) {
    inputEl.classList.add('invalid');
    inputEl.classList.remove('valid');
  } else {
    inputEl.classList.remove('invalid');
    inputEl.classList.add('valid');
  }

  // For phone wrappers, apply class to the wrapper too
  const wrapper = inputEl.closest('.phone-input-wrapper');
  if (wrapper) {
    if (message) {
      wrapper.classList.add('invalid');
      wrapper.classList.remove('valid');
    } else {
      wrapper.classList.remove('invalid');
      wrapper.classList.add('valid');
    }
  }
}

/**
 * Clear validation state from a field.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorEl
 */
function clearFieldError(inputEl, errorEl) {
  errorEl.textContent = '';
  inputEl.classList.remove('invalid', 'valid');
  const wrapper = inputEl.closest('.phone-input-wrapper');
  if (wrapper) wrapper.classList.remove('invalid', 'valid');
}

/** Convert a frequency string to a display badge class. */
function freqClass(freq) {
  const f = (freq || '').toLowerCase();
  if (['daily', 'weekly', 'monthly', 'special'].includes(f)) return f;
  return 'other';
}

/** Escape HTML to prevent XSS when injecting user-controlled text. */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str || '')));
  return div.innerHTML;
}

/* =========================================================
   DATA FETCHING
   ========================================================= */

/**
 * Fetch data from the Apps Script Web App.
 * @param {'programs'|'volunteers'} type
 * @returns {Promise<Array>}
 */
async function fetchFromSheet(type) {
  if (CONFIG.useDemoData || !CONFIG.appsScriptUrl || CONFIG.appsScriptUrl === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
    // Return demo data after a simulated delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(type === 'programs' ? DEMO_PROGRAMS : DEMO_VOLUNTEER_OPPORTUNITIES);
      }, 600);
    });
  }

  const url = CONFIG.appsScriptUrl + '?type=' + type;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return Array.isArray(data.records) ? data.records : [];
}

/**
 * Post form data to the Apps Script Web App.
 * @param {string} formType
 * @param {Object} payload
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function postToSheet(formType, payload) {
  if (CONFIG.useDemoData || !CONFIG.appsScriptUrl || CONFIG.appsScriptUrl === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
    // Simulate a successful submission in demo mode
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: 'Demo mode — not actually saved.' }), 800);
    });
  }

  const response = await fetch(CONFIG.appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formType, ...payload }),
  });
  if (!response.ok) throw new Error('Network response was not ok: ' + response.status);
  const data = await response.json();
  return data;
}

/* =========================================================
   PROGRAMS
   ========================================================= */

/** Render a single program card element. */
function buildProgramCard(program) {
  const card = document.createElement('article');
  card.className = 'program-card';
  card.dataset.id = escapeHtml(program.id || '');

  const fc = freqClass(program.frequency);
  const freqLabel = (program.frequency || 'Other').charAt(0).toUpperCase() + (program.frequency || 'Other').slice(1).toLowerCase();

  card.innerHTML = `
    <div class="program-card-header">
      <h3 class="program-title">${escapeHtml(program.title)}</h3>
      <span class="freq-badge freq-badge--${fc}">${escapeHtml(freqLabel)}</span>
    </div>
    <p class="program-desc">${escapeHtml(program.description)}</p>
    <div class="program-meta">
      ${program.schedule ? `<div class="program-meta-item"><span class="meta-icon">🕐</span><span>${escapeHtml(program.schedule)}</span></div>` : ''}
      ${program.venue    ? `<div class="program-meta-item"><span class="meta-icon">📍</span><span>${escapeHtml(program.venue)}</span></div>` : ''}
      ${program.contact  ? `<div class="program-meta-item"><span class="meta-icon">ℹ️</span><span>${escapeHtml(program.contact)}</span></div>` : ''}
    </div>
    <div class="program-card-footer">
      <button class="program-register-btn" data-program-title="${escapeHtml(program.title)}">
        Register for this program →
      </button>
    </div>
  `;

  // Quick-register: switch to the Register tab and pre-select the program
  card.querySelector('.program-register-btn').addEventListener('click', () => {
    openRegisterTab(program.title);
  });

  return card;
}

/** Filter and render programs based on current search and frequency filter. */
function renderPrograms() {
  const grid = document.getElementById('programs-grid');
  const emptyState = document.getElementById('programs-empty');
  const query = currentSearch.toLowerCase().trim();

  const filtered = allPrograms.filter((p) => {
    const matchesFreq = currentFreq === 'all' || freqClass(p.frequency) === currentFreq;
    const matchesSearch =
      !query ||
      (p.title || '').toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query) ||
      (p.schedule || '').toLowerCase().includes(query) ||
      (p.venue || '').toLowerCase().includes(query);
    return matchesFreq && matchesSearch;
  });

  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    const fragment = document.createDocumentFragment();
    filtered.forEach((p) => fragment.appendChild(buildProgramCard(p)));
    grid.appendChild(fragment);
  }

  grid.setAttribute('aria-busy', 'false');
}

/** Load programs from the data source and initialise the grid. */
async function loadPrograms() {
  const grid = document.getElementById('programs-grid');
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading programs…</p>
    </div>`;

  try {
    allPrograms = await fetchFromSheet('programs');
    populateProgramDropdown(allPrograms);
    renderPrograms();
  } catch (err) {
    console.error('Failed to load programs:', err);
    grid.innerHTML = `
      <div class="loading-state">
        <p>⚠️ Could not load programs. Please try again later.</p>
      </div>`;
  }
}

/** Populate the program <select> in the registration form. */
function populateProgramDropdown(programs) {
  const select = document.getElementById('reg-program');
  if (!select) return;
  // Keep the default "Select a program…" option
  const defaultOpt = select.options[0];
  select.innerHTML = '';
  select.appendChild(defaultOpt);
  programs.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = escapeHtml(p.title);
    opt.textContent = p.title;
    select.appendChild(opt);
  });
}

/* =========================================================
   VOLUNTEERING
   ========================================================= */

/** Render a single volunteer opportunity card. */
function buildVolunteerCard(opp) {
  const card = document.createElement('article');
  card.className = 'volunteer-card';

  const tagsHtml = (opp.tags || [])
    .map((t) => `<span class="volunteer-tag">${escapeHtml(t)}</span>`)
    .join('');

  card.innerHTML = `
    <div class="volunteer-card-icon">${escapeHtml(opp.icon || '🤲')}</div>
    <h3 class="volunteer-card-title">${escapeHtml(opp.title)}</h3>
    <p class="volunteer-card-desc">${escapeHtml(opp.description)}</p>
    ${tagsHtml ? `<div class="volunteer-card-tags">${tagsHtml}</div>` : ''}
  `;
  return card;
}

/** Load volunteering opportunities. */
async function loadVolunteerOpportunities() {
  const grid = document.getElementById('volunteer-grid');
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading opportunities…</p>
    </div>`;

  try {
    const opps = await fetchFromSheet('volunteers');
    grid.innerHTML = '';
    if (opps.length === 0) {
      grid.innerHTML = '<p style="color:var(--color-text-muted)">No opportunities listed currently. Check back soon!</p>';
    } else {
      const fragment = document.createDocumentFragment();
      opps.forEach((o) => fragment.appendChild(buildVolunteerCard(o)));
      grid.appendChild(fragment);
    }
    grid.setAttribute('aria-busy', 'false');
  } catch (err) {
    console.error('Failed to load volunteer opportunities:', err);
    grid.innerHTML = `<p style="color:var(--color-text-muted)">⚠️ Could not load opportunities. Please try again later.</p>`;
  }
}

/* =========================================================
   FORM HELPERS
   ========================================================= */

/**
 * Set a form's submit button into loading / idle state.
 * @param {string} btnId
 * @param {boolean} loading
 */
function setButtonLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.querySelector('.btn-text').textContent = loading ? 'Sending…' : btn.dataset.defaultText;
  const loader = btn.querySelector('.btn-loader');
  if (loader) loader.classList.toggle('hidden', !loading);
}

/** Show a feedback message inside a form. */
function showFormFeedback(feedbackId, message, type) {
  const el = document.getElementById(feedbackId);
  if (!el) return;
  el.textContent = message;
  el.className = 'form-feedback ' + type;
}

/** Hide a form's feedback element. */
function hideFormFeedback(feedbackId) {
  const el = document.getElementById(feedbackId);
  if (el) { el.className = 'form-feedback hidden'; el.textContent = ''; }
}

/* =========================================================
   FORM VALIDATION
   ========================================================= */

/**
 * Validate a WhatsApp phone field.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorEl
 * @returns {boolean}
 */
function validateWhatsapp(inputEl, errorEl) {
  const val = inputEl.value.replace(/\D/g, ''); // digits only
  inputEl.value = val; // strip non-digits as user types
  if (!val) {
    setFieldError(inputEl, errorEl, 'WhatsApp number is required.');
    return false;
  }
  if (!isValidIndianMobile(val)) {
    setFieldError(inputEl, errorEl, 'Enter a valid 10-digit Indian mobile number (starts with 6–9).');
    return false;
  }
  setFieldError(inputEl, errorEl, '');
  return true;
}

/**
 * Validate a required text field.
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorEl
 * @param {string} label
 * @returns {boolean}
 */
function validateRequired(inputEl, errorEl, label) {
  if (!inputEl.value.trim()) {
    setFieldError(inputEl, errorEl, label + ' is required.');
    return false;
  }
  setFieldError(inputEl, errorEl, '');
  return true;
}

/**
 * Validate an optional email field (only if a value was entered).
 * @param {HTMLElement} inputEl
 * @param {HTMLElement} errorEl
 * @returns {boolean}
 */
function validateEmail(inputEl, errorEl) {
  const val = inputEl.value.trim();
  if (val && !isValidEmail(val)) {
    setFieldError(inputEl, errorEl, 'Enter a valid email address.');
    return false;
  }
  setFieldError(inputEl, errorEl, '');
  return true;
}

/* =========================================================
   VOLUNTEER FORM
   ========================================================= */
function initVolunteerForm() {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  const nameEl   = document.getElementById('vol-name');
  const waEl     = document.getElementById('vol-whatsapp');
  const emailEl  = document.getElementById('vol-email');
  const areaEl   = document.getElementById('vol-area');
  const submitBtn = document.getElementById('vol-submit');

  // Store default button text
  submitBtn.dataset.defaultText = submitBtn.querySelector('.btn-text').textContent;

  // Live validation on blur
  nameEl.addEventListener('blur',  () => validateRequired(nameEl,  document.getElementById('vol-name-error'),     'Full name'));
  waEl.addEventListener('blur',    () => validateWhatsapp(waEl,     document.getElementById('vol-whatsapp-error')));
  emailEl.addEventListener('blur', () => validateEmail(emailEl,    document.getElementById('vol-email-error')));
  areaEl.addEventListener('blur',  () => validateRequired(areaEl,  document.getElementById('vol-area-error'),     'Area of interest'));

  // Only allow digits in WhatsApp field
  waEl.addEventListener('input', () => {
    waEl.value = waEl.value.replace(/\D/g, '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormFeedback('vol-feedback');

    const valid = [
      validateRequired(nameEl,  document.getElementById('vol-name-error'),     'Full name'),
      validateWhatsapp(waEl,     document.getElementById('vol-whatsapp-error')),
      validateEmail(emailEl,    document.getElementById('vol-email-error')),
      validateRequired(areaEl,  document.getElementById('vol-area-error'),     'Area of interest'),
    ].every(Boolean);

    if (!valid) return;

    setButtonLoading('vol-submit', true);

    try {
      const result = await postToSheet('volunteer', {
        name:     nameEl.value.trim(),
        whatsapp: '+91' + waEl.value.trim(),
        email:    emailEl.value.trim(),
        area:     areaEl.value,
        message:  document.getElementById('vol-message').value.trim(),
      });

      if (result.success) {
        showFormFeedback('vol-feedback', '🙏 Thank you for your interest! We will reach out to you on WhatsApp soon.', 'success');
        form.reset();
        // Clear validation highlights
        [nameEl, waEl, emailEl, areaEl].forEach((el) => clearFieldError(el, { textContent: '' }));
        showToast('Interest submitted successfully!', 'success');
      } else {
        showFormFeedback('vol-feedback', result.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Volunteer form error:', err);
      showFormFeedback('vol-feedback', '⚠️ Could not submit. Please check your connection and try again.', 'error');
    } finally {
      setButtonLoading('vol-submit', false);
    }
  });
}

/* =========================================================
   GENERAL INQUIRY FORM
   ========================================================= */
function initGeneralForm() {
  const form = document.getElementById('general-form');
  if (!form) return;

  const nameEl    = document.getElementById('gen-name');
  const waEl      = document.getElementById('gen-whatsapp');
  const emailEl   = document.getElementById('gen-email');
  const messageEl = document.getElementById('gen-message');
  const submitBtn = document.getElementById('gen-submit');

  submitBtn.dataset.defaultText = submitBtn.querySelector('.btn-text').textContent;

  nameEl.addEventListener('blur',    () => validateRequired(nameEl,    document.getElementById('gen-name-error'),    'Full name'));
  waEl.addEventListener('blur',      () => validateWhatsapp(waEl,       document.getElementById('gen-whatsapp-error')));
  emailEl.addEventListener('blur',   () => validateEmail(emailEl,       document.getElementById('gen-email-error')));
  messageEl.addEventListener('blur', () => validateRequired(messageEl,  document.getElementById('gen-message-error'), 'Message'));

  waEl.addEventListener('input', () => { waEl.value = waEl.value.replace(/\D/g, ''); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormFeedback('gen-feedback');

    const valid = [
      validateRequired(nameEl,    document.getElementById('gen-name-error'),    'Full name'),
      validateWhatsapp(waEl,       document.getElementById('gen-whatsapp-error')),
      validateEmail(emailEl,       document.getElementById('gen-email-error')),
      validateRequired(messageEl,  document.getElementById('gen-message-error'), 'Message'),
    ].every(Boolean);

    if (!valid) return;

    setButtonLoading('gen-submit', true);

    try {
      const result = await postToSheet('general', {
        name:     nameEl.value.trim(),
        whatsapp: '+91' + waEl.value.trim(),
        email:    emailEl.value.trim(),
        message:  messageEl.value.trim(),
      });

      if (result.success) {
        showFormFeedback('gen-feedback', '🙏 Thank you for reaching out! We will respond within 24 hours.', 'success');
        form.reset();
        showToast('Message sent successfully!', 'success');
      } else {
        showFormFeedback('gen-feedback', result.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      console.error('General form error:', err);
      showFormFeedback('gen-feedback', '⚠️ Could not send message. Please check your connection and try again.', 'error');
    } finally {
      setButtonLoading('gen-submit', false);
    }
  });
}

/* =========================================================
   PROGRAM REGISTRATION FORM
   ========================================================= */
function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const nameEl    = document.getElementById('reg-name');
  const waEl      = document.getElementById('reg-whatsapp');
  const emailEl   = document.getElementById('reg-email');
  const programEl = document.getElementById('reg-program');
  const partsEl   = document.getElementById('reg-participants');
  const submitBtn = document.getElementById('reg-submit');

  submitBtn.dataset.defaultText = submitBtn.querySelector('.btn-text').textContent;

  nameEl.addEventListener('blur',    () => validateRequired(nameEl,    document.getElementById('reg-name-error'),         'Full name'));
  waEl.addEventListener('blur',      () => validateWhatsapp(waEl,       document.getElementById('reg-whatsapp-error')));
  emailEl.addEventListener('blur',   () => validateEmail(emailEl,       document.getElementById('reg-email-error')));
  programEl.addEventListener('blur', () => validateRequired(programEl,  document.getElementById('reg-program-error'),      'Program'));
  partsEl.addEventListener('blur',   () => validateRequired(partsEl,    document.getElementById('reg-participants-error'), 'Number of participants'));

  waEl.addEventListener('input', () => { waEl.value = waEl.value.replace(/\D/g, ''); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFormFeedback('reg-feedback');

    const valid = [
      validateRequired(nameEl,    document.getElementById('reg-name-error'),         'Full name'),
      validateWhatsapp(waEl,       document.getElementById('reg-whatsapp-error')),
      validateEmail(emailEl,       document.getElementById('reg-email-error')),
      validateRequired(programEl,  document.getElementById('reg-program-error'),      'Program'),
      validateRequired(partsEl,    document.getElementById('reg-participants-error'), 'Number of participants'),
    ].every(Boolean);

    if (!valid) return;

    setButtonLoading('reg-submit', true);

    try {
      const result = await postToSheet('registration', {
        name:         nameEl.value.trim(),
        whatsapp:     '+91' + waEl.value.trim(),
        email:        emailEl.value.trim(),
        program:      programEl.value,
        participants: partsEl.value,
        notes:        document.getElementById('reg-notes').value.trim(),
      });

      if (result.success) {
        showFormFeedback('reg-feedback', '🙏 Registration received! You will be contacted on WhatsApp for further details.', 'success');
        form.reset();
        showToast('Registered successfully!', 'success');
      } else {
        showFormFeedback('reg-feedback', result.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Register form error:', err);
      showFormFeedback('reg-feedback', '⚠️ Could not register. Please check your connection and try again.', 'error');
    } finally {
      setButtonLoading('reg-submit', false);
    }
  });
}

/* =========================================================
   TAB NAVIGATION (Contact section)
   ========================================================= */
function initFormTabs() {
  const tabs   = document.querySelectorAll('.forms-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.form;

      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => {
        p.classList.remove('active');
        p.hidden = true;
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('form-' + target);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;
      }
    });
  });
}

/**
 * Open the Registration tab and pre-select a program.
 * @param {string} programTitle
 */
function openRegisterTab(programTitle) {
  const regTab = document.querySelector('.forms-tab[data-form="register"]');
  if (regTab) regTab.click();

  const select = document.getElementById('reg-program');
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === programTitle) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* =========================================================
   FREQUENCY FILTER TABS
   ========================================================= */
function initFrequencyFilters() {
  const filterGroup = document.getElementById('frequency-filters');
  if (!filterGroup) return;

  filterGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;

    document.querySelectorAll('.filter-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFreq = btn.dataset.freq;
    renderPrograms();
  });
}

/* =========================================================
   REAL-TIME SEARCH
   ========================================================= */
function initSearch() {
  const input = document.getElementById('program-search');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentSearch = input.value;
      renderPrograms();
    }, 200);
  });
}

/* =========================================================
   STICKY NAVIGATION
   ========================================================= */
function initStickyNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );

  const hero = document.getElementById('hero');
  if (hero) observer.observe(hero);
}

/* =========================================================
   MOBILE NAV TOGGLE
   ========================================================= */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('open', !expanded);
  });

  // Close nav when any link is clicked
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
    }
  });
}

/* =========================================================
   FOOTER YEAR
   ========================================================= */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* =========================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
        const y = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

/* =========================================================
   BOOT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initStickyNav();
  initMobileNav();
  initSmoothScroll();
  initFrequencyFilters();
  initSearch();
  initFormTabs();
  initVolunteerForm();
  initGeneralForm();
  initRegisterForm();
  loadPrograms();
  loadVolunteerOpportunities();
});
