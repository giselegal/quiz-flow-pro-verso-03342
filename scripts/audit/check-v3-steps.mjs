#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function pad2(n) { return String(n).padStart(2, '0'); }

const root = process.cwd();
const dir = resolve(root, 'public/templates');
const results = [];

for (let i = 1; i <= 20; i++) {
    const k = pad2(i);
    const file = resolve(dir, `step-${k}-v3.json`);
    const entry = { step: i, file: `public/templates/step-${k}-v3.json`, exists: false, validJSON: false, hasSections: false, sectionsCount: 0, hasBlocks: false, issues: [] };
    if (!existsSync(file)) {
        entry.issues.push('MISSING_FILE');
        results.push(entry);
        continue;
    }
    entry.exists = true;
    try {
        const raw = readFileSync(file, 'utf-8');
        const json = JSON.parse(raw);
        entry.validJSON = true;
        if (Array.isArray(json.sections)) {
            entry.hasSections = true;
            entry.sectionsCount = json.sections.length;
            if (entry.sectionsCount === 0) entry.issues.push('EMPTY_SECTIONS');
        }
        if (Array.isArray(json.blocks)) {
            entry.hasBlocks = true;
            if (json.blocks.length === 0) entry.issues.push('EMPTY_BLOCKS');
        }
        if (!entry.hasSections && !entry.hasBlocks) {
            entry.issues.push('NO_SECTIONS_OR_BLOCKS');
        }
        const id = json?.metadata?.id || '';
        if (!id.includes(`step-${k}`)) {
            entry.issues.push('METADATA_ID_MISMATCH');
        }
    } catch (err) {
        entry.issues.push('INVALID_JSON');
    }
    results.push(entry);
}

const summary = {
    total: results.length,
    present: results.filter(r => r.exists).length,
    missing: results.filter(r => !r.exists).length,
    invalid: results.filter(r => r.exists && !r.validJSON).length,
    noContent: results.filter(r => r.exists && r.validJSON && !r.hasSections && !r.hasBlocks).length,
    withEmptySections: results.filter(r => r.hasSections && r.sectionsCount === 0).length,
};

console.log(JSON.stringify({ summary, results }, null, 2));
