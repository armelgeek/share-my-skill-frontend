import { z } from 'zod';

export const evenementSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  date: z.string().min(1, 'La date est requise'),
  lieu: z.string().min(1, 'Le lieu est requis'),
  organisateur: z.string().min(1, "L'organisateur est requis"),
  type: z.string().optional(),
  capacite: z.number().min(1, 'La capacité doit être supérieure à 0'),
  isPublic: z.boolean().optional(),
});

export type Evenement = z.infer<typeof evenementSchema>;
