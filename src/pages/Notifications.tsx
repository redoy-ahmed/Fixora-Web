import React, { useEffect, useState } from 'react';
import { Bell, Send, RefreshCw, AlertCircle, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showSendModal, setShowSendModal] = useState(false);
  const [notifyForm, setNotifyForm] = useState({
    recipientId: '',
    title: 'Repair Status Update',
    message: 'Your device repair has progressed to IN_REPAIR state. You can track progress on the customer portal.',
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [notifRes, custRes] = await Promise.all([
        apiClient.get('/api/v1/staff/notifications').catch(() => ({ data: [] })),
        apiClient.get('/api/v1/staff/customers').catch(() => ({ data: [] })),
      ]);

      setNotifications(notifRes.data || []);
      const fetchedCust = custRes.data || [];
      setCustomers(fetchedCust);

      if (fetchedCust.length > 0) {
        setNotifyForm((prev) => ({ ...prev, recipientId: fetchedCust[0].id }));
      }
    } catch (err: any) {
      console.warn('Failed to fetch notifications from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyForm.recipientId || !notifyForm.message) return;

    try {
      const response = await apiClient.post('/api/v1/staff/notifications', {
        recipientId: notifyForm.recipientId,
        recipientType: 'CUSTOMER',
        title: notifyForm.title,
        message: notifyForm.message,
        targetType: 'REPAIR_JOB',
        targetEntityId: 'GENERAL',
      });

      setNotifications([response.data, ...notifications]);
      setShowSendModal(false);
    } catch (err: any) {
      setError('Failed to dispatch notification to customer.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Notification Alerts & Audit Logs" subtitle="Dispatch customer notifications and view system audit communication logs" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">System Communication Logs ({notifications.length})</h2>
            <p className="text-xs text-slate-400">Audit logs fetched directly from PostgreSQL (`notifications` table)</p>
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
              onClick={() => setShowSendModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Alert</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && notifications.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No System Notifications</h3>
            <p className="text-sm text-slate-400">
              No audit logs or customer notifications sent yet. Click below to dispatch an alert.
            </p>
            <button
              onClick={() => setShowSendModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20"
            >
              Send First Notification
            </button>
          </div>
        )}

        {/* Notifications Table */}
        {notifications.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Title & Subject</th>
                  <th className="px-4 py-3.5">Message Content</th>
                  <th className="px-4 py-3.5">Recipient Type</th>
                  <th className="px-4 py-3.5">Target Type</th>
                  <th className="px-4 py-3.5 rounded-r-xl">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                      {n.title}
                    </td>
                    <td className="px-4 py-4 text-slate-300 text-xs max-w-md">{n.message}</td>
                    <td className="px-4 py-4">
                      <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        {n.recipientType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-cyan-400">{n.targetType}</td>
                    <td className="px-4 py-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DISPATCHED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dispatch Notification Modal */}
        {showSendModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" /> Dispatch Customer Notification
              </h3>

              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Recipient Customer</label>
                  <select
                    value={notifyForm.recipientId}
                    onChange={(e) => setNotifyForm({ ...notifyForm, recipientId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  >
                    {customers.length === 0 ? (
                      <option value="">No registered customers found</option>
                    ) : (
                      customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Notification Subject Title</label>
                  <input
                    type="text"
                    required
                    value={notifyForm.title}
                    onChange={(e) => setNotifyForm({ ...notifyForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Message Content</label>
                  <textarea
                    rows={3}
                    required
                    value={notifyForm.message}
                    onChange={(e) => setNotifyForm({ ...notifyForm, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSendModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Notification</span>
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
