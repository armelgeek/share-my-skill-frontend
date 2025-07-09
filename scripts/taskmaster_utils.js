const fs = require('fs');
const path = require('path');

// Scan tasks directory for external template files
function scanForExternalTaskFiles(projectRoot) {
  const tasksDir = path.join(projectRoot, '.taskmaster', 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  return fs.readdirSync(tasksDir)
    .filter(f => /^tasks_[\w-]+\.json$/.test(f))
    .map(f => path.join(tasksDir, f));
}

// Extract tag names from external filenames
function getExternalTagsFromFiles(projectRoot) {
  const files = scanForExternalTaskFiles(projectRoot);
  return files.map(f => {
    const match = /tasks_([\w-]+)\.json$/.exec(f);
    return match ? match[1] : null;
  }).filter(Boolean);
}

// Read specific external tag data
function readExternalTagData(projectRoot, tagName) {
  const files = scanForExternalTaskFiles(projectRoot);
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (data.tags && data.tags[tagName]) {
        return data.tags[tagName];
      }
    } catch (e) {
      // Ignore malformed files
      continue;
    }
  }
  return null;
}

// Get combined main and external tags
function getAvailableTags(projectRoot) {
  const mainPath = path.join(projectRoot, '.taskmaster', 'tasks.json');
  let mainTags = [{ name: 'master', source: 'main', isActive: true }];
  let externalTags = [];
  const files = scanForExternalTaskFiles(projectRoot);
  files.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (data.tags) {
        Object.keys(data.tags).forEach(tag => {
          if (tag !== 'master') {
            externalTags.push({
              name: tag,
              source: 'external',
              filename: path.basename(file),
              isReadOnly: true
            });
          }
        });
      }
    } catch (e) {
      // Ignore malformed files
    }
  });
  // Remove duplicates: main tags take precedence
  const mainTagNames = mainTags.map(t => t.name);
  externalTags = externalTags.filter(t => !mainTagNames.includes(t.name));
  return { mainTags, externalTags };
}

// Generate a PRD using GitHub Copilot
function generatePrdWithCopilot() {
  console.log('\n🤖 Utilisez GitHub Copilot pour générer votre PRD:');
  console.log('========================================================');
  console.log('');
  console.log('⚠️  IMPORTANT: Avant de commencer, lisez les instructions Copilot !');
  console.log('');
  console.log('ÉTAPES À SUIVRE:');
  console.log('1. 📖 Lisez d\'abord les instructions détaillées pour Copilot');
  console.log('2. 🤖 Copiez le prompt ci-dessous dans Copilot Chat');
  console.log('3. 💾 Sauvegardez le résultat généré dans .taskmaster/prd.txt');
  console.log('');
  console.log('PROMPT POUR COPILOT:');
  console.log('');
  console.log('"Génère un PRD (Product Requirements Document) pour [VOTRE_PROJET]');
  console.log('en suivant cette structure:');
  console.log('');
  console.log('# Overview');
  console.log('Décris le problème résolu, les utilisateurs cibles, et la valeur.');
  console.log('');
  console.log('# Core Features');
  console.log('Liste les fonctionnalités principales avec:');
  console.log('- Ce que ça fait');
  console.log('- Pourquoi c\'est important');
  console.log('- Comment ça marche');
  console.log('');
  console.log('# User Experience');
  console.log('Décris:');
  console.log('- Personas utilisateurs');
  console.log('- Parcours utilisateur clés');
  console.log('- Considérations UI/UX');
  console.log('');
  console.log('# Technical Architecture');
  console.log('Détaille:');
  console.log('- Composants système');
  console.log('- Modèles de données');
  console.log('- APIs et intégrations');
  console.log('- Exigences infrastructure');
  console.log('');
  console.log('# Development Roadmap');
  console.log('Découpe en phases:');
  console.log('- Exigences MVP');
  console.log('- Améliorations futures');
  console.log('- Scope détaillé par phase');
  console.log('');
  console.log('# Logical Dependency Chain');
  console.log('Définis l\'ordre logique:');
  console.log('- Fonctionnalités fondamentales d\'abord');
  console.log('- Frontend utilisable rapidement');
  console.log('- Fonctionnalités atomiques mais extensibles');
  console.log('');
  console.log('# Risks and Mitigations');
  console.log('Identifie:');
  console.log('- Défis techniques');
  console.log('- Définition du MVP');
  console.log('- Contraintes de ressources"');
  console.log('');
  console.log('========================================================');
  console.log('💡 Copiez ce prompt dans Copilot Chat et remplacez [VOTRE_PROJET]');
  console.log('💾 Sauvegardez le résultat dans .taskmaster/prd.txt');
}

// Generate tasks from PRD using GitHub Copilot
function generateTasksWithCopilot() {
  const PRD_PATH = path.join(process.cwd(), '.taskmaster', 'prd.txt');
  
  if (!fs.existsSync(PRD_PATH)) {
    console.error('❌ PRD introuvable. Utilisez d\'abord: node taskmaster.js generate-prd');
    process.exit(1);
  }

  const prd = fs.readFileSync(PRD_PATH, 'utf-8');
  
  console.log('\n🤖 Utilisez GitHub Copilot pour générer vos tâches:');
  console.log('========================================================');
  console.log('');
  console.log('⚠️  IMPORTANT: Avant de commencer, lisez les instructions Copilot !');
  console.log('');
  console.log('ÉTAPES À SUIVRE:');
  console.log('1. 📖 Lisez d\'abord les bonnes pratiques pour Copilot');
  console.log('2. 🤖 Copiez le prompt complet ci-dessous dans Copilot Chat');
  console.log('3. 💾 Sauvegardez le JSON généré dans .taskmaster/tasks.json');
  console.log('4. ✅ Utilisez "node taskmaster.js validate" pour vérifier');
  console.log('');
  console.log('PROMPT POUR COPILOT:');
  console.log('');
  console.log('"Analyse ce PRD et génère une liste structurée de tâches de développement');
  console.log('au format JSON suivant:');
  console.log('');
  console.log('{');
  console.log('  "meta": {');
  console.log('    "projectName": "Nom du projet",');
  console.log('    "version": "1.0.0",');
  console.log('    "prdSource": ".taskmaster/prd.txt",');
  console.log('    "createdAt": "2025-01-09T12:00:00Z"');
  console.log('  },');
  console.log('  "tasks": [');
  console.log('    {');
  console.log('      "id": 1,');
  console.log('      "title": "Titre de la tâche",');
  console.log('      "description": "Description brève",');
  console.log('      "status": "todo",');
  console.log('      "priority": "high|medium|low",');
  console.log('      "dependencies": [],');
  console.log('      "details": "Instructions détaillées d\'implémentation",');
  console.log('      "testStrategy": "Stratégie de vérification",');
  console.log('      "subtasks": []');
  console.log('    }');
  console.log('  ],');
  console.log('  "lastId": 10');
  console.log('}');
  console.log('');
  console.log('Respecte l\'ordre logique des dépendances et assure-toi que chaque tâche');
  console.log('est atomique mais peut être construite progressivement.\\n\\nPRD:\\n');
  console.log('');
  console.log(prd);
  console.log('"');
  console.log('');
  console.log('========================================================');
  console.log('💡 Copiez ce prompt dans Copilot Chat');
  console.log('💾 Sauvegardez le JSON résultat dans .taskmaster/tasks.json');
}

