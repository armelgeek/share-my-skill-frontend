import { badgeSchema } from './badge.schema';

describe('badgeSchema', () => {
  it('valide un objet conforme', () => {
    const valid = {
      nom: 'Expert',
      description: 'Badge pour les experts',
      couleur: '#FFD700',
      icone: 'star',
    };
    expect(() => badgeSchema.parse(valid)).not.toThrow();
  });

  it('rejette un nom vide', () => {
    const invalid = {
      nom: '',
      description: 'Badge',
    };
    expect(() => badgeSchema.parse(invalid)).toThrow();
  });
});
