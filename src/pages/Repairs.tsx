import React, { useState } from 'react';
import { Wrench, ShieldCheck, Search, Filter } from 'lucide-react';
import { Header } from '../components/Header';
import { RepairJob } from '../types';

export const Repairs: React.FC = () => {
  const [repairs] = useState<RepairJob[]>([
    {
      id: '1',
      jobNumber: 'JOB-1001',
      customerName: 'Rahim Ahmed',
      deviceModel: 'iPhone 14 Pro Max',
      status: 'IN_REPAIR',
      estimatedCostCents: 12000,
      createdAt: '2026-09-30 10:30 AM',
      assignedTechnician: 'Sumon Hasan',
      recordHash: 'a9f4c3d821e0410a',
    },
    {
      id: '2',
      jobNumber: 'JOB-1002',
      customerName: 'Farhana Islam',
      deviceModel: 'Samsung Galaxy S23 Ultra',
      status: 'DELIVERED',
      estimatedCostCents: 21000,
      createdAt: '2026-09-29 02:15 PM',
      assignedTechnician: 'Sumon Hasan',
      recordHash: 'e73b129d10f8821c',
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_REPAIR':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'RECEIVED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Repair Jobs & Workflow" subtitle="Track repair state machine transitions and SHA-256 verification hashes" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">All Repair Tickets ({repairs.length})</h2>
              <p className="text-xs text-slate-400">REST API SHA-256 Record Verification Enabled</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Job #</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Device</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Technician</th>
                  <th className="px-4 py-3.5">Estimate</th>
                  <th className="px-4 py-3.5 rounded-r-xl">Cryptographic SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {repairs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-cyan-400">{job.jobNumber}</td>
                    <td className="px-4 py-4 font-semibold text-white">{job.customerName}</td>
                    <td className="px-4 py-4 text-slate-300">{job.deviceModel}</td>
                    <td className="px-4 py-4">
                      <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-300">{job.assignedTechnician || 'Unassigned'}</td>
                    <td className="px-4 py-4 font-bold text-white">${(job.estimatedCostCents / 100).toFixed(2)}</td>
                    <td className="px-4 py-4 font-mono text-xs text-cyan-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-[140px]">{job.recordHash}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
