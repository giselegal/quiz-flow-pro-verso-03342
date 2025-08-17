/**
 * 🧪 TESTE DE ALINHAMENTO - Sistema das 21 Etapas
 *
 * Verifica se todo o fluxo do /editor-fixed está alinhado
 */

import { useJsonTemplate } from './src/components/editor-fixed/JsonTemplateEngine';
import { TemplateAdapter } from './src/components/editor-fixed/TemplateAdapter';

async function testSystemAlignment() {
  console.log('🔍 Iniciando teste de alinhamento do sistema das 21 etapas...\n');

  const results = {
    templatesFound: 0,
    templatesConverted: 0,
    errors: [] as string[],
    warnings: [] as string[],
    components: 0,
  };

  // 1. Verificar templates disponíveis
  console.log('1️⃣ Verificando templates disponíveis...');

  for (let step = 1; step <= 21; step++) {
    try {
      const stepId = step.toString().padStart(2, '0');
      const templatePath = `/public/templates/step-${stepId}-template.json`;

      // Verificar se existe
      const response = await fetch(`http://localhost:5173${templatePath}`);
      if (response.ok) {
        results.templatesFound++;
        console.log(`✅ Template ${step} encontrado`);

        // Testar conversão
        try {
          const template = await TemplateAdapter.loadStepTemplate(step);
          if (template) {
            results.templatesConverted++;
            console.log(
              `🔄 Template ${step} convertido com sucesso (${template.blocks.length} blocos)`
            );
          } else {
            results.errors.push(`Template ${step} não pôde ser convertido`);
          }
        } catch (error) {
          results.errors.push(`Erro na conversão do template ${step}: ${error}`);
        }
      } else {
        results.warnings.push(`Template ${step} não encontrado`);
      }
    } catch (error) {
      results.errors.push(`Erro ao verificar template ${step}: ${error}`);
    }
  }

  // 2. Verificar componentes disponíveis
  console.log('\n2️⃣ Verificando componentes disponíveis...');

  try {
    const { getAvailableComponents } = useJsonTemplate();
    const components = getAvailableComponents();
    results.components = components.length;

    console.log(`📦 ${components.length} componentes disponíveis no registry`);

    // Mostrar algumas categorias
    const categories = [...new Set(components.map(c => c.category))];
    console.log(`📝 Categorias: ${categories.join(', ')}`);
  } catch (error) {
    results.errors.push(`Erro ao obter componentes: ${error}`);
  }

  // 3. Relatório final
  console.log('\n📊 RELATÓRIO FINAL:');
  console.log(`✅ Templates encontrados: ${results.templatesFound}/21`);
  console.log(`🔄 Templates convertidos: ${results.templatesConverted}/21`);
  console.log(`📦 Componentes disponíveis: ${results.components}`);

  if (results.warnings.length > 0) {
    console.log('\n⚠️ AVISOS:');
    results.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (results.errors.length > 0) {
    console.log('\n❌ ERROS:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }

  // 4. Resultado final
  const isAligned =
    results.templatesFound === 21 &&
    results.templatesConverted === 21 &&
    results.errors.length === 0 &&
    results.components > 0;

  if (isAligned) {
    console.log('\n🎉 SISTEMA TOTALMENTE ALINHADO!');
    console.log('✨ Todas as 21 etapas estão funcionando perfeitamente');
  } else {
    console.log('\n⚠️ SISTEMA REQUER AJUSTES:');
    console.log('🔧 Algumas etapas precisam de correções');
  }

  return {
    isAligned,
    ...results,
  };
}

// Executar se chamado diretamente
if (require.main === module) {
  testSystemAlignment().catch(console.error);
}

export { testSystemAlignment };
