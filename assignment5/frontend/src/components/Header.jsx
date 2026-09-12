import React from 'react';
import { Award, LayoutDashboard, Users, Calculator, PlusCircle, Database, Server, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, isBackendConnected, totalCount }) {
  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'records', label: 'Student Marksheets', icon: Users },
    { id: 'calculator', label: 'Result & SGPA Simulator', icon: Calculator },
    { id: 'add', label: 'New Result Entry', icon: PlusCircle },
    { id: 'api', label: 'MongoDB REST Explorer', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[var(--border)]">
      {/* Top Institute Strip */}
      <div className="bg-[#2c2014] text-[#e6dfd6] text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex justify-between items-center">
        <span className="tracking-widest uppercase">
          Vishwakarma Institute of Technology, Pune — Autonomous Institute
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[#b8945e]">Exam & Evaluation • Sem V (2025-26)</span>
          <span className="bg-[#9c6b30] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            MSE 30% + ESE 70%
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#2c2014] flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 text-[#d4a95e]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-h)]">
                  VIT Result Management
                </h1>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--accent)] font-bold border border-[var(--border)]">
                  B.Tech Sem V
                </span>
              </div>
              <p className="text-xs text-[var(--text)] font-medium">
                React • Spring Boot REST API • MongoDB Database
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isBackendConnected 
                ? 'bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--success)]' 
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <Server className="w-4 h-4" />
              <span>{isBackendConnected ? 'Spring Boot Active' : 'Client Memory Mode'}</span>
              {isBackendConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] text-xs text-[var(--text)]">
              <Database className="w-4 h-4 text-[var(--accent)]" />
              <span>Records: <strong className="text-[var(--text-h)]">{totalCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 mt-4 border-t border-[var(--border)] pt-3 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2c2014] text-[#e6dfd6] shadow-md font-bold'
                    : 'text-[var(--text)] hover:text-[var(--text-h)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
