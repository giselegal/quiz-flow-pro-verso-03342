/**
 * 🎯 CRIAR FUNIL DE EXEMPLO VÁLIDO
 * 
 * Cria um funil simples e válido no banco de dados SQLite
 * para ser editado no /editor
 */

import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do banco de dados (mesmo do setup_database.js)
const DB_PATH = path.join(__dirname, '..', 'dev.db');

console.log('📂 Caminho do banco:', DB_PATH);

// Conectar ao banco
const db = new Database(DB_PATH);

// IDs
const funnelId = `funnel-${nanoid(10)}`;
const userId = 1; // ID do usuário padrão

// Criar funnel
const funnel = {
  id: funnelId,
  name: 'Meu Primeiro Funil Editável',
  description: 'Funil de exemplo para edição no editor visual',
  user_id: userId,
  is_published: false,
  version: 1,
  settings: JSON.stringify({
    category: 'quiz',
    templateId: 'custom',
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#F9FAFB'
    },
    seo: {
      title: 'Meu Funil Incrível',
      description: 'Descubra seu perfil ideal',
      keywords: ['quiz', 'personalidade', 'estilo']
    },
    analytics: {
      enabled: true,
      googleAnalyticsId: '',
      facebookPixelId: ''
    },
    branding: {
      logoUrl: '',
      companyName: 'Minha Empresa'
    }
  }),
  created_at: Date.now(),
  updated_at: Date.now()
};

