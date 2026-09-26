'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Stethoscope,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  X,
  Phone,
  DollarSign
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';
import { Doctor } from '@/lib/types';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

const DEFAULT_DOCTOR_IMAGE = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(INITIAL_DEPARTMENTS[0].name);
  const [designation, setDesignation] = useState('Professor & Senior Consultant');
  const [qualifications, setQualifications] = useState('MBBS, FCPS, MD');
  const [specialty, setSpecialty] = useState('');
  const [roomNumber, setRoomNumber] = useState('Room 301, 3rd Floor');
  const [visitingHours, setVisitingHours] = useState('05:00 PM - 09:00 PM');
  const [visitingDays, setVisitingDays] = useState('Saturday, Monday, Wednesday');
  const [consultationFee, setConsultationFee] = useState(1500);
  const [phone, setPhone] = useState('01303-359905');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState(DEFAULT_DOCTOR_IMAGE);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Partial<Doctor> | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDoctors = async () => {
    setFetchingDoctors(true);
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.doctors || []);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setFetchingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let finalImageUrl = imageUrl;

      // If user uploaded a new image file, upload to Cloudinary via /api/upload
      if (imageFile && imageUrl) {
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: imageUrl, folder: 'hospital/doctors' }),
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.url) {
              finalImageUrl = uploadData.url;
            }
          }
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr);
        }
      }

      const payload = {
        name,
        department,
        designation,
        qualifications,
        specialty: specialty || department,
        roomNumber,
        visitingHours,
        visitingDays: visitingDays.split(',').map((d) => d.trim()),
        consultationFee: Number(consultationFee),
        phone,
        email,
        imageUrl: finalImageUrl,
      };

      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add doctor.');
      }

      setSuccessMsg(`Doctor ${name} registered successfully with Cloudinary photo.`);
      // Reset form
      setName('');
      setSpecialty('');
      setEmail('');
      setImageUrl(DEFAULT_DOCTOR_IMAGE);
      setImageFile(null);
      fetchDoctors();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating doctor.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoctor({
      ...doc,
      visitingDays: Array.isArray(doc.visitingDays) ? (doc.visitingDays.join(', ') as any) : doc.visitingDays,
    });
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    setEditLoading(true);
    setErrorMsg('');

    try {
      let finalImageUrl = editingDoctor.imageUrl || DEFAULT_DOCTOR_IMAGE;

      if (editImageFile && finalImageUrl && finalImageUrl.startsWith('data:')) {
        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: finalImageUrl, folder: 'hospital/doctors' }),
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.url) {
              finalImageUrl = uploadData.url;
            }
          }
        } catch (uploadErr) {
          console.error('Cloudinary update upload error:', uploadErr);
        }
      }

      const visitingDaysArray =
        typeof editingDoctor.visitingDays === 'string'
          ? (editingDoctor.visitingDays as string).split(',').map((d) => d.trim())
          : editingDoctor.visitingDays;

      const payload = {
        ...editingDoctor,
        visitingDays: visitingDaysArray,
        imageUrl: finalImageUrl,
      };

      const res = await fetch('/api/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update doctor');

      setSuccessMsg(`Doctor ${editingDoctor.name} updated successfully.`);
      setIsEditModalOpen(false);
      setEditingDoctor(null);
      setEditImageFile(null);
      fetchDoctors();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating doctor');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteDoctor = async (id: string, docName: string) => {
    if (!confirm(`Are you sure you want to remove ${docName}?`)) return;
    try {
      const res = await fetch(`/api/doctors?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg(`Doctor ${docName} removed.`);
        fetchDoctors();
      }
    } catch (err) {
      console.error('Failed to delete doctor', err);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = selectedDept === 'all' || doc.department.toLowerCase().includes(selectedDept.toLowerCase());
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q) ||
      doc.designation?.toLowerCase().includes(q) ||
      doc.specialty?.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-primary-600">Admin Dashboard</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Doctors Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Doctor & Consultant Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Register specialist doctors, upload high-resolution profile photos to Cloudinary, and manage schedules
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDoctors}
            disabled={fetchingDoctors}
            className="inline-flex items-center px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${fetchingDoctors ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-800 font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Doctor Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center space-x-2">
          <UserPlus className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-bold text-slate-900">Add New Doctor / Consultant</h2>
        </div>

        <form onSubmit={handleAddDoctor} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Doctor Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Prof. Dr. Farhan Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department / Wing <span className="text-rose-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
              >
                {INITIAL_DEPARTMENTS.map((d, i) => (
                  <option key={i} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Professor & Senior Consultant"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Qualifications & Degrees <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MBBS, FCPS (Surgery), MS"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specialty Focus
              </label>
              <input
                type="text"
                placeholder="e.g. Laparoscopy & Laser Surgery"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Consultation Fee (৳ BDT) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                max="20000"
                required
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Chamber / Room Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Room 302, 3rd Floor"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Visiting Hours <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 05:00 PM - 09:00 PM"
                value={visitingHours}
                onChange={(e) => setVisitingHours(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Visiting Days (comma-separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Saturday, Monday, Wednesday"
                value={visitingDays}
                onChange={(e) => setVisitingDays(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Direct Contact Phone
              </label>
              <input
                type="tel"
                placeholder="01303-359905"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="doctor@alinsafhospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Photo Upload / URL via ImageUploadInput */}
          <ImageUploadInput
            label="Doctor Profile Photo"
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            selectedFile={imageFile}
            onFileSelect={setImageFile}
            folder="hospital/doctors"
            defaultPlaceholder={DEFAULT_DOCTOR_IMAGE}
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Uploading photo & saving...' : 'Save Doctor Profile'}</span>
          </button>
        </form>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctors by name, specialty..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 shrink-0">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            {INITIAL_DEPARTMENTS.map((d, i) => (
              <option key={i} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Existing Doctors List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Active Hospital Doctors & Consultants</h3>
            <p className="text-xs text-slate-500">Showing {filteredDoctors.length} of {doctors.length} Registered Doctors</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4">Department & Specialty</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Room & Fee</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {fetchingDoctors ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                        <div className="space-y-1">
                          <Skeleton className="w-32 h-4" />
                          <Skeleton className="w-24 h-3" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="py-3.5 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-3.5 px-4 text-right"><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No doctors match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc, idx) => (
                  <tr key={doc._id || doc.slug || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={doc.imageUrl || DEFAULT_DOCTOR_IMAGE}
                          alt={doc.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_DOCTOR_IMAGE;
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-slate-500">{doc.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-primary-700">{doc.department}</div>
                      <div className="text-[11px] text-slate-500">{doc.qualifications}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{doc.visitingHours}</div>
                      <div className="text-[11px] text-slate-500">
                        {Array.isArray(doc.visitingDays) ? doc.visitingDays.join(', ') : doc.visitingDays}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">{doc.roomNumber}</div>
                      <div className="font-bold text-emerald-700">৳{doc.consultationFee}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Doctor Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doc._id || doc.slug, doc.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Doctor Modal */}
      {isEditModalOpen && editingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Doctor Profile</h3>
                <p className="text-xs text-slate-500">Update consultant information and photo</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDoctor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.name || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingDoctor.department || INITIAL_DEPARTMENTS[0].name}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500"
                  >
                    {INITIAL_DEPARTMENTS.map((d, i) => (
                      <option key={i} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.designation || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.qualifications || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, qualifications: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={editingDoctor.specialty || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (৳)</label>
                  <input
                    type="number"
                    value={editingDoctor.consultationFee ?? 1500}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chamber Room</label>
                  <input
                    type="text"
                    value={editingDoctor.roomNumber || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visiting Hours</label>
                  <input
                    type="text"
                    value={editingDoctor.visitingHours || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, visitingHours: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visiting Days (comma-separated)</label>
                  <input
                    type="text"
                    value={typeof editingDoctor.visitingDays === 'string' ? editingDoctor.visitingDays : Array.isArray(editingDoctor.visitingDays) ? editingDoctor.visitingDays.join(', ') : ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, visitingDays: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="pt-2">
                <ImageUploadInput
                  label="Doctor Photo"
                  imageUrl={editingDoctor.imageUrl || ''}
                  onImageUrlChange={(url) => setEditingDoctor({ ...editingDoctor, imageUrl: url })}
                  selectedFile={editImageFile}
                  onFileSelect={setEditImageFile}
                  folder="hospital/doctors"
                  defaultPlaceholder={DEFAULT_DOCTOR_IMAGE}
                />
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
                  disabled={editLoading}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {editLoading ? 'Saving changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
