import React, { useEffect, useState } from 'react';
import { Users, UserPlus, CheckCircle, RefreshCw, AlertCircle, Trash2, Edit3, Store } from 'lucide-react';
import { Header } from '../components/Header';
import { apiClient } from '../api/client';
import { StaffRole } from '../types';

export const Staff: React.FC = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    role: 'ROLE_TECHNICIAN' as StaffRole,
    branchName: '',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'ROLE_TECHNICIAN' as StaffRole,
    branchName: '',
  });

  const fetchStaffAndBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [staffRes, branchRes] = await Promise.all([
        apiClient.get('/api/v1/staff/users'),
        apiClient.get('/api/v1/staff/branches').catch(() => ({ data: [] }))
      ]);

      setStaffList(staffRes.data || []);
      const fetchedBranches = branchRes.data || [];
      setBranches(fetchedBranches);

      if (fetchedBranches.length > 0) {
        setNewStaff((prev) => ({ ...prev, branchName: fetchedBranches[0].name }));
      } else {
        setNewStaff((prev) => ({ ...prev, branchName: 'Main Branch' }));
      }
    } catch (err: any) {
      console.warn('Failed to fetch staff members or branches from database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndBranches();
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
        branchName: newStaff.branchName || 'Main Branch'
      });
      setStaffList([...staffList, response.data]);
      setNewStaff({
        fullName: '',
        email: '',
        role: 'ROLE_TECHNICIAN',
        branchName: branches.length > 0 ? branches[0].name : 'Main Branch'
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError('Failed to create staff account on database.');
    }
  };

  const handleOpenEditModal = (staff: any) => {
    setEditingStaff(staff);
    setEditFormData({
      name: staff.name || '',
      email: staff.email || '',
      role: staff.role || 'ROLE_TECHNICIAN',
      branchName: staff.branchName || (branches.length > 0 ? branches[0].name : 'Main Branch'),
    });
  };

  const handleUpdateStaffUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      const response = await apiClient.put(`/api/v1/staff/users/${editingStaff.id}`, {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        branchName: editFormData.branchName,
      });

      setStaffList(
        staffList.map((s) => (s.id === editingStaff.id ? response.data : s))
      );
      setEditingStaff(null);
    } catch (err: any) {
      setError('Failed to update staff account on database.');
    }
  };

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete staff account for ${name}?`)) return;

    try {
      await apiClient.delete(`/api/v1/staff/users/${id}`);
      setStaffList(staffList.filter((s) => s.id !== id));
    } catch (err: any) {
      setError('Failed to delete staff account.');
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
              onClick={fetchStaffAndBranches}
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
                <th className="px-4 py-3.5 rounded-l-xl">Employee Name & Email</th>
                <th className="px-4 py-3.5">Security Role</th>
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
                  <td className="px-4 py-4 text-slate-300 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Store className="w-3.5 h-3.5" />
                      {staff.branchName || 'Main Branch'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleOpenEditModal(staff)}
                      className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit User
                    </button>

                    <button
                      onClick={() => handleDeleteStaff(staff.id, staff.name)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
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
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assigned Branch Location</label>
                  <select
                    value={newStaff.branchName}
                    onChange={(e) => setNewStaff({ ...newStaff, branchName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  >
                    {branches.length === 0 ? (
                      <option value="Main Branch">Main Branch</option>
                    ) : (
                      branches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} {b.isMainBranch ? '(HQ Main)' : ''}
                        </option>
                      ))
                    )}
                  </select>
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

        {/* Full User Edit Modal */}
        {editingStaff && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white">Edit Staff Account</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Updating details for employee <span className="text-cyan-400 font-semibold">{editingStaff.name}</span>
                </p>
              </div>

              <form onSubmit={handleUpdateStaffUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assigned Branch Location</label>
                  <select
                    value={editFormData.branchName}
                    onChange={(e) => setEditFormData({ ...editFormData, branchName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
                  >
                    {branches.length === 0 ? (
                      <option value="Main Branch">Main Branch</option>
                    ) : (
                      branches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} {b.isMainBranch ? '(HQ Main)' : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Security Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as StaffRole })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-sm text-white outline-none"
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
                    onClick={() => setEditingStaff(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold shadow-lg shadow-cyan-500/20"
                  >
                    Save Changes
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
