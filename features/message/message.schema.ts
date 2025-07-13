import { z } from 'zod';

export const messageSchema = z.object({
  contenu: z.string().min(1, 'Le contenu est requis'),
  auteur: z.string(),
  date: z.string(),
  groupe: z.string().optional(),
  // autres champs…
});

export type Message = z.infer<typeof messageSchema>;
