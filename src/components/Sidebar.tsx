import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  Store,
  Users,
  Wrench,
  Package,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/invoices', label: 'Invoices & POS', icon: Receipt },
    { to: '/branches', label: 'Branch Setup', icon: Store },
    { to: '/staff', label: 'Staff & Roles', icon: Users },
    { to: '/repairs', label: 'Repair Jobs', icon: Wrench },
    { to: '/inventory', label: 'Inventory', icon: Package },
    { to: '/settings', label: 'Shop Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-1.5">
            Fixora <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Admin</span>
          </h1>
          <p className="text-xs text-slate-400">Repair Management Hub</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Security Status Badge */}
      <div className="mx-4 my-2 p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div className="text-xs">
          <p className="text-slate-200 font-medium">SHA-256 REST Security</p>
          <p className="text-slate-400">Verification Active</p>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-cyan-400 shrink-0">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'Admin User'}</p>
            <p className="text-xs text-cyan-400 font-medium">{user?.role?.replace('ROLE_', '') || 'OWNER'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
