// ===== CSBS Admin Panel Logic =====

// Auth
function checkAuth() {
    if (!sessionStorage.getItem('csbs_admin_logged_in')) {
        window.location.href = 'login.html';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const err = document.getElementById('login-error');

    if (!user || !pass) { err.textContent = 'Please fill in all fields'; err.classList.add('show'); return; }
    try {
        await loginAdmin(user, pass);
        window.location.href = 'dashboard.html';
    } catch (error) {
        err.textContent = error.message || 'Invalid username or password';
        err.classList.add('show');
        document.getElementById('password').value = '';
    }
}

function logout() {
    sessionStorage.removeItem('csbs_admin_logged_in');
    sessionStorage.removeItem('csbs_admin_token');
    window.location.href = 'login.html';
}

// Dashboard
async function renderDashboard() {
    const [notices, events, faculty, students, achievements] = await Promise.all([
        getData('notices'), getData('events'), getData('faculty'), getData('students'), getData('achievements')
    ]);
    const counts = { notices: notices.length, events: events.length, faculty: faculty.length, students: students.length, achievements: achievements.length };
    document.querySelectorAll('.summary-card .card-data h3').forEach(el => {
        const key = el.dataset.key;
        if (key && counts[key] !== undefined) el.textContent = counts[key];
    });
}

// ===== Generic CRUD Renders =====
let editingId = null;
let currentEntity = '';

function openAddModal(entity) {
    editingId = null;
    currentEntity = entity;
    const modal = document.getElementById(entity + '-modal');
    const form = document.getElementById(entity + '-form');
    modal.querySelector('.modal-header h3').textContent = 'Add ' + capitalize(entity.replace(/s$/, ''));
    form.reset();
    modal.classList.add('active');
}

async function openEditModal(entity, id) {
    editingId = id;
    currentEntity = entity;
    const item = await getItemById(entity, id);
    if (!item) return;
    const modal = document.getElementById(entity + '-modal');
    modal.querySelector('.modal-header h3').textContent = 'Edit ' + capitalize(entity.replace(/s$/, ''));
    const form = document.getElementById(entity + '-form');
    // Set form values
    Object.keys(item).forEach(k => {
        const input = form.querySelector(`[name="${k}"]`);
        if (input) input.value = item[k];
    });
    modal.classList.add('active');
}

function closeAdminModal(entity) {
    document.getElementById(entity + '-modal')?.classList.remove('active');
    editingId = null;
}

async function handleSave(entity) {
    const form = document.getElementById(entity + '-form');
    const inputs = form.querySelectorAll('[name]');
    const data = {};
    let valid = true;

    form.querySelectorAll('.form-error').forEach(e => e.classList.remove('show'));
    form.querySelectorAll('.form-control').forEach(e => e.classList.remove('error'));

    inputs.forEach(input => {
        const val = input.value.trim();
        if (input.hasAttribute('required') && !val) {
            input.classList.add('error');
            const err = input.parentElement.querySelector('.form-error');
            if (err) { err.textContent = 'This field is required'; err.classList.add('show'); }
            valid = false;
        }
        data[input.name] = input.type === 'number' ? +val : val;
    });

    if (!valid) return;

    if (editingId) {
        await updateItem(entity, editingId, data);
        showToast(capitalize(entity.replace(/s$/, '')) + ' updated successfully!', 'success');
    } else {
        await addItem(entity, data);
        showToast(capitalize(entity.replace(/s$/, '')) + ' added successfully!', 'success');
    }
    closeAdminModal(entity);
    await renderAdminTable(entity);
}

async function handleDelete(entity, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await deleteItem(entity, id);
    showToast('Item deleted successfully', 'success');
    await renderAdminTable(entity);
}

// ===== Admin Table Renderers =====
async function renderAdminTable(entity) {
    const items = await getData(entity);
    const tbody = document.getElementById(entity + '-tbody');
    if (!tbody) return;

    if (!items.length) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:2rem;color:var(--text-muted)">No ${entity} found. Click "Add New" to create one.</td></tr>`;
        return;
    }

    switch (entity) {
        case 'notices':
            tbody.innerHTML = items.map(n => `<tr>
        <td><span class="notice-badge ${n.category}">${n.category}</span></td>
        <td><strong>${n.title}</strong></td>
        <td>${formatDate(n.date)}</td>
        <td>${n.author || '-'}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="openEditModal('notices','${n.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="handleDelete('notices','${n.id}')"><i class="bi bi-trash"></i></button>
        </td></tr>`).join('');
            break;
        case 'events':
            const regs = await getRegistrations();
            tbody.innerHTML = items.map(e => {
                const regCount = regs.filter(r => r.eventId === e.id).length;
                const catLabels = { general: '<i class="bi bi-globe"></i> General', cultural: '<i class="bi bi-palette-fill"></i> Cultural', technical: '<i class="bi bi-laptop"></i> Technical', hackathon: '<i class="bi bi-rocket-takeoff"></i> Hackathon', workshop: '<i class="bi bi-wrench"></i> Workshop' };
                const feeText = e.requiresRegistration ? (e.entranceFee > 0 ? `₹${e.entranceFee}` : 'Free') : '—';
                return `<tr>
        <td><strong>${e.title}</strong></td>
        <td><span class="event-category-badge ${e.category || 'general'}">${catLabels[e.category] || e.category}</span></td>
        <td>${formatDate(e.date)}</td>
        <td>${feeText}</td>
        <td>${e.requiresRegistration ? `<a href="#" onclick="viewRegistrations('${e.id}');return false" style="color:var(--primary);font-weight:600">${regCount} registered</a>` : '<span style="color:var(--text-muted)">N/A</span>'}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="openEditModal('events','${e.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="handleDelete('events','${e.id}')"><i class="bi bi-trash"></i></button>
        </td></tr>`;
            }).join('');
            break;
        case 'faculty':
            tbody.innerHTML = items.map(f => `<tr>
        <td><strong>${f.name}</strong></td>
        <td>${f.designation}</td>
        <td>${f.specialization}</td>
        <td>${f.experience}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="openEditModal('faculty','${f.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="handleDelete('faculty','${f.id}')"><i class="bi bi-trash"></i></button>
        </td></tr>`).join('');
            break;
        case 'students':
            tbody.innerHTML = items.map(s => `<tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.rollNo}</td><!-- USN -->
        <td>Year ${s.year}</td>
        <td>${s.section}</td>
        <td>${s.cgpa}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="openEditModal('students','${s.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="handleDelete('students','${s.id}')"><i class="bi bi-trash"></i></button>
        </td></tr>`).join('');
            break;
        case 'achievements':
            tbody.innerHTML = items.map(a => `<tr>
        <td><span class="achievement-type">${a.type}</span></td>
        <td><strong>${a.title}</strong></td>
        <td>${a.person}</td>
        <td>${formatDate(a.date)}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-outline" onclick="openEditModal('achievements','${a.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="handleDelete('achievements','${a.id}')"><i class="bi bi-trash"></i></button>
        </td></tr>`).join('');
            break;
    }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ===== Event-Specific Admin Functions =====

let _adminFormFields = []; // tracks custom form fields in the builder

function onCategoryChange(cat) {
    const regCheckbox = document.getElementById('evt-requires-reg');
    if (['technical', 'hackathon', 'workshop'].includes(cat)) {
        regCheckbox.checked = true;
        toggleRegFields(true);
    } else {
        regCheckbox.checked = false;
        toggleRegFields(false);
    }
}

function toggleRegFields(show) {
    const section = document.getElementById('reg-fields-section');
    if (section) section.style.display = show ? 'block' : 'none';
}

function toggleQrField(fee) {
    const qrGroup = document.getElementById('qr-field-group');
    if (qrGroup) qrGroup.style.display = fee > 0 ? 'block' : 'none';
}

function handleQrUpload(input) {
    const file = input.files[0];
    const preview = document.getElementById('qr-preview');
    const hidden = document.querySelector('[name="qrCodeUrl"]');
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        hidden.value = e.target.result;
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function addFormField(label = '', type = 'text', required = true, options = '') {
    _adminFormFields.push({ label, type, required, options });
    renderFormFields();
}

function removeFormField(index) {
    _adminFormFields.splice(index, 1);
    renderFormFields();
}

function renderFormFields() {
    const container = document.getElementById('form-fields-container');
    if (!container) return;
    if (!_adminFormFields.length) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:1rem;font-size:.85rem">No custom fields added yet. Click "+ Add Field" to add one.</p>';
        return;
    }
    container.innerHTML = _adminFormFields.map((f, i) => `
        <div class="form-field-row">
            <input type="text" class="form-control" value="${f.label}" placeholder="Field label" onchange="_adminFormFields[${i}].label=this.value" style="flex:2">
            <select class="form-control" onchange="_adminFormFields[${i}].type=this.value;document.getElementById('ff-opts-${i}').style.display=this.value==='select'?'block':'none'" style="flex:1">
                <option value="text"${f.type === 'text' ? ' selected' : ''}>Text</option>
                <option value="select"${f.type === 'select' ? ' selected' : ''}>Dropdown</option>
                <option value="textarea"${f.type === 'textarea' ? ' selected' : ''}>Textarea</option>
            </select>
            <label style="display:flex;align-items:center;gap:4px;font-size:.8rem;white-space:nowrap;cursor:pointer">
                <input type="checkbox" ${f.required ? 'checked' : ''} onchange="_adminFormFields[${i}].required=this.checked"> Req
            </label>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeFormField(${i})" style="padding:.3rem .6rem">✕</button>
            <div id="ff-opts-${i}" style="display:${f.type === 'select' ? 'block' : 'none'};grid-column:1/-1">
                <input type="text" class="form-control" value="${f.options || ''}" placeholder="Comma separated options (e.g. 1,2,3,4)" onchange="_adminFormFields[${i}].options=this.value" style="margin-top:.25rem;font-size:.85rem">
            </div>
        </div>
    `).join('');
}

async function handleEventSave() {
    const form = document.getElementById('events-form');
    const inputs = form.querySelectorAll('[name]');
    const data = {};
    let valid = true;

    form.querySelectorAll('.form-error').forEach(e => e.classList.remove('show'));
    form.querySelectorAll('.form-control').forEach(e => e.classList.remove('error'));

    inputs.forEach(input => {
        if (input.name === 'requiresRegistration') return; // handled separately
        const val = input.value.trim();
        if (input.hasAttribute('required') && !val) {
            input.classList.add('error');
            const err = input.parentElement.querySelector('.form-error');
            if (err) { err.textContent = 'This field is required'; err.classList.add('show'); }
            valid = false;
        }
        data[input.name] = input.type === 'number' ? +val : val;
    });

    if (!valid) return;

    // Collect registration-specific fields
    const regCheckbox = document.getElementById('evt-requires-reg');
    data.requiresRegistration = regCheckbox.checked;
    data.entranceFee = data.requiresRegistration ? +(data.entranceFee || 0) : 0;
    data.qrCodeUrl = data.requiresRegistration ? (data.qrCodeUrl || '') : '';
    data.formFields = data.requiresRegistration ? _adminFormFields.filter(f => f.label.trim()) : [];

    if (editingId) {
        await updateItem('events', editingId, data);
        showToast('Event updated successfully!', 'success');
    } else {
        await addItem('events', data);
        showToast('Event added successfully!', 'success');
    }
    closeAdminModal('events');
    await renderAdminTable('events');
}

// Override openEditModal for events to handle new fields
const _originalOpenEditModal = openEditModal;
openEditModal = async function (entity, id) {
    if (entity === 'events') {
        editingId = id;
        currentEntity = entity;
        const item = await getItemById(entity, id);
        if (!item) return;
        const modal = document.getElementById('events-modal');
        modal.querySelector('.modal-header h3').textContent = 'Edit Event';
        const form = document.getElementById('events-form');

        // Set regular form values
        Object.keys(item).forEach(k => {
            if (k === 'requiresRegistration' || k === 'formFields') return;
            const input = form.querySelector(`[name="${k}"]`);
            if (input) input.value = item[k];
        });

        // Set registration checkbox
        const regCheckbox = document.getElementById('evt-requires-reg');
        regCheckbox.checked = !!item.requiresRegistration;
        toggleRegFields(!!item.requiresRegistration);

        // Set fee & QR
        toggleQrField(item.entranceFee || 0);
        const qrPreview = document.getElementById('qr-preview');
        if (item.qrCodeUrl) {
            qrPreview.src = item.qrCodeUrl;
            qrPreview.style.display = 'block';
        } else {
            qrPreview.src = '';
            qrPreview.style.display = 'none';
        }

        // Load form fields into builder
        _adminFormFields = (item.formFields || []).map(f => ({ ...f }));
        renderFormFields();

        modal.classList.add('active');
    } else {
        await _originalOpenEditModal(entity, id);
    }
};

// Override openAddModal for events to reset form builder
const _originalOpenAddModal = openAddModal;
openAddModal = function (entity) {
    if (entity === 'events') {
        editingId = null;
        currentEntity = entity;
        const modal = document.getElementById('events-modal');
        modal.querySelector('.modal-header h3').textContent = 'Add Event';
        document.getElementById('events-form').reset();
        document.getElementById('evt-requires-reg').checked = false;
        toggleRegFields(false);
        toggleQrField(0);
        const qrPreview = document.getElementById('qr-preview');
        if (qrPreview) { qrPreview.src = ''; qrPreview.style.display = 'none'; }
        const qrHidden = document.querySelector('[name="qrCodeUrl"]');
        if (qrHidden) qrHidden.value = '';
        _adminFormFields = [];
        renderFormFields();
        modal.classList.add('active');
    } else {
        _originalOpenAddModal(entity);
    }
};

// ===== View Registrations =====
let _viewingEventId = null;

async function viewRegistrations(eventId) {
    _viewingEventId = eventId;
    const event = await getItemById('events', eventId);
    if (!event) return;
    const regs = await getRegistrations(eventId);
    const modal = document.getElementById('registrations-modal');
    document.getElementById('reg-view-title').textContent = 'Registrations: ' + event.title;

    if (!regs.length) {
        document.getElementById('reg-view-body').innerHTML = '<div class="empty-state"><div class="icon"><i class="bi bi-clipboard-x"></i></div><p>No registrations yet for this event.</p></div>';
    } else {
        // Build custom field columns from event formFields
        const customCols = (event.formFields || []).map(f => f.label);
        let tableHtml = '<div style="overflow-x:auto"><table class="data-table"><thead><tr>';
        tableHtml += '<th>#</th><th>Name</th><th>USN</th><th>Email</th><th>Phone</th>';
        customCols.forEach(c => tableHtml += `<th>${c}</th>`);
        tableHtml += '<th>Date</th><th>Action</th></tr></thead><tbody>';
        regs.forEach((r, i) => {
            tableHtml += `<tr><td>${i + 1}</td><td>${r.fullName}</td><td>${r.usn || '—'}</td><td>${r.email}</td><td>${r.phone}</td>`;
            customCols.forEach(c => tableHtml += `<td>${(r.customFields && r.customFields[c]) || '—'}</td>`);
            tableHtml += `<td>${formatDate(r.registeredAt)}</td>`;
            tableHtml += `<td><button class="btn btn-sm btn-danger" onclick="deleteRegistration('${r.id}')"><i class="bi bi-trash"></i></button></td></tr>`;
        });
        tableHtml += '</tbody></table></div>';
        tableHtml += `<p style="margin-top:1rem;font-size:.85rem;color:var(--text-muted)">Total: <strong>${regs.length}</strong> registration(s)</p>`;
        document.getElementById('reg-view-body').innerHTML = tableHtml;
    }
    modal.classList.add('active');
}

function closeRegModal() {
    document.getElementById('registrations-modal')?.classList.remove('active');
    _viewingEventId = null;
}

async function deleteRegistration(regId) {
    if (!confirm('Delete this registration?')) return;
    await deleteRegistrationApi(regId);
    showToast('Registration deleted', 'success');
    if (_viewingEventId) await viewRegistrations(_viewingEventId);
    await renderAdminTable('events');
}

async function exportRegistrations() {
    if (!_viewingEventId) return;
    const event = await getItemById('events', _viewingEventId);
    const regs = await getRegistrations(_viewingEventId);
    if (!regs.length) { showToast('No registrations to export', 'error'); return; }

    const customCols = (event.formFields || []).map(f => f.label);
    let csv = 'Name,USN,Email,Phone,' + customCols.join(',') + ',Registered Date\n';
    regs.forEach(r => {
        csv += `"${r.fullName}","${r.usn || ''}","${r.email}","${r.phone}",`;
        customCols.forEach(c => csv += `"${(r.customFields && r.customFields[c]) || ''}",`);
        csv += `"${r.registeredAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_${event.title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success');
}

// Toggle admin sidebar on mobile
function toggleAdminSidebar() {
    document.querySelector('.admin-sidebar')?.classList.toggle('open');
}

// Init Admin
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    // Check auth on all admin pages except login
    if (!window.location.pathname.includes('login')) checkAuth();
    if (document.getElementById('notices-tbody')) await renderAdminTable('notices');
    if (document.getElementById('events-tbody')) await renderAdminTable('events');
    if (document.getElementById('faculty-tbody')) await renderAdminTable('faculty');
    if (document.getElementById('students-tbody')) await renderAdminTable('students');
    if (document.getElementById('achievements-tbody')) await renderAdminTable('achievements');
    if (document.querySelector('.summary-card')) await renderDashboard();
    // Init form builder if on events page
    if (document.getElementById('form-fields-container')) renderFormFields();
});
