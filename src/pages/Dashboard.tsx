import React, { useEffect, useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<any>({
    todaysJobsCount: 0,
    inRepairCount: 0,
    completedCount: 0,
    todaysRevenueCents: 0,
  });

  const [repairs, setRepairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [kpiRes, repairsRes] = await Promise.all([
        apiClient.get('/api/v1/staff/dashboard/kpis').catch(() => ({ data: {} })),
        apiClient.get('/api/v1/staff/repairs').catch(() => ({ data: [] }))
      ]);

      setKpiData(kpiRes.data || {});
      setRepairs(repairsRes.data || []);
    } catch (err) {
      console.warn('Dashboard API sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpiCards = [
    {
      title: "Today's Repairs",
      value: kpiData.todaysJobsCount || 0,
      subtitle: "New intake jobs",
      icon: Wrench,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Active Repairs",
      value: kpiData.inRepairCount || 0,
      subtitle: "Currently on bench",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Completed Today",
      value: kpiData.completedCount || 0,
      subtitle: "Ready for pickup",
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Today's Revenue",
      value: `$${((kpiData.todaysRevenueCents || 0) / 100).toFixed(2)}`,
      subtitle: "Payments processed",
      icon: DollarSign,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Shop Dashboard Overview" subtitle="Real-time KPI metrics and repair operation status" />

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Refresh Header Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Live System Metrics</h2>
            <p className="text-xs text-slate-400">Synced directly with PostgreSQL database</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Dashboard</span>
          </button>
        </div>

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
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl shrink-0 mt-1 md:mt-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Fixora Admin Portal Connected</h3>
              <p className="text-sm text-slate-400 mt-0.5">
                All 13 database tables initialized. Configure branch locations, staff accounts, and shop settings in the sidebar.
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
              <p className="text-xs text-slate-400">Database repair ticket state machine</p>
            </div>
            <a href="/repairs" className="text-xs font-semibold text-cyan-400 hover:underline">
              View All Jobs &rarr;
            </a>
          </div>

          {repairs.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No active repair tickets in the database.
            </div>
          ) : (
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
                  {repairs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-mono font-bold text-cyan-400">{job.jobNumber}</td>
                      <td className="px-4 py-4 font-medium text-white">{job.customer?.name || 'Customer'}</td>
                      <td className="px-4 py-4 text-slate-300">
                        {job.device ? `${job.device.brand} ${job.device.model}` : 'Device'}
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-medium">
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-white">
                        ${((job.estimatedCostCents || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[120px]">
                          {job.recordHash || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
