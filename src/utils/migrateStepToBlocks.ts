/**
 * 🔄 STEP MIGRATION UTILITY
 * 
 * Converte steps legados (formato atual) para formato de blocos modulares
 * Preserva 100% dos dados e funcionalidades
 */

import type { QuizStep } from '@/data/quizSteps';
import type { StepBlockSchema, StepSchema } from '@/data/stepBlockSchemas';
import { nanoid } from 'nanoid';

/**
 * Migra um IntroStep para formato de blocos
 */
export function migrateIntroStepToBlocks(stepData: QuizStep): StepSchema {
  const blocks: StepBlockSchema[] = [
    // Logo Block
    {
      id: `intro-logo-${nanoid(8)}`,
      type: 'LogoBlock',
      order: 0,
      props: {
        logoUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
        height: 55,
        width: 132,
        showDecorator: true,
        decoratorColor: '#B89B7A',
        decoratorHeight: 2,
        alt: 'Gisele Galvão Logo'
      },
      editable: true,
      deletable: false,
      movable: false
    },
    
    // Headline Block
    {
      id: `intro-headline-${nanoid(8)}`,
      type: 'HeadlineBlock',
      order: 1,
      props: {
        html: stepData.title || '<span style="color: #B89B7A;">Chega</span> de um guarda-roupa <span style="color: #B89B7A;">cheio</span> e a sensação de <span style="color: #B89B7A;">não ter nada</span> para vestir!',
        fontSize: 'text-2xl sm:text-3xl md:text-4xl',
        fontWeight: 'font-bold',
        fontFamily: '"Playfair Display", serif',
        align: 'center',
        color: '#432818'
      },
      editable: true,
      deletable: true,
      movable: true
    },
    
    // Image Block
    {
      id: `intro-image-${nanoid(8)}`,
      type: 'ImageBlock',
      order: 2,
      props: {
        src: stepData.image || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview%20(10)-jSEJlJtUY9lO7BHo7r1f6Wv39CKSbg.png',
        alt: 'Descubra seu estilo pessoal',
        aspectRatio: '1.47',
        maxWidth: '300px',
        rounded: true,
        shadow: false
      },
      editable: true,
      deletable: true,
      movable: true
    },
    
    // Description Text Block
    {
      id: `intro-description-${nanoid(8)}`,
      type: 'TextBlock',
      order: 3,
      props: {
        text: 'Em poucos minutos, descubra seu Estilo Predominante e aprenda a criar looks perfeitos para o seu corpo e ocasiões do dia a dia.',
        size: 'text-sm sm:text-base',
        align: 'center',
        color: 'text-gray-700',
        highlights: [
          {
            text: 'Estilo Predominante',
            color: '#B89B7A',
            weight: 'font-semibold'
          }
        ]
      },
      editable: true,
      deletable: true,
      movable: true
    },
    
    // Form Input Block
    {
      id: `intro-form-${nanoid(8)}`,
      type: 'FormInputBlock',
      order: 4,
      props: {
        id: 'name-input',
        label: stepData.formQuestion || 'Como posso te chamar?',
        placeholder: stepData.placeholder || 'Digite seu primeiro nome',
        required: true,
        inputType: 'text'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    
    // Button Block
    {
      id: `intro-button-${nanoid(8)}`,
      type: 'ButtonBlock',
      order: 5,
      props: {
        text: stepData.buttonText || 'Quero Descobrir meu Estilo Agora!',
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        bgColor: '#B89B7A',
        hoverBgColor: '#A1835D',
        textColor: '#ffffff'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    
    // Footer Block
    {
      id: `intro-footer-${nanoid(8)}`,
      type: 'FooterBlock',
      order: 6,
      props: {
        text: '© 2025 Gisele Galvão - Todos os direitos reservados',
        align: 'center',
        size: 'text-xs',
        color: 'text-gray-500'
      },
      editable: true,
      deletable: true,
      movable: true
    }
  ];

  return {
    type: 'intro',
    blocks
  };
}

/**
 * Migra um QuestionStep para formato de blocos
 */
export function migrateQuestionStepToBlocks(stepData: QuizStep): StepSchema {
  const blocks: StepBlockSchema[] = [
    // Progress Bar Block
    {
      id: `question-progress-${nanoid(8)}`,
      type: 'ProgressBarBlock',
      order: 0,
      props: {
        progress: 0, // Será preenchido dinamicamente
        height: 8,
        fillColor: '#B89B7A',
        bgColor: '#e5e7eb',
        rounded: true,
        animated: true
      },
      editable: true,
      deletable: false,
      movable: false
    },
    
    // Question Number Block
    {
      id: `question-number-${nanoid(8)}`,
      type: 'HeadlineBlock',
      order: 1,
      props: {
        text: stepData.questionNumber || '',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-bold',
        align: 'center',
        color: '#432818'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    
    // Question Text Block
    {
      id: `question-text-${nanoid(8)}`,
      type: 'HeadlineBlock',
      order: 2,
      props: {
        text: stepData.questionText || '',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-bold',
        fontFamily: 'playfair-display',
        align: 'center',
        color: '#deac6d'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    
    // Instructions Text Block
    {
      id: `question-instructions-${nanoid(8)}`,
      type: 'TextBlock',
      order: 3,
      props: {
        text: `Selecione ${stepData.requiredSelections || 1} opções`,
        size: 'text-sm',
        color: 'text-gray-600',
        align: 'center'
      },
      editable: true,
      deletable: true,
      movable: true
    },
    
    // Spacer
    {
      id: `question-spacer-1-${nanoid(8)}`,
      type: 'SpacerBlock',
      order: 4,
      props: {
        height: 24
      },
      editable: true,
      deletable: true,
      movable: true
    },
    
    // Grid Options Block
    {
      id: `question-options-${nanoid(8)}`,
      type: 'GridOptionsBlock',
      order: 5,
      props: {
        options: stepData.options || [],
        columns: 2,
        gap: 'gap-3 sm:gap-4',
        hasImages: stepData.options?.some(opt => !!opt.image) || false,
        selectionIndicator: 'checkbox',
        maxSelections: stepData.requiredSelections || 1,
        minSelections: stepData.requiredSelections || 1
      },
      editable: false,
      deletable: false,
      movable: false
    },
    
    // Spacer
    {
      id: `question-spacer-2-${nanoid(8)}`,
      type: 'SpacerBlock',
      order: 6,
      props: {
        height: 32
      },
      editable: true,
      deletable: true,
      movable: true
    },
    
    // Button Block
    {
      id: `question-button-${nanoid(8)}`,
      type: 'ButtonBlock',
      order: 7,
      props: {
        text: 'Avançando...',
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        bgColor: '#B89B7A',
        disabled: false,
        animate: 'pulse'
      },
      editable: true,
      deletable: false,
      movable: true
    }
  ];

  return {
    type: 'question',
    blocks
  };
}

/**
 * Migra um ResultStep para formato de blocos (simplificado)
 */
export function migrateResultStepToBlocks(stepData: QuizStep): StepSchema {
  const blocks: StepBlockSchema[] = [
    // Logo Block
    {
      id: `result-logo-${nanoid(8)}`,
      type: 'LogoBlock',
      order: 0,
      props: {
        logoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20GG-6w33qkEHxzZCbYI93W2BxxqxbFNr78.png',
        height: 55,
        width: 132,
        showDecorator: false
      },
      editable: true,
      deletable: false,
      movable: false
    },
    
    // Greeting Headline
    {
      id: `result-greeting-${nanoid(8)}`,
      type: 'HeadlineBlock',
      order: 1,
      props: {
        text: 'Seu estilo predominante é:',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        align: 'center',
        color: '#432818'
      },
      editable: true,
      deletable: false,
      movable: true
    },
    
    // Style Name (dinâmico)
    {
      id: `result-style-name-${nanoid(8)}`,
      type: 'HeadlineBlock',
      order: 2,
      props: {
        text: '', // Será preenchido dinamicamente
        fontSize: 'text-3xl md:text-5xl',
        fontWeight: 'font-bold',
        fontFamily: '"Playfair Display", serif',
        align: 'center',
        color: '#B89B7A'
      },
      editable: false,
      deletable: false,
      movable: false
    },
    
    // Style Image (dinâmico)
    {
      id: `result-image-${nanoid(8)}`,
      type: 'ImageBlock',
      order: 3,
      props: {
        src: '', // Será preenchido dinamicamente
        alt: 'Seu estilo',
        aspectRatio: '1',
        maxWidth: '400px',
        rounded: true,
        shadow: true
      },
      editable: true,
      deletable: false,
      movable: true
    },
    
    // Style Description (dinâmico)
    {
      id: `result-description-${nanoid(8)}`,
      type: 'TextBlock',
      order: 4,
      props: {
        text: '', // Será preenchido dinamicamente
        size: 'text-base',
        align: 'center',
        color: 'text-gray-700'
      },
      editable: false,
      deletable: false,
      movable: true
    }
  ];

  return {
    type: 'result',
    blocks
  };
}

/**
 * Função principal de migração
 * Detecta o tipo de step e aplica a migração correta
 */
export function migrateStepToBlocks(stepData: QuizStep): StepSchema | null {
  if (!stepData || !stepData.type) {
    console.warn('⚠️ Step data inválido para migração:', stepData);
    return null;
  }

  try {
    switch (stepData.type) {
      case 'intro':
        return migrateIntroStepToBlocks(stepData);
        
      case 'question':
      case 'strategic-question':
        return migrateQuestionStepToBlocks(stepData);
        
      case 'result':
        return migrateResultStepToBlocks(stepData);
        
      default:
        console.warn(`⚠️ Tipo de step não suportado para migração: ${stepData.type}`);
        return null;
    }
  } catch (error) {
    console.error('❌ Erro ao migrar step:', error);
    return null;
  }
}

/**
 * Valida se um step foi migrado corretamente
 */
export function validateMigratedStep(schema: StepSchema): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar estrutura básica
  if (!schema || !schema.type) {
    errors.push('Schema não possui tipo definido');
  }

  if (!schema.blocks || !Array.isArray(schema.blocks)) {
    errors.push('Schema não possui array de blocos');
  }

  // Validar blocos
  if (schema.blocks) {
    schema.blocks.forEach((block, index) => {
      if (!block.id) {
        errors.push(`Bloco ${index} não possui ID`);
      }
      if (!block.type) {
        errors.push(`Bloco ${index} não possui tipo`);
      }
      if (typeof block.order !== 'number') {
        errors.push(`Bloco ${index} não possui ordem válida`);
      }
      if (!block.props) {
        errors.push(`Bloco ${index} não possui propriedades`);
      }
    });

    // Validar ordem sequencial
    const orders = schema.blocks.map(b => b.order).sort((a, b) => a - b);
    const expectedOrders = schema.blocks.map((_, i) => i);
    if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
      errors.push('Ordem dos blocos não é sequencial');
    }

    // Validar IDs únicos
    const ids = schema.blocks.map(b => b.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      errors.push('Existem IDs duplicados nos blocos');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Migra um array de steps (funil completo)
 */
export function migrateFunnelSteps(steps: QuizStep[]): {
  success: boolean;
  migratedSteps: (StepSchema | null)[];
  errors: string[];
} {
  const errors: string[] = [];
  const migratedSteps: (StepSchema | null)[] = [];

  steps.forEach((step, index) => {
    try {
      const migrated = migrateStepToBlocks(step);
      
      if (migrated) {
        const validation = validateMigratedStep(migrated);
        if (!validation.valid) {
          errors.push(`Step ${index} (${step.type}): ${validation.errors.join(', ')}`);
        }
      } else {
        errors.push(`Step ${index}: Falha na migração`);
      }
      
      migratedSteps.push(migrated);
    } catch (error) {
      errors.push(`Step ${index}: ${error}`);
      migratedSteps.push(null);
    }
  });

  return {
    success: errors.length === 0,
    migratedSteps,
    errors
  };
}

/**
 * Gera relatório de migração
 */
export function generateMigrationReport(
  originalSteps: QuizStep[],
  migratedSteps: (StepSchema | null)[]
): string {
  let report = '# 📊 RELATÓRIO DE MIGRAÇÃO\n\n';
  
  report += `## Resumo\n`;
  report += `- Total de steps: ${originalSteps.length}\n`;
  report += `- Migrados com sucesso: ${migratedSteps.filter(s => s !== null).length}\n`;
  report += `- Falhas: ${migratedSteps.filter(s => s === null).length}\n\n`;
  
  report += `## Detalhes por Step\n\n`;
  
  originalSteps.forEach((step, index) => {
    const migrated = migratedSteps[index];
    const status = migrated ? '✅' : '❌';
    const blockCount = migrated?.blocks.length || 0;
    
    report += `### ${index + 1}. ${status} ${step.type.toUpperCase()}\n`;
    report += `- Blocos criados: ${blockCount}\n`;
    
    if (migrated) {
      report += `- Tipos: ${migrated.blocks.map(b => b.type).join(', ')}\n`;
      const validation = validateMigratedStep(migrated);
      report += `- Validação: ${validation.valid ? '✅ OK' : `❌ ${validation.errors.join('; ')}`}\n`;
    }
    
    report += '\n';
  });
  
  return report;
}
