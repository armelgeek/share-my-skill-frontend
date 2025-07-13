import { commentaireSchema } from './commentaire.schema';

describe('commentaireSchema', () => {
  it('valide un objet conforme', () => {
    const valid = {
      contenu: 'Bravo !',
      auteur: 'user1',
      date: '2025-07-13',
      ressourceId: 'abc123',
    };
    expect(() => commentaireSchema.parse(valid)).not.toThrow();
  });

  it('rejette un contenu vide', () => {
    const invalid = {
      contenu: '',
      auteur: 'user1',
      date: '2025-07-13',
    };
    expect(() => commentaireSchema.parse(invalid)).toThrow();
  });

  it('rejette un auteur manquant', () => {
    const invalid = {
      contenu: 'Bravo !',
      date: '2025-07-13',
    };
    expect(() => commentaireSchema.parse(invalid)).toThrow();
  });
});
