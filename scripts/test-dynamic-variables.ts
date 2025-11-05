/**
 * Teste de Variáveis Dinâmicas - Step-20
 * Verifica se todas as variáveis {userName}, {styleName}, etc. estão configuradas
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface VariableTest {
  location: string;
  variable: string;
  property: string;
  value: string;
  supported: boolean;
  needsContext: boolean;
}

const SUPPORTED_VARIABLES = [
  'userName',
  'username',
  'styleName',
  'style',
  'primaryStyle',
  'ctaPrimaryText',
  'ctaPrimaryUrl',
  'ctaSecondaryText',
  'ctaSecondaryUrl',
  'comp1Name',
  'comp2Name',
];

function findVariables(obj: any, path: string = '', results: VariableTest[] = []): VariableTest[] {
  if (typeof obj === 'string') {
    const regex = /\{(\w+)\}/g;
    let match;
    while ((match = regex.exec(obj)) !== null) {
      const variable = match[1];
      const supported = SUPPORTED_VARIABLES.includes(variable);
      results.push({
        location: path,
        variable,
        property: path.split('.').pop() || '',
        value: obj,
        supported,
        needsContext: ['userName', 'username', 'styleName', 'style', 'primaryStyle'].includes(variable)
      });
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      findVariables(obj[key], path ? `${path}.${key}` : key, results);
    }
  }
  return results;
}

async function runTest() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║         🔍 TESTE VARIÁVEIS DINÂMICAS - STEP-20                      ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

  // Carregar quiz21-complete.json
  const quizPath = join(process.cwd(), 'public/templates/quiz21-complete.json');
  const quizData = JSON.parse(readFileSync(quizPath, 'utf-8'));
  
  const step20 = quizData.steps['step-20'];
  
  if (!step20) {
    console.error('❌ Step-20 não encontrada no quiz21-complete.json');
    process.exit(1);
  }

  console.log('📋 Step-20: Resultado Personalizado\n');

  // Encontrar todas as variáveis
  const variables = findVariables(step20);

  if (variables.length === 0) {
    console.log('✅ Nenhuma variável dinâmica encontrada (ou não há {placeholders})\n');
    process.exit(0);
  }

  // Agrupar por suportada ou não
  const supported = variables.filter(v => v.supported);
  const unsupported = variables.filter(v => !v.supported);
  const contextRequired = variables.filter(v => v.needsContext);

  console.log(`🔍 Total de variáveis encontradas: ${variables.length}\n`);

  // Mostrar variáveis suportadas
  if (supported.length > 0) {
    console.log('✅ VARIÁVEIS SUPORTADAS:\n');
    const grouped = supported.reduce((acc, v) => {
      if (!acc[v.variable]) acc[v.variable] = [];
      acc[v.variable].push(v);
      return acc;
    }, {} as Record<string, VariableTest[]>);

    for (const [variable, occurrences] of Object.entries(grouped)) {
      console.log(`  {${variable}} → ${occurrences.length}x`);
      occurrences.forEach(occ => {
        console.log(`    📍 ${occ.location}`);
        const displayValue = occ.value.substring(0, 60);
        const suffix = occ.value.length > 60 ? '...' : '';
        console.log(`       Valor: "${displayValue}${suffix}"`);
      });
      console.log('');
    }
  }

  // Mostrar variáveis não suportadas
  if (unsupported.length > 0) {
    console.log('❌ VARIÁVEIS NÃO SUPORTADAS:\n');
    unsupported.forEach(v => {
      console.log(`  {${v.variable}}`);
      console.log(`    📍 ${v.location}`);
      console.log(`       Valor: "${v.value}"`);
      console.log('');
    });
  }

  // Resumo
  console.log('╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║                           📊 RESUMO                                  ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝\n');

  console.log(`  📦 Total de variáveis:        ${variables.length}`);
  console.log(`  ✅ Suportadas:                ${supported.length}`);
  console.log(`  ❌ Não suportadas:            ${unsupported.length}`);
  console.log(`  🔗 Requerem ResultContext:   ${contextRequired.length}`);
  console.log(`  📊 Taxa de suporte:           ${((supported.length / variables.length) * 100).toFixed(1)}%\n`);

  // Componentes que precisam usar ResultContext
  if (contextRequired.length > 0) {
    console.log('⚠️  COMPONENTES QUE DEVEM USAR useResultOptional():\n');
    const componentPaths = new Set(contextRequired.map(v => {
      const parts = v.location.split('.');
      const blockIndex = parts.findIndex(p => p === 'blocks');
      return blockIndex >= 0 ? parts.slice(0, blockIndex + 2).join('.') : v.location;
    }));
    
    componentPaths.forEach(path => {
      console.log(`  • ${path}`);
    });
    console.log('');
  }

  // Variáveis suportadas disponíveis
  console.log('📚 VARIÁVEIS DISPONÍVEIS NO ResultContext:\n');
  console.log('  Usuário:');
  console.log('    • {userName} ou {username}     → Nome do usuário');
  console.log('  Estilo:');
  console.log('    • {styleName} ou {style}       → Nome do estilo predominante');
  console.log('    • {primaryStyle}               → Alias para styleName');
  console.log('  CTAs:');
  console.log('    • {ctaPrimaryText}             → Texto do CTA primário');
  console.log('    • {ctaPrimaryUrl}              → URL do CTA primário');
  console.log('    • {ctaSecondaryText}           → Texto do CTA secundário');
  console.log('    • {ctaSecondaryUrl}            → URL do CTA secundário');
  console.log('  Complementares:');
  console.log('    • {comp1Name}                  → Nome do 1º estilo complementar');
  console.log('    • {comp2Name}                  → Nome do 2º estilo complementar\n');

  process.exit(unsupported.length > 0 ? 1 : 0);
}

runTest().catch(error => {
  console.error('\n❌ Erro fatal ao executar teste:', error);
  process.exit(1);
});
