'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Stethoscope,
  Trash2
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '@/lib/seed-data';
import { Doctor } from '@/lib/types';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(INITIAL_DEPARTMENTS[0].name);
  const [designation, setDesignation] = useState('Professor & Senior Consultant');
  const [qualifications, setQualifications] = useState('MBBS, FCPS, MD');
  const [specialty, setSpecialty] = useState('');
  const [roomNumber, setRoomNumber] = useState('Room 301, 3rd Floor');
  const [visitingHours, setVisitingHours] = useState('05:00 PM - 09:00 PM');
  const [visitingDays, setVisitingDays] = useState('Saturday, Monday, Wednesday');
  const [consultationFee, setConsultationFee] = useState(1500);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.doctors || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Read as base64 for preview and upload
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let finalImageUrl = imageUrl;

      // If user uploaded a new image file, upload to Cloudinary via /api/upload
      if (imageFile) {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: imageUrl, folder: 'hospital/doctors' }),
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = uploadData.url;
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

      setSuccessMsg(`Doctor ${name} registered successfully.`);
      setName('');
      setSpecialty('');
      setImageFile(null);
      fetchDoctors();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating doctor.');
    } finally {
      setLoading(false);
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

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Doctor Directory Management</h1>
              <p className="text-xs text-slate-500">Register new consultants and upload profile photos</p>
            </div>
          </div>
        </div>

        {/* Add Doctor Form */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-slate-900">Add New Doctor / Consultant</h2>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-800 font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddDoctor} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Doctor Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Dr. Farhan Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department / Wing *
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
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Professor & Senior Consultant"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Qualifications & Degrees *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, FCPS (Surgery), MS"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
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
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Consultation Fee (৳) *
                </label>
                <input
                  type="number"
                  min="500"
                  max="10000"
                  required
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Chamber / Room Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 302, 3rd Floor"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Visiting Hours *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 05:00 PM - 09:00 PM"
                  value={visitingHours}
                  onChange={(e) => setVisitingHours(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Visiting Days (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Saturday, Monday, Wednesday"
                  value={visitingDays}
                  onChange={(e) => setVisitingDays(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Image Upload / URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload Photo to Cloudinary
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Or Paste External Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Saving Doctor...' : 'Save Doctor Profile'}</span>
            </button>
          </form>
        </div>

        {/* Existing Doctors List */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Hospital Doctors & Consultants</h3>
              <p className="text-xs text-slate-500">Total Registered: {doctors.length} Doctors</p>
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
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No doctors found in directory.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={doc.imageUrl}
                            alt={doc.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
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
                        <div className="text-[11px] text-slate-500">{doc.visitingDays.join(', ')}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700">{doc.roomNumber}</div>
                        <div className="font-bold text-emerald-700">৳{doc.consultationFee}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteDoctor(doc._id || doc.slug, doc.name)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
