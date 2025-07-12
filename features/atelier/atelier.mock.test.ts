jest.mock('@/shared/components/atoms/ui/badge', () => ({}));
jest.mock('@/shared/components/atoms/ui/icons', () => ({
  dashboard: 'icon-dashboard',
  // autres icônes si besoin
}));

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

import { atelierService } from './atelier.mock';

describe('atelierService (mock)', () => {
  it('doit générer 30 ateliers mock', async () => {
    const { data: items } = await atelierService.fetchItems({ page: 1, limit: 30 });
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(30);
    expect(items[0]).toHaveProperty('titre');
    expect(items[0]).toHaveProperty('date');
    expect(items[0]).toHaveProperty('animateur');
  });

  it('doit créer un nouvel atelier', async () => {
    const atelier = {
      titre: 'Nouveau',
      description: 'desc',
      date: '2025-07-12',
      animateur: 'Alice',
    };
    const created = await atelierService.createItem(atelier);
    expect(created.titre).toBe('Nouveau');
  });
});
