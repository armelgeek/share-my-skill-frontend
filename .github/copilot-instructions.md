```instructions
``` Copilot Instructions: Générer une Simple Admin Page

> **Avant de générer une page ou un composant pour une nouvelle fonctionnalité admin, vérifie dans `components/ui/` si un design ou composant correspondant existe déjà pour illustrer ou structurer la fonctionnalité.  
> Si un composant adapté existe, utilise-le ou référence-le dans la page ou le formulaire généré.  
> Si aucun composant n’existe, utilise le composant générique prévu (`SimpleAdminPage` ou autre selon le contexte) et signale qu’aucun design spécifique n'a été trouvé dans `components/ui/`.**

**Tous les endpoints d’API doivent être ajoutés dans `shared/config/api.ts` sous la clé appropriée (`API_ENDPOINTS`).**

**Tous les composants générés doivent commencer par la directive `"use client"` pour être explicitement des composants client React.**

**Jamais d'appel direct à `fetch` ou à une API dans un composant React.**
- Utilise toujours l’architecture du projet : crée un service (`features/[entity]/[entity].service.ts`) qui hérite de `BaseService` (l'implémentation des appels API est dans `lib/base-service.ts`), puis un hook (`features/[entity]/hooks/use-[entity].ts`) qui encapsule l’appel API avec React Query (`useQuery` ou `useMutation`).
- Les composants ne doivent consommer que les hooks personnalisés, jamais `fetch` ou `axios` directement.
- Respecte la séparation : service = accès API (via `BaseService`), hook = gestion de la donnée/caching, composant = affichage.

**Après chaque génération de fichier, vérifie automatiquement s’il y a des erreurs de compilation ou de typage dans les fichiers générés. Si des erreurs sont détectées, corrige-les avant de considérer la tâche comme terminée.**

**Ne génère pas de commentaires dans le code, sauf si c'est strictement nécessaire pour la compréhension d'un algorithme complexe.**

Pour toute nouvelle entité admin, effectue les étapes suivantes :

1. **Schéma et type**
   - Crée le fichier `features/[entity]/[entity].schema.ts`
   - Exporte un schéma Zod et le type TypeScript correspondant :

```ts
import { z } from 'zod';
import { createField } from '@/shared/lib/admin/admin-generator';

export const [Entity]Schema = z.object({
  // ...fields...
});

export type [Entity] = z.infer<typeof [Entity]Schema>;
```

2. **Données mock et service mock**
   - Crée le fichier `features/[entity]/[entity].mock.ts`
   - Exporte un tableau de données mock et un service mock :

```ts
import { [Entity] } from './[entity].schema';
import { createMockService } from '@/shared/lib/admin/admin-generator';

export const mock[Entity]s: [Entity][] = [ /* ... */ ];
export const [entity]Service = createMockService(mock[Entity]s, {
  entityName: '[entity]s'
});

3. **Service API réel**
   - Crée le fichier `features/[entity]/[entity].service.ts` :

```ts
import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/shared/config/api';

export const [entity]Service = new BaseService<[Entity]>(API_ENDPOINTS.[entity]);
```

3.1 **Service API réel pour l’appel administration**
   - Si tu utilises une vraie API, crée le fichier `features/[entity]/hooks/use-[entity].ts` :

```ts
import { createApiService } from '@/shared/lib/admin/admin-generator';
import type { [Entity] } from './[entity].schema';
import { API_ENDPOINTS } from '@/shared/config/api';
export const [entity]Service = createApiService<[Entity]>(API_ENDPOINTS.[entity].base);
``` 

4. **Hook de query**
   - Crée le fichier `features/[entity]/hooks/use-[entity].ts` :

```ts
import { useQuery } from '@tanstack/react-query';
import { [entity]Service } from '../[entity].service';

export function use[Entity]() {
  return useQuery({
    queryKey: ['[entity]s'],
    queryFn: () => [entity]Service.list(),
  });
}
```

5. **Configuration admin**
   - Crée le fichier `features/[entity]/[entity].admin-config.ts`
   - Selon le type de service utilisé, choisis l’exemple adapté :

**a) Avec mock :**

```ts
import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { [Entity]Schema } from './[entity].schema';
import { [entity]Service } from './[entity].mock';

export const [Entity]AdminConfig = createAdminEntity('[Nom]', [Entity]Schema, {
  description: 'Gérez vos ...',
  icon: '🏷️',
  actions: { create: true, read: true, update: true, delete: true, bulk: false, },
  services: [entity]Service,
  queryKey: ['[entity]s'],
});
```

**b) Avec API réelle :**

```ts
import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { [Entity]Schema } from './[entity].schema';
import { [entity]Service } from './[entity].service';

export const [Entity]AdminConfig = createAdminEntity('[Nom]', [Entity]Schema, {
  description: 'Gérez vos ...',
  icon: '🏷️',
  actions: { create: true, read: true, update: true, delete: true, bulk: false, },
  services: [entity]Service,
  queryKey: ['[entity]s'],
});
```

6. **Page d’admin**
   - Crée le fichier `app/(admin)/admin/[entity]/page.tsx`
   - Utilise :

```tsx
import { [Entity]Schema } from '@/features/[entity]/[entity].schema';
import { [Entity]AdminConfig } from '@/features/[entity]/[entity].admin-config';
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page';

export default function [Entity]AdminPage() {
  return (
    <SimpleAdminPage
      config={[Entity]AdminConfig}
      schema={[Entity]Schema}
    />
  );
}
```

7. **Vérifie que le composant `SimpleAdminPage` est bien utilisé**  
   - Import depuis `@/shared/components/atoms/ui/simple-admin-page`.
   - `SimpleAdminPage` utilise automatiquement `SmartDynamicForm` qui détecte le mode steps et bascule vers `DynamicFormSteps` si nécessaire.

**Si le schéma comporte plus de 7 champs, limite le nombre de colonnes affichées dans le tableau admin à 5 à 7 maximum, en sélectionnant automatiquement les champs les plus pertinents pour l'usage métier (ex : nom, statut, type, date, ville, etc.). Les champs secondaires ou peu lisibles (description longue, image, etc.) ne doivent pas apparaître par défaut dans le tableau, mais restent accessibles dans le détail ou le formulaire.**

**Si le schéma comporte plus de 8 champs de formulaire, utilise automatiquement le mode `steps` (étapes) pour le formulaire admin. Divise les champs en 2-3 étapes logiques avec des titres explicites (ex : "Informations générales", "Détails complémentaires", "Finalisation"). Cette approche améliore l'UX pour les entités complexes comme Restaurant, Commande, etc.**

## 🎯 Mode Steps (Étapes) pour Formulaires Complexes

**Pour les formulaires avec plus de 8 champs, utilise le mode `steps` avec configuration avancée :**

### Configuration des Steps

```ts
ui: {
  form: {
    layout: 'steps',
    steps: [
      {
        title: 'Informations générales',
        description: 'Nom, description, type, coordonnées',
        layout: 'two-cols', // Layout spécifique à cette étape
        fields: ['name', 'description', 'cuisine', 'address', 'city', 'phone']
      },
      {
        title: 'Détails pratiques', 
        description: 'Horaires, spécialités, image',
        layout: 'simple', // Layout différent pour cette étape
        fields: ['openingHours', 'specialties', 'image']
      },
      {
        title: 'Finalisation',
        description: 'Options de livraison et validation',
        layout: 'horizontal', // Encore un autre layout
        fields: ['deliveryAvailable', 'deliveryRadius', 'isActive']
      }
    ]
  }
}
```

### Layouts Disponibles par Étape

- `'simple'` : Un champ par ligne, layout vertical classique
- `'two-cols'` : Deux colonnes côte à côte pour optimiser l'espace
- `'horizontal'` : Disposition horizontale pour les champs courts
- `'sections'` : Groupement par sections avec séparateurs

### Règles pour les Steps

1. **Divise logiquement** : Groupe les champs par thématique (infos générales, détails, options, finalisation)
2. **Titre explicite** : Chaque step doit avoir un titre clair et une description optionnelle
3. **Layout adapté** : Choisis le layout selon le type de champs dans l'étape :
   - `two-cols` pour les champs courts (nom, email, téléphone)
   - `simple` pour les champs longs (description, texte riche)
   - `horizontal` pour les toggles/checkboxes
4. **Navigation fluide** : L'utilisateur peut naviguer entre les étapes, validation progressive
5. **Feedback visuel** : Indicateur de progression, étape courante mise en évidence

### Exemple Complet

```ts
export const RestaurantAdminConfig = createAdminEntity('Restaurant', RestaurantSchema, {
  description: 'Gérez vos restaurants avec formulaire en étapes',
  icon: '🍽️',
  actions: { create: true, read: true, update: true, delete: true, bulk: true },
  services: restaurantService,
  queryKey: ['restaurants'],
  ui: {
    form: {
      layout: 'steps',
      steps: [
        {
          title: 'Informations générales',
          description: 'Nom, description, type, coordonnées',
          layout: 'two-cols',
          fields: ['name', 'description', 'cuisine', 'address', 'city', 'phone', 'email']
        },
        {
          title: 'Détails pratiques',
          description: 'Horaires, spécialités, image',
          layout: 'simple',
          fields: ['openingHours', 'specialties', 'image']
        },
        {
          title: 'Livraison',
          description: 'Options de livraison',
          layout: 'horizontal',
          fields: ['deliveryAvailable', 'deliveryRadius', 'averageDeliveryTime']
        }
      ]
    }
  }
});
```

**Le système détecte automatiquement le mode steps et utilise le composant `DynamicFormSteps` via `SmartDynamicForm` pour un rendu optimisé avec navigation, validation progressive et layouts adaptatifs.**

**À chaque fois qu’une nouvelle fonctionnalité admin est générée, ajoute automatiquement une entrée correspondante dans le menu sidebar admin.**
- La liste des menus sidebar se trouve dans `shared/lib/constants/app.constant.ts`.
- L’intitulé, l’icône et le chemin doivent être cohérents avec la nouvelle entité.
- Cette étape est obligatoire pour toute nouvelle page ou module admin.

> Remplace `[entity]`, `[Entity]`, `[Nom]` par le nom de ton entité (ex : `category`, `Category`, `Catégorie`).

**Jamais :**
- d’appel direct à `fetch` ou `axios` dans un composant React
- d’appel API dans un composant sans passer par un hook custom et un service
- d’implémentation d’appel API ailleurs que dans un service héritant de `BaseService`

**Toujours :**
- Service = accès API (via `BaseService`)
- Hook = gestion de la donnée/caching (React Query)
- Composant = affichage, consomme le hook

Cette structure garantit une admin page modulaire, claire, réutilisable et maintenable.

---

## 🏗️ Architecture du Projet

### Structure des Dossiers (extrait réel du projet)

```
/ (racine)
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       └── categories/
│   │           └── page.tsx
│   ├── (root)/
│   └── (ui)/
├── components/
│   ├── debug/
│   ├── navigation/
│   └── ui/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── providers/
│   └── category/
│       ├── category.admin-config.ts
│       ├── category.mock.ts
│       └── category.schema.ts
├── hooks/
├── lib/
├── public/
├── scripts/
├── shared/
│   ├── components/
│   ├── domain/
│   ├── hooks/
│   ├── layout/
│   ├── lib/
│   ├── providers/
│   └── styles/
```

> Cette structure réelle doit être respectée pour toute nouvelle fonctionnalité ou page d’admin.

---

### 1. Structure d'une Fonctionnalité (adaptée à ce projet)

Chaque fonctionnalité doit être organisée dans `features/[nom-fonctionnalite]/` :

```ts
// features/category/category.schema.ts
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'category.errors.name.required'),
  description: z.string().optional(),
});

