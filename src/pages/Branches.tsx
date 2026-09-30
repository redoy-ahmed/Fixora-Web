import React, { useState } from 'react';
import { Store, Plus, MapPin, Phone, Mail, Users, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/Header';
import { Branch } from '../types';

export const Branches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      name: 'Main Care Center — Dhanmondi',
      address: 'House 42, Road 11, Dhanmondi, Dhaka-1209',
      phone: '+880 1711 000000',
      email: 'dhanmondi@fixora.com',
      isMainBranch: true,
      activeStaffCount: 8,
    },
    {
      id: '2',
      name: 'Uttara Repair Express',
      address: 'Sector 3, Uttara Model Town, Dhaka-1230',
      phone: '+880 1811 000000',
      email: 'uttara@fixora.com',
      isMainBranch: false,
      activeStaffCount: 4,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name) return;

    const created: Branch = {
      id: Date.now().toString(),
      name: newBranch.name,
      address: newBranch.address,
      phone: newBranch.phone,
      email: newBranch.email,
      isMainBranch: branches.length === 0,
      activeStaffCount: 1,
    };

    setBranches([...branches, created]);
    setNewBranch({ name: '', address: '', phone: '', email: '' });
    setShowAddModal(false);
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
                          <CheckCircle2 className="w-3 h-3" /> HQ Main
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
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

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Users className="w-4 h-4 text-cyan-400" />
                  {branch.activeStaffCount} Active Staff Members
                </span>
                <button className="text-cyan-400 hover:underline font-semibold">Configure Settings</button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-white">Create New Branch Outlet</h3>
              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Branch Name</label>
                  <input
                    type="text"
                    required
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    placeholder="e.g. Gulshan Care Center"
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
                    placeholder="e.g. Plot 12, Avenue 2, Gulshan-2, Dhaka"
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
                      placeholder="+880 1911 000000"
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
                      placeholder="gulshan@fixora.com"
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
