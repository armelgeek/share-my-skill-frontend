import { z } from 'zod';

export const commentaireSchema = z.object({
  contenu: z.string().min(1, 'Le contenu est requis'),
  auteur: z.string(),
  date: z.string(),
  ressourceId: z.string().optional(),
  // autres champs…
});

export type Commentaire = z.infer<typeof commentaireSchema>;
