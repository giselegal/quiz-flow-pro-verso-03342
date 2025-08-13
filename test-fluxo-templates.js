// Teste de diagnóstico do fluxo de templates
const { getStepTemplate } = require('./src/config/templates/templates.ts');
const templateService = require('./src/services/templateService.ts').templateService;
const { TemplateManager } = require('./src/utils/TemplateManager.ts');

async function diagnosticarFluxo() {
  console.log('🔍 DIAGNÓSTICO DO FLUXO DE TEMPLATES\n');

  // Teste 1: getStepTemplate direto
  console.log('1️⃣ Testando getStepTemplate direto...');
  try {
    const template = await getStepTemplate(1);
    console.log('✅ getStepTemplate(1):', {
      existe: !!template,
      loading: template?.__loading,
      blocksCount: template?.blocks?.length || 0,
      metadata: template?.metadata?.name,
    });
  } catch (error) {
    console.log('❌ Erro no getStepTemplate:', error.message);
  }

  // Teste 2: templateService.getTemplateByStep
  console.log('\n2️⃣ Testando templateService.getTemplateByStep...');
  try {
    const template = await templateService.getTemplateByStep(1);
    console.log('✅ templateService.getTemplateByStep(1):', {
      existe: !!template,
      loading: template?.__loading,
      blocksCount: template?.blocks?.length || 0,
      metadata: template?.metadata?.name,
    });
  } catch (error) {
    console.log('❌ Erro no templateService:', error.message);
  }

  // Teste 3: TemplateManager.loadStepBlocks
  console.log('\n3️⃣ Testando TemplateManager.loadStepBlocks...');
  try {
    const blocks = await TemplateManager.loadStepBlocks('step-01');
    console.log('✅ TemplateManager.loadStepBlocks("step-01"):', {
      blocksCount: blocks?.length || 0,
      blockTypes: blocks?.map(b => b.type) || [],
      blockIds: blocks?.map(b => b.id) || [],
    });
  } catch (error) {
    console.log('❌ Erro no TemplateManager:', error.message);
  }

  // Teste 4: Verificar se JSON é acessível via fetch
  console.log('\n4️⃣ Testando fetch direto do JSON...');
  try {
    const response = await fetch('http://localhost:8084/templates/step-01-template.json');
    if (response.ok) {
      const json = await response.json();
      console.log('✅ Fetch direto do JSON:', {
        status: response.status,
        blocksCount: json?.blocks?.length || 0,
        metadata: json?.metadata?.name,
      });
    } else {
      console.log('❌ Fetch falhou:', response.status);
    }
  } catch (error) {
    console.log('❌ Erro no fetch:', error.message);
  }

  console.log('\n🔍 Diagnóstico concluído!');
}

diagnosticarFluxo().catch(console.error);
