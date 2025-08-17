import fs from 'fs';
import path from 'path';

const componentsDir = '/workspaces/quiz-quest-challenge-verse/client/src/components/editor/blocks';

// Problemas específicos e suas correções
const responsivePatterns = {
  // Larguras fixas
  'w-\\[\\d+px\\]': {
    problem: 'Largura fixa em pixels',
    solution: 'Usar classes responsivas como w-full, w-64, w-72 ou breakpoints sm:w-X md:w-Y',
    severity: 'high',
  },
  'min-w-\\[\\d+px\\]': {
    problem: 'Largura mínima fixa em pixels',
    solution: 'Usar classes como min-w-0, min-w-full ou breakpoints responsivos',
    severity: 'medium',
  },
  'max-w-\\[\\d+px\\]': {
    problem: 'Largura máxima fixa em pixels',
    solution: 'Usar classes como max-w-xs, max-w-sm, max-w-md, max-w-lg, etc.',
    severity: 'medium',
  },

  // Alturas fixas
  'h-\\[\\d+px\\]': {
    problem: 'Altura fixa em pixels',
    solution: 'Usar classes como h-auto, h-screen, h-64 ou definir altura responsiva',
    severity: 'high',
  },
  'min-h-\\[\\d+px\\]': {
    problem: 'Altura mínima fixa em pixels',
    solution: 'Usar classes como min-h-screen, min-h-full ou breakpoints responsivos',
    severity: 'medium',
  },

  // Tamanhos de texto fixos
  'text-\\[\\d+px\\]': {
    problem: 'Tamanho de fonte fixo em pixels',
    solution: 'Usar classes responsivas como text-sm md:text-base lg:text-lg',
    severity: 'high',
  },

  // Grid sem breakpoints
  'grid-cols-\\d+(?!\\s+(?:sm|md|lg|xl|2xl):)': {
    problem: 'Grid com colunas fixas sem responsividade',
    solution: 'Adicionar breakpoints como grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    severity: 'high',
  },

  // Position problemático
  '\\babsolute\\b': {
    problem: 'Posicionamento absoluto pode causar problemas em mobile',
    solution: 'Verificar se funciona em diferentes tamanhos de tela ou usar responsive positioning',
    severity: 'low',
  },

  '\\bfixed\\b': {
    problem: 'Posicionamento fixo pode causar problemas em mobile',
    solution: 'Testar em dispositivos móveis e considerar alternatives responsivas',
    severity: 'medium',
  },
};

function analyzeComponentResponsiveness(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    const issues = [];
    let score = 100;

    // Verificar cada padrão problemático
    Object.entries(responsivePatterns).forEach(([pattern, info]) => {
      const regex = new RegExp(pattern, 'g');
      const matches = content.match(regex);

      if (matches) {
        const uniqueMatches = [...new Set(matches)];
        uniqueMatches.forEach(match => {
          let penalty = 0;
          switch (info.severity) {
            case 'high':
              penalty = 15;
              break;
            case 'medium':
              penalty = 10;
              break;
            case 'low':
              penalty = 5;
              break;
          }

          score -= penalty;
          issues.push({
            pattern: match,
            problem: info.problem,
            solution: info.solution,
            severity: info.severity,
            penalty,
          });
        });
      }
    });

    // Verificar se tem padrões responsivos
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
        pattern: 'Ausência de classes responsivas',
        problem: 'Componente não utiliza breakpoints responsivos',
        solution: 'Adicionar classes como sm:, md:, lg: para diferentes tamanhos de tela',
        severity: 'high',
        penalty: 30,
      });
    }

    // Garantir score mínimo de 0
    score = Math.max(0, score);

    return {
      fileName,
      score,
      issues,
      hasResponsiveClasses,
      status: score >= 80 ? '✅ Bom' : score >= 60 ? '⚠️ Precisa melhorar' : '❌ Problemático',
    };
  } catch (error) {
    return {
      fileName: path.basename(filePath),
      error: error.message,
    };
  }
}