// Páginas do funil
const pages = [
  {
    id: `page-${nanoid(10)}`,
    funnel_id: funnelId,
    page_type: 'intro',
    page_order: 1,
    title: 'Bem-vindo!',
    blocks: JSON.stringify([
      {
        id: `block-${nanoid(8)}`,
        type: 'heading',
        order: 0,
        content: {
          text: 'Descubra Seu Estilo',
          level: 1,
          align: 'center'
        },
        properties: {
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: '24px'
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'text',
        order: 1,
        content: {
          text: 'Responda algumas perguntas rápidas e descubra qual é o seu estilo dominante.',
          align: 'center'
        },
        properties: {
          fontSize: '18px',
          color: '#6B7280',
          marginBottom: '32px'
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'button',
        order: 2,
        content: {
          text: 'Começar Quiz',
          action: 'next-step'
        },
        properties: {
          variant: 'primary',
          size: 'large',
          fullWidth: false
        }
      }
    ]),
    metadata: JSON.stringify({
      stepNumber: 1,
      isIntroPage: true
    }),
    created_at: Date.now(),
    updated_at: Date.now()
  },
  {
    id: `page-${nanoid(10)}`,
    funnel_id: funnelId,
    page_type: 'lead-capture',
    page_order: 2,
    title: 'Antes de começar...',
    blocks: JSON.stringify([
      {
        id: `block-${nanoid(8)}`,
        type: 'heading',
        order: 0,
        content: {
          text: 'Antes de Começar',
          level: 2,
          align: 'center'
        },
        properties: {
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'text',
        order: 1,
        content: {
          text: 'Informe seus dados para receber o resultado por email',
          align: 'center'
        },
        properties: {
          fontSize: '16px',
          marginBottom: '32px'
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'form',
        order: 2,
        content: {
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Seu nome',
              placeholder: 'Digite seu nome completo',
              required: true
            },
            {
              id: 'email',
              type: 'email',
              label: 'Seu melhor email',
              placeholder: 'seu@email.com',
              required: true
            }
          ]
        },
        properties: {
          submitText: 'Continuar',
          maxWidth: '400px'
        }
      }
    ]),
    metadata: JSON.stringify({
      stepNumber: 2,
      isLeadCapture: true,
      requiredFields: ['name', 'email']
    }),
    created_at: Date.now(),
    updated_at: Date.now()
  },
  {
    id: `page-${nanoid(10)}`,
    funnel_id: funnelId,
    page_type: 'quiz-question',
    page_order: 3,
    title: 'Pergunta 1',
    blocks: JSON.stringify([
      {
        id: `block-${nanoid(8)}`,
        type: 'heading',
        order: 0,
        content: {
          text: 'Qual seu estilo preferido?',
          level: 2,
          align: 'center'
        },
        properties: {
          fontSize: '32px',
          marginBottom: '32px'
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'quiz-options',
        order: 1,
        content: {
          options: [
            {
              id: 'opt-1',
              text: 'Clássico e Elegante',
              value: 'classic',
              score: { classic: 3, elegant: 2 }
            },
            {
              id: 'opt-2',
              text: 'Moderno e Descolado',
              value: 'modern',
              score: { modern: 3, casual: 2 }
            },
            {
              id: 'opt-3',
              text: 'Romântico e Delicado',
              value: 'romantic',
              score: { romantic: 3, soft: 2 }
            },
            {
              id: 'opt-4',
              text: 'Ousado e Criativo',
              value: 'bold',
              score: { bold: 3, creative: 2 }
            }
          ],
          multipleChoice: false
        },
        properties: {
          displayStyle: 'cards',
          columns: 2,
          showImages: false
        }
      }
    ]),
    metadata: JSON.stringify({
      stepNumber: 3,
      isQuizStep: true,
      hasScoring: true,
      questionNumber: 1
    }),
    created_at: Date.now(),
    updated_at: Date.now()
  },
  {
    id: `page-${nanoid(10)}`,
    funnel_id: funnelId,
    page_type: 'result',
    page_order: 4,
    title: 'Seu Resultado',
    blocks: JSON.stringify([
      {
        id: `block-${nanoid(8)}`,
        type: 'heading',
        order: 0,
        content: {
          text: 'Parabéns! Você é...',
          level: 2,
          align: 'center'
        },
        properties: {
          fontSize: '36px',
          marginBottom: '24px'
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'result-display',
        order: 1,
        content: {
          showPersonality: true,
          showScore: true,
          showDescription: true
        },
        properties: {
          animateIn: true
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'text',
        order: 2,
        content: {
          text: 'Baseado nas suas respostas, identificamos seu estilo dominante.',
          align: 'center'
        },
        properties: {
          fontSize: '16px',
          marginTop: '24px',
          marginBottom: '32px'
        }
      },
      {
        id: `block-${nanoid(8)}`,
        type: 'button',
        order: 3,
        content: {
          text: 'Receber Guia Completo',
          action: 'external-link',
          url: 'https://exemplo.com/guia'
        },
        properties: {
          variant: 'primary',
          size: 'large'
        }
      }
    ]),
    metadata: JSON.stringify({
      stepNumber: 4,
      isResultPage: true,
      showSocialShare: true
    }),
    created_at: Date.now(),
    updated_at: Date.now()
  }
];

try {
  console.log('\n🚀 Criando funil no banco de dados...\n');

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

  console.log('✅ Funnel criado:', funnel.name);
  console.log('   ID:', funnel.id);

  // Inserir páginas
  const insertPage = db.prepare(`
    INSERT INTO funnel_pages (id, funnel_id, page_type, page_order, title, blocks, metadata, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  pages.forEach((page, index) => {
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
    console.log(`✅ Página ${index + 1} criada: ${page.title} (${page.page_type})`);
  });

  console.log('\n🎉 Funil criado com sucesso!\n');
  console.log('📝 Detalhes:');
  console.log(`   - Nome: ${funnel.name}`);
  console.log(`   - ID: ${funnel.id}`);
  console.log('   - Páginas: ${pages.length}');
  console.log('   - Status: ${funnel.is_published ? \'Publicado\' : \'Rascunho\'}');
  console.log('\n🔗 Acesse no editor:');
  console.log(`   http://localhost:8080/editor?funnelId=${funnel.id}`);
  console.log('\n');

} catch (error) {
  console.error('❌ Erro ao criar funil:', error);
  process.exit(1);
} finally {
  db.close();
}
