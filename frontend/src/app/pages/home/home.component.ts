import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ══ HEADER ══ -->
    <header class="header" [class.scrolled]="scrolled">
      <div class="header-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <div class="logo-shield">
            <svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L36 8V24C36 34 28 42 20 46C12 42 4 34 4 24V8L20 2Z"
                stroke="currentColor" stroke-width="1.5" fill="none"/>
              <path d="M20 6L32 11V24C32 32 26 39 20 43C14 39 8 32 8 24V11L20 6Z"
                fill="rgba(0,212,255,0.05)" stroke="currentColor" stroke-width="0.5"/>
              <circle cx="20" cy="24" r="6" fill="currentColor" opacity="0.8"/>
              <circle cx="20" cy="24" r="3" fill="var(--s-black)"/>
              <line x1="20" y1="12" x2="20" y2="17" stroke="currentColor" stroke-width="1.5"/>
              <line x1="20" y1="31" x2="20" y2="36" stroke="currentColor" stroke-width="1.5"/>
              <line x1="12" y1="24" x2="17" y2="24" stroke="currentColor" stroke-width="1.5"/>
              <line x1="23" y1="24" x2="28" y2="24" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">SENTINEL</span>
            <span class="logo-sub">IoT SECURITY</span>
          </div>
        </a>

        <!-- Nav -->
        <nav class="nav-links">
          <a href="#home" class="nav-link">Home</a>
          <a href="#about" class="nav-link">About</a>
          <a href="#partners" class="nav-link">Partners</a>
          <a href="#contact" class="nav-link">Contact</a>
        </nav>

        <!-- Auth Buttons -->
        <div class="header-actions">
          <a routerLink="/auth" [queryParams]="{mode:'signin'}" class="sentinel-btn">Sign In</a>
          <a routerLink="/auth" [queryParams]="{mode:'login'}" class="sentinel-btn primary">Log In</a>
        </div>

        <!-- Mobile toggle -->
        <button class="mobile-toggle" (click)="mobileMenuOpen = !mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <a href="#home" class="nav-link" (click)="mobileMenuOpen=false">Home</a>
        <a href="#about" class="nav-link" (click)="mobileMenuOpen=false">About</a>
        <a href="#partners" class="nav-link" (click)="mobileMenuOpen=false">Partners</a>
        <a href="#contact" class="nav-link" (click)="mobileMenuOpen=false">Contact</a>
        <a routerLink="/auth" class="sentinel-btn" style="width:100%;justify-content:center">Sign In</a>
        <a routerLink="/auth" class="sentinel-btn primary" style="width:100%;justify-content:center">Log In</a>
      </div>
    </header>

    <!-- ══ HERO SECTION ══ -->
    <section id="home" class="hero grid-bg">
      <!-- Scan line animation -->
      <div class="scanline"></div>

      <!-- Corner decorations -->
      <div class="corner-tl"></div>
      <div class="corner-br"></div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="status-dot online"></span>
          SYSTEM OPERATIONAL — v4.2.1
        </div>

        <h1 class="hero-title">
          <span class="title-line">INTELLIGENT</span>
          <span class="title-line accent">IoT SECURITY</span>
          <span class="title-line">COMMAND CENTER</span>
        </h1>

        <p class="hero-description">
          Sentinel delivers enterprise-grade IoT protection through AI-powered threat detection,
          real-time sensor orchestration, and unified security management. Safeguard every connected
          device across your infrastructure from a single command interface.
        </p>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">99.97%</span>
            <span class="stat-label">Uptime SLA</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">&lt;50ms</span>
            <span class="stat-label">Threat Response</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">10K+</span>
            <span class="stat-label">Nodes Monitored</span>
          </div>
        </div>

        <div class="hero-ctas">
          <a routerLink="/auth" class="sentinel-btn primary large">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
            </svg>
            Access Platform
          </a>
          <a href="#about" class="sentinel-btn">
            Learn More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Hero Visualization -->
      <div class="hero-visual">
        <div class="network-ring ring-1"></div>
        <div class="network-ring ring-2"></div>
        <div class="network-ring ring-3"></div>
        <div class="shield-center">
          <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero-shield">
            <path d="M40 4L72 16V48C72 68 56 84 40 92C24 84 8 68 8 48V16L40 4Z"
              stroke="var(--s-cyan)" stroke-width="1.5" fill="rgba(0,212,255,0.03)"/>
            <path d="M40 12L64 22V48C64 64 52 78 40 86C28 78 16 64 16 48V22L40 12Z"
              stroke="var(--s-cyan)" stroke-width="0.5" fill="rgba(0,212,255,0.02)" stroke-dasharray="4 2"/>
            <circle cx="40" cy="48" r="16" stroke="var(--s-cyan)" stroke-width="1" fill="rgba(0,212,255,0.05)"/>
            <circle cx="40" cy="48" r="8" fill="rgba(0,212,255,0.1)" stroke="var(--s-cyan)" stroke-width="1.5"/>
            <circle cx="40" cy="48" r="3" fill="var(--s-cyan)"/>
            <!-- Crosshairs -->
            <line x1="40" y1="26" x2="40" y2="36" stroke="var(--s-cyan)" stroke-width="1.5"/>
            <line x1="40" y1="60" x2="40" y2="70" stroke="var(--s-cyan)" stroke-width="1.5"/>
            <line x1="18" y1="48" x2="28" y2="48" stroke="var(--s-cyan)" stroke-width="1.5"/>
            <line x1="52" y1="48" x2="62" y2="48" stroke="var(--s-cyan)" stroke-width="1.5"/>
          </svg>
        </div>
        <!-- Node dots -->
        <div class="node-dot" style="top:15%;left:20%"></div>
        <div class="node-dot" style="top:25%;right:15%"></div>
        <div class="node-dot" style="bottom:30%;left:10%"></div>
        <div class="node-dot" style="bottom:20%;right:25%"></div>
        <div class="node-dot alert" style="top:60%;left:30%"></div>
        <!-- Connection lines via SVG -->
        <svg class="connections-svg" viewBox="0 0 400 400" fill="none">
          <line x1="80" y1="60" x2="200" y2="200" stroke="rgba(0,212,255,0.2)" stroke-width="0.5" stroke-dasharray="4 4"/>
          <line x1="340" y1="100" x2="200" y2="200" stroke="rgba(0,212,255,0.2)" stroke-width="0.5" stroke-dasharray="4 4"/>
          <line x1="40" y1="280" x2="200" y2="200" stroke="rgba(0,212,255,0.2)" stroke-width="0.5" stroke-dasharray="4 4"/>
          <line x1="300" y1="320" x2="200" y2="200" stroke="rgba(0,212,255,0.2)" stroke-width="0.5" stroke-dasharray="4 4"/>
          <line x1="120" y1="240" x2="200" y2="200" stroke="rgba(255,59,92,0.3)" stroke-width="0.5" stroke-dasharray="4 4"/>
        </svg>
      </div>
    </section>

    <!-- ══ ABOUT SECTION ══ -->
    <section id="about" class="about-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">// ABOUT SENTINEL</span>
          <h2 class="section-title">Redefining IoT Security</h2>
          <p class="section-subtitle">
            Born from the need to protect increasingly complex connected infrastructures,
            Sentinel combines edge computing intelligence with centralized oversight.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card" *ngFor="let f of features">
            <div class="feature-icon" [innerHTML]="f.icon"></div>
            <h3>{{f.title}}</h3>
            <p>{{f.description}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ PARTNERS MARQUEE ══ -->
    <section id="partners" class="partners-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">// TRUSTED BY</span>
          <h2 class="section-title">Our Partners</h2>
        </div>
      </div>

      <div class="marquee-container">
        <div class="marquee-track">
          <div class="marquee-item" *ngFor="let p of partnersDouble">
            <div class="partner-logo">
              <span class="partner-initial">{{p.initial}}</span>
              <span class="partner-name">{{p.name}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="marquee-container reverse" style="margin-top: 16px;">
        <div class="marquee-track reverse">
          <div class="marquee-item" *ngFor="let p of partnersDouble2">
            <div class="partner-logo">
              <span class="partner-initial">{{p.initial}}</span>
              <span class="partner-name">{{p.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ CONTACT SECTION ══ -->
    <section id="contact" class="contact-section grid-bg">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">// GET IN TOUCH</span>
          <h2 class="section-title">Contact Us</h2>
          <p class="section-subtitle">Ready to secure your IoT infrastructure? Our team is standing by.</p>
        </div>

        <div class="contact-grid">
          <div class="contact-info">
            <div class="contact-item" *ngFor="let c of contactItems">
              <div class="contact-icon" [innerHTML]="c.icon"></div>
              <div>
                <p class="contact-label">{{c.label}}</p>
                <p class="contact-value">{{c.value}}</p>
              </div>
            </div>
          </div>

          <form class="contact-form" (submit)="submitContact($event)">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input class="sentinel-input" type="text" placeholder="John Doe" required/>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input class="sentinel-input" type="email" placeholder="john@company.com" required/>
              </div>
            </div>
            <div class="form-group">
              <label>Subject</label>
              <input class="sentinel-input" type="text" placeholder="Security consultation" required/>
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea class="sentinel-input" rows="5" placeholder="Tell us about your needs..."></textarea>
            </div>
            <button type="submit" class="sentinel-btn primary" style="width:100%;justify-content:center">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- ══ FOOTER ══ -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo">
            <div class="logo-shield small">
              <svg viewBox="0 0 40 48" fill="none">
                <path d="M20 2L36 8V24C36 34 28 42 20 46C12 42 4 34 4 24V8L20 2Z"
                  stroke="currentColor" stroke-width="1.5"/>
                <circle cx="20" cy="24" r="6" fill="currentColor" opacity="0.8"/>
                <circle cx="20" cy="24" r="3" fill="var(--s-black)"/>
              </svg>
            </div>
            <span class="logo-name">SENTINEL</span>
          </div>
          <p>Enterprise IoT Security Platform</p>
        </div>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Documentation</a>
          <a href="#">API Reference</a>
        </div>
        <p class="footer-copy">© 2025 Sentinel IoT Security. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    /* ── Header ── */
    .header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 0 40px;
      transition: background 0.3s, border-color 0.3s;
      border-bottom: 1px solid transparent;
    }
    .header.scrolled {
      background: rgba(5,7,9,0.95);
      backdrop-filter: blur(12px);
      border-color: var(--s-border);
    }
    .header-inner {
      max-width: 1280px; margin: 0 auto;
      height: 72px;
      display: flex; align-items: center; gap: 32px;
    }
    .logo { display: flex; align-items: center; gap: 12px; color: var(--s-cyan); text-decoration: none; }
    .logo-shield { width: 36px; height: 44px; color: var(--s-cyan); }
    .logo-shield.small { width: 28px; height: 34px; }
    .logo-text { display: flex; flex-direction: column; }
    .logo-name {
      font-family: var(--font-display);
      font-size: 20px; font-weight: 700;
      letter-spacing: 0.15em; color: var(--s-white);
      line-height: 1;
    }
    .logo-sub {
      font-family: var(--font-mono);
      font-size: 9px; color: var(--s-cyan);
      letter-spacing: 0.2em;
    }
    .nav-links { display: flex; gap: 32px; margin-left: auto; }
    .nav-link {
      font-family: var(--font-display);
      font-size: 13px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--s-text-dim); text-decoration: none;
      transition: color 0.2s; padding: 4px 0;
      position: relative;
    }
    .nav-link::after {
      content: ''; position: absolute;
      bottom: -2px; left: 0; width: 0; height: 1px;
      background: var(--s-cyan); transition: width 0.2s;
    }
    .nav-link:hover { color: var(--s-white); }
    .nav-link:hover::after { width: 100%; }
    .header-actions { display: flex; gap: 12px; margin-left: 24px; }
    .mobile-toggle {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 8px; margin-left: auto;
    }
    .mobile-toggle span {
      display: block; width: 24px; height: 1.5px;
      background: var(--s-cyan); transition: 0.2s;
    }
    .mobile-menu {
      display: none; flex-direction: column; gap: 16px;
      padding: 20px 0; border-top: 1px solid var(--s-border);
      background: rgba(5,7,9,0.98);
    }
    .mobile-menu.open { display: flex; }

    /* ── Hero ── */
    .hero {
      min-height: 100vh; padding-top: 72px;
      display: flex; align-items: center;
      position: relative; overflow: hidden;
      background: radial-gradient(ellipse at 60% 50%, rgba(0,212,255,0.04) 0%, transparent 60%),
                  var(--s-black);
    }
    .scanline {
      position: absolute; top: 0; left: 0; right: 0;
      height: 2px; background: linear-gradient(90deg, transparent, var(--s-cyan), transparent);
      opacity: 0.3; animation: scanline 6s linear infinite;
    }
    .corner-tl {
      position: absolute; top: 80px; left: 40px;
      width: 60px; height: 60px;
      border-top: 1px solid var(--s-cyan); border-left: 1px solid var(--s-cyan);
      opacity: 0.4;
    }
    .corner-br {
      position: absolute; bottom: 40px; right: 40px;
      width: 60px; height: 60px;
      border-bottom: 1px solid var(--s-cyan); border-right: 1px solid var(--s-cyan);
      opacity: 0.4;
    }
    .hero-content {
      max-width: 1280px; margin: 0 auto; padding: 80px 40px;
      width: 55%; animation: fade-up 0.8s ease forwards;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 10px;
      font-family: var(--font-mono); font-size: 12px;
      color: var(--s-cyan); letter-spacing: 0.1em;
      padding: 6px 16px;
      border: 1px solid rgba(0,212,255,0.3);
      border-radius: 2px; margin-bottom: 32px;
      background: rgba(0,212,255,0.05);
    }
    .hero-title { margin-bottom: 24px; }
    .title-line {
      display: block;
      font-family: var(--font-display);
      font-size: clamp(36px, 5vw, 72px);
      font-weight: 700; line-height: 1.05;
      letter-spacing: 0.05em;
      color: var(--s-white);
    }
    .title-line.accent { color: var(--s-cyan); }
    .hero-description {
      font-size: 16px; color: var(--s-text-dim);
      max-width: 520px; margin-bottom: 40px; line-height: 1.7;
    }
    .hero-stats {
      display: flex; align-items: center; gap: 24px; margin-bottom: 40px;
    }
    .stat { display: flex; flex-direction: column; }
    .stat-value {
      font-family: var(--font-display); font-size: 28px;
      font-weight: 700; color: var(--s-cyan); line-height: 1;
    }
    .stat-label {
      font-family: var(--font-mono); font-size: 11px;
      color: var(--s-text-muted); letter-spacing: 0.05em; margin-top: 4px;
    }
    .stat-divider { width: 1px; height: 48px; background: var(--s-border); }
    .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
    .sentinel-btn.large { padding: 14px 32px; font-size: 15px; }

    /* Hero Visual */
    .hero-visual {
      position: absolute; right: -60px; top: 50%;
      transform: translateY(-50%);
      width: 500px; height: 500px;
    }
    .network-ring {
      position: absolute; border-radius: 50%;
      border: 1px solid rgba(0,212,255,0.15);
      top: 50%; left: 50%; transform: translate(-50%,-50%);
    }
    .ring-1 { width: 180px; height: 180px; animation: spin 20s linear infinite; }
    .ring-2 { width: 300px; height: 300px; animation: spin 30s linear infinite reverse; border-style: dashed; }
    .ring-3 { width: 420px; height: 420px; animation: spin 45s linear infinite; opacity: 0.5; }
    @keyframes spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
    .shield-center {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 120px; height: 144px;
      filter: drop-shadow(0 0 20px rgba(0,212,255,0.3));
    }
    .hero-shield { width: 100%; height: 100%; }
    .node-dot {
      position: absolute; width: 10px; height: 10px;
      border-radius: 50%; background: var(--s-cyan);
      box-shadow: 0 0 8px var(--s-cyan);
      animation: pulse-dot 2s ease-in-out infinite;
    }
    .node-dot.alert { background: var(--s-red); box-shadow: 0 0 8px var(--s-red); }
    .connections-svg {
      position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
    }

    /* ── Section Commons ── */
    .section-inner { max-width: 1280px; margin: 0 auto; padding: 100px 40px; }
    .section-header { text-align: center; margin-bottom: 64px; }
    .section-tag {
      font-family: var(--font-mono); font-size: 12px;
      color: var(--s-cyan); letter-spacing: 0.2em;
      display: block; margin-bottom: 16px;
    }
    .section-title {
      font-family: var(--font-display); font-size: clamp(28px, 4vw, 48px);
      font-weight: 700; color: var(--s-white); margin-bottom: 16px;
    }
    .section-subtitle {
      font-size: 16px; color: var(--s-text-dim);
      max-width: 560px; margin: 0 auto; line-height: 1.7;
    }

    /* ── About / Features ── */
    .about-section { background: var(--s-dark); }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
    .feature-card {
      background: var(--s-panel); border: 1px solid var(--s-border);
      border-radius: var(--radius); padding: 32px 24px;
      transition: border-color 0.2s, transform 0.2s;
      position: relative; overflow: hidden;
    }
    .feature-card::before {
      content: ''; position: absolute; top: 0; left: 0;
      width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, var(--s-cyan), transparent);
      opacity: 0; transition: opacity 0.2s;
    }
    .feature-card:hover { border-color: rgba(0,212,255,0.4); transform: translateY(-4px); }
    .feature-card:hover::before { opacity: 1; }
    .feature-icon {
      width: 48px; height: 48px; margin-bottom: 20px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,212,255,0.08);
      border: 1px solid rgba(0,212,255,0.2);
      border-radius: 4px; color: var(--s-cyan);
    }
    .feature-card h3 {
      font-family: var(--font-display); font-size: 16px;
      font-weight: 700; letter-spacing: 0.08em;
      color: var(--s-white); margin-bottom: 12px;
    }
    .feature-card p { font-size: 14px; color: var(--s-text-dim); line-height: 1.6; }

    /* ── Partners Marquee ── */
    .partners-section { background: var(--s-black); padding: 80px 0; overflow: hidden; }
    .partners-section .section-inner { padding-bottom: 48px; }
    .marquee-container { overflow: hidden; }
    .marquee-track {
      display: flex; gap: 24px;
      width: max-content;
      animation: marquee 30s linear infinite;
    }
    .marquee-track.reverse { animation: marquee-reverse 25s linear infinite; }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes marquee-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
    .marquee-item { flex-shrink: 0; }
    .partner-logo {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 28px;
      border: 1px solid var(--s-border);
      border-radius: var(--radius);
      background: var(--s-panel);
      transition: border-color 0.2s;
      white-space: nowrap;
    }
    .partner-logo:hover { border-color: rgba(0,212,255,0.3); }
    .partner-initial {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; background: rgba(0,212,255,0.1);
      border: 1px solid rgba(0,212,255,0.2);
      font-family: var(--font-display); font-size: 15px;
      font-weight: 700; color: var(--s-cyan);
    }
    .partner-name {
      font-family: var(--font-display); font-size: 14px;
      font-weight: 600; letter-spacing: 0.08em;
      color: var(--s-text-dim);
    }

    /* ── Contact ── */
    .contact-section { background: var(--s-black); }
    .contact-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 64px; align-items: start; }
    .contact-info { display: flex; flex-direction: column; gap: 32px; }
    .contact-item { display: flex; gap: 16px; align-items: flex-start; }
    .contact-icon {
      width: 44px; height: 44px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(0,212,255,0.2); border-radius: 4px;
      background: rgba(0,212,255,0.05); color: var(--s-cyan);
    }
    .contact-label {
      font-family: var(--font-mono); font-size: 11px;
      color: var(--s-text-muted); letter-spacing: 0.1em;
      text-transform: uppercase; margin-bottom: 4px;
    }
    .contact-value { font-size: 14px; color: var(--s-text); }
    .contact-form { display: flex; flex-direction: column; gap: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label {
      font-family: var(--font-mono); font-size: 11px;
      color: var(--s-text-dim); letter-spacing: 0.1em; text-transform: uppercase;
    }

    /* ── Footer ── */
    .footer { background: var(--s-dark); border-top: 1px solid var(--s-border); padding: 40px 0; }
    .footer-inner {
      max-width: 1280px; margin: 0 auto; padding: 0 40px;
      display: flex; align-items: center; flex-wrap: wrap; gap: 32px;
    }
    .footer-brand { display: flex; flex-direction: column; gap: 8px; margin-right: auto; }
    .footer-brand p { font-size: 13px; color: var(--s-text-muted); }
    .footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
    .footer-links a { font-size: 13px; color: var(--s-text-dim); transition: color 0.2s; }
    .footer-links a:hover { color: var(--s-cyan); }
    .footer-copy { font-family: var(--font-mono); font-size: 11px; color: var(--s-text-muted); width: 100%; }

    @media (max-width: 900px) {
      .hero-visual { display: none; }
      .hero-content { width: 100%; }
      .nav-links, .header-actions { display: none; }
      .mobile-toggle { display: flex; }
      .contact-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  scrolled = false;
  mobileMenuOpen = false;
  private scrollListener!: () => void;

  features = [
    {
      title: 'Real-Time Threat Detection',
      description: 'AI-powered anomaly detection across all connected nodes with sub-50ms alert propagation.',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    },
    {
      title: 'Sensor Orchestration',
      description: 'Centralized management of thousands of IoT sensors with intelligent grouping and geofencing.',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`
    },
    {
      title: 'Unified Command Center',
      description: 'Single pane of glass for your entire security operation — from field personnel to system health.',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`
    },
    {
      title: 'Encrypted Communications',
      description: 'End-to-end encrypted channels for all internal communications and device telemetry.',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`
    },
    {
      title: 'Compliance Reporting',
      description: 'Automated audit trails and compliance reports for SOC 2, ISO 27001, and NIST frameworks.',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`
    },
    {
      title: 'Personnel Management',
      description: 'Role-based access control with shift scheduling, task assignment, and performance tracking.',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`
    },
  ];

  partners = [
    { name: 'CyberNova Systems', initial: 'CN' },
    { name: 'ArcLight Defense', initial: 'AL' },
    { name: 'Nexion Technologies', initial: 'NX' },
    { name: 'VaultEdge Corp', initial: 'VE' },
    { name: 'Orion Networks', initial: 'ON' },
    { name: 'PrimeGuard AI', initial: 'PG' },
    { name: 'TerraShield Inc', initial: 'TS' },
    { name: 'DataFortress', initial: 'DF' },
  ];

  get partnersDouble() { return [...this.partners, ...this.partners]; }
  get partnersDouble2() { return [...[...this.partners].reverse(), ...[...this.partners].reverse()]; }

  contactItems = [
    {
      label: 'Headquarters',
      value: '1 Sentinel Plaza, Cyber District, CA 94105',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    },
    {
      label: 'Operations',
      value: 'ops@sentinel-iot.com',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
    },
    {
      label: '24/7 Security Hotline',
      value: '+1 (800) SENTINEL',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.34 13a19.79 19.79 0 01-3.07-8.67A2 2 0 013.25 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9.91a16 16 0 006.29 6.29l1.28-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`
    },
  ];

  ngOnInit(): void {
    this.scrollListener = () => { this.scrolled = window.scrollY > 20; };
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
  }

  submitContact(e: Event): void {
    e.preventDefault();
    alert('Message sent! Our team will respond within 24 hours.');
  }
}
