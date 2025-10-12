#!/usr/bin/env tsx
/**
 * 🔧 GERADOR DE TEMPLATES - JSON para TypeScript
 * 
 * Este script lê os templates JSON de public/templates/ e gera
 * automaticamente o arquivo src/templates/quiz21StepsComplete.ts
 * 
 * Uso:
 *   npm run generate:templates
 *   ou
 *   tsx scripts/generate-templates.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface JsonBlock {
    id: string;
    type: string;
    position: number;
    properties: any;
    content?: any;
}

interface JsonTemplate {
    templateVersion: string;
    metadata: {
        id: string;
        name: string;
        description: string;
        category: string;
    };
    design?: any;
    blocks: JsonBlock[];
    logic?: any;
}

interface TsBlock {
    id: string;
    type: string;
    order: number;
    content: any;
    properties: any;
}

// Cores ANSI para output bonito
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

/**
 * Converte um bloco JSON para o formato TypeScript
 */
function convertBlock(jsonBlock: JsonBlock): TsBlock {
    return {
        id: jsonBlock.id,
        type: jsonBlock.type,
        order: jsonBlock.position,
        // Mesclar content existente com properties relevantes
        content: {
            ...(jsonBlock.content || {}),
            ...(jsonBlock.properties?.content || {}),
        },
        properties: jsonBlock.properties,
    };
}

/**
 * Processa um arquivo JSON de template (v2.0 ou v3.0)
 */
function processTemplateFile(filePath: string): { stepId: string; data: any } | null {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const jsonTemplate: any = JSON.parse(content);

        // Extrair identificador do step do nome do arquivo
        const fileName = path.basename(filePath);

        // Suportar padrões: step-XX-template.json e step-XX-v3.json
        const matchV2 = fileName.match(/step-(\d+)-template\.json/);
        const matchV3 = fileName.match(/step-(\d+)-v3\.json/);
        const match = matchV2 || matchV3;

        if (!match) {
            log(`⚠️  Arquivo ${fileName} não segue padrão esperado`, colors.yellow);
            return null;
        }

        const stepNum = match[1];
        const stepId = `step-${stepNum}`;

        // Detectar versão do template
        const templateVersion = jsonTemplate.templateVersion || '2.0';

        if (templateVersion === '3.0') {
            // Template v3.0: preservar estrutura completa (sections)
            log(`  ✓ ${stepId} (v3.0): ${jsonTemplate.sections?.length || 0} seções`, colors.green);
            return { stepId, data: jsonTemplate };
        } else {
            // Template v2.0: converter blocos (comportamento original)
            const blocks = jsonTemplate.blocks.map(convertBlock);
            log(`  ✓ ${stepId} (v2.0): ${blocks.length} blocos`, colors.green);
            return { stepId, data: blocks };
        }
    } catch (error) {
        log(`❌ Erro ao processar ${filePath}: ${error}`, colors.red);
        return null;
    }
}

/**
 * Gera o código TypeScript para um step (v2.0 ou v3.0)
 */
function generateStepCode(stepId: string, data: any): string {
    const dataJson = JSON.stringify(data, null, 2);
    // Indentar corretamente (2 espaços)
    const indentedData = dataJson
        .split('\n')
        .map(line => '  ' + line)
        .join('\n');

    return `  '${stepId}': ${indentedData.trim()},`;
}

/**
 * Gera o header do arquivo TypeScript
 */