// features/category/category.types.ts
export type Category = z.infer<typeof categorySchema>;

// features/category/category.config.ts
export const categoryKeys = createQueryKeys({
  entity: 'category'
});

// features/category/index.ts
export { useCategory } from './hooks/use-category';
export { useCategoryActions } from './hooks/use-category-actions';
export type { Category } from './category.types';
```

### 2. Hooks Personnalisés

#### Hook de Query (Lecture)
```ts
// features/category/hooks/use-category.ts
export const useCategory = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryService.list({ page: 1, limit: 10 }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const invalidate = () => {
    return queryClient.invalidateQueries({
      queryKey: categoryKeys.lists(),
      refetchType: 'all'
    });
  };

  return { ...query, invalidate };
};
```

#### Hook d'Actions (Mutations)
```ts
// features/category/hooks/use-category-actions.ts
export const useCategoryActions = () => {
  const mutations = useMutations<Category>({
    service: categoryService,
    queryKeys: categoryKeys,
    successMessages: {
      create: t('admin.category.create.success')
    }
  });

  return {
    create: mutations.create,
    update: mutations.modify,
    isUpdating: mutations.isModifing,
    invalidate: mutations.invalidate
  };
};
```

### 3. Services API

#### Configuration des Endpoints
```ts
// lib/api-endpoints.ts
export const API_ENDPOINTS = {
  category: {
    base: `${prefix}/v1/category`,
    create: `${prefix}/v1/category`,
    list: (qs: string) => `${prefix}/v1/category?${qs}`,
    detail: (id: string) => `${prefix}/v1/category/${id}`,
    update: (id: string) => `${prefix}/v1/category/${id}`,
    delete: (id: string) => `${prefix}/v1/category/${id}`
  }
} as const;
```

#### Service HTTP
```ts
// features/category/category.service.ts
import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const categoryService = new BaseService<Category>(
  http.private,
  API_ENDPOINTS.category
);
```

> Adapte les chemins et noms de fichiers/types à la convention de ce projet (dossier `features/`, services dans `lib/` ou `features/[feature]/`, hooks dans `features/[feature]/hooks/`, etc.).

### 4. Composants & Formulaires

#### Structure d'un Composant
```ts
// Suivre cet ordre dans les composants :
export function CategoryForm({ onSubmit }: { onSubmit: (data: Category) => void }) {
  // 1. État local
  const [loading, setLoading] = useState(false);
  
  // 2. Hooks personnalisés
  const { t } = useTranslation();
  const { data, isLoading } = useCategory();
  
  // 3. Effets
  useEffect(() => {
    // logique d'effet
  }, []);

  // 4. Gestionnaires d'événements
  const handleSubmit = (data: Category) => {
    onSubmit(data);
  };

  // 5. JSX
  return (
    <form onSubmit={handleSubmit}>
      {/* Contenu du formulaire */}
    </form>
  );
}
```

#### Formulaires avec React Hook Form + Zod
```ts
const { control, handleSubmit, reset } = useForm<Category>({
  defaultValues: {
    name: '',
    description: ''
  },
  resolver: zodResolver(categorySchema),
  mode: 'onChange'
});

