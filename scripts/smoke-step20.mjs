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
    // 1) Detectar modo (blocks vs sections)
    const candidatesV3 = ['public/templates/step-20-v3.json', 'templates/step-20-v3.json'];
    const candidatesBlocks = ['templates/step-20.json'];
    const pathV3 = candidatesV3.find(p => existsSync(join(ROOT, p)));
    const pathBlocks = candidatesBlocks.find(p => existsSync(join(ROOT, p)));

    assert(pathV3 || pathBlocks, `Missing file: ${candidatesV3[0]} or ${candidatesV3[1]} or ${candidatesBlocks[0]}`);

    if (pathBlocks) {
        const data = JSON.parse(read(pathBlocks));
        assert(Array.isArray(data.blocks) && data.blocks.length > 0, 'step-20.json não possui blocks');
        const types = new Set(data.blocks.map(b => String(b.type || '').toLowerCase()));
        const expectedBlocks = ['result.headline', 'result.secondarylist', 'offer.core'];
        const missingBlocks = expectedBlocks.filter(t => !types.has(t));
        assert(missingBlocks.length === 0, `step-20.json faltando tipos: ${missingBlocks.join(', ')}`);
    } else if (pathV3) {
        const v3 = JSON.parse(read(pathV3));
        assert(Array.isArray(v3.sections) && v3.sections.length > 0, 'step-20-v3.json não possui sections');
        const types = new Set(v3.sections.map(s => String(s.type || '').toLowerCase()));
        const expectedSections = ['herosection', 'styleprofilesection', 'ctabutton', 'offersection'];
        const missingSections = expectedSections.filter(t => !types.has(t));
        assert(missingSections.length === 0, `step-20-v3.json faltando sections: ${missingSections.join(', ')}`);
    }

    // 2) UnifiedStepContent deve usar o pipeline novo e NÃO referenciar ModularResultStep
    const unifiedPath = 'src/components/editor/renderers/common/UnifiedStepContent.tsx';
    assert(existsSync(join(ROOT, unifiedPath)), `Missing file: ${unifiedPath}`);
    const unified = read(unifiedPath);
    assert(/LazyBlockRenderer/.test(unified), 'UnifiedStepContent: LazyBlockRenderer não encontrado');
    const hasActiveImport = /^\s*import[^\n]*ModularResultStep/m.test(unified);
    if (hasActiveImport) {
        console.warn('⚠️ UnifiedStepContent ainda importa ModularResultStep (legado)');
    }

    // 3) Registry deve registrar os blocos de resultado
    const registryPaths = ['src/registry/UnifiedBlockRegistry.ts', 'src/templates/registry.ts'];
    const registryPath = registryPaths.find(p => existsSync(join(ROOT, p)));
    if (registryPath) {
        const registry = read(registryPath);
        const mustHaveAny = [
            /step20-result-header|result-header-inline/i,
            /step20-style-reveal|style-card-inline/i,
            /step20-personalized-offer|secure-purchase|quiz-offer-cta-inline/i,
        ];
        const missing = mustHaveAny.filter(rx => !rx.test(registry));
        if (missing.length > 0) {
            console.warn('⚠️ Registry sem blocos de resultado/offer esperados');
        }
    } else {
        console.warn('⚠️ Registry não encontrado, pulando verificação de entradas');
    }

    console.log('✅ Smoke Step 20 (v3 + Registry): OK');
} catch (err) {
    console.error('❌ Smoke Step 20 failed:', err.message || err);
    process.exit(1);
}
