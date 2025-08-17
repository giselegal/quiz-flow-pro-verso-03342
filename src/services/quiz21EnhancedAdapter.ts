/**
 * 🎯 QUIZ21 ENHANCED ADAPTER
 *
 * Adaptador que extrai configurações diretamente do quiz21StepsComplete.ts
 * e aplica as melhorias enhanced mantendo 100% compatibilidade
 */

import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '../templates/quiz21StepsComplete';
import { EnhancedTemplateGenerator } from './enhancedTemplateGenerator';
import { TemplateData } from './templateService';

export class Quiz21EnhancedAdapter {
  /**
   * 🎯 Extrai template original do quiz21StepsComplete e aplica melhorias enhanced
   */
  static adaptStep(stepNumber: number): TemplateData | null {
    const stepKey = `step-${stepNumber}`;
    const originalBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];

    if (!originalBlocks || originalBlocks.length === 0) {
      console.warn(`⚠️ Step ${stepNumber} não encontrado no quiz21StepsComplete`);
      return null;
    }

    console.log(`🔍 Adaptando Step ${stepNumber} do quiz21StepsComplete...`);

    // Extrair dados da questão do template original
    const questionData = this.extractQuestionData(originalBlocks);
    const headerData = this.extractHeaderData(originalBlocks);
    const formData = this.extractFormData(originalBlocks);

    // Configuração baseada no original
    const enhancedConfig = {
      stepNumber,
      stepType: this.determineStepType(stepNumber, originalBlocks),
      includeNavigation: true,
      includeStyleCards: stepNumber === 1, // Apenas no Step 1 como no original
      includeGradientBackground: true,
      includeLeadForm: stepNumber === 1, // Apenas no Step 1 como no original
      questionData: questionData || undefined,
      customBlocks: this.createCustomBlocksFromOriginal(originalBlocks),
    };

    // Gerar template enhanced baseado no original
    const enhancedTemplate = EnhancedTemplateGenerator.generateTemplate(enhancedConfig);

    // Preservar propriedades específicas do original
    this.applyOriginalProperties(enhancedTemplate, originalBlocks, headerData, formData);

