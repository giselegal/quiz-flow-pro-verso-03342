import fs from 'fs';
import path from 'path';

// Vamos verificar se há implementações de carrossel nos componentes
function checkForCarouselImplementations() {
  const baseDir = './client/src/components/editor/blocks';
  console.log('🎠 Verificando implementações de carrossel para múltiplos itens...\n');

  if (!fs.existsSync(baseDir)) {
    console.log('❌ Diretório de componentes não encontrado!');
    return;
  }

  const allFiles = fs.readdirSync(baseDir).filter(file => file.endsWith('.tsx'));

  const carouselPatterns = [
    'carousel',
    'swiper',
    'slider',
    'overflow-x-auto',
    'overflow-x-scroll',
    'snap-x',
    'scroll-smooth',
  ];

  let carouselImplementations = [];
  let componentsWithMultipleItems = [];

  allFiles.forEach(fileName => {
    const filePath = path.join(baseDir, fileName);
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Verificar implementações de carrossel
      const hasCarousel = carouselPatterns.some(pattern => content.toLowerCase().includes(pattern));

      if (hasCarousel) {
        carouselImplementations.push({
          file: fileName,
          patterns: carouselPatterns.filter(pattern => content.toLowerCase().includes(pattern)),
        });
      }

      // Verificar componentes com múltiplos itens que poderiam beneficiar de carrossel
      const hasMultipleItems =
        content.includes('.map(') && (content.includes('grid-cols-') || content.includes('flex'));

      if (hasMultipleItems) {
        componentsWithMultipleItems.push(fileName);
      }
    } catch (error) {
      console.log(`❌ Erro ao ler ${fileName}: ${error.message}`);
    }
  });

  // Relatório de carrosseis existentes
  if (carouselImplementations.length > 0) {
    console.log('✅ COMPONENTES COM CARROSSEL IMPLEMENTADO:');
    console.log('='.repeat(50));
    carouselImplementations.forEach(impl => {
      console.log(`📁 ${impl.file}`);
      console.log(`   Padrões encontrados: ${impl.patterns.join(', ')}`);
      console.log('');
    });
  } else {
    console.log('❌ Nenhuma implementação de carrossel encontrada!');
  }

  // Componentes que poderiam se beneficiar de carrossel
  console.log('\n💡 COMPONENTES QUE PODERIAM USAR CARROSSEL:');
  console.log('='.repeat(50));

  const candidateComponents = componentsWithMultipleItems.filter(
    comp => !carouselImplementations.some(impl => impl.file === comp)
  );

  if (candidateComponents.length > 0) {
    candidateComponents.forEach(comp => {
      console.log(`📱 ${comp} - Poderia usar carrossel em mobile`);
    });
  } else {
    console.log('✅ Todos os componentes com múltiplos itens já implementam carrossel!');
  }

  // Recomendações específicas
  console.log('\n🚀 RECOMENDAÇÕES PARA CARROSSEL:');
  console.log('='.repeat(50));
  console.log('1. Use overflow-x-auto para scroll horizontal simples');
  console.log('2. Combine com snap-x snap-mandatory para navegação suave');
  console.log('3. Adicione padding-right para mostrar próximo item');
  console.log('4. Considere usar bibliotecas como Swiper.js para funcionalidades avançadas');
  console.log('5. Teste em dispositivos móveis reais');

  // Exemplo de implementação
  console.log('\n📋 EXEMPLO DE IMPLEMENTAÇÃO RESPONSIVA:');
  console.log('='.repeat(50));
  console.log(`
  {/* Layout Responsivo com Carrossel em Mobile */}
  <div className="block md:hidden">
    {/* Carrossel para mobile */}
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4">
      {items.map((item, index) => (
        <div key={index} className="flex-none w-80 snap-start">
          {/* Conteúdo do item */}
        </div>
      ))}
    </div>
  </div>
  
  <div className="hidden md:block">
    {/* Grid para desktop */}
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <div key={index}>
          {/* Conteúdo do item */}
        </div>
      ))}
    </div>
  </div>
  `);
}

checkForCarouselImplementations();
