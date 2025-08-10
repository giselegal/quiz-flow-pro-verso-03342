#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE MIGRAÇÃO AUTOMÁTICA DOS TEMPLATES PARA O BANCO
 * Converte todos os Step Templates para o sistema de componentes reutilizáveis
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 INICIANDO MIGRAÇÃO AUTOMÁTICA DOS TEMPLATES...\n");

// ============================================================================
// MAPEAMENTO DE COMPONENTES ANTIGOS PARA NOVOS
// ============================================================================

const COMPONENT_MAPPING = {
  // IDs específicos → IDs reutilizáveis
  "step01-header": "quiz-header",
  "step02-header": "quiz-header",
  "step03-header": "quiz-header",
  "step04-header": "quiz-header",
  "step05-header": "quiz-header",
  "step06-header": "quiz-header",
  "step07-header": "quiz-header",
  "step08-header": "quiz-header",
  "step09-header": "quiz-header",
  "step10-header": "quiz-header",
  "step11-header": "quiz-header",
  "step12-header": "quiz-header",
  "step13-header": "quiz-header",
  "step14-header": "quiz-header",
  "step15-header": "quiz-header",
  "step16-header": "quiz-header",
  "step17-header": "quiz-header",
  "step18-header": "quiz-header",
  "step19-header": "quiz-header",
  "step20-header": "quiz-header",
  "step21-header": "quiz-header",

  // Títulos de questões
  "step01-hero-title": "question-title",
  "step02-question-title": "question-title",
  "step03-question-title": "question-title",
  "step04-question-title": "question-title",
  "step05-question-title": "question-title",
  "step06-question-title": "question-title",
  "step07-question-title": "question-title",
  "step08-question-title": "question-title",
  "step09-question-title": "question-title",
  "step10-question-title": "question-title",
  "step11-question-title": "question-title",
  "step12-question-title": "question-title",
  "step13-question-title": "question-title",
  "step14-question-title": "question-title",

  // Contadores de questão
  "step02-question-counter": "question-counter",
  "step03-question-counter": "question-counter",
  "step04-question-counter": "question-counter",
  "step05-question-counter": "question-counter",
  "step06-question-counter": "question-counter",
  "step07-question-counter": "question-counter",
  "step08-question-counter": "question-counter",
  "step09-question-counter": "question-counter",
  "step10-question-counter": "question-counter",
  "step11-question-counter": "question-counter",
  "step12-question-counter": "question-counter",
  "step13-question-counter": "question-counter",
  "step14-question-counter": "question-counter",

  // Opções de questões
  "step02-clothing-options": "options-grid",
  "step03-personality-options": "options-grid",
  "step04-body-type-options": "options-grid",
  "step05-q4-options": "options-grid",
  "step06-q5-options": "options-grid",
  "step07-routine-options": "options-grid",
  "step08-occasion-options": "options-grid",
  "step09-budget-options": "options-grid",
  "step10-shopping-options": "options-grid",
  "step11-inspiration-options": "options-grid",
  "step12-challenges-options": "options-grid",
  "step13-preferences-options": "options-grid",
  "step14-style-options": "options-grid",

  // Imagens
  "step01-hero-image": "hero-image",
  "step02-clothing-image": "question-image",
  "step03-personality-image": "question-image",
  "step04-body-image": "question-image",

  // Componentes especiais
  "step01-hero-subtitle": "hero-subtitle",
  "step01-hero-description": "hero-description",
  "step01-start-button": "cta-button",
  "step15-transition-title": "transition-title",
  "step15-transition-subtitle": "transition-subtitle",
  "step16-processing-title": "processing-title",
  "step17-result-title": "result-title",
  "step18-result-description": "result-description",
  "step19-transformation": "transformation-gallery",
  "step20-lead-form": "lead-form",
  "step21-offer-title": "offer-title",
  "step21-offer-description": "offer-description",
  "step21-offer-cta": "offer-cta",
};

// ============================================================================
// FUNÇÃO PARA CONVERTER ARQUIVO DE TEMPLATE
// ============================================================================

