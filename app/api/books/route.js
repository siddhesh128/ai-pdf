import { db } from '@/db';
import { books } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
  try {
    const user = await currentUser();
    console.log('Current user:', user ? {
      id: user.id,
      email: user.emailAddresses,
      name: `${user.firstName} ${user.lastName}`,
      isAuthenticated: true
    } : 'Not authenticated');

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userBooks = await db
      .select()
      .from(books)
      .where(eq(books.userId, user.id));

    return NextResponse.json(userBooks);
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    const user = await currentUser();
    console.log('POST - Current user:', user?.id);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newBook = await db.insert(books).values({
      ...body,
      userId: user.id,
    }).returning();

    return NextResponse.json(newBook[0]);
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};