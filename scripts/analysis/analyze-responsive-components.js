import fs from 'fs';
import path from 'path';

const componentsDir = '/workspaces/quiz-quest-challenge-verse/client/src/components/editor/blocks';

// Padrões de classes responsivas do Tailwind
const responsivePatterns = [
  /\bsm:/g,
  /\bmd:/g,
  /\blg:/g,
  /\bxl:/g,
  /\b2xl:/g,
  /\bgrid-cols-\d+\s+md:grid-cols-\d+/g,
  /\bgrid-cols-\d+\s+lg:grid-cols-\d+/g,
  /\bflex-col\s+md:flex-row/g,
  /\btext-\w+\s+md:text-\w+/g,
  /\bp-\d+\s+md:p-\d+/g,
  /\btext-center\s+md:text-left/g,
];

// Padrões problemáticos (valores fixos)
const nonResponsivePatterns = [
  /\bw-\[\d+px\]/g,
  /\bh-\[\d+px\]/g,
  /\btext-\[\d+px\]/g,
  /\bmin-w-\[\d+px\]/g,
  /\bmax-w-\[\d+px\]/g,
  /\bmin-h-\[\d+px\]/g,
  /\bmax-h-\[\d+px\]/g,
];

// Grid patterns problemáticos
const gridProblems = [
  /\bgrid-cols-\d+(?!\s+(?:sm|md|lg|xl|2xl):)/g, // grid sem breakpoints
  /\bfixed\b/g, // position fixed sem responsividade
  /\babsolute\b/g, // position absolute sem responsividade
];

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    let hasResponsive = false;
    let hasProblems = false;
    let responsiveMatches = [];
    let problemMatches = [];

    // Verifica padrões responsivos
    responsivePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        hasResponsive = true;
        responsiveMatches = responsiveMatches.concat(matches);
      }
    });

    // Verifica padrões problemáticos
    [...nonResponsivePatterns, ...gridProblems].forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        hasProblems = true;
        problemMatches = problemMatches.concat(matches);
      }
    });

    return {
      fileName,
      hasResponsive,
      hasProblems,
      responsiveCount: responsiveMatches.length,
      problemCount: problemMatches.length,
      responsiveMatches: [...new Set(responsiveMatches)],
      problemMatches: [...new Set(problemMatches)],
    };
  } catch (error) {
    return {
      fileName: path.basename(filePath),
      error: error.message,
    };
  }
}

function analyzeComponents() {
  if (!fs.existsSync(componentsDir)) {
    console.log('❌ Diretório de componentes não encontrado:', componentsDir);
    return;
  }

  const files = fs
    .readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(componentsDir, file));

  console.log(`📱 ANÁLISE DE RESPONSIVIDADE - ${files.length} COMPONENTES\n`);
  console.log('=====================================\n');

  const results = files.map(analyzeFile).filter(result => !result.error);

  // Separar componentes por categoria
  const fullyResponsive = results.filter(r => r.hasResponsive && !r.hasProblems);
  const partiallyResponsive = results.filter(r => r.hasResponsive && r.hasProblems);
  const nonResponsive = results.filter(r => !r.hasResponsive);

  console.log('✅ COMPONENTES TOTALMENTE RESPONSIVOS:', fullyResponsive.length);
  fullyResponsive.forEach(r => {
    console.log(`   📱 ${r.fileName} (${r.responsiveCount} classes responsivas)`);
  });

  console.log('\n⚠️  COMPONENTES PARCIALMENTE RESPONSIVOS:', partiallyResponsive.length);
  partiallyResponsive.forEach(r => {
    console.log(`   📱 ${r.fileName}`);
    console.log(
      `      ✓ Classes responsivas: ${r.responsiveMatches.slice(0, 3).join(', ')}${r.responsiveMatches.length > 3 ? '...' : ''}`
    );
    console.log(
      `      ⚠️  Problemas: ${r.problemMatches.slice(0, 3).join(', ')}${r.problemMatches.length > 3 ? '...' : ''}`
    );
  });

  console.log('\n❌ COMPONENTES NÃO RESPONSIVOS:', nonResponsive.length);
  nonResponsive.forEach(r => {
    console.log(`   📱 ${r.fileName}`);
  });

  console.log('\n📊 RESUMO:');
  console.log(`   Total de componentes: ${results.length}`);
  console.log(
    `   Totalmente responsivos: ${fullyResponsive.length} (${Math.round((fullyResponsive.length / results.length) * 100)}%)`
  );
  console.log(
    `   Parcialmente responsivos: ${partiallyResponsive.length} (${Math.round((partiallyResponsive.length / results.length) * 100)}%)`
  );
  console.log(
    `   Não responsivos: ${nonResponsive.length} (${Math.round((nonResponsive.length / results.length) * 100)}%)`
  );

  // Analisar problemas mais comuns
  const allProblems = results.flatMap(r => r.problemMatches || []);
  const problemCounts = {};
  allProblems.forEach(problem => {
    problemCounts[problem] = (problemCounts[problem] || 0) + 1;
  });

  if (Object.keys(problemCounts).length > 0) {
    console.log('\n🔍 PROBLEMAS MAIS COMUNS:');
    Object.entries(problemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([problem, count]) => {
        console.log(`   ${count}x: ${problem}`);
      });
  }
}

analyzeComponents();
