#!/usr/bin/env tsx
/**
 * Script para validação abrangente de templates e registro de blocos
 * 
 * Uso: npm run validate:templates
 * 
 * Faz duas coisas:
 * 1) Valida JSONs em scripts/templates/*.json (quando existirem)
 * 2) Valida os 21 steps efetivos (TemplateRegistry + TS) e verifica tipos no UnifiedBlockRegistry
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock de import.meta.env para evitar erros em scripts Node
if (typeof (globalThis as any).process !== 'undefined') {
  (process as any).env = process.env || {};
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}

// Evitar aliases TS fora de src: usar import dinâmico com caminhos relativos ao projeto

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const REQUIRED_FIELDS = ['templateVersion', 'metadata', 'blocks'];
const REQUIRED_METADATA = ['id', 'name', 'category'];

async function main() {
        const jsonSummary = validateAllJsonTemplatesSafe();
        const registrySummary = await validateEffectiveStepsAgainstRegistry();

    // Resumo total
    const hasJsonErrors = jsonSummary?.invalidCount && jsonSummary.invalidCount > 0;
    const hasRegistryErrors = registrySummary.errors.length > 0;

    console.log('\n====================');
    console.log('Resumo Geral');
    console.log('====================');
    console.table({
        'JSON inválidos': hasJsonErrors ? jsonSummary?.invalidCount : 0,
        'Steps OK': registrySummary.stepsOk,
        'Steps com problemas': registrySummary.stepsWithIssues,
        'Blocos totais': registrySummary.blocksTotal,
        'Tipos ausentes distintos': Object.keys(registrySummary.missingTypes).length,
    });

    if (hasRegistryErrors) process.exit(1);
    if (hasJsonErrors) process.exit(1);
    process.exit(0);
}

/**
 * Parte 1: validar JSONs soltos (opcional)
 */
function validateAllJsonTemplatesSafe(): { total: number; validCount: number; invalidCount: number } | null {
    try {
        console.log('🔍 Validando templates JSON (scripts/templates)...\n');
        if (!fs.existsSync(TEMPLATES_DIR)) {
            console.warn(`(skip) Diretório não encontrado: ${TEMPLATES_DIR}`);
            return { total: 0, validCount: 0, invalidCount: 0 };
        }

        const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.json'));
        if (files.length === 0) {
            console.warn('(skip) Nenhum template JSON encontrado em scripts/templates');
            return { total: 0, validCount: 0, invalidCount: 0 };
        }

        let validCount = 0;
        let invalidCount = 0;

        files.forEach(file => {
            const filepath = path.join(TEMPLATES_DIR, file);
            const result = validateJsonTemplate(filepath);
            if (result.valid) {
                console.log(`✅ ${file} - OK`);
                validCount++;
            } else {
                console.log(`❌ ${file} - INVÁLIDO`);
                result.errors.forEach(err => console.log(`   ⚠️  ${err}`));
                invalidCount++;
            }
            if (result.warnings.length > 0) {
                result.warnings.forEach(warn => console.log(`   ⚡ ${warn}`));
            }
        });

        console.log(`\n📊 JSONs: ${validCount} válidos / ${files.length} total`);
        return { total: files.length, validCount, invalidCount };
    } catch (e) {
        console.warn('⚠️  Falha ao validar JSONs (ignorando):', e);
        return null;
    }
}

function validateJsonTemplate(filepath: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        const template = JSON.parse(content);
        REQUIRED_FIELDS.forEach(field => { if (!template[field]) errors.push(`Campo obrigatório ausente: ${field}`); });
        if (template.metadata) {
            REQUIRED_METADATA.forEach(field => { if (!template.metadata[field]) errors.push(`Metadata obrigatória ausente: ${field}`); });
        }
        if (template.templateVersion && template.templateVersion !== '2.0') {
            warnings.push(`Versão do template: ${template.templateVersion} (esperado: 2.0)`);
        }
        if (!template.blocks || !Array.isArray(template.blocks)) {
            errors.push('Template deve ter um array de blocos');
        }
        if (template.blocks && template.blocks.length === 0) {
            const isTransition = template.metadata?.category?.includes('transition');
            if (!isTransition) warnings.push('Template não possui blocos');
        }
    } catch (error: any) {
        errors.push(`Erro ao ler arquivo: ${error.message}`);
    }
    return { valid: errors.length === 0, errors, warnings };
}

