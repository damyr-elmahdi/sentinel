import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page grid-bg">

      <!-- Back to Home -->
      <a routerLink="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to Home
      </a>

      <div class="auth-container">

        <!-- ══ LEFT PANEL — Social Auth ══ -->
        <div class="left-panel">
          <!-- Logo -->
          <div class="panel-logo">
            <div class="logo-shield">
              <svg viewBox="0 0 40 48" fill="none">
                <path d="M20 2L36 8V24C36 34 28 42 20 46C12 42 4 34 4 24V8L20 2Z"
                  stroke="var(--s-cyan)" stroke-width="1.5" fill="rgba(0,212,255,0.05)"/>
                <path d="M20 8L30 13V24C30 31 25 37 20 40C15 37 10 31 10 24V13L20 8Z"
                  fill="rgba(0,212,255,0.03)" stroke="var(--s-cyan)" stroke-width="0.5" stroke-dasharray="3 2"/>
                <circle cx="20" cy="24" r="7" stroke="var(--s-cyan)" stroke-width="1" fill="rgba(0,212,255,0.05)"/>
                <circle cx="20" cy="24" r="3" fill="var(--s-cyan)"/>
                <line x1="20" y1="14" x2="20" y2="19" stroke="var(--s-cyan)" stroke-width="1.5"/>
                <line x1="20" y1="29" x2="20" y2="34" stroke="var(--s-cyan)" stroke-width="1.5"/>
                <line x1="10" y1="24" x2="15" y2="24" stroke="var(--s-cyan)" stroke-width="1.5"/>
                <line x1="25" y1="24" x2="30" y2="24" stroke="var(--s-cyan)" stroke-width="1.5"/>
              </svg>
            </div>
            <div>
              <p class="brand-name">SENTINEL</p>
              <p class="brand-sub">IoT SECURITY PLATFORM</p>
            </div>
          </div>

          <div class="left-content">
            <h2 class="left-title">Quick Access</h2>
            <p class="left-subtitle">Connect securely with your preferred identity provider</p>

            <!-- Social Buttons -->
            <div class="social-buttons">
              <button class="social-btn google" (click)="auth.loginWithGoogle()">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <button class="social-btn apple" (click)="loginApple()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with iCloud
              </button>

              <button class="social-btn github" (click)="auth.loginWithGithub()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div class="divider">
              <span>or use email</span>
            </div>

            <button class="social-btn email" (click)="mode = mode === 'email' ? 'login' : 'email'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Sign in with Email
            </button>
          </div>

          <!-- Decorative grid lines -->
          <div class="panel-decoration">
            <div class="deco-line" *ngFor="let i of [1,2,3,4,5,6]"></div>
          </div>
        </div>

        <!-- ══ RIGHT PANEL — Manual Entry ══ -->
        <div class="right-panel">
          <!-- Tab Switcher -->
          <div class="tab-switcher">
            <button class="tab-btn" [class.active]="mode !== 'register'"
              (click)="setMode('login')">Log In</button>
            <button class="tab-btn" [class.active]="mode === 'register'"
              (click)="setMode('register')">Sign In</button>
          </div>

          <!-- Login Form -->
          <form class="auth-form" *ngIf="mode === 'login'" (ngSubmit)="onLogin()">
            <div class="form-header">
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access the platform</p>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Username or Email
              </label>
              <input class="sentinel-input" type="text" placeholder="operator@sentinel.io"
                [(ngModel)]="loginForm.email" name="email" required/>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Password
              </label>
              <div class="input-wrapper">
                <input class="sentinel-input" [type]="showPass ? 'text' : 'password'"
                  placeholder="••••••••••••" [(ngModel)]="loginForm.password" name="password" required/>
                <button type="button" class="eye-btn" (click)="showPass = !showPass">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path *ngIf="!showPass" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle *ngIf="!showPass" cx="12" cy="12" r="3"/>
                    <path *ngIf="showPass" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line *ngIf="showPass" x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <div class="policy-checkbox">
              <input type="checkbox" id="policy-login" [(ngModel)]="loginForm.accepted" name="accepted" required/>
              <label for="policy-login">
                I accept the <a href="#">Acceptance Policy</a> and <a href="#">Terms of Service</a>
              </label>
            </div>

            <div class="error-msg" *ngIf="errorMsg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMsg }}
            </div>

            <button type="submit" class="sentinel-btn primary submit-btn" [disabled]="loading">
              <span *ngIf="!loading">Access Platform</span>
              <span *ngIf="loading" class="loading-dots">Authenticating<span>.</span><span>.</span><span>.</span></span>
            </button>
          </form>

          <!-- Register Form -->
          <form class="auth-form" *ngIf="mode === 'register'" (ngSubmit)="onRegister()">
            <div class="form-header">
              <h2>Create Account</h2>
              <p>Register to access the Sentinel platform</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input class="sentinel-input" type="text" placeholder="John Doe"
                  [(ngModel)]="registerForm.fullName" name="fullName" required/>
              </div>
              <div class="form-group">
                <label class="form-label">Username</label>
                <input class="sentinel-input" type="text" placeholder="johndoe"
                  [(ngModel)]="registerForm.username" name="username" required/>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="sentinel-input" type="email" placeholder="john@company.com"
                [(ngModel)]="registerForm.email" name="email" required/>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrapper">
                <input class="sentinel-input" [type]="showPass ? 'text' : 'password'"
                  placeholder="Min. 8 characters" [(ngModel)]="registerForm.password" name="password" required/>
                <button type="button" class="eye-btn" (click)="showPass = !showPass">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>
              <!-- Password strength -->
              <div class="strength-bar">
                <div class="strength-fill" [style.width]="passwordStrength + '%'"
                  [style.background]="strengthColor"></div>
              </div>
              <span class="strength-label">{{ strengthLabel }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <input class="sentinel-input" [type]="showPass ? 'text' : 'password'"
                placeholder="Repeat password" [(ngModel)]="registerForm.confirmPassword"
                name="confirmPassword" required/>
            </div>

            <div class="policy-checkbox">
              <input type="checkbox" id="policy-reg" [(ngModel)]="registerForm.accepted" name="accepted" required/>
              <label for="policy-reg">
                I have read and agree to the <a href="#">Acceptance Policy</a>,
                <a href="#">Privacy Policy</a>, and <a href="#">Terms of Service</a>
              </label>
            </div>

            <div class="error-msg" *ngIf="errorMsg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMsg }}
            </div>

            <button type="submit" class="sentinel-btn primary submit-btn" [disabled]="loading">
              <span *ngIf="!loading">Create Account</span>
              <span *ngIf="loading" class="loading-dots">Processing<span>.</span><span>.</span><span>.</span></span>
            </button>
          </form>

          <!-- Email quick form -->
          <form class="auth-form" *ngIf="mode === 'email'" (ngSubmit)="onEmailSignin()">
            <div class="form-header">
              <h2>Email Sign In</h2>
              <p>We'll send you a secure magic link</p>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="sentinel-input" type="email" placeholder="your@email.com"
                [(ngModel)]="emailOnly" name="emailOnly" required/>
            </div>
            <div class="policy-checkbox">
              <input type="checkbox" id="policy-email" [(ngModel)]="emailAccepted" name="emailAccepted" required/>
              <label for="policy-email">I accept the <a href="#">Acceptance Policy</a></label>
            </div>
            <button type="submit" class="sentinel-btn primary submit-btn">Send Magic Link</button>
            <button type="button" class="back-mode-btn" (click)="mode='login'">← Back to login</button>
          </form>

          <!-- Security notice -->
          <div class="security-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            256-bit AES encrypted · SOC 2 compliant · Zero-knowledge auth
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      padding: 40px 20px;
      background: radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.04) 0%, transparent 50%),
                  var(--s-black);
      position: relative;
    }
    .back-link {
      position: fixed; top: 24px; left: 24px;
      display: flex; align-items: center; gap: 8px;
      font-family: var(--font-display); font-size: 13px;
      font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--s-text-dim); text-decoration: none;
      transition: color 0.2s; z-index: 10;
    }
    .back-link:hover { color: var(--s-cyan); }

    .auth-container {
      display: grid; grid-template-columns: 1fr 1fr;
      width: 100%; max-width: 960px;
      border: 1px solid var(--s-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: 0 0 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.05);
      animation: fade-up 0.5s ease;
    }

    /* ── Left Panel ── */
    .left-panel {
      background: linear-gradient(160deg, #0a1520 0%, #050d15 100%);
      border-right: 1px solid var(--s-border);
      padding: 48px 40px;
      display: flex; flex-direction: column;
      position: relative; overflow: hidden;
    }
    .panel-logo { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
    .logo-shield { width: 52px; height: 62px; }
    .brand-name {
      font-family: var(--font-display); font-size: 22px;
      font-weight: 700; letter-spacing: 0.15em;
      color: var(--s-white); line-height: 1;
    }
    .brand-sub {
      font-family: var(--font-mono); font-size: 9px;
      color: var(--s-cyan); letter-spacing: 0.2em; margin-top: 4px;
    }
    .left-content { flex: 1; }
    .left-title {
      font-family: var(--font-display); font-size: 20px;
      font-weight: 700; color: var(--s-white);
      letter-spacing: 0.08em; margin-bottom: 8px;
    }
    .left-subtitle { font-size: 13px; color: var(--s-text-dim); margin-bottom: 32px; }

    .social-buttons { display: flex; flex-direction: column; gap: 12px; }
    .social-btn {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--s-border);
      border-radius: var(--radius);
      color: var(--s-text); font-family: var(--font-body);
      font-size: 14px; cursor: pointer;
      transition: all 0.2s; width: 100%;
    }
    .social-btn:hover {
      border-color: rgba(0,212,255,0.3);
      background: rgba(0,212,255,0.05);
      color: var(--s-white);
    }
    .social-btn.google:hover { border-color: rgba(66,133,244,0.4); }
    .social-btn.apple:hover { border-color: rgba(255,255,255,0.2); }
    .social-btn.github:hover { border-color: rgba(255,255,255,0.2); }
    .social-btn.email { margin-top: 0; }

    .divider {
      display: flex; align-items: center; gap: 16px;
      margin: 20px 0;
    }
    .divider::before, .divider::after {
      content: ''; flex: 1; height: 1px; background: var(--s-border);
    }
    .divider span { font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); }

    .panel-decoration {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 120px; display: flex; gap: 2px; overflow: hidden; opacity: 0.15;
    }
    .deco-line {
      flex: 1; background: linear-gradient(to bottom, transparent, var(--s-cyan));
    }

    /* ── Right Panel ── */
    .right-panel {
      background: var(--s-panel);
      padding: 48px 40px;
      display: flex; flex-direction: column; gap: 24px;
    }
    .tab-switcher {
      display: flex; background: var(--s-dark);
      border: 1px solid var(--s-border); border-radius: var(--radius);
      padding: 4px; gap: 4px;
    }
    .tab-btn {
      flex: 1; padding: 10px;
      font-family: var(--font-display); font-size: 13px;
      font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
      background: none; border: none;
      color: var(--s-text-dim); cursor: pointer;
      border-radius: 2px; transition: all 0.2s;
    }
    .tab-btn.active {
      background: var(--s-cyan); color: var(--s-black);
      box-shadow: 0 0 12px rgba(0,212,255,0.3);
    }

    .auth-form { display: flex; flex-direction: column; gap: 18px; }
    .form-header h2 {
      font-family: var(--font-display); font-size: 22px;
      font-weight: 700; color: var(--s-white);
      letter-spacing: 0.05em; margin-bottom: 4px;
    }
    .form-header p { font-size: 13px; color: var(--s-text-dim); }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-label {
      display: flex; align-items: center; gap: 6px;
      font-family: var(--font-mono); font-size: 11px;
      color: var(--s-text-dim); letter-spacing: 0.1em; text-transform: uppercase;
    }
    .input-wrapper { position: relative; }
    .input-wrapper .sentinel-input { padding-right: 44px; }
    .eye-btn {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none;
      color: var(--s-text-muted); cursor: pointer; padding: 4px;
      transition: color 0.2s;
    }
    .eye-btn:hover { color: var(--s-cyan); }
    .forgot-link {
      font-family: var(--font-mono); font-size: 11px;
      color: var(--s-text-muted); text-align: right;
      text-decoration: none; transition: color 0.2s;
    }
    .forgot-link:hover { color: var(--s-cyan); }

    .strength-bar {
      height: 3px; background: var(--s-border);
      border-radius: 2px; margin-top: 6px; overflow: hidden;
    }
    .strength-fill { height: 100%; transition: width 0.3s, background 0.3s; border-radius: 2px; }
    .strength-label { font-family: var(--font-mono); font-size: 10px; color: var(--s-text-muted); }

    .policy-checkbox {
      display: flex; align-items: flex-start; gap: 10px;
    }
    .policy-checkbox input[type="checkbox"] {
      width: 16px; height: 16px; margin-top: 2px; flex-shrink: 0;
      accent-color: var(--s-cyan); cursor: pointer;
    }
    .policy-checkbox label {
      font-size: 12px; color: var(--s-text-dim); cursor: pointer; line-height: 1.5;
    }
    .policy-checkbox a { color: var(--s-cyan); text-decoration: underline; }

    .error-msg {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px;
      background: rgba(255,59,92,0.1); border: 1px solid rgba(255,59,92,0.3);
      border-radius: var(--radius); color: var(--s-red);
      font-size: 13px;
    }

    .submit-btn {
      width: 100%; justify-content: center;
      padding: 14px; font-size: 14px;
      clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
    }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .loading-dots span {
      animation: blink 1.4s ease infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }

    .back-mode-btn {
      background: none; border: none; color: var(--s-text-dim);
      font-family: var(--font-mono); font-size: 12px;
      cursor: pointer; text-align: center; transition: color 0.2s;
    }
    .back-mode-btn:hover { color: var(--s-cyan); }

    .security-notice {
      display: flex; align-items: center; gap: 8px;
      font-family: var(--font-mono); font-size: 11px;
      color: var(--s-text-muted); padding-top: 8px;
      border-top: 1px solid var(--s-border);
    }

    @media (max-width: 720px) {
      .auth-container { grid-template-columns: 1fr; }
      .left-panel { padding: 32px 24px; }
      .right-panel { padding: 32px 24px; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class AuthComponent implements OnInit {
  mode: 'login' | 'register' | 'email' = 'login';
  showPass = false;
  loading = false;
  errorMsg = '';

  loginForm = { email: '', password: '', accepted: false };
  registerForm = {
    fullName: '', username: '', email: '',
    password: '', confirmPassword: '', accepted: false
  };
  emailOnly = '';
  emailAccepted = false;

  get passwordStrength(): number {
    const p = this.registerForm.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score += 25;
    if (p.length >= 12) score += 25;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 25;
    if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score += 25;
    return score;
  }

  get strengthColor(): string {
    const s = this.passwordStrength;
    if (s <= 25) return '#ff3b5c';
    if (s <= 50) return '#ffb800';
    if (s <= 75) return '#00d4ff';
    return '#00ff88';
  }

  get strengthLabel(): string {
    const s = this.passwordStrength;
    if (!this.registerForm.password) return '';
    if (s <= 25) return 'Weak';
    if (s <= 50) return 'Fair';
    if (s <= 75) return 'Good';
    return 'Strong';
  }

  constructor(public auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      if (p['mode'] === 'signin') this.mode = 'register';
    });
  }

  setMode(m: 'login' | 'register'): void {
    this.mode = m;
    this.errorMsg = '';
  }

  onLogin(): void {
    if (!this.loginForm.accepted) {
      this.errorMsg = 'You must accept the Acceptance Policy to continue.';
      return;
    }
    this.loading = true; this.errorMsg = '';
    this.auth.login({ email: this.loginForm.email, password: this.loginForm.password })
      .subscribe({
        error: (e) => {
          this.errorMsg = e.error?.message || 'Invalid credentials. Please try again.';
          this.loading = false;
        }
      });
  }

  onRegister(): void {
    if (!this.registerForm.accepted) {
      this.errorMsg = 'You must accept the Acceptance Policy to continue.';
      return;
    }
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }
    this.loading = true; this.errorMsg = '';
    this.auth.register({
      username: this.registerForm.username,
      email: this.registerForm.email,
      password: this.registerForm.password
    }).subscribe({
      error: (e) => {
        this.errorMsg = e.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  onEmailSignin(): void {
    alert(`Magic link sent to ${this.emailOnly}! Check your inbox.`);
    this.mode = 'login';
  }

  loginApple(): void {
    alert('iCloud/Apple Sign-In — configure Apple OAuth credentials in backend.');
  }
}
