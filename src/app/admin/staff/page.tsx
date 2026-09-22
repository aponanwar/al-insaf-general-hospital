'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  FileBadge,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  UserCheck,
  Stethoscope,
  Filter
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Staff, StaffRole, EmploymentStatus } from '@/lib/types';

const ROLE_SERIAL_ORDER: { key: StaffRole | 'all'; label: string; bg: string; text: string }[] = [
  { key: 'all', label: 'All Staff', bg: 'bg-slate-100', text: 'text-slate-700' },
  { key: 'administrative', label: 'Administrative', bg: 'bg-blue-100', text: 'text-blue-700' },
  { key: 'doctor', label: 'Doctor', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { key: 'nurse', label: 'Nurse', bg: 'bg-rose-100', text: 'text-rose-700' },
  { key: 'pharmacist', label: 'Pharmacist', bg: 'bg-teal-100', text: 'text-teal-700' },
  { key: 'receptionist', label: 'Receptionist', bg: 'bg-amber-100', text: 'text-amber-700' },
  { key: 'security', label: 'Security', bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { key: 'wardboy', label: 'Ward Boy', bg: 'bg-orange-100', text: 'text-orange-700' },
  { key: 'technician', label: 'Technician', bg: 'bg-purple-100', text: 'text-purple-700' },
  { key: 'cleaner', label: 'Cleaner', bg: 'bg-slate-200', text: 'text-slate-800' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const EMPTY_FORM: Partial<Staff> = {
  name: '',
  role: 'administrative',
  phone: '',
  email: '',
  department: 'Administration',
  designation: '',
  imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  dateOfBirth: '',
  gender: 'Male',
  bloodGroup: 'O+',
  address: '',
  licenseNumber: '',
  joiningDate: new Date().toISOString().split('T')[0],
  shiftTiming: '08:00 AM - 04:00 PM (Morning Shift)',
  employmentStatus: 'active',
  salary: 30000,
};

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<StaffRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentStaff, setCurrentStaff] = useState<Partial<Staff>>(EMPTY_FORM);
  const [selectedForView, setSelectedForView] = useState<Staff | null>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<Staff | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff?role=all');
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Filtered staff
  const filteredStaff = staffList.filter((s) => {
    const matchesRole = selectedRole === 'all' || s.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || s.employmentStatus === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.staffId?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q) ||
      s.designation?.toLowerCase().includes(q);

    return matchesRole && matchesStatus && matchesSearch;
  });

  // Role badge helper
  const getRoleBadge = (role: StaffRole) => {
    const item = ROLE_SERIAL_ORDER.find((r) => r.key === role);
    return item ? (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.bg} ${item.text}`}>
        {item.label}
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
        {role}
      </span>
    );
  };

  const getStatusBadge = (status: EmploymentStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Active
          </span>
        );
      case 'on leave':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            On Leave
          </span>
        );
      case 'terminated':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
            Terminated
          </span>
        );
      default:
        return null;
    }
  };

  // Open Create Modal
  const openAddModal = () => {
    setCurrentStaff({
      ...EMPTY_FORM,
      role: selectedRole !== 'all' && selectedRole !== 'doctor' ? selectedRole : 'administrative',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (staff: Staff) => {
    setCurrentStaff({ ...staff });
    setIsEditModalOpen(true);
  };

  // Submit Add
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff.name || !currentStaff.phone) {
      setFeedbackMsg({ type: 'error', text: 'Name and Phone number are required.' });
      return;
    }

    setActionLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentStaff),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg({ type: 'success', text: `Staff member ${data.staff?.name} added successfully!` });
        setIsAddModalOpen(false);
        fetchStaff();
      } else {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to add staff member.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error occurred.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Edit
  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff._id && !currentStaff.staffId) {
      return;
    }

    setActionLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch('/api/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentStaff),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg({ type: 'success', text: 'Staff record updated successfully!' });
        setIsEditModalOpen(false);
        fetchStaff();
      } else {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to update staff record.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error occurred.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Delete
  const handleDeleteStaff = async () => {
    if (!selectedForDelete) return;

    setActionLoading(true);
    setFeedbackMsg(null);
    try {
      const targetId = selectedForDelete._id || selectedForDelete.staffId;
      const res = await fetch(`/api/staff?id=${encodeURIComponent(targetId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg({ type: 'success', text: 'Staff record deleted.' });
        setIsDeleteModalOpen(false);
        setSelectedForDelete(null);
        fetchStaff();
      } else {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to delete staff record.' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network error occurred.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Counts for top cards
  const totalCount = staffList.length;
  const activeCount = staffList.filter((s) => s.employmentStatus === 'active').length;
  const onLeaveCount = staffList.filter((s) => s.employmentStatus === 'on leave').length;
  const deptSet = new Set(staffList.map((s) => s.department).filter(Boolean));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-primary-600">Admin Dashboard</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Staff Directory & HR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Staff & Personnel Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administer hospital workforce records, salary information, and shifts across all 9 departments
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStaff}
            disabled={loading}
            className="inline-flex items-center px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Staff
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Workforce</div>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <p className="text-[11px] text-slate-500">Across 9 role categories</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Active On Duty</div>
          <div className="text-2xl font-black text-emerald-600">{activeCount}</div>
          <p className="text-[11px] text-slate-500">Currently assigned to shifts</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">On Leave</div>
          <div className="text-2xl font-black text-amber-600">{onLeaveCount}</div>
          <p className="text-[11px] text-slate-500">Authorized leave of absence</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Departments</div>
          <div className="text-2xl font-black text-blue-600">{deptSet.size}</div>
          <p className="text-[11px] text-slate-500">Functional hospital units</p>
        </div>
      </div>

      {/* Role Category Pills (Exact Serial Order) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Category (Serial Order):
          </span>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredStaff.length}</strong> staff
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {ROLE_SERIAL_ORDER.map((item) => {
            const isSelected = selectedRole === item.key;
            const count =
              item.key === 'all'
                ? staffList.length
                : staffList.filter((s) => s.role === item.key).length;

            return (
              <button
                key={item.key}
                onClick={() => setSelectedRole(item.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Sync Notice if Doctor category is selected */}
      {selectedRole === 'doctor' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Doctor Roster Active:</strong> Doctor profiles are synchronized automatically from the Doctors List. To add consultation slots, qualifications, or fees, manage them via the Doctors Management section.
            </span>
          </div>
          <Link
            href="/admin/doctors"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 ml-4"
          >
            Manage Doctors &rarr;
          </Link>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Staff ID, Phone, Department..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-600 shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table (Row-wise presentation) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={8} />
        ) : filteredStaff.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No staff members found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No records match your selected category or search filters. Try adjusting your search or add a new staff member.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Department & Designation</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Shift</th>
                  <th className="py-3.5 px-4">Salary (Confidential)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.staffId || staff._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Staff Member */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {staff.imageUrl ? (
                            <img
                              src={staff.imageUrl}
                              alt={staff.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 bg-slate-200">
                              {staff.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{staff.name}</div>
                          <div className="text-[10px] font-mono text-emerald-700 font-semibold">
                            {staff.staffId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      {getRoleBadge(staff.role)}
                    </td>

                    {/* Department & Designation */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{staff.department || 'General'}</div>
                      <div className="text-[11px] text-slate-400 truncate">{staff.designation || 'Staff'}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{staff.phone}</span>
                      </div>
                      {staff.email && (
                        <div className="text-[11px] text-slate-400 truncate flex items-center space-x-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{staff.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Shift */}
                    <td className="py-3 px-4">
                      <div className="text-slate-700 font-medium truncate max-w-[160px]">
                        {staff.shiftTiming || 'Regular Shift'}
                      </div>
                    </td>

                    {/* Confidential Salary */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {staff.salary ? `৳ ${staff.salary.toLocaleString('en-BD')}` : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400">Monthly Gross</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {getStatusBadge(staff.employmentStatus)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedForView(staff);
                            setIsViewModalOpen(true);
                          }}
                          title="View Complete Confidential Profile"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {staff.role !== 'doctor' && (
                          <>
                            <button
                              onClick={() => openEditModal(staff)}
                              title="Edit Staff Record"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedForDelete(staff);
                                setIsDeleteModalOpen(true);
                              }}
                              title="Delete Record"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ADD NEW STAFF MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Staff Member</h3>
                <p className="text-xs text-slate-500">Record employee profile and operational data</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentStaff.name || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
                    placeholder="e.g. Md. Kabir Hossain"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={currentStaff.role}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, role: e.target.value as StaffRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="administrative">Administrative</option>
                    <option value="nurse">Nurse</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="security">Security</option>
                    <option value="wardboy">Ward Boy</option>
                    <option value="technician">Technician</option>
                    <option value="cleaner">Cleaner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={currentStaff.phone || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, phone: e.target.value })}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={currentStaff.email || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, email: e.target.value })}
                    placeholder="staff@alinsafhospital.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={currentStaff.department || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, department: e.target.value })}
                    placeholder="e.g. Inpatient Ward / Pharmacy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Designation</label>
                  <input
                    type="text"
                    value={currentStaff.designation || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, designation: e.target.value })}
                    placeholder="e.g. Senior Nursing Officer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Confidential HR Fields */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Confidential HR & Operational Information (Admin Only)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (৳ BDT)</label>
                    <input
                      type="number"
                      value={currentStaff.salary ?? ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, salary: Number(e.target.value) })}
                      placeholder="e.g. 35000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={currentStaff.bloodGroup || 'O+'}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={currentStaff.gender || 'Male'}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, gender: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={currentStaff.dateOfBirth || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={currentStaff.joiningDate || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, joiningDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Employment Status</label>
                    <select
                      value={currentStaff.employmentStatus || 'active'}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, employmentStatus: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="on leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Shift Timing</label>
                    <input
                      type="text"
                      value={currentStaff.shiftTiming || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, shiftTiming: e.target.value })}
                      placeholder="e.g. 08:00 AM - 04:00 PM (Morning)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">License / Reg Number (If any)</label>
                    <input
                      type="text"
                      value={currentStaff.licenseNumber || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, licenseNumber: e.target.value })}
                      placeholder="e.g. BNC-RN-8834"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
                    <input
                      type="url"
                      value={currentStaff.imageUrl || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                    <textarea
                      rows={2}
                      value={currentStaff.address || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, address: e.target.value })}
                      placeholder="e.g. House 42, Road 7, Sector 3, Uttara, Dhaka"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {actionLoading ? 'Saving...' : 'Save Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT STAFF MODAL */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Staff Record</h3>
                <p className="text-xs text-slate-500">
                  Modifying employee ID: <strong className="text-emerald-700">{currentStaff.staffId}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={currentStaff.name || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Category</label>
                  <select
                    value={currentStaff.role}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, role: e.target.value as StaffRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="administrative">Administrative</option>
                    <option value="nurse">Nurse</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="security">Security</option>
                    <option value="wardboy">Ward Boy</option>
                    <option value="technician">Technician</option>
                    <option value="cleaner">Cleaner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={currentStaff.phone || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={currentStaff.email || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={currentStaff.department || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={currentStaff.designation || ''}
                    onChange={(e) => setCurrentStaff({ ...currentStaff, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Confidential HR Fields */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Confidential Operations & HR Data
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (৳)</label>
                    <input
                      type="number"
                      value={currentStaff.salary ?? ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, salary: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                    <select
                      value={currentStaff.bloodGroup || 'O+'}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      value={currentStaff.gender || 'Male'}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, gender: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={currentStaff.dateOfBirth || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={currentStaff.joiningDate || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, joiningDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Employment Status</label>
                    <select
                      value={currentStaff.employmentStatus || 'active'}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, employmentStatus: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="on leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Shift Timing</label>
                    <input
                      type="text"
                      value={currentStaff.shiftTiming || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, shiftTiming: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">License / Reg Number</label>
                    <input
                      type="text"
                      value={currentStaff.licenseNumber || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, licenseNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
                    <input
                      type="url"
                      value={currentStaff.imageUrl || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                    <textarea
                      rows={2}
                      value={currentStaff.address || ''}
                      onChange={(e) => setCurrentStaff({ ...currentStaff, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {actionLoading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW FULL CONFIDENTIAL PROFILE MODAL */}
      {/* ========================================================================= */}
      {isViewModalOpen && selectedForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
                  {selectedForView.imageUrl ? (
                    <img
                      src={selectedForView.imageUrl}
                      alt={selectedForView.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-400">
                      {selectedForView.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {selectedForView.name}
                  </h3>
                  <div className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                    ID: {selectedForView.staffId}
                  </div>
                  <div className="flex items-center space-x-2 mt-1.5">
                    {getRoleBadge(selectedForView.role)}
                    {getStatusBadge(selectedForView.employmentStatus)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confidential Record Details Grid */}
            <div className="space-y-4 text-xs">
              {/* Operational / Department */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Department & Role Information
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Department:</span>
                    <span className="font-bold text-slate-800">{selectedForView.department || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Designation:</span>
                    <span className="font-bold text-slate-800">{selectedForView.designation || 'Staff'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Shift Timing:</span>
                    <span className="font-bold text-slate-800">{selectedForView.shiftTiming || 'General Shift'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Joining Date:</span>
                    <span className="font-bold text-slate-800">{selectedForView.joiningDate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Confidential Payroll & Personal */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                  <span>Confidential HR & Payroll</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px]">
                    ADMIN EYES ONLY
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-emerald-700 block text-[11px]">Monthly Gross Salary:</span>
                    <span className="text-base font-black text-slate-900">
                      {selectedForView.salary ? `৳ ${selectedForView.salary.toLocaleString('en-BD')}` : 'Not Specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[11px]">Blood Group:</span>
                    <span className="font-bold text-slate-900">{selectedForView.bloodGroup || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[11px]">Gender:</span>
                    <span className="font-bold text-slate-900">{selectedForView.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[11px]">Date of Birth:</span>
                    <span className="font-bold text-slate-900">{selectedForView.dateOfBirth || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-emerald-700 block text-[11px]">Professional License / Reg:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedForView.licenseNumber || 'None / Not Applicable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Contact & Residence
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{selectedForView.phone}</span>
                  </div>
                  {selectedForView.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{selectedForView.email}</span>
                    </div>
                  )}
                  {selectedForView.address && (
                    <div className="flex items-start space-x-2 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600">{selectedForView.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Staff Record • Al Insaf General Hospital
              </span>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && selectedForDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Staff Member?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong className="text-slate-800">{selectedForDelete.name}</strong> ({selectedForDelete.staffId}) from the hospital database? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteStaff}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                {actionLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
