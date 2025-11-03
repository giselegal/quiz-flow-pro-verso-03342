/**
 * 🔄 SCRIPT DE CONVERSÃO v3.1 → v2.0
 * 
 * Converte templates v3.1 (blocos compostos) para v2.0 (blocos atômicos)
 * 
 * Uso:
 * ```bash
 * npx tsx scripts/convert-templates-v31-to-v20.ts
 * ```
 */

import * as fs from 'fs';
import * as path from 'path';

interface BlockV31 {
  id: string;
  type: string;
  config?: any;
  properties?: any;
}

interface BlockV20 {
  id: string;
  type: string;
  properties: Record<string, any>;
}

interface TemplateV31 {
  templateVersion: string;
  metadata: any;
  theme?: any;
  blocks: BlockV31[];
  analytics?: any;
}

interface TemplateV20 {
  templateVersion: string;
  metadata: any;
  design?: any;
  layout?: any;
  blocks: BlockV20[];
  validation?: any;
  analytics?: any;
  logic?: any;
  performance?: any;
  accessibility?: any;
  updatedAt: string;
}

/**
 * Converter hero-block → blocos atômicos
 */
function convertHeroBlock(block: BlockV31, stepNumber: number): BlockV20[] {
  const config = block.config || block.properties || {};
  const blocks: BlockV20[] = [];

  // 1. Header com logo
  if (config.logoUrl) {
    blocks.push({
      id: `step${stepNumber.toString().padStart(2, '0')}-header`,
      type: 'quiz-intro-header',
      properties: {
        logoUrl: config.logoUrl,
        logoAlt: config.logoAlt || 'Logo',
        logoWidth: 120,
        logoHeight: 50,
        showProgress: false,
        showBackButton: false,
        containerWidth: 'full',
        spacing: 'small',
        showLogo: true,
        backgroundColor: '#FFFFFF',
        textColor: '#432818',
        paddingTop: 16,
        paddingBottom: 16,
        marginBottom: 24,
        type: 'quiz-intro-header',
      },
    });
  }

  // 2. Título principal
  if (config.titleHtml) {
    blocks.push({
      id: `${block.id}-title`,
      type: 'text-inline',
      properties: {
        content: config.titleHtml,
        fontSize: 'text-2xl sm:text-3xl md:text-4xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        fontFamily: "'Playfair Display', serif",
        containerWidth: 'full',
        spacing: 'small',
      },
    });
  }

  // 3. Imagem hero
  if (config.imageUrl) {
    blocks.push({
      id: `${block.id}-image`,
      type: 'image-inline',
      properties: {
        src: config.imageUrl,
        alt: config.imageAlt || 'Imagem ilustrativa',
        width: 400,
        height: 300,
        aspectRatio: '4/3',
        className: 'mx-auto rounded-lg shadow-sm',
        containerWidth: 'full',
        spacing: 'small',
        priority: true,
        loading: 'eager',
      },
    });
  }

  // 4. Subtítulo/descrição
  if (config.subtitleHtml) {
    blocks.push({
      id: `${block.id}-description`,
      type: 'text-inline',
      properties: {
        content: config.subtitleHtml,
        fontSize: 'text-sm sm:text-base',
        textAlign: 'text-center',
        color: '#6B7280',
        marginTop: 16,
        marginBottom: 24,
        containerWidth: 'full',
        spacing: 'small',
      },
    });
  }

  return blocks;
}

/**
 * Converter welcome-form-block → lead-form
 */
function convertWelcomeFormBlock(block: BlockV31): BlockV20[] {
  const config = block.config || block.properties || {};
  
  return [
    {
      id: block.id,
      type: 'lead-form',
      properties: {
        showNameField: true,
        showEmailField: false,
        showPhoneField: false,
        nameLabel: 'NOME',
        namePlaceholder: config.placeholder || 'Digite seu nome',
        submitText: config.buttonText || 'Continuar',
        loadingText: 'Digite seu nome para continuar',
        successText: 'Perfeito! Vamos descobrir seu estilo!',
        requiredFields: 'name',
        backgroundColor: '#FFFFFF',
        borderColor: '#B89B7A',
        textColor: '#432818',
        primaryColor: '#B89B7A',
        marginTop: 32,
        marginBottom: 8,
        fieldSpacing: 6,
      },
    },
  ];
}

/**
 * Converter question-block → blocos atômicos
 */