function generateFileHeader(): string {
    const now = new Date().toISOString();
    return `/**
 * 🎯 TEMPLATE COMPLETO - QUIZ DE ESTILO PESSOAL (21 ETAPAS)
 * 
 * ⚠️  ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITE MANUALMENTE!
 * 
 * Este arquivo é gerado pelo script scripts/generate-templates.ts
 * a partir dos JSONs em public/templates/
 * 
 * Para editar os templates:
 * 1. Edite os arquivos JSON em public/templates/
 * 2. Execute: npm run generate:templates
 * 3. Commit ambos: JSON + este arquivo TS
 * 
 * Gerado em: ${now}
 * Versão: 3.0.0
 */

import { Block } from '../types/editor';

// 🔧 PERFORMANCE E CACHE OTIMIZADO
const TEMPLATE_CACHE = new Map<string, any>();
const FUNNEL_TEMPLATE_CACHE = new Map<string, any>();

// 🚀 FUNÇÃO DE CARREGAMENTO OTIMIZADO PARA PERFORMANCE
export function getStepTemplate(stepId: string): any {
  if (TEMPLATE_CACHE.has(stepId)) {
    return TEMPLATE_CACHE.get(stepId);
  }

  const template = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (template) {
    TEMPLATE_CACHE.set(stepId, template);
    return template;
  }

  console.warn(\`⚠️ Template \${stepId} not found\`);
  return null;
}

// 🎯 NOVA FUNÇÃO: Template personalizado por funil
export function getPersonalizedStepTemplate(stepId: string, funnelId?: string): any {
  if (!funnelId) {
    return getStepTemplate(stepId);
  }

  const cacheKey = \`\${funnelId}:\${stepId}\`;

  if (FUNNEL_TEMPLATE_CACHE.has(cacheKey)) {
    return FUNNEL_TEMPLATE_CACHE.get(cacheKey);
  }

  const baseTemplate = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId];
  if (!baseTemplate) {
    console.warn(\`⚠️ Template \${stepId} not found for funnel \${funnelId}\`);
    return null;
  }

  const personalizedTemplate = personalizeTemplateForFunnel(baseTemplate, funnelId, stepId);
  FUNNEL_TEMPLATE_CACHE.set(cacheKey, personalizedTemplate);

  return personalizedTemplate;
}

// 🎨 FUNÇÃO DE PERSONALIZAÇÃO baseada no funnelId
function personalizeTemplateForFunnel(template: any[], funnelId: string, _stepId: string): any[] {
  if (!Array.isArray(template)) return template;

  const funnelSeed = generateSeedFromFunnelId(funnelId);
  
  return template.map((block) => {
    const personalizedBlock = JSON.parse(JSON.stringify(block));

    if (personalizedBlock.id) {
      personalizedBlock.id = \`\${personalizedBlock.id}-fnl\${funnelSeed}\`;
    }

    return personalizedBlock;
  });
}

function generateSeedFromFunnelId(funnelId: string): number {
  let hash = 0;
  for (let i = 0; i < funnelId.length; i++) {
    hash = ((hash << 5) - hash) + funnelId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 1000);
}

// Environment check for tests
const IS_TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const MINIMAL_TEST_TEMPLATE: Record<string, Block[]> = {
  'step-1': [],
  'step-2': [],
};

`;
}

/**
 * Gera o footer do arquivo TypeScript (exports e schemas)
 */
function generateFileFooter(): string {
    // Ler o arquivo atual para preservar FUNNEL_PERSISTENCE_SCHEMA e QUIZ_GLOBAL_CONFIG
    const currentFilePath = path.join(__dirname, '../src/templates/quiz21StepsComplete.ts');

    try {
        const currentContent = fs.readFileSync(currentFilePath, 'utf8');

        // Extrair FUNNEL_PERSISTENCE_SCHEMA
        const persistenceMatch = currentContent.match(
            /export const FUNNEL_PERSISTENCE_SCHEMA = \{[\s\S]*?\n\};/
        );

        // Extrair QUIZ_GLOBAL_CONFIG
        const configMatch = currentContent.match(
            /export const QUIZ_GLOBAL_CONFIG = \{[\s\S]*?\n\};/
        );

        let footer = '\n\n';

        if (persistenceMatch) {
            footer += `// 🔧 SCHEMA DE PERSISTÊNCIA (preservado do arquivo original)\n${persistenceMatch[0]}\n\n`;
        }

        if (configMatch) {
            footer += `// 🔧 CONFIGURAÇÃO GLOBAL (preservada do arquivo original)\n${configMatch[0]}\n`;
        }

        return footer;
    } catch (error) {
        log(`⚠️  Não foi possível ler arquivo atual, usando footer mínimo`, colors.yellow);
        return '\n\n// ⚠️ FUNNEL_PERSISTENCE_SCHEMA e QUIZ_GLOBAL_CONFIG foram omitidos\n// Execute novamente após criar o arquivo inicial\n';
    }
}

/**
 * Função principal
 */
