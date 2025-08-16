#!/usr/bin/env node

/**
 * ANÁLISE DA ROTA /resultado para ResultPage
 * Verificação da configuração correta do roteamento
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 ANÁLISE DA ROTA /resultado");
console.log("📊 Verificação da Configuração do Roteamento");
console.log("=".repeat(70));

// Arquivos para análise
const arquivos = {
  app: "src/App.tsx",
  routes: "src/utils/routes.ts",
  resultPage: "src/pages/ResultPage.tsx",
  liveQuizSteps: "src/data/liveQuizSteps.ts",
};

const conteudos = {};

// Carregar arquivos
Object.entries(arquivos).forEach(([key, filePath]) => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    conteudos[key] = fs.readFileSync(fullPath, "utf8");
    console.log(`✅ ${filePath} - Carregado`);
  } else {
    console.log(`❌ ${filePath} - Não encontrado`);
  }
});

console.log("\n📋 CONFIGURAÇÃO DE ROTAS:\n");

// 1. Verificar App.tsx
console.log("🔧 APP.TSX (Roteamento Principal):");
if (conteudos.app) {
  const rotasEncontradas = [
    {
      rota: "/resultado",
      regex: /path="\/resultado".*component={ResultPage}/g,
      desc: "Rota principal do resultado",
    },
    {
      rota: "/test-resultado",
      regex: /path="\/test-resultado"/g,
      desc: "Rota de teste",
    },
    {
      rota: "Importação ResultPage",
      regex: /import.*ResultPage.*from.*ResultPage/g,
      desc: "Import do componente",
    },
    {
      rota: "Router configurado",
      regex: /import.*Router.*from.*wouter/g,
      desc: "Sistema de roteamento",
    },
  ];

  rotasEncontradas.forEach(item => {
    const found = item.regex.test(conteudos.app);
    console.log(`  ${found ? "✅" : "❌"} ${item.rota} - ${item.desc}`);
  });
}

console.log("\n🎯 UTILS/ROUTES.TS:");
if (conteudos.routes) {
  const configRoutes = [
    {
      config: "RESULTADO constant",
      regex: /RESULTADO:\s*['"]\/resultado['"]/g,
    },
    { config: "isValidRoute function", regex: /function isValidRoute/g },
    { config: "ROUTES export", regex: /export const ROUTES/g },
  ];

  configRoutes.forEach(item => {
    const found = item.regex.test(conteudos.routes);
    console.log(`  ${found ? "✅" : "❌"} ${item.config}`);
  });
}

console.log("\n📊 RESULTPAGE.TSX:");
if (conteudos.resultPage) {
  const componenteFeatures = [
    { feature: "Component Export", regex: /export default ResultPage/g },
    { feature: "React.FC Type", regex: /ResultPage:\s*React\.FC/g },
    { feature: "useQuiz Hook", regex: /useQuiz\(\)/g },
    { feature: "useAuth Hook", regex: /useAuth\(\)/g },
    { feature: "Dynamic Rendering", regex: /DynamicBlockRenderer/g },
  ];

  componenteFeatures.forEach(item => {
    const found = item.regex.test(conteudos.resultPage);
    console.log(`  ${found ? "✅" : "❌"} ${item.feature}`);
  });
}

console.log("\n🔄 LIVE QUIZ STEPS:");
if (conteudos.liveQuizSteps) {
  const liveSteps = [
    { step: "Route Definition", regex: /route:\s*['"]\/resultado['"]/g },
    { step: "Steps by Route", regex: /STEPS_BY_ROUTE.*\/resultado/g },
    { step: "getResultSteps", regex: /getResultSteps.*=.*\(\)/g },
  ];

  liveSteps.forEach(item => {
    const found = item.regex.test(conteudos.liveQuizSteps);
    console.log(`  ${found ? "✅" : "❌"} ${item.step}`);
  });
}

console.log("\n" + "=".repeat(70));
console.log("📊 ANÁLISE DETALHADA DA ROTA:\n");

// Extrair rota específica do App.tsx
if (conteudos.app) {
  const rotaMatch = conteudos.app.match(
    /<Route\s+path="\/resultado"\s+component={ResultPage}\s*\/>/g
  );
  if (rotaMatch) {
    console.log("✅ ROTA ENCONTRADA:");
    console.log(`   ${rotaMatch[0]}`);
    console.log("   📍 Localização: src/App.tsx");
    console.log("   🎯 Componente: ResultPage");
    console.log("   🔗 URL: /resultado");
  } else {
    console.log("❌ ROTA NÃO ENCONTRADA no formato esperado");

    // Buscar possíveis variações
    const possiveisRotas = conteudos.app.match(/<Route.*resultado.*>/g);
    if (possiveisRotas) {
      console.log("⚠️  POSSÍVEIS VARIAÇÕES ENCONTRADAS:");
      possiveisRotas.forEach(rota => {
        console.log(`   ${rota}`);
      });
    }
  }
}

console.log("\n🔧 CONFIGURAÇÃO ATUAL:");

// Verificar se a estrutura está correta
const estruturaCorreta = {
  "Router importado": conteudos.app && conteudos.app.includes("import.*Router.*from.*wouter"),
  "ResultPage importado": conteudos.app && conteudos.app.includes("import.*ResultPage"),
  "Rota /resultado definida": conteudos.app && conteudos.app.includes('path="/resultado"'),
  "Component ResultPage ligado": conteudos.app && conteudos.app.includes("component={ResultPage}"),
  "ROUTES.RESULTADO definido": conteudos.routes && conteudos.routes.includes("RESULTADO:"),
};

Object.entries(estruturaCorreta).forEach(([item, status]) => {
  console.log(`  ${status ? "✅" : "❌"} ${item}`);
});

console.log("\n📱 TESTE DE NAVEGAÇÃO:");
console.log("Para testar a rota, acesse:");
console.log("🌐 http://localhost:5173/resultado");
console.log("🌐 https://[seu-dominio]/resultado");

console.log("\n🔍 POSSÍVEIS PROBLEMAS:");

const problemasPossiveis = [
  {
    problema: "Rota não encontrada (404)",
    causa: "Router não configurado ou rota mal definida",
    solucao: "Verificar App.tsx e configuração do Router",
  },
  {
    problema: "Componente não carrega",
    causa: "Import incorreto ou componente com erro",
    solucao: "Verificar import e console do navegador",
  },
  {
    problema: "Página em branco",
    causa: "Erro no componente ResultPage",
    solucao: "Verificar logs de erro e context providers",
  },
  {
    problema: "Redirecionamento inesperado",
    causa: "Logic de redirecionamento no código",
    solucao: "Verificar useEffect e navegação programática",
  },
];

problemasPossiveis.forEach((item, index) => {
  console.log(`${index + 1}. ⚠️  ${item.problema}`);
  console.log(`   📋 Causa: ${item.causa}`);
  console.log(`   🔧 Solução: ${item.solucao}\n`);
});

console.log("✅ RESUMO DA ANÁLISE:");

const totalChecks = 5; // Número de verificações principais
let checksPassaram = 0;

if (conteudos.app && conteudos.app.includes('path="/resultado"')) checksPassaram++;
if (conteudos.app && conteudos.app.includes("component={ResultPage}")) checksPassaram++;
if (conteudos.app && conteudos.app.includes("import.*ResultPage")) checksPassaram++;
if (conteudos.routes && conteudos.routes.includes("RESULTADO:")) checksPassaram++;
if (conteudos.resultPage && conteudos.resultPage.includes("export default ResultPage"))
  checksPassaram++;

console.log(
  `📊 Verificações: ${checksPassaram}/${totalChecks} (${Math.round((checksPassaram / totalChecks) * 100)}%)`
);

if (checksPassaram === totalChecks) {
  console.log("🎉 CONFIGURAÇÃO PERFEITA!");
  console.log("✨ A rota /resultado está corretamente configurada");
  console.log("🚀 ResultPage deve funcionar perfeitamente");
} else {
  console.log(`⚠️  ${totalChecks - checksPassaram} problema(s) encontrado(s)`);
  console.log("🔧 Verifique os itens marcados com ❌ acima");
}

console.log("\n📝 PRÓXIMOS PASSOS:");
console.log("1. 🌐 Teste a URL diretamente no navegador");
console.log("2. 🔍 Verifique o console do navegador para erros");
console.log("3. 📊 Confirme se os dados do quiz estão sendo passados");
console.log("4. 🎯 Teste a navegação a partir do quiz");
