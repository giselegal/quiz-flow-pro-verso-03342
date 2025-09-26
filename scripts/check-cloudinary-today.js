#!/usr/bin/env node

/**
 * 🔍 VERIFICADOR DE IMAGENS CLOUDINARY - HOJE
 * 
 * Script para verificar imagens adicionadas hoje no Cloudinary
 * usando a API Admin do Cloudinary
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Carregar variáveis de ambiente
config();

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqljyf76t';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Converter timestamp Unix para data legível
 */
function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString('pt-BR');
}

/**
 * Verificar se é de hoje
 */
function isToday(timestamp) {
    const date = new Date(timestamp * 1000);
    const today = new Date();

    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

/**
 * Buscar recursos do Cloudinary
 */
async function getCloudinaryResources() {
    if (!API_KEY || !API_SECRET) {
        console.log('❌ Credenciais da API do Cloudinary não configuradas');
        console.log('📋 Configure as seguintes variáveis no .env:');
        console.log('   CLOUDINARY_API_KEY=your_api_key');
        console.log('   CLOUDINARY_API_SECRET=your_api_secret');
        console.log('');
        console.log('🔗 Obtenha suas credenciais em:');
        console.log('   https://console.cloudinary.com/settings/api-keys');
        return null;
    }

    try {
        // Endpoint da API Admin do Cloudinary
        const url = `https://${API_KEY}:${API_SECRET}@api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;

        const params = new URLSearchParams({
            max_results: '100',
            sort_by: 'created_at',
            direction: 'desc'
        });

        const response = await fetch(`${url}?${params}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.resources;

    } catch (error) {
        console.error('❌ Erro ao acessar API do Cloudinary:', error.message);
        return null;
    }
}

/**
 * Função principal
 */
async function main() {
    console.log('🔍 Verificando imagens adicionadas hoje no Cloudinary...');
    console.log(`📡 Cloud Name: ${CLOUD_NAME}`);
    console.log('');

    const resources = await getCloudinaryResources();

    if (!resources) {
        return;
    }

    // Filtrar imagens de hoje
    const todayImages = resources.filter(resource => isToday(resource.created_at));

    console.log(`📊 Total de imagens encontradas: ${resources.length}`);
    console.log(`📅 Imagens adicionadas hoje: ${todayImages.length}`);
    console.log('');

    if (todayImages.length === 0) {
        console.log('ℹ️  Nenhuma imagem foi adicionada hoje.');
        console.log('');
        console.log('📋 Imagens mais recentes:');

        // Mostrar as 5 mais recentes
        resources.slice(0, 5).forEach((resource, index) => {
            console.log(`${index + 1}. ${resource.public_id}`);
            console.log(`   📅 ${formatDate(resource.created_at)}`);
            console.log(`   🔗 ${resource.secure_url}`);
            console.log('');
        });
    } else {
        console.log('🎉 Imagens adicionadas hoje:');
        console.log('');

        todayImages.forEach((resource, index) => {
            console.log(`${index + 1}. ${resource.public_id}`);
            console.log(`   📅 ${formatDate(resource.created_at)}`);
            console.log(`   📏 ${resource.width}x${resource.height}px`);
            console.log(`   📦 ${Math.round(resource.bytes / 1024)} KB`);
            console.log(`   🔗 ${resource.secure_url}`);
            console.log('');
        });

        // Salvar URLs em arquivo
        const urls = todayImages.map(r => r.secure_url);
        const fs = await import('fs');

        fs.writeFileSync(
            './scripts/cloudinary-today-urls.txt',
            urls.join('\n')
        );

        console.log(`💾 URLs salvas em: ./scripts/cloudinary-today-urls.txt`);
    }
}

// Executar script
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { getCloudinaryResources, formatDate, isToday };