const onSubmit = async (data: Category) => {
  await create(data);
  reset();
};

// Utiliser les composants contrôlés
<ControlledTextInput
  name="name"
  control={control}
  placeholder={t('admin.category.form.placeholders.name')}
/>
```

### 5. Gestion d'État

#### État Local avec Zustand
```ts
// features/category/category.store.ts
interface CategoryState {
  currentCategory: Category | null;
  setCurrentCategory: (category: Category) => void;
  clearCurrentCategory: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  currentCategory: null,
  setCurrentCategory: (category) => set({ currentCategory: category }),
  clearCurrentCategory: () => set({ currentCategory: null })
}));
```

#### Mutations avec Invalidation Automatique
```ts
// lib/react-query/mutation.ts
export function useMutations<T extends HasId, P>(config: MutationConfig<T, P>) {
  const handleSuccess = (type: 'create' | 'update' | 'delete', data: T) => {
    // Invalidation automatique des queries
    queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
    // ...autre logique métier...
  };
}
```

---

## 📝 Bonnes Pratiques

### 1. Conventions de Nommage
- **Fichiers** : kebab-case (`user-avatar.tsx`)
- **Composants** : PascalCase (`UserAvatar`)
- **Hooks** : camelCase avec préfixe `use` (`useCategory`)
- **Types** : PascalCase (`CategoryPayload`)
- **Variables** : camelCase (`isLoading`)

### 2. Structure des Fichiers
- Un composant par fichier
- Export par défaut pour les composants principaux
- Export nommé pour les utilitaires

### 3. Commentaires dans le Code
- **Éviter les commentaires** dans le code de production
- Le code doit être auto-documenté avec des noms explicites
- Privilégier des noms de variables et fonctions clairs
- Les seuls commentaires acceptés :
  - JSDoc pour les fonctions publiques/exportées
  - Commentaires temporaires pendant le développement (à supprimer avant commit)
  - Commentaires explicatifs pour des algorithmes complexes (rare)

```ts
// ❌ Éviter
const d = new Date(); // Date actuelle
const u = users.filter(u => u.active); // Filtrer les utilisateurs actifs