// Generate subtasks for a specific task using GitHub Copilot  
function generateSubtasksWithCopilot(taskId) {
  const TASKS_PATH = path.join(process.cwd(), '.taskmaster', 'tasks.json');
  
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const task = data.tasks.find(t => t.id === Number(taskId));
  
  if (!task) {
    console.error(`❌ Tâche #${taskId} introuvable.`);
    process.exit(1);
  }

  console.log('\n🤖 Utilisez GitHub Copilot pour générer des sous-tâches:');
  console.log('========================================================');
  console.log('');
  console.log('⚠️  IMPORTANT: Avant de commencer, lisez les instructions Copilot !');
  console.log('');
  console.log('ÉTAPES À SUIVRE:');
  console.log('1. 📖 Comprenez d\'abord comment bien utiliser Copilot');
  console.log('2. 🤖 Copiez le prompt ci-dessous dans Copilot Chat');
  console.log('3. 💾 Intégrez le JSON généré dans la tâche existante');
  console.log('');
  console.log('PROMPT POUR COPILOT:');
  console.log('');
  console.log(`"Décompose cette tâche en sous-tâches détaillées et actionables:`);
  console.log('');
  console.log(`Tâche principale:`);
  console.log(`ID: ${task.id}`);
  console.log(`Titre: ${task.title}`);
  console.log(`Description: ${task.description || 'Non spécifiée'}`);
  console.log(`Détails: ${task.details || 'Non définis'}`);
  console.log('');
  console.log('Génère 3-7 sous-tâches au format JSON:');
  console.log('[');
  console.log('  {');
  console.log('    "id": "1.1",');
  console.log('    "title": "Titre sous-tâche",');
  console.log('    "description": "Description détaillée",');
  console.log('    "status": "todo",');
  console.log('    "dependencies": [],');
  console.log('    "acceptanceCriteria": "Critères de validation"');
  console.log('  }');
  console.log(']');
  console.log('');
  console.log('Assure-toi que:');
  console.log('- Chaque sous-tâche est spécifique et actionnable');
  console.log('- Les dépendances entre sous-tâches sont claires');
  console.log('- Les critères d\'acceptation sont vérifiables"');
  console.log('');
  console.log('========================================================');
  console.log('💡 Copiez ce prompt dans Copilot Chat');
  console.log(`💾 Ajoutez le résultat dans la propriété "subtasks" de la tâche #${taskId}`);
}

// Generate task template using GitHub Copilot
function generateTaskTemplateWithCopilot(templateName) {
  if (!templateName) {
    console.error('❌ Usage: node taskmaster.js generate-template <nom-template>');
    process.exit(1);
  }

  console.log('\n🤖 Utilisez GitHub Copilot pour générer un template de tâches:');
  console.log('========================================================');
  console.log('');
  console.log('⚠️  IMPORTANT: Avant de commencer, lisez les instructions Copilot !');
  console.log('');
  console.log('ÉTAPES À SUIVRE:');
  console.log('1. 📖 Consultez d\'abord les bonnes pratiques Copilot');
  console.log('2. 🤖 Copiez le prompt ci-dessous dans Copilot Chat');
  console.log('3. 💾 Sauvegardez le template dans le bon dossier');
  console.log('');
  console.log('PROMPT POUR COPILOT:');
  console.log('');
  console.log(`"Crée un template de tâches pour le contexte "${templateName}"`);
  console.log('au format JSON suivant:');
  console.log('');
  console.log('{');
  console.log('  "meta": {');
  console.log(`    "projectName": "Template ${templateName}",`);
  console.log('    "version": "1.0.0",');
  console.log('    "templateSource": "external",');
  console.log('    "createdAt": "2025-01-09T12:00:00Z"');
  console.log('  },');
  console.log('  "tags": {');
  console.log(`    "${templateName}": {`);
  console.log('      "meta": {');
  console.log(`        "name": "Template ${templateName}",`);
  console.log(`        "description": "Description du template ${templateName}",`);
  console.log('        "createdAt": "2025-01-09T12:00:00Z"');
  console.log('      },');
  console.log('      "tasks": [');
  console.log('        {');
  console.log('          "id": 1,');
  console.log('          "title": "Titre de tâche exemple",');
  console.log('          "description": "Description",');
  console.log('          "status": "todo",');
  console.log('          "priority": "medium",');
  console.log('          "dependencies": [],');
  console.log('          "details": "Détails d\'implémentation",');
  console.log('          "testStrategy": "Stratégie de test"');
  console.log('        }');
  console.log('      ]');
  console.log('    }');
  console.log('  }');
  console.log('}');
  console.log('');
  console.log(`Génère des tâches typiques pour le contexte "${templateName}".`);
  console.log('Pense aux étapes communes, bonnes pratiques, et points de validation."');
  console.log('');
  console.log('========================================================');
  console.log('💡 Copiez ce prompt dans Copilot Chat');
  console.log(`💾 Sauvegardez le résultat dans .taskmaster/tasks/tasks_${templateName}.json`);
}

