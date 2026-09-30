import React, { useEffect, useState } from 'react';
import { Store, Plus, MapPin, Phone, Mail, Users, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';
import { Branch } from '../types';

export const Branches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    isMainBranch: false,
  });

  const fetchBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/v1/staff/branches');
      setBranches(response.data);
    } catch (err: any) {
      console.warn('Failed to fetch branches from backend API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name) return;

    try {
      const response = await apiClient.post('/api/v1/staff/branches', newBranch);
      setBranches([...branches, response.data]);
      setNewBranch({ name: '', address: '', phone: '', email: '', isMainBranch: false });
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to create branch on backend server.');
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this branch?')) return;
    try {
      await apiClient.delete(`/api/v1/staff/branches/${id}`);
      setBranches(branches.filter((b) => b.id !== id));
    } catch (err: any) {
      setError('Failed to delete branch.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Branch Locations & Outlets" subtitle="Set up and manage repair shop branch locations" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Active Shop Outlets ({branches.length})</h2>
            <p className="text-xs text-slate-400">Configure multi-branch repair operations</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Branch</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State when no branches created yet */}
        {!isLoading && branches.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Branches Configured Yet</h3>
            <p className="text-sm text-slate-400">
              Click the button below to add your primary shop outlet location.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              Add First Branch
            </button>
          </div>
        )}

        {/* Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      {branch.name}
                      {branch.isMainBranch && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Main HQ
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  title="Delete Branch"
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-sm text-slate-300 mb-6">
                <p className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{branch.address}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{branch.phone}</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{branch.email}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-white">Setup New Shop Branch</h3>
              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Branch Name</label>
                  <input
                    type="text"
                    required
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    placeholder="e.g. Main Outlet"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Address</label>
                  <input
                    type="text"
                    required
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    placeholder="e.g. 123 Commercial Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                      placeholder="+1 555-0199"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Branch Email</label>
                    <input
                      type="email"
                      required
                      value={newBranch.email}
                      onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                      placeholder="branch@fixora.com"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isMainBranch"
                    checked={newBranch.isMainBranch}
                    onChange={(e) => setNewBranch({ ...newBranch, isMainBranch: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="isMainBranch" className="text-sm text-slate-300 font-medium">
                    Set as Primary / Main HQ Branch
                  </label>
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
                    Save Branch
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
