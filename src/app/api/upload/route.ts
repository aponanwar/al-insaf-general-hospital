import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getSession } from '@/lib/auth';
import { rateLimitMiddleware } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Rate limit uploads: max 60 uploads per minute for admins
  const rateLimitError = rateLimitMiddleware(req, {
    limit: 60,
    windowMs: 60000,
    identifier: 'upload-image',
  });
  if (rateLimitError) return rateLimitError;

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let fileData = '';
    let targetFolder = 'hospital/staff';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folderParam = formData.get('folder') as string | null;
      if (folderParam) targetFolder = folderParam;

      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || 'image/jpeg';
      fileData = `data:${mimeType};base64,${buffer.toString('base64')}`;
    } else {
      const body = await req.json();
      fileData = body.file;
      if (body.folder) targetFolder = body.folder;
    }

    if (!fileData) {
      return NextResponse.json(
        { error: 'File data is required (base64 string, image file, or image URL)' },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(fileData, targetFolder);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error('API Upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}
