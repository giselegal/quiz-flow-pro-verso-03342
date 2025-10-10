#!/usr/bin/env node

/**
 * 🌥️ Cloudinary - Listar todas as URLs (Admin API)
 *
 * - Requer variáveis no .env:
 *   - VITE_CLOUDINARY_CLOUD_NAME
 *   - CLOUDINARY_API_KEY
 *   - CLOUDINARY_API_SECRET
 * - Faz paginação até esgotar recursos
 * - Salva saída em:
 *   - scripts/cloudinary-urls-list.txt (apenas URLs)
 *   - scripts/cloudinary-all-resources.json (dados completos)
 *
 * Uso:
 *   node scripts/get-all-cloudinary-urls.js [--type image|video|raw] [--prefix my/folder] [--max 1000]
 */

import { config } from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';

config();

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqljyf76t';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
    const idx = args.findIndex(a => a === `--${name}`);
    if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) return args[idx + 1];
    return fallback;
};

const TYPE = getArg('type', 'image'); // image|video|raw
const PREFIX = getArg('prefix', ''); // filtrar por pasta/public_id prefix
const MAX = parseInt(getArg('max', '0') || '0', 10); // 0 = sem limite

function ensureOutputDir() {
    if (!fs.existsSync('scripts')) fs.mkdirSync('scripts');
}

function apiUrl(path) {
    return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${path}`;
}

async function fetchPage(nextCursor) {
    const params = new URLSearchParams({
        max_results: '500',
        direction: 'desc',
        // sort_by: 'created_at' // não é aceito em todos os planos, então omitimos
    });
    if (PREFIX) params.set('prefix', PREFIX);
    if (nextCursor) params.set('next_cursor', nextCursor);

    const url = apiUrl(`resources/${TYPE}`) + `?` + params.toString();

    const auth = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    const res = await fetch(url, {
        headers: {
            Authorization: auth
        }
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }
    return res.json();
}

async function collectAll() {
    if (!API_KEY || !API_SECRET) {
        console.log('❌ Credenciais Cloudinary ausentes. Configure no .env:');
        console.log('   CLOUDINARY_API_KEY=your_key');
        console.log('   CLOUDINARY_API_SECRET=your_secret');
        console.log('   VITE_CLOUDINARY_CLOUD_NAME=your_cloud');
        console.log('');
        console.log('Como alternativa imediata, rode:');
        console.log('   npm run cloudinary:analyze  # varre o projeto e extrai URLs presentes no código');
        process.exit(1);
    }

    console.log('🔎 Listando recursos do Cloudinary');
    console.log(`📡 Cloud: ${CLOUD_NAME}`);
    console.log(`📁 Tipo: ${TYPE}${PREFIX ? ` | Prefix: ${PREFIX}` : ''}${MAX ? ` | Limite: ${MAX}` : ''}`);

    let nextCursor = undefined;
    let total = 0;
    const resources = [];

    try {
        do {
            const page = await fetchPage(nextCursor);
            const items = page.resources || [];
            resources.push(...items);
            total += items.length;
            console.log(`  ➕ Página: ${items.length} itens | Acumulado: ${total}`);

            nextCursor = page.next_cursor;

            if (MAX && total >= MAX) {
                console.log('  ⏹️  Limite atingido. Parando paginação.');
                break;
            }
        } while (nextCursor);

        ensureOutputDir();
        const urls = resources.map(r => r.secure_url || r.url).filter(Boolean);
        fs.writeFileSync('scripts/cloudinary-urls-list.txt', urls.join('\n'));
        fs.writeFileSync('scripts/cloudinary-all-resources.json', JSON.stringify({
            fetchedAt: new Date().toISOString(),
            cloud: CLOUD_NAME,
            type: TYPE,
            prefix: PREFIX || null,
            count: resources.length,
            resources,
        }, null, 2));

        console.log('');
        console.log(`✅ Concluído. Recursos: ${resources.length}`);
        console.log('   🔗 URLs salvas em: scripts/cloudinary-urls-list.txt');
        console.log('   📄 JSON salvo em: scripts/cloudinary-all-resources.json');
    } catch (err) {
        console.error('❌ Falha ao coletar recursos:', err.message);
        console.log('Dicas:');
        console.log('- Verifique se API Key/Secret e Cloud Name estão corretos');
        console.log('- Confirme se sua conta tem acesso à API Admin (programa/role)');
        console.log('- Tente reduzir max_results ou remover prefix');
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    collectAll();
}

export { };