// ✅ Préférer
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
```

### 4. Formulaires Admin en Mode Steps
- **Layout adapté** : Choisis le bon layout pour chaque étape selon le contenu
  - `'two-cols'` : Pour les champs courts (nom, email, téléphone, prix, etc.)
  - `'simple'` : Pour les champs longs (description, texte riche, adresse complète)
  - `'horizontal'` : Pour les toggles, checkboxes et champs courts en ligne
  - `'sections'` : Pour grouper logiquement des champs dans une même étape
- **Étapes logiques** : Groupe les champs par thématique métier
  - Étape 1 : Informations essentielles/générales
  - Étape 2 : Détails complémentaires/spécifiques
  - Étape 3 : Configuration/options/finalisation
- **Navigation intuitive** : Utilise des titres et descriptions clairs pour chaque étape
- **Validation progressive** : Chaque étape peut être validée indépendamment

### 5. Gestion des Erreurs
```ts
// Dans les hooks
const { mutate: createCategory, isPending, error } = useMutation({
  mutationFn: categoryService.create,
  onSuccess: () => {
    toast.success(t('success.message'));
  },
  onError: (error) => {
    toast.error(`Erreur: ${error.message}`);
  }
});
```

### 5. Performance
- Utilisez `useMemo` pour les calculs coûteux
- Utilisez `useCallback` pour les fonctions passées en props
- Préférez la pagination pour les listes importantes

### 6. Accessibilité
- Toujours inclure `aria-label` sur les éléments interactifs
- Utiliser les rôles ARIA appropriés
- Gérer le focus keyboard

## 🚀 Checklist pour Nouvelle Fonctionnalité

### Avant de Commencer
- [ ] Créer le dossier `features/[feature]/`
- [ ] Définir les schémas Zod dans `category.schema.ts`
- [ ] Créer les types TypeScript dans `category.types.ts`
- [ ] Configurer les query keys dans `category.config.ts`

### Développement
- [ ] Créer le service API
- [ ] Implémenter les hooks (query + mutations)
- [ ] Développer les composants UI
- [ ] Configurer la navigation/routing

### Tests & Finalisation
- [ ] Tester les formulaires (validation, soumission)
- [ ] Vérifier la gestion d'erreur
- [ ] Valider l'accessibilité
- [ ] Optimiser les performances
- [ ] Documenter les APIs publiques

## 📚 Ressources

- [Documentation React Query](https://tanstack.com/query/latest)
- [Documentation Zod](https://zod.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/)
- [Documentation Radix UI](https://www.radix-ui.com/)
- [Guide Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

## 🤖 Instructions pour l'IA

Quand tu développes une nouvelle fonctionnalité :

1. **Analyse** d'abord la structure existante similaire
2. **Suis** l'architecture modulaire décrite
3. **Utilise** les patterns établis (hooks, services, composants)
4. **Respecte** les conventions de nommage
5. **Pense** à l'invalidation des caches React Query
6. **Gère** les états de chargement et d'erreur
7. **Assure-toi** de l'accessibilité des composants

**Exemple de workflow** :
1. Créer les types et schémas
2. Implémenter le service API
3. Créer les hooks (query + actions)
4. Développer les composants UI
5. Intégrer dans les pages
6. Tester et optimiser

---

### 🔗 Utilisation d’une vraie API pour l’admin

Si tu utilises une vraie API (et non un mock) pour l’admin :

1. **Service API réel pour l'appel client**
   - Crée le fichier `features/[entity]/[entity].service.ts` :

```ts
import BaseService from '@/shared/lib/services/base-service';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const [entity]Service = new BaseService<[Entity]>(API_ENDPOINTS.[entity]);
```
2. **Service API réel pour l'appel administration**
   - Crée le fichier `features/[entity]/hooks/use-[entity].ts` :

```ts
import { createApiService } from '@/shared/lib/admin/admin-generator';
import type { [Entity] } from './[entity].schema';
import { API_ENDPOINTS } from '@/shared/lib/config/api';

export const [entity]Service = createApiService<[Entity]>(API_ENDPOINTS.[entity].base);

pour chaque service créer met a jour API_ENDPOINTS
3. **Configuration admin**
   - Dans `features/[entity]/[entity].admin-config.ts`, importe le vrai service :

```ts
import { createAdminEntity } from '@/shared/lib/admin/admin-generator';
import { [Entity]Schema } from './[entity].schema';
import { [entity]Service } from './[entity].service';

export const [Entity]AdminConfig = createAdminEntity('[Nom]', [Entity]Schema, {
  description: 'Gérez vos ...',
  icon: '🏷️',
  actions: { create: true, read: true, update: true, delete: true, bulk: false, },
  services: [entity]Service,
  queryKey: ['[entity]s'],
});
```

4. **Page d’admin**
   - Rien ne change, tu utilises toujours le composant `SimpleAdminPage` avec la config ci-dessus.

> Remplace `[entity]`, `[Entity]`, `[Nom]` par le nom de ton entité (ex : `category`, `Category`, `Catégorie`).
> Les méthodes à fournir dans `services` sont : `list`, `create`, `update`, `delete` (ou leurs équivalents selon ton service).

---

## Gestion avancée des validations et messages d’erreur

- **Support des messages d’erreur personnalisés** dans le schéma Zod :
  - Utilisez la syntaxe : `z.string().min(1, 'Ce champ est requis')` ou `z.number().min(0, 'Le prix doit être positif')`.
  - Les messages d’erreur sont automatiquement affichés dans les formulaires admin.

- **Affichage automatique des erreurs de validation** dans les formulaires :
  - Les erreurs sont affichées sous chaque champ concerné.
  - Le focus est automatiquement mis sur le premier champ en erreur lors de la soumission.

- **Gestion centralisée des messages d’erreur API** :
  - Toute erreur serveur (validation, droits, etc.) est affichée via un toast ou une alerte globale.
  - Les hooks et services doivent propager les erreurs pour affichage global (ex : `toast.error(error.message)`).

**Exemple :**
```ts
const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
});
```

---

## Widgets relation pour les champs relation admin

Pour les champs de type relation dans un schéma Zod, tu peux choisir dynamiquement le rendu du widget via la clé `display.widget` :

- `select` : menu déroulant natif stylisé (single ou multi)
- `tag` : badges cliquables (single : choix unique, multi : toggle)
- `radio` : radio group stylisé (single) ou checkbox group stylisé (multi)

**Exemple :**
```ts
routeId: createField.relation('routes', 'routeLabel', false, {
  label: 'Route',
  display: { showInForm: true, widget: 'radio' }
})
```

Le widget est choisi dynamiquement selon la valeur de `display.widget` dans le schéma Zod.
Accessibilité, focus clavier et feedback visuel sont gérés automatiquement dans le composant RelationField.

---

## Actions personnalisées dans la toolbar et bulk du DataTable admin

Pour ajouter des actions personnalisées dans la barre d’outils (toolbar) du tableau admin, la configuration admin accepte une clé optionnelle :

- `ui.toolbarActions?: React.ReactNode | ((selectedRows: T[]) => React.ReactNode)`

**Utilisation :**
- Placez vos boutons ou actions contextuelles dans `ui.toolbarActions` de la config admin :
  ```ts
  ui: {
    toolbarActions: (selectedRows) => (
      <>
        <Button onClick={...}>Exporter</Button>
        <MyCustomAction selected={selectedRows} />
      </>
    )
  }
  ```
- Si vous fournissez une fonction, elle reçoit le tableau des lignes sélectionnées (pour actions bulk/contextuelles).

