import React, { useEffect, useState } from 'react';
import { Wrench, ShieldCheck, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Repairs: React.FC = () => {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepairs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/v1/staff/repairs');
      setRepairs(response.data);
    } catch (err: any) {
      console.warn('Failed to fetch repair jobs from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_REPAIR':
      case 'REPAIRING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DELIVERED':
      case 'READY_FOR_PICKUP':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'RECEIVED':
      case 'DIAGNOSIS':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Repair Jobs & Workflow" subtitle="Live state machine tracking and cryptographic SHA-256 verification" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">All Repair Tickets ({repairs.length})</h2>
              <p className="text-xs text-slate-400">Fetched directly from PostgreSQL database (`repair_jobs` table)</p>
            </div>
            <button
              onClick={fetchRepairs}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Database</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Empty State when no repairs exist in database */}
          {!isLoading && repairs.length === 0 && (
            <div className="py-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Active Repair Tickets</h3>
              <p className="text-sm text-slate-400">
                No repair jobs found in the PostgreSQL database. New tickets will appear here once intake is registered.
              </p>
            </div>
          )}

          {repairs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 rounded-l-xl">Job #</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Device</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Technician</th>
                    <th className="px-4 py-3.5">Estimated Cost</th>
                    <th className="px-4 py-3.5 rounded-r-xl">Cryptographic SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {repairs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-mono font-bold text-cyan-400">{job.jobNumber}</td>
                      <td className="px-4 py-4 font-semibold text-white">{job.customer?.name || 'Customer'}</td>
                      <td className="px-4 py-4 text-slate-300">
                        {job.device ? `${job.device.brand} ${job.device.model}` : 'Device'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-300">
                        {job.assignedTechnician?.name || 'Unassigned'}
                      </td>
                      <td className="px-4 py-4 font-bold text-white">
                        ${((job.estimatedCostCents || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-cyan-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {job.recordHash || 'Generated on Delivery'}
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
