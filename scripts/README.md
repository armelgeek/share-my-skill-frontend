# TaskMaster - Gestionnaire de Tâches Intelligent

Un gestionnaire de tâches local inspiré de Task Master AI, conçu pour# Commandes directes (alternative)
npm run task:init                    # Initialiser le projet
npm run task:next                    # Prochaine tâche à faire
npm run task:status                  # Statut global du projet
npm run task:done <id>               # Marquer comme terminée
npm run task:show <id>               # Afficher une tâche

# Commandes directes (alternative)
node scripts/taskmaster.js init                    # Initialiser le projet
node scripts/taskmaster.js list                    # Lister toutes les tâches
node scripts/taskmaster.js add "Titre de tâche"    # Ajouter une tâche
node scripts/taskmaster.js done <id>               # Marquer comme terminée
node scripts/taskmaster.js show <id>               # Afficher une tâche
node scripts/taskmaster.js remove <id>             # Supprimer une tâche
node scripts/taskmaster.js next                    # Prochaine tâche à faire
node scripts/taskmaster.js status                  # Statut global du projetc GitHub Copilot et optimiser le workflow de développement.

## ✨ Fonctionnalités principales

### 🎯 Gestion de base
- **Initialisation de projet** : Structure `.taskmaster/` automatique
- **CRUD des tâches** : Création, lecture, mise à jour, suppression
- **Statut et dépendances** : Gestion des relations entre tâches
- **Validation avancée** : Vérification de cohérence et détection de cycles

### 🧠 Intelligence avec GitHub Copilot
- **Génération de PRD** : Prompts optimisés pour créer des spécifications
- **Génération de tâches** : Analyse automatique de PRD en tâches structurées
- **Prompts spécialisés** : Templates pour sous-tâches, documentation, etc.

### 🔍 **Analyse de complexité et décomposition**
- **Détection automatique** : Identifie les tâches trop complexes (>8h)
- **Score de complexité** : Analyse multi-critères (0-10 points)
- **Décomposition guidée** : Prompts Copilot pour diviser les tâches complexes
- **Validation continue** : Maintient un projet avec des tâches actionables

### 📁 Gestion de fichiers
- **Fichiers individuels** : Un fichier `.txt` par tâche pour l'édition
- **Régénération automatique** : Synchronisation JSON ↔ fichiers texte
- **Templates externes** : Support de modèles de tâches réutilisables

## 🚀 Installation et utilisation rapide

### 📦 Scripts NPM Intégrés

**Méthode recommandée** : Utilisez les scripts npm intégrés au projet :

```bash
# Initialiser TaskMaster
npm run task:init

# Générer des tâches avec Copilot
npm run task:generate
# → Copiez le prompt dans GitHub Copilot Chat

# Valider la structure des tâches
npm run task:validate

# Voir la prochaine tâche à développer
npm run task:next

# Marquer une tâche comme terminée
npm run task:done <ID>

# Voir l'état global du projet
npm run task:status

# Analyser la complexité d'une tâche
npm run task:complexity <ID>

# Décomposer une tâche complexe
npm run task:breakdown <ID>

# Générer les fichiers de tâches
npm run task:files

# Générer un rapport de progression
npm run task:report

# Afficher l'aide et les instructions Copilot
npm run task:help
```

### 🔧 Commandes Directes (Alternative)

Si vous préférez les commandes directes :

```bash
# Initialiser un nouveau projet
node scripts/taskmaster.js init

# Créer un PRD avec Copilot
node scripts/taskmaster.js generate-prd
# → Copiez le prompt dans GitHub Copilot Chat

# Générer des tâches depuis le PRD
node scripts/taskmaster.js generate-advanced
# → Copiez le prompt dans GitHub Copilot Chat
# → Sauvegardez le résultat dans .taskmaster/tasks.json

# Analyser les tâches complexes
node scripts/taskmaster.js analyze-complexity 1
node scripts/taskmaster.js breakdown 1  # Si complexe

# Valider et utiliser
node scripts/taskmaster.js validate
node scripts/taskmaster.js next
```

## 📋 Référence des Scripts NPM

| Script NPM | Équivalent Direct | Description |
|------------|------------------|-------------|
| `npm run task:init` | `node scripts/taskmaster.js init` | Initialiser TaskMaster |
| `npm run task:generate` | `node scripts/taskmaster.js generate-nextjs` | Générer prompt Copilot Next.js |
| `npm run task:validate` | `node scripts/taskmaster.js validate` | Valider tasks.json |
| `npm run task:next` | `node scripts/taskmaster.js next` | Prochaine tâche |
| `npm run task:status` | `node scripts/taskmaster.js status` | État global |
| `npm run task:done` | `node scripts/taskmaster.js done` | Marquer terminée |
| `npm run task:show` | `node scripts/taskmaster.js show` | Détails tâche |
| `npm run task:breakdown` | `node scripts/taskmaster.js breakdown` | Décomposer tâche |
| `npm run task:complexity` | `node scripts/taskmaster.js analyze-complexity` | Analyser complexité |
| `npm run task:files` | `node scripts/taskmaster.js generate-all-files` | Générer fichiers |
| `npm run task:report` | `node scripts/taskmaster.js progress-report` | Rapport progression |
| `npm run task:help` | `node scripts/taskmaster.js copilot-help` | Aide Copilot |

