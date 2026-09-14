import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_RATES,
  INITIAL_NEWS,
  INITIAL_TESTIMONIALS,
} from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@hospital.com';
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminHospital@2026#Secure';

    // 1. Seed Departments
    const deptCol = await getCollection('departments');
    const deptCount = await deptCol.countDocuments();
    if (deptCount === 0) {
      await deptCol.insertMany(INITIAL_DEPARTMENTS as any[]);
    }

    // 2. Seed Doctors
    const docCol = await getCollection('doctors');
    const docCount = await docCol.countDocuments();
    if (docCount === 0) {
      await docCol.insertMany(INITIAL_DOCTORS as any[]);
    }

    // 3. Seed Rate Charts
    const rateCol = await getCollection('rates');
    const rateCount = await rateCol.countDocuments();
    if (rateCount === 0) {
      await rateCol.insertMany(INITIAL_RATES as any[]);
    }

    // 4. Seed News
    const newsCol = await getCollection('news');
    const newsCount = await newsCol.countDocuments();
    if (newsCount === 0) {
      await newsCol.insertMany(INITIAL_NEWS as any[]);
    }

    // 5. Seed Testimonials
    const testCol = await getCollection('testimonials');
    const testCount = await testCol.countDocuments();
    if (testCount === 0) {
      await testCol.insertMany(INITIAL_TESTIMONIALS as any[]);
    }

    // 6. Seed Admin User
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
