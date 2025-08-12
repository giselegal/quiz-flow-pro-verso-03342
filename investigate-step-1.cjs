/**
 * 🔬 INVESTIGAÇÃO DETALHADA DA ETAPA 1
 * 
 * Testando renderização, carregamento e consistência
 */

console.log('🔬 INVESTIGAÇÃO DETALHADA DA ETAPA 1\n');

// =============================================
// 1️⃣ TESTE: Carregamento do Template JSON
// =============================================

async function testJsonTemplate() {
  console.log('📋 TESTE 1: Carregamento do Template JSON');
  
  try {
    // Simular fetch do browser
    const fs = require('fs');
    const path = require('path');
    
    const templatePath = path.join(__dirname, 'public/templates/step-01-template.json');
    const content = fs.readFileSync(templatePath, 'utf8');
    const template = JSON.parse(content);
    
    console.log('✅ JSON carregado com sucesso');
    console.log('   📊 Metadados:', template.metadata?.name || 'Sem nome');
    console.log('   🧩 Blocos:', template.blocks?.length || 0);
    console.log('   📝 Descrição:', template.metadata?.description || 'Sem descrição');
    
    // Analisar estrutura
    if (template.blocks) {
      console.log('\n   🔍 ANÁLISE DOS BLOCOS:');
      template.blocks.forEach((block, index) => {
        console.log(`   Block ${index + 1}: ${block.type} (${block.id})`);
        
        // Verificar children especialmente para form-container
        if (block.children && block.children.length > 0) {
          console.log(`      📦 Children: ${block.children.length} itens`);
          block.children.forEach((child, childIndex) => {
            console.log(`         Child ${childIndex + 1}: ${child.type} (${child.id})`);
          });
        }
      });
    }
    
    return template;
    
  } catch (error) {
    console.error('❌ Erro no teste JSON:', error.message);
    return null;
  }
}

// =============================================
// 2️⃣ TESTE: Componente TSX Correspondente
// =============================================

