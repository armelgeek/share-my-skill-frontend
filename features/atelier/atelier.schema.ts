import { z } from 'zod';

export const atelierSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  date: z.string(),
  animateur: z.string(),
  // autres champs…
});

export type Atelier = z.infer<typeof atelierSchema>;
