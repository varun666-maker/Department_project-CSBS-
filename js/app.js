// ===== CSBS Public App Logic =====

// Theme toggle
function initTheme() {
  const saved = localStorage.getItem('csbs_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('csbs_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
}

// Mobile nav
function toggleMobileNav() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

// Animate on scroll — reusable, observes new elements each call
let _scrollObserver;
function initScrollAnimations() {
  if (!_scrollObserver) {
    _scrollObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); _scrollObserver.unobserve(e.target); } });
    }, { threshold: 0.1 });
  }
  document.querySelectorAll('.animate-in:not(.visible)').forEach(el => _scrollObserver.observe(el));
}

// Animated counters — driven by real data
function animateCounters() {
  const counts = {
    'stat-students': (getData('students') || []).length,
    'stat-faculty': (getData('faculty') || []).length,
    'stat-events': (getData('events') || []).length,
    'stat-achievements': (getData('achievements') || []).length
  };
  Object.entries(counts).forEach(([id, target]) => {
    const el = document.getElementById(id);
    if (!el || !target) return;
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }, 16);
  });
}

// Format date
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getMonthDay(dateStr) {
  const d = new Date(dateStr);
  return { day: d.getDate(), month: d.toLocaleString('en', { month: 'short' }).toUpperCase() };
}

// ===== HOME PAGE =====
function renderHomeNotices() {
  const container = document.getElementById('home-notices');
  if (!container) return;
  const notices = (getData('notices') || []).slice(0, 3);
  container.innerHTML = notices.map(n => `
    <div class="card notice-card ${n.category === 'urgent' ? 'urgent' : ''} animate-in">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.5rem">
        <span class="notice-badge ${n.category}">${n.category}</span>
        <span class="notice-date">${formatDate(n.date)}</span>
      </div>
      <h3>${n.title}</h3>
      <p style="margin-top:.5rem">${n.content.substring(0, 120)}...</p>
    </div>
  `).join('');
  initScrollAnimations();
}

// ===== NOTICES PAGE =====
function renderNotices(filter = '') {
  const container = document.getElementById('notices-list');
  if (!container) return;
  let notices = getData('notices') || [];
  if (filter) notices = notices.filter(n => n.title.toLowerCase().includes(filter.toLowerCase()) || n.content.toLowerCase().includes(filter.toLowerCase()));
  if (!notices.length) { container.innerHTML = '<div class="empty-state"><div class="icon">📋</div><p>No notices found</p></div>'; return; }
  container.innerHTML = notices.map((n, i) => `
    <div class="card notice-card ${n.category === 'urgent' ? 'urgent' : ''} animate-in" style="animation-delay:${i * 0.1}s">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.75rem;flex-wrap:wrap;gap:.5rem">
        <span class="notice-badge ${n.category}">${n.category}</span>
        <span class="notice-date">📅 ${formatDate(n.date)} &nbsp;|&nbsp; ✍️ ${n.author || 'Admin'}</span>
      </div>
      <h3>${n.title}</h3>
      <p style="margin-top:.5rem">${n.content}</p>
    </div>
  `).join('');
  initScrollAnimations();
}

// ===== EVENTS PAGE =====
let _currentRegEventId = null;

function getCategoryLabel(cat) {
  const labels = { general: '<i class="bi bi-globe"></i> General', cultural: '<i class="bi bi-palette-fill"></i> Cultural', technical: '<i class="bi bi-laptop"></i> Technical', hackathon: '<i class="bi bi-rocket-takeoff"></i> Hackathon', workshop: '<i class="bi bi-wrench"></i> Workshop' };
  return labels[cat] || cat;
}

