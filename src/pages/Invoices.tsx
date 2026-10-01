import React, { useEffect, useState } from 'react';
import { Receipt, Plus, RefreshCw, AlertCircle, Printer, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';

export const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [printingInvoice, setPrintingInvoice] = useState<any | null>(null);

  const [newInvoice, setNewInvoice] = useState({
    repairJobId: '',
    partsTotalDollars: '90.00',
    laborTotalDollars: '30.00',
    discountDollars: '0.00',
    taxDollars: '6.00',
    amountPaidDollars: '126.00',
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [invRes, repairRes] = await Promise.all([
        apiClient.get('/api/v1/staff/invoices'),
        apiClient.get('/api/v1/staff/repairs').catch(() => ({ data: [] }))
      ]);

      setInvoices(invRes.data || []);
      const fetchedRepairs = repairRes.data || [];
      setRepairs(fetchedRepairs);

      if (fetchedRepairs.length > 0) {
        setNewInvoice((prev) => ({ ...prev, repairJobId: fetchedRepairs[0].id }));
      }
    } catch (err: any) {
      console.warn('Failed to fetch invoices from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.repairJobId) return;

    try {
      const partsCents = Math.round((parseFloat(newInvoice.partsTotalDollars) || 0) * 100);
      const laborCents = Math.round((parseFloat(newInvoice.laborTotalDollars) || 0) * 100);
      const discountCents = Math.round((parseFloat(newInvoice.discountDollars) || 0) * 100);
      const taxCents = Math.round((parseFloat(newInvoice.taxDollars) || 0) * 100);
      const paidCents = Math.round((parseFloat(newInvoice.amountPaidDollars) || 0) * 100);

      const response = await apiClient.post('/api/v1/staff/invoices', {
        repairJobId: newInvoice.repairJobId,
        partsTotalCents: partsCents,
        laborTotalCents: laborCents,
        discountCents: discountCents,
        taxCents: taxCents,
        amountPaidCents: paidCents,
      });

      setInvoices([response.data, ...invoices]);
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to generate invoice on database.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Customer Invoicing & Receipts" subtitle="Generate itemized repair invoices and print 80mm thermal receipts" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Invoices Directory ({invoices.length})</h2>
            <p className="text-xs text-slate-400">Fetched directly from PostgreSQL database (`invoices` table)</p>
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
              <span>Generate Invoice</span>
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
        {!isLoading && invoices.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
              <Receipt className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Invoices Issued</h3>
            <p className="text-sm text-slate-400">
              No billing invoices generated in the database yet. Click below to create an itemized invoice.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              Generate First Invoice
            </button>
          </div>
        )}

        {/* Invoice Table */}
        {invoices.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Invoice #</th>
                  <th className="px-4 py-3.5">Customer Name</th>
                  <th className="px-4 py-3.5">Grand Total</th>
                  <th className="px-4 py-3.5">Amount Paid</th>
                  <th className="px-4 py-3.5">Due Balance</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-cyan-400">{inv.invoiceNumber}</td>
                    <td className="px-4 py-4 font-semibold text-white">{inv.customer?.name || 'Customer'}</td>
                    <td className="px-4 py-4 font-bold text-white">
                      ${((inv.grandTotalCents || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-emerald-400">
                      ${((inv.amountPaidCents || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-amber-400">
                      ${((inv.amountDueCents || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      {inv.isPaidInFull ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid in Full
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Due Balance
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setPrintingInvoice(inv)}
                        className="text-xs font-semibold text-cyan-400 hover:underline flex items-center justify-end gap-1"
                      >
                        <Printer className="w-4 h-4" /> Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Generate Invoice Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-white">Generate Itemized Invoice</h3>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Select Repair Job</label>
                  <select
                    value={newInvoice.repairJobId}
                    onChange={(e) => setNewInvoice({ ...newInvoice, repairJobId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  >
                    {repairs.length === 0 ? (
                      <option value="">No repair tickets available</option>
                    ) : (
                      repairs.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.jobNumber} — {r.customer?.name || 'Customer'} ({r.device?.model || 'Device'})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parts Total ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newInvoice.partsTotalDollars}
                      onChange={(e) => setNewInvoice({ ...newInvoice, partsTotalDollars: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Labor Fee ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newInvoice.laborTotalDollars}
                      onChange={(e) => setNewInvoice({ ...newInvoice, laborTotalDollars: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Discount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newInvoice.discountDollars}
                      onChange={(e) => setNewInvoice({ ...newInvoice, discountDollars: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tax ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newInvoice.taxDollars}
                      onChange={(e) => setNewInvoice({ ...newInvoice, taxDollars: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Amount Paid ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newInvoice.amountPaidDollars}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amountPaidDollars: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none font-bold text-emerald-400"
                    />
                  </div>
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
                    Issue Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Thermal Receipt Print Preview Modal */}
        {printingInvoice && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white text-slate-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl space-y-4 font-mono text-sm">
              <div className="text-center border-b border-slate-300 pb-4">
                <h2 className="font-bold text-lg">TechCare Fixora</h2>
                <p className="text-xs text-slate-600">Professional Repair & Passport</p>
                <p className="text-xs text-slate-500 mt-1">Invoice #{printingInvoice.invoiceNumber}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <p><span className="font-bold">Customer:</span> {printingInvoice.customer?.name}</p>
                <p><span className="font-bold">Job #:</span> {printingInvoice.repairJob?.jobNumber}</p>
                <p><span className="font-bold">Status:</span> {printingInvoice.isPaidInFull ? 'PAID IN FULL' : 'DUE BALANCE'}</p>
              </div>

              <div className="border-t border-b border-slate-300 py-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Parts Total:</span>
                  <span>${((printingInvoice.partsTotalCents || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor Charge:</span>
                  <span>${((printingInvoice.laborTotalCents || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${((printingInvoice.taxCents || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span>${((printingInvoice.grandTotalCents || 0) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Amount Paid:</span>
                  <span>${((printingInvoice.amountPaidCents || 0) / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 pt-2">
                <p>Thank you for choosing TechCare Fixora.</p>
                <p className="text-[10px] mt-1 text-slate-400">Track repair history via QR Code</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => setPrintingInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