// Show GitHub Copilot instructions
function showCopilotInstructions() {
  const instructionsPath = path.join(process.cwd(), '.taskmaster', 'copilot-instructions.md');
  
  if (!fs.existsSync(instructionsPath)) {
    console.error('❌ Instructions Copilot introuvables.');
    return;
  }

  const instructions = fs.readFileSync(instructionsPath, 'utf-8');
  console.log('\n📖 INSTRUCTIONS GITHUB COPILOT - TASK MASTER');
  console.log('================================================================');
  console.log(instructions);
  console.log('================================================================');
  console.log('\n💡 Astuce : Gardez ces instructions ouvertes pendant que vous utilisez Copilot !');
}

// Analyze task complexity and suggest if breakdown is needed
function analyzeTaskComplexity(taskId) {
  const fs = require('fs');
  const path = require('path');
  
  const TASKS_PATH = path.join(process.cwd(), '.taskmaster', 'tasks.json');
  
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    return null;
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const task = data.tasks.find(t => t.id === Number(taskId));
  
  if (!task) {
    console.error(`❌ Tâche #${taskId} introuvable.`);
    return null;
  }
  
  let complexityScore = 0;
  let suggestions = [];
  
  // Analyse de la description et du titre
  const titleLength = task.title?.length || 0;
  const descriptionLength = task.description?.length || 0;
  const detailsLength = task.details?.length || 0;
  
  // Score basé sur la longueur du titre (plus c'est long, plus c'est complexe)
  if (titleLength > 100) {
    complexityScore += 3;
    suggestions.push("Titre très long, indique certainement une tâche multi-objectifs");
  } else if (titleLength > 80) {
    complexityScore += 2;
    suggestions.push("Titre très long, pourrait indiquer une tâche multi-objectifs");
  } else if (titleLength > 50) {
    complexityScore += 1;
  }
  
  // Score basé sur la description
  if (descriptionLength > 500) {
    complexityScore += 2;
    suggestions.push("Description très détaillée, pourrait nécessiter une décomposition");
  } else if (descriptionLength > 200) {
    complexityScore += 1;
  }
  
  // Score basé sur les détails d'implémentation
  if (detailsLength > 800) {
    complexityScore += 3;
    suggestions.push("Détails d'implémentation très longs, diviser en étapes plus petites");
  } else if (detailsLength > 400) {
    complexityScore += 2;
  }
  
  // Analyse des sous-tâches
  const subtasksCount = task.subtasks?.length || 0;
  if (subtasksCount > 8) {
    complexityScore += 3;
    suggestions.push("Trop de sous-tâches, considérer une division en tâches séparées");
  } else if (subtasksCount > 5) {
    complexityScore += 2;
    suggestions.push("Beaucoup de sous-tâches, vérifier si certaines peuvent être des tâches indépendantes");
  } else if (subtasksCount === 0) {
    complexityScore += 1;
    suggestions.push("Aucune sous-tâche définie, ajouter des étapes pour clarifier l'implémentation");
  }
  
  // Analyse de l'estimation
  const estimation = task.estimation?.toLowerCase() || '';
  if (estimation.includes('jour') || estimation.includes('day') || estimation.includes('semaine') || estimation.includes('week')) {
    complexityScore += 3;
    suggestions.push("Estimation en jours/semaines, décomposer en tâches de quelques heures");
  } else if (estimation.includes('8') || estimation.includes('10') || estimation.includes('12')) {
    complexityScore += 2;
    suggestions.push("Estimation élevée (8h+), considérer une décomposition");
  }
  
  // Analyse des dépendances
  const dependenciesCount = task.dependencies?.length || 0;
  if (dependenciesCount > 3) {
    complexityScore += 2;
    suggestions.push("Beaucoup de dépendances, pourrait indiquer une tâche trop large");
  }
  
  // Recherche de mots-clés de complexité dans le titre/description
  const text = `${task.title} ${task.description || ''} ${task.details || ''}`.toLowerCase();
  const complexKeywords = ['complet', 'système', 'intégration', 'architecture', 'end-to-end', 'migration', 'refactoring', 'avec', 'et', '&', '+', 'gestion', 'interface'];
  const foundKeywords = complexKeywords.filter(keyword => text.includes(keyword));
  
  if (foundKeywords.length > 4) {
    complexityScore += 3;
    suggestions.push(`Nombreux mots-clés de complexité détectés: ${foundKeywords.join(', ')}`);
  } else if (foundKeywords.length > 2) {
    complexityScore += 2;
    suggestions.push(`Mots-clés de complexité détectés: ${foundKeywords.join(', ')}`);
  } else if (foundKeywords.length > 0) {
    complexityScore += 1;
  }
  
  // Déterminer le niveau de complexité
  let complexityLevel, needsBreakdown;
  if (complexityScore <= 3) {
    complexityLevel = 'SIMPLE';
    needsBreakdown = false;
  } else if (complexityScore <= 6) {
    complexityLevel = 'MOYENNE';
    needsBreakdown = false;
    suggestions.push("Ajouter des sous-tâches détaillées et des points de contrôle");
  } else {
    complexityLevel = 'COMPLEXE';
    needsBreakdown = true;
    suggestions.push("RECOMMANDATION FORTE: Décomposer cette tâche en plusieurs tâches indépendantes");
  }
  
  return {
    task,
    complexityScore,
    complexityLevel,
    needsBreakdown,
    suggestions
  };
}

