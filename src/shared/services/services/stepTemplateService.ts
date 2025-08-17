// @ts-nocheck
// ✨ SERVIÇO UNIFICADO PARA TEMPLATES POR ETAPA
// Este serviço centraliza o acesso aos templates individuais mantendo a modularidade

// ⚠️ NOTA: Step01 migrado para sistema JSON (step-01.json) - não usa mais componente
import { getStep02Template } from '../components/steps/Step02Template';
import { getStep03Template } from '../components/steps/Step03Template';
import { getStep04Template } from '../components/steps/Step04Template';
import { getStep05Template } from '../components/steps/Step05Template';
import { getStep06Template } from '../components/steps/Step06Template';
import { getStep07Template } from '../components/steps/Step07Template';
import { getStep09Template } from '../components/steps/Step09Template';
import { getStep10Template } from '../components/steps/Step10Template';
import { getStep11Template } from '../components/steps/Step11Template';
import { getStep12Template } from '../components/steps/Step12Template';
import { getStep13Template } from '../components/steps/Step13Template';
import { getStep14Template } from '../components/steps/Step14Template';
import { getStep15Template } from '../components/steps/Step15Template';
import { getStep16Template } from '../components/steps/Step16Template';
import { getStep17Template } from '../components/steps/Step17Template';
import { getStep18Template } from '../components/steps/Step18Template';
import { getStep19Template } from '../components/steps/Step19Template';
import { getStep20Template } from '../components/steps/Step20Template';
import { getStep21Template } from '../components/steps/Step21Template';

export interface StepInfo {
  id: string;
  name: string;
  order: number;
  type: 'intro' | 'question' | 'strategic' | 'transition' | 'result' | 'offer' | 'custom';
  description: string;
  blocksCount: number;
  hasTemplate: boolean;
  multiSelect?: number;
}

// 🎯 MAPEAMENTO COMPLETO DAS 21 ETAPAS
const STEP_MAPPING: Record<
  number,
  {
    name: string;
    type: StepInfo['type'];
    description: string;
    getTemplate: () => any[];
    multiSelect?: number;
  }
> = {
  1: {
    name: 'Introdução',
    type: 'intro',
    description: 'Apresentação do Quiz de Estilo',
    getTemplate: () => {
      // ⚠️ STEP01 MIGRADO PARA JSON - Este service não é mais usado para Step01
      console.warn(
        '⚠️ Step01 migrado para sistema JSON. Use templateService.getTemplateByStep(1) em vez do stepTemplateService'
      );
      return [];
    },
  },
  2: {
    name: 'Coleta de Nome',
    type: 'intro',
    description: 'Captura do nome do participante',
    getTemplate: getStep02Template,
  },
  3: {
    name: 'Q1: Tipo de Roupa',
    type: 'question',
    description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    getTemplate: getStep03Template,
    multiSelect: 3,
  },
  4: {
    name: 'Q2: Personalidade',
    type: 'question',
    description: 'RESUMA A SUA PERSONALIDADE:',
    getTemplate: getStep04Template,
    multiSelect: 3,
  },
  5: {
    name: 'Q3: Estampas',
    type: 'question',
    description: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    getTemplate: getStep05Template,
    multiSelect: 3,
  },
  6: {
    name: 'Q4: Casacos',
    type: 'question',
    description: 'QUAL CASACO É SEU FAVORITO?',
    getTemplate: getStep06Template,
    multiSelect: 3,
  },
  7: {
    name: 'Q5: Calças',
    type: 'question',
    description: 'QUAL SUA CALÇA FAVORITA?',
    getTemplate: getStep07Template,
    multiSelect: 3,
  },
  8: {
    name: 'Q6: Calças (2)',
    type: 'question',
    description: 'QUAL SUA CALÇA FAVORITA? (Continuação)',
    multiSelect: 3,
  },
  9: {
    name: 'Q7: Sapatos',
    type: 'question',
    description: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
    getTemplate: getStep09Template,
    multiSelect: 3,
  },
  10: {
    name: 'Q8: Acessórios',
    type: 'question',
    description: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?',
    getTemplate: getStep10Template,
    multiSelect: 3,
  },
  11: {
    name: 'Q9: Tecidos',
    type: 'question',
    description: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
    getTemplate: getStep11Template,
    multiSelect: 3,
  },
  12: {
    name: 'Transição Principal',
    type: 'transition',
    description: 'Análise dos resultados parciais',
    getTemplate: getStep12Template,
  },
  13: {
    name: 'S1: Guarda-roupa',
    type: 'strategic',
    description: 'Percepção sobre o guarda-roupa atual',
    getTemplate: getStep13Template,
    multiSelect: 1,
  },
  14: {
    name: 'S2: Problemas',
    type: 'strategic',
    description: 'Principais problemas com roupas',
    getTemplate: getStep14Template,
    multiSelect: 1,
  },
  15: {
    name: 'S3: Frequência',
    type: 'strategic',
    description: 'Frequência do dilema "com que roupa eu vou?"',
    getTemplate: getStep15Template,
    multiSelect: 1,
  },
  16: {
    name: 'S4: Investimento',
    type: 'strategic',
    description: 'Considerações para investir em roupas',
    getTemplate: getStep16Template,
    multiSelect: 1,
  },
  17: {
    name: 'S5: Orçamento',
    type: 'strategic',
    description: 'Orçamento mensal para roupas',
    getTemplate: getStep17Template,
    multiSelect: 1,
  },
  18: {
    name: 'S6: Objetivos',
    type: 'strategic',
    description: 'O que deseja alcançar com novo estilo',
    getTemplate: getStep18Template,
    multiSelect: 1,
  },
  19: {
    name: 'Transição Final',
    type: 'transition',
    description: 'Preparando resultado personalizado',
    getTemplate: getStep19Template,
  },
  20: {
    name: 'Resultado',
    type: 'result',
    description: 'Página de resultado personalizada',
    getTemplate: getStep20Template,
  },
  21: {
    name: 'Oferta',
    type: 'offer',
    description: 'Apresentação da oferta final',
    getTemplate: getStep21Template,
  },
};

