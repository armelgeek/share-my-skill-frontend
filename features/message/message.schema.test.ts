import { messageSchema } from './message.schema';

describe('messageSchema', () => {
  it('valide un objet conforme', () => {
    const valid = {
      contenu: 'Hello',
      auteur: 'user1',
      date: '2025-07-12',
      groupe: 'groupe1',
    };
    expect(() => messageSchema.parse(valid)).not.toThrow();
  });

  it('rejette un contenu vide', () => {
    const invalid = {
      contenu: '',
      auteur: 'user1',
      date: '2025-07-12',
    };
    expect(() => messageSchema.parse(invalid)).toThrow();
  });

  it('rejette un auteur manquant', () => {
    const invalid = {
      contenu: 'Hello',
      date: '2025-07-12',
    };
    expect(() => messageSchema.parse(invalid)).toThrow();
  });
});