// Generate task breakdown prompt for Copilot
function generateTaskBreakdownPrompt(taskId) {
  const fs = require('fs');
  const path = require('path');
  
  const TASKS_PATH = path.join(process.cwd(), '.taskmaster', 'tasks.json');
  
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const task = data.tasks.find(t => t.id === Number(taskId));
  
  if (!task) {
    console.error(`❌ Tâche #${taskId} introuvable.`);
    return;
  }
  
  const analysis = analyzeTaskComplexity(taskId);
  
  console.log('\n🔧 Prompt GitHub Copilot - Décomposition de Tâche Complexe');
  console.log('================================================================');
  console.log('');
  console.log('COPIEZ CE PROMPT COMPLET DANS COPILOT CHAT :');
  console.log('');
  console.log('```javascript');
  console.log('// GitHub Copilot: Décomposez cette tâche complexe en tâches plus petites et gérables');
  console.log('// Votre rôle: Expert en décomposition de tâches et gestion de projet agile');
  console.log('');
  console.log('// TÂCHE À DÉCOMPOSER:');
  console.log('const tacheComplexe = {');
  console.log(`  "id": ${task.id},`);
  console.log(`  "title": "${task.title}",`);
  console.log(`  "description": "${task.description || 'Non définie'}",`);
  console.log(`  "details": \`${task.details || 'Non définis'}\`,`);
  console.log(`  "status": "${task.status}",`);
  console.log(`  "priority": "${task.priority || 'medium'}",`);
  console.log(`  "estimation": "${task.estimation || 'Non estimée'}",`);
  console.log(`  "dependencies": [${task.dependencies?.join(', ') || ''}],`);
  console.log(`  "subtasks": [`);
  if (task.subtasks && task.subtasks.length > 0) {
    task.subtasks.forEach((subtask, index) => {
      console.log(`    {`);
      console.log(`      "id": "${subtask.id || `${task.id}.${index + 1}`}",`);
      console.log(`      "title": "${subtask.title}",`);
      console.log(`      "description": "${subtask.description || ''}"`);
      console.log(`    }${index < task.subtasks.length - 1 ? ',' : ''}`);
    });
  }
  console.log(`  ]`);
  console.log('};');
  console.log('');
  
  if (analysis) {
    console.log('// ANALYSE DE COMPLEXITÉ:');
    console.log(`// Score: ${analysis.complexityScore}/10 (${analysis.complexityLevel})`);
    console.log(`// Décomposition nécessaire: ${analysis.needsBreakdown ? 'OUI' : 'NON'}`);
    if (analysis.suggestions.length > 0) {
      console.log('// Problèmes identifiés:');
      analysis.suggestions.forEach((suggestion, i) => {
        console.log(`//   ${i + 1}. ${suggestion}`);
      });
    }
    console.log('');
  }
  
  console.log('// INSTRUCTIONS POUR COPILOT:');
  console.log('// 1. Analysez la tâche complexe ci-dessus');
  console.log('// 2. Identifiez les sous-composants logiques et indépendants');
  console.log('// 3. Créez une liste de nouvelles tâches plus petites (2-6 heures chacune)');
  console.log('// 4. Respectez les règles de décomposition ci-dessous');
  console.log('');
  console.log('// RÈGLES DE DÉCOMPOSITION:');
  console.log('// ✅ Chaque nouvelle tâche doit avoir UN seul objectif clair');
  console.log('// ✅ Estimation: 1-6 heures maximum par tâche');
  console.log('// ✅ Chaque tâche doit produire un livrable testable');
  console.log('// ✅ Dépendances claires entre les nouvelles tâches');
  console.log('// ✅ Conserver le contexte et les détails importants');
  console.log('// ❌ Éviter les tâches trop granulaires (< 30 minutes)');
  console.log('// ❌ Éviter les tâches vagues ou non-actionables');
  console.log('');
  console.log('// STRUCTURE DE SORTIE:');
  console.log('const tachesDecomposees = {');
  console.log('  "meta": {');
  console.log('    "originalTaskId": ' + task.id + ',');
  console.log('    "originalTitle": "' + task.title + '",');
  console.log('    "decompositionReason": "// Copilot: Expliquez pourquoi cette décomposition est nécessaire",');
  console.log('    "decomposedAt": "' + new Date().toISOString() + '"');
  console.log('  },');
  console.log('  "newTasks": [');
  console.log('    {');
  console.log('      "id": "// Copilot: Utilisez des IDs logiques (ex: ' + task.id + '.1, ' + task.id + '.2, etc.)",');
  console.log('      "title": "// Copilot: Titre clair et actionnable (ex: \'Créer le modèle de données User\')",');
  console.log('      "description": "// Copilot: Description concise de cette partie spécifique",');
  console.log('      "status": "todo",');
  console.log('      "priority": "// Copilot: Héritée ou ajustée selon l\'importance",');
  console.log('      "estimation": "// Copilot: 1-6 heures, soyez précis",');
  console.log('      "dependencies": [/* Copilot: IDs des tâches dont celle-ci dépend */],');
  console.log('      "details": `');
  console.log('        // Copilot: Détails d\'implémentation spécifiques:');
  console.log('        // - Étape précise 1');
  console.log('        // - Étape précise 2');
  console.log('        // - Critères d\'acceptation');
  console.log('      `,');
  console.log('      "testStrategy": "// Copilot: Comment valider cette tâche spécifique",');
  console.log('      "deliverable": "// Copilot: Quel est le livrable concret de cette tâche",');
  console.log('      "subtasks": [');
  console.log('        // Copilot: 2-4 sous-tâches si nécessaire, ou [] si atomique');
  console.log('      ]');
  console.log('    },');
  console.log('    {');
  console.log('      "id": "// Copilot: Tâche 2",');
  console.log('      "title": "// Copilot: Titre de la deuxième tâche",');
  console.log('      "description": "// Copilot: Description",');
  console.log('      "status": "todo",');
  console.log('      "priority": "// Copilot: Priorité adaptée",');
  console.log('      "estimation": "// Copilot: Estimation",');
  console.log('      "dependencies": ["// Copilot: Dépendances vers autres nouvelles tâches si nécessaire"],');
  console.log('      "details": "// Copilot: Détails d\'implémentation",');
  console.log('      "testStrategy": "// Copilot: Stratégie de test",');
  console.log('      "deliverable": "// Copilot: Livrable concret"');
  console.log('    }');
  console.log('    // Copilot: Continuez avec 2-6 tâches au total selon la complexité');
  console.log('    // L\'objectif est de remplacer la tâche complexe par ces nouvelles tâches');
  console.log('  ],');
  console.log('  "implementation": {');
  console.log('    "replaceOriginal": true, // Supprimer la tâche originale');
  console.log('    "preserveContext": [');
  console.log('      "// Copilot: Listez les éléments importants à préserver",');
  console.log('      "// Ex: liens vers documentation, contexte métier, etc."');
  console.log('    ]');
  console.log('  }');
  console.log('};');
  console.log('');
  console.log('// EXEMPLES DE BONNE DÉCOMPOSITION:');
  console.log('// ❌ "Implémenter l\'authentification complète" (trop large)');
  console.log('// ✅ "Créer le modèle User en base"');
  console.log('// ✅ "Implémenter l\'endpoint POST /auth/login"');
  console.log('// ✅ "Ajouter la validation JWT aux middlewares"');
  console.log('// ✅ "Créer les tests d\'intégration auth"');
  console.log('');
  console.log('// ❌ "Créer la page" (trop vague)');
  console.log('// ✅ "Créer le composant LoginForm avec validation"');
  console.log('// ✅ "Intégrer l\'API auth au formulaire"');
  console.log('// ✅ "Ajouter la gestion des erreurs UX"');
  console.log('```');
  console.log('');
  console.log('================================================================');
  console.log('💡 INSTRUCTIONS POST-GÉNÉRATION:');
  console.log('1. Copiez le prompt ci-dessus dans GitHub Copilot Chat');
  console.log('2. Copilot va analyser et proposer une décomposition structurée');
  console.log('3. Examinez les nouvelles tâches proposées');
  console.log('4. Ajoutez les nouvelles tâches dans tasks.json');
  console.log('5. Supprimez ou archivez la tâche complexe originale');
  console.log('6. Validez avec: node taskmaster.js validate');
  console.log('7. Régénérez les fichiers: node taskmaster.js regenerate-files');
  console.log('');
  console.log('🎯 OBJECTIF: Remplacer 1 tâche complexe par 3-6 tâches simples et actionables');
  console.log('');
}

