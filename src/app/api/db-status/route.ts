import { NextResponse } from 'next/server';
import { checkMongoConnection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = await checkMongoConnection();
  return NextResponse.json(status);
}
