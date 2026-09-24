export interface Doctor {
  _id?: any;
  name: string;
  slug: string;
  department: string;
  departmentSlug: string;
  designation: string;
  qualifications: string;
  specialty: string;
  roomNumber: string;
  visitingHours: string;
  visitingDays: string[];
  phone?: string;
  email?: string;
  bio?: string;
  experienceYears?: number;
  consultationFee?: number;
  imageUrl: string;
  cloudinaryPublicId?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Department {
  _id?: any;
  name: string;
  slug: string;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  facilities: string[];
  headOfDepartment?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Appointment {
  _id?: any;
  trackingId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientAddress?: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  preferredTimeSlot: string;
  symptoms: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Inquiry {
  _id?: any;
  name: string;
  email: string;
  phone: string;
  subject: string;
  department?: string;
  message: string;
  status: 'Unread' | 'Replied' | 'Archived';
  replyNotes?: string;
  replySubject?: string;
  replyMessage?: string;
  repliedAt?: string;
  repliedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RateItem {
  _id?: any;
  category: 'Cabin & Bed' | 'ICU & Emergency' | 'Diagnostic & Radiology' | 'Pathology & Lab' | 'Surgical & OT' | 'Consultation';
  code: string;
  name: string;
  description?: string;
  fee: number;
  unit?: string;
}

export interface NewsItem {
  _id?: any;
  title: string;
  slug: string;
  category: 'News' | 'Event' | 'Notice' | 'Health Tip';
  summary: string;
  content: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  publishDate: string;
  isFeatured?: boolean;
}

export interface Testimonial {
  _id?: any;
  patientName: string;
  department: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface User {
  _id?: any;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'staff' | 'doctor';
  createdAt: string;
}

export type StaffRole =
  | 'administrative'
  | 'doctor'
  | 'nurse'
  | 'pharmacist'
  | 'receptionist'
  | 'security'
  | 'wardboy'
  | 'technician'
  | 'cleaner';

export type EmploymentStatus = 'active' | 'on leave' | 'terminated';

export interface Staff {
  _id?: any;
  staffId: string;
  name: string;
  role: StaffRole;
  phone: string;
  imageUrl?: string;
  department?: string;
  // Confidential / Admin Fields:
  email?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  licenseNumber?: string;
  joiningDate?: string;
  shiftTiming?: string;
  employmentStatus: EmploymentStatus;
  salary?: number;
  designation?: string;
  createdAt?: string;
  updatedAt?: string;
}

