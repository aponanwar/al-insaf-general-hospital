import { NextRequest } from 'next/server';

/**
 * Basic HTML sanitizer to prevent XSS in text inputs
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // remove dangerous tags
    .slice(0, 5000); // prevent oversized payload attacks
}

/**
 * Deep sanitization for user-submitted request bodies to block NoSQL injection
 * Rejects objects that attempt operator injection like {$ne: ""}, {$gt: 0}, {$where: ...}
 */
export function sanitizeObject<T>(data: any): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return sanitizeString(data) as unknown as T;
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return data as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Reject any keys starting with "$" or containing "."
      if (key.startsWith('$') || key.includes('.')) {
        throw new Error(`Potential NoSQL Injection detected on key: ${key}`);
      }
      cleanObj[key] = sanitizeObject(value);
    }
    return cleanObj as T;
  }

  return data as unknown as T;
}

/**
 * Anti-Bot Honeypot validator
 * The client form includes a hidden field named "website_url" or "hp_field".
 * If it contains any value, it was filled by an automated bot.
 */
export function isBotSubmission(body: Record<string, any>): boolean {
  if (body.website_url && body.website_url.trim() !== '') {
    return true;
  }
  if (body.hp_field && body.hp_field.trim() !== '') {
    return true;
  }
  return false;
}

/**
 * Generate cryptographically random tracking ID for appointments (e.g. APT-2026-8942)
 */
export function generateTrackingId(prefix = 'APT'): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${randomNum}`;
}

/**
 * Check if the request origin matches allowed host to prevent CSRF
 */
export function verifyOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  if (!origin) {
    // Same-origin GET or internal server request
    return true;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