// Generate project progress tracking prompt for Copilot
function generateProgressTrackingPrompt() {
  const fs = require('fs');
  const path = require('path');
  
  const TASKS_PATH = path.join(process.cwd(), '.taskmaster', 'tasks.json');
  
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  const totalTasks = data.tasks.length;
  const doneTasks = data.tasks.filter(t => t.status === 'done').length;
  const todoTasks = data.tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = data.tasks.filter(t => t.status === 'in-progress').length;
  
  console.log('\n📊 Prompt GitHub Copilot - Suivi de Progression du Projet');
  console.log('================================================================');
  console.log('');
  console.log('COPIEZ CE PROMPT COMPLET DANS COPILOT CHAT :');
  console.log('');
  console.log('```javascript');
  console.log('// GitHub Copilot: Analysez l\'état actuel du projet et générez un rapport de progression');
  console.log('// Votre rôle: Chef de projet expert en suivi d\'avancement et planification');
  console.log('');
  console.log('// DONNÉES DU PROJET ACTUEL:');
  console.log('const projetActuel = {');
  console.log(`  "meta": ${JSON.stringify(data.meta || {}, null, 4).replace(/^/gm, '  ')},`);
  console.log('  "statistiques": {');
  console.log(`    "totalTaches": ${totalTasks},`);
  console.log(`    "tachesTerminees": ${doneTasks},`);
  console.log(`    "tachesEnCours": ${inProgressTasks},`);
  console.log(`    "tachesRestantes": ${todoTasks},`);
  console.log(`    "progressionPourcentage": ${totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}`);
  console.log('  },');
  console.log('  "taches": [');
  
  data.tasks.forEach((task, index) => {
    console.log('    {');
    console.log(`      "id": ${task.id},`);
    console.log(`      "title": "${task.title}",`);
    console.log(`      "status": "${task.status}",`);
    console.log(`      "priority": "${task.priority || 'medium'}",`);
    console.log(`      "estimation": "${task.estimation || 'Non estimée'}",`);
    console.log(`      "dependencies": [${task.dependencies?.join(', ') || ''}],`);
    console.log(`      "description": "${(task.description || '').substring(0, 100)}${task.description && task.description.length > 100 ? '...' : ''}"`);
    console.log(`    }${index < data.tasks.length - 1 ? ',' : ''}`);
  });
  
  console.log('  ]');
  console.log('};');
  console.log('');
  console.log('// INSTRUCTIONS POUR COPILOT:');
  console.log('// 1. Analysez l\'état actuel du projet ci-dessus');
  console.log('// 2. Identifiez les tâches terminées et leur impact');
  console.log('// 3. Évaluez les tâches restantes et leur priorité');
  console.log('// 4. Générez un rapport de progression complet et actionable');
  console.log('// 5. Proposez des recommandations pour les prochaines étapes');
  console.log('');
  console.log('// STRUCTURE DE SORTIE DEMANDÉE:');
  console.log('const rapportProgression = {');
  console.log('  "metadata": {');
  console.log('    "projectName": "' + (data.meta?.projectName || 'Projet sans nom') + '",');
  console.log('    "reportDate": "' + new Date().toISOString() + '",');
  console.log('    "reportType": "Suivi de progression",');
  console.log('    "generatedBy": "GitHub Copilot + TaskMaster"');
  console.log('  },');
  console.log('  "summary": {');
  console.log('    "currentPhase": "// Copilot: Quelle phase du projet sommes-nous (ex: \'Développement des fondations\')?",');
  console.log('    "overallProgress": "// Copilot: Évaluation globale (ex: \'25% - Fondations en cours\')",');
  console.log('    "momentum": "// Copilot: Rythme actuel (ex: \'Bon rythme\', \'Ralenti\', \'Accéléré\')",');
  console.log('    "blockers": [');
  console.log('      "// Copilot: Listez les blocages actuels identifiés",');
  console.log('      "// Ex: \'Tâche 5 bloque tâches 8 et 9\'"');
  console.log('    ],');
  console.log('    "achievements": [');
  console.log('      "// Copilot: Listez les accomplissements récents",');
  console.log('      "// Ex: \'Configuration initiale terminée avec succès\'"');
  console.log('    ]');
  console.log('  },');
  console.log('  "detailedAnalysis": {');
  console.log('    "completedTasks": {');
  console.log('      "count": ' + doneTasks + ',');
  console.log('      "impact": [');
  console.log('        "// Copilot: Quel impact ont eu les tâches terminées?",');
  console.log('        "// Ex: \'Base de données opérationnelle permet le développement API\'"');
  console.log('      ],');
  console.log('      "lessonsLearned": [');
  console.log('        "// Copilot: Quels enseignements tirer des tâches terminées?",');
  console.log('        "// Ex: \'Estimation de 2h était correcte pour setup Docker\'"');
  console.log('      ]');
  console.log('    },');
  console.log('    "currentTasks": {');
  console.log('      "inProgress": ' + inProgressTasks + ',');
  console.log('      "nextToStart": [');
  console.log('        "// Copilot: Identifiez les 2-3 prochaines tâches prioritaires",');
  console.log('        "// Basé sur les dépendances et la priorité"');
  console.log('      ],');
  console.log('      "estimatedCompletion": "// Copilot: Estimation réaliste pour les tâches en cours"');
  console.log('    },');
  console.log('    "upcomingTasks": {');
  console.log('      "count": ' + todoTasks + ',');
  console.log('      "criticalPath": [');
  console.log('        "// Copilot: Identifiez le chemin critique des tâches restantes",');
  console.log('        "// Quelles tâches bloquent le plus d\'autres tâches?"');
  console.log('      ],');
  console.log('      "riskAssessment": [');
  console.log('        "// Copilot: Identifiez les risques dans les tâches restantes",');
  console.log('        "// Ex: \'Tâche X très complexe, risque de retard\'"');
  console.log('      ]');
  console.log('    }');
  console.log('  },');
  console.log('  "recommendations": {');
  console.log('    "immediate": [');
  console.log('      "// Copilot: Actions à prendre immédiatement (aujourd\'hui/cette semaine)",');
  console.log('      "// Ex: \'Commencer tâche 3 car elle débloque 2 autres tâches\'"');
  console.log('    ],');
  console.log('    "shortTerm": [');
  console.log('      "// Copilot: Actions à planifier (prochaines 2 semaines)",');
  console.log('      "// Ex: \'Prévoir revue architecture avant tâches 10-12\'"');
  console.log('    ],');
  console.log('    "processImprovements": [');
  console.log('      "// Copilot: Suggestions d\'amélioration du processus",');
  console.log('      "// Ex: \'Ajouter plus de détails aux estimations\'"');
  console.log('    ],');
  console.log('    "resourceNeeds": [');
  console.log('      "// Copilot: Besoins en ressources identifiés",');
  console.log('      "// Ex: \'Expertise en sécurité nécessaire pour tâches 15-17\'"');
  console.log('    ]');
  console.log('  },');
  console.log('  "timeline": {');
  console.log('    "milestones": [');
  console.log('      {');
  console.log('        "name": "// Copilot: Nom du prochain jalon important",');
  console.log('        "description": "// Copilot: Ce qui sera accompli",');
  console.log('        "estimatedDate": "// Copilot: Date estimée réaliste",');
  console.log('        "dependentTasks": ["// Copilot: IDs des tâches nécessaires"]');
  console.log('      }');
  console.log('      // Copilot: Ajoutez 2-4 jalons selon la taille du projet');
  console.log('    ],');
  console.log('    "estimatedCompletion": "// Copilot: Date estimée de fin de projet",');
  console.log('    "confidenceLevel": "// Copilot: Niveau de confiance (High/Medium/Low) et pourquoi"');
  console.log('  },');
  console.log('  "metrics": {');
  console.log('    "velocity": "// Copilot: Combien de tâches terminées par semaine en moyenne?",');
  console.log('    "estimationAccuracy": "// Copilot: Les estimations sont-elles réalistes?",');
  console.log('    "bottlenecks": [');
  console.log('      "// Copilot: Identifiez les goulots d\'étranglement du projet"');
  console.log('    ]');
  console.log('  }');
  console.log('};');
  console.log('');
  console.log('// RÈGLES IMPORTANTES POUR COPILOT:');
  console.log('// ✅ Soyez spécifique et actionnable dans vos recommandations');
  console.log('// ✅ Identifiez les vraies priorités basées sur les dépendances');
  console.log('// ✅ Proposez des dates réalistes basées sur la vélocité actuelle');
  console.log('// ✅ Identifiez les risques potentiels de façon proactive');
  console.log('// ✅ Donnez des conseils pratiques d\'amélioration');
  console.log('// ❌ Évitez les généralités vagues comme "continuer le bon travail"');
  console.log('// ❌ Ne proposez pas de dates irréalistes');
  console.log('');
  console.log('// CONTEXTE ADDITIONNEL:');
  console.log('// - Ce rapport sera lu par l\'équipe de développement');
  console.log('// - L\'objectif est de maintenir la motivation et la direction');
  console.log('// - Identifiez les succès pour maintenir le moral');
  console.log('// - Soyez honnête sur les défis sans être pessimiste');
  console.log('```');
  console.log('');
  console.log('================================================================');
  console.log('💡 INSTRUCTIONS POST-GÉNÉRATION:');
  console.log('1. Copiez le prompt ci-dessus dans GitHub Copilot Chat');
  console.log('2. Copilot va analyser l\'état actuel et générer un rapport complet');
  console.log('3. Sauvegardez le rapport dans .taskmaster/progress-report.md');
  console.log('4. Relancez cette commande après chaque lot de tâches terminées');
  console.log('5. Utilisez le rapport pour planifier les prochaines sessions de travail');
  console.log('');
  console.log('📈 FRÉQUENCE RECOMMANDÉE:');
  console.log('- Projet petit (< 20 tâches): Après chaque 3-5 tâches terminées');
  console.log('- Projet moyen (20-50 tâches): Hebdomadaire');
  console.log('- Projet large (> 50 tâches): Toutes les 2 semaines');
  console.log('');
  console.log('🎯 UTILISATION DU RAPPORT:');
  console.log('- Identifier les prochaines priorités');
  console.log('- Anticiper les blocages');
  console.log('- Ajuster les estimations');
  console.log('- Célébrer les progrès accomplis');
  console.log('- Planifier les ressources nécessaires');
  console.log('');
}

