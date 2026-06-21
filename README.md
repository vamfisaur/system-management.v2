# Bright Future Academy - School Management System

A complete, modern, responsive web-based School Management System for desktop and mobile browsers.

---

## What's Included

- **Dynamic School Branding** - School name and motto appear on the login page and update instantly across all pages when changed by an admin.
- **Logo Upload** - Admins can upload a custom school logo (image) that displays on the login page and both dashboards.
- **Admin Self-Management** - Admins can edit their own profile (name, department, email) and change their own password securely.
- **Create Students & Admins** - Admins can create new student accounts and new admin accounts with full details.
- **Grades System** - Admins encode student grades using a **0-based 0-5.0 grading scale** (3.0 = passing). Students view their grades with pass/fail status and percentage equivalents.
- **Messaging System** - Admins can compose and send messages to students. Students receive messages in their inbox with read/unread tracking.
- **Lost & Found** - Students report lost items; admins respond and update status.
- **School Calendar** - Admins add/remove events; students view the calendar.
- **Student Menu Priority** - Profile > School Calendar > My Grades > Report Lost Item > My Reports > Inbox.
- **Clean Slate** - No demo data. Only 1 default admin. Everything is created by the admin.
- **Data Persistence** - All data stored in browser localStorage.

---

## How to Run

1. Extract the `school-web-app.tar.gz` file.
2. Open the `school-web-app` folder.
3. Double-click `index.html` to open in your browser.

Or use VS Code with Live Server for the best development experience.

---

## Default Login

**Admin:**
- ID: `A001`
- Password: `adminpass`
- Name: System Administrator

> There are no default students or reports. The admin must create them.

---

## Features Detail

### Student Portal
1. **My Profile** - View all personal details, course, year level, tuition, balance, and payment progress bar.
2. **School Calendar** - View academic events sorted by date.
3. **My Grades** - View all encoded grades with:
   - 0-5.0 grading scale (each grade = 20%)
   - Percentage equivalent shown
   - Pass/Fail status (3.0 = passing)
   - Average grade and total subjects summary
4. **Report Lost Item** - Submit detailed lost item reports.
5. **My Reports** - View all submitted reports with admin responses and status.
6. **Inbox** - Read messages from admins with read/unread indicators and unread badge.

### Admin Portal
1. **Dashboard** - Overview stats (students, reports, pending, messages), school info, and admin profile.
2. **Students** - Create, edit, delete students. Searchable table. Full detail editing (ID, name, password, course, year, email, tuition, balance, enrollment date).
3. **Admins** - Create, edit, delete other admin accounts. Cannot delete self.
4. **Grades** - Encode grades for any student (subject, grade 0-5.0, semester, year). View all grades with pass/fail status. Delete grade records.
5. **Messages** - Compose and send messages to students. View sent message history.
6. **Lost & Found** - Filterable report table. Respond to students, update status (Pending/Found/Not Found).
7. **Calendar** - Add and remove academic events.
8. **School Details** - Edit all school information fields and upload/remove a custom logo.
9. **My Profile** - Edit own profile and change password.

---

## 0-Based Grading System

- **Scale:** 0.0 to 5.0 (increments of 0.1)
- **Percentage:** Grade × 20% (e.g., 3.0 = 60%)
- **Passing:** 3.0 or above
- **Failing:** Below 3.0

| Grade | % | Status |
|---|---|---|
| 5.0 | 100% | Passed |
| 4.0 | 80% | Passed |
| 3.0 | 60% | Passed (threshold) |
| 2.0 | 40% | Failed |
| 1.0 | 20% | Failed |
| 0.0 | 0% | Failed |

---

## Reset Demo Data

Open browser console (F12 → Console) and type:
```javascript
DataStore.resetToDefaults()
```
Then refresh the page.

---

## Project Structure
```
school-web-app/
├── index.html          - Main single-page application
├── css/
│   └── style.css       - Modern responsive stylesheet with animations
├── js/
│   └── app.js          - Complete application logic
└── README.md           - This file
```

---

## Tech Stack
- HTML5, CSS3 (Flexbox, Grid, Animations, Media Queries)
- Vanilla JavaScript (ES6+)
- LocalStorage for persistence
- Font Awesome icons
- Google Fonts (Inter)