**Pour les actions bulk natives** (supprimer, exporter, etc.), continuez d’utiliser la config `actions.bulk` et/ou `bulkActions`.

---

## Actions bulk natives et personnalisées

Pour gérer les actions bulk (actions sur plusieurs lignes sélectionnées) dans l’admin :

- **Actions bulk natives** (supprimer, exporter, etc.) :
  - Activez-les via la clé `actions.bulk: true` dans la config admin.
  - Pour la suppression groupée, activez aussi `actions.delete: true`.
  - Vous pouvez personnaliser les actions bulk natives via la clé `bulkActions` :
    ```ts
    bulkActions: [
      {
        key: 'export',
        label: 'Exporter',
        icon: <DownloadIcon />, // optionnel
        onClick: async (ids) => { ... },
        variant: 'default' // ou 'destructive', etc.
      },
      // ...
    ]
    ```
  - Les actions bulk natives s’affichent automatiquement dans la barre d’actions contextuelle quand des lignes sont sélectionnées.

- **Actions personnalisées dans la toolbar** :
  - Utilisez `ui.toolbarActions` pour ajouter des boutons ou actions contextuelles au-dessus du tableau (voir section précédente).
  - Ces actions peuvent aussi exploiter les lignes sélectionnées si besoin.

---

## Formatage et affichage avancé des champs (prix, devise, etc.)

Pour personnaliser l’affichage d’un champ (ex : prix, devise, format custom), chaque champ de la config ou du schéma Zod accepte dans `display` :

- `prefix` : préfixe affiché avant la valeur (ex : `€ `, `$`, etc.)
- `suffix` : suffixe affiché après la valeur (ex : ` €`, ` km`, etc.)
- `format` : fonction de formatage custom `(value) => string` (**si défini, il écrase tout le formattage par défaut, y compris prefix/suffix**)

**Exemple :**
```ts
{
  key: 'price',
  label: 'Prix',
  type: 'number',
  display: {
    prefix: '€ ',
    // ou suffix: ' €'
    // ou format: (v) => v ? `€ ${Number(v).toFixed(2)}` : '' // prioritaire sur prefix/suffix
  }
}
```

- Si `format` est défini, il est utilisé pour afficher la valeur dans le tableau admin (aucun prefix/suffix n’est appliqué).
- Sinon, le préfixe et/ou le suffixe sont ajoutés autour de la valeur.
- Fonctionne pour tous les champs (tableau, formulaire, etc.).

---

## hook générique useEntityQuery

- **Tout nouvel endpoint doit obligatoirement être ajouté dans le registre centralisé `API_ENDPOINTS` (`shared/config/api.ts`) sous la clé `dashboard` ou une clé dédiée.**
- N’utilise jamais de string littérale d’URL dans les services ou hooks : importe toujours l’URL depuis `API_ENDPOINTS.dashboard` ou une clé dédiée.
- Pour toute nouvelle feature dashboard/statistiques, crée un service qui hérite de `BaseService` et utilise le hook générique `useEntityQuery` pour la gestion des requêtes (lecture, params, mutations CRUD si besoin).
- **Pattern recommandé :**
  1. Ajoute l’endpoint dans `API_ENDPOINTS.dashboard` :
     ```ts
     export const API_ENDPOINTS = {
       // ...existing code...
       dashboard: {
         base: '/api/admin/dashboard',
         bookingDistribution: '/api/admin/dashboard/booking-distribution',
         // autres endpoints dashboard...
       }
     }
     ```
  2. Crée le service :
     ```ts
     import BaseService from '@/shared/lib/services/base-service';
     import { API_ENDPOINTS } from '@/lib/api-endpoints';

     export const bookingDistributionService = new BaseService(
       API_ENDPOINTS.dashboard.bookingDistribution
     );
     ```
  3. Utilise le hook générique :
     ```ts
     import { useEntityQuery } from '@/shared/hooks/use-entity-query';
     export function useBookingDistribution(params?: Record<string, unknown>) {
       return useEntityQuery({
         service: bookingDistributionService,
         queryKey: ['booking-distribution'],
         params,
       });
     }
     ```
- **Toujours utiliser `useEntityQuery` pour la gestion des données côté client (lecture, params dynamiques, mutations CRUD si besoin) pour toute nouvelle feature nécessitant un accès API factorisé (dashboard, statistiques, entités, etc.).**
- Ce pattern s’applique aussi bien pour les endpoints publics que privés, et pour toute ressource paginée ou filtrable.
- Pour les mutations (create, update, delete), utilisez le service passé à `useEntityQuery` ou un hook compagnon (ex : `useEntityMutations` si existant) pour garantir la cohérence et la factorisation.
- Les noms de `queryKey` doivent être cohérents et idéalement centralisés dans un fichier de config (ex : `entityKeys`).
- Toute logique de transformation/adaptation des données (mapping, formatage, adaptation) doit être faite dans le hook ou un utilitaire dédié, jamais dans le composant React.

---

- **Toujours utiliser un composant `Skeleton` (ou équivalent) pour l’affichage du chargement dans les pages et composants admin/factorisés.**
  - Le Skeleton doit être visible tant que les données sont en cours de chargement (`isLoading`, `isFetching`, etc.).
  - Ne jamais afficher un écran vide ou un simple "Loading..." : le Skeleton doit donner un feedback visuel cohérent avec l’UI admin.

## 🛡️ Conseils avancés et exigences qualité

### 1. Sécurité & Permissions
- Toute action sensible (suppression, modification critique) doit être confirmée par un dialogue de confirmation.
- Les permissions d’accès aux pages et actions admin doivent être vérifiées côté client ET côté serveur.
  - Utilise les hooks d’authentification existants (`useAuth`, etc.) pour restreindre l’accès aux pages admin.
  - Si une permission est manquante, affiche un message d’erreur ou redirige vers la page de login.

### 2. Modularité & Factorisation
- Factorise tout code dupliqué entre entités admin dans un utilitaire ou composant partagé.
- Les hooks, services et configs doivent être génériques et réutilisables dès que possible.
- Pour toute logique métier récurrente (pagination, tri, recherche), utilise ou crée un hook factorisé (ex : `useAdminTable`, `useEntityQuery`).


