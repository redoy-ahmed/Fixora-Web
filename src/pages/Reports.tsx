import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Wrench,
  Store,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<any>({
    totalJobsCount: 0,
    completedJobsCount: 0,
    inRepairJobsCount: 0,
    totalRevenueCents: 0,
    totalPartsCostCents: 0,
    netProfitCents: 0,
    totalTaxCents: 0,
    unpaidInvoicesCount: 0,
    branchReports: [],
  });

  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('THIS_MONTH');
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportsAndBranches = async () => {
    setIsLoading(true);
    try {
      const [reportRes, branchRes] = await Promise.all([
        apiClient.get(`/api/v1/staff/reports/summary?branchName=${selectedBranch}`),
        apiClient.get('/api/v1/staff/branches').catch(() => ({ data: [] })),
      ]);

      if (reportRes.data) setReportData(reportRes.data);
      if (branchRes.data) setBranches(branchRes.data);
    } catch (err) {
      console.warn('Failed to load report analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsAndBranches();
  }, [selectedBranch, dateRange]);

  const kpiCards = [
    {
      title: "Gross Revenue",
      value: `$${((reportData.totalRevenueCents || 0) / 100).toFixed(2)}`,
      subtitle: "Total billed payments",
      icon: DollarSign,
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Net Operating Profit",
      value: `$${((reportData.netProfitCents || 0) / 100).toFixed(2)}`,
      subtitle: "Gross revenue minus parts cost",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Total Repair Jobs",
      value: reportData.totalJobsCount || 0,
      subtitle: `${reportData.completedJobsCount || 0} completed`,
      icon: Wrench,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Tax Collected",
      value: `$${((reportData.totalTaxCents || 0) / 100).toFixed(2)}`,
      subtitle: "Sales tax for government filing",
      icon: BarChart3,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Business Reports & Analytics" subtitle="Multi-branch financial and operational performance summary" />

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Report Filters</h3>
              <p className="text-xs text-slate-400">Filter data across branches and date ranges</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Branch Selector */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs font-semibold py-3 px-4 rounded-2xl outline-none"
            >
              <option value="ALL">🏢 All Branch Locations</option>
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-200 text-xs font-semibold py-3 px-4 rounded-2xl outline-none"
            >
              <option value="TODAY">📅 Today</option>
              <option value="THIS_WEEK">📅 This Week</option>
              <option value="THIS_MONTH">📅 This Month</option>
              <option value="THIS_YEAR">📅 This Year</option>
            </select>

            <button
              onClick={fetchReportsAndBranches}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-colors flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
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
                  {dateRange.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{card.value}</h3>
              <p className="text-sm font-medium text-slate-300 mt-1">{card.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Branch Performance Comparison Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-cyan-400" />
              Branch Performance Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of total repair tickets, gross revenue, and staff per outlet
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Branch Name</th>
                  <th className="px-4 py-3.5">Total Repair Jobs</th>
                  <th className="px-4 py-3.5">Active Staff</th>
                  <th className="px-4 py-3.5">Gross Revenue</th>
                  <th className="px-4 py-3.5 rounded-r-xl">Performance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reportData.branchReports && reportData.branchReports.length > 0 ? (
                  reportData.branchReports.map((br: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-bold text-white flex items-center gap-2">
                        <Store className="w-4 h-4 text-cyan-400" />
                        {br.branchName}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-200">{br.jobsCount} Tickets</td>
                      <td className="px-4 py-4 text-slate-300">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          {br.activeStaffCount} Employees
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-emerald-400">
                        ${((br.revenueCents || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 inline-flex">
                          <CheckCircle2 className="w-3.5 h-3.5" /> High Performance
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                      No branch report data recorded in PostgreSQL database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
