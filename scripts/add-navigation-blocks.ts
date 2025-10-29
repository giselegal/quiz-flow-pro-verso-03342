/**
 * 🔧 FASE 1.2: Script para Adicionar Blocos de Navegação
 * 
 * Adiciona blocos de navegação (question-navigation) em todos os steps de pergunta
 * que ainda não os possuem
 */

import fs from 'fs';
import path from 'path';

interface Block {
  id: string;
  type: string;
  order: number;
  properties?: Record<string, any>;
  content?: Record<string, any>;
  parentId: string | null;
}

interface Step {
  type: string;
  blocks: Block[];
  [key: string]: any;
}

const QUESTION_STEPS = [
  'step-02', 'step-03', 'step-04', 'step-05', 'step-06',
  'step-07', 'step-08', 'step-09', 'step-10', 'step-11',
  'step-13', 'step-14', 'step-15', 'step-16', 'step-17', 'step-18'
];

function createNavigationBlock(stepId: string, order: number): Block {
  return {
    id: `navigation-${stepId}`,
    type: 'question-navigation',
    order,
    properties: {
      showBack: true,
      showNext: true,
      type: 'fade',
      duration: 300
    },
    content: {
      backLabel: 'Voltar',
      nextLabel: 'Avançar',
      backVariant: 'outline',
      nextVariant: 'default'
    },
    parentId: null
  };
}

export async function addNavigationBlocks(templatePath: string): Promise<void> {
  console.log(`\n🔧 Adicionando blocos de navegação em: ${templatePath}\n`);

  try {
    // Ler o arquivo
    const fullPath = path.resolve(process.cwd(), templatePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const template = JSON.parse(fileContent);

    if (!template.steps) {
      console.error('❌ Template inválido: propriedade "steps" não encontrada');
      return;
    }

    let addedCount = 0;
    let skippedCount = 0;

    // Processar cada step de pergunta
    for (const stepId of QUESTION_STEPS) {
      const step: Step | undefined = template.steps[stepId];
      
      if (!step) {
        console.log(`⚠️  ${stepId} não encontrado no template`);
        continue;
      }

      // Verificar se já tem navegação
      const hasNavigation = step.blocks.some((block: Block) => 
        block.type === 'question-navigation' || block.type === 'quiz-navigation'
      );

      if (hasNavigation) {
        console.log(`⏭️  ${stepId} - já possui navegação`);
        skippedCount++;
        continue;
      }

      // Encontrar a maior ordem atual
      const maxOrder = Math.max(...step.blocks.map((b: Block) => b.order || 0));
      
      // Adicionar bloco de navegação
      const navigationBlock = createNavigationBlock(stepId, maxOrder + 1);
      step.blocks.push(navigationBlock);

      console.log(`✅ ${stepId} - navegação adicionada (ordem: ${navigationBlock.order})`);
      addedCount++;
    }

    // Salvar arquivo modificado
    const updatedJson = JSON.stringify(template, null, 2);
    fs.writeFileSync(fullPath, updatedJson, 'utf-8');

    // Resumo
    console.log(`\n📊 RESUMO:`);
    console.log(`   ✅ Navegações adicionadas: ${addedCount}`);
    console.log(`   ⏭️  Steps já com navegação: ${skippedCount}`);
    console.log(`   📁 Arquivo salvo: ${templatePath}\n`);

    if (addedCount > 0) {
      console.log('✨ Template atualizado com sucesso!\n');
    }

  } catch (error) {
    console.error('❌ Erro ao adicionar blocos de navegação:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const templatePath = process.argv[2] || 'public/templates/quiz21-complete.json';
  
  addNavigationBlocks(templatePath)
    .then(() => {
      console.log('✅ Processo concluído');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}
