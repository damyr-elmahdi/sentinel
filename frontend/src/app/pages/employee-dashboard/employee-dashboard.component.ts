import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService, Shift, Task, Message } from '../../services/dashboard.service';

type Section = 'schedule' | 'timelog' | 'tasks' | 'inbox' | 'profile';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-layout">

      <!-- ══ SIDEBAR ══ -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <svg viewBox="0 0 40 48" fill="none" class="sidebar-shield">
            <path d="M20 2L36 8V24C36 34 28 42 20 46C12 42 4 34 4 24V8L20 2Z"
              stroke="var(--s-cyan)" stroke-width="1.5" fill="rgba(0,212,255,0.05)"/>
            <circle cx="20" cy="24" r="6" fill="var(--s-cyan)" opacity="0.8"/>
            <circle cx="20" cy="24" r="3" fill="var(--s-black)"/>
          </svg>
          <div>
            <p class="sidebar-brand">SENTINEL</p>
            <p class="sidebar-role">EMPLOYEE</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button class="nav-item" *ngFor="let item of navItems"
            [class.active]="activeSection === item.id"
            (click)="activeSection = item.id">
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            <span>{{ item.label }}</span>
            <span class="nav-badge" *ngIf="item.badge && item.badge > 0">{{ item.badge }}</span>
          </button>
        </nav>

        <!-- Clock widget -->
        <div class="sidebar-clock">
          <p class="clock-time">{{ currentTime }}</p>
          <p class="clock-date">{{ currentDate }}</p>
          <div class="clock-status">
            <span class="status-dot" [class.online]="isClockedIn" [class.offline]="!isClockedIn"></span>
            {{ isClockedIn ? 'ON DUTY' : 'OFF DUTY' }}
          </div>
        </div>

        <!-- Profile (bottom) -->
        <div class="sidebar-profile" (click)="activeSection = 'profile'">
          <div class="profile-avatar">
            {{ user?.fullName?.charAt(0) ?? 'U' }}
          </div>
          <div class="profile-info">
            <p class="profile-name">{{ user?.fullName }}</p>
            <p class="profile-email">{{ user?.email }}</p>
          </div>
          <button class="logout-btn" (click)="$event.stopPropagation(); auth.logout()" title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- ══ MAIN CONTENT ══ -->
      <main class="main-content">

        <!-- Page Header -->
        <div class="page-header">
          <div>
            <p class="page-tag">// EMPLOYEE PORTAL</p>
            <h1 class="page-title">{{ sectionTitle }}</h1>
          </div>
          <div class="header-info">
            <span class="status-dot online"></span>
            <span class="header-status">SECURE CONNECTION ESTABLISHED</span>
          </div>
        </div>

        <!-- ══ SCHEDULE SECTION ══ -->
        <div *ngIf="activeSection === 'schedule'" class="section-content">
          <div class="calendar-header">
            <button class="sentinel-btn" (click)="prevWeek()">‹ Prev</button>
            <h3 class="week-label">{{ weekLabel }}</h3>
            <button class="sentinel-btn" (click)="nextWeek()">Next ›</button>
          </div>

          <div class="week-grid">
            <div class="day-col" *ngFor="let day of weekDays">
              <div class="day-header" [class.today]="day.isToday">
                <span class="day-name">{{ day.name }}</span>
                <span class="day-num">{{ day.num }}</span>
              </div>
              <div class="shift-block" *ngFor="let s of getShiftsForDay(day.date)"
                [class]="'shift-' + s.status.toLowerCase()">
                <p class="shift-time">{{ s.startTime }} — {{ s.endTime }}</p>
                <p class="shift-loc">{{ s.location }}</p>
                <span class="shift-status-badge">{{ s.status }}</span>
              </div>
              <div class="no-shift" *ngIf="getShiftsForDay(day.date).length === 0">
                <span>—</span>
              </div>
            </div>
          </div>

          <!-- Upcoming shifts list -->
          <div class="upcoming-shifts">
            <h3 class="sub-title">Upcoming Shifts</h3>
            <div class="sentinel-card shift-row" *ngFor="let s of mockShifts">
              <div class="shift-info">
                <div class="shift-date-badge">
                  <span>{{ formatShortDate(s.date) }}</span>
                </div>
                <div>
                  <p class="shift-title">{{ s.location }}</p>
                  <p class="shift-subtitle">{{ s.startTime }} – {{ s.endTime }}</p>
                </div>
              </div>
              <span class="priority-badge {{ s.status }}">{{ s.status }}</span>
            </div>
          </div>
        </div>

        <!-- ══ TIME REGISTER SECTION ══ -->
        <div *ngIf="activeSection === 'timelog'" class="section-content">
          <div class="timelog-grid">
            <!-- Clock in/out card -->
            <div class="sentinel-card clock-card">
              <h3 class="card-title">Time Clock</h3>
              <div class="clock-display">
                <p class="big-clock">{{ currentTime }}</p>
                <p class="big-date">{{ currentDate }}</p>
              </div>
              <div class="clock-status-bar">
                <span class="status-dot" [class.online]="isClockedIn" [class.alert]="!isClockedIn"></span>
                <span>{{ isClockedIn ? 'Clocked In — ' + clockInTime : 'Not clocked in' }}</span>
              </div>
              <button class="sentinel-btn large"
                [class.primary]="!isClockedIn"
                [class.danger]="isClockedIn"
                (click)="toggleClock()" style="width:100%;justify-content:center;margin-top:16px">
                {{ isClockedIn ? '⏹ Clock Out' : '▶ Clock In' }}
              </button>
            </div>

            <!-- Today summary -->
            <div class="sentinel-card">
              <h3 class="card-title">Today's Summary</h3>
              <div class="summary-stats">
                <div class="summary-stat">
                  <p class="summary-val">{{ hoursWorked }}</p>
                  <p class="summary-lbl">Hours Today</p>
                </div>
                <div class="summary-stat">
                  <p class="summary-val">{{ weekHours }}</p>
                  <p class="summary-lbl">This Week</p>
                </div>
                <div class="summary-stat">
                  <p class="summary-val">{{ monthHours }}</p>
                  <p class="summary-lbl">This Month</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Time log history -->
          <h3 class="sub-title" style="margin-top:32px">Time Log History</h3>
          <div class="data-table">
            <div class="table-header">
              <span>Date</span><span>Clock In</span><span>Clock Out</span><span>Total Hours</span><span>Status</span>
            </div>
            <div class="table-row" *ngFor="let log of timeLogs">
              <span>{{ log.date }}</span>
              <span class="mono">{{ log.clockIn }}</span>
              <span class="mono">{{ log.clockOut || '—' }}</span>
              <span class="mono">{{ log.total || '—' }}</span>
              <span>
                <span class="priority-badge" [class]="log.clockOut ? 'LOW' : 'MEDIUM'">
                  {{ log.clockOut ? 'Complete' : 'Active' }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- ══ TASKS SECTION ══ -->
        <div *ngIf="activeSection === 'tasks'" class="section-content">
          <div class="tasks-filters">
            <button class="filter-btn" *ngFor="let f of taskFilters"
              [class.active]="activeFilter === f"
              (click)="activeFilter = f">{{ f }}</button>
          </div>

          <div class="tasks-list">
            <div class="task-card sentinel-card" *ngFor="let t of filteredTasks"
              [class.done]="t.status === 'DONE'">
              <div class="task-header">
                <div class="task-check">
                  <input type="checkbox" [checked]="t.status === 'DONE'"
                    (change)="toggleTask(t)" [id]="'task-' + t.id"/>
                  <label [for]="'task-' + t.id" class="task-title">{{ t.title }}</label>
                </div>
                <span class="priority-badge {{ t.priority }}">{{ t.priority }}</span>
              </div>
              <p class="task-desc">{{ t.description }}</p>
              <div class="task-meta">
                <span class="task-due">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Due: {{ t.dueDate }}
                </span>
                <span class="priority-badge" [class]="t.status === 'DONE' ? 'LOW' : t.status === 'IN_PROGRESS' ? 'MEDIUM' : 'HIGH'">
                  {{ t.status.replace('_', ' ') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ INBOX SECTION ══ -->
        <div *ngIf="activeSection === 'inbox'" class="section-content">
          <div class="inbox-layout">
            <div class="message-list">
              <div class="message-item" *ngFor="let m of messages"
                [class.unread]="!m.read"
                [class.selected]="selectedMessage?.id === m.id"
                (click)="selectMessage(m)">
                <div class="message-icon" [class]="'icon-' + m.type.toLowerCase()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path *ngIf="m.type==='ALERT'" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <path *ngIf="m.type==='BROADCAST'" d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 0111.37 19a19.5 19.5 0 01-6-6"/>
                    <path *ngIf="m.type==='INFO'" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  </svg>
                </div>
                <div class="message-preview">
                  <div class="message-from-row">
                    <span class="message-from">{{ m.from }}</span>
                    <span class="message-time">{{ formatTime(m.timestamp) }}</span>
                  </div>
                  <p class="message-subject">{{ m.subject }}</p>
                  <p class="message-snippet">{{ m.body.substring(0, 60) }}...</p>
                </div>
                <div class="unread-dot" *ngIf="!m.read"></div>
              </div>
            </div>

            <div class="message-detail" *ngIf="selectedMessage">
              <div class="detail-header">
                <h3>{{ selectedMessage.subject }}</h3>
                <div class="detail-meta">
                  <span>From: <strong>{{ selectedMessage.from }}</strong></span>
                  <span>{{ formatTime(selectedMessage.timestamp) }}</span>
                  <span class="priority-badge {{ selectedMessage.type === 'ALERT' ? 'CRITICAL' : selectedMessage.type === 'BROADCAST' ? 'HIGH' : 'LOW' }}">
                    {{ selectedMessage.type }}
                  </span>
                </div>
              </div>
              <div class="detail-body">
                <p>{{ selectedMessage.body }}</p>
              </div>
            </div>

            <div class="no-message" *ngIf="!selectedMessage">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--s-text-muted)" stroke-width="1">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <p>Select a message to read</p>
            </div>
          </div>
        </div>

        <!-- ══ PROFILE SECTION ══ -->
        <div *ngIf="activeSection === 'profile'" class="section-content">
          <div class="profile-grid">
            <div class="sentinel-card profile-card">
              <div class="profile-hero">
                <div class="profile-avatar-large">
                  {{ user?.fullName?.charAt(0) ?? 'U' }}
                </div>
                <h2 class="profile-full-name">{{ user?.fullName }}</h2>
                <p class="profile-role-badge">{{ user?.role }}</p>
                <p class="profile-email-display">{{ user?.email }}</p>
              </div>
            </div>

            <div class="profile-details">
              <div class="sentinel-card">
                <h3 class="card-title">Personal Information</h3>
                <div class="detail-form">
                  <div class="form-group">
                    <label class="form-label-sm">Full Name</label>
                    <input class="sentinel-input" type="text" [value]="user?.fullName" readonly/>
                  </div>
                  <div class="form-group">
                    <label class="form-label-sm">Email Address</label>
                    <input class="sentinel-input" type="email" [value]="user?.email" readonly/>
                  </div>
                  <div class="form-group">
                    <label class="form-label-sm">Role</label>
                    <input class="sentinel-input" type="text" [value]="user?.role" readonly/>
                  </div>
                  <button class="sentinel-btn primary">Update Profile</button>
                </div>
              </div>

              <div class="sentinel-card" style="margin-top:20px">
                <h3 class="card-title">Change Password</h3>
                <div class="detail-form">
                  <div class="form-group">
                    <label class="form-label-sm">Current Password</label>
                    <input class="sentinel-input" type="password" placeholder="••••••••"/>
                  </div>
                  <div class="form-group">
                    <label class="form-label-sm">New Password</label>
                    <input class="sentinel-input" type="password" placeholder="••••••••"/>
                  </div>
                  <div class="form-group">
                    <label class="form-label-sm">Confirm New Password</label>
                    <input class="sentinel-input" type="password" placeholder="••••••••"/>
                  </div>
                  <button class="sentinel-btn">Update Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    /* ── Sidebar ── */
    .sidebar-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 0 24px 24px; border-bottom: 1px solid var(--s-border); margin-bottom: 8px;
    }
    .sidebar-shield { width: 36px; height: 44px; }
    .sidebar-brand {
      font-family: var(--font-display); font-size: 16px;
      font-weight: 700; letter-spacing: 0.15em; color: var(--s-white); line-height: 1;
    }
    .sidebar-role {
      font-family: var(--font-mono); font-size: 9px;
      color: var(--s-cyan); letter-spacing: 0.2em;
    }
    .sidebar-nav { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: var(--radius);
      background: none; border: none;
      font-family: var(--font-display); font-size: 13px;
      font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--s-text-dim); cursor: pointer;
      transition: all 0.2s; width: 100%; text-align: left;
    }
    .nav-item:hover { background: rgba(0,212,255,0.05); color: var(--s-text); }
    .nav-item.active { background: rgba(0,212,255,0.1); color: var(--s-cyan); }
    .nav-item.active .nav-icon { color: var(--s-cyan); }
    .nav-icon { width: 18px; height: 18px; display: flex; align-items: center; color: var(--s-text-muted); flex-shrink: 0; }
    .nav-badge {
      margin-left: auto; background: var(--s-red); color: white;
      font-size: 10px; border-radius: 10px; padding: 2px 6px; font-family: var(--font-mono);
    }
    .sidebar-clock {
      margin: 16px 12px;
      padding: 16px; border: 1px solid var(--s-border);
      border-radius: var(--radius); background: var(--s-panel);
    }
    .clock-time {
      font-family: var(--font-display); font-size: 28px;
      font-weight: 700; color: var(--s-white); line-height: 1;
    }
    .clock-date { font-family: var(--font-mono); font-size: 11px; color: var(--s-text-dim); margin: 4px 0; }
    .clock-status {
      display: flex; align-items: center; gap: 6px;
      font-family: var(--font-mono); font-size: 10px;
      color: var(--s-text-muted); letter-spacing: 0.1em;
    }
    .sidebar-profile {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 24px; border-top: 1px solid var(--s-border);
      cursor: pointer; transition: background 0.2s;
    }
    .sidebar-profile:hover { background: rgba(0,212,255,0.05); }
    .profile-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, var(--s-cyan), var(--s-purple));
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-size: 14px;
      font-weight: 700; color: var(--s-white); flex-shrink: 0;
    }
    .profile-info { flex: 1; min-width: 0; }
    .profile-name {
      font-family: var(--font-display); font-size: 13px;
      font-weight: 600; color: var(--s-white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .profile-email { font-size: 11px; color: var(--s-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .logout-btn {
      background: none; border: none; color: var(--s-text-muted);
      cursor: pointer; padding: 4px; transition: color 0.2s;
    }
    .logout-btn:hover { color: var(--s-red); }

    /* ── Page Header ── */
    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
    }
    .page-tag { font-family: var(--font-mono); font-size: 11px; color: var(--s-cyan); letter-spacing: 0.2em; margin-bottom: 4px; }
    .page-title { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--s-white); letter-spacing: 0.05em; }
    .header-info { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); padding-top: 24px; }
    .header-status { letter-spacing: 0.1em; }

    /* ── Schedule ── */
    .calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .week-label { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--s-white); letter-spacing: 0.08em; }
    .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 32px; }
    .day-col { display: flex; flex-direction: column; gap: 8px; }
    .day-header {
      text-align: center; padding: 10px 4px;
      background: var(--s-panel); border: 1px solid var(--s-border);
      border-radius: var(--radius);
    }
    .day-header.today { border-color: var(--s-cyan); background: rgba(0,212,255,0.08); }
    .day-name { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); display: block; }
    .day-num { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--s-white); display: block; }
    .day-header.today .day-num { color: var(--s-cyan); }
    .shift-block {
      padding: 8px; border-radius: var(--radius); font-size: 11px;
      border-left: 2px solid var(--s-cyan);
      background: rgba(0,212,255,0.06);
    }
    .shift-block.shift-completed { border-left-color: var(--s-green); background: rgba(0,255,136,0.05); }
    .shift-block.shift-active { border-left-color: var(--s-amber); background: rgba(255,184,0,0.05); }
    .shift-time { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-dim); }
    .shift-loc { color: var(--s-text); font-size: 11px; }
    .shift-status-badge { font-family: var(--font-mono); font-size: 9px; color: var(--s-cyan); }
    .no-shift { text-align: center; padding: 16px 4px; color: var(--s-text-muted); font-size: 16px; }
    .upcoming-shifts { display: flex; flex-direction: column; gap: 12px; }
    .sub-title {
      font-family: var(--font-display); font-size: 16px; font-weight: 700;
      color: var(--s-white); letter-spacing: 0.08em; margin-bottom: 16px;
    }
    .shift-row { display: flex; align-items: center; justify-content: space-between; }
    .shift-info { display: flex; align-items: center; gap: 16px; }
    .shift-date-badge {
      padding: 6px 12px; background: rgba(0,212,255,0.08);
      border: 1px solid rgba(0,212,255,0.2); border-radius: 2px;
      font-family: var(--font-mono); font-size: 12px; color: var(--s-cyan); white-space: nowrap;
    }
    .shift-title { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--s-white); }
    .shift-subtitle { font-family: var(--font-mono); font-size: 12px; color: var(--s-text-muted); }

    /* ── Timelog ── */
    .timelog-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .clock-card { text-align: center; }
    .card-title {
      font-family: var(--font-display); font-size: 14px; font-weight: 700;
      color: var(--s-text-dim); letter-spacing: 0.1em; text-transform: uppercase;
      margin-bottom: 20px;
    }
    .big-clock { font-family: var(--font-display); font-size: 52px; font-weight: 700; color: var(--s-white); line-height: 1; }
    .big-date { font-family: var(--font-mono); font-size: 13px; color: var(--s-text-dim); margin-top: 8px; }
    .clock-status-bar { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--s-text-dim); }
    .summary-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .summary-stat { text-align: center; padding: 16px; background: var(--s-dark); border-radius: var(--radius); border: 1px solid var(--s-border); }
    .summary-val { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--s-cyan); }
    .summary-lbl { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); margin-top: 4px; letter-spacing: 0.05em; }
    .data-table { border: 1px solid var(--s-border); border-radius: var(--radius); overflow: hidden; }
    .table-header, .table-row { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr; padding: 12px 20px; gap: 16px; }
    .table-header { background: var(--s-panel); font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid var(--s-border); }
    .table-row { background: var(--s-dark); font-size: 13px; border-bottom: 1px solid var(--s-border); transition: background 0.15s; }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover { background: rgba(0,212,255,0.04); }
    .mono { font-family: var(--font-mono); }

    /* ── Tasks ── */
    .tasks-filters { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .filter-btn {
      padding: 6px 16px; border-radius: 2px;
      font-family: var(--font-display); font-size: 12px; font-weight: 600;
      letter-spacing: 0.08em; text-transform: uppercase;
      background: var(--s-panel); border: 1px solid var(--s-border);
      color: var(--s-text-dim); cursor: pointer; transition: all 0.2s;
    }
    .filter-btn.active, .filter-btn:hover { border-color: var(--s-cyan); color: var(--s-cyan); background: rgba(0,212,255,0.08); }
    .tasks-list { display: flex; flex-direction: column; gap: 12px; }
    .task-card { transition: opacity 0.2s; }
    .task-card.done { opacity: 0.5; }
    .task-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .task-check { display: flex; align-items: center; gap: 12px; }
    .task-check input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--s-cyan); cursor: pointer; }
    .task-title { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--s-white); letter-spacing: 0.03em; cursor: pointer; }
    .task-card.done .task-title { text-decoration: line-through; color: var(--s-text-muted); }
    .task-desc { font-size: 13px; color: var(--s-text-dim); margin-bottom: 12px; line-height: 1.5; }
    .task-meta { display: flex; align-items: center; justify-content: space-between; }
    .task-due { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); }

    /* ── Inbox ── */
    .inbox-layout { display: grid; grid-template-columns: 340px 1fr; gap: 24px; height: calc(100vh - 200px); }
    .message-list { border: 1px solid var(--s-border); border-radius: var(--radius); overflow-y: auto; background: var(--s-panel); }
    .message-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 16px; border-bottom: 1px solid var(--s-border);
      cursor: pointer; transition: background 0.15s; position: relative;
    }
    .message-item:hover { background: rgba(0,212,255,0.04); }
    .message-item.selected { background: rgba(0,212,255,0.08); border-left: 2px solid var(--s-cyan); }
    .message-item.unread .message-subject { color: var(--s-white); font-weight: 600; }
    .message-icon {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-alert { background: rgba(255,59,92,0.15); color: var(--s-red); }
    .icon-broadcast { background: rgba(255,184,0,0.15); color: var(--s-amber); }
    .icon-info { background: rgba(0,212,255,0.15); color: var(--s-cyan); }
    .message-preview { flex: 1; min-width: 0; }
    .message-from-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
    .message-from { font-family: var(--font-display); font-size: 13px; font-weight: 600; color: var(--s-white); }
    .message-time { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); }
    .message-subject { font-size: 13px; color: var(--s-text); margin-bottom: 2px; }
    .message-snippet { font-size: 11px; color: var(--s-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .unread-dot { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; border-radius: 50%; background: var(--s-cyan); }
    .message-detail {
      border: 1px solid var(--s-border); border-radius: var(--radius);
      background: var(--s-panel); overflow-y: auto;
    }
    .detail-header { padding: 24px; border-bottom: 1px solid var(--s-border); }
    .detail-header h3 { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--s-white); margin-bottom: 12px; }
    .detail-meta { display: flex; align-items: center; gap: 16px; font-size: 13px; color: var(--s-text-dim); flex-wrap: wrap; }
    .detail-meta strong { color: var(--s-text); }
    .detail-body { padding: 24px; font-size: 14px; color: var(--s-text); line-height: 1.8; }
    .no-message { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 16px; color: var(--s-text-muted); font-family: var(--font-mono); font-size: 13px; border: 1px solid var(--s-border); border-radius: var(--radius); }

    /* ── Profile ── */
    .profile-grid { display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
    .profile-card { text-align: center; }
    .profile-hero { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .profile-avatar-large {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, var(--s-cyan), var(--s-purple));
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--s-white);
      box-shadow: 0 0 30px rgba(0,212,255,0.3);
    }
    .profile-full-name { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--s-white); }
    .profile-role-badge {
      padding: 4px 14px; background: rgba(0,212,255,0.1);
      border: 1px solid rgba(0,212,255,0.3); border-radius: 2px;
      font-family: var(--font-mono); font-size: 11px; color: var(--s-cyan); letter-spacing: 0.1em;
    }
    .profile-email-display { font-size: 13px; color: var(--s-text-dim); }
    .detail-form { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label-sm { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); letter-spacing: 0.1em; text-transform: uppercase; }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  activeSection: Section = 'schedule';
  user = this.auth.currentUser();
  isClockedIn = false;
  clockInTime = '';
  currentTime = '';
  currentDate = '';
  selectedMessage: Message | null = null;
  activeFilter = 'All';
  taskFilters = ['All', 'Pending', 'In Progress', 'Done'];

  hoursWorked = '6h 24m';
  weekHours = '32h 10m';
  monthHours = '142h 30m';

  weekOffset = 0;

  navItems = [
    { id: 'schedule' as Section, label: 'Schedule', badge: 0, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
    { id: 'timelog' as Section, label: 'Time Register', badge: 0, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
    { id: 'tasks' as Section, label: 'Tasks', badge: 3, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>` },
    { id: 'inbox' as Section, label: 'Inbox', badge: 2, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
    { id: 'profile' as Section, label: 'My Profile', badge: 0, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
  ];

  get sectionTitle(): string {
    const map: Record<Section, string> = {
      schedule: 'My Schedule', timelog: 'Time Register',
      tasks: 'Task List', inbox: 'Inbox', profile: 'My Profile'
    };
    return map[this.activeSection];
  }

  mockShifts: Shift[] = [
    { id: 1, date: this.getDateStr(0), startTime: '08:00', endTime: '16:00', location: 'Sector A — Main Gate', status: 'ACTIVE' },
    { id: 2, date: this.getDateStr(1), startTime: '16:00', endTime: '00:00', location: 'Sector B — Server Room', status: 'SCHEDULED' },
    { id: 3, date: this.getDateStr(3), startTime: '00:00', endTime: '08:00', location: 'Perimeter Patrol', status: 'SCHEDULED' },
  ];

  mockTasks: Task[] = [
    { id: 1, title: 'Inspect perimeter sensors', description: 'Run diagnostics on all outer ring IoT nodes and report anomalies.', priority: 'CRITICAL', status: 'PENDING', dueDate: 'Today 17:00' },
    { id: 2, title: 'Submit incident report #2847', description: 'Complete and file the incident report from last night\'s motion alert.', priority: 'HIGH', status: 'IN_PROGRESS', dueDate: 'Today 12:00' },
    { id: 3, title: 'Update access credentials', description: 'Rotate personal access tokens as per quarterly security policy.', priority: 'MEDIUM', status: 'PENDING', dueDate: 'Tomorrow' },
    { id: 4, title: 'Attend security briefing', description: 'Mandatory staff briefing on new IoT protocol updates.', priority: 'HIGH', status: 'DONE', dueDate: 'Yesterday' },
    { id: 5, title: 'Check battery levels on Zone C nodes', description: 'Verify remaining battery on nodes C-01 through C-12.', priority: 'LOW', status: 'PENDING', dueDate: 'This Week' },
  ];

  messages: Message[] = [
    { id: 1, from: 'Admin Control', subject: '⚠ ALERT: Anomaly Detected in Zone D', body: 'An unauthorized access attempt was detected on sensor cluster D-04 at 03:42 AM. Please verify physical perimeter and report status immediately. All Zone D personnel must conduct an immediate sweep.', timestamp: '2025-01-15T03:42:00', read: false, type: 'ALERT' },
    { id: 2, from: 'System Broadcast', subject: 'Scheduled Maintenance — Jan 20', body: 'All IoT nodes in Sector A will be taken offline for firmware upgrades on January 20th from 02:00 to 06:00 AM. Manual patrols are required during this window. Please update your schedule accordingly.', timestamp: '2025-01-14T09:00:00', read: false, type: 'BROADCAST' },
    { id: 3, from: 'HR Department', subject: 'Q1 Performance Review Scheduled', body: 'Your Q1 performance review has been scheduled for January 25th at 10:00 AM. Please prepare a summary of completed tasks and any challenges encountered this quarter.', timestamp: '2025-01-13T14:30:00', read: true, type: 'INFO' },
  ];

  timeLogs = [
    { date: '2025-01-15', clockIn: '08:02', clockOut: '16:05', total: '8h 03m' },
    { date: '2025-01-14', clockIn: '07:58', clockOut: '16:10', total: '8h 12m' },
    { date: '2025-01-13', clockIn: '08:05', clockOut: '16:00', total: '7h 55m' },
    { date: '2025-01-12', clockIn: '08:00', clockOut: null, total: null },
  ];

  get filteredTasks(): Task[] {
    if (this.activeFilter === 'All') return this.mockTasks;
    const map: Record<string, string> = { 'Pending': 'PENDING', 'In Progress': 'IN_PROGRESS', 'Done': 'DONE' };
    return this.mockTasks.filter(t => t.status === map[this.activeFilter]);
  }

  get weekDays() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setDate(today.getDate() + this.weekOffset * 7);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const isToday = d.toDateString() === new Date().toDateString();
      return { name: days[i], num: d.getDate(), date: d.toISOString().split('T')[0], isToday };
    });
  }

  get weekLabel(): string {
    const days = this.weekDays;
    return `${days[0].num} — ${days[6].num} Jan 2025`;
  }

  prevWeek() { this.weekOffset--; }
  nextWeek() { this.weekOffset++; }

  getShiftsForDay(date: string): Shift[] {
    return this.mockShifts.filter(s => s.date === date);
  }

  getDateStr(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  formatShortDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  formatTime(ts: string): string {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  toggleClock(): void {
    this.isClockedIn = !this.isClockedIn;
    if (this.isClockedIn) this.clockInTime = new Date().toLocaleTimeString();
  }

  selectMessage(m: Message): void {
    this.selectedMessage = m;
    m.read = true;
    this.navItems.find(n => n.id === 'inbox')!.badge = this.messages.filter(msg => !msg.read).length;
  }

  toggleTask(t: Task): void {
    t.status = t.status === 'DONE' ? 'PENDING' : 'DONE';
    this.navItems.find(n => n.id === 'tasks')!.badge = this.mockTasks.filter(task => task.status === 'PENDING').length;
  }

  constructor(public auth: AuthService, private svc: DashboardService) {}

  ngOnInit(): void {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.navItems.find(n => n.id === 'inbox')!.badge = this.messages.filter(m => !m.read).length;
    this.navItems.find(n => n.id === 'tasks')!.badge = this.mockTasks.filter(t => t.status === 'PENDING').length;
  }

  updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    this.currentDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
}