## 📋 Commandes disponibles

**Note** : Utilisez de préférence les scripts npm (`npm run task:*`) qui sont plus simples et intégrés au projet.

### Gestion de base

```bash
# Scripts NPM (recommandé)
npm run task:init                    # Initialiser le projet
npm run task:next                    # Prochaine tâche à faire
npm run task:status                  # Statut global du projet
npm run task:done <id>               # Marquer comme terminée
npm run task:show <id>               # Afficher une tâche

# Commandes directes (alternative)
node taskmaster.js init                    # Initialiser le projet
node taskmaster.js list                    # Lister toutes les tâches
node taskmaster.js add "Titre de tâche"    # Ajouter une tâche
node taskmaster.js done <id>               # Marquer comme terminée
node taskmaster.js show <id>               # Afficher une tâche
node taskmaster.js remove <id>             # Supprimer une tâche
node taskmaster.js next                    # Prochaine tâche à faire
node taskmaster.js status                  # Statut global du projet
```

### 🔍 Analyse et décomposition

```bash
# Scripts NPM (recommandé)
npm run task:complexity <id>         # Analyser la complexité
npm run task:breakdown <id>          # Décomposer une tâche complexe

# Commandes directes (alternative)
node scripts/taskmaster.js analyze-complexity <id>  # Analyser la complexité
node scripts/taskmaster.js breakdown <id>           # Décomposer une tâche complexe
```

### 🤖 Génération avec Copilot

```bash
# Scripts NPM (recommandé)
npm run task:generate                # Prompt pour Next.js avec Copilot
npm run task:help                    # Instructions Copilot détaillées

# Commandes directes (alternative)
node scripts/taskmaster.js generate-prd              # Prompt pour créer un PRD
node scripts/taskmaster.js generate-tasks            # Prompt simple pour tâches
node scripts/taskmaster.js generate-advanced         # Prompt avancé avec analyse PRD
node scripts/taskmaster.js generate-subtasks <id>    # Prompt pour sous-tâches
node scripts/taskmaster.js generate-template <nom>   # Prompt pour template
```

### 📁 Gestion de fichiers de tâches

```bash
# Scripts NPM (recommandé)
npm run task:files                   # Tous les fichiers individuels

# Commandes directes (alternative)
node scripts/taskmaster.js generate-file <id>        # Fichier individuel pour une tâche
node scripts/taskmaster.js generate-all-files        # Tous les fichiers individuels
node scripts/taskmaster.js regenerate-files          # Régénérer les fichiers existants
```

### 🔧 Validation et aide

```bash
# Scripts NPM (recommandé)
npm run task:validate                # Valider la structure
npm run task:report                  # Rapport de progression

# Commandes directes (alternative)
node scripts/taskmaster.js validate                  # Valider la structure
node scripts/taskmaster.js copilot-help             # Instructions Copilot détaillées
node scripts/taskmaster.js help                     # Liste des commandes
```

## 🧩 Workflow recommandé

### 1. **Initialisation d'un projet**

```bash
npm run task:init
```

### 2. **Génération des tâches avec Copilot**

```bash
npm run task:generate
# → Copiez le prompt dans Copilot Chat
# → Sauvegardez le résultat dans .taskmaster/tasks.json
```

### 3. **Validation et analyse**

```bash
# Valider la structure
npm run task:validate

# Analyser la complexité des tâches
npm run task:complexity 1
npm run task:complexity 2
```

### 4. **Décomposition des tâches complexes**

```bash
# Pour les tâches avec score ≥7
npm run task:breakdown <id_complexe>
# → Copiez le prompt dans Copilot Chat
# → Remplacez la tâche complexe par les nouvelles tâches
# → Re-validez : npm run task:validate
```

### 5. **Développement**

```bash
# Générer les fichiers de tâches
npm run task:files

# Commencer le développement
npm run task:next

# Marquer les tâches terminées
npm run task:done <id>

# Suivi global
npm run task:status
```

### 6. **Suivi et rapports**

```bash
# Générer un rapport de progression
npm run task:report
# → Utilisez le prompt dans Copilot Chat pour obtenir un rapport détaillé
```

## 🔍 Système d'analyse de complexité

