import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  status: z.enum(['pending', 'paid', 'failed']),
  createdAt: z.date(),
  paidAt: z.date().optional(),
  lateDuration: z.string(),
  description: z.string(),
});

export type Payment = z.infer<typeof paymentSchema>;

export const LATE_FEE_PER_HOUR = 5; // $5 per hour