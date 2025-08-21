// 🕵️ DETECTOR AUTOMÁTICO DE PONTOS CEGOS - NODE.JS
// Este script executa os testes automaticamente sem necessidade de interação manual

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🕵️ === DETECTOR AUTOMÁTICO DE PONTOS CEGOS ===');
console.log('');

// Função para testar conectividade do servidor
function testarServidor() {
  console.log('🔍 1. Testando conectividade do servidor...');

  try {
    const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8082', {
      encoding: 'utf8',
      timeout: 5000,
    });

    if (result.trim() === '200') {
      console.log('✅ Servidor respondendo em localhost:8082');
      return true;
    } else {
      console.log(`❌ Servidor retornou código: ${result.trim()}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com servidor:', error.message);
    return false;
  }
}

// Função para verificar se o EditorUnified está acessível
function testarEditorUnified() {
  console.log('🔍 2. Testando acesso ao EditorUnified...');

  try {
    const result = execSync(
      'curl -s http://localhost:8082/editor-unified | grep -c "editor-unified"',
      {
        encoding: 'utf8',
        timeout: 10000,
      }
    );

    const count = parseInt(result.trim());
    if (count > 0) {
      console.log(`✅ EditorUnified carregado (${count} referências encontradas)`);
      return true;
    } else {
      console.log('❌ EditorUnified não encontrado na página');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar EditorUnified:', error.message);
    return false;
  }
}

// Função para verificar arquivos críticos
function verificarArquivosCriticos() {
  console.log('🔍 3. Verificando arquivos críticos...');

  const arquivosCriticos = [
    'src/pages/EditorUnified.tsx',
    'src/components/editor/dnd/DraggableComponentItem.tsx',
    'src/components/editor/dnd/SortablePreviewBlockWrapper.tsx',
    'src/components/editor/sidebar/EnhancedComponentsSidebar.tsx',
    'src/components/preview/UnifiedPreviewEngine.tsx',
    'src/styles/editor-unified.css',
  ];

  const resultados = {};

  arquivosCriticos.forEach(arquivo => {
    const exists = fs.existsSync(arquivo);
    resultados[arquivo] = exists;

    if (exists) {
      const stats = fs.statSync(arquivo);
      console.log(`✅ ${arquivo} (${stats.size} bytes)`);
    } else {
      console.log(`❌ ${arquivo} - ARQUIVO AUSENTE`);
    }
  });

  return resultados;
}

// Função para verificar dependências @dnd-kit
function verificarDependenciasDndKit() {
  console.log('🔍 4. Verificando dependências @dnd-kit...');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const dndKitPackages = [
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      '@dnd-kit/modifiers',
    ];

    const resultados = {};

    dndKitPackages.forEach(pkg => {
      if (dependencies[pkg]) {
        console.log(`✅ ${pkg}: ${dependencies[pkg]}`);
        resultados[pkg] = dependencies[pkg];
      } else {
        console.log(`❌ ${pkg}: NÃO INSTALADO`);
        resultados[pkg] = null;
      }
    });

    return resultados;
  } catch (error) {
    console.log('❌ Erro ao verificar package.json:', error.message);
    return {};
  }
}

// Função para verificar build sem erros
function verificarBuild() {
  console.log('🔍 5. Verificando se build compila sem erros...');

  try {
    console.log('   Executando TypeScript check...');
    const tscResult = execSync('npx tsc --noEmit --skipLibCheck', {
      encoding: 'utf8',
      timeout: 30000,
    });

    console.log('✅ TypeScript compilation OK');
    return { typescript: true, errors: [] };
  } catch (error) {
    console.log('❌ Erros de TypeScript encontrados:');
    console.log(error.stdout || error.message);

    return {
      typescript: false,
      errors: error.stdout ? error.stdout.split('\n') : [error.message],
    };
  }
}

// Função para analisar configuração DnD no código
function analisarConfiguracaoDnd() {
  console.log('🔍 6. Analisando configuração DnD no código...');

  const resultados = {};

  try {
    // Verificar EditorUnified.tsx
    const editorUnified = fs.readFileSync('src/pages/EditorUnified.tsx', 'utf8');

    resultados.dndContext =
      editorUnified.includes('DndContext') && editorUnified.includes('DragEndEvent');
    resultados.sensors =
      editorUnified.includes('PointerSensor') && editorUnified.includes('useSensors');
    resultados.sortableContext = editorUnified.includes('SortableContext');
    resultados.handleDragEnd = editorUnified.includes('handleDragEnd');

    console.log(`   └── DndContext: ${resultados.dndContext ? '✅' : '❌'}`);
    console.log(`   └── Sensors: ${resultados.sensors ? '✅' : '❌'}`);
    console.log(`   └── SortableContext: ${resultados.sortableContext ? '✅' : '❌'}`);
    console.log(`   └── handleDragEnd: ${resultados.handleDragEnd ? '✅' : '❌'}`);

    // Verificar distância do sensor
    const sensorDistanceMatch = editorUnified.match(/distance:\s*(\d+)/);
    if (sensorDistanceMatch) {
      const distance = parseInt(sensorDistanceMatch[1]);
      resultados.sensorDistance = distance;
      console.log(`   └── Sensor distance: ${distance}px ${distance >= 8 ? '✅' : '⚠️'}`);
    } else {
      resultados.sensorDistance = null;
      console.log('   └── Sensor distance: ❌ NÃO CONFIGURADO');
    }
  } catch (error) {
    console.log('❌ Erro ao analisar EditorUnified.tsx:', error.message);
    resultados.error = error.message;
  }

  return resultados;
}

// Função para verificar CSS que pode interferir
function verificarCssInterferente() {
  console.log('🔍 7. Verificando CSS que pode interferir...');

  try {
    const cssContent = fs.readFileSync('src/styles/editor-unified.css', 'utf8');

    const problemas = [];

    // Verificar overflow: hidden
    if (cssContent.includes('overflow: hidden') || cssContent.includes('overflow:hidden')) {
      const overflowMatches = cssContent.match(/[^}]*overflow\s*:\s*hidden[^}]*/g);
      if (overflowMatches) {
        console.log('⚠️ Encontrado overflow: hidden em:');
        overflowMatches.forEach((match, i) => {
          console.log(`     ${i + 1}. ${match.trim().substring(0, 50)}...`);
        });
        problemas.push('overflow: hidden encontrado');
      }
    }

    // Verificar pointer-events: none
    if (cssContent.includes('pointer-events: none') || cssContent.includes('pointer-events:none')) {
      console.log('⚠️ Encontrado pointer-events: none');
      problemas.push('pointer-events: none encontrado');
    }

    // Verificar z-index muito baixo
    const zIndexMatches = cssContent.match(/z-index\s*:\s*(-?\d+)/g);
    if (zIndexMatches) {
      zIndexMatches.forEach(match => {
        const value = parseInt(match.match(/-?\d+/)[0]);
        if (value < 0) {
          console.log(`⚠️ z-index negativo encontrado: ${value}`);
          problemas.push(`z-index negativo: ${value}`);
        }
      });
    }

    if (problemas.length === 0) {
      console.log('✅ Nenhum problema CSS interferente detectado');
    }

    return { problemas };
  } catch (error) {
    console.log('❌ Erro ao verificar CSS:', error.message);
    return { error: error.message };
  }
}

// Função principal para executar todos os testes
function executarTodosOsTestes() {
  console.log('🚀 === EXECUTANDO TODOS OS TESTES AUTOMÁTICOS ===');
  console.log('');

  const resultados = {};

  resultados.servidor = testarServidor();
  resultados.editorUnified = testarEditorUnified();
  resultados.arquivos = verificarArquivosCriticos();
  resultados.dependencias = verificarDependenciasDndKit();
  resultados.build = verificarBuild();
  resultados.configuracaoDnd = analisarConfiguracaoDnd();
  resultados.css = verificarCssInterferente();

  console.log('');
  console.log('📊 === ANÁLISE FINAL DOS PONTOS CEGOS ===');

  const pontosCegos = [];
  const warnings = [];

  // Análise crítica
  if (!resultados.servidor) {
    pontosCegos.push('❌ CRÍTICO: Servidor não está respondendo');
  }

  if (!resultados.editorUnified) {
    pontosCegos.push('❌ CRÍTICO: EditorUnified não está carregando');
  }

  const arquivosAusentes = Object.entries(resultados.arquivos)
    .filter(([file, exists]) => !exists)
    .map(([file]) => file);

  if (arquivosAusentes.length > 0) {
    pontosCegos.push(`❌ CRÍTICO: Arquivos ausentes: ${arquivosAusentes.join(', ')}`);
  }

  const dependenciasAusentes = Object.entries(resultados.dependencias)
    .filter(([pkg, version]) => !version)
    .map(([pkg]) => pkg);

  if (dependenciasAusentes.length > 0) {
    pontosCegos.push(`❌ CRÍTICO: Dependências ausentes: ${dependenciasAusentes.join(', ')}`);
  }

  if (!resultados.build.typescript) {
    pontosCegos.push('❌ CRÍTICO: Erros de TypeScript impedem compilação');
  }

  if (!resultados.configuracaoDnd.dndContext) {
    pontosCegos.push('❌ CRÍTICO: DndContext não configurado');
  }

  if (!resultados.configuracaoDnd.handleDragEnd) {
    pontosCegos.push('❌ CRÍTICO: handleDragEnd não implementado');
  }

  // Análise de warnings
  if (!resultados.configuracaoDnd.sensors) {
    warnings.push('⚠️ Sensors não configurados adequadamente');
  }

  if (resultados.configuracaoDnd.sensorDistance && resultados.configuracaoDnd.sensorDistance < 8) {
    warnings.push(`⚠️ Sensor distance muito baixo: ${resultados.configuracaoDnd.sensorDistance}px`);
  }

  if (resultados.css.problemas && resultados.css.problemas.length > 0) {
    warnings.push('⚠️ CSS pode estar interferindo com DnD');
  }

  // Relatório final
  console.log('');
  if (pontosCegos.length === 0) {
    console.log('🎉 === NENHUM PONTO CEGO CRÍTICO DETECTADO ===');
    console.log('✅ Todos os componentes fundamentais estão presentes');
    console.log('✅ Configuração DnD parece estar correta');
    console.log('✅ Build compila sem erros críticos');
    console.log('');
    console.log('💡 Se drag & drop ainda não funciona, verifique:');
    console.log('   1. Execute os testes no browser (detectarPontosCegos())');
    console.log('   2. Verifique console do browser para erros JavaScript');
    console.log('   3. Teste funcionalidade com testeInterativo()');
  } else {
    console.log('🚨 === PONTOS CEGOS CRÍTICOS DETECTADOS ===');
    pontosCegos.forEach(ponto => console.log(`   ${ponto}`));
  }

  if (warnings.length > 0) {
    console.log('');
    console.log('⚠️ === WARNINGS DETECTADOS ===');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  console.log('');
  console.log('📝 === PRÓXIMOS PASSOS ===');
  console.log('1. Execute os testes no browser: http://localhost:8082/editor-unified');
  console.log('2. Abra DevTools (F12) e execute: detectarPontosCegos()');
  console.log('3. Se elementos estão presentes, execute: testeInterativo()');
  console.log('4. Analise console para erros JavaScript em tempo real');

  return resultados;
}

// Executar os testes
const module = await import('module');
const require = module.createRequire(import.meta.url);

if (import.meta.url === `file://${process.argv[1]}`) {
  executarTodosOsTestes();
}
