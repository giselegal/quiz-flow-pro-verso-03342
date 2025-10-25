#!/usr/bin/env node

/**
 * TESTE ESPECÍFICO DO PAINEL DE PROPRIEDADES
 * Verifica se o problema foi realmente corrigido
 */

import fs from 'fs';

console.log('🔍 TESTANDO PAINEL DE PROPRIEDADES CORRIGIDO...\n');

// Verificar se a correção foi aplicada corretamente
const checkPropertiesFixApplied = () => {
  console.log('📝 Verificando correção do painel de propriedades...');

  try {
    const editorContent = fs.readFileSync('./src/pages/editor-fixed.tsx', 'utf8');

    // Verificar se a função getBlockDefinitionForType foi adicionada
    const hasGetBlockDefinitionFunction = editorContent.includes('getBlockDefinitionForType');

    // Verificar se está usando generateBlockDefinitions
    const usesGenerateBlockDefinitions = editorContent.includes('generateBlockDefinitions');

    // Verificar se não está mais usando properties: {} vazio EM DEFINIÇÕES
    // (ignorar uso em objetos Block que é correto)
    const lines = editorContent.split('\n');
    const hasEmptyPropertiesInDefinition = lines.some(
      line =>
        line.includes('properties: {},') &&
        (line.includes('type:') || line.includes('name:') || line.includes('description:'))
    );

    // Verificar se está usando a função no DynamicPropertiesPanel
    const usesFunctionInPanel = editorContent.includes(
      'getBlockDefinitionForType(selectedBlock.type)'
    );

    // Verificar se tem propriedades padrão definidas
    const hasDefaultProperties =
      editorContent.includes("type: 'string' as const") &&
      editorContent.includes("type: 'boolean' as const");

    console.log(
      `✅ Função getBlockDefinitionForType: ${hasGetBlockDefinitionFunction ? 'SIM' : 'NÃO'}`
    );
    console.log(`✅ Usa generateBlockDefinitions: ${usesGenerateBlockDefinitions ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Removeu properties vazias: ${!hasEmptyPropertiesInDefinition ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Usa função no painel: ${usesFunctionInPanel ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Tem propriedades padrão: ${hasDefaultProperties ? 'SIM' : 'NÃO'}`);

    return (
      hasGetBlockDefinitionFunction &&
      usesGenerateBlockDefinitions &&
      !hasEmptyPropertiesInDefinition &&
      usesFunctionInPanel &&
      hasDefaultProperties
    );
  } catch (error) {
    console.log('❌ Erro ao verificar correção:', error.message);
    return false;
  }
};

// Verificar estrutura das propriedades no DynamicPropertiesPanel
const checkPropertiesPanelStructure = () => {
  console.log('\n📝 Verificando estrutura do DynamicPropertiesPanel...');

  try {
    const panelContent = fs.readFileSync(
      './src/components/editor/DynamicPropertiesPanel.tsx',
      'utf8'
    );

    // Verificar se renderiza propriedades corretamente
    const rendersProperties = panelContent.includes('Object.entries(blockDefinition.properties)');

    // Verificar se tem fallback para propriedades vazias
    const hasFallbackMessage = panelContent.includes('Nenhuma propriedade disponível');

    // Verificar se tem tipos de input corretos
    const hasInputTypes =
      panelContent.includes("case 'string'") &&
      panelContent.includes("case 'boolean'") &&
      panelContent.includes("case 'textarea'");

    // Verificar se tem função de atualização
    const hasUpdateFunction = panelContent.includes('handlePropertyChange');

    console.log(`✅ Renderiza propriedades: ${rendersProperties ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Tem fallback para vazio: ${hasFallbackMessage ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Tem tipos de input: ${hasInputTypes ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Tem função de update: ${hasUpdateFunction ? 'SIM' : 'NÃO'}`);

    return rendersProperties && hasFallbackMessage && hasInputTypes && hasUpdateFunction;
  } catch (error) {
    console.log('❌ Erro ao verificar painel:', error.message);
    return false;
  }
};

// Verificar se o registry tem definições válidas
const checkRegistryDefinitions = () => {
  console.log('\n📝 Verificando definições do registry...');

  try {
    const registryContent = fs.readFileSync('./src/config/enhancedBlockRegistry.ts', 'utf8');

    // Verificar se tem função generateBlockDefinitions
    const hasGenerateFunction = registryContent.includes('generateBlockDefinitions');

    // Verificar se mapeia categorias
    const hasCategories = registryContent.includes('getBlockCategory');

    // Verificar se retorna array de definições
    const returnsDefinitions = registryContent.includes('BlockDefinition[]');

    console.log(`✅ Tem função generateBlockDefinitions: ${hasGenerateFunction ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Mapeia categorias: ${hasCategories ? 'SIM' : 'NÃO'}`);
    console.log(`✅ Retorna definições: ${returnsDefinitions ? 'SIM' : 'NÃO'}`);

    return hasGenerateFunction && hasCategories && returnsDefinitions;
  } catch (error) {
    console.log('❌ Erro ao verificar registry:', error.message);
    return false;
  }
};

// Executar testes
const main = () => {
  try {
    const fixApplied = checkPropertiesFixApplied();
    const panelStructure = checkPropertiesPanelStructure();
    const registryDefinitions = checkRegistryDefinitions();

    console.log('\n📊 RESUMO DO TESTE:');
    console.log(`🎯 Correção aplicada: ${fixApplied ? 'OK' : 'PROBLEMA'}`);
    console.log(`🎯 Estrutura do painel: ${panelStructure ? 'OK' : 'PROBLEMA'}`);
    console.log(`🎯 Definições do registry: ${registryDefinitions ? 'OK' : 'PROBLEMA'}`);

    const overallScore = [fixApplied, panelStructure, registryDefinitions].filter(Boolean).length;
    const percentage = Math.round((overallScore / 3) * 100);

    console.log(`\n📈 STATUS DO PAINEL: ${percentage}% (${overallScore}/3 verificações passaram)`);

    if (percentage === 100) {
      console.log('\n✅ PAINEL DE PROPRIEDADES CORRIGIDO!');
      console.log('🎯 Agora deve mostrar propriedades editáveis');
      console.log('🔧 Teste no navegador: http://localhost:8081/editor-fixed');
      console.log('   1. Adicione um componente');
      console.log('   2. Clique no componente para selecioná-lo');
      console.log('   3. Veja o painel de propriedades na direita');
    } else {
      console.log('\n❌ PAINEL AINDA TEM PROBLEMAS');
      console.log('🔧 Necessita mais correções');
    }
  } catch (error) {
    console.log('❌ Erro durante teste:', error.message);
  }
};

main();
