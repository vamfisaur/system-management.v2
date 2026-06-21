// ============================================
// Bright Future Academy - School Management System
// Complete Application Logic
// ============================================

const DataStore = {
    init() {
        if (!localStorage.getItem('sms_initialized')) {
            this.resetToDefaults();
        }
    },

    resetToDefaults() {
        const defaultAdmin = {
            id: 'A001', password: 'adminpass', name: 'System Administrator',
            department: 'Administration', email: 'admin@school.edu'
        };
        const defaultSchool = {
            name: 'Bright Future Academy', address: '123 Education Lane, Knowledge City',
            phone: '(555) 123-4567', email: 'info@school.edu',
            principal: 'Dr. Principal', established: '2020',
            motto: 'Learning for the Future', logo: null
        };
        localStorage.setItem('sms_admins', JSON.stringify([defaultAdmin]));
        localStorage.setItem('sms_students', JSON.stringify([]));
        localStorage.setItem('sms_reports', JSON.stringify([]));
        localStorage.setItem('sms_grades', JSON.stringify([]));
        localStorage.setItem('sms_messages', JSON.stringify([]));
        localStorage.setItem('sms_calendar', JSON.stringify([]));
        localStorage.setItem('sms_school', JSON.stringify(defaultSchool));
        localStorage.setItem('sms_reportCounter', '1000');
        localStorage.setItem('sms_gradeCounter', '0');
        localStorage.setItem('sms_messageCounter', '0');
        localStorage.setItem('sms_initialized', 'true');
    },

    getStudents() { return JSON.parse(localStorage.getItem('sms_students') || '[]'); },
    setStudents(v) { localStorage.setItem('sms_students', JSON.stringify(v)); },
    getAdmins() { return JSON.parse(localStorage.getItem('sms_admins') || '[]'); },
    setAdmins(v) { localStorage.setItem('sms_admins', JSON.stringify(v)); },
    getReports() { return JSON.parse(localStorage.getItem('sms_reports') || '[]'); },
    setReports(v) { localStorage.setItem('sms_reports', JSON.stringify(v)); },
    getGrades() { return JSON.parse(localStorage.getItem('sms_grades') || '[]'); },
    setGrades(v) { localStorage.setItem('sms_grades', JSON.stringify(v)); },
    getMessages() { return JSON.parse(localStorage.getItem('sms_messages') || '[]'); },
    setMessages(v) { localStorage.setItem('sms_messages', JSON.stringify(v)); },
    getCalendar() { return JSON.parse(localStorage.getItem('sms_calendar') || '[]'); },
    setCalendar(v) { localStorage.setItem('sms_calendar', JSON.stringify(v)); },
    getSchool() { return JSON.parse(localStorage.getItem('sms_school') || '{}'); },
    setSchool(v) { localStorage.setItem('sms_school', JSON.stringify(v)); },
    getReportCounter() { return parseInt(localStorage.getItem('sms_reportCounter') || '1000'); },
    setReportCounter(v) { localStorage.setItem('sms_reportCounter', String(v)); },
    getGradeCounter() { return parseInt(localStorage.getItem('sms_gradeCounter') || '0'); },
    setGradeCounter(v) { localStorage.setItem('sms_gradeCounter', String(v)); },
    getMessageCounter() { return parseInt(localStorage.getItem('sms_messageCounter') || '0'); },
    setMessageCounter(v) { localStorage.setItem('sms_messageCounter', String(v)); },
    getCurrentUser() { return JSON.parse(localStorage.getItem('sms_currentUser') || 'null'); },
    setCurrentUser(v) { localStorage.setItem('sms_currentUser', JSON.stringify(v)); },
    clearCurrentUser() { localStorage.removeItem('sms_currentUser'); }
};

// ==================== TOAST ====================
function showToast(msg, type='success') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
    t.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span class="toast-message">${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// ==================== VIEW SYSTEM ====================
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ==================== SCHOOL BRANDING ====================
function renderLoginBranding() {
    const school = DataStore.getSchool();
    document.getElementById('login-school-name').textContent = school.name;
    document.getElementById('login-school-motto').textContent = school.motto || 'Excellence in Education';
    document.getElementById('page-title').textContent = school.name;
    const img = document.getElementById('login-logo');
    const fallback = document.getElementById('login-logo-fallback');
    if (school.logo) { img.src = school.logo; img.style.display = 'block'; fallback.style.display = 'none'; }
    else { img.style.display = 'none'; fallback.style.display = 'flex'; }
}

function renderSidebarLogo(prefix) {
    const school = DataStore.getSchool();
    const img = document.getElementById(`${prefix}-logo`);
    const fallback = document.getElementById(`${prefix}-logo-fallback`);
    const nameEl = document.getElementById(`${prefix}-sidebar-school-name`);
    if (nameEl) nameEl.textContent = school.name.substring(0, 12) + (school.name.length > 12 ? '..' : '');
    if (school.logo) { img.src = school.logo; img.style.display = 'block'; fallback.style.display = 'none'; }
    else { img.style.display = 'none'; fallback.style.display = 'flex'; }
}

// ==================== LOGIN ====================
let selectedRole = 'student';

function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.toggle('active', b.dataset.role === role));
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') { input.type = 'text'; icon.classList.replace('fa-eye', 'fa-eye-slash'); }
    else { input.type = 'password'; icon.classList.replace('fa-eye-slash', 'fa-eye'); }
}

function handleLogin() {
    const id = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;
    if (!id || !password) { showToast('Please enter both ID and password', 'warning'); return; }

    if (selectedRole === 'student') {
        const students = DataStore.getStudents();
        const student = students.find(s => s.id === id && s.password === password);
        if (student) {
            DataStore.setCurrentUser({ ...student, role: 'student' });
            showToast(`Welcome, ${student.name}!`, 'success');
            showView('student-view');
            initStudentDashboard();
        } else { showToast('Invalid student ID or password', 'error'); }
    } else {
        const admins = DataStore.getAdmins();
        const admin = admins.find(a => a.id === id && a.password === password);
        if (admin) {
            DataStore.setCurrentUser({ ...admin, role: 'admin' });
            showToast(`Welcome, ${admin.name}!`, 'success');
            showView('admin-view');
            initAdminDashboard();
        } else { showToast('Invalid admin ID or password', 'error'); }
    }
}