### 3. Typage & Généricité
- Les types TypeScript doivent être stricts et explicites.
- Évite les types `any` ou les assertions de type non justifiées.
- Pour chaque entité, exporte le type principal (`export type [Entity] = ...`) et utilise-le partout (service, hook, composant).

### 4. Organisation des fichiers
- Chaque entité admin doit avoir son propre dossier dans `features/`, même pour une seule page.
- Les hooks sont toujours dans `features/[entity]/hooks/`.
- Les services sont dans `features/[entity]/[entity].mock.ts` et `features/[entity]/[entity].service.ts`.
- Les schémas et types sont dans `features/[entity]/[entity].schema.ts`.

### 5. Expérience développeur
- Précise dans la doc comment basculer du mock à l’API réelle (changer l’import dans la config admin).

### 6. Nettoyage & Refactoring
- Supprime tout code mort ou non utilisé après refactoring.
- Vérifie que les imports sont triés et ne contiennent pas de doublons.
- Lance un lint et un format automatique avant chaque commit.

### ✅ Checklist finale pour toute nouvelle entité admin

- [ ] Schéma Zod et type TypeScript créés
- [ ] Service mock avec persistance localStorage
- [ ] Service API réel (même si non utilisé tout de suite)
- [ ] Hook de query (et d’actions si besoin)
- [ ] Config admin (mock par défaut)
- [ ] Page d’admin générée avec `SimpleAdminPage`
- [ ] Entrée ajoutée dans la sidebar admin
- [ ] Tests unitaires pour le schéma et le service mock
- [ ] Lint, format et vérification des erreurs TypeScript
- [ ] Documentation d’utilisation et d’intégration

---

## 🚀 Système de Mock Avancé

### Utilisation du Service Mock Étendu

**Pour toute nouvelle entité admin, utilise le service mock avancé avec les options suivantes :**

#### 1. Service Mock Simple (par défaut)
```ts
import { createMockService } from '@/shared/lib/admin/admin-generator';
import { [Entity] } from './[entity].schema';

export const mock[Entity]s: [Entity][] = [ /* ... */ ];
export const [entity]Service = createMockService(mock[Entity]s, {
  entityName: '[entity]s'
});
```

#### 2. Service Mock avec Génération Automatique
```ts
import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';

export const [entity]Service = createEnhancedMockService(
  '[entity]s',
  createMockDataGenerator({
    name: mockDataGenerators.name,
    email: mockDataGenerators.email,
    status: mockDataGenerators.status,
    // ... autres champs
  }),
  50 // nombre d'éléments à générer
);
```

#### 3. Service Mock avec Hooks et Validation
```ts
export const [entity]Service = createMockService(mock[Entity]s, {
  entityName: '[entity]s',
  enableValidation: true,
  validator: (item) => {
    if (!item.name) return 'Le nom est requis';
    return true;
  },
  hooks: {
    beforeCreate: async (item) => ({
      ...item,
      slug: item.name.toLowerCase().replace(/\s+/g, '-'),
      createdBy: 'system'
    }),
    afterCreate: async (item) => {
      console.log(`${item.name} créé avec succès`);
    },
    beforeDelete: async (id, item) => {
      // Empêcher la suppression si conditions non remplies
      return item.status !== 'protected';
    }
  },
  enableBackup: true,
  maxBackups: 10
});
```

### Fonctionnalités Disponibles

#### ExtendedCrudService inclut :
- **`fetchItems(filters)`** : Recherche, tri, pagination, filtres
- **`bulkCreate(items)`** : Création en lot
- **`bulkUpdate(updates)`** : Modification en lot  
- **`bulkDelete(ids)`** : Suppression en lot
- **`getById(id)`** : Récupération par ID
- **`backup()`** : Sauvegarde JSON
- **`restore(backupData)`** : Restauration depuis backup
- **`getStats()`** : Statistiques (total, créations/modifs du jour, etc.)

#### Filtres et Recherche
```ts
// Dans le hook, utilise les filtres avancés
const { data, meta } = await service.fetchItems({
  search: 'terme de recherche',
  status: 'active',
  sort: 'createdAt',
  order: 'desc',
  page: 1,
  limit: 20
});
```

#### Générateurs de Données Factices Disponibles
- `mockDataGenerators.id()` : ID unique
- `mockDataGenerators.name()` : Noms de personnes
- `mockDataGenerators.email()` : Adresses email
- `mockDataGenerators.phone()` : Numéros de téléphone
- `mockDataGenerators.address()` : Adresses
- `mockDataGenerators.city()` : Villes françaises
- `mockDataGenerators.price(min, max)` : Prix
- `mockDataGenerators.description()` : Descriptions lorem
- `mockDataGenerators.status()` : Statuts
- `mockDataGenerators.date(daysBack)` : Dates
- `mockDataGenerators.boolean()` : Booléens
- `mockDataGenerators.category()` : Catégories
- `mockDataGenerators.image()` : URLs d'images
- `mockDataGenerators.url()` : URLs de sites

### Hooks Lifecycle Disponibles
- **`beforeCreate`** : Transformer les données avant création
- **`afterCreate`** : Actions après création (logs, notifications, etc.)
- **`beforeUpdate`** : Transformer les données avant modification
- **`afterUpdate`** : Actions après modification
- **`beforeDelete`** : Validation avant suppression (return false pour annuler)
- **`afterDelete`** : Actions après suppression

### Persistence et Backup
- **Persistence automatique** : localStorage avec clé unique par entité
- **Backup automatique** : sauvegarde à chaque modification
- **Restauration** : fonction `restore()` pour charger un backup
- **Limite de backups** : configurable (défaut: 5)

### Instructions Importantes
- **Toujours utiliser** `createEnhancedMockService` pour les nouvelles entités avec génération automatique
- **Définir des hooks** pour la logique métier (slugs, timestamps, validations)
- **Utiliser les générateurs** plutôt que des données statiques
- **Tester les fonctionnalités bulk** pour les opérations en lot
- **Profiter des statistiques** pour les dashboards admin

