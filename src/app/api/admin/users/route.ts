import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getSession, hashPassword } from '@/lib/auth';
import { User } from '@/lib/types';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/users
 * Returns list of administrative accounts (excluding password hashes)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const defaultAdminEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@hospital.com').trim().toLowerCase();

    try {
      const collection = await getCollection<User>('users');
      const users = await collection
        .find({}, { projection: { passwordHash: 0 } })
        .sort({ createdAt: -1 })
        .toArray();

      // If users collection is empty in DB, show the environment default admin
      if (users.length === 0) {
        return NextResponse.json({
          success: true,
          users: [
            {
              _id: 'default-admin',
              name: 'Hospital Chief Administrator',
              email: defaultAdminEmail,
              role: 'admin',
              createdAt: new Date().toISOString(),
              isDefault: true,
            },
          ],
        });
      }

      return NextResponse.json({ success: true, users });
    } catch (dbErr: any) {
      return NextResponse.json({
        success: true,
        users: [
          {
            _id: 'default-admin',
            name: 'Hospital Chief Administrator',
            email: defaultAdminEmail,
            role: 'admin',
            createdAt: new Date().toISOString(),
            isDefault: true,
          },
        ],
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Create a new admin or staff account
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'staff', 'doctor'];
    const userRole = validRoles.includes(role) ? role : 'admin';

    const collection = await getCollection<User>('users');

    // Check if user already exists
    const existing = await collection.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: `A user with email ${cleanEmail} already exists.` },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(String(password).trim());
    const newUser: User = {
      name: String(name).trim(),
      email: cleanEmail,
      passwordHash,
      role: userRole as any,
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newUser as any);

    return NextResponse.json({
      success: true,
      message: `New ${userRole} account created successfully for ${cleanEmail}.`,
      user: {
        _id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Delete an admin or staff user
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json({ error: 'User ID or email is required.' }, { status: 400 });
    }

    // Safety: prevent deleting currently logged-in account
    if (email && email.toLowerCase() === session.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'You cannot delete your own currently logged-in admin account.' },
        { status: 400 }
      );
    }

    const collection = await getCollection<User>('users');

    // Ensure we don't delete the last admin
    const adminCount = await collection.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only remaining admin account.' },
        { status: 400 }
      );
    }

    let query: any = {};
    if (id && ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else if (email) {
      query.email = email.toLowerCase();
    } else {
      return NextResponse.json({ error: 'Invalid user identifier.' }, { status: 400 });
    }

    const deleteResult = await collection.deleteOne(query);

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user.' },
      { status: 500 }
    );
  }
}
