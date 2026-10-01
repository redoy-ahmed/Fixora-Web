import React, { useEffect, useState } from 'react';
import { ShieldCheck, Plus, RefreshCw, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Warranties: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warranties' | 'claims'>('warranties');
  const [warranties, setWarranties] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showIssueModal, setShowAddModal] = useState(false);
  const [newWarranty, setNewWarranty] = useState({
    repairJobId: '',
    durationDays: 90,
    terms: 'Covers manufacturer defects and repaired display assembly for 90 days.',
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [warrRes, claimRes, repairRes] = await Promise.all([
        apiClient.get('/api/v1/staff/warranties').catch(() => ({ data: [] })),
        apiClient.get('/api/v1/staff/warranties/claims').catch(() => ({ data: [] })),
        apiClient.get('/api/v1/staff/repairs').catch(() => ({ data: [] })),
      ]);

      setWarranties(warrRes.data || []);
      setClaims(claimRes.data || []);
      const fetchedRepairs = repairRes.data || [];
      setRepairs(fetchedRepairs);

      if (fetchedRepairs.length > 0) {
        setNewWarranty((prev) => ({ ...prev, repairJobId: fetchedRepairs[0].id }));
      }
    } catch (err: any) {
      console.warn('Failed to fetch warranties from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarranty.repairJobId) return;

    try {
      const response = await apiClient.post('/api/v1/staff/warranties', {
        repairJobId: newWarranty.repairJobId,
        durationDays: Number(newWarranty.durationDays),
        terms: newWarranty.terms,
      });

      setWarranties([response.data, ...warranties]);
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to issue warranty on database.');
    }
  };

  const handleResolveClaimStatus = async (claimId: string, newStatus: string) => {
    try {
      const response = await apiClient.patch(`/api/v1/staff/warranties/claims/${claimId}/status`, {
        newStatus: newStatus,
      });

      setClaims(claims.map((c) => (c.id === claimId ? response.data : c)));
    } catch (err: any) {
      setError('Failed to resolve warranty claim.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Warranty & Claims Resolution" subtitle="Issue active repair warranties and manage customer warranty claims" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header & Tab Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('warranties')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'warranties'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Warranties ({warranties.length})
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'claims'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer Claims ({claims.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Warranty</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Active Warranties */}
        {activeTab === 'warranties' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            {!isLoading && warranties.length === 0 ? (
              <div className="py-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Active Warranties</h3>
                <p className="text-sm text-slate-400">
                  No active device warranties recorded in PostgreSQL yet.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Issue First Warranty
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 rounded-l-xl">Repair Job #</th>
                      <th className="px-4 py-3.5">Device & Model</th>
                      <th className="px-4 py-3.5">Duration</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 rounded-r-xl">Terms & Conditions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {warranties.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-4 font-mono font-bold text-cyan-400">
                          {w.repairJob?.jobNumber || 'RS-2026-101'}
                        </td>
                        <td className="px-4 py-4 font-semibold text-white">
                          {w.repairJob?.device ? `${w.repairJob.device.brand} ${w.repairJob.device.model}` : 'Device'}
                        </td>
                        <td className="px-4 py-4 font-bold text-emerald-400">
                          {w.durationDays} Days
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-400 max-w-xs truncate">
                          {w.terms}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Customer Claims */}
        {activeTab === 'claims' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            {!isLoading && claims.length === 0 ? (
              <div className="py-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Warranty Claims Filed</h3>
                <p className="text-sm text-slate-400">
                  There are zero pending customer warranty claims in PostgreSQL.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 rounded-l-xl">Customer Name</th>
                      <th className="px-4 py-3.5">Reported Issue Description</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-4 font-semibold text-white">
                          {claim.customer?.name || 'Customer'}
                        </td>
                        <td className="px-4 py-4 text-slate-300 text-xs max-w-md">
                          {claim.issueDescription}
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                            {claim.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResolveClaimStatus(claim.id, 'APPROVED')}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleResolveClaimStatus(claim.id, 'REJECTED')}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-1 rounded-xl text-xs font-bold"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Issue Warranty Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-white">Issue Repair Warranty</h3>
              <form onSubmit={handleIssueWarranty} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Select Completed Repair Job</label>
                  <select
                    value={newWarranty.repairJobId}
                    onChange={(e) => setNewWarranty({ ...newWarranty, repairJobId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  >
                    {repairs.length === 0 ? (
                      <option value="">No repair jobs available</option>
                    ) : (
                      repairs.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.jobNumber} — {r.customer?.name || 'Customer'} ({r.device?.model || 'Device'})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Warranty Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={newWarranty.durationDays}
                    onChange={(e) => setNewWarranty({ ...newWarranty, durationDays: parseInt(e.target.value) || 90 })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Terms & Conditions</label>
                  <textarea
                    rows={3}
                    required
                    value={newWarranty.terms}
                    onChange={(e) => setNewWarranty({ ...newWarranty, terms: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20"
                  >
                    Issue Warranty
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
