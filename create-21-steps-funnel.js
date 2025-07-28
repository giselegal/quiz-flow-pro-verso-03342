#!/usr/bin/env node

/**
 * Script para criar um funil com 21 etapas configuradas no localStorage
 * Este script simula a criação do funil que o useSchemaEditor deveria fazer
 */

const fs = require('fs');

console.log('🚀 CRIANDO FUNIL COM 21 ETAPAS NO LOCALSTORAGE');
console.log('=' .repeat(60));

// Função para gerar um bloco padrão para cada tipo de página
function createDefaultBlock(pageType, pageNumber) {
  const blockId = `block-${pageNumber}-${Date.now()}`;
  
  const blockConfigs = {
    'quiz-start-page': {
      id: blockId,
      type: 'quiz-start-page',
      properties: {
        title: 'Descubra Seu Estilo Pessoal',
        subtitle: 'Responda nosso quiz personalizado e encontre seu estilo único',
        buttonText: 'Começar Quiz',
        logoUrl: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png',
        backgroundColor: '#FFFFFF',
        textColor: '#432818'
      }
    },
    'quiz-question-configurable': {
      id: blockId,
      type: 'quiz-question-configurable',
      properties: {
        question: `Questão ${pageNumber - 1}: Em qual ambiente você se sente mais à vontade?`,
        options: [
          { text: 'Em casa, no meu cantinho', value: 'home', imageUrl: '' },
          { text: 'Na natureza, ao ar livre', value: 'nature', imageUrl: '' },
          { text: 'Em festas e eventos sociais', value: 'social', imageUrl: '' },
          { text: 'Em lugares sofisticados', value: 'elegant', imageUrl: '' }
        ],
        allowMultiple: false,
        showImages: true,
        layout: '2-columns'
      }
    },
    'strategic-question': {
      id: blockId,
      type: 'strategic-question', 
      properties: {
        question: `Questão Estratégica ${pageNumber - 12}: Qual sua prioridade na escolha de roupas?`,
        options: [
          { text: 'Conforto acima de tudo', value: 'comfort', imageUrl: '' },
          { text: 'Estar sempre na moda', value: 'trendy', imageUrl: '' },
          { text: 'Qualidade e durabilidade', value: 'quality', imageUrl: '' },
          { text: 'Preço acessível', value: 'affordable', imageUrl: '' }
        ],
        allowMultiple: false,
        showImages: true,
        layout: '2-columns'
      }
    },
    'quiz-transition': {
      id: blockId,
      type: 'quiz-transition',
      properties: {
        title: 'Analisando suas respostas...',
        message: 'Estamos processando suas escolhas para criar seu perfil personalizado',
        progressText: 'Calculando resultado',
        showSpinner: true,
        backgroundColor: '#F8F9FA'
      }
    },
    'quiz-result-calculated': {
      id: blockId,
      type: 'quiz-result-calculated',
      properties: {
        title: 'Seu Resultado Personalizado',
        resultType: 'Romântico Clássico',
        compatibility: 92,
        description: 'Você tem um estilo único que combina romantismo e elegância clássica',
        characteristics: [
          'Feminino & Delicado',
          'Versatilidade',
          'Looks para todas as ocasiões'
        ],
        recommendations: [
          'Invista em peças atemporais',
          'Combine texturas suaves',
          'Use acessórios delicados'
        ]
      }
    },
    'quiz-offer-page': {
      id: blockId,
      type: 'quiz-offer-page',
      properties: {
        title: 'Oferta Especial Para Você',
        subtitle: 'Baseado no seu resultado personalizado',
        productName: 'Consultoria de Estilo Personalizada',
        price: 'R$ 97,00',
        originalPrice: 'R$ 297,00',
        discount: '67% OFF',
        features: [
          'Análise completa do seu estilo',
          'Guia personalizado de cores',
          'Dicas de combinações',
          'Suporte por 30 dias'
        ],
        buttonText: 'QUERO MINHA CONSULTORIA',
        testimonials: [
          {
            name: 'Maria Silva',
            text: 'Transformou completamente minha forma de me vestir!',
            rating: 5
          }
        ]
      }
    }
  };

  return blockConfigs[pageType] || {
    id: blockId,
    type: pageType,
    properties: {}
  };
}

