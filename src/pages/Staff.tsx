import React, { useState } from 'react';
import { Users, UserPlus, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { StaffUser, StaffRole } from '../types';

export const Staff: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffUser[]>([
    {
      id: '1',
      fullName: 'Karim Ahmed',
      email: 'karim@techcare.com',
      role: 'ROLE_OWNER',
      active: true,
      branchName: 'Main Care Center — Dhanmondi',
    },
    {
      id: '2',
      fullName: 'Sumon Hasan',
      email: 'sumon@techcare.com',
      role: 'ROLE_TECHNICIAN',
      active: true,
      branchName: 'Main Care Center — Dhanmondi',
    },
    {
      id: '3',
      fullName: 'Tania Akter',
      email: 'tania@techcare.com',
      role: 'ROLE_RECEPTIONIST',
      active: true,
      branchName: 'Uttara Repair Express',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    role: 'ROLE_TECHNICIAN' as StaffRole,
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.fullName || !newStaff.email) return;

    const created: StaffUser = {
      id: Date.now().toString(),
      fullName: newStaff.fullName,
      email: newStaff.email,
      role: newStaff.role,
      active: true,
      branchName: 'Main Care Center — Dhanmondi',
    };

    setStaffList([...staffList, created]);
    setNewStaff({ fullName: '', email: '', role: 'ROLE_TECHNICIAN' });
    setShowAddModal(false);
  };

  const getRoleBadgeColor = (role: StaffRole) => {
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
            <p className="text-xs text-slate-400">Role-Based Access Control (RBAC) configured</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Account</span>
          </button>
        </div>

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
                        {staff.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{staff.fullName}</p>
                        <p className="text-xs text-slate-400">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(staff.role)}`}>
                      {staff.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300 text-xs font-medium">{staff.branchName}</td>
                  <td className="px-4 py-4">
                    {staff.active ? (
                      <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-red-400 text-xs font-medium flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
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
                    placeholder="e.g. Sumon Ahmed"
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
                    placeholder="sumon@fixora.com"
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
