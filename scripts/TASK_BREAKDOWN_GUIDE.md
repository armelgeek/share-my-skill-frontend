# Guide de Décomposition des Tâches Complexes

## Vue d'ensemble

Le gestionnaire de tâches TaskMaster inclut désormais un système d'analyse et de décomposition des tâches complexes, permettant de:
- Analyser automatiquement la complexité d'une tâche
- Identifier les tâches qui nécessitent une décomposition
- Générer des prompts GitHub Copilot optimisés pour la décomposition
- Maintenir un projet avec des tâches de taille appropriée (1-8 heures)

## Commandes disponibles

### 🔍 `analyze-complexity <id>`
Analyse la complexité d'une tâche et détermine si elle nécessite une décomposition.

**Exemple :**
```bash
node taskmaster.js analyze-complexity 5
```

**Sortie :**
- Score de complexité (0-10)
- Niveau (SIMPLE, MOYENNE, COMPLEXE)
- Recommandation de décomposition
- Suggestions d'amélioration

### 🔧 `breakdown <id>`
Génère un prompt GitHub Copilot spécialisé pour décomposer une tâche complexe.

**Exemple :**
```bash
node taskmaster.js breakdown 5
```

**Sortie :**
- Prompt Copilot complet et structuré
- Analyse de la tâche originale
- Instructions de décomposition détaillées
- Règles et bonnes pratiques

## Critères d'analyse de complexité

### Facteurs analysés :

1. **Longueur du titre** (> 100 caractères = complexe)
2. **Longueur de la description** (> 500 caractères = complexe)
3. **Détails d'implémentation** (> 800 caractères = complexe)
4. **Nombre de sous-tâches** (> 8 = trop complexe)
5. **Estimation temporelle** (jours/semaines = complexe)
6. **Nombre de dépendances** (> 3 = possiblement complexe)
7. **Mots-clés de complexité** (système, complet, intégration, etc.)

### Niveaux de complexité :

- **SIMPLE (0-3 points)** : Tâche bien dimensionnée, peut être réalisée telle quelle
- **MOYENNE (4-6 points)** : Ajouter des sous-tâches détaillées et points de contrôle
- **COMPLEXE (7+ points)** : Décomposition recommandée en tâches plus petites

## Workflow de décomposition

### 1. Identifier les tâches complexes
```bash
# Analyser toutes les tâches une par une
node taskmaster.js analyze-complexity 1
node taskmaster.js analyze-complexity 2
# etc.
```

### 2. Générer le prompt de décomposition
```bash
node taskmaster.js breakdown <id_tache_complexe>
```

### 3. Utiliser GitHub Copilot
1. Copiez le prompt généré dans GitHub Copilot Chat
2. Copilot analysera et proposera une décomposition structurée
3. Examinez les nouvelles tâches proposées

### 4. Implémenter la décomposition
1. Ajoutez les nouvelles tâches dans `tasks.json`
2. Supprimez ou archivez la tâche complexe originale
3. Validez la structure : `node taskmaster.js validate`
4. Régénérez les fichiers : `node taskmaster.js regenerate-files`

## Bonnes pratiques

### ✅ Critères d'une bonne tâche décomposée :
- **Un seul objectif clair** : "Créer le modèle User" au lieu de "Gérer les utilisateurs"
- **Estimation 1-6 heures** : Assez petite pour être terminée rapidement
- **Livrable testable** : Produit quelque chose de fonctionnel et vérifiable
- **Dépendances claires** : Relations logiques avec d'autres tâches
- **Description spécifique** : Pas de "TODO" vagues

### ❌ Éviter :
- **Tâches trop granulaires** (< 30 minutes) : "Ajouter un import"
- **Tâches vagues** : "Finaliser le système"
- **Tâches multi-objectifs** : "Créer l'API et l'interface"
- **Estimations en jours/semaines** : Toujours décomposer

## Exemples de décomposition

### ❌ Tâche complexe :
```
"Implémenter système d'authentification complet avec JWT, validation, 
middleware de sécurité, gestion des erreurs, tests d'intégration, 
documentation API et interface utilisateur"
```

### ✅ Décomposition suggérée :
1. **Créer le modèle User en base de données** (2h)
2. **Implémenter l'endpoint POST /auth/login** (3h)
3. **Ajouter la validation JWT aux middlewares** (2h)
4. **Créer l'interface de connexion utilisateur** (4h)
5. **Implémenter la gestion des erreurs auth** (2h)
6. **Créer les tests d'intégration authentification** (3h)
7. **Documenter l'API d'authentification** (1h)

## Intégration avec les prompts existants

Le prompt `generate-advanced` inclut maintenant des instructions de gestion de la complexité :

```bash
node taskmaster.js generate-advanced
```

**Nouvelles règles intégrées :**
- Détection automatique des tâches >8h
- Instructions de décomposition obligatoire
- Critères d'atomicité des tâches
- Gestion des livrables testables

## Maintenir un projet sain

### Validation régulière :
```bash
# Valider la structure globale
node taskmaster.js validate

# Analyser les tâches suspectes
node taskmaster.js analyze-complexity <id>

# Régénérer les fichiers après modifications
node taskmaster.js regenerate-files
```

### Surveillance continue :
- Examinez régulièrement les nouvelles tâches ajoutées
- Utilisez `analyze-complexity` sur les tâches avant de les commencer
- Décomposez proactivement au lieu de réagir aux blocages
- Maintenez des estimations réalistes (1-8h par tâche)

Cette approche garantit un flux de développement fluide avec des tâches toujours actionables et des livrables fréquents.
