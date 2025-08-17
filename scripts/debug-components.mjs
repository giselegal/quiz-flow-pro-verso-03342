// 🔍 Debug Script ES7+ - Análise dos ComponentDefinitions
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES7+ Module Path Resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🎯 Configuration Object with ES7+ features
const config = Object.freeze({
  filePath: join(__dirname, 'client/src/config/blockDefinitionsClean.ts'),
  patterns: {
    categories: /category:\s*'([^']+)'/g,
    types: /type:\s*'([^']+)'/g,
    names: /name:\s*'([^']+)'/g,
    inlineTypes: /type:\s*'[^']*inline[^']*'/g,
  },
});

// 🔧 ES7+ Utility Functions with advanced features
const extractMatches = (content, pattern) =>
  [...content.matchAll(pattern)].map(match => match[1] || match[0]);

const analyzeBlockDefinitions = content => {
  const categories = [...new Set(extractMatches(content, config.patterns.categories))];
  const types = extractMatches(content, config.patterns.types);
  const names = extractMatches(content, config.patterns.names);
  const inlineTypes = types.filter(type => type.includes('inline'));

  // ES7+ Object composition with computed properties
  return {
    categories: categories.map((cat, index) => ({ id: index + 1, name: cat })),
    components: types.map((type, index) => ({
      type,
      name: names[index] || 'Sem nome',
      isInline: type.includes('inline'),
      category:
        categories.find(
          cat =>
            content.includes(`type: '${type}'`) &&
            content
              .substring(
                content.indexOf(`type: '${type}'`),
                content.indexOf(`type: '${type}'`) + 500
              )
              .includes(`category: '${cat}'`)
        ) || 'Desconhecida',
    })),
    stats: {
      totalCategories: categories.length,
      totalComponents: types.length,
      inlineComponents: inlineTypes.length,
      regularComponents: types.length - inlineTypes.length,
    },
    inlineTypes,
  };
};

// 🚀 Main Analysis Function with ES7+ features
const analyzeComponentDefinitions = async () => {
  console.log('\n🔍 === ANÁLISE ES7+ DOS BLOCK DEFINITIONS CLEAN ===\n');

  try {
    if (!existsSync(config.filePath)) {
      throw new Error('Arquivo blockDefinitionsClean.ts não encontrado!');
    }

    console.log('✅ Arquivo encontrado:', config.filePath);

    const content = readFileSync(config.filePath, 'utf8');
    const analysis = analyzeBlockDefinitions(content);

    // 📊 Results Display with ES7+ destructuring
    console.log('\n📂 CATEGORIAS DETECTADAS:');
    analysis.categories.forEach(({ id, name }) => console.log(`  ${id}. ${name}`));

    console.log(`\n⚡ COMPONENTES INLINE (${analysis.inlineTypes.length} encontrados):`);
    analysis.inlineTypes.length > 0
      ? analysis.inlineTypes.forEach((type, i) => console.log(`  ${i + 1}. ${type}`))
      : console.log('  ❌ Nenhum componente inline encontrado!');

    console.log(`\n📈 ESTATÍSTICAS:`);
    console.log(`  • Total de tipos: ${analysis.stats.totalComponents}`);
    console.log(`  • Tipos inline: ${analysis.stats.inlineComponents}`);
    console.log(`  • Tipos regulares: ${analysis.stats.regularComponents}`);
    console.log(`  • Categorias: ${analysis.stats.totalCategories}`);

    // 🔎 Specific Search for pricing-inline with ES7+ includes
    const hasPricingInline = content.includes("'pricing-inline'");
    console.log(`\n💰 PRICING-INLINE: ${hasPricingInline ? '✅ Encontrado' : '❌ Não encontrado'}`);

    // 🎯 Enhanced Analysis: Show inline components by category
    console.log(`\n🎯 COMPONENTES INLINE POR CATEGORIA:`);
    const inlineByCategory = analysis.components
      .filter(comp => comp.isInline)
      .reduce((acc, comp) => {
        acc[comp.category] = [...(acc[comp.category] || []), comp];
        return acc;
      }, {});

    Object.entries(inlineByCategory).forEach(([category, components]) => {
      console.log(`  📁 ${category}:`);
      components.forEach(comp => console.log(`    • ${comp.name} (${comp.type})`));
    });

    // 🌟 Success Summary
    console.log('\n🎉 ANÁLISE CONCLUÍDA COM SUCESSO!');
  } catch (error) {
    console.error('\n❌ ERRO NA ANÁLISE:', error.message);
    process.exit(1);
  }
};

// 🏃‍♂️ Execute Analysis
analyzeComponentDefinitions();
