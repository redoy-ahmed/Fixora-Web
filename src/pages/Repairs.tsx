import React, { useEffect, useState } from 'react';
import { Wrench, ShieldCheck, Plus, AlertCircle, RefreshCw, Smartphone, DollarSign, User, FileText } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Repairs: React.FC = () => {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [intakeForm, setIntakeForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    deviceType: 'MOBILE',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 15 Pro',
    deviceSerialNumber: '',
    reportedProblem: 'Shattered OLED display and touch digitizer unresponsive',
    priority: 'NORMAL',
    estimatedCostDollars: '120.00',
  });

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

  const handleCreateIntakeTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeForm.customerName || !intakeForm.reportedProblem) return;

    try {
      const costCents = Math.round((parseFloat(intakeForm.estimatedCostDollars) || 0) * 100);

      const response = await apiClient.post('/api/v1/staff/repairs/intake', {
        customerName: intakeForm.customerName,
        customerPhone: intakeForm.customerPhone,
        customerEmail: intakeForm.customerEmail,
        customerAddress: intakeForm.customerAddress,
        deviceType: intakeForm.deviceType,
        deviceBrand: intakeForm.deviceBrand,
        deviceModel: intakeForm.deviceModel,
        deviceSerialNumber: intakeForm.deviceSerialNumber,
        reportedProblem: intakeForm.reportedProblem,
        priority: intakeForm.priority,
        estimatedCostCents: costCents,
      });

      setRepairs([response.data, ...repairs]);
      setIntakeForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',
        deviceType: 'MOBILE',
        deviceBrand: 'Apple',
        deviceModel: 'iPhone 15 Pro',
        deviceSerialNumber: '',
        reportedProblem: 'Shattered OLED display and touch digitizer unresponsive',
        priority: 'NORMAL',
        estimatedCostDollars: '120.00',
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to save repair intake ticket to database.');
    }
  };

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
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRepairs}
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
                <span>New Repair Ticket</span>
              </button>
            </div>
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
                No repair jobs found in the PostgreSQL database. Click below to register an incoming repair ticket.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
              >
                New Intake Ticket
              </button>
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

        {/* New Repair Intake Wizard Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">New Repair Intake Wizard</h3>
                  <p className="text-xs text-slate-400">Register customer, device, and issue in PostgreSQL</p>
                </div>
              </div>

              <form onSubmit={handleCreateIntakeTicket} className="space-y-4">
                {/* Customer Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Step 1: Customer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 uppercase mb-1">Customer Name</label>
                      <input
                        type="text"
                        required
                        value={intakeForm.customerName}
                        onChange={(e) => setIntakeForm({ ...intakeForm, customerName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                        placeholder="e.g. Rahim Ahmed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 uppercase mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={intakeForm.customerPhone}
                        onChange={(e) => setIntakeForm({ ...intakeForm, customerPhone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                        placeholder="+880 1711 000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      value={intakeForm.customerEmail}
                      onChange={(e) => setIntakeForm({ ...intakeForm, customerEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                      placeholder="rahim@example.com"
                    />
                  </div>
                </div>

                {/* Device Section */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" /> Step 2: Device Passport
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 uppercase mb-1">Device Type</label>
                      <select
                        value={intakeForm.deviceType}
                        onChange={(e) => setIntakeForm({ ...intakeForm, deviceType: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                      >
                        <option value="MOBILE">Mobile Phone</option>
                        <option value="TABLET">Tablet</option>
                        <option value="LAPTOP">Laptop</option>
                        <option value="WATCH">Smartwatch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 uppercase mb-1">Brand</label>
                      <input
                        type="text"
                        required
                        value={intakeForm.deviceBrand}
                        onChange={(e) => setIntakeForm({ ...intakeForm, deviceBrand: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                        placeholder="Apple / Samsung"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 uppercase mb-1">Model Name</label>
                      <input
                        type="text"
                        required
                        value={intakeForm.deviceModel}
                        onChange={(e) => setIntakeForm({ ...intakeForm, deviceModel: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                        placeholder="iPhone 15 Pro"
                      />
                    </div>
                  </div>
                </div>

                {/* Fault & Estimate Section */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Step 3: Reported Fault & Cost
                  </h4>
                  <div>
                    <label className="block text-xs text-slate-300 uppercase mb-1">Reported Problem / Fault Notes</label>
                    <textarea
                      rows={2}
                      required
                      value={intakeForm.reportedProblem}
                      onChange={(e) => setIntakeForm({ ...intakeForm, reportedProblem: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 uppercase mb-1">Priority</label>
                      <select
                        value={intakeForm.priority}
                        onChange={(e) => setIntakeForm({ ...intakeForm, priority: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                      >
                        <option value="NORMAL">NORMAL</option>
                        <option value="HIGH">HIGH (Urgent)</option>
                        <option value="EMERGENCY">EMERGENCY (Same Day)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 uppercase mb-1">Initial Estimate ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={intakeForm.estimatedCostDollars}
                        onChange={(e) => setIntakeForm({ ...intakeForm, estimatedCostDollars: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                    Create Intake Ticket
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
