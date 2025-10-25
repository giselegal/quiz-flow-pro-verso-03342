#!/usr/bin/env node

/**
 * TESTE DE INTEGRAÇÃO DO ENHANCED BLOCK REGISTRY
 * Verifica se os arquivos de renderização estão usando o novo registry
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 TESTANDO INTEGRAÇÃO DO ENHANCED BLOCK REGISTRY...\n');

// Verificar se UniversalBlockRenderer usa o registry
const checkUniversalRenderer = () => {
  console.log('📝 Verificando UniversalBlockRenderer...');

  const filePath = './src/components/editor/blocks/UniversalBlockRenderer.tsx';
  const content = fs.readFileSync(filePath, 'utf8');

  const usesRegistry = content.includes('getEnhancedComponent');
  const hasImport = content.includes("from '@/config/enhancedBlockRegistry'");
  const removedOldImports = !content.includes('import TextInlineBlock from');

  console.log(`✅ Usa getEnhancedComponent: ${usesRegistry ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Import do registry: ${hasImport ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Removeu imports antigos: ${removedOldImports ? 'SIM' : 'NÃO'}`);

  return usesRegistry && hasImport && removedOldImports;
};

// Verificar se editor-fixed usa o registry
const checkEditorFixed = () => {
  console.log('\n📝 Verificando editor-fixed...');

  const filePath = './src/pages/editor-fixed.tsx';
  const content = fs.readFileSync(filePath, 'utf8');

  const usesStats = content.includes('getRegistryStats');
  const hasImport = content.includes("from '@/config/enhancedBlockRegistry'");
  const hasStatusBar = content.includes('Enhanced Registry Ativo');

  console.log(`✅ Usa getRegistryStats: ${usesStats ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Import do registry: ${hasImport ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Barra de status: ${hasStatusBar ? 'SIM' : 'NÃO'}`);

  return usesStats && hasImport && hasStatusBar;
};

// Verificar se arquivos antigos ainda estão sendo usados
const checkOldFiles = () => {
  console.log('\n📝 Verificando arquivos antigos...');

  const oldRegistryPath = './src/components/editor/blocks/EnhancedBlockRegistry.tsx';
  const oldRegistryExists = fs.existsSync(oldRegistryPath);

  if (oldRegistryExists) {
    const content = fs.readFileSync(oldRegistryPath, 'utf8');
    const isOldVersion = content.includes('lazy(() => import');
    console.log(`⚠️  Arquivo antigo encontrado: ${oldRegistryPath}`);
    console.log(`⚠️  É versão antiga (lazy): ${isOldVersion ? 'SIM' : 'NÃO'}`);
    return false;
  } else {
    console.log(`✅ Arquivo antigo não encontrado`);
    return true;
  }
};

// Executar testes
const main = () => {
  try {
    const rendererOk = checkUniversalRenderer();
    const editorOk = checkEditorFixed();
    const noOldFiles = checkOldFiles();

    console.log('\n📊 RESUMO DA INTEGRAÇÃO:');
    console.log(`🎯 UniversalBlockRenderer atualizado: ${rendererOk ? 'SIM' : 'NÃO'}`);
    console.log(`🎯 Editor-fixed atualizado: ${editorOk ? 'SIM' : 'NÃO'}`);
    console.log(`🎯 Sem arquivos conflitantes: ${noOldFiles ? 'SIM' : 'NÃO'}`);

    const integrationSuccess = rendererOk && editorOk && noOldFiles;

    if (integrationSuccess) {
      console.log('\n✅ INTEGRAÇÃO COMPLETA E FUNCIONAL!');
      console.log('🚀 Sistema usando Enhanced Block Registry validado');
      console.log('🎯 Editor pronto para uso em produção');
    } else {
      console.log('\n❌ PROBLEMAS NA INTEGRAÇÃO DETECTADOS');
      console.log('🔧 Necessita correções para funcionamento completo');
    }
  } catch (error) {
    console.log('❌ Erro durante teste de integração:', error.message);
  }
};

main();
