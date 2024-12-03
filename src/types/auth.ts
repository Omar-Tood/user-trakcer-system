import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'user']),
  createdAt: z.date(),
  avatar: z.string().optional(),
});

export type AuthUser = z.infer<typeof userSchema>;

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}