function renderEvents() {
  const container = document.getElementById('events-list');
  if (!container) return;
  const events = getData('events') || [];
  if (!events.length) { container.innerHTML = '<div class="empty-state"><div class="icon"><i class="bi bi-calendar-x"></i></div><p>No upcoming events</p></div>'; return; }
  container.innerHTML = events.map((e, i) => {
    const md = getMonthDay(e.date);
    const catClass = e.category || 'general';
    const feeHtml = e.entranceFee > 0 ? `<span class="event-fee-badge">₹${e.entranceFee}</span>` : (e.requiresRegistration ? '<span class="event-fee-badge free">Free</span>' : '');
    const regBtn = e.requiresRegistration ? `<button class="btn btn-primary btn-register" onclick="openRegistrationModal(${e.id})"><i class="bi bi-pencil-square"></i> Register Now</button>` : '';
    return `
    <div class="card event-card animate-in" style="animation-delay:${i * 0.1}s">
      <div class="card-header">
        <div class="event-date-box"><div class="day">${md.day}</div><div class="month">${md.month}</div></div>
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.25rem">
            <h3 style="margin:0">${e.title}</h3>
            <span class="event-category-badge ${catClass}">${getCategoryLabel(catClass)}</span>
            ${feeHtml}
          </div>
          <div class="event-meta"><span><i class="bi bi-clock"></i> ${e.time}</span><span><i class="bi bi-geo-alt-fill"></i> ${e.venue}</span></div>
        </div>
      </div>
      <p>${e.description}</p>
      <div class="event-card-footer">
        <span style="font-size:.85rem;color:var(--text-muted)">Organized by: ${e.organizer}</span>
        ${regBtn}
      </div>
    </div>`;
  }).join('');
  initScrollAnimations();
}

function openRegistrationModal(eventId) {
  const event = getItemById('events', eventId);
  if (!event) return;
  _currentRegEventId = eventId;
  const modal = document.getElementById('registration-modal');
  const title = document.getElementById('reg-modal-title');
  const body = document.getElementById('reg-modal-body');
  title.textContent = 'Register: ' + event.title;

  // Build form HTML
  let html = '<form id="reg-dynamic-form" onsubmit="return false">';

  // Always include base fields
  html += `
    <div class="form-group"><label>Full Name *</label>
      <input type="text" class="form-control" name="fullName" required placeholder="Enter your full name">
      <div class="form-error"></div></div>
    <div class="form-group"><label>USN *</label>
      <input type="text" class="form-control" name="usn" required placeholder="e.g. CSBS2301">
      <div class="form-error"></div></div>
    <div class="form-group"><label>Email Address *</label>
      <input type="email" class="form-control" name="email" required placeholder="you@example.com">
      <div class="form-error"></div></div>
    <div class="form-group"><label>Phone Number *</label>
      <input type="tel" class="form-control" name="phone" required placeholder="10-digit number">
      <div class="form-error"></div></div>`;

  // Dynamic fields from event config
  const fields = event.formFields || [];
  fields.forEach((f, idx) => {
    const req = f.required ? ' *' : '';
    const reqAttr = f.required ? ' required' : '';
    if (f.type === 'select' && f.options) {
      const opts = f.options.split(',').map(o => `<option value="${o.trim()}">${o.trim()}</option>`).join('');
      html += `<div class="form-group"><label>${f.label}${req}</label>
        <select class="form-control" name="custom_${idx}"${reqAttr}><option value="">-- Select --</option>${opts}</select>
        <div class="form-error"></div></div>`;
    } else if (f.type === 'textarea') {
      html += `<div class="form-group"><label>${f.label}${req}</label>
        <textarea class="form-control" name="custom_${idx}"${reqAttr} placeholder="${f.label}"></textarea>
        <div class="form-error"></div></div>`;
    } else {
      html += `<div class="form-group"><label>${f.label}${req}</label>
        <input type="text" class="form-control" name="custom_${idx}"${reqAttr} placeholder="${f.label}">
        <div class="form-error"></div></div>`;
    }
  });

  html += '</form>';

  // QR code section for paid events
  if (event.entranceFee > 0) {
    html += `
    <div class="qr-code-section">
      <div class="qr-header">
        <span class="qr-fee-label"><i class="bi bi-credit-card"></i> Entrance Fee: <strong>₹${event.entranceFee}</strong></span>
      </div>
      <div class="qr-body">
        ${event.qrCodeUrl ? `<img src="${event.qrCodeUrl}" alt="Payment QR" class="qr-image">` : '<div class="qr-placeholder"><span><i class="bi bi-qr-code" style="font-size:3rem"></i></span><p>Scan the QR code to pay</p><p style="font-size:.8rem;color:var(--text-muted)">QR code will be provided by the organizer</p></div>'}
        <p class="qr-instruction">Pay ₹${event.entranceFee} and take a screenshot of the transaction. You may be asked to verify payment later.</p>
      </div>
    </div>`;
  }

  body.innerHTML = html;
  modal.classList.add('active');
}

