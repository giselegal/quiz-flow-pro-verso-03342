#!/usr/bin/env node

/**
 * 🔍 ANÁLISE COMPLETA: DUPLICIDADE DE STEPS NO PROJETO
 *
 * Este script vai identificar:
 * 1. Steps ativos (principais)
 * 2. Steps duplicados (backups, versões antigas)
 * 3. Steps órfãos (sem referência)
 * 4. Conflitos potenciais
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 ANÁLISE DE DUPLICIDADE DE STEPS NO PROJETO\n");

// Função para categorizar arquivos
function categorizeStepFiles() {
  const stepFiles = {
    active: [], // Templates ativos principais
    backups: [], // Arquivos de backup
    old: [], // Versões antigas (_OLD, _NEW)
    orphan: [], // Steps isolados
    duplicates: [], // Possíveis duplicatas
  };

  // Buscar todos os arquivos relacionados a Step
  const directories = [
    "./src/components/steps/",
    "./src/components/editor/steps/",
    "./backup/",
    "./backup-cleanup-2025-08-06T19-17-41-611Z/",
    "./backup_duplicated_20250806_134328/",
    "./backup_editor_blocks_inline_20250806_133020/",
  ];

  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir, { recursive: true });
        files.forEach(file => {
          const fullPath = path.join(dir, file);

          if (typeof file === "string" && file.includes("Step") && file.endsWith(".tsx")) {
            const relativePath = fullPath.replace("./src/components/", "");

            // Categorizar arquivo
            if (file.includes(".backup") || dir.includes("backup")) {
              stepFiles.backups.push(fullPath);
            } else if (file.includes("_OLD") || file.includes("_NEW")) {
              stepFiles.old.push(fullPath);
            } else if (dir === "./src/components/steps/") {
              stepFiles.active.push(fullPath);
            } else {
              stepFiles.orphan.push(fullPath);
            }
          }
        });
      } catch (error) {
        // Pasta não existe ou inacessível
      }
    }
  });

  return stepFiles;
}

// Analisar templates ativos
function analyzeActiveTemplates() {
  const activeDir = "./src/components/steps/";
  const activeFiles = [];

  if (fs.existsSync(activeDir)) {
    const files = fs.readdirSync(activeDir);

    files.forEach(file => {
      if (file.endsWith(".tsx") && file.includes("Template") && !file.includes(".backup")) {
        const stepNumber = file.match(/Step(\d+)Template/);
        if (stepNumber) {
          activeFiles.push({
            file: file,
            path: path.join(activeDir, file),
            stepNumber: parseInt(stepNumber[1]),
            size: fs.statSync(path.join(activeDir, file)).size,
          });
        }
      }
    });
  }

  return activeFiles.sort((a, b) => a.stepNumber - b.stepNumber);
}

// Verificar se todos os steps 1-21 existem
function checkCompletenessSteps(activeFiles) {
  const expectedSteps = Array.from({ length: 21 }, (_, i) => i + 1);
  const existingSteps = activeFiles.map(f => f.stepNumber);

  const missing = expectedSteps.filter(step => !existingSteps.includes(step));
  const extras = existingSteps.filter(step => !expectedSteps.includes(step));

  return { missing, extras, complete: missing.length === 0 && extras.length === 0 };
}

// Executar análise
const stepFiles = categorizeStepFiles();
const activeTemplates = analyzeActiveTemplates();
const completeness = checkCompletenessSteps(activeTemplates);

console.log("📊 RESULTADO DA ANÁLISE:\n");

// 1. Templates Ativos
console.log("✅ TEMPLATES ATIVOS (src/components/steps/):");
console.log(`   Total: ${activeTemplates.length} arquivos`);
activeTemplates.forEach(template => {
  const sizeKB = (template.size / 1024).toFixed(1);
  console.log(
    `   Step${template.stepNumber.toString().padStart(2, "0")} - ${template.file} (${sizeKB}KB)`
  );
});

// 2. Completude dos Steps
console.log(`\n🎯 COMPLETUDE DOS STEPS (1-21):`);
console.log(`   ✅ Completo: ${completeness.complete ? "SIM" : "NÃO"}`);
if (completeness.missing.length > 0) {
  console.log(`   ❌ Faltando: Step${completeness.missing.join(", Step")}`);
}
if (completeness.extras.length > 0) {
  console.log(`   ⚠️  Extras: Step${completeness.extras.join(", Step")}`);
}

// 3. Arquivos de Backup
console.log(`\n📦 ARQUIVOS DE BACKUP:`);
console.log(`   Total: ${stepFiles.backups.length} arquivos`);
if (stepFiles.backups.length > 0) {
  const backupsByDir = {};
  stepFiles.backups.forEach(backup => {
    const dir = backup.split("/").slice(0, -1).join("/");
    if (!backupsByDir[dir]) backupsByDir[dir] = [];
    backupsByDir[dir].push(path.basename(backup));
  });

  Object.keys(backupsByDir).forEach(dir => {
    console.log(`   📁 ${dir}: ${backupsByDir[dir].length} arquivos`);
  });
}

// 4. Versões Antigas
console.log(`\n🗂️  VERSÕES ANTIGAS (_OLD, _NEW):`);
console.log(`   Total: ${stepFiles.old.length} arquivos`);
stepFiles.old.forEach(oldFile => {
  console.log(`   📄 ${oldFile}`);
});

// 5. Steps Órfãos
console.log(`\n👻 STEPS ÓRFÃOS (outras pastas):`);
console.log(`   Total: ${stepFiles.orphan.length} arquivos`);
stepFiles.orphan.forEach(orphan => {
  console.log(`   📄 ${orphan}`);
});

// 6. Possíveis Duplicatas
const duplicateAnalysis = activeTemplates.filter(template => {
  const baseName = template.file.replace(".tsx", "");
  const possibleDuplicates = stepFiles.backups.filter(
    backup =>
      backup.includes(baseName) ||
      backup.includes(`Step${template.stepNumber.toString().padStart(2, "0")}`)
  );
  return possibleDuplicates.length > 0;
});

console.log(`\n⚠️  ANÁLISE DE DUPLICATAS:`);
console.log(`   Templates com possíveis duplicatas: ${duplicateAnalysis.length}`);

// 7. Recomendações
console.log(`\n🎯 RECOMENDAÇÕES:\n`);

if (completeness.complete) {
  console.log("✅ SISTEMA COMPLETO: Todos os 21 steps estão presentes");
} else {
  console.log("❌ SISTEMA INCOMPLETO: Alguns steps estão faltando");
}

console.log(`📦 LIMPEZA RECOMENDADA:`);
console.log(`   - ${stepFiles.backups.length} arquivos de backup podem ser removidos`);
console.log(`   - ${stepFiles.old.length} versões antigas podem ser removidas`);
console.log(`   - ${stepFiles.orphan.length} steps órfãos precisam de revisão`);

const totalFiles =
  stepFiles.active.length +
  stepFiles.backups.length +
  stepFiles.old.length +
  stepFiles.orphan.length;
const cleanupPotential = stepFiles.backups.length + stepFiles.old.length + stepFiles.orphan.length;
const cleanupPercentage = ((cleanupPotential / totalFiles) * 100).toFixed(1);

console.log(`\n📊 ESTATÍSTICAS FINAIS:`);
console.log(`   Total de arquivos Step*: ${totalFiles}`);
console.log(`   Arquivos ativos: ${stepFiles.active.length}`);
console.log(`   Potencial de limpeza: ${cleanupPotential} arquivos (${cleanupPercentage}%)`);

console.log(
  `\n✅ CONCLUSÃO: ${completeness.complete ? "Sistema funcional com muitos backups" : "Sistema incompleto - verificar steps faltantes"}`
);
