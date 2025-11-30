/**
 * 🚀 CRIAR FUNIL COMPLETO - Quiz 21 Steps
 * 
 * Cria o funil completo de 21 etapas no banco SQLite local
 * usando o template quiz21StepsComplete.ts
 */

import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, QUIZ_GLOBAL_CONFIG } from '../src/templates/quiz21StepsComplete.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do banco de dados
const DB_PATH = path.join(__dirname, '..', 'dev.db');

console.log('📂 Caminho do banco:', DB_PATH);

// Conectar ao banco
const db = new Database(DB_PATH);

// IDs
const funnelId = `funnel-quiz21-${nanoid(8)}`;
const userId = 1; // ID do usuário padrão

/**
 * Determina o tipo de página baseado no número da etapa
 */
function getPageType(stepNumber: number): string {
  if (stepNumber === 1) return 'lead-capture';
  if (stepNumber >= 2 && stepNumber <= 11) return 'quiz-question';
  if (stepNumber === 12 || stepNumber === 19) return 'transition';
  if (stepNumber >= 13 && stepNumber <= 18) return 'strategic-question';
  if (stepNumber === 20) return 'result';
  if (stepNumber === 21) return 'offer';
  return 'content';
}

/**
 * Extrai título da página dos blocos
 */
function extractTitle(blocks: any[], stepNumber: number): string {
  // Tentar encontrar título em diferentes tipos de blocos
  const headerBlock = blocks.find(b => 
    b.type === 'quiz-intro-header' || 
    b.type === 'heading' ||
    b.type === 'quiz-result-header'
  );
  
  if (headerBlock?.content?.title) {
    return headerBlock.content.title;
  }
  
  const optionsBlock = blocks.find(b => b.type === 'options-grid');
  if (optionsBlock?.content?.question) {
    return optionsBlock.content.question;
  }
  
  // Títulos padrão baseados na etapa
  const defaultTitles: Record<number, string> = {
    1: 'Capture de Lead - Dados Iniciais',
    12: 'Transição - Análise Parcial',
    19: 'Transição - Preparando Resultado',
    20: 'Seu Resultado Personalizado',
    21: 'Oferta Especial para Você'
  };
  
  return defaultTitles[stepNumber] || `Pergunta ${stepNumber - 1}`;
}

/**
 * Cria metadata para a página
 */
function createMetadata(stepNumber: number, pageType: string): any {
  const metadata: any = {
    stepNumber,
    isQuizStep: false,
    hasScoring: false
  };
  
  if (pageType === 'quiz-question') {
    metadata.isQuizStep = true;
    metadata.hasScoring = true;
    metadata.questionType = 'multiple_choice_images';
    metadata.requiredSelections = 3;
    metadata.maxSelections = 3;
  } else if (pageType === 'strategic-question') {
    metadata.isQuizStep = true;
    metadata.questionType = 'single_choice';
    metadata.requiredSelections = 1;
    metadata.maxSelections = 1;
  } else if (pageType === 'lead-capture') {
    metadata.isLeadCapture = true;
    metadata.requiredFields = ['name', 'email'];
  } else if (pageType === 'result') {
    metadata.isResultPage = true;
    metadata.showSocialShare = true;
  } else if (pageType === 'offer') {
    metadata.isOfferPage = true;
    metadata.hasConversion = true;
  }
  
  return metadata;
}

