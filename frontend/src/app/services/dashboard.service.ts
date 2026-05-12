import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  assignedTo?: string;
  dueDate: string;
}

export interface Message {
  id: number;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: 'ALERT' | 'INFO' | 'BROADCAST';
}

export interface SensorNode {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'ALERT';
  batteryLevel: number;
  lastPing: string;
  alertCount: number;
}

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;
  avatar?: string;
}

export interface TimeLog {
  id: number;
  employeeId: number;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Employee endpoints
  getMyShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.API}/employee/shifts`);
  }

  clockIn(): Observable<TimeLog> {
    return this.http.post<TimeLog>(`${this.API}/employee/timelog/clockin`, {});
  }

  clockOut(): Observable<TimeLog> {
    return this.http.post<TimeLog>(`${this.API}/employee/timelog/clockout`, {});
  }

  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/employee/tasks`);
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.API}/employee/tasks/${taskId}`, { status });
  }

  getMyMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.API}/employee/messages`);
  }

  markMessageRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API}/employee/messages/${id}/read`, {});
  }

  // Admin endpoints
  getSensorNodes(): Observable<SensorNode[]> {
    return this.http.get<SensorNode[]>(`${this.API}/admin/sensors`);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.API}/admin/employees`);
  }

  createEmployee(emp: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${this.API}/admin/employees`, emp);
  }

  updateEmployee(id: number, emp: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.API}/admin/employees/${id}`, emp);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/admin/employees/${id}`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API}/admin/tasks`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.API}/admin/tasks`, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API}/admin/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/admin/tasks/${id}`);
  }

  getAllShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.API}/admin/schedules`);
  }

  createShift(shift: Partial<Shift>): Observable<Shift> {
    return this.http.post<Shift>(`${this.API}/admin/schedules`, shift);
  }

  updateShift(id: number, shift: Partial<Shift>): Observable<Shift> {
    return this.http.put<Shift>(`${this.API}/admin/schedules/${id}`, shift);
  }

  deleteShift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/admin/schedules/${id}`);
  }

  broadcastMessage(msg: { subject: string; body: string }): Observable<void> {
    return this.http.post<void>(`${this.API}/admin/broadcast`, msg);
  }
}
