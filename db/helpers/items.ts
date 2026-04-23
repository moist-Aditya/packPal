import { db } from '../index';
import { items } from '../schema';
import { eq } from 'drizzle-orm';

export async function getItemsByBoxId(boxId: string) {
  return await db.select().from(items).where(eq(items.boxId, boxId));
}

export async function createItem(data: {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  boxId: string;
  isEssential: boolean;
  createdAt: Date;
}) {
  await db.insert(items).values(data);
}