function logout() {
    DataStore.clearCurrentUser();
    document.getElementById('login-id').value = '';
    document.getElementById('login-password').value = '';
    showView('login-view');
    renderLoginBranding();
    showToast('Logged out successfully', 'info');
}

// ==================== FORGOT PASSWORD ====================
function showForgotPassword() { document.getElementById('forgot-password-modal').classList.add('active'); }
function closeForgotPassword() {
    document.getElementById('forgot-password-modal').classList.remove('active');
    document.getElementById('forgot-id').value = '';
    document.getElementById('forgot-new-password').value = '';
    document.getElementById('forgot-confirm-password').value = '';
}
function handleForgotPassword() {
    const role = document.getElementById('forgot-role').value;
    const id = document.getElementById('forgot-id').value.trim();
    const newPass = document.getElementById('forgot-new-password').value;
    const confirmPass = document.getElementById('forgot-confirm-password').value;
    if (!id || !newPass || !confirmPass) { showToast('Please fill in all fields', 'warning'); return; }
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }
    if (role === 'student') {
        const students = DataStore.getStudents();
        const s = students.find(x => x.id === id);
        if (!s) { showToast('Student ID not found', 'error'); return; }
        s.password = newPass; DataStore.setStudents(students);
    } else {
        const admins = DataStore.getAdmins();
        const a = admins.find(x => x.id === id);
        if (!a) { showToast('Admin ID not found', 'error'); return; }
        a.password = newPass; DataStore.setAdmins(admins);
    }
    showToast('Password reset successfully!', 'success');
    closeForgotPassword();
}

// ==================== SIDEBAR TOGGLE ====================
function toggleStudentSidebar() { document.getElementById('student-sidebar').classList.toggle('open'); }
function toggleAdminSidebar() { document.getElementById('admin-sidebar').classList.toggle('open'); }

// ==================== STUDENT DASHBOARD ====================
let currentStudent = null;

function initStudentDashboard() {
    currentStudent = DataStore.getCurrentUser();
    if (!currentStudent || currentStudent.role !== 'student') return;
    renderSidebarLogo('student');
    document.getElementById('student-sidebar-name').textContent = currentStudent.name;
    document.getElementById('student-sidebar-id').textContent = currentStudent.id;
    document.getElementById('student-avatar').textContent = currentStudent.name.charAt(0).toUpperCase();
    updateInboxBadge();
    showStudentSection('profile');
}

function showStudentSection(section) {
    document.querySelectorAll('#student-view .section').forEach(s => s.classList.remove('active'));
    document.getElementById(`student-${section}-section`).classList.add('active');
    const titles = { profile: 'My Profile', calendar: 'School Calendar', grades: 'My Grades', report: 'Report Lost Item', 'my-reports': 'My Reports', inbox: 'Inbox' };
    document.getElementById('student-page-title').textContent = titles[section] || '';
    document.querySelectorAll('#student-view .nav-item').forEach((item, i) => {
        const map = ['profile', 'calendar', 'grades', 'report', 'my-reports', 'inbox'];
        item.classList.toggle('active', map[i] === section);
    });
    document.getElementById('student-sidebar').classList.remove('open');

    if (section === 'profile') renderStudentProfile();
    else if (section === 'calendar') renderStudentCalendar();
    else if (section === 'grades') renderStudentGrades();
    else if (section === 'my-reports') renderStudentReports();
    else if (section === 'inbox') { markInboxRead(); renderStudentInbox(); }
}

function renderStudentProfile() {
    const s = currentStudent;
    document.getElementById('student-profile-avatar').textContent = s.name.charAt(0).toUpperCase();
    document.getElementById('student-profile-name').textContent = s.name;
    document.getElementById('student-profile-course').textContent = `${s.course} - ${s.yearLevel}`;
    const paid = s.tuition - s.balance;
    const pct = s.tuition > 0 ? (paid / s.tuition) * 100 : 0;
    const status = s.balance === 0 ? 'Fully Paid' : 'Outstanding Balance';
    const sc = s.balance === 0 ? 'var(--success)' : 'var(--danger)';
    const grid = document.getElementById('student-profile-details');
    grid.innerHTML = `
        <div class="profile-field"><span class="profile-field-label">Student ID</span><span class="profile-field-value">${s.id}</span></div>
        <div class="profile-field"><span class="profile-field-label">Full Name</span><span class="profile-field-value">${s.name}</span></div>
        <div class="profile-field"><span class="profile-field-label">Course</span><span class="profile-field-value">${s.course}</span></div>
        <div class="profile-field"><span class="profile-field-label">Year Level</span><span class="profile-field-value">${s.yearLevel}</span></div>
        <div class="profile-field"><span class="profile-field-label">Email</span><span class="profile-field-value">${s.email || 'N/A'}</span></div>
        <div class="profile-field"><span class="profile-field-label">Enrollment Date</span><span class="profile-field-value">${s.enrollmentDate || 'N/A'}</span></div>
        <div class="profile-field"><span class="profile-field-label">Tuition</span><span class="profile-field-value">$${(s.tuition || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span></div>
        <div class="profile-field"><span class="profile-field-label">Balance</span><span class="profile-field-value" style="color:${s.balance > 0 ? 'var(--danger)' : 'var(--success)'}">$${(s.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</span></div>
        <div class="profile-field" style="grid-column:1/-1"><span class="profile-field-label">Payment Status</span><span class="profile-field-value" style="color:${sc}">${status}</span></div>
        <div class="profile-field" style="grid-column:1/-1">
            <span class="profile-field-label">Payment Progress</span>
            <div style="background:var(--border);border-radius:8px;height:10px;margin-top:8px;overflow:hidden;">
                <div style="background:linear-gradient(90deg,var(--success),var(--success-light));height:100%;width:${pct}%;border-radius:8px;transition:width 0.6s ease;"></div>
            </div>
            <span style="font-size:0.75rem;color:var(--secondary);margin-top:4px;display:block;text-align:center;">${pct.toFixed(1)}% Paid</span>
        </div>
    `;
}

