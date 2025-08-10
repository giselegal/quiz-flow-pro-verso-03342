import fs from "fs";
import path from "path";

// Componentes específicos das etapas 20 e 21
const step20Components = [
  "QuizResultMainCardBlock",
  "QuizResultHeaderBlock",
  "QuizResultDisplayBlock",
  "QuizResultSecondaryStylesBlock",
  "CaktoQuizResult",
];

const step21Components = [
  "QuizOfferPageBlock",
  "QuizOfferHeroBlock",
  "QuizOfferPricingBlock",
  "QuizOfferTestimonialsBlock",
  "QuizOfferCountdownBlock",
  "QuizOfferFinalCTABlock",
  "QuizOfferFAQBlock",
  "CaktoQuizOffer",
];

const allComponents = [...step20Components, ...step21Components];

function analyzeResponsiveness(content, filePath) {
  const fileName = path.basename(filePath, ".tsx");
  let score = 100;
  let issues = [];

  // Padrões problemáticos para responsividade
  const problemPatterns = [
    // Grid com mais de 2 colunas sem breakpoints adequados
    {
      pattern: /grid-cols-[3-9](?!\s+md:grid-cols-[12])/g,
      penalty: 20,
      description: "Grid com muitas colunas sem breakpoints responsivos",
    },
    // Flexbox que pode causar overflow
    {
      pattern: /flex-nowrap|whitespace-nowrap/g,
      penalty: 15,
      description: "Elementos que não quebram linha",
    },
    // Larguras fixas grandes
    {
      pattern: /w-\[[0-9]{3,}\s*px\]/g,
      penalty: 25,
      description: "Larguras fixas muito grandes",
    },
    // Min-width problemático
    {
      pattern: /min-w-\[[0-9]{3,}\s*px\]/g,
      penalty: 20,
      description: "Min-width fixo muito grande",
    },
    // Overflow horizontal não controlado
    {
      pattern: /overflow-x-auto(?!\s+md:overflow-x-visible)/g,
      penalty: 15,
      description: "Overflow horizontal sem responsividade",
    },
    // Elementos com calc() problemáticos
    {
      pattern: /w-\[calc\(33\.333%-.*?\)\]/g,
      penalty: 10,
      description: "3 colunas em telas pequenas pode causar problemas",
    },
  ];

  // Verificar responsividade geral
  const hasResponsiveBreakpoints =
    content.includes("sm:") ||
    content.includes("md:") ||
    content.includes("lg:") ||
    content.includes("xl:");
  if (!hasResponsiveBreakpoints) {
    score -= 30;
    issues.push("Sem breakpoints responsivos detectados");
  }

  // Verificar grid responsivo
  const hasResponsiveGrid = /grid.*md:grid/.test(content);
  if (content.includes("grid") && !hasResponsiveGrid) {
    score -= 20;
    issues.push("Grid sem responsividade detectada");
  }

  // Verificar padrões problemáticos
  problemPatterns.forEach(({ pattern, penalty, description }) => {
    const matches = content.match(pattern);
    if (matches) {
      score -= penalty;
      issues.push(`${description} (${matches.length} ocorrência${matches.length > 1 ? "s" : ""})`);
    }
  });

  // Verificações específicas para múltiplas colunas
  const multiColumnPatterns = [
    /xl:w-\[calc\(33\.333%-.*?\)\]/g, // 3 colunas no XL
    /grid-cols-3/g,
    /grid-cols-4/g,
  ];

  multiColumnPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      const hasProperBreakpoints = /w-full.*md:w-.*xl:w-/.test(content);
      if (!hasProperBreakpoints) {
        score -= 15;
        issues.push("Múltiplas colunas sem progressão responsiva adequada");
      }
    }
  });

  return {
    fileName,
    score: Math.max(0, score),
    issues,
    category: step20Components.includes(fileName.replace("Block", "")) ? "Etapa 20" : "Etapa 21",
  };
}

function analyzeComponent(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, "utf8");
    return analyzeResponsiveness(content, componentPath);
  } catch (error) {
    return {
      fileName: path.basename(componentPath, ".tsx"),
      score: 0,
      issues: [`Erro ao ler arquivo: ${error.message}`],
      category: "Erro",
    };
  }
}

function findComponentFiles() {
  const baseDir = "./client/src/components/editor/blocks";
  const files = [];

  if (fs.existsSync(baseDir)) {
    const allFiles = fs.readdirSync(baseDir);

    allComponents.forEach(component => {
      const fileName = component.endsWith("Block") ? `${component}.tsx` : `${component}Block.tsx`;
      const altFileName = `${component}.tsx`;

      if (allFiles.includes(fileName)) {
        files.push(path.join(baseDir, fileName));
      } else if (allFiles.includes(altFileName)) {
        files.push(path.join(baseDir, altFileName));
      }
    });
  }

  return files;
}

function main() {
  console.log("🔍 Analisando Responsividade - Etapas 20 e 21\n");

  const componentFiles = findComponentFiles();

  if (componentFiles.length === 0) {
    console.log("❌ Nenhum componente encontrado!");
    return;
  }

  const results = componentFiles.map(analyzeComponent);

  // Separar por etapa
  const step20Results = results.filter(r => r.category === "Etapa 20");
  const step21Results = results.filter(r => r.category === "Etapa 21");

  // Relatório Etapa 20
  console.log("📊 ETAPA 20 - RESULTADO");
  console.log("=".repeat(50));

  step20Results.forEach(result => {
    const status = result.score >= 80 ? "✅" : result.score >= 60 ? "⚠️" : "❌";
    console.log(`${status} ${result.fileName} - Score: ${result.score}/100`);

    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }
    console.log("");
  });

  // Relatório Etapa 21
  console.log("📊 ETAPA 21 - OFERTA");
  console.log("=".repeat(50));

  step21Results.forEach(result => {
    const status = result.score >= 80 ? "✅" : result.score >= 60 ? "⚠️" : "❌";
    console.log(`${status} ${result.fileName} - Score: ${result.score}/100`);

    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }
    console.log("");
  });

  // Resumo
  const step20Average =
    step20Results.reduce((sum, r) => sum + r.score, 0) / step20Results.length || 0;
  const step21Average =
    step21Results.reduce((sum, r) => sum + r.score, 0) / step21Results.length || 0;

  console.log("📈 RESUMO GERAL");
  console.log("=".repeat(50));
  console.log(`Etapa 20 - Score médio: ${step20Average.toFixed(1)}/100`);
  console.log(`Etapa 21 - Score médio: ${step21Average.toFixed(1)}/100`);

  const problematicComponents = results.filter(r => r.score < 80);
  console.log(`\n⚠️  ${problematicComponents.length} componente(s) precisam de ajustes`);

  // Recomendações
  console.log("\n💡 RECOMENDAÇÕES PARA MELHORAR RESPONSIVIDADE:");
  console.log("=".repeat(50));
  console.log("1. Usar no máximo 2 colunas em telas pequenas (grid-cols-1 md:grid-cols-2)");
  console.log("2. Implementar breakpoints progressivos (sm: md: lg: xl:)");
  console.log("3. Evitar larguras fixas grandes (usar % ou rem)");
  console.log("4. Considerar carrossel para múltiplos itens em mobile");
  console.log("5. Testar em diferentes tamanhos de tela");
}

main();
