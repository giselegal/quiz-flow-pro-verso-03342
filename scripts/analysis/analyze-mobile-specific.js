#!/usr/bin/env node

import fs from "fs";
import path from "path";

console.log("📱 ANÁLISE MOBILE - StyleResultCardBlock & ResultCTABlock\n");

const componentsDir = "/workspaces/quiz-quest-challenge-verse/client/src/components/editor/blocks";

// Componentes a analisar
const componentsToAnalyze = ["StyleResultCardBlock.tsx", "ResultCTABlock.tsx"];

// Problemas específicos para mobile
const mobileIssues = [
  {
    pattern: /grid.*md:grid-cols-[3-9]/g,
    description: "3+ colunas em desktop sem breakpoint mobile",
    severity: "critical",
  },
  {
    pattern: /max-w-\[200px\]/g,
    description: "Largura fixa pequena pode quebrar em mobile",
    severity: "high",
  },
  {
    pattern: /text-3xl|text-4xl/g,
    description: "Texto muito grande para mobile",
    severity: "medium",
  },
  {
    pattern: /p-8|py-8|px-8/g,
    description: "Padding grande pode prejudicar mobile",
    severity: "medium",
  },
  {
    pattern: /space-x-4|gap-8/g,
    description: "Espaçamento fixo sem responsividade",
    severity: "medium",
  },
  {
    pattern: /w-\[200px\]|h-\[200px\]/g,
    description: "Dimensões fixas problemáticas",
    severity: "high",
  },
  {
    pattern: /(?<!md:|lg:|xl:|sm:)grid-cols-[2-9]/g,
    description: "Grid sem breakpoint responsivo",
    severity: "high",
  },
];

// Padrões positivos para mobile
const mobilePositivePatterns = [
  /(?:sm|md|lg|xl):/g,
  /flex.*flex-col/g,
  /w-full/g,
  /max-w-xs|max-w-sm/g,
];

function analyzeMobileResponsiveness(filePath, componentName) {
  if (!fs.existsSync(filePath)) {
    return {
      name: componentName,
      exists: false,
      score: 0,
      issues: ["Arquivo não encontrado"],
    };
  }

  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];
  let score = 100;

  console.log(`📱 Analisando ${componentName}:`);
  console.log("==================================================");

  // Verificar problemas mobile
  mobileIssues.forEach(issue => {
    const matches = content.match(issue.pattern) || [];
    if (matches.length > 0) {
      const penalty = issue.severity === "critical" ? 25 : issue.severity === "high" ? 15 : 10;
      score -= penalty * matches.length;
      issues.push(`${issue.description}: ${matches.length} ocorrência(s)`);

      console.log(`❌ ${issue.description}`);
      console.log(
        `   Ocorrências: ${matches.slice(0, 3).join(", ")}${matches.length > 3 ? "..." : ""}`
      );
      console.log(`   Penalidade: -${penalty * matches.length} pontos`);
    }
  });

  // Verificar padrões positivos
  let positiveScore = 0;
  mobilePositivePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    positiveScore += matches.length;
  });

  score += Math.min(20, positiveScore * 2); // Máximo 20 pontos bonus

  score = Math.max(0, Math.min(100, score));

  console.log(`\n📊 PROBLEMAS ESPECÍFICOS IDENTIFICADOS:`);

  // Verificar layout horizontal problemático
  if (content.includes("md:grid-cols-3") && !content.includes("grid-cols-1")) {
    console.log(`🔴 CRÍTICO: Layout 3 colunas sem versão mobile`);
    console.log(`   ⚠️  Vai quebrar em telas pequenas!`);
  }

  // Verificar textos grandes
  if (content.includes("text-3xl") || content.includes("text-4xl")) {
    console.log(`🟠 MÉDIO: Textos grandes sem responsividade`);
    console.log(`   💡 Recomendação: text-xl md:text-3xl`);
  }

  // Verificar imagens fixas
  if (content.includes("max-w-[200px]")) {
    console.log(`🟠 MÉDIO: Imagens com largura fixa`);
    console.log(`   💡 Recomendação: max-w-[150px] md:max-w-[200px]`);
  }

  // Verificar padding excessivo
  if (content.includes("p-8") || content.includes("py-8") || content.includes("px-8")) {
    console.log(`🟡 BAIXO: Padding grande pode ser excessivo no mobile`);
    console.log(`   💡 Recomendação: p-4 md:p-8`);
  }

  console.log(`\n✅ PADRÕES POSITIVOS ENCONTRADOS:`);

  if (content.includes("w-full")) {
    console.log(`   ✓ Largura total (w-full)`);
  }

  if (content.includes("flex-col")) {
    console.log(`   ✓ Layout vertical (flex-col)`);
  }

  const responsiveMatches = content.match(/(?:sm|md|lg|xl):/g) || [];
  if (responsiveMatches.length > 0) {
    console.log(`   ✓ Breakpoints responsivos: ${responsiveMatches.length} encontrados`);
  }

  console.log(`\n🎯 SCORE FINAL: ${score}/100`);

  const emoji = score >= 80 ? "🟢" : score >= 60 ? "🟡" : score >= 40 ? "🟠" : "🔴";
  const status =
    score >= 80 ? "EXCELENTE" : score >= 60 ? "BOM" : score >= 40 ? "REGULAR" : "CRÍTICO";

  console.log(`${emoji} Status: ${status}`);
  console.log("");

  return {
    name: componentName,
    exists: true,
    score: score,
    issues: issues,
    status: status,
  };
}