function convertTemplateFile(filePath) {
  console.log(`🔄 Processando: ${path.basename(filePath)}`);

  try {
    // Ler arquivo original
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanges = false;

    // Fazer backup
    const backupPath = filePath + ".backup";
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content);
      console.log(`   💾 Backup criado: ${path.basename(backupPath)}`);
    }

    // Aplicar conversões de IDs
    for (const [oldId, newId] of Object.entries(COMPONENT_MAPPING)) {
      const oldPattern = `"id": "${oldId}"`;
      const newPattern = `"id": "${newId}"`;

      if (content.includes(oldPattern)) {
        content = content.replace(new RegExp(oldPattern, "g"), newPattern);
        hasChanges = true;
        console.log(`   ✅ Convertido: ${oldId} → ${newId}`);
      }
    }

    // Salvar arquivo modificado
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`   🎯 Arquivo atualizado com sucesso!\n`);
      return true;
    } else {
      console.log(`   ℹ️  Nenhuma mudança necessária\n`);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Erro ao processar arquivo: ${error.message}\n`);
    return false;
  }
}

// ============================================================================
// FUNÇÃO PARA GERAR SQL DE INSERÇÃO DE COMPONENTES
// ============================================================================

function generateComponentInsertSQL() {
  const sqlFilePath = path.join(__dirname, "insert-component-instances.sql");

  let sql = `-- 🚀 INSERÇÃO AUTOMÁTICA DE INSTÂNCIAS DE COMPONENTES
-- Gerado automaticamente em ${new Date().toISOString()}

-- Limpar instâncias existentes (opcional - descomente se necessário)
-- DELETE FROM component_instances WHERE quiz_id = 'quiz-demo-id';

-- Inserir instâncias para quiz demo (substitua 'quiz-demo-id' pelo ID real)
`;

  // Gerar INSERTs para cada etapa
  for (let step = 1; step <= 21; step++) {
    sql += `\n-- =============================================================================\n`;
    sql += `-- ETAPA ${step.toString().padStart(2, "0")}\n`;
    sql += `-- =============================================================================\n\n`;

    // Componentes comuns em todas as etapas com questões (2-14)
    if (step >= 2 && step <= 14) {
      sql += `INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', ${step}, 1, '{"progressValue": ${step * 10}, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', ${step}, 2, '{"content": "Questão ${step - 1} de ${14 - 1}"}'::jsonb),
  ('question-counter', 'quiz-demo-id', ${step}, 3, '{"content": "Questão ${step - 1} de ${14 - 1}"}'::jsonb),
  ('options-grid', 'quiz-demo-id', ${step}, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);\n\n`;
    }

    // Etapa 1 (Hero)
    else if (step === 1) {
      sql += `INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', ${step}, 1, '{"showProgress": false, "showBackButton": false}'::jsonb),
  ('hero-image', 'quiz-demo-id', ${step}, 2, '{"src": "", "alt": "Imagem principal", "size": "large"}'::jsonb),
  ('question-title', 'quiz-demo-id', ${step}, 3, '{"content": "Descubra Seu Estilo Ideal", "fontSize": "text-4xl"}'::jsonb),
  ('hero-subtitle', 'quiz-demo-id', ${step}, 4, '{"content": "Quiz personalizado de estilo"}'::jsonb),
  ('hero-description', 'quiz-demo-id', ${step}, 5, '{"content": "Responda algumas perguntas e descubra qual estilo combina mais com você!"}'::jsonb),
  ('cta-button', 'quiz-demo-id', ${step}, 6, '{"text": "Começar Quiz", "variant": "primary", "size": "xl"}'::jsonb);\n\n`;
    }

    // Etapas especiais (15-21)
    else {
      const specialTypes = {
        15: "transition-title",
        16: "processing-title",
        17: "result-title",
        18: "result-description",
        19: "transformation-gallery",
        20: "lead-form",
        21: "offer-cta",
      };

      const componentType = specialTypes[step] || "question-title";
      sql += `INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', ${step}, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('${componentType}', 'quiz-demo-id', ${step}, 2, '{}'::jsonb);\n\n`;
    }
  }

  sql += `-- 🎯 ATUALIZAR CONTADORES DE USO
UPDATE component_types SET usage_count = (
  SELECT COUNT(*) FROM component_instances 
  WHERE component_instances.component_type_key = component_types.type_key
);

-- ✅ MIGRAÇÃO CONCLUÍDA!
-- Total de instâncias criadas: ${21 * 2} (aproximadamente)
`;

  fs.writeFileSync(sqlFilePath, sql);
  console.log(`📄 Arquivo SQL gerado: ${sqlFilePath}\n`);
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

function main() {
  const templatesDir = path.join(__dirname, "src", "components", "steps");

  if (!fs.existsSync(templatesDir)) {
    console.error("❌ Diretório de templates não encontrado:", templatesDir);
    process.exit(1);
  }

  // Buscar todos os arquivos de template
  const templateFiles = fs
    .readdirSync(templatesDir)
    .filter(file => file.match(/^Step\d+Template\.tsx$/))
    .map(file => path.join(templatesDir, file));

  console.log(`📁 Encontrados ${templateFiles.length} arquivos de template\n`);

  let convertedCount = 0;

  // Converter cada arquivo
  templateFiles.forEach(filePath => {
    if (convertTemplateFile(filePath)) {
      convertedCount++;
    }
  });

  // Gerar SQL de inserção
  generateComponentInsertSQL();

  // Relatório final
  console.log("🎯 MIGRAÇÃO CONCLUÍDA!");
  console.log("═══════════════════════════════════════");
  console.log(`📊 Templates processados: ${templateFiles.length}`);
  console.log(`✅ Templates convertidos: ${convertedCount}`);
  console.log(`📄 Arquivo SQL gerado: insert-component-instances.sql`);
  console.log("");
  console.log("🚀 PRÓXIMOS PASSOS:");
  console.log("1. Revise os backups criados (.backup)");
  console.log("2. Execute o arquivo SQL no banco de dados");
  console.log("3. Teste o sistema com os novos IDs reutilizáveis");
  console.log("4. Atualize o frontend para usar as APIs do banco");
  console.log("");
  console.log("🔥 SISTEMA DE COMPONENTES REUTILIZÁVEIS ATIVO!");
}

// Executar script
main();
