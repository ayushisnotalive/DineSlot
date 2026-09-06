import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./index.css";

export default function LandingChoice() {
  const [activeTab, setActiveTab] = useState<"diners" | "venues" | "admin">("diners");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Subtle interactive 3D card tilt / lighting parallax on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-stone-800 font-sans antialiased selection:bg-[#bf5038]/20 selection:text-[#9e3e29]">
      {/* Top Banner Notice */}
      <div className="bg-[#1c1917] text-stone-300 text-xs py-2 px-4 tracking-wide border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#bf5038] text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded tracking-wider">
              Exclusive
            </span>
            <span className="hidden sm:inline">Michelin Guide 2025 Partner • Instant confirmed bookings with zero wait</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <a href="#waitlist" className="hover:text-stone-100 transition-colors">Join Waitlist</a>
            <span>|</span>
            <a href="#help" className="hover:text-stone-100 transition-colors">Help</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-[#fbf9f6]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Wordmark & Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fcf4f2] border border-[#f8e5e1] flex items-center justify-center text-[#bf5038] shadow-sm">
              <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-stone-900">
                Dine<span className="text-[#bf5038]">Slot</span>
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#curated" className="text-[#bf5038] font-semibold border-b-2 border-[#bf5038] pb-1">Curated Dining</a>
            <a href="#chef-tables" className="hover:text-stone-900 transition-colors pb-1">Chef Tables</a>
            <a href="#restaurants" className="hover:text-stone-900 transition-colors pb-1">For Restaurants</a>
            <a href="#concierge" className="hover:text-stone-900 transition-colors pb-1">Concierge</a>
          </nav>

          {/* Quick Info & User Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#fcf4f2] text-stone-700 text-xs px-3 py-1.5 rounded-full border border-[#f8e5e1]">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="font-medium text-stone-800">1,420 Tables Available Tonight</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-100/90 text-stone-700 text-xs px-3 py-1.5 rounded-full border border-stone-200 cursor-pointer hover:bg-stone-200/80 transition-colors">
              <svg className="w-3.5 h-3.5 text-[#bf5038]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>New York</span>
              <svg className="w-3 h-3 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#bf5038] text-white flex items-center justify-center font-serif text-sm shadow-sm font-semibold">
              DS
            </div>
          </div>
        </div>
      </header>

      {/* Live Global Ticker Strip */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 overflow-hidden border-b border-stone-800">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <strong className="text-white">LIVE ALLOCATION:</strong> Jean-Georges NYC • Table for 4 confirmed <em className="text-stone-400">2m ago</em>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <strong className="text-white">Osteria Francescana:</strong> Chef's counter reserved for 8:30 PM <em className="text-stone-400">Just now</em>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <strong className="text-white">L'Arpège Paris:</strong> 1 Private Cellar Salon released for 9:15 PM
          </span>
          <span className="flex items-center gap-2 text-stone-400">
            🔒 Encrypted Direct POS Integration • 99.8% Seating Guarantee
          </span>
          {/* Duplicate set for endless loop */}
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <strong className="text-white">LIVE ALLOCATION:</strong> Jean-Georges NYC • Table for 4 confirmed <em className="text-stone-400">2m ago</em>
          </span>
        </div>
      </div>

      {/* Hero Section with Pure React & CSS 3D Depth Card */}
      <section className="relative px-4 pt-14 pb-20 overflow-hidden">
        {/* Ambient Gradient Glows (Pure CSS) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-[#f8e5e1] via-[#fcf4f2] to-amber-100/60 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center">
          {/* Category Pill */}
          <div className="inline-flex items-center gap-2 bg-[#fcf4f2] border border-[#f8e5e1] text-[#bf5038] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="text-amber-500">★</span>
            <span>FINE DINING &amp; BESPOKE HOSPITALITY</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-600 font-normal">Tier-1 Access</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tight leading-[1.1] mb-6">
            Table booking, <span className="italic font-normal text-[#bf5038] underline decoration-amber-300/60 underline-offset-8">done right.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you're grabbing dinner, running a restaurant, or managing the global gastronomy platform — start here.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-medium text-stone-700 mb-12">
            <div className="flex items-center gap-2 bg-white/80 border border-stone-200 px-4 py-2 rounded-full shadow-sm">
              <span className="text-amber-500">⚡</span>
              <span>Instant Confirmation in <strong>4.2s</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 border border-stone-200 px-4 py-2 rounded-full shadow-sm">
              <span className="text-[#bf5038]">🍷</span>
              <span><strong>250+</strong> Michelin Stars Curated</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 border border-stone-200 px-4 py-2 rounded-full shadow-sm">
              <span className="text-emerald-600">✨</span>
              <span><strong>99.8%</strong> Seating Guarantee</span>
            </div>
          </div>

          {/* Pure React & CSS 3D Hero Sculpture Canvas Simulation */}
          <div
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="perspective-1000 max-w-4xl mx-auto mb-16 relative"
          >
            <div
              style={{
                transform: `rotateX(${mousePos.y * 0.4}deg) rotateY(${mousePos.x * 0.4}deg)`,
                transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
              }}
              className="relative w-full h-80 md:h-96 rounded-3xl bg-gradient-to-b from-stone-900 via-[#1c1917] to-stone-950 border border-stone-800 shadow-[0_25px_60px_-15px_rgba(30,20,15,0.4)] p-6 overflow-hidden flex flex-col items-center justify-center"
            >
              {/* Radial Lighting Cone */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,80,56,0.35)_0%,rgba(217,119,6,0.15)_40%,transparent_75%)] pointer-events-none" />

              {/* Background Concentric Golden Rings */}
              <div className="absolute w-[440px] h-[440px] rounded-full border border-amber-500/20 animate-pulse-glow" />
              <div className="absolute w-[320px] h-[320px] rounded-full border border-[#bf5038]/30 animate-spin" style={{ animationDuration: "40s" }} />

              {/* Central Floating 3D Cloche Visual (CSS Illustration with Real-Time Depth) */}
              <div className="relative z-10 flex flex-col items-center animate-float-slow">
                {/* Cloche Golden Handle */}
                <div className="w-8 h-8 rounded-full border-4 border-amber-400 bg-[#bf5038] shadow-[0_0_15px_rgba(245,158,11,0.6)] mb-[-8px] z-20" />
                <div className="w-3 h-4 bg-amber-400 rounded-sm mb-[-2px]" />

                {/* Silver / Terracotta Dome */}
                <div className="w-56 h-28 bg-gradient-to-b from-[#bf5038] via-[#9e3e29] to-[#451a03] rounded-t-full shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_2px_8px_rgba(255,255,255,0.4)] border-t border-amber-200/40 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute top-2 w-36 h-8 bg-white/20 rounded-full blur-md" />
                  <span className="text-amber-100 font-serif italic text-sm tracking-wider opacity-80">
                    DineSlot Haute
                  </span>
                </div>

                {/* Rim / Platter Base */}
                <div className="w-72 h-6 bg-gradient-to-r from-stone-200 via-amber-100 to-stone-300 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.7)] border-b-2 border-stone-400 flex items-center justify-center">
                  <div className="w-64 h-2 bg-gradient-to-r from-amber-400/80 via-[#bf5038]/60 to-amber-400/80 rounded-full" />
                </div>
                {/* Underglow */}
                <div className="w-60 h-3 bg-[#bf5038]/60 rounded-full blur-lg mt-1" />
              </div>

              {/* Orbiting Slot Badges (Pure CSS Rotations) */}
              <div className="absolute z-20 animate-orbit-1 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md text-stone-900 text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Table #4 • Prime Slot
                </div>
              </div>

              <div className="absolute z-20 animate-orbit-2 pointer-events-none">
                <div className="bg-stone-900/90 backdrop-blur-md text-amber-300 text-[11px] font-medium px-3 py-1 rounded-full shadow-lg border border-amber-500/40 flex items-center gap-1.5">
                  <span>★</span>
                  Chef Counter • 8:30 PM
                </div>
              </div>

              {/* Bottom Card Bar */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-stone-400 z-20">
                <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-stone-200 font-medium">Live Precision Floor Orchestration</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-800 text-stone-300">
                  <span>Pure React &amp; CSS Physics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Portal Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#bf5038]">
            Architected for Every Stakeholder
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mt-2">
            Choose Your Access Portal
          </h2>
          <div className="w-12 h-0.5 bg-[#bf5038] mx-auto mt-4" />
        </div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Customer */}
          <div className="glass-card rounded-3xl p-8 border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(191,80,56,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group">
            <div className="absolute top-6 right-6 text-xs font-mono text-stone-400">Role 01</div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#fcf4f2] text-[#bf5038] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🍽️
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#bf5038] bg-[#fcf4f2] px-2.5 py-1 rounded-full">
                For Diners
              </span>
              <h3 className="text-2xl font-serif text-stone-900 mt-3 mb-2 font-bold">Customer</h3>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Browse curated tables, sensory tasting menus, and secure instant bookings in seconds.
              </p>

              {/* Feature bullets */}
              <ul className="space-y-2.5 text-xs text-stone-600 mb-8 border-t border-stone-100 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Priority Seating Access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Detailed Dietary &amp; Sommelier Notes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Welcome Drink at Select Partners
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                to="/login?as=customer"
                className="w-full bg-[#bf5038] hover:bg-[#9e3e29] text-white text-center font-medium text-sm py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200"
              >
                Sign In as Diner →
              </Link>
              <Link
                to="/signup?as=customer"
                className="w-full text-center text-xs text-stone-500 hover:text-[#bf5038] py-1 font-medium transition-colors"
              >
                New here? Sign up
              </Link>
            </div>
          </div>

          {/* 2. Restaurant Owner */}
          <div className="glass-card rounded-3xl p-8 border-2 border-[#bf5038]/20 shadow-[0_12px_35px_rgba(191,80,56,0.08)] hover:shadow-[0_20px_45px_rgba(191,80,56,0.16)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#bf5038] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
              Partner Atelier
            </div>
            <div className="absolute top-6 right-6 text-xs font-mono text-stone-400">Role 02</div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#fcf4f2] text-[#bf5038] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                🏪
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#bf5038] bg-[#fcf4f2] px-2.5 py-1 rounded-full">
                For Venues
              </span>
              <h3 className="text-2xl font-serif text-stone-900 mt-3 mb-2 font-bold">Restaurant Owner</h3>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Manage your table turns, floor plans, sommelier pacing, and VIP guests effortlessly.
              </p>

              {/* Feature bullets */}
              <ul className="space-y-2.5 text-xs text-stone-600 mb-8 border-t border-stone-100 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Dynamic Turn Times &amp; Seating Pace
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Credit Card Hold &amp; No-Show Shield
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Micros POS &amp; Guest CRM Sync
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                to="/login?as=owner"
                className="w-full bg-[#bf5038] hover:bg-[#9e3e29] text-white text-center font-medium text-sm py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200"
              >
                Partner Portal Sign In
              </Link>
              <Link
                to="/signup?as=owner"
                className="w-full text-center text-xs text-stone-500 hover:text-[#bf5038] py-1 font-medium transition-colors"
              >
                Register Your Restaurant →
              </Link>
            </div>
          </div>

          {/* 3. Platform Admin */}
          <div className="bg-stone-100/90 rounded-3xl p-8 border border-stone-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group">
            <div className="absolute top-6 right-6 text-xs font-mono text-stone-400">Role 03</div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-stone-200 text-stone-700 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 bg-stone-200 px-2.5 py-1 rounded-full">
                Operations
              </span>
              <h3 className="text-2xl font-serif text-stone-900 mt-3 mb-2 font-bold">Platform Admin</h3>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Global platform management, ecosystem analytics, revenue yields, and compliance audit.
              </p>

              {/* Feature bullets */}
              <ul className="space-y-2.5 text-xs text-stone-600 mb-8 border-t border-stone-200 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-stone-600 font-bold">✓</span> Immutable Allocation Audit Logs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-stone-600 font-bold">✓</span> Automated Dispute Mediation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-stone-600 font-bold">✓</span> Real-time Gateway Monitoring
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                to="/login?as=admin"
                className="w-full bg-stone-900 hover:bg-stone-800 text-white text-center font-medium text-sm py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200"
              >
                Access Operations Console
              </Link>
              <span className="text-center text-[11px] text-stone-400 py-1 font-mono">
                Internal Multi-Factor Required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Performance Metrics Bar */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl p-8 border border-stone-200/80 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-serif font-bold text-stone-900">1.2M+</div>
            <div className="text-xs font-semibold text-[#bf5038] uppercase tracking-wider mt-1">Diners Hosted</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Across 14 global culinary capitals</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-serif font-bold text-stone-900">99.4%</div>
            <div className="text-xs font-semibold text-[#bf5038] uppercase tracking-wider mt-1">Booking Accuracy</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Double-reconciled floor tables</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-serif font-bold text-stone-900">3,800+</div>
            <div className="text-xs font-semibold text-[#bf5038] uppercase tracking-wider mt-1">Curated Venues</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Hand-inspected kitchen standards</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-serif font-bold text-stone-900 flex items-center justify-center gap-1">
              4.9 <span className="text-amber-500 text-2xl">★</span>
            </div>
            <div className="text-xs font-semibold text-[#bf5038] uppercase tracking-wider mt-1">Guest Satisfaction</div>
            <div className="text-[11px] text-stone-500 mt-0.5">From over 450,000 verified reviews</div>
          </div>
        </div>
      </section>

      {/* Tonight's Prime Allocations Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#bf5038]">
              Tonight's Prime Allocations
            </span>
            <h2 className="text-3xl font-serif text-stone-900 mt-1">
              Reserved for Discerning Palates
            </h2>
          </div>
          <div className="text-xs text-stone-500 mt-2 md:mt-0 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Live sync with Michelin &amp; World's 50 Best
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-stone-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 z-10" />
              <div className="absolute top-3 left-3 z-20 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-stone-700">
                3 Michelin Stars
              </div>
              <div className="absolute bottom-3 right-3 z-20 bg-stone-900/90 text-white text-xs font-mono px-2.5 py-1 rounded">
                8:15 PM Tonight
              </div>
              <div className="w-full h-full bg-[radial-gradient(#bf5038_1px,transparent_1px)] [background-size:16px_16px] opacity-40 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">L'Arpège Atelier</h3>
                <span className="text-xs text-stone-500 font-mono">$$$$</span>
              </div>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                Biodynamic vegetable tasting menu overseen by master chef Alain Passard.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs">
                <span className="text-stone-500">Chef's Garden Room</span>
                <button className="text-[#bf5038] hover:text-[#9e3e29] font-medium flex items-center gap-1">
                  Reserve Table →
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-stone-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 z-10" />
              <div className="absolute top-3 left-3 z-20 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-stone-700">
                Tokyo Guild Exclusive
              </div>
              <div className="absolute bottom-3 right-3 z-20 bg-stone-900/90 text-white text-xs font-mono px-2.5 py-1 rounded">
                9:00 PM Tonight
              </div>
              <div className="w-full h-full bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-40 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">Ginza Shinwa Omakase</h3>
                <span className="text-xs text-stone-500 font-mono">$$$$$</span>
              </div>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                8-seat hinoki counter serving aged wild-caught Edomae sashimi and vintage Junmai Daiginjo.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs">
                <span className="text-stone-500">Hinoki Counter Bar</span>
                <button className="text-[#bf5038] hover:text-[#9e3e29] font-medium flex items-center gap-1">
                  Reserve Table →
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-stone-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 z-10" />
              <div className="absolute top-3 left-3 z-20 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-stone-700">
                Heritage Cellar
              </div>
              <div className="absolute bottom-3 right-3 z-20 bg-stone-900/90 text-white text-xs font-mono px-2.5 py-1 rounded">
                7:30 PM Tonight
              </div>
              <div className="w-full h-full bg-[radial-gradient(#bf5038_1px,transparent_1px)] [background-size:16px_16px] opacity-40 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg font-bold text-stone-900">Bodega del Sommelier</h3>
                <span className="text-xs text-stone-500 font-mono">$$$$</span>
              </div>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                Rare Grand Cru vertical flights paired with wood-fired artisanal tasting courses.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs">
                <span className="text-stone-500">Private Vault Salon</span>
                <button className="text-[#bf5038] hover:text-[#9e3e29] font-medium flex items-center gap-1">
                  Reserve Table →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Concierge Banner */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="bg-[#fcf4f2] border border-[#f8e5e1] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#bf5038] border border-[#f8e5e1] flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
              🛎️
            </div>
            <div>
              <h4 className="font-serif text-xl font-bold text-stone-900">Need Bespoke Booking Assistance?</h4>
              <p className="text-stone-600 text-sm mt-1">
                Our round-the-clock gastronomic concierge handles private dining buyouts and VIP cellar holds.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Master Concierge Desk Online</span>
            </div>
            <button className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors">
              Connect with Private Concierge
            </button>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-stone-100/80 border-t border-stone-200/80 pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <span className="text-xl font-serif font-bold text-stone-900">
              Dine<span className="text-[#bf5038]">Slot</span>
            </span>
            <p className="text-xs text-stone-500 mt-3 leading-relaxed">
              Bridging artisanal gastronomy with sensory reservation curation. Hand-selected allocations at the world's most sought-after culinary ateliers, cellar rooms, and chef counters.
            </p>
            <div className="mt-4 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center gap-3">
              <span className="text-lg">🍷</span>
              <span><strong>Master Sommelier Pairing Service:</strong> Private vintage cellaring on demand.</span>
            </div>
          </div>
          <div>
            <h5 className="font-serif text-sm font-bold text-stone-900 mb-3">Gastronomy</h5>
            <ul className="space-y-2 text-xs text-stone-600">
              <li><a href="#" className="hover:text-stone-900">Tasting Menus</a></li>
              <li><a href="#" className="hover:text-stone-900">Omakase &amp; Counters</a></li>
              <li><a href="#" className="hover:text-stone-900">Cellar Salons</a></li>
              <li><a href="#" className="hover:text-stone-900">Culinary Itineraries</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-serif text-sm font-bold text-stone-900 mb-3">Partnership</h5>
            <ul className="space-y-2 text-xs text-stone-600">
              <li><a href="#" className="hover:text-stone-900">Restaurant Atelier</a></li>
              <li><a href="#" className="hover:text-stone-900">Yield Floor Engine</a></li>
              <li><a href="#" className="hover:text-stone-900">Sommelier Network</a></li>
              <li><a href="#" className="hover:text-stone-900">Private Club Integrations</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-serif text-sm font-bold text-stone-900 mb-3">Integrity &amp; Guarantee</h5>
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Zero-bot allocation shielding &amp; encrypted guest confidentiality</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Guaranteed table holding with direct kitchen confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © 2025 DineSlot Haute Hospitality Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-stone-800">Privacy Statement</a>
            <a href="#" className="hover:text-stone-800">Terms of Gastronomy</a>
            <a href="#" className="hover:text-stone-800">Security Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
