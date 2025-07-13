describe('evenementSchema', () => {
import { evenementSchema } from './evenement.schema';

const valid = {
  titre: 'Conférence IA',
  description: 'Conférence sur l’intelligence artificielle',
  date: '2025-07-13',
  lieu: 'Paris',
  organisateur: 'OpenAI',
  type: 'Conférence',
  capacite: 200,
  isPublic: true,
};

describe('evenementSchema', () => {
  it('valide un événement correct', () => {
    expect(evenementSchema.parse(valid)).toBeTruthy();
  });

  it('rejette un événement sans titre', () => {
    const invalid = {
      ...valid,
      titre: '',
    };
    expect(() => evenementSchema.parse(invalid)).toThrow();
  });
});
