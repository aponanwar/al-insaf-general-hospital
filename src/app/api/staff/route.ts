import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { Staff, StaffRole, Doctor } from '@/lib/types';
import { sanitizeObject } from '@/lib/security';
import { INITIAL_STAFF, INITIAL_DOCTORS } from '@/lib/seed-data';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const ROLE_PREFIX_MAP: Record<string, string> = {
  administrative: 'ADM',
  doctor: 'DOC',
  nurse: 'NUR',
  pharmacist: 'PHM',
  receptionist: 'RCP',
  security: 'SEC',
  wardboy: 'WRD',
  technician: 'TEC',
  cleaner: 'CLN',
};

/**
 * GET: Fetch staff list with role, status, and search filters.
 * Seamlessly integrates doctors from doctors list when role='doctor'.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get('role')?.toLowerCase();
    const statusParam = searchParams.get('status')?.toLowerCase();
    const searchQuery = searchParams.get('search')?.trim().toLowerCase();

    const session = await getSession();
    const isAdmin = session?.role === 'admin';

    let staffList: Staff[] = [];

    try {
      const staffCol = await getCollection<Staff>('staffs');
      staffList = await staffCol.find({}).toArray();
    } catch (dbErr) {
      console.warn('Database error fetching staff, using initial fallback list:', dbErr);
    }

    if (staffList.length === 0) {
      staffList = [...INITIAL_STAFF] as Staff[];
    }

    // Special Requirement: If role is 'doctor' (or 'all'), also integrate doctors from doctors roster
    let doctorsRosterStaff: Staff[] = [];
    try {
      const docCol = await getCollection<Doctor>('doctors');
      const doctorsFromDb = await docCol.find({}).toArray();
      const docsSource = doctorsFromDb.length > 0 ? doctorsFromDb : INITIAL_DOCTORS;

      doctorsRosterStaff = docsSource.map((doc, idx) => ({
        _id: doc._id || `doc-${idx}`,
        staffId: `AIGH-DOC-${100 + (idx + 1)}`,
        name: doc.name,
        role: 'doctor' as StaffRole,
        phone: doc.phone || '01712-345678',
        imageUrl: doc.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        department: doc.department,
        designation: doc.designation || 'Consultant Specialist',
        email: doc.email || `${doc.slug || 'doctor'}@alinsafhospital.com`,
        dateOfBirth: '1975-01-01',
        bloodGroup: 'A+',
        gender: 'Male',
        address: 'Dhaka, Bangladesh',
        licenseNumber: `BMDC-A-${24000 + idx}`,
        joiningDate: '2015-01-01',
        shiftTiming: doc.visitingHours || 'OPD Visiting Hours',
        employmentStatus: doc.isActive !== false ? 'active' : 'on leave',
        salary: 220000,
        createdAt: doc.createdAt || new Date().toISOString(),
      }));
    } catch (docErr) {
      console.warn('Warning mapping doctors roster for staff:', docErr);
    }

    // Merge doctor staff if needed
    if (roleParam === 'doctor') {
      // Prioritize doctors roster as requested
      staffList = doctorsRosterStaff;
    } else {
      // For all or other roles, combine unique records
      const existingDocNames = new Set(staffList.filter(s => s.role === 'doctor').map(s => s.name.toLowerCase()));
      const additionalDocs = doctorsRosterStaff.filter(d => !existingDocNames.has(d.name.toLowerCase()));
      staffList = [...staffList, ...additionalDocs];
    }

    // Apply role filter
    if (roleParam && roleParam !== 'all') {
      staffList = staffList.filter((s) => s.role === roleParam);
    }

    // Apply status filter
    if (statusParam && statusParam !== 'all') {
      staffList = staffList.filter((s) => s.employmentStatus === statusParam);
    }

    // Apply search filter (Name, Staff ID, Phone, Department)
    if (searchQuery) {
      staffList = staffList.filter((s) =>
        s.name?.toLowerCase().includes(searchQuery) ||
        s.staffId?.toLowerCase().includes(searchQuery) ||
        s.phone?.includes(searchQuery) ||
        s.department?.toLowerCase().includes(searchQuery) ||
        s.designation?.toLowerCase().includes(searchQuery)
      );
    }

    // Public sanitization: If not logged in as admin, strip confidential fields
    const sanitizedStaff = staffList.map((s) => {
      if (isAdmin) return s;
      return {
        _id: s._id,
        staffId: s.staffId,
        name: s.name,
        role: s.role,
        phone: s.phone,
        imageUrl: s.imageUrl,
        department: s.department,
        designation: s.designation,
      };
    });

    return NextResponse.json({
      success: true,
      staff: sanitizedStaff,
      count: sanitizedStaff.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch staff data' },
      { status: 500 }
    );
  }
}

/**
 * POST: Add new staff member (Admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const rawBody = await req.json();
    const body = sanitizeObject<Record<string, any>>(rawBody);

    if (!body.name || !body.role || !body.phone) {
      return NextResponse.json(
        { error: 'Name, Role, and Phone Number are required fields.' },
        { status: 400 }
      );
    }

    const prefix = ROLE_PREFIX_MAP[body.role] || 'STF';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const staffId = body.staffId?.trim() || `AIGH-${prefix}-${randomSuffix}`;

    const newStaff: Staff = {
      staffId,
      name: body.name.trim(),
      role: body.role as StaffRole,
      phone: body.phone.trim(),
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      department: body.department || 'General Services',
      designation: body.designation || '',
      email: body.email?.trim() || '',
      dateOfBirth: body.dateOfBirth || '',
      bloodGroup: body.bloodGroup || '',
      gender: body.gender || 'Male',
      address: body.address || '',
      licenseNumber: body.licenseNumber || '',
      joiningDate: body.joiningDate || new Date().toISOString().split('T')[0],
      shiftTiming: body.shiftTiming || 'General Shift',
      employmentStatus: body.employmentStatus || 'active',
      salary: body.salary ? Number(body.salary) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const staffCol = await getCollection<Staff>('staffs');
    const result = await staffCol.insertOne(newStaff as any);

    return NextResponse.json({
      success: true,
      message: 'Staff member added successfully.',
      staff: { ...newStaff, _id: result.insertedId.toString() },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create staff member.' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update existing staff member (Admin only)
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const rawBody = await req.json();
    const body = sanitizeObject<Record<string, any>>(rawBody);

    const id = body.id || body._id;
    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required for update.' }, { status: 400 });
    }

    const staffCol = await getCollection<Staff>('staffs');

    const updateFields: Partial<Staff> = {
      name: body.name?.trim(),
      role: body.role,
      phone: body.phone?.trim(),
      imageUrl: body.imageUrl,
      department: body.department,
      designation: body.designation,
      email: body.email?.trim(),
      dateOfBirth: body.dateOfBirth,
      bloodGroup: body.bloodGroup,
      gender: body.gender,
      address: body.address,
      licenseNumber: body.licenseNumber,
      joiningDate: body.joiningDate,
      shiftTiming: body.shiftTiming,
      employmentStatus: body.employmentStatus,
      salary: body.salary !== undefined ? Number(body.salary) : undefined,
      updatedAt: new Date().toISOString(),
    };

    // Clean undefined
    Object.keys(updateFields).forEach((key) => {
      if ((updateFields as any)[key] === undefined) {
        delete (updateFields as any)[key];
      }
    });

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { staffId: id }] };
    } else {
      query = { staffId: id };
    }

    const result = await staffCol.updateOne(query, { $set: updateFields });

    if (result.matchedCount === 0) {
      // If not found in DB (e.g. from initial mock seed), insert as a new customized record
      const fullNewRecord = {
        ...updateFields,
        staffId: body.staffId || `AIGH-STF-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
      };
      await staffCol.insertOne(fullNewRecord as any);
    }

    return NextResponse.json({
      success: true,
      message: 'Staff member updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update staff member.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove staff member (Admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Staff ID is required for deletion.' }, { status: 400 });
    }

    const staffCol = await getCollection<Staff>('staffs');

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { staffId: id }] };
    } else {
      query = { staffId: id };
    }

    await staffCol.deleteOne(query);

    return NextResponse.json({
      success: true,
      message: 'Staff member deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete staff member.' },
      { status: 500 }
    );
  }
}
