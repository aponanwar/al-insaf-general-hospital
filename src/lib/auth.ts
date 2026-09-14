import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'super_secure_hospital_jwt_secret_key_change_in_production_2026_xyz!@#';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
export const AUTH_COOKIE_NAME = 'hospital_admin_token';

export interface AdminPayload {
  email: string;
  role: string;
  name: string;
}

/**
 * Hash a plain text password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a plain text password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Sign JWT Token
 */
export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

/**
 * Verify JWT Token
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      email: payload.email as string,
      role: payload.role as string,
      name: payload.name as string,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Set HTTP-Only secure authentication cookie
 */
export function setAuthCookie(token: string) {
  try {
    cookies().set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
  } catch (err) {
    // In some edge contexts cookies() might not be mutable
  }
}

/**
 * Clear authentication cookie
 */
export function removeAuthCookie() {
  try {
    cookies().delete(AUTH_COOKIE_NAME);
  } catch (err) {
    // Ignore in read-only context
  }
}

/**
 * Get current authenticated user session from cookies
 */
export async function getSession(): Promise<AdminPayload | null> {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
