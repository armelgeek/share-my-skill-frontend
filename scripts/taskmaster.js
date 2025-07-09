#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { generatePrdWithCopilot, generateTasksWithCopilot, generateSubtasksWithCopilot, generateTaskTemplateWithCopilot, showCopilotInstructions, analyzeTaskComplexity, generateTaskBreakdownPrompt, generateProgressTrackingPrompt, generateNextjsTasksPrompt } = require('./taskmaster_utils');

const TASKMASTER_DIR = path.join(process.cwd(), '.taskmaster');
const PRD_PATH = path.join(TASKMASTER_DIR, 'prd.txt');
const TASKS_PATH = path.join(TASKMASTER_DIR, 'tasks.json');

function init() {
  if (!fs.existsSync(TASKMASTER_DIR)) {
    fs.mkdirSync(TASKMASTER_DIR);
  }
  if (!fs.existsSync(PRD_PATH)) {
    fs.writeFileSync(
      PRD_PATH,
      '# Exemple de PRD (Product Requirements Document)\n\n## Objectif\nCréer une application de gestion de tâches simple.\n\n## Fonctionnalités principales\n- Ajouter une tâche\n- Lister les tâches\n- Marquer une tâche comme terminée\n- Supprimer une tâche\n\n## Contraintes\n- Interface en ligne de commande\n- Stockage local (fichier JSON)\n\n## Extensions possibles\n- Priorité des tâches\n- Dates d’échéance\n- Filtres par statut\n'
    );
  }
  if (!fs.existsSync(TASKS_PATH)) {
    fs.writeFileSync(TASKS_PATH, JSON.stringify({ tasks: [], lastId: 0 }, null, 2));
  }
  console.log('Initialisation terminée. Dossier .taskmaster prêt.');
}

function list() {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Aucune tâche trouvée. Lancez d\'abord init.');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  if (data.tasks.length === 0) {
    console.log('Aucune tâche.');
    return;
  }
  data.tasks.forEach((task) => {
    console.log(`#${task.id} [${task.status}] ${task.title}`);
  });
}

function done(id) {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Aucune tâche trouvée.');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const task = data.tasks.find(t => t.id === Number(id));
  if (!task) {
    console.error(`Tâche #${id} introuvable.`);
    process.exit(1);
  }
  task.status = 'done';
  fs.writeFileSync(TASKS_PATH, JSON.stringify(data, null, 2));
  console.log(`Tâche #${id} marquée comme terminée.`);
}

function show(id) {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Aucune tâche trouvée.');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const task = data.tasks.find(t => t.id === Number(id));
  if (!task) {
    console.error(`Tâche #${id} introuvable.`);
    process.exit(1);
  }
  console.log(`#${task.id} [${task.status}] ${task.title}`);
  if (task.dependencies && task.dependencies.length > 0) {
    console.log('Dépendances :', task.dependencies.join(', '));
  }
}

function next() {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Aucune tâche trouvée.');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  
  // Trouve la prochaine tâche à faire (sans dépendances bloquantes)
  const todoTasks = data.tasks.filter(t => t.status === 'todo');
  if (todoTasks.length === 0) {
    console.log('✅ Toutes les tâches sont terminées !');
    return;
  }
  
  const nextTask = todoTasks.find(task => {
    // Vérifie si toutes les dépendances sont terminées
    if (!task.dependencies || task.dependencies.length === 0) return true;
    return task.dependencies.every(depId => {
      const dep = data.tasks.find(t => t.id === depId);
      return dep && dep.status === 'done';
    });
  });
  
  if (nextTask) {
    console.log(`🎯 Prochaine tâche à faire :`);
    console.log(`#${nextTask.id} [${nextTask.status}] ${nextTask.title}`);
    if (nextTask.description) console.log(`Description: ${nextTask.description}`);
    if (nextTask.priority) console.log(`Priorité: ${nextTask.priority}`);
  } else {
    console.log('⚠️  Aucune tâche disponible (dépendances bloquantes)');
    console.log('Tâches en attente:');
    todoTasks.forEach(task => {
      const blockedBy = task.dependencies?.filter(depId => {
        const dep = data.tasks.find(t => t.id === depId);
        return !dep || dep.status !== 'done';
      }) || [];
      if (blockedBy.length > 0) {
        console.log(`  #${task.id} ${task.title} (bloquée par: ${blockedBy.join(', ')})`);
      }
    });
  }
}

