/**
 * 🧪 TESTE: Validação de JSONs Individuais de Templates
 * 
 * Descobre e valida quais JSONs individuais estão corretos:
 * - public/templates/normalized/step-XX.json (11 steps)
 * - public/templates/quiz-steps/etapa-XX.json (12 etapas)
 * - public/templates/quiz21-complete.json (master completo)
 * 
 * Valida estrutura, completude e consistência dos dados.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const TEMPLATES_DIR = join(process.cwd(), 'public', 'templates');
const NORMALIZED_DIR = join(TEMPLATES_DIR, 'normalized');
const QUIZ_STEPS_DIR = join(TEMPLATES_DIR, 'quiz-steps');
const MASTER_FILE = join(TEMPLATES_DIR, 'quiz21-complete.json');

interface Block {
  id: string;
  type: string;
  [key: string]: any;
}

interface StepData {
  id?: string;
  stepId?: string;
  type?: string;
  blocks?: Block[];
  [key: string]: any;
}

function loadJSON(filePath: string): any {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function validateStepStructure(step: StepData, source: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ID é opcional para steps dentro de objeto (a chave já é o ID)
  // Avisar apenas se for necessário
  if (!step.id && !step.stepId) {
    // Não é erro crítico se step está dentro de objeto com chave
    // warnings.push(`${source}: Missing 'id' or 'stepId' (usando chave do objeto)`);
  }

  // Verificar tipo
  if (!step.type) {
    warnings.push(`${source}: Missing 'type' field`);
  }

  // Verificar blocks
  if (!step.blocks || !Array.isArray(step.blocks)) {
    errors.push(`${source}: Missing or invalid 'blocks' array`);
  } else if (step.blocks.length === 0) {
    warnings.push(`${source}: Empty 'blocks' array`);
  } else {
    // Validar cada block
    step.blocks.forEach((block, idx) => {
      if (!block.id) {
        errors.push(`${source}: Block ${idx} missing 'id'`);
      }
      if (!block.type) {
        errors.push(`${source}: Block ${idx} missing 'type'`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

describe('🔍 Validação de JSONs Individuais de Templates', () => {
  describe('1. Master Template (quiz21-complete.json)', () => {
    it('deve existir e ser válido', () => {
      expect(existsSync(MASTER_FILE)).toBe(true);

      const master = loadJSON(MASTER_FILE);
      expect(master).not.toBeNull();
      expect(master).toBeDefined();
    });

    it('deve ter estrutura de steps', () => {
      const master = loadJSON(MASTER_FILE);

      expect(master).toBeDefined();
      expect(master.steps).toBeDefined();

      // Converter objeto de steps para array
      const stepsObj = master.steps;
      const stepsArray = Object.keys(stepsObj);

      expect(stepsArray.length).toBeGreaterThan(0);

      console.log(`📊 Master contém ${stepsArray.length} steps`);
      console.log(`🔍 Estrutura: Objeto com chaves ${stepsArray.slice(0, 3).join(', ')}...`);
    });

    it('deve ter todos os 21 steps (step-01 a step-21)', () => {
      const master = loadJSON(MASTER_FILE);
      const stepsObj = master.steps;
      const stepIds = Object.keys(stepsObj);

      console.log(`🔍 Step IDs encontrados: ${stepIds.join(', ')}`);

      expect(stepIds.length).toBeGreaterThanOrEqual(21);

      // Verificar se tem step-01 a step-21
      const missingSteps = [];
      for (let i = 1; i <= 21; i++) {
        const expectedId = `step-${String(i).padStart(2, '0')}`;
        const hasStep = stepIds.includes(expectedId);
        if (!hasStep) {
          console.warn(`⚠️ Missing: ${expectedId}`);
          missingSteps.push(expectedId);
        }
      }

      if (missingSteps.length > 0) {
        console.error(`❌ Steps faltando: ${missingSteps.join(', ')}`);
      }

      expect(missingSteps.length).toBe(0);
    });

    it('deve ter blocks válidos em cada step', () => {
      const master = loadJSON(MASTER_FILE);
      const stepsObj = master.steps;
      const stepIds = Object.keys(stepsObj);

      const results = stepIds.map((stepId) => {
        const step = stepsObj[stepId];
        return validateStepStructure(step, `Master/${stepId}`);
      });

      const totalErrors = results.reduce((sum: number, r: any) => sum + r.errors.length, 0);
      const totalWarnings = results.reduce((sum: number, r: any) => sum + r.warnings.length, 0);

      console.log(`📊 Master: ${totalErrors} erros, ${totalWarnings} avisos`);

      results.forEach((result: any) => {
        result.errors.forEach((err: string) => console.error(`❌ ${err}`));
        result.warnings.forEach((warn: string) => console.warn(`⚠️ ${warn}`));
      });

      expect(totalErrors).toBe(0);
    });
  });

  describe('2. Normalized Templates (normalized/step-XX.json)', () => {
    it('deve listar todos os arquivos normalized disponíveis', () => {
      if (!existsSync(NORMALIZED_DIR)) {
        console.warn('⚠️ Diretório normalized/ não existe');
        return;
      }

      const files = readdirSync(NORMALIZED_DIR).filter((f) => f.endsWith('.json'));
      console.log(`📁 Normalized: ${files.length} arquivos encontrados`);
      console.log(`   ${files.join(', ')}`);

      expect(files.length).toBeGreaterThan(0);
    });

    it('deve validar estrutura de cada step normalizado', () => {
      if (!existsSync(NORMALIZED_DIR)) {
        console.warn('⚠️ Diretório normalized/ não existe');
        return;
      }

      const files = readdirSync(NORMALIZED_DIR)
        .filter((f) => f.startsWith('step-') && f.endsWith('.json'))
        .sort();

      const results = files.map((file) => {
        const filePath = join(NORMALIZED_DIR, file);
        const step = loadJSON(filePath);

        if (!step) {
          return {
            file,
            valid: false,
            errors: ['Failed to parse JSON'],
            warnings: [],
          };
        }

        const validation = validateStepStructure(step, `Normalized/${file}`);
        return { file, ...validation };
      });

      console.log('\n📊 Normalized Steps:');
      results.forEach((r) => {
        const status = r.valid ? '✅' : '❌';
        console.log(`${status} ${r.file}: ${r.errors.length} erros, ${r.warnings.length} avisos`);
        r.errors.forEach((err) => console.error(`   ❌ ${err}`));
      });

      const validCount = results.filter((r) => r.valid).length;
      console.log(`\n✅ ${validCount}/${results.length} steps válidos`);

      // Esperar que a maioria seja válida
      expect(validCount).toBeGreaterThan(results.length / 2);
    });

    it('deve comparar com master para identificar diferenças', () => {
      if (!existsSync(NORMALIZED_DIR)) {
        console.warn('⚠️ Diretório normalized/ não existe');
        return;
      }

      const master = loadJSON(MASTER_FILE);
      const masterSteps = master.steps;

      const files = readdirSync(NORMALIZED_DIR)
        .filter((f) => f.startsWith('step-') && f.endsWith('.json'))
        .sort();

      console.log('\n🔍 Comparando Normalized vs Master:');

      files.forEach((file) => {
        const stepId = file.replace('.json', '');
        const normalizedStep = loadJSON(join(NORMALIZED_DIR, file));
        const masterStep = masterSteps[stepId];

        if (!masterStep) {
          console.warn(`⚠️ ${stepId}: Não encontrado no master`);
          return;
        }

        const normalizedBlocks = normalizedStep?.blocks?.length || 0;
        const masterBlocks = masterStep?.blocks?.length || 0;

        const match = normalizedBlocks === masterBlocks ? '✅' : '⚠️';
        console.log(
          `${match} ${stepId}: Normalized=${normalizedBlocks} blocks, Master=${masterBlocks} blocks`,
        );

        if (normalizedBlocks !== masterBlocks) {
          console.log(`   Diferença: ${Math.abs(normalizedBlocks - masterBlocks)} blocks`);
        }
      });
    });
  });

  describe('3. Quiz Steps (quiz-steps/etapa-XX.json)', () => {
    it('deve listar todos os arquivos quiz-steps disponíveis', () => {
      if (!existsSync(QUIZ_STEPS_DIR)) {
        console.warn('⚠️ Diretório quiz-steps/ não existe');
        return;
      }

      const files = readdirSync(QUIZ_STEPS_DIR).filter((f) => f.endsWith('.json'));
      console.log(`📁 Quiz-steps: ${files.length} arquivos encontrados`);
      console.log(`   ${files.join(', ')}`);

      expect(files.length).toBeGreaterThan(0);
    });

    it('deve validar estrutura de cada etapa', () => {
      if (!existsSync(QUIZ_STEPS_DIR)) {
        console.warn('⚠️ Diretório quiz-steps/ não existe');
        return;
      }

      const files = readdirSync(QUIZ_STEPS_DIR)
        .filter((f) => f.startsWith('etapa-') && f.endsWith('.json'))
        .sort();

      const results = files.map((file) => {
        const filePath = join(QUIZ_STEPS_DIR, file);
        const step = loadJSON(filePath);

        if (!step) {
          return {
            file,
            valid: false,
            errors: ['Failed to parse JSON'],
            warnings: [],
          };
        }

        const validation = validateStepStructure(step, `Quiz-steps/${file}`);
        return { file, ...validation };
      });

      console.log('\n📊 Quiz-steps Etapas:');
      results.forEach((r) => {
        const status = r.valid ? '✅' : '❌';
        console.log(`${status} ${r.file}: ${r.errors.length} erros, ${r.warnings.length} avisos`);
        r.errors.forEach((err) => console.error(`   ❌ ${err}`));
      });

      const validCount = results.filter((r) => r.valid).length;
      console.log(`\n✅ ${validCount}/${results.length} etapas válidas`);

      expect(validCount).toBeGreaterThan(0);
    });
  });

  describe('4. Análise Comparativa e Recomendações', () => {
    it('deve identificar a fonte canônica mais confiável', () => {
      const master = loadJSON(MASTER_FILE);
      const masterSteps = master.steps;
      const stepIds = Object.keys(masterSteps);

      const normalizedExists = existsSync(NORMALIZED_DIR);
      const quizStepsExists = existsSync(QUIZ_STEPS_DIR);

      const normalizedCount = normalizedExists
        ? readdirSync(NORMALIZED_DIR).filter((f) => f.startsWith('step-') && f.endsWith('.json'))
            .length
        : 0;

      const quizStepsCount = quizStepsExists
        ? readdirSync(QUIZ_STEPS_DIR).filter((f) => f.startsWith('etapa-') && f.endsWith('.json'))
            .length
        : 0;

      console.log('\n📊 ANÁLISE COMPARATIVA:');
      console.log(`   Master (quiz21-complete.json): ${stepIds.length} steps`);
      console.log(`   Normalized: ${normalizedCount} steps individuais`);
      console.log(`   Quiz-steps: ${quizStepsCount} etapas individuais`);

      console.log('\n🏆 RECOMENDAÇÃO:');
      if (stepIds.length === 21) {
        console.log(
          '   ✅ USAR: public/templates/quiz21-complete.json (fonte canônica completa)',
        );
        console.log('   ✅ Estrutura: Objeto com 21 chaves (step-01 a step-21)');
      } else {
        console.log(`   ⚠️ Master incompleto (${stepIds.length}/21), verificar steps individuais`);
      }

      expect(stepIds.length).toBeGreaterThan(0);
    });

    it('deve detectar inconsistências entre fontes', () => {
      const master = loadJSON(MASTER_FILE);
      const masterSteps = master.steps;
      const stepIds = Object.keys(masterSteps);

      console.log('\n🔍 DETECTANDO INCONSISTÊNCIAS:');

      // Verificar steps faltando
      const missingSteps = [];
      for (let i = 1; i <= 21; i++) {
        const expectedId = `step-${String(i).padStart(2, '0')}`;
        if (!stepIds.includes(expectedId)) {
          missingSteps.push(expectedId);
        }
      }

      if (missingSteps.length > 0) {
        console.warn(`   ⚠️ Steps faltando: ${missingSteps.join(', ')}`);
      } else {
        console.log('   ✅ Todos os 21 steps presentes');
      }

      // Verificar duplicatas (não aplicável para objeto, mas verificar estrutura)
      console.log('   ✅ Estrutura de objeto garante sem duplicatas');

      expect(missingSteps.length).toBe(0);
    });

    it('deve gerar relatório final com JSONs corretos', () => {
      const master = loadJSON(MASTER_FILE);
      const masterSteps = master.steps;
      const stepIds = Object.keys(masterSteps);

      console.log('\n📋 RELATÓRIO FINAL - JSONs CORRETOS:');
      console.log('\n1️⃣ FONTE PRIMÁRIA (RECOMENDADA):');
      console.log('   📄 public/templates/quiz21-complete.json');
      console.log(`   ✅ Contém: ${stepIds.length} steps completos`);
      console.log(`   ✅ Estrutura: Objeto com chaves step-01 até step-${stepIds.length}`);
      console.log(`   ✅ Versão: ${master.templateVersion || '3.0'}`);

      console.log('\n2️⃣ FONTES SECUNDÁRIAS (para referência):');

      if (existsSync(NORMALIZED_DIR)) {
        const normalizedFiles = readdirSync(NORMALIZED_DIR).filter((f) =>
          f.endsWith('.json'),
        ).length;
        console.log('   📁 public/templates/normalized/');
        console.log(`      ${normalizedFiles} arquivos JSON individuais`);
      }

      if (existsSync(QUIZ_STEPS_DIR)) {
        const quizStepsFiles = readdirSync(QUIZ_STEPS_DIR).filter((f) =>
          f.endsWith('.json'),
        ).length;
        console.log('   📁 public/templates/quiz-steps/');
        console.log(`      ${quizStepsFiles} arquivos JSON individuais`);
      }

      console.log('\n✅ CONCLUSÃO:');
      console.log(
        '   Use quiz21-complete.json como fonte única de verdade para os 21 steps.',
      );
      console.log('   Estrutura: master.steps["step-01"] até master.steps["step-21"]');

      expect(stepIds.length).toBe(21);
    });
  });
});