async function main() {
    log('\n╔══════════════════════════════════════════════════════════════╗', colors.bright);
    log('║     🔧 GERADOR DE TEMPLATES - JSON → TypeScript            ║', colors.bright);
    log('╚══════════════════════════════════════════════════════════════╝\n', colors.bright);

    // Diretórios
    const templatesDir = path.join(__dirname, '../public/templates');
    const outputFile = path.join(__dirname, '../src/templates/quiz21StepsComplete.ts');

    log(`📁 Lendo templates de: ${templatesDir}`, colors.cyan);
    log(`📝 Gerando arquivo: ${outputFile}\n`, colors.cyan);

    // Ler arquivos JSON
    if (!fs.existsSync(templatesDir)) {
        log(`❌ Diretório não encontrado: ${templatesDir}`, colors.red);
        process.exit(1);
    }

    const files = fs.readdirSync(templatesDir)
        .filter(f => f.endsWith('-template.json') || f.endsWith('-v3.json'))
        .sort(); // Garantir ordem

    if (files.length === 0) {
        log(`❌ Nenhum arquivo de template encontrado em ${templatesDir}`, colors.red);
        process.exit(1);
    }

    log(`📋 Encontrados ${files.length} arquivos JSON\n`, colors.blue);

    // Processar cada arquivo
    const templateRecord: Record<string, any> = {};
    let successCount = 0;
    let errorCount = 0;
    let v2Count = 0;
    let v3Count = 0;

    for (const file of files) {
        const filePath = path.join(templatesDir, file);
        const result = processTemplateFile(filePath);

        if (result) {
            templateRecord[result.stepId] = result.data;
            successCount++;

            // Contar versões
            if (Array.isArray(result.data)) {
                v2Count++;
            } else if (result.data.templateVersion === '3.0') {
                v3Count++;
            }
        } else {
            errorCount++;
        }
    }

    log(`\n✅ Processados: ${successCount} templates`, colors.green);
    log(`   • v2.0 (blocos): ${v2Count}`, colors.cyan);
    log(`   • v3.0 (seções): ${v3Count}`, colors.cyan);
    if (errorCount > 0) {
        log(`⚠️  Erros: ${errorCount} arquivos`, colors.yellow);
    }

    // Gerar código TypeScript
    log(`\n🔨 Gerando código TypeScript...`, colors.blue);

    const header = generateFileHeader();
    const templateCode = Object.entries(templateRecord)
        .map(([stepId, data]) => generateStepCode(stepId, data))
        .join('\n\n');

    const fullCode = `${header}
export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, any> = IS_TEST ? MINIMAL_TEST_TEMPLATE : {
${templateCode}
};

// 📋 ALIAS para compatibilidade com código legado
export const QUIZ_QUESTIONS_COMPLETE = QUIZ_STYLE_21_STEPS_TEMPLATE;
${generateFileFooter()}`;

    // Escrever arquivo
    fs.writeFileSync(outputFile, fullCode, 'utf8');

    log(`\n✅ Arquivo gerado com sucesso!`, colors.green);
    log(`   ${outputFile}`, colors.cyan);

    // Estatísticas
    const stats = fs.statSync(outputFile);
    const sizeKB = (stats.size / 1024).toFixed(2);

    // Contar blocos total (apenas v2.0)
    const v2Templates = Object.values(templateRecord).filter(data => Array.isArray(data));
    const totalBlocks = v2Templates.reduce((sum, blocks) => sum + blocks.length, 0);

    // Contar seções total (apenas v3.0)
    const v3Templates = Object.values(templateRecord).filter(data =>
        data && typeof data === 'object' && data.templateVersion === '3.0'
    );
    const totalSections = v3Templates.reduce((sum, template) =>
        sum + (template.sections?.length || 0), 0
    );

    log(`\n📊 Estatísticas:`, colors.blue);
    log(`   • Templates: ${Object.keys(templateRecord).length}`, colors.cyan);
    if (totalBlocks > 0) {
        log(`   • Blocos v2.0: ${totalBlocks}`, colors.cyan);
    }
    if (totalSections > 0) {
        log(`   • Seções v3.0: ${totalSections}`, colors.cyan);
    }
    log(`   • Tamanho arquivo: ${sizeKB} KB`, colors.cyan);

    log(`\n✨ Concluído!`, colors.bright);
    log(`\n💡 Próximos passos:`, colors.yellow);
    log(`   1. Verificar o arquivo gerado`, colors.reset);
    log(`   2. Testar: npm run dev`, colors.reset);
    log(`   3. Commit: git add public/templates/ src/templates/`, colors.reset);
}

// Executar
main().catch((error) => {
    log(`\n❌ Erro fatal: ${error}`, colors.red);
    console.error(error);
    process.exit(1);
});
