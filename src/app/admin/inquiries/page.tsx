'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Send,
  RefreshCw,
  Archive,
  Eye,
  X,
  Sparkles,
  User,
  Building2,
  Calendar,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Reply,
  ArrowLeft
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Inquiry } from '@/lib/types';

// Preset reply templates for quick responses
const REPLY_TEMPLATES = [
  {
    title: 'Select a quick response template...',
    subject: '',
    body: '',
  },
  {
    title: 'General Confirmation & Welcome',
    subject: 'Response to Your Inquiry - Al Insaf General Hospital',
    body: `Thank you for contacting Al Insaf General Hospital, Dewanganj. We have received your query.

Our patient assistance team is reviewing your inquiry. If you require immediate support or want to book a specialist doctor appointment, please call our 24/7 hotline at 01303-359905 or 01913-129020.

We look forward to serving you with the highest standard of healthcare.`,
  },
  {
    title: 'Doctor Appointment & Serial Guidance',
    subject: 'Doctor Appointment & Serial Information - Al Insaf General Hospital',
    body: `Thank you for inquiring about doctor consultations at Al Insaf General Hospital.

Specialist doctors and consultants are available across various departments including Medicine, Gynaecology, Surgery, Orthopaedics, Paediatrics, and Cardiology.

To reserve your serial, you can:
1. Book directly online at our website: https://alinsafhospital.com/appointments
2. Or call our OPD appointment desk at 01303-359905 / 01913-129020.

Please feel free to reach out if you have any questions about specific visiting hours or specialist availability.`,
  },
  {
    title: 'Diagnostic Test & Reports Query',
    subject: 'Diagnostic & Laboratory Services - Al Insaf General Hospital',
    body: `Thank you for your inquiry regarding diagnostic tests and pathology services.

Our hospital provides comprehensive diagnostic facilities including Digital X-Ray, 4D Ultrasonography, 12-Lead ECG, 2D Echocardiography, Automated Pathology & Blood Tests, and Endoscopy.

Diagnostic reception is open daily. Routine test reports are delivered promptly on the same day. For specific test fees or preparation instructions, please call our hotline: 01303-359905.`,
  },
  {
    title: 'Admission, Cabin & ICU Facilities',
    subject: 'Inpatient Admission & Cabin Information - Al Insaf General Hospital',
    body: `Thank you for contacting us regarding hospital admission and accommodations.

We offer Deluxe VIP Cabins, Single AC Cabins, Double Sharing Cabins, and General Wards along with a state-of-the-art ICU/HDU setup and 24/7 emergency care.

For emergency admissions, our emergency medical officer is available round the clock. Please contact the admission desk directly at 01303-359905 for immediate room allotment.`,
  },
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Unread' | 'Replied' | 'Archived'>('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Active inquiry for modal view & reply
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  // Reply form state
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccessMsg, setReplySuccessMsg] = useState('');
  const [replyErrorMsg, setReplyErrorMsg] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Open inquiry modal & populate reply subject
  const handleOpenInquiry = (inq: Inquiry, autoOpenReply = false) => {
    setActiveInquiry(inq);
    setReplySubject(inq.replySubject || `Re: ${inq.subject} - Al Insaf General Hospital`);
    setReplyMessage(inq.replyMessage || '');
    setReplySuccessMsg('');
    setReplyErrorMsg('');
    setSelectedTemplate(0);
    setIsReplyOpen(autoOpenReply);
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveInquiry(null);
      }
    };
    if (activeInquiry) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeInquiry]);

  // Handle template selection
  const handleTemplateChange = (templateIndex: number) => {
    setSelectedTemplate(templateIndex);
    if (templateIndex > 0 && REPLY_TEMPLATES[templateIndex]) {
      const tpl = REPLY_TEMPLATES[templateIndex];
      setReplySubject(`Re: ${activeInquiry?.subject || tpl.subject}`);
      setReplyMessage(tpl.body);
    }
  };

  // Send Email Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry) return;

    if (!replyMessage.trim()) {
      setReplyErrorMsg('Please enter a response message before sending.');
      return;
    }

    setSendingReply(true);
    setReplyErrorMsg('');
    setReplySuccessMsg('');

    try {
      const res = await fetch('/api/inquiries/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeInquiry._id,
          replySubject,
          replyMessage,
          adminName: 'Al Insaf Hospital Patient Support',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reply');
      }

      setReplySuccessMsg(data.message || 'Reply sent successfully!');
      
      // Update local inquiries state
      if (data.inquiry) {
        setActiveInquiry(data.inquiry);
        setInquiries((prev) =>
          prev.map((item) => (item._id === activeInquiry._id ? data.inquiry : item))
        );
      } else {
        fetchInquiries();
      }
    } catch (err: any) {
      setReplyErrorMsg(err.message || 'An error occurred while sending the email reply.');
    } finally {
      setSendingReply(false);
    }
  };

  // Update Status directly (Unread, Replied, Archived)
  const handleStatusUpdate = async (id: string, newStatus: 'Unread' | 'Replied' | 'Archived') => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setInquiries((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        if (activeInquiry && activeInquiry._id === id) {
          setActiveInquiry({ ...activeInquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry message?')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        if (activeInquiry && activeInquiry._id === id) {
          setActiveInquiry(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique departments for filter
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    inquiries.forEach((inq) => {
      if (inq.department) set.add(inq.department);
    });
    return ['All', ...Array.from(set)];
  }, [inquiries]);

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      // Status filter
      const matchesStatus =
        selectedStatus === 'All' || inq.status === selectedStatus;

      // Department filter
      const matchesDept =
        selectedDepartment === 'All' || inq.department === selectedDepartment;

      // Search query
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        q === '' ||
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q);

      return matchesStatus && matchesDept && matchesQuery;
    });
  }, [inquiries, selectedStatus, selectedDepartment, searchQuery]);

  // Statistics
  const totalCount = inquiries.length;
  const unreadCount = inquiries.filter((i) => i.status === 'Unread').length;
  const repliedCount = inquiries.filter((i) => i.status === 'Replied').length;
  const archivedCount = inquiries.filter((i) => i.status === 'Archived').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-slate-800 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">Patient Inquiries</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Patient Inquiries & Messages
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm animate-pulse">
                {unreadCount} New Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, manage, and respond directly via email to patient inquiries submitted through the contact page
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Messages
          </button>
          <Link
            href="/contact-us#inquiry"
            target="_blank"
            className="inline-flex items-center px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Open Public Form
          </Link>
        </div>
      </div>

      {/* 4 Statistics Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedStatus('All')}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all ${
            selectedStatus === 'All'
              ? 'border-primary-500 shadow-md ring-2 ring-primary-500/20'
              : 'border-slate-200 shadow-sm hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalCount}</div>
          <p className="text-[10px] text-slate-500">All submitted queries</p>
        </div>

        <div
          onClick={() => setSelectedStatus('Unread')}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all ${
            selectedStatus === 'Unread'
              ? 'border-rose-500 shadow-md ring-2 ring-rose-500/20'
              : 'border-slate-200 shadow-sm hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-rose-500">Unread</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{unreadCount}</div>
          <p className="text-[10px] text-slate-500">Requires response</p>
        </div>

        <div
          onClick={() => setSelectedStatus('Replied')}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all ${
            selectedStatus === 'Replied'
              ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'border-slate-200 shadow-sm hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-emerald-600">Replied</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{repliedCount}</div>
          <p className="text-[10px] text-slate-500">Email sent to patient</p>
        </div>

        <div
          onClick={() => setSelectedStatus('Archived')}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all ${
            selectedStatus === 'Archived'
              ? 'border-slate-500 shadow-md ring-2 ring-slate-500/20'
              : 'border-slate-200 shadow-sm hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">Archived</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-700 mt-2">{archivedCount}</div>
          <p className="text-[10px] text-slate-500">Closed discussions</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, email, phone, subject, or message content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {departmentsList.map((dept, i) => (
                <option key={i} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider text-[10px]">
            Filter Status:
          </span>
          {(['All', 'Unread', 'Replied', 'Archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{status}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedStatus === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {status === 'All'
                  ? totalCount
                  : status === 'Unread'
                  ? unreadCount
                  : status === 'Replied'
                  ? repliedCount
                  : archivedCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Inquiry Records ({filteredInquiries.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click &quot;Reply via Email&quot; or click any record to review and dispatch a response.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 sm:px-6">Patient Contact</th>
                <th className="py-3 px-4">Subject & Excerpt</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4 sm:px-6"><Skeleton className="h-5 w-36 mb-1" /><Skeleton className="h-3 w-28" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-48 mb-1" /><Skeleton className="h-3 w-64" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-4 sm:px-6 text-right"><Skeleton className="h-8 w-24 ml-auto rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                      <div className="text-sm font-bold text-slate-700">No inquiry messages found</div>
                      <p className="text-xs text-slate-500">
                        {searchQuery || selectedStatus !== 'All'
                          ? 'Try clearing filters or changing your search criteria.'
                          : 'Public inquiries submitted through the contact page will appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq, idx) => {
                  const dateStr = inq.createdAt
                    ? new Date(inq.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recent';

                  return (
                    <tr
                      key={inq._id || idx}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        inq.status === 'Unread' ? 'bg-emerald-50/30 font-medium' : ''
                      }`}
                    >
                      {/* Patient Contact */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                            inq.status === 'Unread'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {inq.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                              <span>{inq.name}</span>
                              {inq.status === 'Unread' && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                              <a
                                href={`mailto:${inq.email}`}
                                className="hover:text-primary-600 truncate flex items-center"
                                title="Send email directly"
                              >
                                <Mail className="w-3 h-3 mr-1 shrink-0 text-slate-400" />
                                {inq.email}
                              </a>
                            </div>
                            {inq.phone && (
                              <div className="text-[10px] text-slate-500 flex items-center mt-0.5">
                                <Phone className="w-3 h-3 mr-1 shrink-0 text-slate-400" />
                                <a href={`tel:${inq.phone}`} className="hover:text-primary-600 font-mono">
                                  {inq.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subject & Message Preview */}
                      <td className="py-4 px-4 max-w-xs sm:max-w-md">
                        <div
                          onClick={() => handleOpenInquiry(inq)}
                          className="cursor-pointer group"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {inq.subject}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {inq.message}
                          </p>
                          {inq.replyMessage && (
                            <div className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1 shrink-0 text-emerald-600" />
                              <span className="truncate">Replied: &quot;{inq.replyMessage.slice(0, 50)}...&quot;</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          {inq.department || 'General'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inq.status === 'Unread'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : inq.status === 'Replied'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {inq.status === 'Unread' && <Clock className="w-3 h-3 mr-1" />}
                          {inq.status === 'Replied' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {inq.status === 'Archived' && <Archive className="w-3 h-3 mr-1" />}
                          {inq.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleOpenInquiry(inq, true)}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                          title="Reply to patient via email"
                        >
                          <Reply className="w-3.5 h-3.5 mr-1" />
                          Reply
                        </button>
                        <button
                          onClick={() => handleOpenInquiry(inq, false)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq._id)}
                          disabled={deletingId === inq._id}
                          className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Detail & Email Reply Modal */}
      {activeInquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 transition-all"
          onClick={() => setActiveInquiry(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-300 font-medium">Inquiry Details & Response</div>
                  <h3 className="text-base font-bold text-white truncate max-w-sm sm:max-w-md">
                    {activeInquiry.subject}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveInquiry(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Close inquiry modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Patient Contact Info Strip */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                  <strong className="text-slate-900 text-sm">{activeInquiry.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <a
                    href={`mailto:${activeInquiry.email}`}
                    className="text-primary-700 font-semibold hover:underline truncate block"
                  >
                    {activeInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                  <a href={`tel:${activeInquiry.phone}`} className="text-slate-900 font-semibold hover:underline block">
                    {activeInquiry.phone || 'N/A'}
                  </a>
                </div>
              </div>

              {/* Original Message Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Patient Message Content
                  </span>
                  <span>
                    Received on:{' '}
                    {activeInquiry.createdAt
                      ? new Date(activeInquiry.createdAt).toLocaleString('en-GB')
                      : 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message}
                </div>
              </div>

              {/* Status Quick Changer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">Current Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeInquiry.status === 'Unread'
                        ? 'bg-rose-100 text-rose-800'
                        : activeInquiry.status === 'Replied'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {activeInquiry.status}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleStatusUpdate(activeInquiry._id, 'Unread')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      activeInquiry.status === 'Unread'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Mark Unread
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(activeInquiry._id, 'Replied')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      activeInquiry.status === 'Replied'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Mark Replied
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(activeInquiry._id, 'Archived')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      activeInquiry.status === 'Archived'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Archive
                  </button>
                </div>
              </div>

              {/* Sent Reply History if already replied */}
              {activeInquiry.replyMessage && (
                <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                      Official Reply Sent to {activeInquiry.email}
                    </span>
                    {activeInquiry.repliedAt && (
                      <span className="text-[11px] text-emerald-700 font-normal">
                        {new Date(activeInquiry.repliedAt).toLocaleString('en-GB')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-emerald-200/60 whitespace-pre-wrap leading-relaxed">
                    {activeInquiry.replyMessage}
                  </p>
                  {activeInquiry.repliedBy && (
                    <div className="text-[10px] text-emerald-800 text-right">
                      Sent by: <strong>{activeInquiry.repliedBy}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Compose Email Reply Section */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Compose Email Reply to {activeInquiry.name}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Recipient: <strong className="text-slate-800">{activeInquiry.email}</strong>
                  </span>
                </div>

                {replySuccessMsg && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{replySuccessMsg}</span>
                  </div>
                )}

                {replyErrorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{replyErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSendReply} className="space-y-3">
                  {/* Quick Template Selector */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Quick Response Template (Optional):
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateChange(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {REPLY_TEMPLATES.map((tpl, i) => (
                        <option key={i} value={i}>
                          {tpl.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Email Subject:
                    </label>
                    <input
                      type="text"
                      required
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Email Subject Line"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Reply Message (Will be formatted in hospital branded template):
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your response to the patient here..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-500">
                      Sending from: <strong>Hospital Support Desk</strong>
                    </div>

                    <button
                      type="submit"
                      disabled={sendingReply}
                      className="inline-flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all hover:scale-105"
                    >
                      <Send className={`w-3.5 h-3.5 mr-1.5 ${sendingReply ? 'animate-bounce' : ''}`} />
                      {sendingReply ? 'Sending Email...' : 'Send Email Reply'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteInquiry(activeInquiry._id)}
                className="inline-flex items-center text-xs font-bold text-rose-600 hover:text-rose-800"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete Inquiry
              </button>

              <button
                type="button"
                onClick={() => setActiveInquiry(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
