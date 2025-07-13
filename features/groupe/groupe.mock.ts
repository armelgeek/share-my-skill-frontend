import { createEnhancedMockService, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Groupe } from './groupe.schema';

export const groupeService = createEnhancedMockService<Groupe>(
  'groupes',
  () => ({
    id: mockDataGenerators.id(),
    nom: `Groupe ${mockDataGenerators.name()}`,
    description: mockDataGenerators.description(),
    membres: [mockDataGenerators.name(), mockDataGenerators.name()],
  }),
  20
);

export const joinGroupeMock = async (groupeId: string) => {
  // Simule l'ajout du membre au groupe
  // Ici, on ne gère pas l'utilisateur courant, mais on peut ajouter un nom fictif
  const groupes = await groupeService.fetchItems();
  const groupe = groupes.data.find(g => g.id === groupeId);
  if (groupe) {
    if (!groupe.membres) groupe.membres = [];
    groupe.membres.push('Utilisateur courant');
    await groupeService.updateItem(groupeId, { membres: groupe.membres });
    return { success: true };
  }
  return { success: false, error: 'Groupe introuvable' };
};

export const quitGroupeMock = async (groupeId: string) => {
  // Simule le retrait du membre du groupe
  const groupes = await groupeService.fetchItems();
  const groupe = groupes.data.find(g => g.id === groupeId);
  if (groupe && groupe.membres) {
    groupe.membres = groupe.membres.filter(nom => nom !== 'Utilisateur courant');
    await groupeService.updateItem(groupeId, { membres: groupe.membres });
    return { success: true };
  }
  return { success: false, error: 'Groupe introuvable ou membre absent' };
};