function add(title) {
  if (!title) {
    console.error('Usage: node taskmaster.js add "Titre de la tâche"');
    process.exit(1);
  }
  
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Projet non initialisé. Lancez d\'abord: node taskmaster.js init');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const newId = data.lastId + 1;
  
  const newTask = {
    id: newId,
    title: title,
    status: 'todo',
    dependencies: [],
    priority: 'medium'
  };
  
  data.tasks.push(newTask);
  data.lastId = newId;
  
  fs.writeFileSync(TASKS_PATH, JSON.stringify(data, null, 2));
  console.log(`✅ Tâche #${newId} ajoutée: ${title}`);
}

function remove(id) {
  if (!id) {
    console.error('Usage: node taskmaster.js remove <id>');
    process.exit(1);
  }
  
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Aucune tâche trouvée.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const taskIndex = data.tasks.findIndex(t => t.id === Number(id));
  
  if (taskIndex === -1) {
    console.error(`Tâche #${id} introuvable.`);
    process.exit(1);
  }
  
  const removedTask = data.tasks.splice(taskIndex, 1)[0];
  
  // Supprime cette tâche des dépendances d'autres tâches
  data.tasks.forEach(task => {
    if (task.dependencies) {
      task.dependencies = task.dependencies.filter(depId => depId !== Number(id));
    }
  });
  
  fs.writeFileSync(TASKS_PATH, JSON.stringify(data, null, 2));
  console.log(`🗑️  Tâche #${id} supprimée: ${removedTask.title}`);
}

function status() {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Aucune tâche trouvée.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const total = data.tasks.length;
  const done = data.tasks.filter(t => t.status === 'done').length;
  const todo = data.tasks.filter(t => t.status === 'todo').length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  
  console.log(`📊 Statut du projet:`);
  console.log(`   Total: ${total} tâches`);
  console.log(`   ✅ Terminées: ${done}`);
  console.log(`   🔄 À faire: ${todo}`);
  console.log(`   📈 Progression: ${progress}%`);
  
  if (todo > 0) {
    const nextTask = data.tasks.find(t => t.status === 'todo' && (!t.dependencies || t.dependencies.length === 0));
    if (nextTask) {
      console.log(`   🎯 Prochaine: #${nextTask.id} ${nextTask.title}`);
    }
  }
}