function renderStudentCalendar() {
    const events = DataStore.getCalendar();
    const container = document.getElementById('student-calendar-events');
    if (events.length === 0) { container.innerHTML = `<div class="empty-state"><i class="fas fa-calendar"></i><h4>No Events</h4><p>Check back later for calendar updates.</p></div>`; return; }
    container.innerHTML = events.map(e => {
        const parts = e.split(' - ');
        return `<div class="calendar-event"><span class="event-date">${parts[0]}</span><span class="event-desc">${parts[1] || ''}</span></div>`;
    }).join('');
}

function renderStudentGrades() {
    const grades = DataStore.getGrades().filter(g => g.studentId === currentStudent.id);
    const tbody = document.getElementById('student-grades-table');
    const empty = document.getElementById('student-grades-empty');
    const summary = document.getElementById('student-grade-summary');
    const tableContainer = document.querySelector('#student-grades-section .grade-table-container');

    if (grades.length === 0) {
        if (tableContainer) tableContainer.style.display = 'none';
        summary.innerHTML = ''; empty.style.display = 'block'; return;
    }
    if (tableContainer) tableContainer.style.display = 'block';
    empty.style.display = 'none';

    const passed = grades.filter(g => g.grade >= 3.0).length;
    const failed = grades.length - passed;
    const avg = grades.length > 0 ? (grades.reduce((a, b) => a + b.grade, 0) / grades.length).toFixed(2) : '0.00';
    const avgPct = (parseFloat(avg) / 5.0 * 100).toFixed(1);

    summary.innerHTML = `
        <div class="grade-summary-card"><div class="value" style="color:var(--primary)">${grades.length}</div><div class="label">Total Subjects</div></div>
        <div class="grade-summary-card"><div class="value" style="color:${parseFloat(avg) >= 3.0 ? 'var(--success)' : 'var(--danger)'}">${avg}</div><div class="label">Average Grade (${avgPct}%)</div></div>
        <div class="grade-summary-card"><div class="value" style="color:var(--success)">${passed}</div><div class="label">Passed</div></div>
    `;

    tbody.innerHTML = grades.map(g => {
        const pct = (g.grade / 5.0 * 100).toFixed(1);
        const isPass = g.grade >= 3.0;
        return `<tr>
            <td><strong>${g.subject}</strong></td>
            <td class="grade-value" style="color:${isPass ? 'var(--success)' : 'var(--danger)'}">${g.grade.toFixed(1)}</td>
            <td>${pct}%</td>
            <td>${g.semester}</td>
            <td>${g.year}</td>
            <td class="${isPass ? 'grade-pass' : 'grade-fail'}">${isPass ? 'Passed' : 'Failed'}</td>
        </tr>`;
    }).join('');
}

function submitReport() {
    const itemName = document.getElementById('report-item-name').value.trim();
    const itemType = document.getElementById('report-item-type').value;
    const lostDate = document.getElementById('report-lost-date').value;
    const location = document.getElementById('report-location').value.trim();
    const description = document.getElementById('report-description').value.trim();
    if (!itemName || !itemType || !lostDate || !location) { showToast('Please fill in all required fields', 'warning'); return; }

    const counter = DataStore.getReportCounter() + 1;
    DataStore.setReportCounter(counter);
    const now = new Date();
    const submittedAt = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const report = { reportId: counter, studentId: currentStudent.id, studentName: currentStudent.name, itemName, itemType, lostDate, lostLocation: location, description, status: 'PENDING', adminResponse: '', submittedAt };
    const reports = DataStore.getReports(); reports.push(report); DataStore.setReports(reports);
    showToast(`Report #${counter} submitted!`, 'success');
    document.getElementById('report-item-name').value = '';
    document.getElementById('report-item-type').value = '';
    document.getElementById('report-lost-date').value = '';
    document.getElementById('report-location').value = '';
    document.getElementById('report-description').value = '';
}

function renderStudentReports() {
    const reports = DataStore.getReports().filter(r => r.studentId === currentStudent.id).reverse();
    const container = document.getElementById('student-reports-list');
    if (reports.length === 0) { container.innerHTML = `<div class="empty-state"><i class="fas fa-clipboard-list"></i><h4>No Reports</h4><p>You haven't submitted any reports yet.</p></div>`; return; }
    container.innerHTML = reports.map(r => {
        const sc = r.status === 'FOUND' ? 'status-found' : r.status === 'NOT_FOUND' ? 'status-notfound' : 'status-pending';
        const st = r.status === 'FOUND' ? 'Found' : r.status === 'NOT_FOUND' ? 'Not Found' : 'Pending';
        const resp = r.adminResponse
            ? `<div class="report-card-footer"><div class="report-response-label"><i class="fas fa-reply"></i> Admin Response</div><div class="report-response-text">${r.adminResponse}</div></div>`
            : `<div class="report-card-footer"><div class="report-no-response"><i class="fas fa-clock"></i> No response yet. We'll update you soon.</div></div>`;
        return `<div class="report-card">
            <div class="report-card-header">
                <div class="report-card-title"><h4>#${r.reportId} - ${r.itemName}</h4><span class="report-type-badge">${r.itemType}</span></div>
                <span class="report-status-badge ${sc}">${st}</span>
            </div>
            <div class="report-card-body">
                <div class="report-detail-item"><span class="report-detail-label">Date Lost</span><span class="report-detail-value">${r.lostDate}</span></div>
                <div class="report-detail-item"><span class="report-detail-label">Location</span><span class="report-detail-value">${r.lostLocation}</span></div>
                <div class="report-detail-item"><span class="report-detail-label">Description</span><span class="report-detail-value">${r.description || 'N/A'}</span></div>
            </div>
            ${resp}
            <div class="report-card-meta"><i class="far fa-clock"></i> Submitted on ${r.submittedAt}</div>
        </div>`;
    }).join('');
}

// ==================== INBOX ====================
function updateInboxBadge() {
    if (!currentStudent) return;
    const messages = DataStore.getMessages().filter(m => m.toId === currentStudent.id && !m.read);
    const badge = document.getElementById('student-inbox-badge');
    if (messages.length > 0) { badge.textContent = messages.length; badge.style.display = 'inline-block'; }
    else { badge.style.display = 'none'; }
}

function markInboxRead() {
    const messages = DataStore.getMessages();
    let changed = false;
    messages.forEach(m => { if (m.toId === currentStudent.id && !m.read) { m.read = true; changed = true; } });
    if (changed) DataStore.setMessages(messages);
    updateInboxBadge();
}

