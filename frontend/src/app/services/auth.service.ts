import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'EMPLOYEE' | 'ADMIN';
  fullName: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('sentinel_token');
    const user = localStorage.getItem('sentinel_user');
    if (token && user) {
      this.token.set(token);
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, credentials).pipe(
      tap((res) => this.setSession(res))
    );
  }

  register(data: { username: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/register`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.API}/oauth2/authorization/google`;
  }

  loginWithGithub(): void {
    window.location.href = `${this.API}/oauth2/authorization/github`;
  }

  private setSession(res: AuthResponse): void {
    this.token.set(res.token);
    this.currentUser.set(res.user);
    localStorage.setItem('sentinel_token', res.token);
    localStorage.setItem('sentinel_user', JSON.stringify(res.user));
    const route = res.user.role === 'ADMIN' ? '/admin' : '/dashboard';
    this.router.navigate([route]);
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('sentinel_token');
    localStorage.removeItem('sentinel_user');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }
}
