import { db } from './index';
import { sql } from 'drizzle-orm';

export async function initDB() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS boxes (
      id TEXT PRIMARY KEY NOT NULL,
      label TEXT NOT NULL,
      category TEXT,
      is_unpacked INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  await db.run(sql`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      box_id TEXT NOT NULL,
      is_essential INTEGER NOT NULL DEFAULT 0,
      image_uri TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (box_id) REFERENCES boxes(id) ON DELETE CASCADE
    );
  `);
}