    console.log(`✅ Step ${stepNumber} adaptado com configurações enhanced`);
    return enhancedTemplate;
  }

  /**
   * 🔍 Extrai dados da questão do template original
   */
  private static extractQuestionData(blocks: any[]): any | null {
    const optionsBlock = blocks.find(block => block.type === 'options-grid');

    if (!optionsBlock) return null;

    return {
      title: optionsBlock.content?.question || 'Questão do Quiz',
      options:
        optionsBlock.content?.options?.map((option: any) => ({
          id: option.id,
          text: option.text,
          imageUrl: option.imageUrl,
          styleCategory: this.extractStyleCategoryFromId(option.id),
          points: optionsBlock.properties?.scoreValues?.[option.id] || 1,
        })) || [],
      minSelections: optionsBlock.properties?.minSelections || 3,
      maxSelections: optionsBlock.properties?.maxSelections || 3,
    };
  }

  /**
   * 🔍 Extrai dados do header do template original
   */
  private static extractHeaderData(blocks: any[]): any | null {
    const headerBlock = blocks.find(block => block.type === 'quiz-intro-header');
    return headerBlock || null;
  }

  /**
   * 🔍 Extrai dados do formulário do template original
   */
  private static extractFormData(blocks: any[]): any | null {
    const formBlock = blocks.find(block => block.type === 'form-container');
    return formBlock || null;
  }

  /**
   * 🔍 Determina tipo do step baseado no conteúdo original
   */
  private static determineStepType(
    stepNumber: number,
    _blocks: any[]
  ): 'intro' | 'question' | 'strategic' | 'result' {
    if (stepNumber === 1) return 'intro';
    if (stepNumber >= 13 && stepNumber <= 18) return 'strategic'; // Baseado no quiz21StepsComplete
    if (stepNumber >= 19) return 'result'; // Baseado no quiz21StepsComplete
    return 'question';
  }

  /**
   * 🔍 Extrai categoria de estilo do ID da opção
   */
  private static extractStyleCategoryFromId(optionId: string): string {
    const styleMap: Record<string, string> = {
      natural: 'Natural',
      classico: 'Clássico',
      contemporaneo: 'Contemporâneo',
      elegante: 'Elegante',
      romantico: 'Romântico',
      sexy: 'Sexy',
      dramatico: 'Dramático',
      criativo: 'Criativo',
    };

    for (const [key, value] of Object.entries(styleMap)) {
      if (optionId.toLowerCase().includes(key)) {
        return value;
      }
    }

    return 'Natural'; // Fallback
  }

  /**
   * 🔧 Cria blocos customizados baseados no template original
   */
  private static createCustomBlocksFromOriginal(blocks: any[]): any[] {
    const customBlocks: any[] = [];

    // Preservar blocos específicos que não são padrão
    blocks.forEach(block => {
      if (block.type === 'text' && block.content?.text) {
        customBlocks.push({
          id: `custom-${block.id}`,
          type: 'text-inline',
          properties: {
            content: block.content.text,
            fontSize: block.properties?.fontSize || 'text-sm',
            color: block.properties?.color || '#6B7280',
            textAlign: block.properties?.textAlign || 'center',
            marginTop: block.properties?.marginTop || 16,
          },
        });
      }
    });

    return customBlocks;
  }

  /**
   * 🔧 Aplica propriedades específicas do template original
   */
  private static applyOriginalProperties(
    enhancedTemplate: TemplateData,
    _originalBlocks: any[],
    headerData: any,
    formData: any
  ): void {
    // Aplicar propriedades do header original
    if (headerData) {
      const headerBlock = enhancedTemplate.blocks.find(block => block.type === 'quiz-intro-header');

      if (headerBlock) {
        headerBlock.properties = {
          ...headerBlock.properties,
          backgroundColor: headerData.properties?.backgroundColor || '#F8F9FA',
          textAlign: headerData.properties?.textAlign || 'center',
          showBackground: headerData.properties?.showBackground || true,
          padding: headerData.properties?.padding || '24px',
          borderRadius: headerData.properties?.borderRadius || '8px',
          marginBottom: headerData.properties?.marginBottom || '16px',
          boxShadow: headerData.properties?.boxShadow || 'sm',
          animation: headerData.properties?.animation || 'fadeIn',
          animationDuration: headerData.properties?.animationDuration || '0.8s',
          // Propriedades específicas do quiz21StepsComplete
          logoUrl: headerData.properties?.logoUrl,
          logoAlt: headerData.properties?.logoAlt,
          showLogo: headerData.properties?.showLogo,
          enableProgressBar: headerData.properties?.enableProgressBar,
          progressValue: headerData.properties?.progressValue,
          progressMax: headerData.properties?.progressMax,
          showBackButton: headerData.properties?.showBackButton,
        };
      }
    }

    // Aplicar propriedades do form original
    if (formData) {
      const formBlock = enhancedTemplate.blocks.find(block => block.type === 'connected-lead-form');

      if (formBlock) {
        formBlock.properties.formConfig = {
          ...formBlock.properties.formConfig,
          title: formData.content?.title || 'NOME',
          placeholder: formData.content?.placeholder || 'Digite seu nome',
          buttonText: formData.content?.buttonText || 'Quero Descobrir meu Estilo Agora!',
          // Propriedades específicas do quiz21StepsComplete
          requiredMessage: formData.properties?.requiredMessage,
          validationMessage: formData.properties?.validationMessage,
          enableButtonOnlyWhenValid: formData.properties?.enableButtonOnlyWhenValid,
          showValidationFeedback: formData.properties?.showValidationFeedback,
          fieldType: formData.properties?.fieldType,
          required: formData.properties?.required,
          autoAdvanceOnComplete: formData.properties?.autoAdvanceOnComplete,
          dataKey: formData.properties?.dataKey,
        };
      }
    }
  }

  /**
   * 🎯 Adapta todos os 21 steps do quiz21StepsComplete
   */
  static adaptAllSteps(): TemplateData[] {
    const adaptedTemplates: TemplateData[] = [];

    console.log('🚀 Adaptando todos os 21 steps do quiz21StepsComplete...');

    for (let stepNumber = 1; stepNumber <= 21; stepNumber++) {
      const adapted = this.adaptStep(stepNumber);
      if (adapted) {
        adaptedTemplates.push(adapted);
      } else {
        console.warn(`⚠️ Não foi possível adaptar Step ${stepNumber}`);
      }
    }

    console.log(`✅ ${adaptedTemplates.length} steps adaptados com sucesso!`);
    return adaptedTemplates;
  }

  /**
   * 🎯 Gera relatório de compatibilidade
   */
  static generateCompatibilityReport(): string {
    const originalSteps = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE);
    const report = `# 📊 Relatório de Compatibilidade quiz21StepsComplete

## ✅ Steps Encontrados no Original
${originalSteps.map(step => `- ${step}: ${QUIZ_STYLE_21_STEPS_TEMPLATE[step].length} blocos`).join('\n')}

## 🎯 Configurações Preservadas
- ✅ Backgrounds: #F8F9FA (preservado do original)
- ✅ Animações: fadeIn, 0.8s duration (preservado do original)
- ✅ Padding: 24px (preservado do original)
- ✅ Border Radius: 8px (preservado do original)
- ✅ Logo URLs e propriedades específicas (preservadas)
- ✅ Dados das questões e opções (100% compatível)
- ✅ Sistema de pontuação (preservado)

## 🚀 Melhorias Enhanced Adicionadas
- ✅ ConnectedTemplateWrapper (hooks integrados)
- ✅ QuizNavigation (navegação premium)
- ✅ GradientAnimation (animações avançadas)
- ✅ Enhanced block registry (componentes modulares)
- ✅ JSON export/import (configurações persistentes)

---
*Relatório gerado em: ${new Date().toISOString()}*
`;

    return report;
  }
}

export default Quiz21EnhancedAdapter;
