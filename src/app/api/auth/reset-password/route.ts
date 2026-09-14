import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCollection } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import { rateLimitMiddleware } from '@/lib/rate-limit';
import { User } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Rate limit: max 5 reset attempts per 10 minutes per IP
  const rateLimitError = rateLimitMiddleware(req, {
    limit: 5,
    windowMs: 600000,
    identifier: 'reset-password-attempt',
  });
  if (rateLimitError) return rateLimitError;

  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Email, token, and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    // 1. Verify token in MongoDB
    try {
      const resetCol = await getCollection('password_resets');
      const resetRecord = await resetCol.findOne({
        email: normalizedEmail,
        tokenHash,
      });

      if (!resetRecord) {
        return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 });
      }

      if (new Date(resetRecord.expiresAt).getTime() < Date.now()) {
        await resetCol.deleteOne({ _id: resetRecord._id });
        return NextResponse.json({ error: 'Reset token has expired. Please request a new recovery email.' }, { status: 400 });
      }

      // 2. Hash new password
      const passwordHash = await hashPassword(newPassword);

      // 3. Update or create user in users collection
      const usersCol = await getCollection<User>('users');
      const user = await usersCol.findOne({ email: normalizedEmail });

      if (user) {
        await usersCol.updateOne(
          { _id: user._id },
          {
            $set: {
              passwordHash,
              updatedAt: new Date().toISOString(),
            },
          }
        );
      } else {
        await usersCol.insertOne({
          name: 'Hospital Chief Administrator',
          email: normalizedEmail,
          passwordHash,
          role: 'admin',
          createdAt: new Date().toISOString(),
        } as any);
      }

      // 4. Delete the used reset token to prevent replay
      await resetCol.deleteOne({ _id: resetRecord._id });

      return NextResponse.json({
        success: true,
        message: 'Your password has been reset successfully. You can now log in with your new password.',
      });
    } catch (dbErr: any) {
      return NextResponse.json({
        error: 'Database connection failed. Please ensure MongoDB is running.',
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
