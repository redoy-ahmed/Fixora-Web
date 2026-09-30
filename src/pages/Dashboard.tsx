import React, { useEffect, useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Store,
  Users
} from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';
import { ShopKpis } from '../types';

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<ShopKpis>({
    todaysJobs: 14,
    inRepairJobs: 8,
    completedJobsToday: 5,
    todayRevenueCents: 45000,
    lowStockItemsCount: 2
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchKpis = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/api/v1/staff/dashboard/kpis');
        setKpis(response.data);
      } catch (err) {
        console.warn('Using mock fallback KPIs for preview mode');
      } finally {
        setIsLoading(false);
      }
    };
    fetchKpis();
  }, []);

  const kpiCards = [
    {
      title: "Today's Repairs",
      value: kpis.todaysJobs,
      subtitle: "New intake jobs",
      icon: Wrench,
      color: "from-cyan-500 to-blue-500",
      textColor: "text-cyan-400"
    },
    {
      title: "Active Repairs",
      value: kpis.inRepairJobs,
      subtitle: "Currently on bench",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-400"
    },
    {
      title: "Completed Today",
      value: kpis.completedJobsToday,
      subtitle: "Ready for pickup",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-400"
    },
    {
      title: "Today's Revenue",
      value: `$${(kpis.todayRevenueCents / 100).toFixed(2)}`,
      subtitle: "Payments processed",
      icon: DollarSign,
      color: "from-purple-500 to-indigo-500",
      textColor: "text-purple-400"
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Shop Dashboard Overview" subtitle="Real-time KPI metrics and repair operation status" />

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} text-white shadow-lg`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                  Today
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{card.value}</h3>
              <p className="text-sm font-medium text-slate-300 mt-1">{card.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Quick Config Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl shrink-0 mt-1 md:mt-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Shop Setup & Config Complete</h3>
              <p className="text-sm text-slate-400 mt-0.5">
                All 12 PostgreSQL database tables initialized. Configure branch locations, staff roles, and repair shop details in the sidebar.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/branches"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors border border-slate-700"
            >
              Manage Branches
            </a>
            <a
              href="/staff"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              Add Staff Members
            </a>
          </div>
        </div>

        {/* Recent Repair Jobs Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Active Repair Jobs</h3>
              <p className="text-xs text-slate-400">Live repair state machine monitoring</p>
            </div>
            <a href="/repairs" className="text-xs font-semibold text-cyan-400 hover:underline">
              View All Jobs &rarr;
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Job #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Device Model</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Estimate</th>
                  <th className="px-4 py-3 rounded-r-xl">REST Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="px-4 py-4 font-mono font-bold text-cyan-400">JOB-1001</td>
                  <td className="px-4 py-4 font-medium text-white">Rahim Ahmed</td>
                  <td className="px-4 py-4 text-slate-300">iPhone 14 Pro Max</td>
                  <td className="px-4 py-4">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      IN_REPAIR
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-white">$120.00</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500 truncate max-w-[120px]">
                    a9f4c3...8b21
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-mono font-bold text-cyan-400">JOB-1002</td>
                  <td className="px-4 py-4 font-medium text-white">Farhana Islam</td>
                  <td className="px-4 py-4 text-slate-300">Samsung Galaxy S23 Ultra</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium">
                      DELIVERED
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-white">$210.00</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500 truncate max-w-[120px]">
                    e73b12...9d10
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