function convertQuestionBlock(block: BlockV31, stepNumber: number): BlockV20[] {
  const config = block.config || block.properties || {};
  const blocks: BlockV20[] = [];

  // 1. Header com logo e progress
  blocks.push({
    id: `step${stepNumber.toString().padStart(2, '0')}-header`,
    type: 'quiz-question-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      showProgress: true,
      progressValue: stepNumber,
      progressMax: 21,
      showBackButton: true,
      containerWidth: 'full',
      spacing: 'small',
    },
  });

  // 2. Título da pergunta
  blocks.push({
    id: `${block.id}-title`,
    type: 'question-text',
    properties: {
      content: config.questionText || '',
      questionNumber: config.questionNumber || '',
      fontSize: 'text-xl sm:text-2xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 24,
    },
  });

  // 3. Grid de opções
  if (config.options && Array.isArray(config.options)) {
    blocks.push({
      id: `${block.id}-options`,
      type: 'options-grid',
      properties: {
        options: config.options,
        multiSelect: (config.requiredSelections || 1) > 1,
        requiredSelections: config.requiredSelections || 1,
        layout: 'grid',
        columns: 2,
        spacing: 16,
        optionStyle: 'card',
      },
    });
  }

  return blocks;
}

/**
 * Converter template completo v3.1 → v2.0
 */
function convertTemplate(templateV31: TemplateV31, stepNumber: number): TemplateV20 {
  const convertedBlocks: BlockV20[] = [];

  for (const block of templateV31.blocks) {
    switch (block.type) {
      case 'hero-block':
        convertedBlocks.push(...convertHeroBlock(block, stepNumber));
        break;
      
      case 'welcome-form-block':
        convertedBlocks.push(...convertWelcomeFormBlock(block));
        break;
      
      case 'question-block':
        convertedBlocks.push(...convertQuestionBlock(block, stepNumber));
        break;
      
      default:
        // Bloco desconhecido: copiar como está, convertendo config → properties
        convertedBlocks.push({
          id: block.id,
          type: block.type,
          properties: block.properties || block.config || {},
        });
    }
  }

  // Montar template v2.0
  const templateV20: TemplateV20 = {
    templateVersion: '2.0',
    metadata: {
      ...templateV31.metadata,
      id: `quiz-step-${stepNumber.toString().padStart(2, '0')}`,
      type: templateV31.metadata.category || 'question',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'giselegal',
    },
    design: {
      primaryColor: templateV31.theme?.colors?.primary || '#B89B7A',
      secondaryColor: templateV31.theme?.colors?.secondary || '#432818',
      backgroundColor: templateV31.theme?.colors?.background || '#FAF9F7',
      fontFamily: "'Playfair Display', 'Inter', serif",
      button: {
        background: 'linear-gradient(90deg, #B89B7A, #aa6b5d)',
        textColor: '#fff',
        borderRadius: '10px',
        shadow: '0 4px 14px rgba(184, 155, 122, 0.15)',
      },
    },
    layout: {
      containerWidth: 'full',
      spacing: 'responsive',
      backgroundColor: templateV31.theme?.colors?.background || '#FAF9F7',
      responsive: true,
    },
    blocks: convertedBlocks,
    analytics: templateV31.analytics || {
      trackingId: `step-${stepNumber.toString().padStart(2, '0')}`,
      events: ['page_view', 'option_selected', 'step_completed'],
    },
    logic: {
      navigation: {
        nextStep: `step-${(stepNumber + 1).toString().padStart(2, '0')}`,
        prevStep: stepNumber > 1 ? `step-${(stepNumber - 1).toString().padStart(2, '0')}` : null,
        allowBack: stepNumber > 1,
        autoAdvance: false,
      },
    },
    accessibility: {
      skipLinks: true,
      ariaLabels: true,
      focusManagement: true,
      keyboardNavigation: true,
      screenReader: true,
    },
    updatedAt: new Date().toISOString(),
  };

  return templateV20;
}

/**
 * Processar todos os templates v3.1
 */
async function main() {
  const templatesDir = path.join(process.cwd(), 'templates');
  const outputDir = path.join(process.cwd(), 'src/config/templates-converted');

  // Criar diretório de saída
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🔄 Iniciando conversão v3.1 → v2.0...\n');

  // Listar arquivos v3.1
  const files = fs.readdirSync(templatesDir)
    .filter(f => f.match(/step-\d{2}-template\.json$/));

  let converted = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const stepNumber = parseInt(file.match(/step-(\d{2})/)?.[1] || '0');
      const inputPath = path.join(templatesDir, file);
      const outputPath = path.join(outputDir, `step-${stepNumber.toString().padStart(2, '0')}.json`);

      console.log(`📄 Convertendo ${file}...`);

      // Ler template v3.1
      const templateV31 = JSON.parse(fs.readFileSync(inputPath, 'utf-8')) as TemplateV31;

      // Converter
      const templateV20 = convertTemplate(templateV31, stepNumber);

      // Salvar
      fs.writeFileSync(outputPath, JSON.stringify(templateV20, null, 2), 'utf-8');

      console.log(`✅ Convertido: ${file} → step-${stepNumber.toString().padStart(2, '0')}.json (${templateV20.blocks.length} blocos)\n`);
      converted++;
    } catch (error) {
      console.error(`❌ Erro ao converter ${file}:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Conversão concluída!`);
  console.log(`📊 ${converted} arquivos convertidos`);
  console.log(`❌ ${errors} erros`);
  console.log(`📁 Saída: ${outputDir}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
