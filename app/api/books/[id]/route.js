import { db } from '@/db';
import { books } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  try {
    const { id } = await context.params; // Properly await params
    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const book = await db.select()
      .from(books)
      .where(
        and(
          eq(books.id, id),
          eq(books.userId, user.id)
        )
      );

    if (!book.length) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}