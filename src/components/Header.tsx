import React from 'react';
import { Bell, Search, Server } from 'lucide-react';

export const Header: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Backend Status Indicator */}
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium">
          <Server className="w-3.5 h-3.5 animate-pulse" />
          <span>Spring Boot REST API: UP (Port 8082)</span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-cyan-500 absolute top-2 right-2 ring-2 ring-slate-900"></span>
        </button>
      </div>
    </header>
  );
};
