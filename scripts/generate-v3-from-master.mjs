#!/usr/bin/env node
// ⚠️ DEPRECATED: Use `node scripts/split-master-complete.mjs` ou `npm run templates:generate:v3`
// Para continuar usando este script legacy, defina ALLOW_DEPRECATED_GENERATORS=1
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';

const root = process.cwd();
const masterPath = resolve(root, 'public/templates/quiz21-complete.json');
const outDir = resolve(root, 'public/templates');

function pad2(n) { return String(n).padStart(2, '0'); }

try {
    if (!process.env.ALLOW_DEPRECATED_GENERATORS) {
        console.warn('⚠️ DEPRECATION: scripts/generate-v3-from-master.mjs está obsoleto.');
        console.warn('   Use: node scripts/split-master-complete.mjs  (ou)  npm run templates:generate:v3');
        process.exit(1);
    }
    const raw = readFileSync(masterPath, 'utf-8');
    const master = JSON.parse(raw);
    const steps = master?.steps || {};
    const targets = Array.from({ length: 9 }, (_, i) => 12 + i); // 12..20

    targets.forEach((num) => {
        const key = `step-${pad2(num)}`;
        const data = steps[key];
        if (!data) {
            console.warn(`⚠️ ${key} não encontrado no master, pulando...`);
            return;
        }
        const outFile = resolve(outDir, `${key}-v3.json`);
        const outDirname = dirname(outFile);
        if (!existsSync(outDirname)) mkdirSync(outDirname, { recursive: true });
        writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✅ Gerado ${key}-v3.json`);
    });

    console.log('🎉 Concluído: geração de steps 12..20 v3 a partir do master.');
} catch (err) {
    console.error('❌ Erro ao gerar v3 a partir do master:', err);
    process.exit(1);
}
