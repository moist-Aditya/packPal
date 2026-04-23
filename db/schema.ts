import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// BOXES TABLE
export const boxes = sqliteTable('boxes', {
  id: text('id').primaryKey(),

  label: text('label').notNull(), // "Box 1"
  category: text('category'), // Kitchen, Bedroom

  isUnpacked: integer('is_unpacked', { mode: 'boolean' }).notNull().default(false),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ITEMS TABLE
export const items = sqliteTable('items', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),
  description: text('description'),

  quantity: integer('quantity').notNull().default(1),

  boxId: text('box_id')
    .notNull()
    .references(() => boxes.id, { onDelete: 'cascade' }),

  isEssential: integer('is_essential', { mode: 'boolean' }).notNull().default(false),

  imageUri: text('image_uri'),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type Box = InferSelectModel<typeof boxes>;
export type NewBox = InferInsertModel<typeof boxes>;

export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;
