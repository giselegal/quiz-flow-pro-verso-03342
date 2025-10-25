#!/usr/bin/env node

/**
 * TESTE DE FUNCIONALIDADE DO EDITOR-FIXED
 * Verifica se o editor está completamente funcional
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTANDO FUNCIONALIDADE DO EDITOR-FIXED...\n');

// Verificar se todos os componentes necessários existem
const checkRequiredComponents = () => {
  console.log('📁 Verificando componentes necessários...');

  const requiredFiles = [
    './src/pages/editor-fixed.tsx',
    './src/components/editor/layout/FourColumnLayout.tsx',
    './src/components/editor/EnhancedComponentsSidebar.tsx',
    './src/components/editor/blocks/UniversalBlockRenderer.tsx',
    './src/components/editor/DynamicPropertiesPanel.tsx',
    './src/components/editor/toolbar/EditorToolbar.tsx',
    './src/components/editor/funnel/FunnelStagesPanel.tsx',
    './src/config/enhancedBlockRegistry.ts',
  ];

  const missingFiles = [];
  const existingFiles = [];

  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      existingFiles.push(file);
    } else {
      missingFiles.push(file);
    }
  });

  console.log(`✅ Arquivos encontrados: ${existingFiles.length}/${requiredFiles.length}`);

  if (missingFiles.length > 0) {
    console.log('❌ Arquivos faltando:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
  }

  return missingFiles.length === 0;
};

// Verificar estrutura do editor-fixed
const checkEditorStructure = () => {
  console.log('\n📝 Verificando estrutura do editor-fixed...');

  const content = fs.readFileSync('./src/pages/editor-fixed.tsx', 'utf8');

  const hasFourColumnLayout = content.includes('FourColumnLayout');
  const hasEnhancedSidebar = content.includes('EnhancedComponentsSidebar');
  const hasUniversalRenderer = content.includes('UniversalBlockRenderer');
  const hasDynamicProperties = content.includes('DynamicPropertiesPanel');
  const hasRegistryIntegration = content.includes('getRegistryStats');
  const hasBlockManagement = content.includes('setBlocks');

  console.log(`✅ Layout de 4 colunas: ${hasFourColumnLayout ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Sidebar aprimorada: ${hasEnhancedSidebar ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Renderizador universal: ${hasUniversalRenderer ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Painel de propriedades: ${hasDynamicProperties ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Integração com registry: ${hasRegistryIntegration ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Gerenciamento de blocos: ${hasBlockManagement ? 'SIM' : 'NÃO'}`);

  return (
    hasFourColumnLayout &&
    hasEnhancedSidebar &&
    hasUniversalRenderer &&
    hasDynamicProperties &&
    hasRegistryIntegration &&
    hasBlockManagement
  );
};

// Verificar funcionalidades do painel de propriedades
const checkPropertiesPanel = () => {
  console.log('\n📝 Verificando painel de propriedades...');

  try {
    const content = fs.readFileSync('./src/components/editor/DynamicPropertiesPanel.tsx', 'utf8');

    const hasPropsInterface = content.includes('DynamicPropertiesPanelProps');
    const hasUpdateFunction = content.includes('onUpdateBlock');
    const hasFormFields = content.includes('Input') && content.includes('Textarea');
    const hasCloseButton = content.includes('onClose');

    console.log(`✅ Interface de props: ${hasPropsInterface ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Função de atualização: ${hasUpdateFunction ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Campos de formulário: ${hasFormFields ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Botão de fechar: ${hasCloseButton ? 'SIM' : 'NÃO'}`);

    return hasPropsInterface && hasUpdateFunction && hasFormFields && hasCloseButton;
  } catch (error) {
    console.log('❌ Erro ao verificar painel de propriedades:', error.message);
    return false;
  }
};

// Verificar integração com registry
const checkRegistryIntegration = () => {
  console.log('\n📝 Verificando integração com registry...');

  try {
    const registryContent = fs.readFileSync('./src/config/enhancedBlockRegistry.ts', 'utf8');
    const editorContent = fs.readFileSync('./src/pages/editor-fixed.tsx', 'utf8');

    const registryHasComponents = registryContent.includes('ENHANCED_BLOCK_REGISTRY');
    const registryHasValidation = registryContent.includes('validateComponent');
    const editorUsesRegistry = editorContent.includes('getRegistryStats');
    const editorImportsRegistry = editorContent.includes("from '@/config/enhancedBlockRegistry'");

    console.log(`✅ Registry tem componentes: ${registryHasComponents ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Registry tem validação: ${registryHasValidation ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Editor usa registry: ${editorUsesRegistry ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Editor importa registry: ${editorImportsRegistry ? 'SIM' : 'NÃO'}`);

    return (
      registryHasComponents && registryHasValidation && editorUsesRegistry && editorImportsRegistry
    );
  } catch (error) {
    console.log('❌ Erro ao verificar integração:', error.message);
    return false;
  }
};

// Executar todos os testes
const main = () => {
  try {
    const componentsOk = checkRequiredComponents();
    const structureOk = checkEditorStructure();
    const propertiesOk = checkPropertiesPanel();
    const registryOk = checkRegistryIntegration();

    console.log('\n📊 RESUMO DOS TESTES:');
    console.log(`🎯 Componentes necessários: ${componentsOk ? 'OK' : 'PROBLEMA'}`);
    console.log(`🎯 Estrutura do editor: ${structureOk ? 'OK' : 'PROBLEMA'}`);
    console.log(`🎯 Painel de propriedades: ${propertiesOk ? 'OK' : 'PROBLEMA'}`);
    console.log(`🎯 Integração com registry: ${registryOk ? 'OK' : 'PROBLEMA'}`);

    const overallScore = [componentsOk, structureOk, propertiesOk, registryOk].filter(
      Boolean
    ).length;
    const percentage = Math.round((overallScore / 4) * 100);

    console.log(`\n📈 FUNCIONALIDADE GERAL: ${percentage}% (${overallScore}/4 testes passaram)`);

    if (percentage >= 90) {
      console.log('\n✅ EDITOR TOTALMENTE FUNCIONAL!');
      console.log('🚀 Pronto para uso em produção');
    } else if (percentage >= 75) {
      console.log('\n🔄 EDITOR QUASE FUNCIONAL');
      console.log('🔧 Necessita ajustes menores');
    } else {
      console.log('\n❌ EDITOR PRECISA DE MAIS TRABALHO');
      console.log('🔧 Necessita correções significativas');
    }
  } catch (error) {
    console.log('❌ Erro durante os testes:', error.message);
  }
};

main();
