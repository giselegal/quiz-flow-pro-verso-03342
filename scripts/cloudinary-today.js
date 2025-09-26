#!/usr/bin/env node

/**
 * 🖼️ CLOUDINARY TODAY CHECKER
 * 
 * Script simples para verificar imagens adicionadas hoje usando curl
 * (não requer configuração complexa de APIs)
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';

config();

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqljyf76t';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

async function main() {
    console.log('🔍 Verificador de imagens do Cloudinary para hoje');
    console.log('=================================================');
    console.log(`📡 Cloud Name: ${CLOUD_NAME}`);
    console.log('');

    if (!API_KEY || !API_SECRET || API_KEY === 'your_api_key_here' || API_SECRET === 'your_api_secret_here') {
        console.log('❌ CONFIGURAÇÃO NECESSÁRIA:');
        console.log('');
        console.log('Para verificar uploads de hoje, você precisa:');
        console.log('');
        console.log('1. 🌐 Acesse: https://console.cloudinary.com/settings/api-keys');
        console.log('2. 📋 Copie suas credenciais:');
        console.log('   - API Key');
        console.log('   - API Secret');
        console.log('');
        console.log('3. ✏️  Adicione ao arquivo .env:');
        console.log('   CLOUDINARY_API_KEY=sua_api_key_aqui');
        console.log('   CLOUDINARY_API_SECRET=seu_api_secret_aqui');
        console.log('');
        console.log('4. 🔄 Execute novamente: npm run cloudinary:today');
        console.log('');
        console.log('📊 ANÁLISE BASEADA NO PROJETO:');
        console.log('==============================');

        // Mostrar análise do que já temos no projeto
        try {
            execSync('node scripts/analyze-cloudinary-urls.js', { stdio: 'inherit' });
        } catch (error) {
            console.log('❌ Erro ao executar análise local:', error.message);
        }

        return;
    }

    console.log('✅ Credenciais configuradas. Verificando API do Cloudinary...');
    console.log('');

    try {
        // Comando curl para buscar recursos do Cloudinary
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

        console.log(`📅 Procurando uploads de hoje: ${todayStr}`);
        console.log('');

        // URL da API do Cloudinary Admin
        const url = `https://${API_KEY}:${API_SECRET}@api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=50&sort_by=created_at&direction=desc`;

        const curlCommand = `curl -s "${url}"`;
        const response = execSync(curlCommand, { encoding: 'utf8' });
        const data = JSON.parse(response);

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Filtrar imagens de hoje
        const todayImages = data.resources.filter(resource => {
            const uploadDate = new Date(resource.created_at);
            const uploadDateStr = uploadDate.toISOString().split('T')[0];
            return uploadDateStr === todayStr;
        });

        console.log(`📊 Total de imagens recentes encontradas: ${data.resources.length}`);
        console.log(`🎯 Imagens adicionadas hoje: ${todayImages.length}`);
        console.log('');

        if (todayImages.length === 0) {
            console.log('ℹ️  Nenhuma imagem foi adicionada hoje.');
            console.log('');
            console.log('📋 Imagens mais recentes:');

            data.resources.slice(0, 5).forEach((resource, index) => {
                const date = new Date(resource.created_at);
                console.log(`${index + 1}. ${resource.public_id}`);
                console.log(`   📅 ${date.toLocaleString('pt-BR')}`);
                console.log(`   📏 ${resource.width}x${resource.height}px`);
                console.log(`   🔗 ${resource.secure_url}`);
                console.log('');
            });
        } else {
            console.log('🎉 IMAGENS ADICIONADAS HOJE:');
            console.log('============================');

            todayImages.forEach((resource, index) => {
                const date = new Date(resource.created_at);
                console.log(`${index + 1}. ${resource.public_id}`);
                console.log(`   📅 ${date.toLocaleString('pt-BR')}`);
                console.log(`   📏 ${resource.width}x${resource.height}px`);
                console.log(`   📦 ${Math.round(resource.bytes / 1024)} KB`);
                console.log(`   🔗 ${resource.secure_url}`);
                console.log('');
            });

            // Salvar URLs de hoje
            const todayUrls = todayImages.map(r => r.secure_url);
            const fs = await import('fs');

            fs.writeFileSync(
                './scripts/cloudinary-today-urls.txt',
                todayUrls.join('\n')
            );

            console.log('💾 URLs salvas em: ./scripts/cloudinary-today-urls.txt');
        }

    } catch (error) {
        console.error('❌ Erro ao acessar API do Cloudinary:', error.message);
        console.log('');
        console.log('🔧 Possíveis soluções:');
        console.log('1. Verifique se as credenciais estão corretas');
        console.log('2. Confirme se o Cloud Name está correto');
        console.log('3. Verifique se curl está instalado no sistema');
    }
}

// Executar apenas se for o arquivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}