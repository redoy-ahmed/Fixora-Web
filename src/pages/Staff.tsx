import React, { useEffect, useState } from 'react';
import { Users, UserPlus, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';
import { StaffRole } from '../types';

export const Staff: React.FC = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    role: 'ROLE_TECHNICIAN' as StaffRole,
  });

  const fetchStaffUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/v1/staff/users');
      setStaffList(response.data);
    } catch (err: any) {
      console.warn('Failed to fetch staff members from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffUsers();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.fullName || !newStaff.email) return;

    try {
      const response = await apiClient.post('/api/v1/staff/users', {
        name: newStaff.fullName,
        email: newStaff.email,
        role: newStaff.role,
        password: 'password123',
        branchName: 'Main Branch'
      });
      setStaffList([...staffList, response.data]);
      setNewStaff({ fullName: '', email: '', role: 'ROLE_TECHNICIAN' });
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to create staff account on database.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ROLE_OWNER':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ROLE_MANAGER':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'ROLE_TECHNICIAN':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'ROLE_RECEPTIONIST':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 pb-12">
      <Header title="Staff & Role Administration" subtitle="Manage employee accounts and security role permissions" />

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Staff Members Directory ({staffList.length})</h2>
            <p className="text-xs text-slate-400">Fetched directly from PostgreSQL database (`staff_users` table)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStaffUsers}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Account</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Staff Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 rounded-l-xl">Employee</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Assigned Branch</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                        {(staff.name || 'S').charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{staff.name}</p>
                        <p className="text-xs text-slate-400">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(staff.role)}`}>
                      {(staff.role || 'ROLE_OWNER').replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300 text-xs font-medium">{staff.branchName || 'Main Branch'}</td>
                  <td className="px-4 py-4">
                    <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs font-semibold text-cyan-400 hover:underline">Edit Role</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">
              <h3 className="text-xl font-bold text-white">Add New Staff Account</h3>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStaff.fullName}
                    onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    placeholder="e.g. Staff User"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                    placeholder="staff@fixora.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assign Security Role</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffRole })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  >
                    <option value="ROLE_TECHNICIAN">ROLE_TECHNICIAN (Bench Repair)</option>
                    <option value="ROLE_RECEPTIONIST">ROLE_RECEPTIONIST (Front Intake)</option>
                    <option value="ROLE_MANAGER">ROLE_MANAGER (Branch Operations)</option>
                    <option value="ROLE_ACCOUNTANT">ROLE_ACCOUNTANT (Finances & Invoices)</option>
                    <option value="ROLE_OWNER">ROLE_OWNER (Full Permissions)</option>
                  </select>
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
                    Save Staff
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
