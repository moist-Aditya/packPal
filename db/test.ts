import { db } from './index';
import { boxes } from './schema';
import { v4 as uuid } from 'uuid';

export async function runTest() {
  await db.insert(boxes).values({
    id: uuid(),
    label: 'Test Box',
    category: 'Test',
    createdAt: new Date(),
  });

  const res = await db.select().from(boxes);
  console.log('BOXES:', res);
}
