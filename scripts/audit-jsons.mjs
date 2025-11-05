#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const IGNORED_DIRS = new Set([
    'node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage',
    '.turbo', '.cache', '.vercel', '.vscode', '.idea', '.pnpm', '.yarn'
]);

/** @typedef {{
 *  file: string,
 *  error?: { message: string, position?: number, line?: number, column?: number },
 *  sizeBytes: number,
 *  topKeys?: Record<string, string>,
 *  idValues?: Array<string|number>,
 *  stepsInfo?: {
 *    count: number,
 *    stepIds: Array<string|number>,
 *    duplicateStepIds: Array<string|number>
 *  }
 * }} FileAudit
 */

function computeLineCol(content, position) {
    if (typeof position !== 'number' || position < 0) return {};
    let line = 1, col = 1;
    for (let i = 0; i < content.length && i < position; i++) {
        if (content[i] === '\n') { line++; col = 1; } else { col++; }
    }
    return { line, column: col };
}

async function* walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const base = path.basename(full);
            if (IGNORED_DIRS.has(base)) continue;
            // Ignore hidden folders at root level commonly large
            if (base.startsWith('.') && base !== '.') continue;
            yield* walk(full);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
            yield full;
        }
    }
}

function typeOf(v) {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v; // string, number, boolean, object
}

async function auditFile(file) {
    const rel = path.relative(ROOT, file);
    const content = await fs.readFile(file, 'utf8');
    const sizeBytes = Buffer.byteLength(content);
    /** @type {FileAudit} */
    const result = { file: rel, sizeBytes };
    try {
        const data = JSON.parse(content);
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            const topKeys = {};
            for (const [k, v] of Object.entries(data)) {
                topKeys[k] = typeOf(v);
            }
            result.topKeys = topKeys;
            // Collect top-level id values
            if ('id' in data) {
                const idVal = data.id;
                if (['string', 'number'].includes(typeof idVal)) {
                    result.idValues = [idVal];
                }
            }
            // Steps analysis if present
            if (Array.isArray(data.steps)) {
                const stepIds = [];
                const seen = new Set();
                const dups = new Set();
                for (const s of data.steps) {
                    const sid = s && (s.id ?? s.stepId ?? s.key ?? s.slug);
                    if (sid !== undefined) {
                        stepIds.push(sid);
                        if (seen.has(String(sid))) dups.add(String(sid));
                        else seen.add(String(sid));
                    }
                }
                result.stepsInfo = {
                    count: data.steps.length,
                    stepIds,
                    duplicateStepIds: Array.from(dups)
                };
            }
        }
    } catch (e) {
        // Try extract position from message: e.g., 'Unexpected token } in JSON at position 123'
        const msg = String(e && e.message || e);
        const match = msg.match(/position\s+(\d+)/i);
        const position = match ? Number(match[1]) : undefined;
        const { line, column } = position !== undefined ? computeLineCol(content, position) : {};
        result.error = { message: msg, position, line, column };
    }
    return result;
}

function summarize(files) {
    const summary = {
        totalFiles: files.length,
        valid: files.filter(f => !f.error).length,
        invalid: files.filter(f => !!f.error).length,
        largestFiles: [...files].sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 10),
        keyFrequency: {},
        idOccurrences: new Map(),
        stepsWithDuplicates: []
    };
    for (const f of files) {
        if (f.topKeys) {
            for (const [k, t] of Object.entries(f.topKeys)) {
                const bucket = summary.keyFrequency[k] || { count: 0, types: new Set() };
                bucket.count++;
                bucket.types.add(t);
                summary.keyFrequency[k] = bucket;
            }
        }
        if (f.idValues) {
            for (const id of f.idValues) {
                const key = String(id);
                const arr = summary.idOccurrences.get(key) || [];
                arr.push(f.file);
                summary.idOccurrences.set(key, arr);
            }
        }
        if (f.stepsInfo && f.stepsInfo.duplicateStepIds && f.stepsInfo.duplicateStepIds.length) {
            summary.stepsWithDuplicates.push({ file: f.file, duplicates: f.stepsInfo.duplicateStepIds });
        }
    }
    return summary;
}

function formatBytes(n) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0; let v = n;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function toMarkdown(files, summary) {
    const lines = [];
    const now = new Date();
    const d = now.toISOString().slice(0, 10);
    lines.push(`# Auditoria de JSONs - ${d}`);
    lines.push('');
    lines.push('## Resumo');
    lines.push('');
    lines.push(`- Total de arquivos: ${summary.totalFiles}`);
    lines.push(`- Válidos: ${summary.valid}`);
    lines.push(`- Inválidos: ${summary.invalid}`);
    lines.push('');
    if (summary.largestFiles.length) {
        lines.push('### Maiores arquivos');
        for (const f of summary.largestFiles) {
            lines.push(`- ${f.file} (${formatBytes(f.sizeBytes)})`);
        }
        lines.push('');
    }
    if (summary.invalid) {
        lines.push('## Erros de sintaxe');
        for (const f of files.filter(f => f.error)) {
            const pos = f.error.position != null ? ` posição ${f.error.position}` : '';
            const lc = f.error.line ? ` (linha ${f.error.line}, coluna ${f.error.column})` : '';
            lines.push(`- ${f.file}:${lc}${pos} — ${f.error.message}`);
        }
        lines.push('');
    }
    if (summary.idOccurrences.size) {
        const dups = [...summary.idOccurrences.entries()].filter(([, arr]) => arr.length > 1);
        if (dups.length) {
            lines.push('## IDs duplicados entre arquivos');
            for (const [id, filesArr] of dups) {
                lines.push(`- id "${id}": ${filesArr.join(', ')}`);
            }
            lines.push('');
        }
    }
    if (summary.stepsWithDuplicates.length) {
        lines.push('## Duplicatas de steps dentro de arquivos');
        for (const s of summary.stepsWithDuplicates) {
            lines.push(`- ${s.file}: stepIds duplicados = ${s.duplicates.join(', ')}`);
        }
        lines.push('');
    }
    if (Object.keys(summary.keyFrequency).length) {
        lines.push('## Chaves de topo mais comuns');
        const sorted = Object.entries(summary.keyFrequency).sort((a, b) => b[1].count - a[1].count);
        for (const [k, info] of sorted.slice(0, 30)) {
            lines.push(`- ${k}: presente em ${info.count} arquivos; tipos: ${[...info.types].join(', ')}`);
        }
        lines.push('');
    }
    lines.push('---');
    lines.push('Relatório gerado automaticamente por scripts/audit-jsons.mjs');
    return lines.join('\n');
}

async function main() {
    const files = [];
    for await (const f of walk(ROOT)) {
        files.push(f);
    }
    const audits = [];
    for (const f of files) {
        audits.push(await auditFile(f));
    }
    const summary = summarize(audits);
    const md = toMarkdown(audits, summary);
    const outName = `AUDITORIA_JSONS_${new Date().toISOString().slice(0, 10)}.md`;
    await fs.writeFile(path.join(ROOT, outName), md, 'utf8');
    console.log(`Relatório gerado: ${outName}`);
    console.log(`Arquivos analisados: ${audits.length} | Válidos: ${summary.valid} | Inválidos: ${summary.invalid}`);
}

main().catch(err => {
    console.error('Erro na auditoria:', err);
    process.exit(1);
});