function submitRegistration() {
  const form = document.getElementById('reg-dynamic-form');
  if (!form || !_currentRegEventId) return;
  const event = getItemById('events', _currentRegEventId);
  if (!event) return;

  // Clear previous errors
  form.querySelectorAll('.form-error').forEach(e => e.classList.remove('show'));
  form.querySelectorAll('.form-control').forEach(e => e.classList.remove('error'));

  let valid = true;
  const data = { eventId: _currentRegEventId, eventTitle: event.title, registeredAt: new Date().toISOString() };

  // Validate base fields
  const nameInput = form.querySelector('[name="fullName"]');
  const usnInput = form.querySelector('[name="usn"]');
  const emailInput = form.querySelector('[name="email"]');
  const phoneInput = form.querySelector('[name="phone"]');

  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    showFieldError(nameInput, 'Enter a valid name (min 2 chars)'); valid = false;
  } else data.fullName = nameInput.value.trim();

  if (!usnInput.value.trim() || usnInput.value.trim().length < 4) {
    showFieldError(usnInput, 'Enter a valid USN'); valid = false;
  } else data.usn = usnInput.value.trim().toUpperCase();

  if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    showFieldError(emailInput, 'Enter a valid email'); valid = false;
  } else data.email = emailInput.value.trim();

  if (!phoneInput.value.trim() || !/^[0-9]{10}$/.test(phoneInput.value.replace(/\s/g, ''))) {
    showFieldError(phoneInput, 'Enter a valid 10-digit phone number'); valid = false;
  } else data.phone = phoneInput.value.trim();

  // Validate custom fields
  const fields = event.formFields || [];
  data.customFields = {};
  fields.forEach((f, idx) => {
    const input = form.querySelector(`[name="custom_${idx}"]`);
    if (input) {
      const val = input.value.trim();
      if (f.required && !val) { showFieldError(input, `${f.label} is required`); valid = false; }
      else data.customFields[f.label] = val;
    }
  });

  if (!valid) return;

  // Save registration
  const regs = getData('registrations') || [];
  data.id = regs.length ? Math.max(...regs.map(r => r.id)) + 1 : 1;
  regs.push(data);
  setData('registrations', regs);

  showToast('🎉 Registration successful! You are registered for ' + event.title, 'success');
  closeModal('registration-modal');
  _currentRegEventId = null;
}