### Exemple Complet
```ts
// features/product/product.mock.ts
import { createEnhancedMockService, createMockDataGenerator, mockDataGenerators } from '@/shared/lib/admin/admin-generator';
import type { Product } from './product.schema';

export const productService = createEnhancedMockService<Product>(
  'products',
  createMockDataGenerator({
    name: () => `Produit ${mockDataGenerators.name()}`,
    price: () => mockDataGenerators.price(10, 500),
    description: mockDataGenerators.description,
    category: mockDataGenerators.category,
    status: mockDataGenerators.status,
    image: mockDataGenerators.image,
  }),
  100, // génère 100 produits
  {
    enableValidation: true,
    validator: (product) => product.price > 0 ? true : 'Le prix doit être positif',
    hooks: {
      beforeCreate: async (product) => ({
        ...product,
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        sku: `SKU-${Date.now()}`
      })
    }
  }
);
```

**Ce système de mock permet un développement complet en mode offline avec toutes les fonctionnalités d'une vraie API.**



---

## 🎯 Workflow TaskMaster + Next.js - Guide d'Utilisation Complet

**TaskMaster est intégré à ce projet Next.js pour optimiser la génération et la gestion des tâches de développement avec GitHub Copilot.**

### 📋 Étapes d'Initialisation (Projet existant)

Si TaskMaster n'est pas encore initialisé dans votre projet :

```bash
# 1. Initialiser TaskMaster dans le projet
npm run task:init

# 2. Vérifier que la structure est créée
ls -la .taskmaster/
# Doit contenir : tasks.json, prd.txt, copilot-instructions.md, tasks/
```

### 🚀 Workflow Recommandé pour Nouvelles Fonctionnalités

#### **Étape 1 : Génération de Tâches Next.js avec Copilot**

```bash
# Générer un prompt Copilot optimisé pour Next.js
npm run task:generate-prd

# 📋 ACTIONS SUITE À LA COMMANDE :
# 1. Copiez le prompt généré dans GitHub Copilot Chat
# 2. Copilot analysera votre architecture Next.js existante
# 3. Il générera des tâches respectant vos patterns (features/, admin, etc.)
# 4. Sauvegardez le JSON résultat dans .taskmaster/tasks.json
```

#### **Étape 2 : Validation et Analyse des Tâches**

```bash
# Valider la structure des tâches générées
npm run task:validate

# 📋 ACTIONS SUITE À LA COMMANDE :
# ✅ Si validation OK : Passez à l'étape 3
# ❌ Si erreurs détectées : Corrigez le JSON et re-validez
```

```bash
# Analyser la complexité des tâches (optionnel mais recommandé)
npm run task:complexity <ID_TACHE>

# 📋 ACTIONS SUITE À LA COMMANDE :
# - Score SIMPLE (≤3) : Tâche prête à développer
# - Score MOYENNE (4-6) : Ajouter des sous-tâches détaillées
# - Score COMPLEXE (≥7) : Décomposition de la tâche (voir étape 2.1)
```

#### **Étape 2.1 : Décomposition des Tâches Complexes**

```bash
# Pour les tâches complexes (score ≥7)
npm run task:breakdown <ID_TACHE>

# 📋 ACTIONS SUITE À LA COMMANDE :
# 1. Copiez le prompt de décomposition dans Copilot Chat
# 2. Copilot proposera 3-6 tâches plus petites et atomiques
# 3. Remplacez la tâche complexe par les nouvelles tâches
# 4. Re-validez : npm run task:validate
```

#### **Étape 3 : Génération des Fichiers de Tâches**

```bash
# Générer les fichiers individuels pour chaque tâche
npm run task:files

# 📋 ACTIONS SUITE À LA COMMANDE :
# - Crée un fichier .txt pour chaque tâche dans .taskmaster/tasks/
# - Chaque fichier contient les détails complets de la tâche
# - Utilisez ces fichiers comme référence pendant le développement
```

#### **Étape 4 : Développement avec TaskMaster**

```bash
# Voir la prochaine tâche à développer
npm run task:next

# 📋 ACTIONS SUITE À LA COMMANDE :
# 1. Notez l'ID et le titre de la tâche suggérée
# 2. Ouvrez le fichier détaillé : .taskmaster/tasks/task_<ID>.txt
# 3. Utilisez les instructions Copilot de la tâche pour développer
```

```bash
# Afficher les détails d'une tâche spécifique
npm run task:show <ID_TACHE>

# 📋 ACTIONS SUITE À LA COMMANDE :
# - Lisez attentivement les détails d'implémentation
# - Suivez les instructions Copilot spécifiques à cette tâche
# - Respectez l'architecture Next.js définie dans les instructions
```

#### **Étape 5 : Suivi et Mise à Jour**

```bash
# Marquer une tâche comme terminée
npm run task:done <ID_TACHE>

# 📋 ACTIONS SUITE À LA COMMANDE :
# - La tâche passe au statut 'done'
# - Les dépendances sont automatiquement mises à jour
# - La prochaine tâche disponible est calculée
```

```bash
# Voir l'état global du projet
npm run task:status

# 📋 ACTIONS SUITE À LA COMMANDE :
# - Visualisez la progression globale
# - Identifiez les tâches bloquées ou en retard
# - Planifiez les prochaines étapes
```

#### **Étape 6 : Rapport de Progression (Optionnel)**

```bash
# Générer un prompt de rapport de progression
npm run task:report

# 📋 ACTIONS SUITE À LA COMMANDE :
# 1. Copiez le prompt dans Copilot Chat
# 2. Copilot générera un rapport d'avancement complet
# 3. Utilisez ce rapport pour les réunions d'équipe ou documentation
```

### 🎯 Workflow Automatisé pour Copilot

**Quand l'utilisateur dit : "Initialise un projet de [DESCRIPTION]"**

1. **Demander confirmation :** "Je vais initialiser TaskMaster et créer un plan de développement structuré pour votre projet. Voulez-vous continuer ?"

2. **Exécuter l'initialisation :** `npm run task:init`

3. **Générer le prompt PRD :** 
   ```
   Je génère maintenant un prompt pour créer le PRD de votre projet.
   Copiez ce prompt dans une nouvelle conversation Copilot :
   
   [PROMPT_PRD_GENERE]
   ```

