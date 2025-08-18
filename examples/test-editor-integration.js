// Script de teste para execução no browser
const testEditorIntegration = () => {
  console.log('🧪 TESTANDO EDITOR-FIXED...');

  // Verificar se está na página correta
  if (window.location.pathname.includes('editor-fixed')) {
    console.log('✅ Página editor-fixed carregada');

    // Verificar elementos essenciais
    const stagesPanel = document.querySelector('[class*="stages"]');
    const canvas = document.querySelector('[class*="canvas"]');
    const propertiesPanel = document.querySelector('[class*="properties"]');

    console.log('📋 Elementos encontrados:', {
      stagesPanel: !!stagesPanel,
      canvas: !!canvas,
      propertiesPanel: !!propertiesPanel,
    });

    // Verificar se há 21 etapas visíveis
    const stageElements = document.querySelectorAll('[class*="stage"], [data-stage]');
    console.log(`📊 Etapas visíveis: ${stageElements.length}`);

    if (stageElements.length >= 21) {
      console.log('✅ 21+ etapas encontradas!');
    } else {
      console.warn(`⚠️ Apenas ${stageElements.length} etapas encontradas`);
    }
  } else {
    console.log('⚠️ Não está na página editor-fixed');
    console.log('💡 Vá para: http://localhost:8081/editor-fixed');
  }
};

// Executar teste
testEditorIntegration();
