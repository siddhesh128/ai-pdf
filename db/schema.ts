import { serial, text, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').default(''),
  category: text('category').default('general').notNull(),
  images: text('images').array().default([]),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Add this line to ensure the schema is properly exported
export const schema = { books };