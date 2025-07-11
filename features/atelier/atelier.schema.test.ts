import { atelierSchema } from './atelier.schema';

describe('atelierSchema', () => {
  it('valide un atelier correct', () => {
    const valid = atelierSchema.safeParse({
      titre: 'Atelier Test',
      description: 'Un atelier de test',
      date: '2025-07-11',
      animateur: 'Jean Dupont',
    });
    expect(valid.success).toBe(true);
  });

  it('rejette un atelier sans titre', () => {
    const invalid = atelierSchema.safeParse({
      description: 'Un atelier',
      date: '2025-07-11',
      animateur: 'Jean Dupont',
    });
    expect(invalid.success).toBe(false);
  });
});
