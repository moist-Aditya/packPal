import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),

  quantity: z.coerce.number().min(1, 'Minimum 1'),

  description: z.string().optional(),

  isEssential: z.boolean(), // ❗ remove default here
});

export type ItemFormData = z.infer<typeof itemSchema>;
