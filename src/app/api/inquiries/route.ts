import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import { rateLimitMiddleware } from '@/lib/rate-limit';
import { sanitizeObject, isBotSubmission } from '@/lib/security';
import { getSession } from '@/lib/auth';
import { Inquiry } from '@/lib/types';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Valid phone number required').max(20),
  subject: z.string().min(3, 'Subject is required').max(200),
  department: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
});

export async function POST(req: NextRequest) {
  // Rate limit: max 5 inquiries per minute per IP
  const rateLimitError = rateLimitMiddleware(req, {
    limit: 5,
    windowMs: 60000,
    identifier: 'inquiry-create',
  });
  if (rateLimitError) return rateLimitError;

  try {
    const rawBody = await req.json();

    if (isBotSubmission(rawBody)) {
      return NextResponse.json({ success: true, message: 'Inquiry submitted' });
    }

    const sanitized = sanitizeObject<Record<string, any>>(rawBody);
    const validated = inquirySchema.parse(sanitized);

    const newInquiry: Inquiry = {
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      subject: validated.subject,
      department: validated.department || 'General',
      message: validated.message,
      status: 'Unread',
      createdAt: new Date().toISOString(),
    };

    const collection = await getCollection<Inquiry>('inquiries');
    await collection.insertOne(newInquiry as any);

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.errors ? error.errors[0].message : error.message || 'Validation failed.',
      },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let inquiries: Inquiry[] = [];
    try {
      const collection = await getCollection<Inquiry>('inquiries');
      inquiries = await collection.find({}).sort({ createdAt: -1 }).toArray();
    } catch (dbErr) {
      console.warn('MongoDB not yet connected for inquiries, returning empty list');
    }

    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: true, inquiries: [] });
  }
}
