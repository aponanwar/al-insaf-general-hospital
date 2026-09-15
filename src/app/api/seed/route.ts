import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_RATES,
  INITIAL_NEWS,
  INITIAL_TESTIMONIALS,
  INITIAL_STAFF,
} from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@hospital.com';
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminHospital@2026#Secure';

    // =========================================================================
    // ১. ডিপার্টমেন্টস সিডিং (Departments Seeding)
    // ডেটাবেজে যদি আগে কোনো ডিপার্টমেন্ট না থাকে, তবে প্রাথমিক ডিপার্টমেন্ট ডাটা ইনসার্ট করা হয়
    // =========================================================================
    const deptCol = await getCollection('departments');
    const deptCount = await deptCol.countDocuments();
    if (deptCount === 0) {
      await deptCol.insertMany(INITIAL_DEPARTMENTS as any[]);
    }

    // =========================================================================
    // ২. ডাক্তারদের তালিকা সিডিং (Doctors Seeding)
    // =========================================================================
    const docCol = await getCollection('doctors');
    const docCount = await docCol.countDocuments();
    if (docCount === 0) {
      await docCol.insertMany(INITIAL_DOCTORS as any[]);
    }

    // =========================================================================
    // ৩. হাসপাতাল রেট চার্ট ও ট্যারিফ সিডিং (Hospital Tariffs Seeding)
    // বিভিন্ন টেস্ট, কেবিন ও আইসিইউর ফি 'rates' কালেকশনে সেভ করা হয়
    // =========================================================================
    const rateCol = await getCollection('rates');
    const rateCount = await rateCol.countDocuments();
    if (rateCount === 0) {
      await rateCol.insertMany(INITIAL_RATES as any[]);
    }

    // =========================================================================
    // ৪. হাসপাতাল নিউজ ও নোটিশ সিডিং (Hospital News Seeding)
    // =========================================================================
    const newsCol = await getCollection('news');
    const newsCount = await newsCol.countDocuments();
    if (newsCount === 0) {
      await newsCol.insertMany(INITIAL_NEWS as any[]);
    }

    // =========================================================================
    // ৫. রোগী ও স্বজনদের রিভিউ বা টেস্টিমোনিয়াল সিডিং (Testimonials Seeding)
    // =========================================================================
    const testCol = await getCollection('testimonials');
    const testCount = await testCol.countDocuments();
    if (testCount === 0) {
      await testCol.insertMany(INITIAL_TESTIMONIALS as any[]);
    }

    // =========================================================================
    // ৬. হাসপাতাল স্টাফ ও কর্মী ডাটাবেজ সিডিং (Staff Members Seeding)
    // =========================================================================
    const staffCol = await getCollection('staffs');
    const staffCount = await staffCol.countDocuments();
    if (staffCount === 0) {
      await staffCol.insertMany(INITIAL_STAFF as any[]);
    }

    // =========================================================================
    // ৭. মাস্টার অ্যাডমিন ইউজার সিডিং (Super Admin User Seeding)
    // পাসওয়ার্ড bcrypt দিয়ে সিকিউর হ্যাশ করে 'users' কালেকশনে সংরক্ষণ করা হয়
    // =========================================================================
    const userCol = await getCollection('users');
    const existingAdmin = await userCol.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await hashPassword(adminPass);
      await userCol.insertOne({
        name: 'Hospital Chief Administrator',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
      } as any);
    }

    return NextResponse.json({
      success: true,
      message: 'Hospital database initialized successfully with complete departments, doctors, rates, and admin credentials.',
    });
  } catch (error: any) {
    console.error('Seed Database Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initialize database.',
      },
      { status: 500 }
    );
  }
}