class StepTemplateService {
  /**
   * Obtém template de uma etapa específica
   */
  getStepTemplate(stepId: string | number): any[] {
    const stepNumber = typeof stepId === 'string' ? parseInt(stepId.replace(/\D/g, '')) : stepId;

    console.log(`🔍 [StepTemplateService] Buscando template para etapa ${stepNumber}`);
    console.log(`🧪 [DEBUG] stepId original:`, stepId);
    console.log(`🧪 [DEBUG] stepNumber convertido:`, stepNumber);

    const stepMapping = STEP_MAPPING[stepNumber];

    if (!stepMapping) {
      console.warn(`⚠️ Template não encontrado para etapa ${stepNumber}`);
      console.log(`🧪 [DEBUG] STEP_MAPPING disponíveis:`, Object.keys(STEP_MAPPING));
      return this.getDefaultTemplate(stepNumber);
    }

    console.log(`✅ Mapping encontrado para etapa ${stepNumber}:`, stepMapping.name);

    try {
      const template = stepMapping.getTemplate();
      console.log(`✅ Template carregado para etapa ${stepNumber}: ${template.length} blocos`);
      console.log(`🧱 [DEBUG] Primeiro bloco:`, template[0]);
      console.log(
        `🧱 [DEBUG] Tipos de blocos:`,
        template.map(b => b.type)
      );
      return template;
    } catch (error) {
      console.error(`❌ Erro ao carregar template da etapa ${stepNumber}:`, error);
      return this.getDefaultTemplate(stepNumber);
    }
  }

  /**
   * Obtém informações de uma etapa
   */
  getStepInfo(stepId: string | number): StepInfo | null {
    const stepNumber = typeof stepId === 'string' ? parseInt(stepId.replace(/\D/g, '')) : stepId;

    const stepMapping = STEP_MAPPING[stepNumber];

    if (!stepMapping) {
      return null;
    }

    let blocksCount = 0;
    let hasTemplate = true;

    try {
      const template = stepMapping.getTemplate();
      blocksCount = template.length;
    } catch (error) {
      hasTemplate = false;
    }

    return {
      id: `etapa-${stepNumber}`,
      name: stepMapping.name,
      order: stepNumber,
      type: stepMapping.type,
      description: stepMapping.description,
      blocksCount,
      hasTemplate,
      multiSelect: stepMapping.multiSelect,
    };
  }

  /**
   * Obtém todas as etapas disponíveis
   */
  getAllSteps(): StepInfo[] {
    return Object.keys(STEP_MAPPING)
      .map(key => parseInt(key))
      .sort((a, b) => a - b)
      .map(stepNumber => this.getStepInfo(stepNumber))
      .filter((step): step is StepInfo => step !== null);
  }

  /**
   * Verifica se uma etapa tem template disponível
   */
  hasStepTemplate(stepId: string | number): boolean {
    const stepNumber = typeof stepId === 'string' ? parseInt(stepId.replace(/\D/g, '')) : stepId;
    return STEP_MAPPING.hasOwnProperty(stepNumber);
  }

  /**
   * Template padrão para etapas sem template específico
   */
  private getDefaultTemplate(stepNumber: number): any[] {
    console.log(`🔧 [StepTemplateService] Gerando template padrão para etapa ${stepNumber}`);

    const defaultTemplate = [
      {
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 96,
          logoHeight: 96,
          progressValue: Math.round((stepNumber / 21) * 100),
          progressMax: 100,
          showBackButton: stepNumber > 1,
        },
      },
      {
        type: 'heading-inline',
        properties: {
          content: `Etapa ${stepNumber}`,
          level: 'h2',
          fontSize: 'text-2xl',
          fontWeight: 'font-bold',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 16,
        },
      },
      {
        type: 'text-inline',
        properties: {
          content: 'Esta etapa está sendo desenvolvida. Em breve teremos o conteúdo personalizado.',
          fontSize: 'text-lg',
          textAlign: 'text-center',
          color: '#6B7280',
          marginBottom: 32,
        },
      },
      {
        type: 'button-inline',
        properties: {
          text: 'Continuar',
          variant: 'primary',
          size: 'large',
          fullWidth: true,
          backgroundColor: '#B89B7A',
          textColor: '#ffffff',
        },
      },
    ];

    console.log(`🧱 [DEBUG] Template padrão gerado com ${defaultTemplate.length} blocos`);
    console.log(`🧱 [DEBUG] Tipos: ${defaultTemplate.map(b => b.type).join(', ')}`);

    return defaultTemplate;
  }

  /**
   * Obtém estatísticas dos templates
   */
  getTemplateStats() {
    const allSteps = this.getAllSteps();
    const withTemplate = allSteps.filter(step => step.hasTemplate);
    const totalBlocks = allSteps.reduce((sum, step) => sum + step.blocksCount, 0);

    return {
      totalSteps: allSteps.length,
      stepsWithTemplate: withTemplate.length,
      stepsWithoutTemplate: allSteps.length - withTemplate.length,
      totalBlocks,
      averageBlocksPerStep: Math.round(totalBlocks / allSteps.length),
      completionRate: Math.round((withTemplate.length / allSteps.length) * 100),
    };
  }
}

// 🚀 INSTÂNCIA SINGLETON
export const stepTemplateService = new StepTemplateService();

// 🎯 EXPORTS PARA COMPATIBILIDADE
export { STEP_MAPPING };
export default stepTemplateService;
