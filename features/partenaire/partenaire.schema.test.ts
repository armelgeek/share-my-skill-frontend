import { partenaireSchema } from './partenaire.schema';

describe('partenaireSchema', () => {
  const valid = {
    nom: 'Entreprise X',
    description: 'Partenaire technologique',
    type: 'Technologie',
    contact: 'Alice Martin',
    email: 'contact@entreprise-x.com',
    telephone: '0601020304',
    adresse: '12 rue de Paris, Lyon',
    siteWeb: 'https://entreprise-x.com',
    isActif: true,
  };

  it('valide un partenaire correct', () => {
    expect(partenaireSchema.parse(valid)).toBeTruthy();
  });

  it('rejette un partenaire sans nom', () => {
    const invalid = {
      ...valid,
      nom: '',
    };
    expect(() => partenaireSchema.parse(invalid)).toThrow();
  });
});
