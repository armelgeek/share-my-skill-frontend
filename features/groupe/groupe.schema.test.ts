import { groupeSchema } from './groupe.schema';

describe('groupeSchema', () => {
  it('valide un groupe correct', () => {
    const valid = groupeSchema.safeParse({
      nom: 'Groupe Test',
      description: 'Un groupe de test',
      membres: ['user1', 'user2'],
    });
    expect(valid.success).toBe(true);
  });

  it('rejette un groupe sans nom', () => {
    const invalid = groupeSchema.safeParse({
      description: 'Un groupe',
      membres: ['user1'],
    });
    expect(invalid.success).toBe(false);
  });
});