function showFieldError(input, msg) {
  input.classList.add('error');
  const err = input.parentElement.querySelector('.form-error');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

// ===== FACULTY PAGE =====
function renderFaculty() {
  const container = document.getElementById('faculty-list');
  if (!container) return;
  const faculty = getData('faculty') || [];
  container.innerHTML = faculty.map((f, i) => `
    <div class="card faculty-card animate-in" style="animation-delay:${i * 0.1}s;cursor:pointer" onclick="showFacultyDetail(${f.id})">
      <div class="faculty-avatar">${f.name.split(' ').map(w => w[0]).join('').substring(0, 2)}</div>
      <h3 class="faculty-name">${f.name}</h3>
      <p class="faculty-designation">${f.designation}</p>
      <p class="faculty-dept">${f.specialization}</p>
    </div>
  `).join('');
  initScrollAnimations();
}

function showFacultyDetail(id) {
  const f = getItemById('faculty', id);
  if (!f) return;
  const modal = document.getElementById('faculty-modal');
  document.getElementById('faculty-detail').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem">
      <div class="faculty-avatar" style="width:80px;height:80px;font-size:1.8rem;margin:0 auto 1rem">${f.name.split(' ').map(w => w[0]).join('').substring(0, 2)}</div>
      <h2 style="font-size:1.3rem">${f.name}</h2>
      <p style="color:var(--primary);font-weight:600">${f.designation}</p>
    </div>
    <div style="display:grid;gap:.75rem">
      <div><strong>Qualification:</strong> ${f.qualification}</div>
      <div><strong>Specialization:</strong> ${f.specialization}</div>
      <div><strong>Experience:</strong> ${f.experience}</div>
      <div><strong>Email:</strong> ${f.email}</div>
      <div><strong>Phone:</strong> ${f.phone}</div>
    </div>`;
  modal.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

// ===== STUDENTS PAGE =====
function renderStudents(year = 0, filter = '') {
  const container = document.getElementById('students-list');
  if (!container) return;
  let students = getData('students') || [];
  if (year > 0) students = students.filter(s => +s.year === year);
  if (filter) students = students.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.rollNo.toLowerCase().includes(filter.toLowerCase()));
  if (!students.length) { container.innerHTML = '<div class="empty-state"><div class="icon">🎓</div><p>No students found</p></div>'; return; }
  container.innerHTML = '<div class="grid-3">' + students.map((s, i) => `
    <div class="card student-card animate-in" style="animation-delay:${i * 0.05}s">
      <div class="student-avatar">${s.name.split(' ').map(w => w[0]).join('').substring(0, 2)}</div>
      <div class="student-info">
        <h4>${s.name}</h4>
        <p style="color:var(--primary);font-weight:600">USN: ${s.rollNo}</p>
        <p>Year ${s.year} | Section ${s.section} | CGPA: ${s.cgpa}</p>
      </div>
    </div>
  `).join('') + '</div>';
  initScrollAnimations();
}

function setStudentYear(year, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = document.getElementById('student-search')?.value || '';
  renderStudents(year, filter);
}

// ===== ACHIEVEMENTS PAGE =====
function renderAchievements(type = 'all') {
  const container = document.getElementById('achievements-list');
  if (!container) return;
  let items = getData('achievements') || [];
  if (type !== 'all') items = items.filter(a => a.type === type);
  if (!items.length) { container.innerHTML = '<div class="empty-state"><div class="icon">🏆</div><p>No achievements found</p></div>'; return; }
  container.innerHTML = '<div class="grid-2">' + items.map((a, i) => `
    <div class="card achievement-card animate-in" style="animation-delay:${i * 0.1}s">
      <span class="achievement-type">${a.type}</span>
      <h3 style="margin-bottom:.5rem">${a.title}</h3>
      <p>${a.description}</p>
      <div style="margin-top:.75rem;display:flex;justify-content:space-between;font-size:.82rem;color:var(--text-muted)">
        <span>👤 ${a.person}</span>
        <span>📅 ${formatDate(a.date)}</span>
      </div>
    </div>
  `).join('') + '</div>';
  initScrollAnimations();
}

function setAchievementTab(type, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAchievements(type);
}

// ===== Toast =====
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollAnimations();
  // Page-specific
  if (document.getElementById('home-notices')) { renderHomeNotices(); animateCounters(); }
  if (document.getElementById('notices-list')) renderNotices();
  if (document.getElementById('events-list')) renderEvents();
  if (document.getElementById('faculty-list')) renderFaculty();
  if (document.getElementById('students-list')) renderStudents();
  if (document.getElementById('achievements-list')) renderAchievements();
});
