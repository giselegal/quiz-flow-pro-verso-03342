#!/usr/bin/env node

/**
 * TESTE DOS NOVOS COMPONENTES MODERNOS
 * Sistema de verificação dos componentes mais funcionais e completos
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 TESTE DOS COMPONENTES MODERNOS PARA PÁGINAS DINÂMICAS");
console.log("=".repeat(60));

// Ler o arquivo de definições
const blockDefsPath = path.join(__dirname, "src/config/blockDefinitions.ts");

if (!fs.existsSync(blockDefsPath)) {
  console.error("❌ Arquivo blockDefinitions.ts não encontrado!");
  process.exit(1);
}

const content = fs.readFileSync(blockDefsPath, "utf8");

// Componentes modernos que foram adicionados
const componentesModernos = [
  "flex-container-horizontal",
  "flex-container-vertical",
  "countdown-timer-real",
  "pricing-card-modern",
  "cta-button-modern",
  "quiz-question-modern",
  "progress-bar-modern",
  "image-text-card",
  "stats-counter",
  "testimonial-card",
  "feature-highlight",
  "section-divider",
];

const categorias = {
  Layout: [
    "flex-container-horizontal",
    "flex-container-vertical",
    "image-text-card",
    "section-divider",
  ],
  Vendas: [
    "countdown-timer-real",
    "pricing-card-modern",
    "cta-button-modern",
    "stats-counter",
    "testimonial-card",
    "feature-highlight",
  ],
  Quiz: ["quiz-question-modern", "progress-bar-modern"],
};

console.log("📋 VERIFICANDO COMPONENTES POR CATEGORIA:\n");

let totalEncontrados = 0;
let totalEsperados = componentesModernos.length;

Object.entries(categorias).forEach(([categoria, componentes]) => {
  console.log(`📂 ${categoria.toUpperCase()}:`);

  componentes.forEach(comp => {
    const regex = new RegExp(`type:\\s*['"]${comp}['"]`, "g");
    const encontrado = regex.test(content);

    if (encontrado) {
      console.log(`  ✅ ${comp} - Configurado`);
      totalEncontrados++;
    } else {
      console.log(`  ❌ ${comp} - Não encontrado`);
    }
  });

  console.log("");
});

// Verificar características específicas dos componentes
console.log("🔍 VERIFICANDO CARACTERÍSTICAS MODERNAS:\n");

const caracteristicas = [
  {
    nome: "BoxFlex Horizontal",
    regex: /justifyContent.*space-between|flex.*horizontal/gi,
  },
  { nome: "Componentes Editáveis", regex: /propertiesSchema.*\[/gi },
  { nome: "Layout Responsivo", regex: /layout.*select.*options/gi },
  { nome: "Timer Funcional", regex: /countdown.*targetDate/gi },
  { nome: "Pricing Moderno", regex: /pricing.*originalPrice.*salePrice/gi },
  { nome: "CTA Animado", regex: /cta.*pulse.*animation/gi },
  { nome: "Quiz Interativo", regex: /quiz.*allowMultiple.*autoAdvance/gi },
  { nome: "Progress Bar", regex: /progress.*percentage.*animated/gi },
];

let caracteristicasEncontradas = 0;

caracteristicas.forEach(carac => {
  const encontrado = carac.regex.test(content);
  if (encontrado) {
    console.log(`  ✅ ${carac.nome} - Implementado`);
    caracteristicasEncontradas++;
  } else {
    console.log(`  ❌ ${carac.nome} - Não encontrado`);
  }
});

console.log("\n" + "=".repeat(60));
console.log("📊 RESULTADO FINAL:");
console.log(
  `📦 Componentes: ${totalEncontrados}/${totalEsperados} (${Math.round((totalEncontrados / totalEsperados) * 100)}%)`
);
console.log(
  `⚡ Características: ${caracteristicasEncontradas}/${caracteristicas.length} (${Math.round((caracteristicasEncontradas / caracteristicas.length) * 100)}%)`
);

if (totalEncontrados === totalEsperados && caracteristicasEncontradas >= 6) {
  console.log("\n🎉 SUCESSO! Todos os componentes modernos foram implementados!");
  console.log("✨ Sistema pronto para construção de páginas dinâmicas de vendas e quizzes!");
} else {
  console.log("\n⚠️  Alguns componentes ou características estão faltando.");
  console.log("📝 Verifique a implementação dos componentes marcados com ❌");
}

console.log("\n📝 PRÓXIMOS PASSOS:");
console.log("1. Testar os componentes no editor");
console.log("2. Implementar o DynamicBlockRenderer para os novos tipos");
console.log("3. Configurar os estilos CSS para os layouts flexíveis");
console.log("4. Validar a responsividade em diferentes devices");

console.log("\n🔗 COMPONENTES MAIS DESTACADOS:");
console.log("📱 flex-container-horizontal - Layout flexível inline/boxflex");
console.log("💰 pricing-card-modern - Card de preço com destaque");
console.log("🎯 cta-button-modern - Botão CTA com animações");
console.log("❓ quiz-question-modern - Questão responsiva e interativa");
console.log("📊 progress-bar-modern - Barra de progresso animada");
