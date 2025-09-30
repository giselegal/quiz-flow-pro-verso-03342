#!/usr/bin/env ts-node
/**
 * 🔍 Audit Supabase Imports
 * Verifica usos diretos de createClient em src/** fora da whitelist.
 * Exit code 1 se violações encontradas.
 */
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

// Whitelist de caminhos (relativos) permitidos a conter createClient(
const WHITELIST = new Set([
    'src/supabase/config.ts'
]);

async function run() {
    const files = await glob('src/**/*.{ts,tsx,js,jsx}');
    const violations: { file: string; line: number; snippet: string }[] = [];

    for (const file of files) {
        const rel = file;
        const content = fs.readFileSync(file, 'utf8');
        if (WHITELIST.has(rel)) continue;
        if (!content.includes('createClient(')) continue;

        // Capturar linhas exatas
        const lines = content.split(/\r?\n/);
        lines.forEach((line, idx) => {
            if (line.includes('createClient(')) {
                violations.push({ file: rel, line: idx + 1, snippet: line.trim() });
            }
        });
    }

    if (violations.length > 0) {
        console.error('\n❌ Supabase audit: usos diretos de createClient encontrados fora da whitelist');
        violations.forEach(v => {
            console.error(` - ${v.file}:${v.line} -> ${v.snippet}`);
        });
        console.error('\nWhitelist atual:', Array.from(WHITELIST).join(', '));
        console.error('\nAção recomendada: substituir por getSupabase() ou adicionar justificativa.');
        process.exit(1);
    } else {
        console.log('✅ Supabase audit: nenhum uso direto de createClient fora da whitelist.');
    }
}

run().catch(err => {
    console.error('Erro na auditoria Supabase:', err);
    process.exit(1);
});
