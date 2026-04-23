import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expoDb = SQLite.openDatabaseSync('packpal.db');

export const db = drizzle(expoDb);
