import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { sendAppointmentSms, sendSms } from '@/lib/sms';
import { Appointment } from '@/lib/types';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, customMessage } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID or tracking ID is required' }, { status: 400 });
    }

    const collection = await getCollection<Appointment>('appointments');
    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) as any }
      : { trackingId: id };

    const apt = await collection.findOne(query);

    if (!apt) {
      return NextResponse.json({ error: 'Appointment record not found' }, { status: 404 });
    }

    if (!apt.patientPhone) {
      return NextResponse.json({ error: 'Appointment does not have a valid patient phone number' }, { status: 400 });
    }

    let smsResult;
    if (customMessage && customMessage.trim()) {
      smsResult = await sendSms({
        to: apt.patientPhone,
        message: customMessage.trim(),
      });
    } else {
      smsResult = await sendAppointmentSms({
        phone: apt.patientPhone,
        patientName: apt.patientName,
        serialNumber: apt.serialNumber || 1,
        trackingId: apt.trackingId,
        doctorName: apt.doctorName,
        department: apt.department,
        appointmentDate: apt.appointmentDate,
        timeSlot: apt.preferredTimeSlot,
      });
    }

    const now = new Date().toISOString();
    const smsStatus = smsResult.success
      ? `Delivered (${smsResult.provider})`
      : (smsResult.error || 'Failed');

    await collection.updateOne(query, {
      $set: {
        smsSent: smsResult.success,
        smsSentAt: now,
        smsStatus,
        updatedAt: now,
      },
    });

    const updatedAppointment = await collection.findOne(query);

    return NextResponse.json({
      success: smsResult.success,
      provider: smsResult.provider,
      message: smsResult.success
        ? `SMS successfully sent to ${apt.patientPhone} (Serial #${apt.serialNumber || 1})`
        : `SMS attempt completed with status: ${smsResult.error}`,
      smsResult,
      appointment: updatedAppointment,
    });
  } catch (error: any) {
    console.error('Error sending appointment SMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch SMS' },
      { status: 500 }
    );
  }
}
