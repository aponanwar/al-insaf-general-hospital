import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import { rateLimitMiddleware } from '@/lib/rate-limit';
import { sanitizeObject, isBotSubmission, generateTrackingId } from '@/lib/security';
import { getSession } from '@/lib/auth';
import { Appointment } from '@/lib/types';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// Input validation schema
const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  patientPhone: z.string().min(6, 'Valid phone number required').max(20),
  patientEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  patientAge: z.number().min(1).max(120),
  patientGender: z.enum(['Male', 'Female', 'Other']),
  patientAddress: z.string().max(200).optional(),
  department: z.string().min(2),
  doctorId: z.string().min(1),
  doctorName: z.string().min(2),
  appointmentDate: z.string().min(8),
  preferredTimeSlot: z.string().min(2),
  symptoms: z.string().max(1000).optional(),
});

/**
 * Public: Submit appointment with rate limiting and bot detection
 */
export async function POST(req: NextRequest) {
  // 1. Check Rate Limit (e.g. max 10 appointments per minute per IP)
  const rateLimitError = rateLimitMiddleware(req, {
    limit: 10,
    windowMs: 60000,
    identifier: 'appointment-create',
  });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await req.json();

    // 2. Anti-bot honeypot check
    if (isBotSubmission(rawBody)) {
      // Fake successful response to trick spambots without saving to DB
      return NextResponse.json({
        success: true,
        appointment: {
          trackingId: generateTrackingId(),
          patientName: rawBody.patientName || 'Patient',
          status: 'Pending',
        },
      });
    }

    // 3. Deep sanitization
    const sanitizedBody = sanitizeObject<Record<string, any>>(rawBody);

    // 4. Validate with Zod
    const validatedData = appointmentSchema.parse(sanitizedBody);

    const trackingId = generateTrackingId('APT');

    const newAppointment: Appointment = {
      trackingId,
      patientName: validatedData.patientName,
      patientPhone: validatedData.patientPhone,
      patientEmail: validatedData.patientEmail || '',
      patientAge: validatedData.patientAge,
      patientGender: validatedData.patientGender,
      patientAddress: validatedData.patientAddress || '',
      department: validatedData.department,
      doctorId: validatedData.doctorId,
      doctorName: validatedData.doctorName,
      appointmentDate: validatedData.appointmentDate,
      preferredTimeSlot: validatedData.preferredTimeSlot,
      symptoms: validatedData.symptoms || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // 5. Store in raw MongoDB collection
    const collection = await getCollection<Appointment>('appointments');
    const result = await collection.insertOne(newAppointment as any);

    return NextResponse.json({
      success: true,
      appointment: {
        ...newAppointment,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error: any) {
    console.error('Appointment Submission Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.errors ? error.errors[0].message : error.message || 'Validation failed.',
      },
      { status: 400 }
    );
  }
}

/**
 * Admin: Get all appointments
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let appointments: Appointment[] = [];
    try {
      const collection = await getCollection<Appointment>('appointments');
      appointments = await collection.find({}).sort({ createdAt: -1 }).toArray();
    } catch (dbErr) {
      console.warn('MongoDB not yet connected for appointments, returning empty list');
    }

    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: true, appointments: [] }
    );
  }
}

/**
 * Admin: Update appointment status (Pending, Confirmed, Completed, Cancelled)
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, adminNotes } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
    }

    const collection = await getCollection<Appointment>('appointments');
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) as any } : { trackingId: id };

    await collection.updateOne(query, {
      $set: {
        status,
        adminNotes: adminNotes || '',
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Appointment ${status} successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
