import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getSession } from '@/lib/auth';
import { rateLimitMiddleware } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Rate limit uploads: max 15 uploads per minute
  const rateLimitError = rateLimitMiddleware(req, {
    limit: 15,
    windowMs: 60000,
    identifier: 'upload-image',
  });
  if (rateLimitError) return rateLimitError;

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const { file, folder } = await req.json();

    if (!file) {
      return NextResponse.json({ error: 'File data is required (base64 string or image URL)' }, { status: 400 });
    }

    const result = await uploadToCloudinary(file, folder || 'hospital/doctors');

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
