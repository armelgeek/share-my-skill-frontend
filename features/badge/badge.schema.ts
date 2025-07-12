import { z } from 'zod';

export const badgeSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  couleur: z.string().optional(),
  icone: z.string().optional(),
  // autres champs…
});

export type Badge = z.infer<typeof badgeSchema>;
