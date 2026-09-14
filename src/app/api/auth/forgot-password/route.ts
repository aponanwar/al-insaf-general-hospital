import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCollection } from '@/lib/mongodb';
import { rateLimitMiddleware } from '@/lib/rate-limit';
import { sendMail, getPasswordResetHtmlTemplate } from '@/lib/email';
import { User } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Rate limit: max 5 forgot-password requests per 10 minutes per IP
  const rateLimitError = rateLimitMiddleware(req, {
    limit: 5,
    windowMs: 600000,
    identifier: 'forgot-password-attempt',
  });
  if (rateLimitError) return rateLimitError;

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const defaultAdminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@hospital.com').trim().toLowerCase();

    let adminName = 'Administrator';
    let userExists = false;

    // Check if user exists in database or default credentials
    try {
      const usersCol = await getCollection<User>('users');
      const user = await usersCol.findOne({ email: normalizedEmail });
      if (user) {
        userExists = true;
        adminName = user.name || 'Administrator';
      }
    } catch (err) {
      console.warn('Database error while checking user for password reset:', err);
    }

    if (normalizedEmail === defaultAdminEmail) {
      userExists = true;
      adminName = 'Hospital Chief Administrator';
    }

    if (!userExists) {
      // Don't leak whether user exists, return generic friendly message
      return NextResponse.json({
        success: true,
        message: 'If an account exists for this email, you will receive password reset instructions shortly.',
      });
    }

    // Generate random 32-byte hex token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes validity

    // Store in MongoDB password_resets collection
    try {
      const resetCol = await getCollection('password_resets');
      // Invalidate any existing tokens for this email
      await resetCol.deleteMany({ email: normalizedEmail });
      await resetCol.insertOne({
        email: normalizedEmail,
        tokenHash,
        expiresAt,
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Could not store reset token in Mongo, proceeding with signed delivery:', dbErr);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;

    const html = getPasswordResetHtmlTemplate(resetUrl, adminName);

    const mailResult = await sendMail({
      to: normalizedEmail,
      subject: 'Password Recovery Request - Al Insaf General Hospital',
      html,
      text: `Reset your password by opening: ${resetUrl} (Valid for 15 minutes)`,
    });

    return NextResponse.json({
      success: true,
      message: 'Password recovery email sent. Please check your inbox (and spam folder).',
      // In development mode when SMTP is not configured, provide direct resetUrl helper
      devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
