#!/usr/bin/env node
// Simple smoke test for Step 01 (Intro) editor rendering path and DnD wiring
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
    assert(existsSync(join(ROOT, unifiedPath)), `Missing file: ${unifiedPath}`);

    const unified = read(unifiedPath);
    // Unified should render BlockTypeRenderer and wrap with local DnD
    assert(/<BlockTypeRenderer/.test(unified), 'UnifiedStepContent does not render <BlockTypeRenderer>');
    assert(/DndContext/.test(unified), 'UnifiedStepContent missing DnDContext');
    assert(/SortableContext/.test(unified), 'UnifiedStepContent missing SortableContext');
    assert(/handleBlocksReorder/.test(unified), 'UnifiedStepContent missing handleBlocksReorder wiring');

    console.log('✅ Smoke Step 01: OK');
} catch (err) {
    console.error('❌ Smoke Step 01 failed:', err.message || err);
    process.exit(1);
}
