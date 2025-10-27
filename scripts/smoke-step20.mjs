#!/usr/bin/env node
// Simple smoke test for Step 20 (Result) modular path and DnD wiring
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
    const resultPath = 'src/components/editor/quiz-estilo/ModularResultStep.tsx';

    assert(existsSync(join(ROOT, unifiedPath)), `Missing file: ${unifiedPath}`);
    assert(existsSync(join(ROOT, resultPath)), `Missing file: ${resultPath}`);

    const unified = read(unifiedPath);
    const result = read(resultPath);

    // Unified should render ModularResultStep and pass onBlocksReorder
    assert(/<ModularResultStep/.test(unified), 'UnifiedStepContent does not render <ModularResultStep>');
    assert(/onBlocksReorder=\{handleBlocksReorder\}/.test(unified), 'UnifiedStepContent does not pass onBlocksReorder to Result');

    // Result step should have local DnD context and sortable
    assert(/DndContext/.test(result), 'ModularResultStep missing DndContext');
    assert(/SortableContext/.test(result), 'ModularResultStep missing SortableContext');
    assert(/onDragEnd=\{handleDragEnd\}/.test(result), 'ModularResultStep missing onDragEnd handler');
    const hasOnBlocksReorder = /onBlocksReorder\?\./.test(result) || /onBlocksReorder\(/.test(result);
    assert(hasOnBlocksReorder, 'ModularResultStep missing onBlocksReorder usage');

    console.log('✅ Smoke Step 20: OK');
} catch (err) {
    console.error('❌ Smoke Step 20 failed:', err.message || err);
    process.exit(1);
}
