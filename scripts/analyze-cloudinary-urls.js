#!/usr/bin/env node

/**
 * 🔍 ORGANIZADOR DE URLs DO CLOUDINARY
 * 
 * Script para analisar e organizar URLs do Cloudinary encontradas no projeto
 * e identificar possíveis uploads recentes baseados nos timestamps das URLs
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

/**
 * Extrair timestamp da URL do Cloudinary
 */
function extractTimestamp(url) {
    // URLs do Cloudinary têm formato: .../upload/v[timestamp]/...
    const match = url.match(/\/upload\/v(\d+)\//);
    return match ? parseInt(match[1]) : null;
}

/**
 * Converter timestamp para data
 */
function timestampToDate(timestamp) {
    return new Date(timestamp * 1000);
}

/**
 * Verificar se é de hoje
 */
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

/**
 * Encontrar todas as URLs do Cloudinary no projeto
 */
async function findCloudinaryUrls() {
    console.log('🔍 Procurando URLs do Cloudinary no projeto...');

    const files = await glob('**/*.{ts,tsx,js,jsx,json,md,html,txt}', {
        ignore: ['node_modules/**', 'dist/**', '.git/**', 'coverage/**']
    });

    const cloudinaryUrls = new Set();
    const cloudinaryRegex = /https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/v\d+\/[^\s"')]+/g;

    for (const file of files) {
        try {
            const content = readFileSync(file, 'utf8');
            const matches = content.match(cloudinaryRegex);

            if (matches) {
                matches.forEach(url => cloudinaryUrls.add(url));
            }
        } catch (error) {
            // Ignorar erros de leitura de arquivo
        }
    }

    return Array.from(cloudinaryUrls);
}

/**
 * Analisar URLs e organizá-las por data
 */
function analyzeUrls(urls) {
    const urlsWithDates = urls.map(url => {
        const timestamp = extractTimestamp(url);
        const date = timestamp ? timestampToDate(timestamp) : null;

        return {
            url,
            timestamp,
            date,
            isToday: date ? isToday(date) : false,
            dateString: date ? date.toLocaleDateString('pt-BR') : 'Data não disponível'
        };
    });

    // Ordenar por timestamp (mais recente primeiro)
    urlsWithDates.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return urlsWithDates;
}

/**
 * Função principal
 */
async function main() {
    console.log('📊 ANÁLISE DE IMAGENS DO CLOUDINARY');
    console.log('===================================');
    console.log('');

    const urls = await findCloudinaryUrls();
    console.log(`📋 Total de URLs encontradas: ${urls.length}`);

    if (urls.length === 0) {
        console.log('ℹ️  Nenhuma URL do Cloudinary encontrada no projeto.');
        return;
    }

    const analyzed = analyzeUrls(urls);

    // Filtrar imagens de hoje
    const todayImages = analyzed.filter(item => item.isToday);

    console.log(`📅 Imagens de hoje: ${todayImages.length}`);
    console.log('');

    if (todayImages.length > 0) {
        console.log('🎉 IMAGENS ADICIONADAS HOJE:');
        console.log('============================');
        todayImages.forEach((item, index) => {
            console.log(`${index + 1}. ${item.dateString}`);
            console.log(`   🔗 ${item.url}`);
            console.log('');
        });

        // Salvar URLs de hoje
        const todayUrls = todayImages.map(item => item.url);
        writeFileSync(
            './scripts/cloudinary-today-urls.txt',
            todayUrls.join('\n')
        );
        console.log('💾 URLs de hoje salvas em: ./scripts/cloudinary-today-urls.txt');
    } else {
        console.log('ℹ️  Nenhuma imagem de hoje encontrada baseada nos timestamps.');
    }

    console.log('');
    console.log('📊 IMAGENS MAIS RECENTES:');
    console.log('=========================');

    // Mostrar as 10 mais recentes
    analyzed.slice(0, 10).forEach((item, index) => {
        console.log(`${index + 1}. ${item.dateString}`);
        console.log(`   🔗 ${item.url}`);
        console.log('');
    });

    // Salvar relatório completo
    const report = {
        totalUrls: urls.length,
        todayCount: todayImages.length,
        todayUrls: todayImages.map(item => ({
            url: item.url,
            date: item.dateString,
            timestamp: item.timestamp
        })),
        recentUrls: analyzed.slice(0, 20).map(item => ({
            url: item.url,
            date: item.dateString,
            timestamp: item.timestamp
        }))
    };

    writeFileSync(
        './scripts/cloudinary-analysis-report.json',
        JSON.stringify(report, null, 2)
    );

    console.log('📋 Relatório completo salvo em: ./scripts/cloudinary-analysis-report.json');
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { findCloudinaryUrls, analyzeUrls };