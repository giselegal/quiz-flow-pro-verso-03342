#!/usr/bin/env node
// Simple smoke test for Step 01 (Intro) modular path and DnD wiring
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
    const unifiedPath = 'src/components/editor/renderers/common/UnifiedStepContent.tsx';
    const introPath = 'src/components/editor/quiz-estilo/ModularIntroStep.tsx';

    assert(existsSync(join(ROOT, unifiedPath)), `Missing file: ${unifiedPath}`);
    assert(existsSync(join(ROOT, introPath)), `Missing file: ${introPath}`);

    const unified = read(unifiedPath);
    const intro = read(introPath);

    // Unified should render ModularIntroStep and pass onBlocksReorder
    assert(/<ModularIntroStep/.test(unified), 'UnifiedStepContent does not render <ModularIntroStep>');
    assert(/onBlocksReorder=\{handleBlocksReorder\}/.test(unified), 'UnifiedStepContent does not pass onBlocksReorder to Intro');

    // Intro step should have local DnD context and sortable
    assert(/DndContext/.test(intro), 'ModularIntroStep missing DndContext');
    assert(/SortableContext/.test(intro), 'ModularIntroStep missing SortableContext');
    const hasOnBlocksReorder = /onBlocksReorder\?\./.test(intro) || /onBlocksReorder\(/.test(intro);
    assert(hasOnBlocksReorder, 'ModularIntroStep missing onBlocksReorder usage');

    console.log('✅ Smoke Step 01: OK');
} catch (err) {
    console.error('❌ Smoke Step 01 failed:', err.message || err);
    process.exit(1);
}
