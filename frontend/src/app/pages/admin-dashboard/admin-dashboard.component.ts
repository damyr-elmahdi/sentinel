import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DashboardService, SensorNode, Employee, Task, Shift } from '../../services/dashboard.service';

type AdminSection = 'status' | 'inform' | 'employees' | 'tasks' | 'schedules';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-layout">

      <!-- ══ SIDEBAR ══ -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <svg viewBox="0 0 40 48" fill="none" class="sidebar-shield">
            <path d="M20 2L36 8V24C36 34 28 42 20 46C12 42 4 34 4 24V8L20 2Z"
              stroke="var(--s-red)" stroke-width="1.5" fill="rgba(255,59,92,0.05)"/>
            <circle cx="20" cy="24" r="6" fill="var(--s-red)" opacity="0.8"/>
            <circle cx="20" cy="24" r="3" fill="var(--s-black)"/>
          </svg>
          <div>
            <p class="sidebar-brand">SENTINEL</p>
            <p class="sidebar-role admin">ADMIN</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button class="nav-item" *ngFor="let item of navItems"
            [class.active]="activeSection === item.id"
            (click)="activeSection = item.id">
            <span class="nav-icon" [innerHTML]="item.icon"></span>
            <span>{{ item.label }}</span>
            <span class="nav-badge alert" *ngIf="item.badge && item.badge > 0">{{ item.badge }}</span>
          </button>
        </nav>

        <div class="sidebar-stats">
          <p class="stats-title">// SYSTEM HEALTH</p>
          <div class="stat-row">
            <span>Online Nodes</span>
            <span class="stat-val green">{{ onlineNodes }}/{{ sensors.length }}</span>
          </div>
          <div class="stat-row">
            <span>Active Alerts</span>
            <span class="stat-val red">{{ alertNodes }}</span>
          </div>
          <div class="stat-row">
            <span>Staff On Duty</span>
            <span class="stat-val cyan">{{ activeEmployees }}</span>
          </div>
        </div>

        <div class="sidebar-profile">
          <div class="profile-avatar admin-av">
            {{ auth.currentUser()?.fullName?.charAt(0) ?? 'A' }}
          </div>
          <div class="profile-info">
            <p class="profile-name">{{ auth.currentUser()?.fullName }}</p>
            <p class="profile-email">System Administrator</p>
          </div>
          <button class="logout-btn" (click)="auth.logout()" title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- ══ MAIN CONTENT ══ -->
      <main class="main-content">
        <div class="page-header">
          <div>
            <p class="page-tag">// ADMIN COMMAND CENTER</p>
            <h1 class="page-title">{{ sectionTitle }}</h1>
          </div>
          <div class="header-actions">
            <div class="live-indicator">
              <span class="status-dot online"></span>
              LIVE MONITORING ACTIVE
            </div>
          </div>
        </div>

        <!-- ══ SENTINEL STATUS ══ -->
        <div *ngIf="activeSection === 'status'" class="section-content">

          <!-- Summary KPIs -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-icon green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <div class="kpi-data">
                <p class="kpi-val">{{ onlineNodes }}</p>
                <p class="kpi-label">Online Nodes</p>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon red">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div class="kpi-data">
                <p class="kpi-val red">{{ alertNodes }}</p>
                <p class="kpi-label">Active Alerts</p>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon amber">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div class="kpi-data">
                <p class="kpi-val amber">{{ offlineNodes }}</p>
                <p class="kpi-label">Offline Nodes</p>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon cyan">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div class="kpi-data">
                <p class="kpi-val">{{ activeEmployees }}</p>
                <p class="kpi-label">Staff On Duty</p>
              </div>
            </div>
          </div>

          <!-- Sensor Node Map/List -->
          <div class="sensor-section">
            <div class="section-toolbar">
              <h3 class="sub-title">IoT Sensor Network</h3>
              <div class="toolbar-filters">
                <button class="filter-btn" *ngFor="let f of sensorFilters"
                  [class.active]="sensorFilter === f" (click)="sensorFilter = f">{{ f }}</button>
              </div>
            </div>

            <div class="sensor-grid">
              <div class="sensor-card" *ngFor="let s of filteredSensors"
                [class]="'sensor-' + s.status.toLowerCase()">
                <div class="sensor-header">
                  <div class="sensor-status">
                    <span class="status-dot" [class]="s.status.toLowerCase()"></span>
                    <span class="sensor-id">{{ s.id }}</span>
                  </div>
                  <span class="priority-badge" [class]="s.status === 'ONLINE' ? 'LOW' : s.status === 'ALERT' ? 'CRITICAL' : 'HIGH'">
                    {{ s.status }}
                  </span>
                </div>
                <h4 class="sensor-name">{{ s.name }}</h4>
                <p class="sensor-loc">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ s.location }}
                </p>
                <div class="battery-bar">
                  <span class="battery-lbl">Battery</span>
                  <div class="battery-track">
                    <div class="battery-fill" [style.width]="s.batteryLevel + '%'"
                      [style.background]="s.batteryLevel > 50 ? 'var(--s-green)' : s.batteryLevel > 20 ? 'var(--s-amber)' : 'var(--s-red)'">
                    </div>
                  </div>
                  <span class="battery-pct">{{ s.batteryLevel }}%</span>
                </div>
                <p class="sensor-ping">Last ping: {{ s.lastPing }}</p>
                <p class="sensor-alerts" *ngIf="s.alertCount > 0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--s-red)" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  </svg>
                  {{ s.alertCount }} alert(s) today
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ INFORM SECTION ══ -->
        <div *ngIf="activeSection === 'inform'" class="section-content">
          <div class="inform-layout">
            <div class="broadcast-composer sentinel-card">
              <h3 class="card-title">New Broadcast</h3>
              <div class="form-group">
                <label class="form-label-sm">Message Type</label>
                <div class="type-selector">
                  <button class="type-btn" *ngFor="let t of messageTypes"
                    [class.active]="broadcastForm.type === t.value"
                    (click)="broadcastForm.type = t.value" [class]="'type-' + t.value.toLowerCase()">
                    <span [innerHTML]="t.icon"></span>
                    {{ t.label }}
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label-sm">Target Audience</label>
                <select class="sentinel-input">
                  <option>All Employees</option>
                  <option>Zone A Personnel</option>
                  <option>Zone B Personnel</option>
                  <option>Night Shift Team</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label-sm">Subject</label>
                <input class="sentinel-input" type="text" placeholder="Message subject..."
                  [(ngModel)]="broadcastForm.subject" name="subject"/>
              </div>
              <div class="form-group">
                <label class="form-label-sm">Message Body</label>
                <textarea class="sentinel-input" rows="6"
                  placeholder="Compose your message to all personnel..."
                  [(ngModel)]="broadcastForm.body" name="body"></textarea>
              </div>
              <div class="form-group priority-toggle">
                <label class="form-label-sm">Priority</label>
                <div class="toggle-group">
                  <button *ngFor="let p of ['STANDARD','URGENT','CRITICAL']"
                    class="toggle-btn" [class.active]="broadcastForm.priority === p"
                    (click)="broadcastForm.priority = p">{{ p }}</button>
                </div>
              </div>
              <button class="sentinel-btn primary" style="width:100%;justify-content:center"
                (click)="sendBroadcast()" [disabled]="!broadcastForm.subject || !broadcastForm.body">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Broadcast to All Employees
              </button>
            </div>

            <div class="broadcast-history">
              <h3 class="sub-title">Broadcast History</h3>
              <div class="history-item sentinel-card" *ngFor="let h of broadcastHistory">
                <div class="history-header">
                  <div class="history-type" [class]="'icon-' + h.type.toLowerCase()">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </div>
                  <span class="history-subject">{{ h.subject }}</span>
                  <span class="priority-badge" [class]="h.type === 'ALERT' ? 'CRITICAL' : h.type === 'URGENT' ? 'HIGH' : 'LOW'">{{ h.type }}</span>
                </div>
                <p class="history-meta">{{ h.recipients }} recipients · {{ h.timestamp }}</p>
                <p class="history-body">{{ h.body }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ EMPLOYEE REGISTER ══ -->
        <div *ngIf="activeSection === 'employees'" class="section-content">
          <div class="section-toolbar">
            <h3 class="sub-title">Employee Register</h3>
            <div class="toolbar-right">
              <input class="sentinel-input search-input" type="text" placeholder="Search employees..."
                [(ngModel)]="empSearch"/>
              <button class="sentinel-btn primary" (click)="openEmpModal()">+ Add Employee</button>
            </div>
          </div>

          <div class="data-table">
            <div class="table-header emp-cols">
              <span>Name</span><span>Email</span><span>Department</span><span>Status</span><span>Join Date</span><span>Actions</span>
            </div>
            <div class="table-row emp-cols" *ngFor="let e of filteredEmployees">
              <span class="emp-cell">
                <div class="emp-avatar">{{ e.fullName.charAt(0) }}</div>
                <span>{{ e.fullName }}</span>
              </span>
              <span class="mono small">{{ e.email }}</span>
              <span>{{ e.department }}</span>
              <span>
                <span class="priority-badge" [class]="e.status === 'ACTIVE' ? 'LOW' : 'HIGH'">
                  {{ e.status }}
                </span>
              </span>
              <span class="mono small">{{ e.joinDate }}</span>
              <span class="action-btns">
                <button class="action-btn edit" (click)="editEmployee(e)">✎ Edit</button>
                <button class="action-btn delete" (click)="deleteEmployee(e)">✕</button>
              </span>
            </div>
          </div>
        </div>

        <!-- ══ TASK OVERSIGHT ══ -->
        <div *ngIf="activeSection === 'tasks'" class="section-content">
          <div class="section-toolbar">
            <h3 class="sub-title">Task Oversight</h3>
            <button class="sentinel-btn primary" (click)="openTaskModal()">+ New Task</button>
          </div>

          <div class="tasks-board">
            <div class="board-col" *ngFor="let col of taskColumns">
              <div class="col-header">
                <span class="col-dot" [style.background]="col.color"></span>
                <span>{{ col.label }}</span>
                <span class="col-count">{{ getTasksByStatus(col.status).length }}</span>
              </div>
              <div class="board-card" *ngFor="let t of getTasksByStatus(col.status)"
                draggable="true">
                <div class="board-card-header">
                  <span class="priority-badge {{ t.priority }}">{{ t.priority }}</span>
                  <div class="card-actions">
                    <button class="action-btn edit" (click)="editTask(t)">✎</button>
                    <button class="action-btn delete" (click)="deleteTask(t)">✕</button>
                  </div>
                </div>
                <h4 class="board-card-title">{{ t.title }}</h4>
                <p class="board-card-desc">{{ t.description }}</p>
                <div class="board-card-footer">
                  <span class="card-assignee" *ngIf="t.assignedTo">
                    <div class="mini-avatar">{{ t.assignedTo.charAt(0) }}</div>
                    {{ t.assignedTo }}
                  </span>
                  <span class="card-due">{{ t.dueDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ SCHEDULES CRUD ══ -->
        <div *ngIf="activeSection === 'schedules'" class="section-content">
          <div class="section-toolbar">
            <h3 class="sub-title">Schedule Management</h3>
            <button class="sentinel-btn primary" (click)="openShiftModal()">+ Create Shift</button>
          </div>

          <div class="data-table">
            <div class="table-header shift-cols">
              <span>Date</span><span>Time</span><span>Location</span><span>Employee</span><span>Status</span><span>Actions</span>
            </div>
            <div class="table-row shift-cols" *ngFor="let s of allShifts">
              <span class="mono">{{ s.date }}</span>
              <span class="mono">{{ s.startTime }} – {{ s.endTime }}</span>
              <span>{{ s.location }}</span>
              <span>{{ s.employee }}</span>
              <span>
                <span class="priority-badge"
                  [class]="s.status === 'COMPLETED' ? 'LOW' : s.status === 'ACTIVE' ? 'MEDIUM' : 'HIGH'">
                  {{ s.status }}
                </span>
              </span>
              <span class="action-btns">
                <button class="action-btn edit" (click)="editShift(s)">✎ Edit</button>
                <button class="action-btn delete" (click)="deleteShift(s)">✕ Delete</button>
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- ══ MODALS ══ -->

    <!-- Employee Modal -->
    <div class="modal-overlay" *ngIf="showEmpModal" (click)="closeModals()">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModals()">✕</button>
        <h3 class="modal-title">{{ editingEmp ? 'Edit Employee' : 'Add New Employee' }}</h3>
        <div class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label-sm">Full Name</label>
              <input class="sentinel-input" type="text" [(ngModel)]="empForm.fullName" placeholder="Full Name"/>
            </div>
            <div class="form-group">
              <label class="form-label-sm">Email</label>
              <input class="sentinel-input" type="email" [(ngModel)]="empForm.email" placeholder="Email"/>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label-sm">Department</label>
              <input class="sentinel-input" type="text" [(ngModel)]="empForm.department" placeholder="Department"/>
            </div>
            <div class="form-group">
              <label class="form-label-sm">Status</label>
              <select class="sentinel-input" [(ngModel)]="empForm.status">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="sentinel-btn" (click)="closeModals()">Cancel</button>
            <button class="sentinel-btn primary" (click)="saveEmployee()">{{ editingEmp ? 'Save Changes' : 'Add Employee' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <div class="modal-overlay" *ngIf="showTaskModal" (click)="closeModals()">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModals()">✕</button>
        <h3 class="modal-title">{{ editingTask ? 'Edit Task' : 'Create New Task' }}</h3>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label-sm">Title</label>
            <input class="sentinel-input" type="text" [(ngModel)]="taskForm.title" placeholder="Task title"/>
          </div>
          <div class="form-group">
            <label class="form-label-sm">Description</label>
            <textarea class="sentinel-input" rows="3" [(ngModel)]="taskForm.description" placeholder="Task description..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label-sm">Priority</label>
              <select class="sentinel-input" [(ngModel)]="taskForm.priority">
                <option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label-sm">Assign To</label>
              <select class="sentinel-input" [(ngModel)]="taskForm.assignedTo">
                <option value="">Unassigned</option>
                <option *ngFor="let e of employees">{{ e.fullName }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label-sm">Due Date</label>
            <input class="sentinel-input" type="date" [(ngModel)]="taskForm.dueDate"/>
          </div>
          <div class="modal-actions">
            <button class="sentinel-btn" (click)="closeModals()">Cancel</button>
            <button class="sentinel-btn primary" (click)="saveTask()">{{ editingTask ? 'Save Changes' : 'Create Task' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Shift Modal -->
    <div class="modal-overlay" *ngIf="showShiftModal" (click)="closeModals()">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModals()">✕</button>
        <h3 class="modal-title">{{ editingShift ? 'Edit Shift' : 'Create New Shift' }}</h3>
        <div class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label-sm">Date</label>
              <input class="sentinel-input" type="date" [(ngModel)]="shiftForm.date"/>
            </div>
            <div class="form-group">
              <label class="form-label-sm">Employee</label>
              <select class="sentinel-input" [(ngModel)]="shiftForm.employee">
                <option *ngFor="let e of employees">{{ e.fullName }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label-sm">Start Time</label>
              <input class="sentinel-input" type="time" [(ngModel)]="shiftForm.startTime"/>
            </div>
            <div class="form-group">
              <label class="form-label-sm">End Time</label>
              <input class="sentinel-input" type="time" [(ngModel)]="shiftForm.endTime"/>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label-sm">Location / Zone</label>
            <input class="sentinel-input" type="text" [(ngModel)]="shiftForm.location" placeholder="Sector A, Gate B..."/>
          </div>
          <div class="modal-actions">
            <button class="sentinel-btn" (click)="closeModals()">Cancel</button>
            <button class="sentinel-btn primary" (click)="saveShift()">{{ editingShift ? 'Save Changes' : 'Create Shift' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-role.admin { color: var(--s-red); }
    .admin-av { background: linear-gradient(135deg, var(--s-red), var(--s-purple)) !important; }
    .nav-badge.alert { background: var(--s-red); }

    /* Sidebar stats */
    .sidebar-stats {
      margin: 0 12px 16px; padding: 16px;
      border: 1px solid var(--s-border); border-radius: var(--radius);
      background: var(--s-panel);
    }
    .stats-title { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); letter-spacing: 0.15em; margin-bottom: 12px; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--s-border); font-size: 12px; color: var(--s-text-dim); }
    .stat-row:last-child { border-bottom: none; }
    .stat-val { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--s-white); }
    .stat-val.green { color: var(--s-green); }
    .stat-val.red { color: var(--s-red); }
    .stat-val.cyan { color: var(--s-cyan); }

    /* Page Header */
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .page-tag { font-family: var(--font-mono); font-size: 11px; color: var(--s-red); letter-spacing: 0.2em; margin-bottom: 4px; }
    .page-title { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--s-white); letter-spacing: 0.05em; }
    .live-indicator { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); letter-spacing: 0.1em; padding-top: 24px; }

    /* KPI Grid */
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .kpi-card {
      display: flex; align-items: center; gap: 16px;
      padding: 20px; background: var(--s-panel); border: 1px solid var(--s-border);
      border-radius: var(--radius); transition: border-color 0.2s;
    }
    .kpi-card:hover { border-color: rgba(0,212,255,0.3); }
    .kpi-icon {
      width: 48px; height: 48px; border-radius: 4px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .kpi-icon.green { background: rgba(0,255,136,0.1); color: var(--s-green); border: 1px solid rgba(0,255,136,0.2); }
    .kpi-icon.red { background: rgba(255,59,92,0.1); color: var(--s-red); border: 1px solid rgba(255,59,92,0.2); }
    .kpi-icon.amber { background: rgba(255,184,0,0.1); color: var(--s-amber); border: 1px solid rgba(255,184,0,0.2); }
    .kpi-icon.cyan { background: rgba(0,212,255,0.1); color: var(--s-cyan); border: 1px solid rgba(0,212,255,0.2); }
    .kpi-val { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: var(--s-white); line-height: 1; }
    .kpi-val.red { color: var(--s-red); }
    .kpi-val.amber { color: var(--s-amber); }
    .kpi-label { font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); margin-top: 4px; }

    /* Sensor Section */
    .section-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
    .toolbar-filters { display: flex; gap: 8px; }
    .toolbar-right { display: flex; gap: 12px; align-items: center; }
    .search-input { width: 240px; }
    .sub-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--s-white); letter-spacing: 0.08em; }
    .filter-btn { padding: 6px 14px; border-radius: 2px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; background: var(--s-panel); border: 1px solid var(--s-border); color: var(--s-text-dim); cursor: pointer; transition: all 0.2s; }
    .filter-btn.active, .filter-btn:hover { border-color: var(--s-cyan); color: var(--s-cyan); background: rgba(0,212,255,0.08); }
    .sensor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .sensor-card {
      padding: 20px; border: 1px solid var(--s-border);
      border-radius: var(--radius); background: var(--s-panel);
      transition: all 0.2s;
    }
    .sensor-card.sensor-online { border-left: 2px solid var(--s-green); }
    .sensor-card.sensor-offline { border-left: 2px solid var(--s-text-muted); opacity: 0.7; }
    .sensor-card.sensor-alert { border-left: 2px solid var(--s-red); background: rgba(255,59,92,0.04); }
    .sensor-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .sensor-status { display: flex; align-items: center; gap: 8px; }
    .sensor-id { font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); }
    .sensor-name { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--s-white); margin-bottom: 4px; }
    .sensor-loc { font-size: 12px; color: var(--s-text-dim); display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
    .battery-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .battery-lbl { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); width: 40px; }
    .battery-track { flex: 1; height: 4px; background: var(--s-dark); border-radius: 2px; overflow: hidden; }
    .battery-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }
    .battery-pct { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-dim); width: 30px; text-align: right; }
    .sensor-ping { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); }
    .sensor-alerts { font-size: 11px; color: var(--s-red); display: flex; align-items: center; gap: 4px; margin-top: 6px; }

    /* Inform */
    .inform-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .broadcast-composer { display: flex; flex-direction: column; gap: 16px; }
    .card-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--s-text-dim); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
    .type-selector { display: flex; gap: 8px; }
    .type-btn {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 8px 12px; border-radius: 2px;
      font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
      background: var(--s-dark); border: 1px solid var(--s-border);
      color: var(--s-text-dim); cursor: pointer; transition: all 0.2s;
    }
    .type-btn.active.type-info { border-color: var(--s-cyan); color: var(--s-cyan); background: rgba(0,212,255,0.08); }
    .type-btn.active.type-urgent { border-color: var(--s-amber); color: var(--s-amber); background: rgba(255,184,0,0.08); }
    .type-btn.active.type-alert { border-color: var(--s-red); color: var(--s-red); background: rgba(255,59,92,0.08); }
    .toggle-group { display: flex; gap: 8px; }
    .toggle-btn { padding: 6px 16px; border-radius: 2px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; background: var(--s-dark); border: 1px solid var(--s-border); color: var(--s-text-dim); cursor: pointer; transition: all 0.2s; }
    .toggle-btn.active { border-color: var(--s-cyan); color: var(--s-cyan); background: rgba(0,212,255,0.08); }
    .broadcast-history { display: flex; flex-direction: column; gap: 16px; overflow-y: auto; max-height: 600px; }
    .history-item { padding: 16px; }
    .history-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
    .history-type { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .history-subject { flex: 1; font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--s-white); }
    .history-meta { font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); margin-bottom: 8px; }
    .history-body { font-size: 13px; color: var(--s-text-dim); line-height: 1.5; }
    .icon-alert { background: rgba(255,59,92,0.15); color: var(--s-red); }
    .icon-urgent { background: rgba(255,184,0,0.15); color: var(--s-amber); }
    .icon-info { background: rgba(0,212,255,0.15); color: var(--s-cyan); }

    /* Employee Table */
    .emp-cols { grid-template-columns: 2fr 2fr 1.5fr 1fr 1fr 1fr; }
    .emp-cell { display: flex; align-items: center; gap: 10px; }
    .emp-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--s-cyan), var(--s-purple)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 12px; font-weight: 700; color: var(--s-white); flex-shrink: 0; }
    .action-btns { display: flex; gap: 6px; }
    .action-btn { padding: 4px 10px; border-radius: 2px; font-family: var(--font-display); font-size: 11px; font-weight: 600; letter-spacing: 0.05em; background: none; border: 1px solid; cursor: pointer; transition: all 0.15s; }
    .action-btn.edit { border-color: var(--s-cyan); color: var(--s-cyan); }
    .action-btn.edit:hover { background: rgba(0,212,255,0.1); }
    .action-btn.delete { border-color: var(--s-red); color: var(--s-red); }
    .action-btn.delete:hover { background: rgba(255,59,92,0.1); }
    .small { font-size: 12px; }
    .data-table { border: 1px solid var(--s-border); border-radius: var(--radius); overflow: hidden; }
    .table-header, .table-row { display: grid; padding: 12px 20px; gap: 16px; align-items: center; }
    .table-header { background: var(--s-panel); font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid var(--s-border); }
    .table-row { background: var(--s-dark); font-size: 13px; border-bottom: 1px solid var(--s-border); transition: background 0.15s; }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover { background: rgba(0,212,255,0.03); }
    .mono { font-family: var(--font-mono); }

    /* Kanban Board */
    .tasks-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start; }
    .board-col { display: flex; flex-direction: column; gap: 12px; }
    .col-header { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: var(--s-panel); border: 1px solid var(--s-border); border-radius: var(--radius); font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--s-white); letter-spacing: 0.08em; text-transform: uppercase; }
    .col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .col-count { margin-left: auto; background: var(--s-border); border-radius: 10px; padding: 2px 8px; font-size: 11px; color: var(--s-text-dim); }
    .board-card { padding: 16px; background: var(--s-panel); border: 1px solid var(--s-border); border-radius: var(--radius); cursor: grab; transition: all 0.2s; }
    .board-card:hover { border-color: rgba(0,212,255,0.3); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
    .board-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .card-actions { display: flex; gap: 4px; }
    .board-card-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--s-white); margin-bottom: 6px; line-height: 1.3; }
    .board-card-desc { font-size: 12px; color: var(--s-text-dim); line-height: 1.5; margin-bottom: 12px; }
    .board-card-footer { display: flex; align-items: center; justify-content: space-between; }
    .card-assignee { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--s-text-dim); }
    .mini-avatar { width: 20px; height: 20px; border-radius: 50%; background: var(--s-purple); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; }
    .card-due { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); }

    /* Shift table */
    .shift-cols { grid-template-columns: 1.2fr 1.5fr 1.5fr 1.5fr 1fr 1.2fr; }

    /* Modals */
    .modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--s-white); letter-spacing: 0.05em; margin-bottom: 24px; }
    .modal-form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label-sm { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); letter-spacing: 0.1em; text-transform: uppercase; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
    select.sentinel-input option { background: var(--s-dark); }

    @media (max-width: 1100px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .inform-layout { grid-template-columns: 1fr; }
      .tasks-board { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeSection: AdminSection = 'status';
  sensorFilter = 'All';
  sensorFilters = ['All', 'Online', 'Alert', 'Offline'];
  empSearch = '';
  showEmpModal = false;
  showTaskModal = false;
  showShiftModal = false;
  editingEmp: Employee | null = null;
  editingTask: Task | null = null;
  editingShift: any = null;

  empForm: Partial<Employee> = { fullName: '', email: '', department: '', status: 'ACTIVE' };
  taskForm: Partial<Task & { assignedTo: string }> = { title: '', description: '', priority: 'MEDIUM', assignedTo: '', dueDate: '' };
  shiftForm: any = { date: '', startTime: '', endTime: '', location: '', employee: '' };

  broadcastForm = { type: 'INFO', subject: '', body: '', priority: 'STANDARD' };

  messageTypes = [
    { value: 'INFO', label: 'Info', icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>` },
    { value: 'URGENT', label: 'Urgent', icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
    { value: 'ALERT', label: 'Alert', icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>` },
  ];

  navItems = [
    { id: 'status' as AdminSection, label: 'Sentinel Status', badge: 2, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` },
    { id: 'inform' as AdminSection, label: 'Inform', badge: 0, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>` },
    { id: 'employees' as AdminSection, label: 'Employee Register', badge: 0, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>` },
    { id: 'tasks' as AdminSection, label: 'Task Oversight', badge: 0, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>` },
    { id: 'schedules' as AdminSection, label: 'Schedule CRUD', badge: 0, icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  ];

  get sectionTitle(): string {
    const map: Record<AdminSection, string> = {
      status: 'Sentinel Status', inform: 'Inform Employees',
      employees: 'Employee Register', tasks: 'Task Oversight', schedules: 'Schedule Management'
    };
    return map[this.activeSection];
  }

  sensors: SensorNode[] = [
    { id: 'SN-001', name: 'Main Gate Alpha', location: 'Sector A - Entrance', status: 'ONLINE', batteryLevel: 87, lastPing: '2s ago', alertCount: 0 },
    { id: 'SN-002', name: 'Server Room Core', location: 'Sector B - Interior', status: 'ALERT', batteryLevel: 23, lastPing: '1s ago', alertCount: 3 },
    { id: 'SN-003', name: 'Perimeter West', location: 'Outer Ring - West', status: 'ONLINE', batteryLevel: 62, lastPing: '5s ago', alertCount: 0 },
    { id: 'SN-004', name: 'Parking Lot Node', location: 'Sector C - Exterior', status: 'OFFLINE', batteryLevel: 0, lastPing: '4h ago', alertCount: 0 },
    { id: 'SN-005', name: 'Rooftop Scanner', location: 'Roof Level 1', status: 'ONLINE', batteryLevel: 94, lastPing: '3s ago', alertCount: 0 },
    { id: 'SN-006', name: 'Emergency Exit B', location: 'Sector D - South', status: 'ALERT', batteryLevel: 45, lastPing: '2s ago', alertCount: 1 },
    { id: 'SN-007', name: 'Lobby Monitor', location: 'Main Building - Floor 1', status: 'ONLINE', batteryLevel: 78, lastPing: '4s ago', alertCount: 0 },
    { id: 'SN-008', name: 'Warehouse Zone', location: 'Sector E - Loading', status: 'OFFLINE', batteryLevel: 12, lastPing: '2h ago', alertCount: 0 },
  ];

  get filteredSensors(): SensorNode[] {
    if (this.sensorFilter === 'All') return this.sensors;
    return this.sensors.filter(s => s.status === this.sensorFilter.toUpperCase());
  }

  get onlineNodes() { return this.sensors.filter(s => s.status === 'ONLINE').length; }
  get offlineNodes() { return this.sensors.filter(s => s.status === 'OFFLINE').length; }
  get alertNodes() { return this.sensors.filter(s => s.status === 'ALERT').length; }
  get activeEmployees() { return this.employees.filter(e => e.status === 'ACTIVE').length; }

  employees: (Employee & { department: string; joinDate: string })[] = [
    { id: 1, fullName: 'Marcus Reeves', email: 'm.reeves@sentinel.io', role: 'EMPLOYEE', department: 'Zone A Security', status: 'ACTIVE', joinDate: '2023-03-15', avatar: '' },
    { id: 2, fullName: 'Priya Okoye', email: 'p.okoye@sentinel.io', role: 'EMPLOYEE', department: 'Server Room', status: 'ACTIVE', joinDate: '2022-11-01', avatar: '' },
    { id: 3, fullName: 'Lena Strauss', email: 'l.strauss@sentinel.io', role: 'EMPLOYEE', department: 'Perimeter Patrol', status: 'INACTIVE', joinDate: '2021-06-20', avatar: '' },
    { id: 4, fullName: 'Carlos Bautista', email: 'c.bautista@sentinel.io', role: 'EMPLOYEE', department: 'IoT Maintenance', status: 'ACTIVE', joinDate: '2024-01-10', avatar: '' },
    { id: 5, fullName: 'Yuki Tanaka', email: 'y.tanaka@sentinel.io', role: 'EMPLOYEE', department: 'Night Shift', status: 'ACTIVE', joinDate: '2023-08-05', avatar: '' },
  ];

  get filteredEmployees() {
    if (!this.empSearch) return this.employees;
    const q = this.empSearch.toLowerCase();
    return this.employees.filter(e =>
      e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
    );
  }

  adminTasks: (Task & { assignedTo: string })[] = [
    { id: 1, title: 'Inspect SN-002 Server Room', description: 'Critical alert on server room sensor. Physical inspection required.', priority: 'CRITICAL', status: 'PENDING', assignedTo: 'Priya Okoye', dueDate: 'Today 14:00' },
    { id: 2, title: 'Replace SN-004 Battery', description: 'Parking lot node has gone offline. Battery replacement needed.', priority: 'HIGH', status: 'IN_PROGRESS', assignedTo: 'Carlos Bautista', dueDate: 'Today 16:00' },
    { id: 3, title: 'Firmware Update — Zone A', description: 'Roll out firmware 4.2.1 to all Zone A nodes.', priority: 'MEDIUM', status: 'PENDING', assignedTo: 'Carlos Bautista', dueDate: 'Tomorrow' },
    { id: 4, title: 'Night Shift Briefing', description: 'Conduct briefing on new escalation procedures.', priority: 'HIGH', status: 'DONE', assignedTo: 'Yuki Tanaka', dueDate: 'Yesterday' },
    { id: 5, title: 'Compile Weekly Report', description: 'Aggregate all incident logs and sensor data for weekly board report.', priority: 'MEDIUM', status: 'IN_PROGRESS', assignedTo: 'Marcus Reeves', dueDate: 'Friday' },
  ];

  taskColumns = [
    { label: 'Pending', status: 'PENDING', color: 'var(--s-amber)' },
    { label: 'In Progress', status: 'IN_PROGRESS', color: 'var(--s-cyan)' },
    { label: 'Done', status: 'DONE', color: 'var(--s-green)' },
  ];

  getTasksByStatus(status: string) {
    return this.adminTasks.filter(t => t.status === status);
  }

  allShifts: any[] = [
    { id: 1, date: '2025-01-15', startTime: '08:00', endTime: '16:00', location: 'Sector A - Main Gate', employee: 'Marcus Reeves', status: 'ACTIVE' },
    { id: 2, date: '2025-01-15', startTime: '16:00', endTime: '00:00', location: 'Server Room', employee: 'Priya Okoye', status: 'SCHEDULED' },
    { id: 3, date: '2025-01-16', startTime: '00:00', endTime: '08:00', location: 'Perimeter Patrol', employee: 'Yuki Tanaka', status: 'SCHEDULED' },
    { id: 4, date: '2025-01-14', startTime: '08:00', endTime: '16:00', location: 'IoT Maintenance', employee: 'Carlos Bautista', status: 'COMPLETED' },
  ];

  broadcastHistory = [
    { subject: 'ALERT: Anomaly in Zone D', type: 'ALERT', recipients: 24, timestamp: '2025-01-15 03:42', body: 'Unauthorized access detected on sensor D-04. All Zone D personnel to sweep immediately.' },
    { subject: 'Maintenance Window Jan 20', type: 'INFO', recipients: 24, timestamp: '2025-01-14 09:00', body: 'Sector A nodes will be offline Jan 20 02:00–06:00 for firmware updates. Manual patrols required.' },
  ];

  openEmpModal() { this.editingEmp = null; this.empForm = { fullName: '', email: '', department: '', status: 'ACTIVE' }; this.showEmpModal = true; }
  editEmployee(e: any) { this.editingEmp = e; this.empForm = { ...e }; this.showEmpModal = true; }
  saveEmployee() {
    if (this.editingEmp) {
      Object.assign(this.editingEmp, this.empForm);
    } else {
      this.employees.push({ id: Date.now(), role: 'EMPLOYEE', joinDate: new Date().toISOString().split('T')[0], avatar: '', ...this.empForm } as any);
    }
    this.closeModals();
  }
  deleteEmployee(e: any) { if (confirm(`Delete ${e.fullName}?`)) this.employees = this.employees.filter(emp => emp.id !== e.id); }

  openTaskModal() { this.editingTask = null; this.taskForm = { title: '', description: '', priority: 'MEDIUM', assignedTo: '', dueDate: '' }; this.showTaskModal = true; }
  editTask(t: any) { this.editingTask = t; this.taskForm = { ...t }; this.showTaskModal = true; }
  saveTask() {
    if (this.editingTask) {
      Object.assign(this.editingTask, this.taskForm);
    } else {
      this.adminTasks.push({ id: Date.now(), status: 'PENDING', ...this.taskForm } as any);
    }
    this.closeModals();
  }
  deleteTask(t: any) { this.adminTasks.splice(this.adminTasks.indexOf(t), 1); }

  openShiftModal() { this.editingShift = null; this.shiftForm = { date: '', startTime: '', endTime: '', location: '', employee: '' }; this.showShiftModal = true; }
  editShift(s: any) { this.editingShift = s; this.shiftForm = { ...s }; this.showShiftModal = true; }
  saveShift() {
    if (this.editingShift) {
      Object.assign(this.editingShift, this.shiftForm);
    } else {
      this.allShifts.push({ id: Date.now(), status: 'SCHEDULED', ...this.shiftForm });
    }
    this.closeModals();
  }
  deleteShift(s: any) { if (confirm('Delete this shift?')) this.allShifts = this.allShifts.filter(sh => sh !== s); }

  closeModals() { this.showEmpModal = false; this.showTaskModal = false; this.showShiftModal = false; }

  sendBroadcast() {
    if (!this.broadcastForm.subject || !this.broadcastForm.body) return;
    this.broadcastHistory.unshift({
      subject: this.broadcastForm.subject,
      type: this.broadcastForm.type,
      recipients: this.employees.length,
      timestamp: new Date().toLocaleString(),
      body: this.broadcastForm.body,
    });
    this.broadcastForm = { type: 'INFO', subject: '', body: '', priority: 'STANDARD' };
    alert('Broadcast sent to all employees successfully.');
  }

  constructor(public auth: AuthService, private svc: DashboardService) {}
  ngOnInit(): void { this.navItems[0].badge = this.alertNodes; }
}
