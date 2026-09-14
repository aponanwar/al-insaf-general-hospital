import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window cache for rate limiting
const ipRateMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRateMap.entries()) {
      if (now > record.resetTime) {
        ipRateMap.delete(ip);
      }
    }
  }, 300000);
}

/**
 * Extract client IP from headers or connection
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }
  return '127.0.0.1';
}

export interface RateLimitOptions {
  limit?: number; // max allowed requests per window
  windowMs?: number; // window duration in ms
  identifier?: string; // custom identifier e.g. "appointment-submit"
}

/**
 * Rate limit checker function
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const limit = options.limit || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30', 10);
  const windowMs = options.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
  const identifier = options.identifier ? `:${options.identifier}` : '';
  const ip = `${getClientIp(req)}${identifier}`;

  const now = Date.now();
  const existingRecord = ipRateMap.get(ip);

  if (!existingRecord || now > existingRecord.resetTime) {
    // New window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    ipRateMap.set(ip, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetTime,
    };
  }

  // Existing active window
  if (existingRecord.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: existingRecord.resetTime,
    };
  }

  existingRecord.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - existingRecord.count,
    reset: existingRecord.resetTime,
  };
}

/**
 * Rate limit helper that returns 429 response when limit exceeded
 */
export function rateLimitMiddleware(req: NextRequest, options: RateLimitOptions = {}) {
  const result = checkRateLimit(req, options);
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please slow down and try again later.',
        retryAfterMs: result.reset - Date.now(),
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
        },
      }
    );
  }
  return null;
}
