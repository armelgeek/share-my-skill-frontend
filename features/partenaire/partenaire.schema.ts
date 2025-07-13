import { z } from 'zod';

export const partenaireSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  type: z.string().min(1, 'Le type est requis'),
  contact: z.string().optional(),
  email: z.string().email('Email invalide').optional(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  siteWeb: z.string().url('URL invalide').optional(),
  isActif: z.boolean().optional(),
});

export type Partenaire = z.infer<typeof partenaireSchema>;
