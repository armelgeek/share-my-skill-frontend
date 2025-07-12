import { z } from 'zod';

export const ressourceSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  url: z.string().url('URL invalide'),
  type: z.string(),
  auteur: z.string(),
  // autres champs…
});

export type Ressource = z.infer<typeof ressourceSchema>;
