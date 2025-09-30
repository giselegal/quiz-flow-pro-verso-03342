#!/usr/bin/env node
/**
 * 🔍 Audit Script: Verifica se o adapter legado EditorProviderMigrationAdapter ainda é referenciado.
 * Falha (exit 1) se encontrar qualquer ocorrência ativa (ignora node_modules, dist, cobertura e comentários explícitos marcados como allow).
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const TARGET = 'EditorProviderMigrationAdapter';
const ALLOW_TAG = '@allow-legacy-adapter';

const IGNORE_DIRS = new Set([
    'node_modules',
    'dist',
    '.git',
    'coverage',
    '.next',
    '.turbo'
]);

/**
 * Determina se uma linha deve ser ignorada (comentário permitido).
 */
function isAllowedLine(line) {
    if (!line) return false;
    const trimmed = line.trim();
    // Permite se marcado explicitamente
    if (trimmed.includes(ALLOW_TAG)) return true;
    // Ignora referências demonstrativas em markdown ou blocos de comentário JS
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return true;
    return false;
}

function walk(dir, collector) {
    let entries = [];
    try {
        entries = readdirSync(dir);
    } catch (e) {
        return; // ignore directories we cannot read
    }
    for (const entry of entries) {
        if (IGNORE_DIRS.has(entry)) continue;
        const full = join(dir, entry);
        let stats;
        try {
            stats = statSync(full);
        } catch (e) {
            if (e && e.code === 'ENOENT') continue; // race condition / removed file
            continue;
        }
        if (stats.isDirectory()) {
            walk(full, collector);
        } else if (stats.isFile()) {
            if (/\.(tsx?|jsx?|md)$/.test(entry)) {
                collector.push(full);
            }
        }
    }
}

const files = [];
walk(ROOT, files);

const violations = [];
for (const file of files) {
    const content = readFileSync(file, 'utf8');
    if (!content.includes(TARGET)) continue;
    const lines = content.split(/\r?\n/);
    lines.forEach((line, idx) => {
        if (line.includes(TARGET) && !isAllowedLine(line)) {
            // Verifica se é import ou uso real (heurística simples: sem estar completamente comentado)
            const isImport = /import\s+\{?\s*.*${TARGET}.*/.test(line);
            const isUsage = line.includes(TARGET) && !line.trim().startsWith('//');
            if (isImport || isUsage) {
                violations.push({ file, line: idx + 1, text: line.trim() });
            }
        }
    });
}

if (violations.length > 0) {
    console.error('\n❌ Legacy adapter detectado! Remova as referências abaixo ou marque explicitamente se justificável:');
    for (const v of violations) {
        console.error(` - ${v.file}:${v.line} -> ${v.text}`);
    }
    console.error(`\nDica: use provider-alias. Para manter referência documental sem falhar, adicione ${ALLOW_TAG} na linha.`);
    process.exit(1);
}

console.log('✅ Nenhuma referência ativa ao adapter legado encontrada.');
