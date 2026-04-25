import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expoDb = SQLite.openDatabaseSync('packpal.db');

try {
  expoDb.execSync(`PRAGMA foreign_keys = ON;`);
} catch (e) {
  console.log('FK enable failed', e);
}

export const db = drizzle(expoDb);