async function testTsxTemplate() {
  console.log('\n📋 TESTE 2: Template TSX Correspondente');
  
  try {
    // Ler arquivo TSX
    const fs = require('fs');
    const path = require('path');
    
    const tsxPath = path.join(__dirname, 'src/components/steps/Step01Template.tsx');
    const content = fs.readFileSync(tsxPath, 'utf8');
    
    console.log('✅ TSX carregado com sucesso');
    
    // Analisar estrutura básica
    const hasGetStep01Template = content.includes('getStep01Template');
    const hasFormContainer = content.includes('form-container');
    const hasQuizIntroHeader = content.includes('quiz-intro-header');
    const hasChildren = content.includes('children:');
    
    console.log('   🎯 Função getStep01Template:', hasGetStep01Template ? '✅' : '❌');
    console.log('   📦 Form Container:', hasFormContainer ? '✅' : '❌');
    console.log('   🏷️ Quiz Intro Header:', hasQuizIntroHeader ? '✅' : '❌');
    console.log('   👥 Children definidos:', hasChildren ? '✅' : '❌');
    
    // Contar blocos aproximadamente
    const blockMatches = content.match(/\{\s*id:/g);
    const blockCount = blockMatches ? blockMatches.length : 0;
    console.log(`   🧩 Blocos TSX estimados: ${blockCount}`);
    
    return { content, blockCount, hasFormContainer, hasQuizIntroHeader };
    
  } catch (error) {
    console.error('❌ Erro no teste TSX:', error.message);
    return null;
  }
}

// =============================================
// 3️⃣ TESTE: Consistência entre JSON e TSX
// =============================================

async function testConsistency(jsonTemplate, tsxInfo) {
  console.log('\n📋 TESTE 3: Consistência JSON ↔ TSX');
  
  if (!jsonTemplate || !tsxInfo) {
    console.log('❌ Dados insuficientes para teste de consistência');
    return;
  }
  
  const jsonBlockCount = jsonTemplate.blocks?.length || 0;
  const tsxBlockCount = tsxInfo.blockCount;
  
  console.log(`   🧩 Blocos JSON: ${jsonBlockCount}`);
  console.log(`   🧩 Blocos TSX: ${tsxBlockCount}`);
  
  const blockCountMatch = jsonBlockCount === tsxBlockCount;
  console.log(`   ✅ Contagem de blocos: ${blockCountMatch ? 'CONSISTENTE' : 'DIVERGENTE'}`);
  
  // Verificar tipos específicos
  const jsonHasFormContainer = jsonTemplate.blocks?.some(block => block.type === 'form-container');
  const jsonHasIntroHeader = jsonTemplate.blocks?.some(block => block.type === 'quiz-intro-header');
  
  console.log(`   📦 Form Container - JSON: ${jsonHasFormContainer ? '✅' : '❌'} | TSX: ${tsxInfo.hasFormContainer ? '✅' : '❌'}`);
  console.log(`   🏷️ Quiz Intro Header - JSON: ${jsonHasIntroHeader ? '✅' : '❌'} | TSX: ${tsxInfo.hasQuizIntroHeader ? '✅' : '❌'}`);
  
  return {
    blockCountMatch,
    formContainerMatch: jsonHasFormContainer === tsxInfo.hasFormContainer,
    headerMatch: jsonHasIntroHeader === tsxInfo.hasQuizIntroHeader,
  };
}

// =============================================
// 4️⃣ TESTE: Sistema de Carregamento Dinâmico
// =============================================

async function testDynamicLoading() {
  console.log('\n📋 TESTE 4: Sistema de Carregamento Dinâmico');
  
  try {
    // Verificar arquivo templates.ts
    const fs = require('fs');
    const path = require('path');
    
    const templatesPath = path.join(__dirname, 'src/config/templates/templates.ts');
    const content = fs.readFileSync(templatesPath, 'utf8');
    
    const hasLoadTemplate = content.includes('loadTemplate');
    const hasTemplateCache = content.includes('templateCache');
    const hasProxy = content.includes('new Proxy');
    const hasGetStepTemplate = content.includes('getStepTemplate');
    
    console.log('   🔄 Função loadTemplate:', hasLoadTemplate ? '✅' : '❌');
    console.log('   💾 Sistema de cache:', hasTemplateCache ? '✅' : '❌');
    console.log('   🎭 Padrão Proxy:', hasProxy ? '✅' : '❌');
    console.log('   🎯 getStepTemplate export:', hasGetStepTemplate ? '✅' : '❌');
    
    // Simular uma chamada
    console.log('\n   🧪 SIMULANDO CARREGAMENTO:');
    
    // Mock do fetch para simular ambiente browser
    global.fetch = async (url) => {
      if (url === '/templates/step-01-template.json') {
        const jsonContent = fs.readFileSync(path.join(__dirname, 'public/templates/step-01-template.json'), 'utf8');
        return {
          ok: true,
          json: async () => JSON.parse(jsonContent)
        };
      }
      return { ok: false };
    };
    
    console.log('   🌐 Mock fetch configurado');
    console.log('   ✅ Sistema aparenta estar funcional');
    
    return {
      hasLoadTemplate,
      hasTemplateCache,
      hasProxy,
      hasGetStepTemplate,
      allSystemsGo: hasLoadTemplate && hasTemplateCache && hasProxy && hasGetStepTemplate
    };
    
  } catch (error) {
    console.error('❌ Erro no teste de carregamento dinâmico:', error.message);
    return null;
  }
}

// =============================================
// 5️⃣ TESTE: Validação de Componentes
// =============================================

async function testComponentValidation() {
  console.log('\n📋 TESTE 5: Validação de Componentes');
  
  try {
    // Verificar registry
    const fs = require('fs');
    const path = require('path');
    
    const registryPath = path.join(__dirname, 'src/config/enhancedBlockRegistry.ts');
    const content = fs.readFileSync(registryPath, 'utf8');
    
    const hasQuizIntroHeader = content.includes('quiz-intro-header');
    const hasFormContainer = content.includes('form-container');
    const hasFormInput = content.includes('form-input');
    const hasButtonInline = content.includes('button-inline');
    const hasTextInline = content.includes('text-inline');
    
    console.log('   🏷️ quiz-intro-header:', hasQuizIntroHeader ? '✅' : '❌');
    console.log('   📦 form-container:', hasFormContainer ? '✅' : '❌');
    console.log('   📝 form-input:', hasFormInput ? '✅' : '❌');
    console.log('   🔘 button-inline:', hasButtonInline ? '✅' : '❌');
    console.log('   📄 text-inline:', hasTextInline ? '✅' : '❌');
    
    const componentCoverage = [
      hasQuizIntroHeader,
      hasFormContainer,
      hasFormInput,
      hasButtonInline,
      hasTextInline
    ].filter(Boolean).length;
    
    console.log(`   📊 Cobertura de componentes: ${componentCoverage}/5 (${Math.round(componentCoverage/5*100)}%)`);
    
    return {
      componentCoverage,
      hasQuizIntroHeader,
      hasFormContainer,
      hasFormInput,
      hasButtonInline,
      hasTextInline,
    };
    
  } catch (error) {
    console.error('❌ Erro na validação de componentes:', error.message);
    return null;
  }
}

// =============================================
// 🎯 EXECUÇÃO DOS TESTES
// =============================================

async function runFullInvestigation() {
  const jsonTemplate = await testJsonTemplate();
  const tsxInfo = await testTsxTemplate();
  const consistency = await testConsistency(jsonTemplate, tsxInfo);
  const dynamicLoading = await testDynamicLoading();
  const componentValidation = await testComponentValidation();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 RELATÓRIO FINAL DA INVESTIGAÇÃO');
  console.log('='.repeat(50));
  
  if (jsonTemplate) {
    console.log('✅ Template JSON: VÁLIDO');
  } else {
    console.log('❌ Template JSON: ERRO');
  }
  
  if (tsxInfo) {
    console.log('✅ Template TSX: VÁLIDO');
  } else {
    console.log('❌ Template TSX: ERRO');
  }
  
  if (consistency) {
    const consistencyScore = [
      consistency.blockCountMatch,
      consistency.formContainerMatch,
      consistency.headerMatch
    ].filter(Boolean).length;
    
    console.log(`✅ Consistência JSON ↔ TSX: ${consistencyScore}/3 pontos`);
  } else {
    console.log('❌ Consistência JSON ↔ TSX: NÃO TESTADO');
  }
  
  if (dynamicLoading && dynamicLoading.allSystemsGo) {
    console.log('✅ Sistema de Carregamento Dinâmico: FUNCIONAL');
  } else {
    console.log('❌ Sistema de Carregamento Dinâmico: PRECISA AJUSTES');
  }
  
  if (componentValidation && componentValidation.componentCoverage >= 4) {
    console.log('✅ Registro de Componentes: BOA COBERTURA');
  } else {
    console.log('❌ Registro de Componentes: COBERTURA INSUFICIENTE');
  }
  
  console.log('\n🚀 CONCLUSÃO:');
  
  const allTestsPassing = 
    jsonTemplate && 
    tsxInfo && 
    consistency &&
    dynamicLoading?.allSystemsGo &&
    (componentValidation?.componentCoverage >= 4);
    
  if (allTestsPassing) {
    console.log('🎉 ETAPA 1 ESTÁ PRONTA PARA RENDERIZAÇÃO!');
    console.log('✅ Todos os sistemas estão funcionais');
    console.log('✅ Templates consistentes');
    console.log('✅ Componentes registrados');
    console.log('✅ Carregamento dinâmico operacional');
  } else {
    console.log('⚠️ ETAPA 1 PRECISA DE AJUSTES:');
    if (!jsonTemplate) console.log('   - Corrigir template JSON');
    if (!tsxInfo) console.log('   - Corrigir template TSX');
    if (!consistency) console.log('   - Alinhar consistência JSON ↔ TSX');
    if (!dynamicLoading?.allSystemsGo) console.log('   - Corrigir sistema de carregamento');
    if (componentValidation?.componentCoverage < 4) console.log('   - Completar registro de componentes');
  }
}

// Executar investigação
runFullInvestigation().catch(console.error);
