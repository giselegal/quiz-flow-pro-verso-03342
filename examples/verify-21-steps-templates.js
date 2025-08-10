#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 VERIFICAÇÃO DOS 21 TEMPLATES DE ETAPAS\n");

// Lista dos arquivos que devem existir
const expectedFiles = [
  "Step01Template.tsx",
  "Step02Template.tsx",
  "Step03Template.tsx",
  "Step04Template.tsx",
  "Step05Template.tsx",
  "Step06Template.tsx",
  "Step07Template.tsx",
  "Step08Template.tsx",
  "Step09Template.tsx",
  "Step10Template.tsx",
  "Step11Template.tsx",
  "Step12Template.tsx",
  "Step13Template.tsx",
  "Step14Template.tsx",
  "Step15Template.tsx",
  "Step16Template.tsx",
  "Step17Template.tsx",
  "Step18Template.tsx",
  "Step19Template.tsx",
  "Step20Template.tsx",
  "Step21Template.tsx",
];

const stepsDir = path.join(__dirname, "src/components/steps");

// Verificar arquivos existentes
console.log("📁 Verificando arquivos existentes:");
const existingFiles = [];
const missingFiles = [];

expectedFiles.forEach(file => {
  const filePath = path.join(stepsDir, file);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
    console.log(`✅ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`❌ ${file} - FALTANDO`);
  }
});

console.log(`\n📊 RESUMO: ${existingFiles.length}/21 arquivos encontrados\n`);

// Verificar conteúdo dos arquivos existentes
console.log("🔍 Analisando conteúdo dos templates existentes:\n");

const templateData = {};

existingFiles.forEach(file => {
  const filePath = path.join(stepsDir, file);
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Extrair informações básicas
    const hasTemplate = content.includes("Template") || content.includes("getStep");
    const hasImages = content.includes("cloudinary") || content.includes("https://");
    const hasProps = content.includes("Props") || content.includes("interface");
    const hasExport = content.includes("export");
    const lineCount = content.split("\n").length;

    // Contar blocos de componentes
    const blockMatches = content.match(/{\s*id:/g);
    const blockCount = blockMatches ? blockMatches.length : 0;

    templateData[file] = {
      hasTemplate,
      hasImages,
      hasProps,
      hasExport,
      lineCount,
      blockCount,
      content: content.substring(0, 200) + "...",
    };

    const status = hasTemplate && hasImages && hasProps ? "✅" : "⚠️";
    console.log(`${status} ${file}:`);
    console.log(`   📏 ${lineCount} linhas`);
    console.log(`   🧩 ${blockCount} blocos`);
    console.log(`   ${hasTemplate ? "✅" : "❌"} Template function`);
    console.log(`   ${hasImages ? "✅" : "❌"} Imagens`);
    console.log(`   ${hasProps ? "✅" : "❌"} Props/Interface`);
    console.log("");
  } catch (error) {
    console.log(`❌ ${file}: Erro ao ler arquivo - ${error.message}`);
  }
});

// Verificar se Step20Result.tsx existe
const step20ResultPath = path.join(stepsDir, "Step20Result.tsx");
console.log("🎯 Verificando arquivo especial Step20Result.tsx:");
if (fs.existsSync(step20ResultPath)) {
  console.log("✅ Step20Result.tsx encontrado");
  try {
    const content = fs.readFileSync(step20ResultPath, "utf8");
    console.log(`   📏 ${content.split("\n").length} linhas`);
    console.log(`   ${content.includes("Result") ? "✅" : "❌"} Componente Result`);
  } catch (error) {
    console.log(`❌ Erro ao ler Step20Result.tsx: ${error.message}`);
  }
} else {
  console.log("❌ Step20Result.tsx NÃO ENCONTRADO");
}

console.log("\n" + "=".repeat(60));
console.log("📋 RELATÓRIO FINAL:");
console.log(`✅ Arquivos existentes: ${existingFiles.length}/21`);
console.log(`❌ Arquivos faltando: ${missingFiles.length}/21`);

if (missingFiles.length > 0) {
  console.log("\n🚨 ARQUIVOS FALTANDO:");
  missingFiles.forEach(file => console.log(`   - ${file}`));
}

// Análise de qualidade dos templates
const completeTemplates = Object.entries(templateData).filter(
  ([file, data]) => data.hasTemplate && data.hasImages && data.hasProps && data.blockCount > 0
);

const incompleteTemplates = Object.entries(templateData).filter(
  ([file, data]) => !data.hasTemplate || !data.hasImages || !data.hasProps || data.blockCount === 0
);

console.log(`\n✅ Templates completos: ${completeTemplates.length}`);
console.log(`⚠️ Templates incompletos: ${incompleteTemplates.length}`);

if (incompleteTemplates.length > 0) {
  console.log("\n🔧 TEMPLATES QUE PRECISAM DE CORREÇÃO:");
  incompleteTemplates.forEach(([file, data]) => {
    console.log(`   📝 ${file}:`);
    if (!data.hasTemplate) console.log(`      - Falta função template`);
    if (!data.hasImages) console.log(`      - Falta imagens`);
    if (!data.hasProps) console.log(`      - Falta props/interface`);
    if (data.blockCount === 0) console.log(`      - Falta blocos de componentes`);
  });
}

console.log(
  "\n🎯 PRÓXIMA AÇÃO: " +
    (missingFiles.length > 0 || incompleteTemplates.length > 0
      ? "Criar/corrigir templates faltantes ou incompletos"
      : "Todos os templates estão completos!")
);
