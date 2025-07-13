import { formationSchema } from './formation.schema';

describe('formationSchema', () => {
  const valid = {
    titre: 'Formation React',
    description: 'Apprendre React et TypeScript',
    dateDebut: '2025-09-01',
    dateFin: '2025-09-10',
    lieu: 'Lyon',
    formateur: 'Jean Dupont',
    capacite: 30,
    isCertifiante: true,
  };

  it('valide une formation correcte', () => {
    expect(formationSchema.parse(valid)).toBeTruthy();
  });

  it('rejette une formation sans titre', () => {
    const invalid = {
      ...valid,
      titre: '',
    };
    expect(() => formationSchema.parse(invalid)).toThrow();
  });
});