4. **Attendre le PRD :** "Une fois le PRD créé, revenez ici avec le contenu pour que je génère les tâches de développement."

5. **Générer les tâches :** Analyser le PRD et créer le JSON des tâches

6. **Exécuter la validation complète :**
   ```bash
   npm run task:validate
   npm run task:complexity 1 2 3 4 5  # Toutes les tâches
   npm run task:breakdown <ids_complexes>  # Si nécessaire
   npm run task:files
   ```

7. **Présenter le plan :** 
   ```
   ✅ Projet initialisé avec succès !
   
   📊 Résumé :
   - X tâches générées
   - Y tâches décomposées
   - Estimation totale : Z heures
   
   🚀 Prochaine étape :
   npm run task:next
   ```

### 💡 Instructions Spéciales pour Copilot

#### Pour l'Analyse du PRD
- **Identifiez les entités admin** principales (User, Product, Order, etc.)
- **Respectez l'architecture features/** du projet
- **Créez des tâches de 1-6h maximum**
- **Suivez les patterns de décomposition** définis plus haut
- **Incluez toujours** l'enregistrement sidebar pour les entités admin

#### Pour la Génération de Tâches
- **Une tâche = un fichier ou un composant** spécifique
- **Ordre logique :** schema → mock → service → hook → config → page → sidebar
- **Estimation réaliste :** Inclure tests et documentation
- **Dépendances claires :** Définir les prérequis entre tâches

#### Pour la Validation
- **Vérifier la cohérence** du JSON généré
- **Analyser la complexité** de chaque tâche automatiquement
- **Proposer la décomposition** pour les tâches >6h
- **Maintenir l'atomicité** des tâches

### 🎯 Exemple d'Initialisation

**Utilisateur :** "Initialise un projet de gestion de restaurant avec commandes en ligne"

**Copilot :** 
```
🚀 Initialisation d'un projet de gestion de restaurant

1. J'initialise TaskMaster...
   npm run task:init ✅

2. Je génère le prompt PRD pour votre projet :

[PROMPT PRD DÉTAILLÉ AVEC LA DESCRIPTION]

3. Copiez ce prompt dans Copilot Chat pour générer le PRD complet.

4. Revenez ensuite avec le PRD pour que je génère toutes les tâches de développement automatiquement !
```

**Cette approche garantit un démarrage de projet structuré, prévisible et optimisé dès le début.**
# Copilot Instructions personnalisées pour granularité maximale des tâches

- Pour toute génération de tâches ou de planification de projet, découpe chaque fonctionnalité, module, composant, page, hook, service, test, documentation, etc. en tâches très petites et atomiques (0.5h à 2h chacune).
- Privilégie la granularité maximale : une tâche = une action concrète, livrable seule (ex : « Créer le schéma Zod de l’entité User », « Créer le composant InputEmail », « Écrire le test unitaire du service Auth », « Ajouter le champ avatar au formulaire de profil », etc.).
- Structure les tâches par phase (setup, core, admin, ui, test, doc, etc.) et par dépendances logiques.
- Pour chaque tâche, fournis : id, title, description, phase, dependencies (ids), estimate (en heures, 0.5 à 2).
- Génère autant de tâches que nécessaire pour couvrir tout le PRD, même si cela fait 100 à 200 tâches ou plus.
- N’inclus aucune tâche générique ou trop large : chaque tâche doit être actionnable et livrable seule.
- Le résultat doit être un JSON valide, prêt à être utilisé dans `.taskmaster/tasks.json`.
- Couvre tout le cycle de vie du projet : setup, backoffice (admin), front office (utilisateur), accessibilité, tests, documentation, etc.


# TaskMaster : consignes pour la génération et la gestion des tâches
- Accepte et gère les fichiers `tasks.json` très détaillés (meme 100 à 300 tâches ou plus).
- Ne limite pas le nombre de tâches ni leur granularité.
- Génère un fichier individuel par tâche lors de `npm run task:files`.
- Suit l’avancement, les dépendances et la planification même pour des tâches très atomiques.
- Permet une gestion fine du projet, du setup à la documentation, en passant par le front et le back.

---

# Pour chaque fichier de tâche généré (`task_xxx.txt`), structure systématiquement les sections suivantes :

- `# Implementation Details:`
  - Détaille les étapes concrètes de l’implémentation (imports, fichiers, snippets, conventions, etc.)
- `# Test Strategy:`
  - Décris la stratégie de test (unitaires, typage, e2e, cas d’erreur, etc.)
- `# Subtasks:`
  - Liste les sous-tâches actionnables (checklist)

> Ces sections doivent être automatiquement remplies pour chaque tâche générée lors de `npm run task:files`.
> Exige que Copilot propose des exemples de code, des snippets, des cas de test, et une checklist pour chaque tâche, même la plus petite.

# Exemple de structure de fichier de tâche enrichi

```
# Task ID: 4
# Title: Créer le type TypeScript User
# ...
# Implementation Details:
- Importer le schéma Zod `userSchema` depuis `features/user/user.schema.ts`.
- Définir le type TypeScript `User` avec :
  ```ts
  export type User = z.infer<typeof userSchema>;
  ```
- Exporter ce type dans le même fichier que le schéma.

# Test Strategy:
- Vérifier que le type `User` correspond bien à la structure du schéma Zod.
- Ajouter un test de typage simple (ex : assigner un objet conforme et un objet non conforme).

# Subtasks:
- [ ] Importer le schéma Zod
- [ ] Définir le type TypeScript User
- [ ] Exporter le type
- [ ] Vérifier la correspondance type/schéma
```

# TaskMaster : consignes pour la génération et la gestion des tâches
- Accepte et gère les fichiers `tasks.json` très détaillés (100 à 300 tâches ou plus).
- Ne limite pas le nombre de tâches ni leur granularité.
- Génère un fichier individuel par tâche lors de `npm run task:files`.
- Pour chaque fichier de tâche, structure systématiquement les sections Implementation Details, Test Strategy, Subtasks.
- Permet une gestion fine du projet, du setup à la documentation, en passant par le front et le back.
