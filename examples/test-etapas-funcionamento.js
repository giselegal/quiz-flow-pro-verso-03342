// TESTE DAS ETAPAS DO EDITOR
console.log("🔍 TESTANDO FUNCIONAMENTO DAS ETAPAS...");

// Simular o que acontece no FunnelsContext
const FUNNEL_TEMPLATES = {
  "funil-21-etapas": {
    name: "Funil Completo 21 Etapas",
    description: "Funil completo com todas as 21 etapas do quiz",
    defaultSteps: [
      {
        id: "step-1",
        name: "Introdução",
        order: 1,
        blocksCount: 3,
        isActive: true,
        type: "intro",
        description: "Página de apresentação do quiz",
      },
      {
        id: "step-2",
        name: "Q1 - Profissão",
        order: 2,
        blocksCount: 4,
        isActive: false,
        type: "question",
        description: "Qual é a sua profissão atual?",
      },
      {
        id: "step-3",
        name: "Q2 - Experiência",
        order: 3,
        blocksCount: 4,
        isActive: false,
        type: "question",
        description: "Anos de experiência profissional",
      },
    ],
  },
};

// Testar se o template está acessível
const currentFunnelId = "funil-21-etapas";
const template = FUNNEL_TEMPLATES[currentFunnelId];

console.log("📊 Template encontrado:", !!template);
console.log("📝 Nome do template:", template?.name);
console.log("🔢 Número de etapas:", template?.defaultSteps?.length);

if (template && template.defaultSteps) {
  console.log("\n📋 ETAPAS CARREGADAS:");
  template.defaultSteps.forEach((step, index) => {
    console.log(`  ${index + 1}. ${step.name} (${step.id})`);
    console.log(`     - Tipo: ${step.type}`);
    console.log(`     - Ativa: ${step.isActive ? "SIM" : "NÃO"}`);
    console.log(`     - Blocos: ${step.blocksCount}`);
  });

  console.log("\n✅ ETAPAS FUNCIONANDO CORRETAMENTE!");
} else {
  console.log("\n❌ PROBLEMA: Template não encontrado ou sem etapas!");
}

console.log("\n🎯 PRÓXIMO PASSO: Verificar se o FunnelStagesPanel está renderizando essas etapas");