function renderStudentInbox() {
    const messages = DataStore.getMessages().filter(m => m.toId === currentStudent.id).sort((a, b) => b.id - a.id);
    const container = document.getElementById('student-inbox-list');
    const empty = document.getElementById('student-inbox-empty');
    if (messages.length === 0) { container.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    container.innerHTML = messages.map(m => {
        const cls = m.read ? 'read' : 'unread';
        return `<div class="message-card ${cls}" onclick="viewMessage(${m.id})">
            <div class="message-header">
                <div class="message-sender"><i class="fas fa-user-shield"></i> ${m.fromName}</div>
                <div class="message-date">${m.sentAt}</div>
            </div>
            <div class="message-subject">${m.subject}</div>
            <div class="message-preview">${m.body}</div>
            ${!m.read ? '<div class="message-unread-dot"></div>' : ''}
        </div>`;
    }).join('');
}

function viewMessage(id) {
    const messages = DataStore.getMessages();
    const m = messages.find(x => x.id === id);
    if (!m) return;
    m.read = true; DataStore.setMessages(messages);
    updateInboxBadge();
    const body = document.getElementById('view-message-body');
    body.innerHTML = `
        <div class="message-detail-header">
            <div class="message-detail-subject">${m.subject}</div>
            <div class="message-detail-meta">
                <span><i class="fas fa-user-shield"></i> From: ${m.fromName}</span>
                <span><i class="far fa-clock"></i> ${m.sentAt}</span>
            </div>
        </div>
        <div class="message-detail-body">${m.body}</div>
    `;
    document.getElementById('view-message-modal').classList.add('active');
}

function closeViewMessageModal() { document.getElementById('view-message-modal').classList.remove('active'); }

// ==================== ADMIN DASHBOARD ====================
let currentAdmin = null;
let editingStudentId = null;
let editingAdminId = null;
let editingReportId = null;

function initAdminDashboard() {
    currentAdmin = DataStore.getCurrentUser();
    if (!currentAdmin || currentAdmin.role !== 'admin') return;
    renderSidebarLogo('admin');
    document.getElementById('admin-sidebar-name').textContent = currentAdmin.name;
    document.getElementById('admin-sidebar-id').textContent = currentAdmin.id;
    document.getElementById('admin-avatar').textContent = currentAdmin.name.charAt(0).toUpperCase();
    showAdminSection('dashboard');
}

function showAdminSection(section) {
    document.querySelectorAll('#admin-view .section').forEach(s => s.classList.remove('active'));
    document.getElementById(`admin-${section}-section`).classList.add('active');
    const titles = { dashboard: 'Dashboard', students: 'Students', admins: 'Admins', grades: 'Grades', messages: 'Messages', reports: 'Lost & Found', calendar: 'Calendar', school: 'School Details', profile: 'My Profile' };
    document.getElementById('admin-page-title').textContent = titles[section] || '';
    document.querySelectorAll('#admin-view .nav-item').forEach((item, i) => {
        const map = ['dashboard', 'students', 'admins', 'grades', 'messages', 'reports', 'calendar', 'school', 'profile'];
        item.classList.toggle('active', map[i] === section);
    });
    document.getElementById('admin-sidebar').classList.remove('open');

    if (section === 'dashboard') renderAdminDashboard();
    else if (section === 'students') renderStudentsTable();
    else if (section === 'admins') renderAdminsTable();
    else if (section === 'grades') { populateGradeStudentDropdown(); renderGradesTable(); }
    else if (section === 'messages') { populateMessageStudentDropdown(); renderSentMessages(); }
    else if (section === 'reports') renderReportsTable();
    else if (section === 'calendar') renderAdminCalendar();
    else if (section === 'school') renderSchoolEdit();
    else if (section === 'profile') renderAdminProfile();
}

function renderAdminDashboard() {
    const students = DataStore.getStudents();
    const reports = DataStore.getReports();
    const messages = DataStore.getMessages();
    const pending = reports.filter(r => r.status === 'PENDING').length;
    document.getElementById('admin-stat-students').textContent = students.length;
    document.getElementById('admin-stat-reports').textContent = reports.length;
    document.getElementById('admin-stat-pending').textContent = pending;
    document.getElementById('admin-stat-messages').textContent = messages.length;

    const school = DataStore.getSchool();
    document.getElementById('admin-dashboard-school-info').innerHTML = `
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${school.name}</span></div>
        <div class="info-row"><span class="info-label">Address</span><span class="info-value">${school.address}</span></div>
        <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${school.phone}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${school.email}</span></div>
        <div class="info-row"><span class="info-label">Principal</span><span class="info-value">${school.principal}</span></div>
    `;
    document.getElementById('admin-dashboard-profile-info').innerHTML = `
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${currentAdmin.name}</span></div>
        <div class="info-row"><span class="info-label">ID</span><span class="info-value">${currentAdmin.id}</span></div>
        <div class="info-row"><span class="info-label">Department</span><span class="info-value">${currentAdmin.department}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${currentAdmin.email}</span></div>
    `;
}

// ==================== STUDENT MANAGEMENT ====================
function renderStudentsTable() {
    const students = DataStore.getStudents();
    const tbody = document.getElementById('students-table-body');
    const empty = document.getElementById('students-empty');
    const table = document.querySelector('#admin-students-section .table-responsive');
    if (students.length === 0) { if (table) table.style.display = 'none'; empty.style.display = 'block'; return; }
    if (table) table.style.display = 'block'; empty.style.display = 'none';
    tbody.innerHTML = students.map(s => `
        <tr><td><strong>${s.id}</strong></td><td>${s.name}</td><td><span class="report-type-badge">${s.course}</span></td><td>${s.yearLevel}</td><td>${s.email || 'N/A'}</td><td style="color:${s.balance > 0 ? 'var(--danger)' : 'var(--success)'};font-weight:600;">$${(s.balance || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</td><td><div class="table-actions"><button class="btn btn-primary" onclick="editStudent('${s.id}')"><i class="fas fa-edit"></i></button></div></td></tr>
    `).join('');
}

function searchStudents() {
    const query = document.getElementById('student-search').value.toLowerCase();
    document.querySelectorAll('#students-table-body tr').forEach(row => { row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none'; });
}

function showCreateStudentModal() { document.getElementById('create-student-modal').classList.add('active'); }
function closeCreateStudentModal() { document.getElementById('create-student-modal').classList.remove('active'); }

function createStudent() {
    const id = document.getElementById('new-student-id').value.trim();
    const name = document.getElementById('new-student-name').value.trim();
    const password = document.getElementById('new-student-password').value;
    const course = document.getElementById('new-student-course').value.trim();
    const yearLevel = document.getElementById('new-student-year').value;
    const email = document.getElementById('new-student-email').value.trim();
    const tuition = parseFloat(document.getElementById('new-student-tuition').value) || 0;
    const balance = parseFloat(document.getElementById('new-student-balance').value) || 0;
    if (!id || !name || !password || !course || !yearLevel) { showToast('Please fill in all required fields', 'warning'); return; }
    const students = DataStore.getStudents();
    if (students.find(s => s.id === id)) { showToast('Student ID already exists', 'error'); return; }
    const today = new Date().toISOString().split('T')[0];
    students.push({ id, password, name, course, yearLevel, email, enrollmentDate: today, tuition, balance });
    DataStore.setStudents(students);
    showToast('Student created successfully!', 'success');
    closeCreateStudentModal();
    document.getElementById('new-student-id').value = '';
    document.getElementById('new-student-name').value = '';
    document.getElementById('new-student-password').value = '';
    document.getElementById('new-student-course').value = '';
    document.getElementById('new-student-email').value = '';
    document.getElementById('new-student-tuition').value = '';
    document.getElementById('new-student-balance').value = '';
    renderStudentsTable();
}

function editStudent(id) {
    const students = DataStore.getStudents();
    const s = students.find(x => x.id === id);
    if (!s) return;
    editingStudentId = id;
    document.getElementById('edit-student-id').value = s.id;
    document.getElementById('edit-student-name').value = s.name;
    document.getElementById('edit-student-password').value = '';
    document.getElementById('edit-student-course').value = s.course;
    document.getElementById('edit-student-year').value = s.yearLevel;
    document.getElementById('edit-student-email').value = s.email || '';
    document.getElementById('edit-student-tuition').value = s.tuition || '';
    document.getElementById('edit-student-balance').value = s.balance || '';
    document.getElementById('edit-student-enrollment').value = s.enrollmentDate || '';
    document.getElementById('edit-student-modal').classList.add('active');
}

function closeEditStudentModal() { document.getElementById('edit-student-modal').classList.remove('active'); editingStudentId = null; }

function saveStudentEdit() {
    if (!editingStudentId) return;
    const students = DataStore.getStudents();
    const s = students.find(x => x.id === editingStudentId);
    if (!s) return;
    const newId = document.getElementById('edit-student-id').value.trim();
    const newName = document.getElementById('edit-student-name').value.trim();
    const newPass = document.getElementById('edit-student-password').value;
    if (!newId || !newName) { showToast('ID and Name are required', 'warning'); return; }
    if (newId !== editingStudentId && students.find(x => x.id === newId)) { showToast('Student ID already exists', 'error'); return; }
    if (newId !== editingStudentId) {
        const reports = DataStore.getReports(); reports.forEach(r => { if (r.studentId === editingStudentId) r.studentId = newId; }); DataStore.setReports(reports);
        const grades = DataStore.getGrades(); grades.forEach(g => { if (g.studentId === editingStudentId) g.studentId = newId; }); DataStore.setGrades(grades);
        const messages = DataStore.getMessages(); messages.forEach(m => { if (m.toId === editingStudentId) m.toId = newId; if (m.fromId === editingStudentId) m.fromId = newId; }); DataStore.setMessages(messages);
    }
    s.id = newId; s.name = newName; if (newPass) s.password = newPass;
    s.course = document.getElementById('edit-student-course').value;
    s.yearLevel = document.getElementById('edit-student-year').value;
    s.email = document.getElementById('edit-student-email').value.trim();
    s.tuition = parseFloat(document.getElementById('edit-student-tuition').value) || 0;
    s.balance = parseFloat(document.getElementById('edit-student-balance').value) || 0;
    s.enrollmentDate = document.getElementById('edit-student-enrollment').value;
    DataStore.setStudents(students);
    showToast('Student updated successfully!', 'success');
    closeEditStudentModal(); renderStudentsTable();
}

function deleteStudent() {
    if (!editingStudentId) return;
    if (!confirm('Delete this student? This cannot be undone.')) return;
    let students = DataStore.getStudents(); students = students.filter(s => s.id !== editingStudentId); DataStore.setStudents(students);
    let reports = DataStore.getReports(); reports = reports.filter(r => r.studentId !== editingStudentId); DataStore.setReports(reports);
    let grades = DataStore.getGrades(); grades = grades.filter(g => g.studentId !== editingStudentId); DataStore.setGrades(grades);
    let messages = DataStore.getMessages(); messages = messages.filter(m => m.toId !== editingStudentId && m.fromId !== editingStudentId); DataStore.setMessages(messages);
    showToast('Student deleted', 'info');
    closeEditStudentModal(); renderStudentsTable();
}

// ==================== ADMIN MANAGEMENT ====================
function renderAdminsTable() {
    const admins = DataStore.getAdmins();
    const tbody = document.getElementById('admins-table-body');
    const empty = document.getElementById('admins-empty');
    const table = document.querySelector('#admin-admins-section .table-responsive');
    if (admins.length === 0) { if (table) table.style.display = 'none'; empty.style.display = 'block'; return; }
    if (table) table.style.display = 'block'; empty.style.display = 'none';
    tbody.innerHTML = admins.map(a => `
        <tr><td><strong>${a.id}</strong></td><td>${a.name}</td><td>${a.department}</td><td>${a.email || 'N/A'}</td>
        <td><div class="table-actions"><button class="btn btn-primary" onclick="editAdmin('${a.id}')"><i class="fas fa-edit"></i></button></div></td></tr>
    `).join('');
}

function showCreateAdminModal() { document.getElementById('create-admin-modal').classList.add('active'); }
function closeCreateAdminModal() { document.getElementById('create-admin-modal').classList.remove('active'); }

function createAdmin() {
    const id = document.getElementById('new-admin-id').value.trim();
    const name = document.getElementById('new-admin-name').value.trim();
    const password = document.getElementById('new-admin-password').value;
    const dept = document.getElementById('new-admin-dept').value.trim();
    const email = document.getElementById('new-admin-email').value.trim();
    if (!id || !name || !password || !dept) { showToast('Please fill in all required fields', 'warning'); return; }
    const admins = DataStore.getAdmins();
    if (admins.find(a => a.id === id)) { showToast('Admin ID already exists', 'error'); return; }
    admins.push({ id, password, name, department: dept, email });
    DataStore.setAdmins(admins);
    showToast('Admin created successfully!', 'success');
    closeCreateAdminModal();
    document.getElementById('new-admin-id').value = '';
    document.getElementById('new-admin-name').value = '';
    document.getElementById('new-admin-password').value = '';
    document.getElementById('new-admin-dept').value = '';
    document.getElementById('new-admin-email').value = '';
    renderAdminsTable();
}

function editAdmin(id) {
    const admins = DataStore.getAdmins();
    const a = admins.find(x => x.id === id);
    if (!a) return;
    editingAdminId = id;
    document.getElementById('edit-admin-id').value = a.id;
    document.getElementById('edit-admin-name').value = a.name;
    document.getElementById('edit-admin-password').value = '';
    document.getElementById('edit-admin-dept').value = a.department;
    document.getElementById('edit-admin-email').value = a.email || '';
    document.getElementById('edit-admin-modal').classList.add('active');
}

function closeEditAdminModal() { document.getElementById('edit-admin-modal').classList.remove('active'); editingAdminId = null; }

function saveAdminEdit() {
    if (!editingAdminId) return;
    const admins = DataStore.getAdmins();
    const a = admins.find(x => x.id === editingAdminId);
    if (!a) return;
    const newId = document.getElementById('edit-admin-id').value.trim();
    const newName = document.getElementById('edit-admin-name').value.trim();
    const newPass = document.getElementById('edit-admin-password').value;
    if (!newId || !newName) { showToast('ID and Name are required', 'warning'); return; }
    if (newId !== editingAdminId && admins.find(x => x.id === newId)) { showToast('Admin ID already exists', 'error'); return; }
    if (newId !== editingAdminId) {
        const messages = DataStore.getMessages(); messages.forEach(m => { if (m.fromId === editingAdminId) m.fromId = newId; }); DataStore.setMessages(messages);
    }
    a.id = newId; a.name = newName; if (newPass) a.password = newPass;
    a.department = document.getElementById('edit-admin-dept').value.trim();
    a.email = document.getElementById('edit-admin-email').value.trim();
    DataStore.setAdmins(admins);
    if (currentAdmin.id === editingAdminId) { currentAdmin = { ...a, role: 'admin' }; DataStore.setCurrentUser(currentAdmin); initAdminDashboard(); }
    showToast('Admin updated successfully!', 'success');
    closeEditAdminModal(); renderAdminsTable();
}

function deleteAdmin() {
    if (!editingAdminId) return;
    if (editingAdminId === currentAdmin.id) { showToast('You cannot delete yourself', 'error'); return; }
    if (!confirm('Delete this admin?')) return;
    let admins = DataStore.getAdmins(); admins = admins.filter(a => a.id !== editingAdminId); DataStore.setAdmins(admins);
    showToast('Admin deleted', 'info');
    closeEditAdminModal(); renderAdminsTable();
}

// ==================== GRADES ====================
function populateGradeStudentDropdown() {
    const students = DataStore.getStudents();
    const select = document.getElementById('grade-student');
    select.innerHTML = '<option value="">Select student</option>' + students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
}

function submitGrade() {
    const studentId = document.getElementById('grade-student').value;
    const subject = document.getElementById('grade-subject').value.trim();
    const grade = parseFloat(document.getElementById('grade-value').value);
    const semester = document.getElementById('grade-semester').value;
    const year = document.getElementById('grade-year').value.trim();
    if (!studentId || !subject || isNaN(grade) || !year) { showToast('Please fill in all required fields', 'warning'); return; }
    if (grade < 0 || grade > 5) { showToast('Grade must be between 0.0 and 5.0', 'warning'); return; }
    const students = DataStore.getStudents();
    const student = students.find(s => s.id === studentId);
    const counter = DataStore.getGradeCounter() + 1;
    DataStore.setGradeCounter(counter);
    const now = new Date();
    const encodedAt = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const grades = DataStore.getGrades();
    grades.push({ id: counter, studentId, studentName: student ? student.name : 'Unknown', subject, grade, semester, year, encodedAt });
    DataStore.setGrades(grades);
    showToast('Grade encoded successfully!', 'success');
    document.getElementById('grade-subject').value = '';
    document.getElementById('grade-value').value = '';
    document.getElementById('grade-year').value = '';
    renderGradesTable();
}

function renderGradesTable() {
    const grades = DataStore.getGrades().sort((a, b) => b.id - a.id);
    const tbody = document.getElementById('grades-table-body');
    const empty = document.getElementById('grades-empty');
    const table = document.querySelector('#admin-grades-section .table-responsive');
    if (grades.length === 0) { if (table) table.style.display = 'none'; empty.style.display = 'block'; return; }
    if (table) table.style.display = 'block'; empty.style.display = 'none';
    tbody.innerHTML = grades.map(g => {
        const pct = (g.grade / 5.0 * 100).toFixed(1);
        const isPass = g.grade >= 3.0;
        return `<tr><td>${g.studentName}</td><td>${g.subject}</td><td class="grade-value" style="color:${isPass ? 'var(--success)' : 'var(--danger)'}">${g.grade.toFixed(1)}</td><td>${pct}%</td><td>${g.semester}</td><td>${g.year}</td><td class="${isPass ? 'grade-pass' : 'grade-fail'}">${isPass ? 'Passed' : 'Failed'}</td><td><button class="btn btn-danger" onclick="deleteGrade(${g.id})"><i class="fas fa-trash"></i></button></td></tr>`;
    }).join('');
}

function searchGrades() {
    const query = document.getElementById('grade-search').value.toLowerCase();
    document.querySelectorAll('#grades-table-body tr').forEach(row => { row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none'; });
}

function deleteGrade(id) {
    if (!confirm('Delete this grade record?')) return;
    let grades = DataStore.getGrades(); grades = grades.filter(g => g.id !== id); DataStore.setGrades(grades);
    showToast('Grade deleted', 'info'); renderGradesTable();
}

// ==================== MESSAGES ====================
function populateMessageStudentDropdown() {
    const students = DataStore.getStudents();
    const select = document.getElementById('msg-student');
    select.innerHTML = '<option value="">Select student</option>' + students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
}

function sendMessage() {
    const toId = document.getElementById('msg-student').value;
    const subject = document.getElementById('msg-subject').value.trim();
    const body = document.getElementById('msg-body').value.trim();
    if (!toId || !subject || !body) { showToast('Please fill in all fields', 'warning'); return; }
    const students = DataStore.getStudents();
    const student = students.find(s => s.id === toId);
    const counter = DataStore.getMessageCounter() + 1;
    DataStore.setMessageCounter(counter);
    const now = new Date();
    const sentAt = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const messages = DataStore.getMessages();
    messages.push({ id: counter, fromId: currentAdmin.id, fromName: currentAdmin.name, fromRole: 'admin', toId, toName: student ? student.name : 'Unknown', subject, body, sentAt, read: false });
    DataStore.setMessages(messages);
    showToast('Message sent!', 'success');
    document.getElementById('msg-subject').value = '';
    document.getElementById('msg-body').value = '';
    renderSentMessages();
}

function renderSentMessages() {
    const messages = DataStore.getMessages().filter(m => m.fromId === currentAdmin.id).sort((a, b) => b.id - a.id);
    const container = document.getElementById('admin-sent-messages');
    const empty = document.getElementById('sent-messages-empty');
    if (messages.length === 0) { container.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    container.innerHTML = messages.map(m => `
        <div class="sent-message-card">
            <div class="sent-message-info">
                <div class="sent-message-to">To: ${m.toName}</div>
                <div class="sent-message-subject">${m.subject}</div>
            </div>
            <div class="sent-message-date">${m.sentAt}</div>
        </div>
    `).join('');
}

// ==================== REPORTS ====================
function renderReportsTable() {
    const filter = document.getElementById('report-filter').value;
    let reports = DataStore.getReports();
    if (filter !== 'all') { const map = { pending: 'PENDING', found: 'FOUND', notfound: 'NOT_FOUND' }; reports = reports.filter(r => r.status === map[filter]); }
    const tbody = document.getElementById('reports-table-body');
    const empty = document.getElementById('reports-empty');
    const table = document.querySelector('#admin-reports-section .table-responsive');
    if (reports.length === 0) { if (table) table.style.display = 'none'; empty.style.display = 'block'; return; }
    if (table) table.style.display = 'block'; empty.style.display = 'none';
    tbody.innerHTML = reports.map(r => {
        const sc = r.status === 'FOUND' ? 'status-found' : r.status === 'NOT_FOUND' ? 'status-notfound' : 'status-pending';
        const st = r.status === 'FOUND' ? 'Found' : r.status === 'NOT_FOUND' ? 'Not Found' : 'Pending';
        return `<tr><td><strong>#${r.reportId}</strong></td><td>${r.studentName}<br><small style="color:var(--secondary)">${r.studentId}</small></td><td>${r.itemName}</td><td><span class="report-type-badge">${r.itemType}</span></td><td>${r.lostDate}</td><td>${r.lostLocation}</td><td><span class="report-status-badge ${sc}">${st}</span></td><td><div class="table-actions"><button class="btn btn-primary" onclick="respondToReport(${r.reportId})"><i class="fas fa-reply"></i></button></div></td></tr>`;
    }).join('');
}

function filterReports() { renderReportsTable(); }

function respondToReport(reportId) {
    const reports = DataStore.getReports();
    const r = reports.find(x => x.reportId === reportId);
    if (!r) return;
    editingReportId = reportId;
    document.getElementById('admin-response-text').value = r.adminResponse;
    document.getElementById('admin-status-update').value = r.status;
    document.getElementById('report-detail-view').innerHTML = `
        <div class="report-detail-row"><span class="label">Report ID</span><span class="value">#${r.reportId}</span></div>
        <div class="report-detail-row"><span class="label">Student</span><span class="value">${r.studentName} (${r.studentId})</span></div>
        <div class="report-detail-row"><span class="label">Item</span><span class="value">${r.itemName}</span></div>
        <div class="report-detail-row"><span class="label">Type</span><span class="value">${r.itemType}</span></div>
        <div class="report-detail-row"><span class="label">Date Lost</span><span class="value">${r.lostDate}</span></div>
        <div class="report-detail-row"><span class="label">Location</span><span class="value">${r.lostLocation}</span></div>
        <div class="report-detail-row"><span class="label">Description</span><span class="value">${r.description || 'N/A'}</span></div>
    `;
    document.getElementById('respond-report-modal').classList.add('active');
}

function closeRespondReportModal() { document.getElementById('respond-report-modal').classList.remove('active'); editingReportId = null; }

function saveReportResponse() {
    if (!editingReportId) return;
    const reports = DataStore.getReports();
    const r = reports.find(x => x.reportId === editingReportId);
    if (!r) return;
    r.adminResponse = document.getElementById('admin-response-text').value.trim();
    r.status = document.getElementById('admin-status-update').value;
    DataStore.setReports(reports);
    showToast('Response saved!', 'success');
    closeRespondReportModal(); renderReportsTable();
}

// ==================== CALENDAR ====================
function renderAdminCalendar() {
    const events = DataStore.getCalendar();
    const container = document.getElementById('admin-calendar-events');
    const empty = document.getElementById('calendar-empty');
    if (events.length === 0) { container.innerHTML = ''; empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    container.innerHTML = events.map((e, i) => {
        const parts = e.split(' - ');
        return `<div class="calendar-event">
            <span class="event-date">${parts[0]}</span>
            <span class="event-desc">${parts[1] || ''}</span>
            <button class="event-delete" onclick="deleteCalendarEvent(${i})"><i class="fas fa-trash-alt"></i></button>
        </div>`;
    }).join('');
}

function showAddEventModal() { document.getElementById('add-event-modal').classList.add('active'); }
function closeAddEventModal() { document.getElementById('add-event-modal').classList.remove('active'); }

function addCalendarEvent() {
    const date = document.getElementById('new-event-date').value;
    const desc = document.getElementById('new-event-desc').value.trim();
    if (!date || !desc) { showToast('Please enter both date and description', 'warning'); return; }
    const events = DataStore.getCalendar(); events.push(`${date} - ${desc}`); events.sort((a, b) => a.split(' - ')[0].localeCompare(b.split(' - ')[0]));
    DataStore.setCalendar(events); showToast('Event added!', 'success'); closeAddEventModal(); renderAdminCalendar();
    document.getElementById('new-event-date').value = ''; document.getElementById('new-event-desc').value = '';
}

function deleteCalendarEvent(index) {
    if (!confirm('Remove this event?')) return;
    const events = DataStore.getCalendar(); events.splice(index, 1); DataStore.setCalendar(events); showToast('Event removed', 'info'); renderAdminCalendar();
}

// ==================== SCHOOL DETAILS ====================
function renderSchoolEdit() {
    const school = DataStore.getSchool();
    const container = document.getElementById('school-edit-form');
    container.innerHTML = `
        <div class="form-group full-width"><label>School Name</label><input type="text" id="school-name" value="${school.name}"></div>
        <div class="form-group full-width"><label>Address</label><input type="text" id="school-address" value="${school.address}"></div>
        <div class="form-group"><label>Phone</label><input type="text" id="school-phone" value="${school.phone}"></div>
        <div class="form-group"><label>Email</label><input type="email" id="school-email" value="${school.email}"></div>
        <div class="form-group"><label>Principal</label><input type="text" id="school-principal" value="${school.principal}"></div>
        <div class="form-group"><label>Established</label><input type="text" id="school-established" value="${school.established}"></div>
        <div class="form-group full-width"><label>Motto</label><input type="text" id="school-motto" value="${school.motto}"></div>
    `;
    const img = document.getElementById('school-logo-preview');
    const fallback = document.getElementById('school-logo-preview-fallback');
    const removeBtn = document.getElementById('remove-logo-btn');
    if (school.logo) { img.src = school.logo; img.style.display = 'block'; fallback.style.display = 'none'; removeBtn.style.display = 'inline-flex'; }
    else { img.style.display = 'none'; fallback.style.display = 'flex'; removeBtn.style.display = 'none'; }
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const school = DataStore.getSchool(); school.logo = e.target.result; DataStore.setSchool(school);
        renderSchoolEdit(); renderLoginBranding(); renderSidebarLogo('student'); renderSidebarLogo('admin');
        showToast('Logo uploaded!', 'success');
    };
    reader.readAsDataURL(file);
}

function removeLogo() {
    const school = DataStore.getSchool(); school.logo = null; DataStore.setSchool(school);
    renderSchoolEdit(); renderLoginBranding(); renderSidebarLogo('student'); renderSidebarLogo('admin');
    showToast('Logo removed', 'info');
}

function saveSchoolDetails() {
    const school = {
        name: document.getElementById('school-name').value.trim(),
        address: document.getElementById('school-address').value.trim(),
        phone: document.getElementById('school-phone').value.trim(),
        email: document.getElementById('school-email').value.trim(),
        principal: document.getElementById('school-principal').value.trim(),
        established: document.getElementById('school-established').value.trim(),
        motto: document.getElementById('school-motto').value.trim(),
        logo: DataStore.getSchool().logo
    };
    DataStore.setSchool(school);
    showToast('School details saved!', 'success');
    renderLoginBranding();
    renderSidebarLogo('student'); renderSidebarLogo('admin');
    if (document.getElementById('admin-dashboard-section').classList.contains('active')) renderAdminDashboard();
}

// ==================== ADMIN PROFILE ====================
function renderAdminProfile() {
    const container = document.getElementById('admin-profile-form');
    container.innerHTML = `
        <div class="form-group"><label>Admin ID</label><input type="text" id="profile-admin-id" value="${currentAdmin.id}" disabled></div>
        <div class="form-group"><label>Full Name</label><input type="text" id="profile-admin-name" value="${currentAdmin.name}"></div>
        <div class="form-group"><label>Department</label><input type="text" id="profile-admin-dept" value="${currentAdmin.department}"></div>
        <div class="form-group"><label>Email</label><input type="email" id="profile-admin-email" value="${currentAdmin.email || ''}"></div>
    `;
}

function saveAdminProfile() {
    const name = document.getElementById('profile-admin-name').value.trim();
    const dept = document.getElementById('profile-admin-dept').value.trim();
    const email = document.getElementById('profile-admin-email').value.trim();
    if (!name || !dept) { showToast('Name and Department are required', 'warning'); return; }
    const admins = DataStore.getAdmins();
    const a = admins.find(x => x.id === currentAdmin.id);
    if (!a) return;
    a.name = name; a.department = dept; a.email = email;
    DataStore.setAdmins(admins);
    currentAdmin = { ...a, role: 'admin' };
    DataStore.setCurrentUser(currentAdmin);
    document.getElementById('admin-sidebar-name').textContent = currentAdmin.name;
    document.getElementById('admin-avatar').textContent = currentAdmin.name.charAt(0).toUpperCase();
    showToast('Profile updated!', 'success');
    renderAdminProfile();
    if (document.getElementById('admin-dashboard-section').classList.contains('active')) renderAdminDashboard();
}

function changeAdminPassword() {
    const currentPass = document.getElementById('admin-current-pass').value;
    const newPass = document.getElementById('admin-new-pass').value;
    const confirmPass = document.getElementById('admin-confirm-pass').value;
    if (!currentPass || !newPass || !confirmPass) { showToast('Please fill in all password fields', 'warning'); return; }
    const admins = DataStore.getAdmins();
    const a = admins.find(x => x.id === currentAdmin.id);
    if (!a) return;
    if (a.password !== currentPass) { showToast('Current password is incorrect', 'error'); return; }
    if (newPass !== confirmPass) { showToast('New passwords do not match', 'error'); return; }
    a.password = newPass; DataStore.setAdmins(admins);
    showToast('Password updated!', 'success');
    document.getElementById('admin-current-pass').value = '';
    document.getElementById('admin-new-pass').value = '';
    document.getElementById('admin-confirm-pass').value = '';
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    DataStore.init();
    renderLoginBranding();
    const user = DataStore.getCurrentUser();
    if (user) {
        if (user.role === 'student') { showView('student-view'); initStudentDashboard(); }
        else if (user.role === 'admin') { showView('admin-view'); initAdminDashboard(); }
    } else { showView('login-view'); }
    document.getElementById('login-password').addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });
});
