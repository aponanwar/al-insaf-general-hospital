import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCollection } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { sendMail, getInquiryReplyHtmlTemplate } from '@/lib/email';
import { Inquiry } from '@/lib/types';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const replySchema = z.object({
  id: z.string().min(1, 'Inquiry ID is required'),
  replyMessage: z.string().min(2, 'Reply message is required').max(5000),
  replySubject: z.string().min(1, 'Subject is required').max(250),
  adminName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = replySchema.parse(body);

    const collection = await getCollection<Inquiry>('inquiries');
    const query = ObjectId.isValid(validated.id)
      ? { _id: new ObjectId(validated.id) as any }
      : { _id: validated.id };

    const inquiry = await collection.findOne(query);

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    if (!inquiry.email) {
      return NextResponse.json({ error: 'Inquiry does not have a valid recipient email address' }, { status: 400 });
    }

    const adminDisplayName = validated.adminName || session.name || 'Al Insaf Hospital Support Desk';

    // Generate HTML email template
    const html = getInquiryReplyHtmlTemplate(
      {
        name: inquiry.name,
        subject: inquiry.subject,
        message: inquiry.message,
        department: inquiry.department,
        createdAt: inquiry.createdAt,
      },
      validated.replyMessage,
      adminDisplayName
    );

    // Send the email to the patient's email address
    const emailResult = await sendMail({
      to: inquiry.email,
      subject: validated.replySubject || `Re: ${inquiry.subject} - Al Insaf General Hospital`,
      html,
      text: `${validated.replyMessage}\n\n---\nAl Insaf General Hospital\nHotline: 01303-359905, 01913-129020`,
    });

    if (!emailResult.success) {
      console.warn('Failed to deliver email to customer via SMTP:', emailResult.error);
    }

    const now = new Date().toISOString();

    // Update the inquiry status and record the reply
    const updateDoc: Partial<Inquiry> = {
      status: 'Replied',
      replySubject: validated.replySubject,
      replyMessage: validated.replyMessage,
      repliedAt: now,
      repliedBy: adminDisplayName,
      updatedAt: now,
    };

    await collection.updateOne(query, { $set: updateDoc });

    const updatedInquiry = await collection.findOne(query);

    return NextResponse.json({
      success: true,
      message: emailResult.success
        ? `Reply sent successfully to ${inquiry.email}.`
        : `Reply recorded in system. (Email notification note: ${emailResult.error || 'simulated mode'})`,
      emailDelivered: emailResult.success,
      inquiry: updatedInquiry,
    });
  } catch (error: any) {
    console.error('Error replying to inquiry:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.errors ? error.errors[0].message : error.message || 'Failed to send reply',
      },
      { status: 500 }
    );
  }
}
