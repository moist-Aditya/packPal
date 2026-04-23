import { db } from '../index';
import { items, boxes } from '../schema';
import { eq, sql } from 'drizzle-orm';

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

export async function searchItems(query: string) {
  return await db
    .select({
      id: items.id,
      name: items.name,
      quantity: items.quantity,
      isEssential: items.isEssential,
      boxId: items.boxId,
      boxLabel: boxes.label,
    })
    .from(items)
    .leftJoin(boxes, eq(items.boxId, boxes.id))
    .where(sql`LOWER(${items.name}) LIKE LOWER(${`%${query}%`})`);
}

export async function deleteItem(id: string) {
  await db.delete(items).where(eq(items.id, id));
}