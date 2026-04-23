import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expoDb = SQLite.openDatabaseSync('packpal.db');

expoDb.execSync(`PRAGMA foreign_keys = ON;`);

export const db = drizzle(expoDb);
