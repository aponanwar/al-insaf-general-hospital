import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { verifyPassword, signToken, hashPassword, AUTH_COOKIE_NAME } from '@/lib/auth';
import { rateLimitMiddleware } from '@/lib/rate-limit';
import { User } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Rate limit on login attempts: max 15 attempts per minute per IP
  const rateLimitError = rateLimitMiddleware(req, {
    limit: 15,
    windowMs: 60000,
    identifier: 'admin-login-attempt',
  });
  if (rateLimitError) return rateLimitError;

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const inputEmail = email.trim().toLowerCase();
    const inputPass = typeof password === 'string' ? password.trim() : '';

    const defaultAdminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@hospital.com').trim().toLowerCase();
    const defaultAdminPass = (process.env.ADMIN_DEFAULT_PASSWORD || 'AdminHospital@2026#Secure').trim();

    let user: User | null = null;
    let isValid = false;

    // 1. Check MongoDB database for registered admin/staff users
    try {
      const collection = await getCollection<User>('users');
      user = await collection.findOne({
        $or: [
          { email: inputEmail },
          { email: { $regex: new RegExp(`^${inputEmail}$`, 'i') } }
        ]
      });

      if (user && user.passwordHash) {
        isValid = await verifyPassword(inputPass, user.passwordHash);
      }
    } catch (dbErr: any) {
      console.warn('MongoDB query warning during login attempt:', dbErr?.message);
    }

    // 2. Fallback to default admin configured in environment variables
    if (!isValid && inputEmail === defaultAdminEmail && inputPass === defaultAdminPass) {
      user = {
        name: 'Hospital Chief Administrator',
        email: defaultAdminEmail,
        passwordHash: '',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      isValid = true;

      // Persist to MongoDB in background if not present
      getCollection<User>('users')
        .then(async (collection) => {
          const existing = await collection.findOne({ email: defaultAdminEmail });
          if (!existing) {
            const passwordHash = await hashPassword(defaultAdminPass);
            await collection.insertOne({
              name: 'Hospital Chief Administrator',
              email: defaultAdminEmail,
              passwordHash,
              role: 'admin',
              createdAt: new Date().toISOString(),
            } as any);
          }
        })
        .catch(() => {});
    }

    if (!isValid || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const token = await signToken({
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const isLocalhost = req.headers.get('host')?.includes('localhost') || req.headers.get('host')?.includes('127.0.0.1');

    // Create JSON response
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set cookie explicitly on the response header so browser stores it immediately
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: !isLocalhost && process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