try {
  console.log('\n🚀 Criando funil Quiz 21 Steps Complete...\n');

  // Criar dados do funil principal
  const funnel = {
    id: funnelId,
    name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
    description: 'Quiz completo para descoberta do estilo pessoal com 21 etapas: coleta de dados, 10 perguntas principais com pontuação, transições, 6 questões estratégicas e resultado personalizado com oferta.',
    user_id: userId,
    is_published: true,
    version: 2,
    settings: JSON.stringify({
      category: 'quiz',
      templateId: 'quiz21StepsComplete',
      theme: {
        primaryColor: '#8B5CF6',
        secondaryColor: '#EC4899',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#FFFFFF'
      },
      seo: {
        title: 'Quiz de Estilo Pessoal - 21 Etapas',
        description: 'Descubra seu estilo pessoal único através de um quiz completo e personalizado',
        keywords: ['quiz', 'estilo', 'personalidade', 'teste de personalidade']
      },
      analytics: {
        enabled: true,
        googleAnalyticsId: '',
        facebookPixelId: ''
      },
      utm: {
        tracking: true,
        persist: true
      },
      branding: {
        logoUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
        companyName: 'Gisele Galvão'
      },
      navigation: QUIZ_GLOBAL_CONFIG.navigation,
      validation: QUIZ_GLOBAL_CONFIG.validation,
      quiz_config: {
        totalQuestions: 10,
        strategicQuestions: 6,
        scoringSystem: 'weighted',
        autoAdvance: false,
        showProgress: true,
        multipleSelection: true,
        requiredSelections: 3,
        maxSelections: 3
      },
      persistence: {
        enabled: true,
        autoSave: true,
        storage: ['localStorage'],
        compression: false
      }
    }),
    created_at: Date.now(),
    updated_at: Date.now()
  };

  // Criar páginas do funil a partir do template
  const pages: any[] = [];
  const stepKeys = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).sort((a, b) => {
    const numA = parseInt(a.replace('step-', ''));
    const numB = parseInt(b.replace('step-', ''));
    return numA - numB;
  });

  console.log(`📄 Processando ${stepKeys.length} etapas do template...\n`);

  stepKeys.forEach((stepKey) => {
    const stepNumber = parseInt(stepKey.replace('step-', ''));
    const blocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];
    const pageType = getPageType(stepNumber);
    const title = extractTitle(blocks, stepNumber);
    const metadata = createMetadata(stepNumber, pageType);

    // Sanitizar blocos (remover funções, garantir serialização)
    const sanitizedBlocks = blocks.map(block => {
      const sanitized = { ...block };
      
      // Sanitizar propriedades
      if (sanitized.properties) {
        const props = { ...sanitized.properties };
        
        // Converter scoreValues se for objeto
        if (props.scoreValues && typeof props.scoreValues === 'object') {
          props.scoreValues = props.scoreValues;
        }
        
        // Remover funções e valores não serializáveis
        Object.keys(props).forEach(key => {
          if (typeof props[key] === 'function' || props[key] === undefined) {
            delete props[key];
          }
        });
        
        sanitized.properties = props;
      }
      
      return sanitized;
    });

    const page = {
      id: `${funnelId}-page-${stepNumber}`,
      funnel_id: funnelId,
      page_type: pageType,
      page_order: stepNumber,
      title: title,
      blocks: JSON.stringify(sanitizedBlocks),
      metadata: JSON.stringify(metadata),
      created_at: Date.now(),
      updated_at: Date.now()
    };

    pages.push(page);
    console.log(`  ✅ Etapa ${stepNumber}: ${title} (${pageType})`);
  });

  console.log('\n💾 Salvando no banco de dados...\n');

  // Inserir funnel
  const insertFunnel = db.prepare(`
    INSERT INTO funnels (id, name, description, user_id, is_published, version, settings, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFunnel.run(
    funnel.id,
    funnel.name,
    funnel.description,
    funnel.user_id,
    funnel.is_published ? 1 : 0,
    funnel.version,
    funnel.settings,
    funnel.created_at,
    funnel.updated_at
  );

  console.log('✅ Funil principal salvo');

  // Inserir páginas
  const insertPage = db.prepare(`
    INSERT INTO funnel_pages (id, funnel_id, page_type, page_order, title, blocks, metadata, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  pages.forEach((page) => {
    insertPage.run(
      page.id,
      page.funnel_id,
      page.page_type,
      page.page_order,
      page.title,
      page.blocks,
      page.metadata,
      page.created_at,
      page.updated_at
    );
  });

  console.log(`✅ ${pages.length} páginas salvas`);

  console.log('\n🎉 FUNIL CRIADO COM SUCESSO!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Detalhes do Funil:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Nome: ${funnel.name}`);
  console.log(`   ID: ${funnel.id}`);
  console.log(`   Páginas: ${pages.length} etapas`);
  console.log(`   Status: ${funnel.is_published ? '🟢 Publicado' : '🟡 Rascunho'}`);
  console.log(`   Versão: ${funnel.version}`);
  console.log('\n📊 Estrutura:');
  console.log('   • Etapa 1: Lead Capture');
  console.log('   • Etapas 2-11: Quiz Principal (10 perguntas com pontuação)');
  console.log('   • Etapa 12: Transição 1');
  console.log('   • Etapas 13-18: Questões Estratégicas (6 perguntas)');
  console.log('   • Etapa 19: Transição 2');
  console.log('   • Etapa 20: Resultado Personalizado');
  console.log('   • Etapa 21: Oferta');
  console.log('\n🔗 Acesse no editor:');
  console.log(`   http://localhost:8080/editor?funnelId=${funnel.id}`);
  console.log('\n🎯 Preview:');
  console.log(`   http://localhost:8080/preview/${funnel.id}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

} catch (error) {
  console.error('❌ Erro ao criar funil:', error);
  console.error('\n💡 Dica: Verifique se o banco de dados foi inicializado:');
  console.error('   node scripts/setup_database.js');
  process.exit(1);
} finally {
  db.close();
}
