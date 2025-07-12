import { z } from 'zod';

export const groupeSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  membres: z.array(z.string()).optional(),
  // autres champs…
});

export type Groupe = z.infer<typeof groupeSchema>;
