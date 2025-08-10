#!/usr/bin/env node

/**
 * 🧪 TESTE PRÁTICO: PAINEL DE PROPRIEDADES
 *
 * Este script testa se os componentes realmente funcionam no painel de propriedades
 * Verifica:
 * 1. Se o componente tem implementação correta
 * 2. Se onPropertyChange está implementado
 * 3. Se as propriedades estão sendo processadas
 * 4. Se há problemas na integração
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 TESTE PRÁTICO: PAINEL DE PROPRIEDADES REAL");
console.log("===============================================");

// Lista dos componentes que deveriam estar 100% funcionais
const componentesToTest = [
  "text-inline",
  "heading-inline",
  "image-display-inline",
  "quiz-intro-header",
  "form-input",
  "button-inline",
  "decorative-bar-inline",
  "legal-notice-inline",
  "options-grid",
];

// Função para verificar implementação real do componente
function testComponentImplementation(componentType) {
  console.log(`\\n🔍 TESTANDO: ${componentType}`);
  console.log("----------------------------------------");

  let issues = [];
  let score = 0;

  // 1. Verificar se tem case no useUnifiedProperties
  try {
    const propertiesPath = "src/hooks/useUnifiedProperties.ts";
    const propertiesContent = fs.readFileSync(propertiesPath, "utf8");

    const hasCase = propertiesContent.includes(`case "${componentType}":`);
    if (hasCase) {
      console.log("✅ Case no useUnifiedProperties: ENCONTRADO");
      score += 2;
    } else {
      console.log("❌ Case no useUnifiedProperties: NÃO ENCONTRADO");
      issues.push("Faltando case no useUnifiedProperties");
    }

    // Verificar se o case tem baseProperties
    if (hasCase) {
      const caseRegex = new RegExp(
        `case "${componentType}":[\\s\\S]*?return \\[[\\s\\S]*?baseProperties[\\s\\S]*?\\];`,
        "g"
      );
      const caseMatch = propertiesContent.match(caseRegex);
      if (caseMatch) {
        console.log("✅ BaseProperties incluídas: SIM");
        score += 1;
      } else {
        console.log("⚠️ BaseProperties incluídas: NÃO DETECTADO");
        issues.push("BaseProperties podem não estar incluídas");
      }
    }
  } catch (error) {
    console.log("❌ Erro ao verificar useUnifiedProperties:", error.message);
    issues.push("Erro ao verificar properties schema");
  }

  // 2. Verificar implementação do componente
  const possiblePaths = [
    `src/components/editor/blocks/${getComponentFileName(componentType)}.tsx`,
    `src/components/blocks/inline/${getComponentFileName(componentType)}.tsx`,
  ];

  let componentFound = false;
  for (const componentPath of possiblePaths) {
    if (fs.existsSync(componentPath)) {
      componentFound = true;
      try {
        const componentContent = fs.readFileSync(componentPath, "utf8");

        // Verificar BlockComponentProps
        if (componentContent.includes("BlockComponentProps")) {
          console.log("✅ BlockComponentProps: IMPLEMENTADO");
          score += 2;
        } else {
          console.log("❌ BlockComponentProps: NÃO IMPLEMENTADO");
          issues.push("Não implementa BlockComponentProps");
        }

        // Verificar onPropertyChange
        if (componentContent.includes("onPropertyChange")) {
          console.log("✅ onPropertyChange: PRESENTE");
          score += 2;

          // Verificar se está sendo usado
          if (componentContent.includes("onPropertyChange(")) {
            console.log("✅ onPropertyChange: SENDO USADO");
            score += 1;
          } else {
            console.log("⚠️ onPropertyChange: NÃO ESTÁ SENDO USADO");
            issues.push("onPropertyChange presente mas não usado");
          }
        } else {
          console.log("❌ onPropertyChange: AUSENTE");
          issues.push("onPropertyChange não implementado");
        }

        // Verificar destructuring de propriedades
        if (componentContent.includes("block?.properties")) {
          console.log("✅ Destructuring properties: SIM");
          score += 1;
        } else {
          console.log("⚠️ Destructuring properties: NÃO DETECTADO");
          issues.push("Pode não estar usando block.properties corretamente");
        }

        console.log(`📁 Arquivo encontrado: ${componentPath}`);
        break;
      } catch (error) {
        console.log("❌ Erro ao ler componente:", error.message);
        issues.push("Erro ao ler arquivo do componente");
      }
    }
  }

  if (!componentFound) {
    console.log("❌ Arquivo do componente: NÃO ENCONTRADO");
    issues.push("Arquivo do componente não encontrado");
  }

  // 3. Verificar registro no ENHANCED_BLOCK_REGISTRY
  try {
    const registryPath = "src/config/enhancedBlockRegistry.ts";
    const registryContent = fs.readFileSync(registryPath, "utf8");

    if (registryContent.includes(`"${componentType}":`)) {
      console.log("✅ Registro no ENHANCED_BLOCK_REGISTRY: SIM");
      score += 1;
    } else {
      console.log("❌ Registro no ENHANCED_BLOCK_REGISTRY: NÃO");
      issues.push("Não registrado no ENHANCED_BLOCK_REGISTRY");
    }
  } catch (error) {
    console.log("❌ Erro ao verificar registry:", error.message);
    issues.push("Erro ao verificar registry");
  }

  // Calcular status final
  const maxScore = 9; // Pontuação máxima possível
  const percentage = Math.round((score / maxScore) * 100);

  console.log(`\\n📊 SCORE: ${score}/${maxScore} (${percentage}%)`);

  let status;
  if (percentage >= 80) {
    status = "🎯 FUNCIONANDO";
  } else if (percentage >= 60) {
    status = "⚠️ PARCIAL";
  } else {
    status = "❌ QUEBRADO";
  }

  console.log(`📋 STATUS: ${status}`);

  if (issues.length > 0) {
    console.log("⚠️ PROBLEMAS ENCONTRADOS:");
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
  }

  return {
    componentType,
    score,
    maxScore,
    percentage,
    status,
    issues,
  };
}

// Função para converter tipo de componente em nome de arquivo
function getComponentFileName(componentType) {
  // Converter kebab-case para PascalCase
  return (
    componentType
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join("") + "Block"
  );
}

// Executar testes
async function runTests() {
  const results = [];

  for (const componentType of componentesToTest) {
    const result = testComponentImplementation(componentType);
    results.push(result);
  }

  // Relatório final
  console.log("\\n\\n📈 RELATÓRIO FINAL");
  console.log("==================");

  const functioning = results.filter(r => r.percentage >= 80);
  const partial = results.filter(r => r.percentage >= 60 && r.percentage < 80);
  const broken = results.filter(r => r.percentage < 60);

  console.log(`✅ FUNCIONANDO (≥80%): ${functioning.length} componentes`);
  functioning.forEach(r => console.log(`   - ${r.componentType} (${r.percentage}%)`));

  console.log(`⚠️ PARCIAL (60-79%): ${partial.length} componentes`);
  partial.forEach(r => console.log(`   - ${r.componentType} (${r.percentage}%)`));

  console.log(`❌ QUEBRADO (<60%): ${broken.length} componentes`);
  broken.forEach(r => console.log(`   - ${r.componentType} (${r.percentage}%)`));

  const totalScore = results.reduce((sum, r) => sum + r.percentage, 0);
  const averageScore = Math.round(totalScore / results.length);

  console.log(`\\n🎯 MÉDIA GERAL: ${averageScore}%`);

  if (averageScore >= 80) {
    console.log("🎉 PAINEL FUNCIONANDO BEM!");
  } else if (averageScore >= 60) {
    console.log("⚠️ PAINEL COM PROBLEMAS MENORES");
  } else {
    console.log("❌ PAINEL COM PROBLEMAS SÉRIOS");
  }

  // Listar problemas mais comuns
  const allIssues = results.flatMap(r => r.issues);
  const issueCounts = {};
  allIssues.forEach(issue => {
    issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  });

  if (Object.keys(issueCounts).length > 0) {
    console.log("\\n🔍 PROBLEMAS MAIS COMUNS:");
    Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([issue, count]) => {
        console.log(`   ${count}x - ${issue}`);
      });
  }

  return {
    results,
    functioning: functioning.length,
    partial: partial.length,
    broken: broken.length,
    averageScore,
  };
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().then(summary => {
    console.log("\\n✅ Teste concluído!");
    process.exit(summary.averageScore >= 60 ? 0 : 1);
  });
}

module.exports = { runTests, testComponentImplementation };
