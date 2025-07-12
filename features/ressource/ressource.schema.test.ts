import { ressourceSchema } from './ressource.schema';

describe('ressourceSchema', () => {
  it('valide un objet conforme', () => {
    const valid = {
      titre: 'Documentation Next.js',
      url: 'https://nextjs.org',
      type: 'doc',
      auteur: 'admin',
    };
    expect(() => ressourceSchema.parse(valid)).not.toThrow();
  });

  it('rejette un titre vide', () => {
    const invalid = {
      titre: '',
      url: 'https://nextjs.org',
      type: 'doc',
      auteur: 'admin',
    };
    expect(() => ressourceSchema.parse(invalid)).toThrow();
  });

  it('rejette une URL invalide', () => {
    const invalid = {
      titre: 'Doc',
      url: 'not-a-url',
      type: 'doc',
      auteur: 'admin',
    };
    expect(() => ressourceSchema.parse(invalid)).toThrow();
  });
});
