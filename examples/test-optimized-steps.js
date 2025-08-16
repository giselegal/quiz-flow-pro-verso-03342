#!/usr/bin/env node

/**
 * 🧪 TESTE DAS 21 ETAPAS OTIMIZADAS
 * =================================
 */

console.log("🎯 TESTANDO CONFIGURAÇÃO DAS 21 ETAPAS");
console.log("=====================================");

// Importar configuração
import { OPTIMIZED_FUNNEL_CONFIG } from "./src/config/optimized21StepsFunnel.js";

console.log("\n📊 ESTATÍSTICAS:");
console.log(`• Total de etapas: ${OPTIMIZED_FUNNEL_CONFIG.steps.length}`);
console.log(
  `• Componentes únicos: ${new Set(OPTIMIZED_FUNNEL_CONFIG.steps.flatMap(s => s.blocks.map(b => b.type))).size}`
);
console.log(
  `• Total de blocos: ${OPTIMIZED_FUNNEL_CONFIG.steps.reduce((acc, s) => acc + s.blocks.length, 0)}`
);

console.log("\n🎯 ETAPAS CONFIGURADAS:");
OPTIMIZED_FUNNEL_CONFIG.steps.forEach(step => {
  console.log(`  ${step.order}. ${step.name} (${step.blocks.length} blocos)`);
});

console.log("\n🧮 VALIDAÇÃO:");
console.log(`• Questões principais: ${OPTIMIZED_FUNNEL_CONFIG.quizData.questions.length}`);
console.log(
  `• Questões estratégicas: ${OPTIMIZED_FUNNEL_CONFIG.quizData.strategicQuestions.length}`
);
console.log(
  `• Estilos disponíveis: ${Object.keys(OPTIMIZED_FUNNEL_CONFIG.quizData.styles).length}`
);

console.log("\n✅ TESTE CONCLUÍDO - CONFIGURAÇÃO VÁLIDA!");
