import { db } from '@/db';
import { books } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Debug database connection and schema
    console.log('Database check:', {
      dbExists: !!db,
      booksSchema: !!books,
      booksColumns: Object.keys(books)
    });
    
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

    // Add db connection check
    if (!db) {
      console.error('Database connection not initialized');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Verify schema before insertion
    if (!books) {
      console.error('Books schema not found');
      return NextResponse.json(
        { error: 'Database schema error' },
        { status: 500 }
      );
    }

    const bookData = await request.json();
    console.log('Inserting book data:', bookData);
    
    // Validate required fields
    if (!bookData.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create new book with validated data
    const newBook = await db.insert(books).values({
      title: bookData.title,
      description: bookData.description ?? '',
      category: bookData.category ?? 'general',
      images: bookData.images ?? [],
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    const created = await db.select().from(books).where(eq(books.id, newBook[0].id));
    console.log('Book created:', created[0]);
    
    return NextResponse.json(created[0]);

  } catch (error) {
    // Enhanced error logging
    console.error('Database state:', {
      dbInitialized: !!db,
      envUrl: process.env.DATABASE_URL?.slice(0, 20) + '...',
    });
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
}