process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

import { groupeService } from './groupe.mock';

describe('groupeService (mock)', () => {
  it('génère 20 groupes mock', async () => {
    const { data: items } = await groupeService.fetchItems({ page: 1, limit: 20 });
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(20);
    expect(items[0]).toHaveProperty('nom');
    expect(items[0]).toHaveProperty('description');
    expect(items[0]).toHaveProperty('membres');
  });

  it('crée un nouveau groupe', async () => {
    const groupe = {
      nom: 'Nouveau Groupe',
      description: 'desc',
      membres: ['Alice', 'Bob'],
    };
    const created = await groupeService.createItem(groupe);
    expect(created.nom).toBe('Nouveau Groupe');
  });
});