// Criar estrutura do funil com 21 páginas
const funnelData = {
  id: 'template-21-etapas-completo',
  name: 'Template Oficial - 21 Etapas Completas',
  description: 'Funil completo para descoberta do estilo pessoal com 21 etapas configuradas',
  theme: 'caktoquiz',
  isPublished: false,
  pages: [],
  config: {
    name: 'Quiz de Estilo - 21 Etapas',
    description: 'Template oficial do quiz para descoberta do estilo pessoal',
    isPublished: false,
    theme: 'caktoquiz',
    primaryColor: '#B89B7A',
    secondaryColor: '#432818',
    fontFamily: 'Inter, sans-serif',
    seo: {
      title: 'Descubra Seu Estilo Pessoal - Quiz Completo',
      description: 'Quiz profissional para descoberta do seu estilo pessoal em 21 etapas'
    }
  },
  version: 1,
  lastModified: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

// Configuração das 21 etapas
const pageConfigs = [
  { type: 'quiz-start-page', name: 'Introdução ao Quiz' },
  // Questões principais (2-11)
  ...Array.from({length: 10}, (_, i) => ({ 
    type: 'quiz-question-configurable', 
    name: `Questão ${i + 1}` 
  })),
  { type: 'quiz-transition', name: 'Calculando Resultado' },
  // Questões estratégicas (13-18)  
  ...Array.from({length: 6}, (_, i) => ({ 
    type: 'strategic-question', 
    name: `Questão Estratégica ${i + 1}` 
  })),
  { type: 'quiz-transition', name: 'Preparando Resultado' },
  { type: 'quiz-result-calculated', name: 'Seu Resultado' },
  { type: 'quiz-offer-page', name: 'Oferta Especial' }
];

// Criar as 21 páginas
pageConfigs.forEach((config, index) => {
  const pageNumber = index + 1;
  const pageId = `page-${pageNumber}-${Date.now()}`;
  
  const page = {
    id: pageId,
    name: config.name,
    title: `Etapa ${pageNumber}: ${config.name}`,
    type: config.type,
    order: pageNumber,
    blocks: [createDefaultBlock(config.type, pageNumber)],
    settings: {
      backgroundColor: '#FFFFFF',
      padding: 16,
      showProgress: true,
      progressValue: Math.round((pageNumber / 21) * 100)
    }
  };
  
  funnelData.pages.push(page);
});

console.log(`✅ Criado funil com ${funnelData.pages.length} páginas`);
console.log('📋 Estrutura das páginas:');

funnelData.pages.forEach((page, index) => {
  console.log(`  ${(index + 1).toString().padStart(2, '0')}. ${page.name} (${page.type})`);
});

// Salvar dados estruturados em arquivo JSON para referência
const outputData = {
  funnel: funnelData,
  metadata: {
    createdAt: new Date().toISOString(),
    totalPages: funnelData.pages.length,
    pageTypes: [...new Set(funnelData.pages.map(p => p.type))],
    structure: funnelData.pages.map(p => ({ 
      order: p.order, 
      name: p.name, 
      type: p.type 
    }))
  }
};

fs.writeFileSync('funnel-21-etapas-template.json', JSON.stringify(outputData, null, 2));

console.log('\n🎯 RESUMO DA CRIAÇÃO:');
console.log(`📄 Total de páginas: ${funnelData.pages.length}`);
console.log(`🧩 Tipos de bloco únicos: ${[...new Set(funnelData.pages.map(p => p.type))].length}`);
console.log(`💾 Arquivo salvo: funnel-21-etapas-template.json`);

console.log('\n✅ FUNIL COM 21 ETAPAS CRIADO COM SUCESSO!');
console.log('👉 Estrutura pronta para integração com o editor');
console.log('🔗 Acesse: http://localhost:8080/editor');

// Mostrar estrutura resumida
console.log('\n📊 DISTRIBUIÇÃO DOS COMPONENTES:');
const componentCounts = {};
funnelData.pages.forEach(page => {
  componentCounts[page.type] = (componentCounts[page.type] || 0) + 1;
});

Object.entries(componentCounts).forEach(([type, count]) => {
  console.log(`  ✅ ${type}: ${count} página(s)`);
});
