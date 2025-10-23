#!/usr/bin/env tsx
/**
 * Divide o master JSON v3 (public/templates/quiz21-complete.json) em arquivos por etapa,
 * gerando também uma versão em blocos modulares para o editor.
 *
 * Saídas:
 * - public/templates/quiz21/steps/step-XX.json        → step bruto (v3: sections, theme, metadata)
 * - public/templates/quiz21/blocks/step-XX.blocks.json → blocos modulares (array de Block)
 * - public/templates/quiz21/index.json                 → índice com lista de steps
 *
 * Uso:
 *   npm run templates:split-master
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Utilitários de conversão (já usados no app)
import { safeGetTemplateBlocks, blockComponentsToBlocks } from '../src/utils/templateConverter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const MASTER_PATH = path.join(ROOT, 'public', 'templates', 'quiz21-complete.json');
const OUT_BASE = path.join(ROOT, 'public', 'templates', 'quiz21');
const OUT_STEPS = path.join(OUT_BASE, 'steps');
const OUT_BLOCKS = path.join(OUT_BASE, 'blocks');

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeStepId(id: string): string {
    const m = String(id).match(/^(?:step-)?(\d{1,2})$/) || String(id).match(/^step-(\d{1,2})/);
    if (m) return `step-${String(parseInt(m[1], 10)).padStart(2, '0')}`;
    return id;
}

async function main() {
    console.log('🚀 Iniciando divisão do master v3 em arquivos por step...');

    if (!fs.existsSync(MASTER_PATH)) {
        console.error('❌ Arquivo master não encontrado em', MASTER_PATH);
        process.exit(1);
    }

    const raw = fs.readFileSync(MASTER_PATH, 'utf-8');
    const master = JSON.parse(raw);
    const stepsObj = master?.steps || master;
    const stepIds = Object.keys(stepsObj)
        .filter(k => /^step-\d{1,2}$/.test(k))
        .map(normalizeStepId)
        .sort();

    ensureDir(OUT_STEPS);
    ensureDir(OUT_BLOCKS);

    const index: Array<{ id: string; path: string; blocksPath: string; type?: string; name?: string }>
        = [];

    let ok = 0; let fail = 0;
    for (const stepId of stepIds) {
        try {
            const step = stepsObj[stepId];

            // 1) Gravar step bruto (v3)
            const stepOutPath = path.join(OUT_STEPS, `${stepId}.json`);
            fs.writeFileSync(stepOutPath, JSON.stringify(step, null, 2), 'utf-8');

            // 2) Converter para blocos modulares (Block[])
            const templateForConverter = { [stepId]: step } as any;
            (templateForConverter as any)._source = 'master-v3';
            const blockComponents = safeGetTemplateBlocks(stepId, templateForConverter);
            const blocks = blockComponentsToBlocks(blockComponents);
            const blocksOut = { stepId, blocks };
            const blocksOutPath = path.join(OUT_BLOCKS, `${stepId}.blocks.json`);
            fs.writeFileSync(blocksOutPath, JSON.stringify(blocksOut, null, 2), 'utf-8');

            index.push({
                id: stepId,
                path: `./steps/${stepId}.json`,
                blocksPath: `./blocks/${stepId}.blocks.json`,
                type: step?.type || step?.metadata?.category,
                name: step?.metadata?.name || stepId,
            });

            console.log(`✅ ${stepId} → sections:${Array.isArray(step?.sections) ? step.sections.length : 0} • blocks:${blocks.length}`);
            ok++;
        } catch (err) {
            console.error(`❌ Falha ao processar ${stepId}:`, err);
            fail++;
        }
    }

    // 3) Gravar índice
    const indexPath = path.join(OUT_BASE, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify({ generatedAt: new Date().toISOString(), steps: index }, null, 2), 'utf-8');

    console.log(`\n📊 Conclusão: ${ok} ok, ${fail} falhas`);
    console.log(`📁 Saída: ${OUT_BASE}`);
}

main().catch(err => {
    console.error('❌ Erro inesperado:', err);
    process.exit(1);
});