console.log("🎯 INICIANDO ANÁLISE MOBILE...\n");

const results = [];

componentsToAnalyze.forEach(component => {
  const filePath = path.join(componentsDir, component);
  const componentName = component.replace(".tsx", "");
  const result = analyzeMobileResponsiveness(filePath, componentName);
  results.push(result);
});

console.log("📋 RESUMO GERAL");
console.log("==================================================");

const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
console.log(`📊 Score médio: ${Math.round(avgScore)}/100`);

const criticalComponents = results.filter(r => r.score < 40);
const needsImprovement = results.filter(r => r.score >= 40 && r.score < 80);
const goodComponents = results.filter(r => r.score >= 80);

console.log(`🔴 Componentes críticos: ${criticalComponents.length}`);
console.log(`🟠 Precisam melhorar: ${needsImprovement.length}`);
console.log(`🟢 Componentes bons: ${goodComponents.length}`);

console.log("\n🛠️  RECOMENDAÇÕES DE CORREÇÃO:");
console.log("==================================================");

if (criticalComponents.length > 0 || needsImprovement.length > 0) {
  console.log("1. 📱 Para StyleResultCardBlock:");
  console.log("   • Mudar md:grid-cols-3 para grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
  console.log(
    "   • Adicionar breakpoints para imagens: max-w-[120px] sm:max-w-[150px] md:max-w-[200px]"
  );
  console.log("   • Responsividade de padding: p-4 md:p-6");
  console.log("   • Texto responsivo: text-xl md:text-2xl");

  console.log("\n2. 📱 Para ResultCTABlock:");
  console.log("   • Alterar md:grid-cols-2 para grid-cols-1 md:grid-cols-2");
  console.log("   • Reduzir padding: p-4 md:p-8");
  console.log("   • Texto do título: text-2xl md:text-3xl");
  console.log("   • Espaçamento responsivo: space-y-4 md:space-x-4");

  console.log("\n3. 🎯 Padrões gerais:");
  console.log("   • Sempre usar grid-cols-1 como base");
  console.log("   • Implementar mobile-first approach");
  console.log("   • Testar em 375px (iPhone) e 360px (Android)");
}

console.log("\n🏁 ANÁLISE MOBILE CONCLUÍDA!");