/**
 * Parte 2: validar steps efetivos contra o registry de blocos
 */
async function validateEffectiveStepsAgainstRegistry() {
    const projectRoot = path.join(__dirname, '..');
    // Carregar módulos TS com tsx via import dinâmico
    const importsMod = await import(path.join(projectRoot, 'src/templates/imports.ts'));
    const registryMod = await import(path.join(projectRoot, 'src/registry/UnifiedBlockRegistry.ts'));
    const getQuiz21StepsTemplate = (importsMod as any).getQuiz21StepsTemplate as () => any;
    const getStepTemplate = (importsMod as any).getStepTemplate as (id: string) => { step: any; source: string };
    const blockRegistry = (registryMod as any).blockRegistry as {
        has: (t: string) => boolean;
        getComponentAsync: (t: string) => Promise<any>;
    };
    const summary = {
        stepsTotal: 21,
        stepsOk: 0,
        stepsWithIssues: 0,
        blocksTotal: 0,
        missingTypes: {} as Record<string, number>,
        warnings: [] as string[],
        errors: [] as string[],
    };

        const full = getQuiz21StepsTemplate() as any;
    for (let i = 1; i <= 21; i++) {
        const id = `step-${String(i).padStart(2, '0')}`;
        try {
            const { step, source } = getStepTemplate(id);
            const effective = step || full?.[id];
            if (!effective) {
                summary.errors.push(`Step ausente: ${id}`);
                summary.stepsWithIssues++;
                continue;
            }
            let blocks: any[] = [];
            if (Array.isArray(effective.blocks)) blocks = effective.blocks;
            else if (Array.isArray(effective.sections)) {
                        try {
                            const convMod = await import(path.join(projectRoot, 'src/utils/sectionToBlockConverter.ts'));
                            const convertSectionsToBlocks = (convMod as any).convertSectionsToBlocks as (s: any[]) => any[];
                            blocks = typeof convertSectionsToBlocks === 'function' ? convertSectionsToBlocks(effective.sections) : [];
                        } catch {
                    summary.warnings.push(`Conversor sections→blocks indisponível para ${id}`);
                }
            }
            summary.blocksTotal += blocks.length;
            let hasIssue = false;
            for (const [idx, b] of blocks.entries()) {
                const type = String((b && b.type) || '').trim();
                if (!type) {
                    summary.errors.push(`${id}: bloco[${idx}] sem type`);
                    hasIssue = true;
                    continue;
                }
                if (!blockRegistry.has(type)) {
                    summary.missingTypes[type] = (summary.missingTypes[type] || 0) + 1;
                    try { await blockRegistry.getComponentAsync(type); } catch {}
                    if (!blockRegistry.has(type)) {
                        summary.errors.push(`${id}: tipo de bloco não encontrado no registry → "${type}"`);
                        hasIssue = true;
                    }
                }
            }
            if (hasIssue) summary.stepsWithIssues++; else summary.stepsOk++;
            console.log(`✔️  ${id} • source=${source} • ${blocks.length} blocos`);
        } catch (e: any) {
            summary.errors.push(`Falha ao validar ${id}: ${e?.message || e}`);
            summary.stepsWithIssues++;
        }
    }

    const missingTypesList = Object.entries(summary.missingTypes)
        .sort((a, b) => b[1] - a[1])
        .map(([t, c]) => `${t} (${c})`);
    console.log('\n====================');
    console.log('Validação por Step × Registry');
    console.log('====================');
    console.table({
        'Steps OK': summary.stepsOk,
        'Steps com problemas': summary.stepsWithIssues,
        'Blocos totais': summary.blocksTotal,
        'Tipos ausentes distintos': Object.keys(summary.missingTypes).length,
    });
    if (missingTypesList.length) console.log('Tipos ausentes:', missingTypesList.join(', '));

    return summary;
}

main().catch((e) => {
    console.error('Falha inesperada na validação:', e);
    process.exit(1);
});
