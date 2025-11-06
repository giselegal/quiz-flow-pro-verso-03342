#!/usr/bin/env node
// Smoke Step 20 (v3 + Registry)
// - Verifica se step-20-v3.json existe e contém blocos de resultado esperados
// - Garante que UnifiedStepContent usa o pipeline atual (LazyBlockRenderer) e NÃO referencia ModularResultStep
// - Verifica que UnifiedBlockRegistry registra os blocos de resultado
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

try {
    // 1) JSON v3 deve existir e conter blocos esperados
    const stepJsonPath = 'public/templates/step-20-v3.json';
    assert(existsSync(join(ROOT, stepJsonPath)), `Missing file: ${stepJsonPath}`);
    const v3 = JSON.parse(read(stepJsonPath));
    assert(Array.isArray(v3.blocks) && v3.blocks.length > 0, 'step-20-v3.json não possui blocks');
    const types = new Set(v3.blocks.map(b => String(b.type || '').toLowerCase()));
    const expected = ['result-congrats', 'result-main', 'result-image', 'result-description'];
    const missing = expected.filter(t => !types.has(t));
    assert(missing.length === 0, `step-20-v3.json faltando tipos: ${missing.join(', ')}`);

    // 2) UnifiedStepContent deve usar o pipeline novo e NÃO referenciar ModularResultStep
    const unifiedPath = 'src/components/editor/renderers/common/UnifiedStepContent.tsx';
    assert(existsSync(join(ROOT, unifiedPath)), `Missing file: ${unifiedPath}`);
    const unified = read(unifiedPath);
    assert(/LazyBlockRenderer/.test(unified), 'UnifiedStepContent: LazyBlockRenderer não encontrado');
    assert(!/ModularResultStep/.test(unified), 'UnifiedStepContent ainda referencia ModularResultStep (legado)');

    // 3) Registry deve registrar os blocos de resultado
    const registryPath = 'src/registry/UnifiedBlockRegistry.ts';
    assert(existsSync(join(ROOT, registryPath)), `Missing file: ${registryPath}`);
    const registry = read(registryPath);
    const resultEntries = ['result-congrats', 'result-main', 'result-image', 'result-description', 'result-secondary-styles', 'result-share'];
    const notFound = resultEntries.filter(t => !new RegExp(`['\"]${t}['\"]\s*:`).test(registry));
    assert(notFound.length === 0, `UnifiedBlockRegistry sem entradas: ${notFound.join(', ')}`);

    console.log('✅ Smoke Step 20 (v3 + Registry): OK');
} catch (err) {
    console.error('❌ Smoke Step 20 failed:', err.message || err);
    process.exit(1);
}
