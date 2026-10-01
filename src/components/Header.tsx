import React, { useState } from 'react';
import { Bell, Search, Server, Sun, Moon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim();
    if (q.toUpperCase().startsWith('RS-') || q.toUpperCase().startsWith('JOB-')) {
      navigate(`/track/${q}`);
    } else if (q.toUpperCase().startsWith('DP-')) {
      navigate('/passport');
    } else {
      navigate('/repairs');
    }
  };

  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Unified Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tickets, Customers, Passports..."
            className="w-64 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:w-80 rounded-2xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all duration-300 font-medium"
          />
        </form>

        {/* Backend Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium">
          <Server className="w-3.5 h-3.5 animate-pulse" />
          <span>Spring Boot REST API: UP</span>
        </div>

        {/* Public Tracker Quick Link */}
        <a
          href="/track/RS-2026-00101"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl"
        >
          <span>Live Customer Tracker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        {/* Notifications */}
        <a
          href="/notifications"
          className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors relative"
          title="Notification Audit Logs"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-cyan-500 absolute top-2 right-2 ring-2 ring-slate-900"></span>
        </a>
      </div>
    </header>
  );
};
