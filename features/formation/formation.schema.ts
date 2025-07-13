import { z } from 'zod';

export const formationSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  dateDebut: z.string().min(1, 'La date de début est requise'),
  dateFin: z.string().min(1, 'La date de fin est requise'),
  lieu: z.string().min(1, 'Le lieu est requis'),
  formateur: z.string().min(1, 'Le formateur est requis'),
  capacite: z.number().min(1, 'La capacité doit être supérieure à 0'),
  isCertifiante: z.boolean().optional(),
});

export type Formation = z.infer<typeof formationSchema>;
