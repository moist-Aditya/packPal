import { eq } from 'drizzle-orm';
import { db } from '../index';
import { boxes } from '../schema';

export async function getAllBoxes() {
  return await db.select().from(boxes);
}

export async function createBox(data: {
  id: string;
  label: string;
  category?: string;
  createdAt: Date;
}) {
  await db.insert(boxes).values({
    ...data,
    isUnpacked: false,
  });
}

export async function getBoxById(id: string) {
  const res = await db.select().from(boxes).where(eq(boxes.id, id));
  return res[0];
}

export async function toggleBoxUnpacked(id: string, value: boolean) {
  await db
    .update(boxes)
    .set({ isUnpacked: value })
    .where(eq(boxes.id, id));
}

export async function deleteBox(id: string) {
  await db.delete(boxes).where(eq(boxes.id, id));
}