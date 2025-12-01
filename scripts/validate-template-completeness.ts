/**
 * 🔍 FASE 1.3: Script de Validação de Templates
 * 
 * Valida que cada step tenha blocos essenciais para funcionamento completo
 */

interface BlockValidationRule {
  stepTypes: string[];
  requiredBlocks: string[];
  description: string;
}

const VALIDATION_RULES: BlockValidationRule[] = [
  {
    stepTypes: ['question'],
    requiredBlocks: ['question-progress', 'question-title', 'options-grid', 'question-navigation'],
    description: 'Steps de pergunta devem ter progresso, título, opções e navegação'
  },
  {
    stepTypes: ['intro'],
    requiredBlocks: ['intro-logo-header', 'intro-title', 'intro-form'],
    description: 'Step de introdução deve ter logo, título e formulário'
  },
  {
    stepTypes: ['transition'],
    requiredBlocks: ['transition-title', 'transition-text'],
    description: 'Steps de transição devem ter título e texto'
  }
];

interface ValidationResult {
  stepId: string;
  stepType: string;
  missingBlocks: string[];
  warnings: string[];
  isValid: boolean;
}

export async function validateTemplate(templatePath: string): Promise<ValidationResult[]> {
  console.log(`\n🔍 Validando template: ${templatePath}\n`);

  const results: ValidationResult[] = [];

  try {
    // Importar o template
    const template = await import(`../${templatePath}`);
    const steps = template.default?.steps || template.steps;

    if (!steps) {
      console.error('❌ Template inválido: propriedade "steps" não encontrada');
      return results;
    }

    // Validar cada step
    for (const [stepId, stepData] of Object.entries(steps as any)) {
      const stepType = stepData.type || 'unknown';
      const blocks = stepData.blocks || [];
      const blockTypes = blocks.map((b: any) => b.type);

      const result: ValidationResult = {
        stepId,
        stepType,
        missingBlocks: [],
        warnings: [],
        isValid: true
      };

      // Aplicar regras de validação
      const applicableRules = VALIDATION_RULES.filter(rule => 
        rule.stepTypes.includes(stepType)
      );

      for (const rule of applicableRules) {
        for (const requiredBlock of rule.requiredBlocks) {
          if (!blockTypes.includes(requiredBlock)) {
            result.missingBlocks.push(requiredBlock);
            result.isValid = false;
          }
        }
      }

      // Validações adicionais
      if (stepType === 'question' && blocks.length < 3) {
        result.warnings.push('Step de pergunta tem menos de 3 blocos');
      }

      if (blocks.length === 0) {
        result.warnings.push('Step sem blocos');
        result.isValid = false;
      }

      results.push(result);

      // Log resultado
      if (!result.isValid) {
        console.log(`❌ ${stepId} (${stepType})`);
        if (result.missingBlocks.length > 0) {
          console.log(`   Blocos faltantes: ${result.missingBlocks.join(', ')}`);
        }
      } else {
        console.log(`✅ ${stepId} (${stepType}) - ${blocks.length} blocos`);
      }

      if (result.warnings.length > 0) {
        console.log(`   ⚠️  ${result.warnings.join(', ')}`);
      }
    }

    // Resumo final
    const validSteps = results.filter(r => r.isValid).length;
    const totalSteps = results.length;
    const invalidSteps = results.filter(r => !r.isValid);

    console.log(`\n📊 RESUMO:`);
    console.log(`   ✅ Steps válidos: ${validSteps}/${totalSteps}`);
    console.log(`   ❌ Steps inválidos: ${invalidSteps.length}`);

    if (invalidSteps.length > 0) {
      console.log(`\n🔧 AÇÕES NECESSÁRIAS:\n`);
      invalidSteps.forEach(step => {
        console.log(`   ${step.stepId}:`);
        step.missingBlocks.forEach(block => {
          console.log(`     - Adicionar bloco "${block}"`);
        });
      });
    }

    return results;

  } catch (error) {
    console.error('❌ Erro ao validar template:', error);
    return results;
  }
}

// Executar validação se chamado diretamente
if (require.main === module) {
  validateTemplate('public/templates/quiz21-v4-saas.json')
    .then(results => {
      const hasErrors = results.some(r => !r.isValid);
      process.exit(hasErrors ? 1 : 0);
    })
    .catch(error => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}