// Generate Next.js specific tasks with Copilot integration
function generateNextjsTasksPrompt() {
  const fs = require('fs');
  const path = require('path');
  
  const TASKS_PATH = path.join(process.cwd(), '.taskmaster', 'tasks.json');
  const COPILOT_INSTRUCTIONS_PATH = path.join(process.cwd(), '.taskmaster', 'copilot-instructions.md');
  
  if (!fs.existsSync(TASKS_PATH)) {
    console.error('❌ tasks.json introuvable.');
    return;
  }
  
  let copilotInstructions = '';
  if (fs.existsSync(COPILOT_INSTRUCTIONS_PATH)) {
    copilotInstructions = fs.readFileSync(COPILOT_INSTRUCTIONS_PATH, 'utf-8');
  }
  
  const data = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf-8'));
  
  console.log('\n🚀 Prompt GitHub Copilot - Générateur de Tâches Next.js + Admin');
  console.log('================================================================');
  console.log('');
  console.log('COPIEZ CE PROMPT COMPLET DANS COPILOT CHAT :');
  console.log('');
  console.log('```javascript');
  console.log('// GitHub Copilot: Analysez ce projet Next.js et générez des tâches de développement optimisées');
  console.log('// Votre rôle: Expert Next.js + TaskMaster, spécialisé en architecture admin moderne');
  console.log('');
  console.log('// CONTEXTE DU PROJET:');
  console.log('const projetNextJs = {');
  console.log(`  "meta": ${JSON.stringify(data.meta || {}, null, 4).replace(/^/gm, '  ')},`);
  console.log('  "architecture": "Next.js 14+ avec App Router",');
  console.log('  "technologiesUtilisees": [');
  console.log('    "Next.js 14+ (App Router)",');
  console.log('    "TypeScript",');
  console.log('    "Tailwind CSS", ');
  console.log('    "React Hook Form + Zod",');
  console.log('    "React Query (@tanstack/react-query)",');
  console.log('    "Zustand (state management)",');
  console.log('    "Radix UI (composants)",');
  console.log('    "Architecture Atomic Design"');
  console.log('  ],');
  console.log('  "structureProjet": {');
  console.log('    "app/": "Pages Next.js avec App Router",');
  console.log('    "components/ui/": "Composants réutilisables (Atomic Design)",');
  console.log('    "features/": "Fonctionnalités métier par domaine",');
  console.log('    "shared/": "Utilitaires, services, types partagés",');
  console.log('    "lib/": "Configuration et helpers",');
  console.log('    "hooks/": "Hooks React personnalisés"');
  console.log('  }');
  console.log('};');
  console.log('');
  
  if (copilotInstructions) {
    const instructionsPreview = copilotInstructions.substring(0, 500) + '...';
    console.log('// INSTRUCTIONS COPILOT EXISTANTES (extrait):');
    console.log('const instructionsCopilotExistantes = `');
    console.log(instructionsPreview);
    console.log('`;');
    console.log('');
  }
  
  console.log('// INSTRUCTIONS SPÉCIALISÉES POUR COPILOT:');
  console.log('// 1. Analysez l\'architecture Next.js existante');
  console.log('// 2. Générez des tâches respectant les patterns établis');
  console.log('// 3. Intégrez les bonnes pratiques admin déjà définies');
  console.log('// 4. Créez des tâches atomiques et cohérentes avec l\'écosystème');
  console.log('');
  console.log('// STRUCTURE DE SORTIE OPTIMISÉE:');
  console.log('const tachesNextJsOptimisees = {');
  console.log('  "meta": {');
  console.log('    "projectName": "' + (data.meta?.projectName || 'Projet Next.js') + '",');
  console.log('    "framework": "Next.js 14+ App Router",');
  console.log('    "architecture": "Feature-based + Atomic Design",');
  console.log('    "generatedAt": "' + new Date().toISOString() + '",');
  console.log('    "taskMasterVersion": "1.0.0",');
  console.log('    "copilotOptimized": true');
  console.log('  },');
  console.log('  "tasks": [');
  console.log('    {');
  console.log('      "id": 1,');
  console.log('      "title": "// Copilot: Première tâche (ex: Configuration TypeScript stricte)",');
  console.log('      "description": "// Copilot: Description adaptée à Next.js",');
  console.log('      "status": "todo",');
  console.log('      "priority": "high", // high|medium|low');
  console.log('      "dependencies": [],');
  console.log('      "estimation": "// Copilot: 1-6 heures selon complexité",');
  console.log('      "framework": "nextjs",');
  console.log('      "category": "// Copilot: setup|feature|component|page|api|admin|testing|deployment",');
  console.log('      "files": [');
  console.log('        "// Copilot: Liste des fichiers à créer/modifier (ex: app/layout.tsx, tsconfig.json)"');
  console.log('      ],');
  console.log('      "details": `');
  console.log('        // Copilot: Instructions Next.js spécifiques:');
  console.log('        // 1. Respecter l\'App Router (app/ directory)');
  console.log('        // 2. Utiliser TypeScript strict et Zod pour validation');
  console.log('        // 3. Suivre les patterns de l\'architecture existante');
  console.log('        // 4. Intégrer avec React Query pour la gestion d\'état');
  console.log('        // 5. Appliquer les principes Atomic Design');
  console.log('      `,');
  console.log('      "testStrategy": "// Copilot: Tests Next.js (Jest, Testing Library, E2E)",');
  console.log('      "deliverable": "// Copilot: Livrable concret (composant, page, API route, etc.)",');
  console.log('      "nextjsSpecific": {');
  console.log('        "appRouterPattern": "// Copilot: app/[...] ou pages/api/[...]",');
  console.log('        "componentType": "// Copilot: client|server|shared",');
  console.log('        "dataFetching": "// Copilot: SSR|SSG|CSR|ISR selon besoin",');
  console.log('        "apiIntegration": "// Copilot: Route API, middleware, validation"');
  console.log('      },');
  console.log('      "adminFeature": {');
  console.log('        "isAdminRelated": "// Copilot: true si lié à l\'admin",');
  console.log('        "entityName": "// Copilot: Nom de l\'entité admin si applicable",');
  console.log('        "crudOperations": ["// Copilot: create, read, update, delete selon besoin"],');
  console.log('        "requiresAuth": "// Copilot: true si authentification nécessaire"');
  console.log('      },');
  console.log('      "copilotTips": [');
  console.log('        "// Copilot: Conseils spécifiques pour cette tâche",');
  console.log('        "// Ex: Utiliser createField.relation() pour les champs de relation",');
  console.log('        "// Ex: Respecter les conventions de nommage kebab-case/PascalCase"');
  console.log('      ],');
  console.log('      "subtasks": [');
  console.log('        {');
  console.log('          "id": "1.1",');
  console.log('          "title": "// Copilot: Sous-tâche Next.js atomique",');
  console.log('          "description": "// Copilot: Action spécifique",');
  console.log('          "fileToCreate": "// Copilot: Chemin exact du fichier",');
  console.log('          "dependencies": [],');
  console.log('          "estimationMinutes": "// Copilot: 15-120 minutes max",');
  console.log('          "copilotPrompt": "// Copilot: Prompt suggéré pour cette sous-tâche"');
  console.log('        }');
  console.log('      ]');
  console.log('    },');
  console.log('    {');
  console.log('      "id": 2,');
  console.log('      "title": "// Copilot: Exemple - Créer entité admin Product",');
  console.log('      "description": "Générer une entité admin complète avec CRUD",');
  console.log('      "status": "todo",');
  console.log('      "priority": "medium",');
  console.log('      "dependencies": [1],');
  console.log('      "estimation": "3-4 heures",');
  console.log('      "framework": "nextjs",');
  console.log('      "category": "admin",');
  console.log('      "files": [');
  console.log('        "features/product/product.schema.ts",');
  console.log('        "features/product/product.mock.ts",');
  console.log('        "features/product/product.service.ts",');
  console.log('        "features/product/product.admin-config.ts",');
  console.log('        "app/(admin)/admin/product/page.tsx"');
  console.log('      ],');
  console.log('      "details": `');
  console.log('        1. Créer le schéma Zod avec validation stricte');
  console.log('        2. Générer les données mock avec createEnhancedMockService');
  console.log('        3. Configurer le service API avec BaseService');
  console.log('        4. Créer la config admin avec SimpleAdminPage');
  console.log('        5. Ajouter la page admin dans app/(admin)/admin/');
  console.log('        6. Enregistrer dans features/admin-entities.ts');
  console.log('      `,');
  console.log('      "adminFeature": {');
  console.log('        "isAdminRelated": true,');
  console.log('        "entityName": "product",');
  console.log('        "crudOperations": ["create", "read", "update", "delete"],');
  console.log('        "requiresAuth": true');
  console.log('      },');
  console.log('      "nextjsSpecific": {');
  console.log('        "appRouterPattern": "app/(admin)/admin/product/page.tsx",');
  console.log('        "componentType": "client",');
  console.log('        "dataFetching": "CSR avec React Query"');
  console.log('      }');
  console.log('    }');
  console.log('    // Copilot: Continuez avec des tâches similaires selon le contexte du projet');
  console.log('  ],');
  console.log('  "lastId": "// Copilot: Dernier ID utilisé"');
  console.log('};');
  console.log('');
  console.log('// RÈGLES SPÉCIFIQUES NEXT.JS + ADMIN:');
  console.log('// ✅ STRUCTURE: Respecter l\'architecture features/ + app/ + shared/');
  console.log('// ✅ TYPESCRIPT: Utiliser Zod pour tous les schémas et validations');
  console.log('// ✅ COMPOSANTS: "use client" obligatoire pour composants interactifs');
  console.log('// ✅ ADMIN: Utiliser SimpleAdminPage + createAdminEntity pour toute entité CRUD');
  console.log('// ✅ API: BaseService pour les appels, hooks React Query pour le cache');
  console.log('// ✅ FORMS: React Hook Form + Zod, jamais de fetch direct dans composants');
  console.log('// ✅ STYLES: Tailwind CSS, composants Radix UI, design system cohérent');
  console.log('// ✅ TESTS: Jest + Testing Library, tests unitaires ET e2e');
  console.log('// ❌ ÉVITER: fetch direct, composants sans types, props any, API calls dans UI');
  console.log('');
  console.log('// PATTERNS DE TÂCHES RECOMMANDÉS:');
  console.log('// 1. SETUP: Configuration, types, utilitaires de base');
  console.log('// 2. ENTITIES: Création d\'entités admin avec schéma + service + config');
  console.log('// 3. PAGES: Pages Next.js avec App Router, layouts, navigation');
  console.log('// 4. COMPONENTS: Composants réutilisables suivant Atomic Design');
  console.log('// 5. INTEGRATION: APIs, auth, middleware, validation');
  console.log('// 6. TESTING: Tests unitaires, intégration, e2e');
  console.log('// 7. DEPLOYMENT: Build, optimisation, CI/CD');
  console.log('');
  console.log('// CATÉGORIES DE TÂCHES:');
  console.log('// - "setup": Configuration initiale, outils, types de base');
  console.log('// - "admin": Entités admin, CRUD, tableaux, formulaires');
  console.log('// - "page": Pages Next.js, layouts, navigation, SEO');
  console.log('// - "component": Composants UI réutilisables, design system');
  console.log('// - "api": Routes API, middleware, validation, auth');
  console.log('// - "feature": Fonctionnalités métier complexes');
  console.log('// - "testing": Tests, mocks, fixtures');
  console.log('// - "deployment": Build, CI/CD, optimisation');
  console.log('```');
  console.log('');
  console.log('================================================================');
  console.log('💡 INSTRUCTIONS POST-GÉNÉRATION:');
  console.log('1. Copiez le prompt ci-dessus dans GitHub Copilot Chat');
  console.log('2. Copilot va analyser votre architecture Next.js et générer des tâches optimisées');
  console.log('3. Les tâches respecteront vos patterns existants (features/, admin, etc.)');
  console.log('4. Sauvegardez le résultat dans .taskmaster/tasks.json');
  console.log('5. Utilisez: node taskmaster.js validate');
  console.log('6. Générez les fichiers: node taskmaster.js generate-all-files');
  console.log('');
  console.log('🎯 AVANTAGES DE CETTE INTÉGRATION:');
  console.log('- Tâches spécifiquement adaptées à votre architecture Next.js');
  console.log('- Respect des patterns admin existants (SimpleAdminPage, etc.)');
  console.log('- Instructions Copilot intégrées dans chaque tâche');
  console.log('- Catégorisation et estimation optimisées pour Next.js');
  console.log('- Suivi des fichiers à créer/modifier par tâche');
  console.log('- Validation automatique de la cohérence architecture');
  console.log('');
  console.log('🚀 WORKFLOW RECOMMANDÉ:');
  console.log('1. Générer les tâches avec ce prompt');
  console.log('2. Analyser chaque tâche: node taskmaster.js analyze-complexity <id>');
  console.log('3. Décomposer si nécessaire: node taskmaster.js breakdown <id>');
  console.log('4. Développer avec: node taskmaster.js next + vos instructions Copilot');
  console.log('5. Suivre progression: node taskmaster.js progress-report');
  console.log('');
}

module.exports = {
  scanForExternalTaskFiles,
  getExternalTagsFromFiles,
  readExternalTagData,
  getAvailableTags,
  generatePrdWithCopilot,
  generateTasksWithCopilot,
  generateSubtasksWithCopilot,
  generateTaskTemplateWithCopilot,
  showCopilotInstructions,
  analyzeTaskComplexity,
  generateTaskBreakdownPrompt,
  generateProgressTrackingPrompt,
  generateNextjsTasksPrompt
};