function generateDetailedReport() {
  if (!fs.existsSync(componentsDir)) {
    console.log('❌ Diretório de componentes não encontrado:', componentsDir);
    return;
  }

  const files = fs
    .readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(componentsDir, file));

  console.log(`📱 RELATÓRIO DETALHADO DE RESPONSIVIDADE\n`);
  console.log(`Analisando ${files.length} componentes...\n`);
  console.log('='.repeat(80) + '\n');

  const results = files.map(analyzeComponentResponsiveness).filter(result => !result.error);

  // Ordenar por score (pior primeiro)
  results.sort((a, b) => a.score - b.score);

  // Estatísticas gerais
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  const goodComponents = results.filter(r => r.score >= 80);
  const okComponents = results.filter(r => r.score >= 60 && r.score < 80);
  const badComponents = results.filter(r => r.score < 60);

  console.log('📊 ESTATÍSTICAS GERAIS:');
  console.log(`   Score médio: ${averageScore.toFixed(1)}/100`);
  console.log(
    `   ✅ Componentes bons (80+): ${goodComponents.length} (${Math.round((goodComponents.length / results.length) * 100)}%)`
  );
  console.log(
    `   ⚠️  Componentes OK (60-79): ${okComponents.length} (${Math.round((okComponents.length / results.length) * 100)}%)`
  );
  console.log(
    `   ❌ Componentes problemáticos (<60): ${badComponents.length} (${Math.round((badComponents.length / results.length) * 100)}%)`
  );
  console.log('\n');

  // Top 10 piores componentes
  console.log('❌ TOP 10 COMPONENTES MAIS PROBLEMÁTICOS:\n');
  results.slice(0, 10).forEach((result, index) => {
    console.log(`${index + 1}. ${result.status} ${result.fileName} (Score: ${result.score}/100)`);

    if (result.issues.length > 0) {
      result.issues.slice(0, 3).forEach(issue => {
        console.log(`     🔸 ${issue.problem} (${issue.pattern})`);
        console.log(`        💡 Solução: ${issue.solution}`);
      });
      if (result.issues.length > 3) {
        console.log(`     ... e mais ${result.issues.length - 3} problemas`);
      }
    }
    console.log('');
  });

  // Problemas mais comuns
  const allIssues = results.flatMap(r => r.issues);
  const problemCounts = {};
  allIssues.forEach(issue => {
    const key = issue.problem;
    problemCounts[key] = (problemCounts[key] || 0) + 1;
  });

  console.log('🔍 PROBLEMAS MAIS COMUNS:\n');
  Object.entries(problemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .forEach(([problem, count]) => {
      console.log(`   ${count}x: ${problem}`);
    });

  console.log('\n');

  // Componentes que precisam de atenção imediata
  const urgentComponents = results.filter(r => r.score < 40);
  if (urgentComponents.length > 0) {
    console.log('🚨 COMPONENTES QUE PRECISAM DE ATENÇÃO IMEDIATA (Score < 40):\n');
    urgentComponents.forEach(result => {
      console.log(`   📱 ${result.fileName} (Score: ${result.score}/100)`);
      const highIssues = result.issues.filter(i => i.severity === 'high');
      if (highIssues.length > 0) {
        console.log(`      Problemas críticos: ${highIssues.length}`);
      }
    });
    console.log('');
  }

  // Sugestões gerais
  console.log('💡 SUGESTÕES GERAIS DE MELHORIA:\n');
  console.log('   1. Substituir larguras/alturas fixas em pixels por classes Tailwind responsivas');
  console.log('   2. Usar breakpoints (sm:, md:, lg:) para adaptar layouts');
  console.log('   3. Implementar grid responsivo: grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
  console.log('   4. Usar tamanhos de fonte responsivos: text-sm md:text-base lg:text-lg');
  console.log('   5. Testar componentes em diferentes dispositivos');
  console.log('   6. Considerar usar container queries quando apropriado');
  console.log('\n');

  console.log('📋 PRÓXIMOS PASSOS:\n');
  console.log('   1. Priorizar componentes com score < 60');
  console.log('   2. Focar em problemas de severity "high"');
  console.log('   3. Testar mudanças em dispositivos móveis');
  console.log('   4. Implementar sistema de testes responsivos');
}

generateDetailedReport();
