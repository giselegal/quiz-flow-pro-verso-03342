import fs from "fs";
import path from "path";

const componentsDir = "/workspaces/quiz-quest-challenge-verse/client/src/components/editor/blocks";

function analyzeComponentResponsiveness(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const fileName = path.basename(filePath);

    const issues = [];
    let score = 100;

    // Padrões problemáticos simples
    const problemPatterns = [
      { pattern: /w-\[\d+px\]/g, penalty: 15, name: "Largura fixa em pixels" },
      { pattern: /h-\[\d+px\]/g, penalty: 15, name: "Altura fixa em pixels" },
      { pattern: /min-w-\[\d+px\]/g, penalty: 10, name: "Largura mínima fixa" },
      { pattern: /min-h-\[\d+px\]/g, penalty: 10, name: "Altura mínima fixa" },
      { pattern: /text-\[\d+px\]/g, penalty: 15, name: "Fonte fixa em pixels" },
      {
        pattern: /grid-cols-\d+(?!\s+(?:sm|md|lg|xl|2xl):)/g,
        penalty: 12,
        name: "Grid sem responsividade",
      },
      { pattern: /\babsolute\b/g, penalty: 5, name: "Posicionamento absoluto" },
      { pattern: /\bfixed\b/g, penalty: 8, name: "Posicionamento fixo" },
    ];

    // Verificar padrões problemáticos
    problemPatterns.forEach(({ pattern, penalty, name }) => {
      const matches = content.match(pattern);
      if (matches) {
        const uniqueMatches = [...new Set(matches)];
        uniqueMatches.forEach(match => {
          score -= penalty;
          issues.push({
            pattern: match,
            problem: name,
            penalty,
          });
        });
      }
    });

    // Verificar se tem classes responsivas
    const responsivePatterns = [/\bsm:/g, /\bmd:/g, /\blg:/g, /\bxl:/g, /\b2xl:/g];
    let hasResponsiveClasses = false;

    responsivePatterns.forEach(pattern => {
      if (content.match(pattern)) {
        hasResponsiveClasses = true;
      }
    });

    if (!hasResponsiveClasses) {
      score -= 30;
      issues.push({
        pattern: "Sem breakpoints",
        problem: "Ausência de classes responsivas",
        penalty: 30,
      });
    }

    // Garantir score mínimo
    score = Math.max(0, score);

    return {
      fileName,
      score,
      issues,
      hasResponsiveClasses,
      status: score >= 80 ? "✅ Bom" : score >= 60 ? "⚠️ Médio" : "❌ Ruim",
    };
  } catch (error) {
    console.error(`Erro ao analisar ${filePath}:`, error.message);
    return null;
  }
}

function main() {
  if (!fs.existsSync(componentsDir)) {
    console.log("❌ Diretório não encontrado:", componentsDir);
    return;
  }

  const files = fs
    .readdirSync(componentsDir)
    .filter(file => file.endsWith(".tsx"))
    .map(file => path.join(componentsDir, file));

  console.log(`📱 ANÁLISE DE RESPONSIVIDADE - ${files.length} COMPONENTES\n`);

  const results = files.map(analyzeComponentResponsiveness).filter(Boolean);

  if (results.length === 0) {
    console.log("❌ Nenhum resultado válido encontrado");
    return;
  }

  // Ordenar por score (pior primeiro)
  results.sort((a, b) => a.score - b.score);

  // Estatísticas
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  const goodComponents = results.filter(r => r.score >= 80);
  const okComponents = results.filter(r => r.score >= 60 && r.score < 80);
  const badComponents = results.filter(r => r.score < 60);

  console.log("📊 ESTATÍSTICAS:");
  console.log(`   Score médio: ${averageScore.toFixed(1)}/100`);
  console.log(
    `   ✅ Bons (≥80): ${goodComponents.length} (${Math.round((goodComponents.length / results.length) * 100)}%)`
  );
  console.log(
    `   ⚠️ Médios (60-79): ${okComponents.length} (${Math.round((okComponents.length / results.length) * 100)}%)`
  );
  console.log(
    `   ❌ Ruins (<60): ${badComponents.length} (${Math.round((badComponents.length / results.length) * 100)}%)\n`
  );

  // Top 15 piores
  console.log("❌ TOP 15 COMPONENTES MAIS PROBLEMÁTICOS:\n");
  results.slice(0, 15).forEach((result, index) => {
    console.log(`${index + 1}. ${result.status} ${result.fileName} (${result.score}/100)`);

    if (result.issues.length > 0) {
      const topIssues = result.issues.slice(0, 3);
      topIssues.forEach(issue => {
        console.log(`     🔸 ${issue.problem}: ${issue.pattern} (-${issue.penalty})`);
      });
      if (result.issues.length > 3) {
        console.log(`     ... +${result.issues.length - 3} outros problemas`);
      }
    }
    console.log("");
  });

  // Problemas mais comuns
  const allIssues = results.flatMap(r => r.issues);
  const problemCounts = {};
  allIssues.forEach(issue => {
    problemCounts[issue.problem] = (problemCounts[issue.problem] || 0) + 1;
  });

  console.log("🔍 PROBLEMAS MAIS FREQUENTES:\n");
  Object.entries(problemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .forEach(([problem, count]) => {
      console.log(`   ${count}x: ${problem}`);
    });

  console.log("\n");

  // Componentes críticos
  const criticalComponents = results.filter(r => r.score < 40);
  if (criticalComponents.length > 0) {
    console.log(`🚨 COMPONENTES CRÍTICOS (Score < 40): ${criticalComponents.length}\n`);
    criticalComponents.forEach(result => {
      console.log(`   📱 ${result.fileName} (${result.score}/100)`);
    });
    console.log("");
  }

  console.log("💡 RECOMENDAÇÕES:\n");
  console.log("   1. Priorizar componentes com score < 60");
  console.log("   2. Substituir valores em pixels por classes Tailwind");
  console.log("   3. Adicionar breakpoints (sm:, md:, lg:)");
  console.log("   4. Testar em dispositivos móveis");
  console.log("   5. Implementar grid responsivo");
}

main();