function generateTaskFile(id) {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('Aucune tâche trouvée.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const task = data.tasks.find(t => t.id === Number(id));
  
  if (!task) {
    console.error(`Tâche #${id} introuvable.`);
    process.exit(1);
  }
  
  const tasksDir = path.join(process.cwd(), '.taskmaster', 'tasks');
  if (!fs.existsSync(tasksDir)) {
    fs.mkdirSync(tasksDir, { recursive: true });
  }
  
  const taskFile = path.join(tasksDir, `task_${String(id).padStart(3, '0')}.txt`);
  
  const content = `# Task ID: ${task.id}
# Title: ${task.title}
# Status: ${task.status}
# Dependencies: ${task.dependencies?.join(', ') || 'None'}
# Priority: ${task.priority || 'medium'}

# Description:
${task.description || 'No description provided'}

# Details:
${task.details || 'Implementation details to be defined'}

# Test Strategy:
${task.testStrategy || 'Testing approach to be defined'}

# Subtasks:
${task.subtasks?.map((st, i) => `${i + 1}. ${st.title} - ${st.description || ''}`).join('\n') || 'No subtasks defined'}

# Notes:
- Created: ${new Date().toISOString()}
- Last updated: ${new Date().toISOString()}
`;
  
  fs.writeFileSync(taskFile, content);
  console.log(`📄 Fichier de tâche généré: ${taskFile}`);
}

function generateAllFiles() {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  
  if (!data.tasks || data.tasks.length === 0) {
    console.log('ℹ️  Aucune tâche à générer.');
    return;
  }
  
  const tasksDir = path.join(process.cwd(), '.taskmaster', 'tasks');
  if (!fs.existsSync(tasksDir)) {
    fs.mkdirSync(tasksDir, { recursive: true });
  }
  
  let generated = 0;
  
  data.tasks.forEach(task => {
    const taskFile = path.join(tasksDir, `task_${String(task.id).padStart(3, '0')}.txt`);
    
    const content = `# Task ID: ${task.id}
# Title: ${task.title}
# Status: ${task.status}
# Dependencies: ${task.dependencies?.join(', ') || 'None'}
# Priority: ${task.priority || 'medium'}
# Estimation: ${task.estimation || 'To be estimated'}

# Description:
${task.description || 'No description provided'}

# Implementation Details:
${task.details || 'Implementation details to be defined'}

# Test Strategy:
${task.testStrategy || 'Testing approach to be defined'}

# Subtasks:
${task.subtasks?.map((st, i) => `${st.id || `${task.id}.${i + 1}`}. ${st.title} - ${st.description || ''}`).join('\n') || 'No subtasks defined'}

# Notes:
- Created: ${new Date().toISOString()}
- Last updated: ${new Date().toISOString()}
- Project: ${data.meta?.projectName || 'Unknown'}

# Progress Tracking:
[ ] Task started
[ ] Implementation complete
[ ] Tests written
[ ] Tests passing
[ ] Task complete
`;
    
    fs.writeFileSync(taskFile, content);
    generated++;
  });
  
  console.log(`📄 ${generated} fichiers de tâches générés dans .taskmaster/tasks/`);
  console.log('💡 Vous pouvez maintenant ouvrir et modifier chaque fichier individuellement.');
}

function generateAdvancedCopilotPrompt() {
  const PRD_PATH = path.join(process.cwd(), '.taskmaster', 'prd.txt');
  
  if (!fs.existsSync(PRD_PATH)) {
    console.error('❌ PRD introuvable. Créez d\'abord un PRD dans .taskmaster/prd.txt');
    process.exit(1);
  }

  const prd = fs.readFileSync(PRD_PATH, 'utf-8');
  
  console.log('\n🧠 Prompt GitHub Copilot - Générateur de Tâches Avancé');
  console.log('================================================================');
  console.log('');
  console.log('COPIEZ CE PROMPT COMPLET DANS COPILOT CHAT :');
  console.log('');
  console.log('```javascript');
  console.log('// GitHub Copilot: Analysez ce PRD et générez des tâches de développement structurées');
  console.log('// Votre rôle: Assistant de développement expert en analyse de PRD');
  console.log('');
  console.log('// PRD à analyser:');
  console.log('const monPRD = `');
  console.log(prd);
  console.log('`;');
  console.log('');
  console.log('// Étape 1: Analyser le PRD');
  console.log('const analysePRD = {');
  console.log('  composantsPrincipaux: [');
  console.log('    // Copilot: Identifiez les composants système principaux');
  console.log('  ],');
  console.log('  modelesDonnees: [');
  console.log('    // Copilot: Définissez les structures de données nécessaires');
  console.log('  ],');
  console.log('  integrations: [');
  console.log('    // Copilot: Listez les APIs et services externes');
  console.log('  ],');
  console.log('  infrastructure: [');
  console.log('    // Copilot: Identifiez les besoins d\'infrastructure');
  console.log('  ],');
  console.log('  interfaceUtilisateur: [');
  console.log('    // Copilot: Décrivez les interfaces (CLI, Web, Mobile)');
  console.log('  ]');
  console.log('};');
  console.log('');
  console.log('// Étape 2: Générer le projet structuré au format Task Master');
  console.log('const projetTaskMaster = {');
  console.log('  "meta": {');
  console.log('    "projectName": "// Copilot: Nom du projet basé sur le PRD",');
  console.log('    "version": "1.0.0",');
  console.log('    "prdSource": ".taskmaster/prd.txt",');
  console.log('    "createdAt": "' + new Date().toISOString() + '",');
  console.log('    "updatedAt": "' + new Date().toISOString() + '",');
  console.log('    "description": "// Copilot: Description courte du projet"');
  console.log('  },');
  console.log('  "tasks": [');
  console.log('    {');
  console.log('      "id": 1,');
  console.log('      "title": "// Copilot: Première tâche fondamentale (ex: Configuration initiale)",');
  console.log('      "description": "// Copilot: Description brève de la tâche",');
  console.log('      "status": "todo",');
  console.log('      "priority": "high", // high|medium|low');
  console.log('      "dependencies": [], // Aucune dépendance pour la première');
  console.log('      "details": `');
  console.log('        // Copilot: Instructions détaillées d\'implémentation:');
  console.log('        // 1. Étape spécifique 1');
  console.log('        // 2. Étape spécifique 2');
  console.log('        // 3. Étape spécifique 3');
  console.log('      `,');
  console.log('      "testStrategy": "// Copilot: Comment valider cette tâche",');
  console.log('      "estimation": "// Copilot: Temps estimé (ex: 2-3 heures)",');
  console.log('      "subtasks": [');
  console.log('        {');
  console.log('          "id": "1.1",');
  console.log('          "title": "// Copilot: Première sous-tâche spécifique",');
  console.log('          "description": "// Copilot: Description détaillée de la sous-tâche",');
  console.log('          "status": "todo",');
  console.log('          "dependencies": [],');
  console.log('          "acceptanceCriteria": [');
  console.log('            "// Copilot: Critère mesurable 1",');
  console.log('            "// Copilot: Critère mesurable 2"');
  console.log('          ]');
  console.log('        }');
  console.log('        // Copilot: Générez 2-4 autres sous-tâches pour cette tâche');
  console.log('      ]');
  console.log('    },');
  console.log('    {');
  console.log('      "id": 2,');
  console.log('      "title": "// Copilot: Deuxième tâche logique",');
  console.log('      "description": "// Copilot: Description de la tâche",');
  console.log('      "status": "todo",');
  console.log('      "priority": "// Copilot: high|medium|low selon l\'importance",');
  console.log('      "dependencies": [1], // Dépend de la tâche 1 si nécessaire');
  console.log('      "details": `');
  console.log('        // Copilot: Détails d\'implémentation pour cette tâche');
  console.log('      `,');
  console.log('      "testStrategy": "// Copilot: Stratégie de validation",');
  console.log('      "estimation": "// Copilot: Estimation temporelle",');
  console.log('      "subtasks": [');
  console.log('        // Copilot: Sous-tâches pour la tâche 2');
  console.log('      ]');
  console.log('    }');
  console.log('    // Copilot: Continuez avec 5-15 tâches supplémentaires selon la complexité du PRD');
  console.log('    // Respectez l\'ordre logique: fondations → fonctionnalités → tests → déploiement');
  console.log('  ],');
  console.log('  "lastId": "// Copilot: Mettez le dernier ID utilisé"');
  console.log('};');
  console.log('');
  console.log('// Règles importantes pour Copilot:');
  console.log('// 1. PRIORITÉS: high pour les fondations, medium pour les fonctionnalités, low pour les améliorations');
  console.log('// 2. DÉPENDANCES: Logiques et sans cycles (ex: base de données avant API)');
  console.log('// 3. DÉTAILS: Spécifiques et actionables, pas de "TODO" vagues');
  console.log('// 4. TESTS: Chaque tâche doit avoir sa stratégie de validation');
  console.log('// 5. ESTIMATIONS: Réalistes (1-8 heures par tâche, subdivisez si plus)');
  console.log('// 6. SOUS-TÂCHES: 2-5 par tâche, atomiques et mesurables');
  console.log('// 7. DÉCOMPOSITION: Si une tâche semble complexe (>8h), la diviser en tâches plus petites');
  console.log('// 8. ATOMICITÉ: Chaque tâche doit avoir un seul objectif clair et livrable');
  console.log('');
  console.log('// GESTION DE LA COMPLEXITÉ:');
  console.log('// - Tâche simple (1-4h): Garder telle quelle avec des sous-tâches claires');
  console.log('// - Tâche moyenne (4-8h): Ajouter des sous-tâches détaillées et points de contrôle');
  console.log('// - Tâche complexe (>8h): OBLIGATOIRE de diviser en plusieurs tâches indépendantes');
  console.log('// - Une tâche = un livrable testable et fonctionnel');
  console.log('');
  console.log('// Phases suggérées (adaptez selon votre PRD):');
  console.log('// Phase 1 (Fondations): Setup, modèles de données, architecture de base');
  console.log('// Phase 2 (Core): Fonctionnalités principales, APIs, logique métier');
  console.log('// Phase 3 (Interface): UI/UX, interactions utilisateur, intégrations');
  console.log('// Phase 4 (Qualité): Tests, sécurité, performance, documentation');
  console.log('// Phase 5 (Déploiement): CI/CD, monitoring, mise en production');
  console.log('```');
  console.log('');
  console.log('================================================================');
  console.log('💡 INSTRUCTIONS:');
  console.log('1. Copiez tout le contenu ci-dessus dans GitHub Copilot Chat');
  console.log('2. Copilot va analyser votre PRD et générer le JSON complet');
  console.log('3. Sauvegardez le résultat dans .taskmaster/tasks.json');
  console.log('4. Utilisez "node taskmaster.js validate" pour vérifier la cohérence');
  console.log('');
}

function validateTasks() {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  console.log('🔍 Validation des tâches...\n');
  
  let errors = 0;
  let warnings = 0;
  
  // Vérification de la structure meta
  if (!data.meta) {
    console.log('❌ Section "meta" manquante');
    errors++;
  } else {
    console.log('✅ Section meta présente');
  }
  
  // Vérification des tâches
  if (!data.tasks || !Array.isArray(data.tasks)) {
    console.log('❌ Section "tasks" manquante ou invalide');
    errors++;
    return;
  }
  
  const taskIds = data.tasks.map(t => t.id);
  
  data.tasks.forEach((task, index) => {
    const prefix = `Tâche #${task.id}:`;
    
    // Vérifications obligatoires
    if (!task.title) {
      console.log(`❌ ${prefix} Titre manquant`);
      errors++;
    }
    if (!task.status) {
      console.log(`❌ ${prefix} Statut manquant`);
      errors++;
    }
    if (!['todo', 'in-progress', 'done', 'blocked'].includes(task.status)) {
      console.log(`⚠️  ${prefix} Statut invalide: ${task.status}`);
      warnings++;
    }
    
    // Vérification des dépendances
    if (task.dependencies) {
      task.dependencies.forEach(depId => {
        if (!taskIds.includes(depId)) {
          console.log(`❌ ${prefix} Dépendance invalide: tâche #${depId} introuvable`);
          errors++;
        }
      });
    }
    
    // Vérifications recommandées
    if (!task.priority) {
      console.log(`⚠️  ${prefix} Priorité manquante`);
      warnings++;
    }
    if (!task.description) {
      console.log(`⚠️  ${prefix} Description manquante`);
      warnings++;
    }
    if (!task.details) {
      console.log(`⚠️  ${prefix} Détails d'implémentation manquants`);
      warnings++;
    }
  });
  
  // Vérification des dépendances circulaires
  function hasCyclicDependency(taskId, visited = new Set(), path = new Set()) {
    if (path.has(taskId)) return true;
    if (visited.has(taskId)) return false;
    
    visited.add(taskId);
    path.add(taskId);
    
    const task = data.tasks.find(t => t.id === taskId);
    if (task && task.dependencies) {
      for (const depId of task.dependencies) {
        if (hasCyclicDependency(depId, visited, path)) {
          return true;
        }
      }
    }
    
    path.delete(taskId);
    return false;
  }
  
  for (const task of data.tasks) {
    if (hasCyclicDependency(task.id)) {
      console.log(`❌ Dépendance circulaire détectée pour la tâche #${task.id}`);
      errors++;
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé de validation:');
  console.log(`   Total tâches: ${data.tasks.length}`);
  console.log(`   ❌ Erreurs: ${errors}`);
  console.log(`   ⚠️  Avertissements: ${warnings}`);
  
  if (errors === 0) {
    console.log('✅ Structure valide ! Prêt pour le développement.');
  } else {
    console.log('❌ Corrigez les erreurs avant de continuer.');
  }
}

function regenerateFiles() {
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  
  if (!data.tasks || data.tasks.length === 0) {
    console.log('ℹ️  Aucune tâche à régénérer.');
    return;
  }
  
  const tasksDir = path.join(process.cwd(), '.taskmaster', 'tasks');
  if (!fs.existsSync(tasksDir)) {
    fs.mkdirSync(tasksDir, { recursive: true });
  }
  
  let regenerated = 0;
  
  data.tasks.forEach(task => {
    const taskFile = path.join(tasksDir, `task_${String(task.id).padStart(3, '0')}.txt`);
    
    // Seulement régénérer si le fichier existe déjà
    if (fs.existsSync(taskFile)) {
      const content = `# Task ID: ${task.id}
# Title: ${task.title}
# Status: ${task.status}
# Dependencies: ${task.dependencies?.join(', ') || 'None'}
# Priority: ${task.priority || 'medium'}
# Estimation: ${task.estimation || 'To be estimated'}

# Description:
${task.description || 'No description provided'}

# Implementation Details:
${task.details || 'Implementation details to be defined'}

# Test Strategy:
${task.testStrategy || 'Testing approach to be defined'}

# Subtasks:
${task.subtasks?.map((st, i) => `${st.id || `${task.id}.${i + 1}`}. ${st.title} - ${st.description || ''}`).join('\n') || 'No subtasks defined'}

# Notes:
- Created: ${new Date().toISOString()}
- Last updated: ${new Date().toISOString()}
- Project: ${data.meta?.projectName || 'Unknown'}

# Progress Tracking:
[ ] Task started
[ ] Implementation complete
[ ] Tests written
[ ] Tests passing
[ ] Task complete
`;
      
      fs.writeFileSync(taskFile, content);
      regenerated++;
    }
  });
  
  console.log(`🔄 ${regenerated} fichiers de tâches régénérés dans .taskmaster/tasks/`);
}

function analyzeComplexity(id) {
  if (!id) {
    console.error('Usage: node taskmaster.js analyze-complexity <id>');
    process.exit(1);
  }
  
  const analysis = analyzeTaskComplexity(id);
  
  if (!analysis) {
    process.exit(1);
  }
  
  const { task, complexityScore, complexityLevel, needsBreakdown, suggestions } = analysis;
  
  console.log(`\n🔍 Analyse de complexité - Tâche #${task.id}`);
  console.log('================================================');
  console.log(`📋 Titre: ${task.title}`);
  console.log(`📊 Score de complexité: ${complexityScore}/10`);
  console.log(`🎯 Niveau: ${complexityLevel}`);
  console.log(`🔧 Décomposition recommandée: ${needsBreakdown ? '✅ OUI' : '❌ NON'}`);
  
  if (suggestions.length > 0) {
    console.log('\n💡 Suggestions:');
    suggestions.forEach((suggestion, i) => {
      console.log(`   ${i + 1}. ${suggestion}`);
    });
  }
  
  if (needsBreakdown) {
    console.log('\n🚀 Actions recommandées:');
    console.log('   1. Utilisez: node taskmaster.js breakdown ' + id);
    console.log('   2. Copiez le prompt généré dans GitHub Copilot Chat');
    console.log('   3. Remplacez la tâche complexe par les nouvelles tâches décomposées');
    console.log('   4. Validez avec: node taskmaster.js validate');
  } else {
    console.log('\n✅ Cette tâche semble déjà bien dimensionnée.');
  }
}

function breakdownTask(id) {
  if (!id) {
    console.error('Usage: node taskmaster.js breakdown <id>');
    process.exit(1);
  }
  
  console.log(`🔧 Génération du prompt de décomposition pour la tâche #${id}...`);
  generateTaskBreakdownPrompt(id);
}

function generateProgressReport() {
  console.log(`🔧 Génération du prompt de suivi de progression...`);
  generateProgressTrackingPrompt();
}

function help() {
  console.log(`Commandes disponibles :
  init                     Initialise le dossier .taskmaster
  list                     Liste toutes les tâches
  next                     Affiche la prochaine tâche à faire
  status                   Affiche le statut global du projet
  add "titre"              Ajoute une nouvelle tâche
  done <id>                Marque une tâche comme terminée
  show <id>                Affiche une tâche précise
  remove <id>              Supprime une tâche
  generate-file <id>       Génère un fichier individuel pour une tâche
  generate-all-files       Génère tous les fichiers individuels des tâches
  regenerate-files         Régénère tous les fichiers existants
  validate                 Valide la structure et cohérence des tâches
  parse-prd                Génère les tâches à partir du PRD (simple)
  
  🔍 Analyse et décomposition :
  analyze-complexity <id>  Analyse la complexité d'une tâche
  breakdown <id>           Génère un prompt Copilot pour décomposer une tâche complexe
  
  📊 Suivi de projet :
  progress-report          Génère un prompt Copilot pour analyser la progression du projet
  
  📖 Documentation :
  copilot-help             Affiche les instructions détaillées pour Copilot
  
  🤖 Génération avec Copilot :
  generate-prd             Génère un prompt Copilot pour créer un PRD
  generate-tasks           Génère un prompt Copilot simple pour créer les tâches
  generate-advanced        Génère un prompt Copilot avancé avec analyse PRD
  generate-subtasks <id>   Génère un prompt Copilot pour créer des sous-tâches
  generate-template <nom>  Génère un prompt Copilot pour créer un template
  generate-nextjs-tasks    🚀 Génère un prompt Copilot spécialisé Next.js + Admin
  
  help                     Affiche cette aide
`);
}

function parsePrd() {
  if (!fs.existsSync(PRD_PATH)) {
    console.error('PRD introuvable.');
    process.exit(1);
  }
  const prd = fs.readFileSync(PRD_PATH, 'utf-8');
  // On extrait les lignes de fonctionnalités principales
  const featuresSection = prd.split('## Fonctionnalités principales')[1]?.split('##')[0] || '';
  const lines = featuresSection.split('\n').map(l => l.trim()).filter(l => l.startsWith('- '));
  if (lines.length === 0) {
    console.error('Aucune fonctionnalité trouvée dans le PRD.');
    process.exit(1);
  }
  let tasks = [];
  let id = 1;
  lines.forEach(line => {
    tasks.push({
      id: id++,
      title: line.replace('- ', ''),
      status: 'todo',
      dependencies: []
    });
  });
  fs.writeFileSync(TASKS_PATH, JSON.stringify({ tasks, lastId: tasks.length }, null, 2));
  console.log(`${tasks.length} tâches générées à partir du PRD.`);
}

const cmd = process.argv[2];

switch (cmd) {
  case 'init':
    init();
    break;
  case 'list':
    list();
    break;
  case 'next':
    next();
    break;
  case 'status':
    status();
    break;
  case 'add':
    add(process.argv.slice(3).join(' '));
    break;
  case 'parse-prd':
    parsePrd();
    break;
  case 'done':
    done(process.argv[3]);
    break;
  case 'show':
    show(process.argv[3]);
    break;
  case 'remove':
    remove(process.argv[3]);
    break;
  case 'generate-file':
    generateTaskFile(process.argv[3]);
    break;
  case 'generate-all-files':
    generateAllFiles();
    break;
  case 'regenerate-files':
    regenerateFiles();
    break;
  case 'validate':
    validateTasks();
    break;
  case 'copilot-help':
    showCopilotInstructions();
    break;
  case 'generate-prd':
    generatePrdWithCopilot();
    break;
  case 'generate-tasks':
    generateTasksWithCopilot();
    break;
  case 'generate-advanced':
    generateAdvancedCopilotPrompt();
    break;
  case 'generate-subtasks':
    generateSubtasksWithCopilot(process.argv[3]);
    break;
  case 'generate-template':
    generateTaskTemplateWithCopilot(process.argv[3]);
    break;
  case 'analyze-complexity':
    analyzeComplexity(process.argv[3]);
    break;
  case 'breakdown':
    breakdownTask(process.argv[3]);
    break;
  case 'progress-report':
    generateProgressReport();
    break;
  case 'generate-nextjs-tasks':
    generateNextjsTasksPrompt();
    break;
  default:
    help();
}
