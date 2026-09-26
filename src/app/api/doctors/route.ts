import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { Doctor } from '@/lib/types';
import { sanitizeObject } from '@/lib/security';
import { INITIAL_DOCTORS } from '@/lib/seed-data';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const day = searchParams.get('day');

    const query: Record<string, any> = { isActive: true };

    if (department && department !== 'All Departments') {
      query.$or = [
        { department: { $regex: department, $options: 'i' } },
        { departmentSlug: department },
      ];
    }

    if (day && day !== 'All Days') {
      query.visitingDays = { $in: [day] };
    }

    let doctors: Doctor[] = [];
    try {
      const collection = await getCollection<Doctor>('doctors');
      doctors = await collection.find(query).toArray();
    } catch (dbErr) {
      console.warn('Database error while fetching doctors, using fallback list');
    }

    if (doctors.length === 0) {
      // Fallback to static seed data
      doctors = INITIAL_DOCTORS.filter((d) => {
        const matchesDept =
          !department ||
          department === 'All Departments' ||
          d.department.toLowerCase().includes(department.toLowerCase()) ||
          d.departmentSlug === department;
        const matchesDay = !day || day === 'All Days' || d.visitingDays.includes(day);
        return matchesDept && matchesDay;
      });
    }

    return NextResponse.json(
      { success: true, doctors },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
          'CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: true, doctors: INITIAL_DOCTORS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await req.json();
    const sanitized = sanitizeObject<Partial<Doctor>>(rawBody);

    if (!sanitized.name || !sanitized.department) {
      return NextResponse.json({ error: 'Doctor name and department are required' }, { status: 400 });
    }

    const slug = sanitized.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newDoctor: Doctor = {
      name: sanitized.name,
      slug,
      department: sanitized.department,
      departmentSlug: sanitized.departmentSlug || sanitized.department.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      designation: sanitized.designation || 'Consultant',
      qualifications: sanitized.qualifications || 'MBBS',
      specialty: sanitized.specialty || sanitized.department,
      roomNumber: sanitized.roomNumber || 'OPD Chamber',
      visitingHours: sanitized.visitingHours || '05:00 PM - 08:00 PM',
      visitingDays: sanitized.visitingDays || ['Saturday', 'Monday', 'Wednesday'],
      phone: sanitized.phone || '09666 787800',
      email: sanitized.email || '',
      consultationFee: sanitized.consultationFee || 1500,
      imageUrl:
        sanitized.imageUrl ||
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const collection = await getCollection<Doctor>('doctors');
    const result = await collection.insertOne(newDoctor as any);

    return NextResponse.json({ success: true, doctor: { ...newDoctor, _id: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await req.json();
    const sanitized = sanitizeObject<Partial<Doctor> & { id?: string }>(rawBody);

    const targetId = sanitized._id || sanitized.id || sanitized.slug;
    if (!targetId) {
      return NextResponse.json({ error: 'Doctor ID is required for update' }, { status: 400 });
    }

    const collection = await getCollection<Doctor>('doctors');
    const query = ObjectId.isValid(String(targetId))
      ? { $or: [{ _id: new ObjectId(String(targetId)) }, { slug: targetId }] }
      : { slug: targetId };

    const updateDoc: Record<string, any> = {
      ...(sanitized.name && { name: sanitized.name }),
      ...(sanitized.department && { department: sanitized.department }),
      ...(sanitized.departmentSlug && { departmentSlug: sanitized.departmentSlug }),
      ...(sanitized.designation && { designation: sanitized.designation }),
      ...(sanitized.qualifications && { qualifications: sanitized.qualifications }),
      ...(sanitized.specialty && { specialty: sanitized.specialty }),
      ...(sanitized.roomNumber && { roomNumber: sanitized.roomNumber }),
      ...(sanitized.visitingHours && { visitingHours: sanitized.visitingHours }),
      ...(sanitized.visitingDays && { visitingDays: sanitized.visitingDays }),
      ...(sanitized.consultationFee !== undefined && { consultationFee: Number(sanitized.consultationFee) }),
      ...(sanitized.imageUrl && { imageUrl: sanitized.imageUrl }),
      ...(sanitized.phone && { phone: sanitized.phone }),
      ...(sanitized.email && { email: sanitized.email }),
      ...(sanitized.isActive !== undefined && { isActive: sanitized.isActive }),
      updatedAt: new Date().toISOString(),
    };

    const updateResult = await collection.updateOne(query as any, { $set: updateDoc });

    if (updateResult.matchedCount === 0) {
      const newRecord = {
        ...sanitized,
        slug: sanitized.slug || sanitized.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        createdAt: new Date().toISOString(),
      };
      await collection.insertOne(newRecord as any);
    }

    return NextResponse.json({ success: true, message: 'Doctor record updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const collection = await getCollection<Doctor>('doctors');
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { slug: id };

    await collection.deleteOne(query);

    return NextResponse.json({ success: true, message: 'Doctor deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
