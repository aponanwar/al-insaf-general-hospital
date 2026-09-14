import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { RateItem } from '@/lib/types';
import { INITIAL_RATES } from '@/lib/seed-data';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET /api/rates
 * Returns all tariffs / rate chart items with search and category filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let rates: RateItem[] = [];

    try {
      const collection = await getCollection<RateItem>('rates');
      const query: Record<string, any> = {};

      if (category && category !== 'All Categories') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      rates = await collection.find(query).sort({ category: 1, name: 1 }).toArray();

      // If DB is empty, auto-seed with initial rates
      if (rates.length === 0 && !search && (!category || category === 'All Categories')) {
        const totalCount = await collection.countDocuments();
        if (totalCount === 0) {
          await collection.insertMany(INITIAL_RATES as any[]);
          rates = await collection.find({}).sort({ category: 1, name: 1 }).toArray();
        }
      }
    } catch (dbErr: any) {
      console.warn('Database error while fetching rates, falling back to static rates:', dbErr?.message);
    }

    // Fallback if DB was unavailable or returned empty for query
    if (rates.length === 0) {
      rates = INITIAL_RATES.filter((item) => {
        const matchesCategory =
          !category || category === 'All Categories' || item.category === category;
        const matchesSearch =
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.code.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }

    return NextResponse.json({ success: true, rates });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, rates: INITIAL_RATES, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rates
 * Add a new tariff / test item (Admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const body = await req.json();
    const { category, code, name, description, fee, unit } = body;

    if (!category || !code || !name || fee === undefined || fee === null) {
      return NextResponse.json(
        { error: 'Category, item code, name, and fee are required.' },
        { status: 400 }
      );
    }

    const numFee = Number(fee);
    if (isNaN(numFee) || numFee < 0) {
      return NextResponse.json({ error: 'Fee must be a valid positive number.' }, { status: 400 });
    }

    const collection = await getCollection<RateItem>('rates');

    const newRate: RateItem = {
      category,
      code: String(code).trim().toUpperCase(),
      name: String(name).trim(),
      description: description ? String(description).trim() : '',
      fee: numFee,
      unit: unit ? String(unit).trim() : 'per test',
    };

    const result = await collection.insertOne(newRate as any);

    return NextResponse.json({
      success: true,
      message: 'Rate item added successfully.',
      rate: { ...newRate, _id: result.insertedId },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add rate item.' }, { status: 500 });
  }
}

/**
 * PUT /api/rates
 * Update an existing tariff item (Admin only)
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, category, code, name, description, fee, unit } = body;

    if (!id) {
      return NextResponse.json({ error: 'Rate item ID is required.' }, { status: 400 });
    }

    const collection = await getCollection<RateItem>('rates');

    const updateFields: Partial<RateItem> = {};
    if (category) updateFields.category = category;
    if (code) updateFields.code = String(code).trim().toUpperCase();
    if (name) updateFields.name = String(name).trim();
    if (description !== undefined) updateFields.description = String(description).trim();
    if (fee !== undefined) {
      const numFee = Number(fee);
      if (isNaN(numFee) || numFee < 0) {
        return NextResponse.json({ error: 'Fee must be a valid positive number.' }, { status: 400 });
      }
      updateFields.fee = numFee;
    }
    if (unit !== undefined) updateFields.unit = String(unit).trim();

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      query.code = String(code || id).toUpperCase();
    }

    const updateResult = await collection.updateOne(query, { $set: updateFields });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: 'Rate item not found to update.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Rate item updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update rate item.' }, { status: 500 });
  }
}

/**
 * DELETE /api/rates
 * Delete a tariff item (Admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Rate item ID is required.' }, { status: 400 });
    }

    const collection = await getCollection<RateItem>('rates');

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      query.code = id.toUpperCase();
    }

    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Rate item not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Rate item deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete rate item.' }, { status: 500 });
  }
}
