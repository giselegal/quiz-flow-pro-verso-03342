#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * 🔍 DEBUG SCRIPT - Testar carregamento de template
 * 
 * Este script verifica se o template está sendo carregado corretamente
 * e se a função normalizeStepBlocks está funcionando como esperado
 */

const WORKSPACE_PATH = '/workspaces/quiz-quest-challenge-verse';

// Simular as funções do config
function parseStepKey(key) {
    if (typeof key === 'number' && Number.isFinite(key)) return Number(key);
    if (typeof key !== 'string') return null;
    const m = key.match(/(\d+)/);
    if (m) return Number(m[1]);
    return null;
}

function normalizeStepBlocks(raw) {
    const out = {};
    if (!raw) return out;

    console.log('📊 normalizeStepBlocks input:', {
        hasRaw: !!raw,
        rawKeys: Object.keys(raw || {}),
        rawType: typeof raw,
        sampleEntries: Object.entries(raw || {}).slice(0, 3).map(([k, v]) => [k, typeof v])
    });

    for (const [k, v] of Object.entries(raw || {})) {
        const parsed = parseStepKey(k);
        const targetKey = parsed !== null ? `step-${parsed}` : k;
        let blocks;

        if (Array.isArray(v)) {
            blocks = v;
        } else if (v && typeof v === 'object' && Array.isArray(v.blocks)) {
            blocks = v.blocks;
        } else if (typeof v === 'string') {
            try {
                const parsedJson = JSON.parse(v);
                if (Array.isArray(parsedJson)) {
                    blocks = parsedJson;
                } else if (parsedJson && typeof parsedJson === 'object' && Array.isArray(parsedJson.blocks)) {
                    blocks = parsedJson.blocks;
                }
            } catch (e) {
                console.warn(`❌ Failed to parse JSON for key ${k}:`, e.message);
            }
        } else if (v && typeof v === 'object') {
            const vals = Object.values(v);
            if (vals.length > 0 && vals.every(x => typeof x === 'object')) {
                blocks = vals;
            }
        }

        if (blocks && blocks.length > 0) {
            out[targetKey] = blocks;
            console.log(`✅ Normalized ${k} -> ${targetKey} (${blocks.length} blocks)`);
        } else {
            console.log(`❌ No blocks found for key ${k} (parsed as ${targetKey})`);
        }
    }

    return out;
}

async function main() {
    try {
        console.log('🎯 DEBUG: Testando carregamento de template...\n');

        // 1. Tentar carregar o template diretamente
        const templatePath = join(WORKSPACE_PATH, 'src/templates/quiz21StepsComplete.ts');
        const templateContent = await readFile(templatePath, 'utf8');

        console.log('📁 Template file info:', {
            path: templatePath,
            size: templateContent.length,
            hasExport: templateContent.includes('export'),
            hasQUIZ_STYLE: templateContent.includes('QUIZ_STYLE_21_STEPS_TEMPLATE'),
        });

        // 2. Tentar fazer um import dinâmico
        const templateModule = await import('./src/templates/quiz21StepsComplete.ts');
        const template = templateModule.QUIZ_STYLE_21_STEPS_TEMPLATE;

        console.log('\n📦 Template module info:', {
            hasModule: !!templateModule,
            hasTemplate: !!template,
            templateKeys: template ? Object.keys(template) : [],
            templateType: typeof template,
            firstFewEntries: template ? Object.entries(template).slice(0, 5).map(([k, v]) => [k, Array.isArray(v) ? `Array[${v.length}]` : typeof v]) : []
        });

        // 3. Testar normalização
        if (template) {
            console.log('\n🔧 Testing normalization...');
            const normalized = normalizeStepBlocks(template);

            console.log('\n📊 Normalization result:', {
                normalizedKeys: Object.keys(normalized),
                normalizedCount: Object.keys(normalized).length,
                stepBlocks: Object.entries(normalized).map(([k, v]) => [k, v.length]),
            });

            // 4. Testar steps específicos
            console.log('\n🔍 Testing specific steps:');
            for (let i = 1; i <= 5; i++) {
                const stepKey = `step-${i}`;
                const blocks = normalized[stepKey];
                console.log(`Step ${i} (${stepKey}):`, {
                    hasBlocks: !!blocks,
                    blockCount: blocks?.length || 0,
                    blockTypes: blocks?.map(b => b.type || 'unknown').slice(0, 3) || []
                });
            }
        } else {
            console.error('❌ Template não encontrado ou vazio!');
        }

    } catch (error) {
        console.error('❌ Error during debug:', error);
        console.error('Stack:', error.stack);
    }
}

main().catch(console.error);