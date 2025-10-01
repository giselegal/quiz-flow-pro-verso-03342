#!/usr/bin/env node
/**
 * Script: check-legacy-analytics.mjs
 * Objetivo: Impedir novos imports diretos de serviços de analytics marcados como deprecated.
 * Uso: node scripts/check-legacy-analytics.mjs
 * Exit code 1 se encontrar violações.
 */

import { globby } from 'globby';
import fs from 'fs';
import path from 'path';

// Lista de padrões de módulos deprecated (parciais para detectar caminhos relativos ou alias)
const DEPRECATED_PATTERNS = [
    'analyticsEngine',
    'realTimeAnalytics',
    'ActivatedAnalytics',
    'EnhancedUnifiedDataService',
    'monitoring/AnalyticsService',
    'AnalyticsService' // manter por último (evitar falso positivo em nomes compostos)
];

// Arquivos que podem conter imports legacy por motivo de compat (whitelist)
const ALLOWLIST = new Set([
    'src/analytics/compat/legacyAnalyticsEngineBridge.ts',
    'src/analytics/UnifiedEventTracker.ts', // pode logar deprecation
    'src/analytics/UnifiedAnalyticsEngine.ts'
]);

const root = process.cwd();

async function main() {
    const files = await globby(['src/**/*.{ts,tsx,js,jsx}', '!src/**/__tests__/**']);
    const violations = [];

    for (const file of files) {
        if (ALLOWLIST.has(file)) continue;
        const abs = path.join(root, file);
        const content = fs.readFileSync(abs, 'utf8');
        // Captura import/export * from / require
        const importLines = content.split(/\n/).filter(l => /(import|require)\s+.*from|require\(/.test(l));
        for (const line of importLines) {
            for (const pattern of DEPRECATED_PATTERNS) {
                // Ignora se linha contém comentário de supressão
                if (/legacy-allow/.test(line)) continue;
                const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, r => `\\${r}`));
                if (regex.test(line)) {
                    violations.push({ file, line: line.trim(), pattern });
                }
            }
        }
    }

    if (violations.length) {
        console.error('\n[Legacy Analytics Check] Foram encontrados imports proibidos:\n');
        for (const v of violations) {
            console.error(`- ${v.file}: '${v.line}' (padrão: ${v.pattern})`);
        }
        console.error('\nPara exceções temporárias adicione comentário // legacy-allow na linha específica (evite uso prolongado).');
        process.exit(1);
    } else {
        console.log('[Legacy Analytics Check] Nenhuma violação encontrada.');
    }
}

main().catch(err => {
    console.error('[Legacy Analytics Check] Erro inesperado:', err);
    process.exit(1);
});
