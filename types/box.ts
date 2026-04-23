import { z } from 'zod';

export const boxSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  category: z.string().optional(),
});

export type BoxFormData = z.infer<typeof boxSchema>;
