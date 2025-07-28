// Teste para verificar se o SchemaDrivenEditorResponsive está carregado na rota /editor
console.log('🔍 Testando qual editor está na rota /editor...');

// Verificar elementos únicos do SchemaDrivenEditorResponsive
const elementsToCheck = [
  '[data-testid="editor-header"]',
  '.bg-gradient-to-br.from-\\[\\#fffaf7\\]', // Gradiente específico do editor responsivo
  'button[title="Desfazer"]', // Botão Undo
  'button[title="Refazer"]', // Botão Redo
  '.text-\\[\\#B89B7A\\]', // Cores específicas da marca
];

function checkEditorType() {
  console.log('📋 Verificando elementos do editor...');
  
  let responsiveFeatures = 0;
  
  elementsToCheck.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ Encontrado: ${selector}`);
      responsiveFeatures++;
    } else {
      console.log(`❌ Não encontrado: ${selector}`);
    }
  });
  
  // Verificar se contém texto específico do editor responsivo
  const bodyText = document.body.innerText.toLowerCase();
  const responsiveTexts = [
    'dashboard',
    'sincronizado',
    'salvando',
    'propriedades',
    'componentes'
  ];
  
  let textMatches = 0;
  responsiveTexts.forEach(text => {
    if (bodyText.includes(text)) {
      console.log(`✅ Texto encontrado: "${text}"`);
      textMatches++;
    } else {
      console.log(`❌ Texto não encontrado: "${text}"`);
    }
  });
  
  console.log(`\n📊 Resultado:`);
  console.log(`- Elementos específicos encontrados: ${responsiveFeatures}/${elementsToCheck.length}`);
  console.log(`- Textos específicos encontrados: ${textMatches}/${responsiveTexts.length}`);
  
  if (responsiveFeatures >= 2 || textMatches >= 3) {
    console.log('✅ SUCESSO: SchemaDrivenEditorResponsive está carregado!');
  } else {
    console.log('⚠️ ATENÇÃO: Pode ainda estar usando o editor simples');
  }
  
  // Verificar se há componentes React carregados
  const reactElements = document.querySelectorAll('[data-reactroot], [data-react-*]');
  console.log(`\n🔧 Elementos React encontrados: ${reactElements.length}`);
  
  return {
    responsiveFeatures,
    textMatches,
    totalReactElements: reactElements.length
  };
}

// Executar teste após carregamento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkEditorType);
} else {
  checkEditorType();
}

// Também executar após um pequeno delay para aguardar componentes lazy
setTimeout(() => {
  console.log('\n🔄 Executando verificação adicional após 2 segundos...');
  checkEditorType();
}, 2000);
