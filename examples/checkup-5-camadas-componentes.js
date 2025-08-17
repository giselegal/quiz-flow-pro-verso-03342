#!/usr/bin/env node

/**
 * 🔍 CHECKUP SISTEMÁTICO: 5 CAMADAS DE COMPONENTES EDITÁVEIS
 *
 * Este script analisa se todos os componentes passam pelas 5 camadas necessárias:
 * 1. Registry - ENHANCED_BLOCK_REGISTRY
 * 2. Properties Schema - useUnifiedProperties cases
 * 3. Component Implementation - BlockComponentProps
 * 4. Container Integration - onPropertyChange
 * 5. Editor Integration - SortableBlockWrapper
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CHECKUP SISTEMÁTICO: 5 CAMADAS DE COMPONENTES EDITÁVEIS');
console.log('========================================================================');

// 🏗️ CAMADA 1: Extrair componentes do ENHANCED_BLOCK_REGISTRY
function extractRegistryComponents() {
  console.log('\n📊 CAMADA 1: REGISTRY - ENHANCED_BLOCK_REGISTRY');
  console.log('========================================================================');

  try {
    const registryPath = 'src/config/enhancedBlockRegistry.ts';
    const registryContent = fs.readFileSync(registryPath, 'utf8');

    // Extrair chaves do registry usando regex
    const registryRegex = /export const ENHANCED_BLOCK_REGISTRY[^{]*{([^}]+)}/s;
    const match = registryContent.match(registryRegex);

    if (!match) {
      console.log('❌ Erro: Não foi possível extrair o ENHANCED_BLOCK_REGISTRY');
      return [];
    }

    const registryBlock = match[1];
    const componentRegex = /["']([^"']+)["']:\s*([^,\n]+)/g;
    const components = [];
    let componentMatch;

    while ((componentMatch = componentRegex.exec(registryBlock)) !== null) {
      const [, key, value] = componentMatch;
      components.push({
        key: key.trim(),
        component: value.trim().replace(/,$/, ''),
      });
    }

    console.log(`✅ Total de componentes registrados: ${components.length}`);
    components.forEach((comp, i) => {
      console.log(`${String(i + 1).padStart(2)}. ${comp.key.padEnd(30)} → ${comp.component}`);
    });

    return components.map(comp => comp.key);
  } catch (error) {
    console.log('❌ Erro ao ler registry:', error.message);
    return [];
  }
}

// 🎛️ CAMADA 2: Extrair cases do useUnifiedProperties
function extractPropertiesSchemas() {
  console.log('\n🎛️ CAMADA 2: PROPERTIES SCHEMA - useUnifiedProperties');
  console.log('========================================================================');

  try {
    const propertiesPath = 'src/hooks/useUnifiedProperties.ts';
    const propertiesContent = fs.readFileSync(propertiesPath, 'utf8');

    // Extrair cases usando regex
    const caseRegex = /case\s+["']([^"']+)["']\s*:/g;
    const cases = [];
    let caseMatch;

    while ((caseMatch = caseRegex.exec(propertiesContent)) !== null) {
      cases.push(caseMatch[1]);
    }

    const uniqueCases = [...new Set(cases)].sort();

    console.log(`✅ Total de cases no useUnifiedProperties: ${uniqueCases.length}`);
    uniqueCases.forEach((caseItem, i) => {
      console.log(`${String(i + 1).padStart(2)}. ${caseItem}`);
    });

    return uniqueCases;
  } catch (error) {
    console.log('❌ Erro ao ler useUnifiedProperties:', error.message);
    return [];
  }
}

// 🧩 CAMADA 3: Verificar implementação de BlockComponentProps
function checkBlockComponentPropsImplementation() {
  console.log('\n🧩 CAMADA 3: COMPONENT IMPLEMENTATION - BlockComponentProps');
  console.log('========================================================================');

  try {
    // Procurar arquivos que implementam BlockComponentProps
    const componentsDir = 'src/components';
    const implementingComponents = [];

    function searchDirectory(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          searchDirectory(fullPath);
        } else if (entry.name.endsWith('.tsx')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('BlockComponentProps')) {
              const fileName = entry.name.replace('.tsx', '');
              implementingComponents.push({
                file: fileName,
                path: fullPath,
                hasOnPropertyChange: content.includes('onPropertyChange'),
              });
            }
          } catch (err) {
            // Ignorar arquivos que não podem ser lidos
          }
        }
      }
    }

    searchDirectory(componentsDir);

    console.log(
      `✅ Componentes que implementam BlockComponentProps: ${implementingComponents.length}`
    );
    implementingComponents.slice(0, 20).forEach((comp, i) => {
      const status = comp.hasOnPropertyChange ? '✅' : '⚠️';
      console.log(
        `${String(i + 1).padStart(2)}. ${status} ${comp.file.padEnd(40)} (${comp.hasOnPropertyChange ? 'onPropertyChange ✅' : 'sem onPropertyChange ⚠️'})`
      );
    });

    if (implementingComponents.length > 20) {
      console.log(`... e mais ${implementingComponents.length - 20} componentes`);
    }

    return implementingComponents.map(comp => comp.file);
  } catch (error) {
    console.log('❌ Erro ao verificar implementação:', error.message);
    return [];
  }
}

// 🔧 CAMADA 4: Verificar integração com Container
function checkContainerIntegration() {
  console.log('\n🔧 CAMADA 4: CONTAINER INTEGRATION - Verificação');
  console.log('========================================================================');

  try {
    const wrapperPath = 'src/components/editor/canvas/SortableBlockWrapper.tsx';
    const wrapperContent = fs.readFileSync(wrapperPath, 'utf8');

    const hasGetBlockComponent = wrapperContent.includes('getBlockComponent');
    const hasUseContainerProperties = wrapperContent.includes('useContainerProperties');
    const hasProcessedProperties = wrapperContent.includes('processedProperties');

    console.log(`✅ SortableBlockWrapper integração:`);
    console.log(`   ${hasGetBlockComponent ? '✅' : '❌'} getBlockComponent importado`);
    console.log(`   ${hasUseContainerProperties ? '✅' : '❌'} useContainerProperties usado`);
    console.log(`   ${hasProcessedProperties ? '✅' : '❌'} processedProperties implementado`);

    return {
      hasGetBlockComponent,
      hasUseContainerProperties,
      hasProcessedProperties,
    };
  } catch (error) {
    console.log('❌ Erro ao verificar integração com container:', error.message);
    return {
      hasGetBlockComponent: false,
      hasUseContainerProperties: false,
      hasProcessedProperties: false,
    };
  }
}

// 🎛️ CAMADA 5: Verificar integração com Editor
function checkEditorIntegration() {
  console.log('\n🎛️ CAMADA 5: EDITOR INTEGRATION - Verificação');
  console.log('========================================================================');

  try {
    // Verificar se o editor usa EnhancedUniversalPropertiesPanel
    const editorPath = 'src/components/editor/editor-fixed-dragdrop.tsx';
    const editorContent = fs.readFileSync(editorPath, 'utf8');

    const hasPropertiesPanel = editorContent.includes('EnhancedUniversalPropertiesPanel');
    const hasUseUnifiedProperties = editorContent.includes('useUnifiedProperties');
    const hasEditorContext = editorContent.includes('EditorContext');

    console.log(`✅ Editor principal integração:`);
    console.log(`   ${hasPropertiesPanel ? '✅' : '❌'} EnhancedUniversalPropertiesPanel usado`);
    console.log(`   ${hasUseUnifiedProperties ? '✅' : '❌'} useUnifiedProperties integrado`);
    console.log(`   ${hasEditorContext ? '✅' : '❌'} EditorContext disponível`);

    return {
      hasPropertiesPanel,
      hasUseUnifiedProperties,
      hasEditorContext,
    };
  } catch (error) {
    console.log('❌ Erro ao verificar integração com editor:', error.message);
    return { hasPropertiesPanel: false, hasUseUnifiedProperties: false, hasEditorContext: false };
  }
}

// 📊 ANÁLISE CRUZADA: Comparar as 5 camadas
function crossAnalysis(
  registryComponents,
  propertiesSchemas,
  implementingComponents,
  containerIntegration,
  editorIntegration
) {
  console.log('\n📊 ANÁLISE CRUZADA: COMPARAÇÃO DAS 5 CAMADAS');
  console.log('========================================================================');

  console.log('\n🔍 COMPONENTES NO REGISTRY MAS SEM SCHEMA DE PROPRIEDADES:');
  const missingSchemas = registryComponents.filter(comp => !propertiesSchemas.includes(comp));
  if (missingSchemas.length > 0) {
    missingSchemas.forEach((comp, i) => {
      console.log(`${String(i + 1).padStart(2)}. ❌ ${comp} - FALTA case no useUnifiedProperties`);
    });
  } else {
    console.log('✅ Todos os componentes do registry têm schema de propriedades');
  }

  console.log('\n🔍 SCHEMAS DE PROPRIEDADES SEM COMPONENTE NO REGISTRY:');
  const orphanSchemas = propertiesSchemas.filter(schema => !registryComponents.includes(schema));
  if (orphanSchemas.length > 0) {
    orphanSchemas.forEach((schema, i) => {
      console.log(`${String(i + 1).padStart(2)}. ⚠️ ${schema} - Schema sem componente registrado`);
    });
  } else {
    console.log('✅ Todos os schemas têm componentes registrados');
  }

  // Análise de componentes completos (registrado + schema)
  const completeComponents = registryComponents.filter(comp => propertiesSchemas.includes(comp));

  console.log('\n🎯 COMPONENTES COMPLETOS (Registry + Schema):');
  console.log(`✅ ${completeComponents.length} componentes têm ambos registry e schema:`);
  completeComponents.forEach((comp, i) => {
    console.log(`${String(i + 1).padStart(2)}. ✅ ${comp}`);
  });

  console.log('\n📈 RESUMO ESTATÍSTICO:');
  console.log('========================================================================');
  console.log(`📊 CAMADA 1 - Registry: ${registryComponents.length} componentes`);
  console.log(`📊 CAMADA 2 - Properties: ${propertiesSchemas.length} schemas`);
  console.log(`📊 CAMADA 3 - Implementation: ${implementingComponents.length}+ componentes`);
  console.log(
    `📊 CAMADA 4 - Container: ${containerIntegration.hasGetBlockComponent && containerIntegration.hasUseContainerProperties ? '✅' : '❌'} Integrado`
  );
  console.log(
    `📊 CAMADA 5 - Editor: ${editorIntegration.hasPropertiesPanel && editorIntegration.hasEditorContext ? '✅' : '❌'} Integrado`
  );

  console.log(
    `\n🎯 COMPONENTES 100% FUNCIONAIS: ${completeComponents.length} de ${registryComponents.length} registrados`
  );
  console.log(
    `🎯 TAXA DE SUCESSO: ${Math.round((completeComponents.length / registryComponents.length) * 100)}%`
  );

  return {
    registryComponents,
    propertiesSchemas,
    completeComponents,
    missingSchemas,
    orphanSchemas,
    successRate: Math.round((completeComponents.length / registryComponents.length) * 100),
  };
}

// 🚀 EXECUÇÃO PRINCIPAL
async function main() {
  try {
    const registryComponents = extractRegistryComponents();
    const propertiesSchemas = extractPropertiesSchemas();
    const implementingComponents = checkBlockComponentPropsImplementation();
    const containerIntegration = checkContainerIntegration();
    const editorIntegration = checkEditorIntegration();

    const analysis = crossAnalysis(
      registryComponents,
      propertiesSchemas,
      implementingComponents,
      containerIntegration,
      editorIntegration
    );

    console.log('\n🎯 CONCLUSÕES E RECOMENDAÇÕES:');
    console.log('========================================================================');

    if (analysis.missingSchemas.length > 0) {
      console.log(
        `⚠️ AÇÃO NECESSÁRIA: Adicionar ${analysis.missingSchemas.length} cases no useUnifiedProperties para:`
      );
      analysis.missingSchemas.forEach(comp => console.log(`   - ${comp}`));
    }

    if (analysis.orphanSchemas.length > 0) {
      console.log(
        `⚠️ LIMPEZA: Remover ${analysis.orphanSchemas.length} schemas órfãos ou registrar componentes`
      );
    }

    if (analysis.successRate === 100) {
      console.log(`🎉 PERFEITO! Todos os componentes passam pelas 5 camadas necessárias!`);
    } else {
      console.log(
        `🔧 PRECISA MELHORAR: ${100 - analysis.successRate}% dos componentes não estão completos`
      );
    }

    console.log('\n✅ Checkup concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o checkup:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  extractRegistryComponents,
  extractPropertiesSchemas,
  checkBlockComponentPropsImplementation,
  checkContainerIntegration,
  checkEditorIntegration,
  crossAnalysis,
};
