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

const projectRoot = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const LEGACY_TEMPLATE_JSON = path.join(projectRoot, 'src/templates/quiz21StepsComplete.json');
const REQUIRED_FIELDS = ['templateVersion', 'metadata', 'blocks'];
const REQUIRED_METADATA = ['id', 'name', 'category'];
let cachedStepMap: Record<string, any> | null = null;

async function loadStepBlocksMap(): Promise<Record<string, any>> {
    if (cachedStepMap) return cachedStepMap;
    if (!fs.existsSync(LEGACY_TEMPLATE_JSON)) {
        throw new Error(`Template JSON não encontrado em ${LEGACY_TEMPLATE_JSON}`);
    }
    const raw = fs.readFileSync(LEGACY_TEMPLATE_JSON, 'utf-8');
    const data = JSON.parse(raw);
    // Arquivo pode exportar steps em data.steps ou diretamente via chaves step-XX
    cachedStepMap = data.steps || data;
    return cachedStepMap;
}

async function main() {
    const jsonSummary = validateAllJsonTemplatesSafe();
    const registrySummary = await validateEffectiveStepsAgainstRegistry();
    const navigationSummary = await validateNavigationCompleteness();

    // Resumo total
    const hasJsonErrors = jsonSummary?.invalidCount && jsonSummary.invalidCount > 0;
    const hasRegistryErrors = registrySummary.errors.length > 0;
    const hasNavigationErrors = !navigationSummary.valid;

    console.log('\n====================');
    console.log('Resumo Geral');
    console.log('====================');
    console.table({
        'JSON inválidos': hasJsonErrors ? jsonSummary?.invalidCount : 0,
        'Steps OK': registrySummary.stepsOk,
        'Steps com problemas': registrySummary.stepsWithIssues,
        'Blocos totais': registrySummary.blocksTotal,
        'Tipos ausentes distintos': Object.keys(registrySummary.missingTypes).length,
        'Navegação válida': navigationSummary.valid ? '✅' : '❌',
        'Ciclos de navegação': navigationSummary.cycles.length,
        'Steps órfãos': navigationSummary.orphanedSteps.length,
    });

    if (hasRegistryErrors) process.exit(1);
    if (hasJsonErrors) process.exit(1);
    if (hasNavigationErrors) process.exit(1);
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
    // Carregar módulos TS com tsx via import dinâmico
    const stepMap = await loadStepBlocksMap();
    const registryPathCandidates = [
        'src/registry/UnifiedBlockRegistry.ts',
        'src/core/registry/UnifiedBlockRegistry.ts',
    ];
    let registryMod: any = null;
    for (const candidate of registryPathCandidates) {
        const fullPath = path.join(projectRoot, candidate);
        if (fs.existsSync(fullPath)) {
            registryMod = await import(fullPath);
            break;
        }
    }
    if (!registryMod) {
        throw new Error('UnifiedBlockRegistry não encontrado nas localizações esperadas');
    }
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
    for (let i = 1; i <= 21; i++) {
        const id = `step-${String(i).padStart(2, '0')}`;
        try {
            const raw = stepMap?.[id];
            const source = 'ts-template';
            const effective = Array.isArray(raw) ? { blocks: raw } : raw;
            if (!effective) {
                summary.errors.push(`Step ausente: ${id}`);
                summary.stepsWithIssues++;
                continue;
            }
            let blocks: any[] = [];
            if (Array.isArray(effective?.blocks)) blocks = effective.blocks;
            else if (Array.isArray(effective)) {
                blocks = effective;
            } else if (Array.isArray(effective?.sections)) {
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

/**
 * Parte 3: validar completude de navegação (nextStep)
 */
async function validateNavigationCompleteness() {
    // Importar NavigationService e templates
    const navCandidates = [
        'src/services/NavigationService.ts',
        'src/core/services/NavigationService.ts',
    ];
    let navMod: any = null;
    for (const candidate of navCandidates) {
        const fullPath = path.join(projectRoot, candidate);
        if (fs.existsSync(fullPath)) {
            navMod = await import(fullPath);
            break;
        }
    }
    if (!navMod) {
        throw new Error('NavigationService não encontrado nas localizações esperadas');
    }
    const stepMap = await loadStepBlocksMap();
    const NavigationService = (navMod as any).NavigationService;
    const navService = new NavigationService();
    const steps: any[] = [];

    // Coletar informações de navegação de todos os steps (ordem linear como fallback)
    const orderedStepIds = Array.from({ length: 21 }, (_, i) => `step-${String(i + 1).padStart(2, '0')}`);
    orderedStepIds.forEach((id, index) => {
        const fallbackNext = orderedStepIds[index + 1] ?? null;
        const template = stepMap?.[id];
        const nextStep = template?.navigation?.nextStep ?? fallbackNext;
        const type = template?.metadata?.type || template?.type || template?.[0]?.type;
        steps.push({
            id,
            nextStep,
            order: index,
            type,
        });
    });
    
    // Construir mapa e validar
    navService.buildNavigationMap(steps);
    const validation = navService.validateNavigation();
    const stats = navService.getStats();
    
    console.log('\n====================');
    console.log('Validação de Navegação (nextStep)');
    console.log('====================');
    console.table({
        'Total de steps': validation.totalSteps,
        'Steps com nextStep': validation.stepsWithNext,
        'Steps terminais': validation.terminalSteps.length,
        'Steps órfãos': validation.orphanedSteps.length,
        'Ciclos detectados': validation.cycles.length,
        'Targets ausentes': validation.missingTargets.length,
        'Grafo válido': validation.valid ? '✅' : '❌',
    });
    
    // Detalhes dos problemas
    if (validation.terminalSteps.length > 0) {
        console.log('\n📍 Steps terminais (nextStep: null):', validation.terminalSteps.join(', '));
    }
    
    if (validation.orphanedSteps.length > 0) {
        console.log('\n⚠️  Steps órfãos (nunca referenciados como nextStep):');
        validation.orphanedSteps.forEach((stepId: string) => {
            console.log(`   - ${stepId}`);
        });
    }
    
    if (validation.cycles.length > 0) {
        console.log('\n🔄 Ciclos detectados:');
        validation.cycles.forEach((cycle: string[], idx: number) => {
            console.log(`   ${idx + 1}. ${cycle.join(' → ')}`);
        });
    }
    
    if (validation.missingTargets.length > 0) {
        console.log('\n❌ NextStep aponta para step inexistente:');
        validation.missingTargets.forEach(({ from, to }: { from: string; to: string }) => {
            console.log(`   - ${from} → ${to} (não existe)`);
        });
    }
    
    return validation;
}

main().catch((e) => {
    console.error('Falha inesperada na validação:', e);
    process.exit(1);
});