### Critères d'évaluation (0-10 points)
- **Longueur du titre** : >100 caractères = complexe
- **Description détaillée** : >500 caractères = complexe  
- **Estimation temporelle** : jours/semaines = complexe
- **Nombre de sous-tâches** : >8 = trop complexe
- **Mots-clés de complexité** : "système", "complet", "intégration"
- **Dépendances multiples** : >3 dépendances = complexe

### Niveaux de complexité
- **🟢 SIMPLE (0-3)** : Prête à développer
- **🟡 MOYENNE (4-6)** : Ajouter des sous-tâches détaillées
- **🔴 COMPLEXE (7-10)** : Décomposition obligatoire

### Actions automatiques

```bash
# Score 7-10 → Recommandation de décomposition
npm run task:breakdown <id>

# Prompt Copilot optimisé pour créer 3-6 tâches de 1-6h chacune
```

## 📁 Structure du projet

```
.taskmaster/
├── prd.txt                    # Product Requirements Document
├── tasks.json                 # Base de données des tâches  
├── copilot-instructions.md    # Guide pour GitHub Copilot
└── tasks/                     # Fichiers individuels des tâches
    ├── task_001.txt
    ├── task_002.txt
    └── ...
```

## 🎯 Format des tâches

```json
{
  "meta": {
    "projectName": "Mon Projet",
    "version": "1.0.0",
    "description": "Description du projet"
  },
  "tasks": [
    {
      "id": 1,
      "title": "Titre clair et actionnable",
      "description": "Description concise de l'objectif",
      "status": "todo",  // todo|in-progress|done|blocked
      "priority": "high", // high|medium|low
      "dependencies": [2, 3], // IDs des tâches dépendantes
      "estimation": "3 heures",
      "details": "Instructions d'implémentation détaillées",
      "testStrategy": "Comment valider cette tâche",
      "subtasks": [
        {
          "id": "1.1",
          "title": "Sous-tâche spécifique",
          "description": "Description de la sous-tâche",
          "status": "todo"
        }
      ]
    }
  ],
  "lastId": 1
}
```

## 🤖 Intégration GitHub Copilot

### Prompts optimisés inclus
- **PRD Generator** : Analyse de besoins → spécifications structurées
- **Task Generator** : PRD → tâches de développement complètes
- **Subtask Generator** : Tâche → sous-tâches détaillées
- **Breakdown Generator** : Tâche complexe → tâches atomiques
- **Template Generator** : Contexte → modèles de tâches réutilisables

### Instructions contextuelles
Chaque prompt inclut :
- ✅ Règles de qualité (atomicité, testabilité, estimation)
- ✅ Contraintes techniques (1-8h par tâche, dépendances logiques)
- ✅ Format de sortie standardisé (JSON structuré)
- ✅ Bonnes pratiques (SOLID, patterns, tests)

## 📚 Guides avancés

- **[Guide de décomposition](./TASK_BREAKDOWN_GUIDE.md)** : Workflow complet pour gérer les tâches complexes


## 🔧 Exemples d'usage

### Analyser un projet existant

```bash
# Charger des tâches depuis un PRD existant
npm run task:generate

# Analyser toutes les tâches
npm run task:complexity 1
npm run task:complexity 2
npm run task:complexity 3
# ... continuer pour toutes les tâches

# Décomposer les tâches complexes identifiées
npm run task:breakdown 5
```

### Workflow de décomposition

```bash
# 1. Identifier les tâches problématiques
npm run task:complexity 2
# → Score: 10/10 (COMPLEXE) → Décomposition recommandée

# 2. Générer le prompt de décomposition
npm run task:breakdown 2
# → Copier dans Copilot Chat

# 3. Implémenter la décomposition (remplacer la tâche complexe)
# 4. Valider le résultat
npm run task:validate
```

## 🎯 Objectifs du projet

1. **Maintenir des tâches actionables** : Toujours entre 1-8 heures
2. **Optimiser le flux de développement** : Pas de blocages sur des tâches mal définies
3. **Intégration native avec Copilot** : Prompts optimisés pour chaque étape
4. **Qualité constante** : Validation automatique et suggestions d'amélioration
5. **Flexibilité** : Templates et modèles réutilisables

## 💡 Bonnes pratiques

### ✅ Faire
- Analyser la complexité avant de commencer une tâche
- Décomposer proactivement les tâches >6h estimées
- Utiliser des titres clairs et actionables
- Définir des critères d'acceptation précis
- Maintenir des dépendances logiques

### ❌ Éviter
- Tâches multi-objectifs ("Créer l'API et l'interface")
- Estimations vagues ("quelques jours")
- Dépendances circulaires
- Tâches sans critères de validation
- Décomposition trop granulaire (<30 min)

---

**TaskMaster** = Productivité maximale avec GitHub Copilot 🚀
