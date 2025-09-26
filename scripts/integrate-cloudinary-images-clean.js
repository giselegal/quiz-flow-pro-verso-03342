#!/usr/bin/env node

/**
 * 🖼️ INTEGRADOR DE IMAGENS CLOUDINARY
 * 
 * Script para integrar as novas imagens do Cloudinary ao banco de imagens otimizado
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { config } from 'dotenv';

config();

/**
 * Imagens de hoje obtidas do Cloudinary
 */
const TODAY_IMAGES = [
    {
        name: 'Mockup_de_todos_os_produtos_-_Imagem_da_video_aula_tjtyrz',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849960/Mockup_de_todos_os_produtos_-_Imagem_da_video_aula_tjtyrz.jpg',
        width: 2500,
        height: 2000,
        bytes: 1936384, // 1891 KB
        category: 'mockups',
        description: 'Mockup de todos os produtos - Imagem da vídeo aula'
    },
    {
        name: 'Mockup_todos_produtos_2_u8kpdi',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849960/Mockup_todos_produtos_2_u8kpdi.jpg',
        width: 2500,
        height: 2000,
        bytes: 1864704, // 1821 KB
        category: 'mockups',
        description: 'Mockup todos produtos versão 2'
    },
    {
        name: 'O_Poder_das_cores_na_Imagem_c1f0od',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/O_Poder_das_cores_na_Imagem_c1f0od.jpg',
        width: 1414,
        height: 2000,
        bytes: 2045952, // 1997 KB
        category: 'guias',
        description: 'O Poder das cores na Imagem'
    },
    {
        name: 'Inventário_do_Guada-Roupa_m92ilf',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Inventário_do_Guada-Roupa_m92ilf.jpg',
        width: 707,
        height: 1000,
        bytes: 231424, // 226 KB
        category: 'guias',
        description: 'Inventário do Guarda-Roupa'
    },
    {
        name: 'Detox_Guarda-roupa_fnjehu',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Detox_Guarda-roupa_fnjehu.jpg',
        width: 1414,
        height: 2000,
        bytes: 634880, // 620 KB
        category: 'guias',
        description: 'Detox Guarda-roupa'
    },
    {
        name: 'Visagismo_Facial_-_Análise_Facial_e_Dicas_de_Acessórios_ihhqry',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Visagismo_Facial_-_Análise_Facial_e_Dicas_de_Acessórios_ihhqry.jpg',
        width: 1414,
        height: 2000,
        bytes: 1070080, // 1045 KB
        category: 'guias',
        description: 'Visagismo Facial - Análise Facial e Dicas de Acessórios'
    },
    {
        name: 'Mockup_de_todos_os_produtos_qcmc8w',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849943/Mockup_de_todos_os_produtos_qcmc8w.jpg',
        width: 2500,
        height: 2000,
        bytes: 1255424, // 1226 KB
        category: 'mockups',
        description: 'Mockup de todos os produtos'
    },
    {
        name: 'Mockup_de_todos_os_produtos_-_fundo_claro_ei4isu',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849942/Mockup_de_todos_os_produtos_-_fundo_claro_ei4isu.jpg',
        width: 2500,
        height: 2000,
        bytes: 1247232, // 1218 KB
        category: 'mockups',
        description: 'Mockup de todos os produtos - fundo claro'
    },
    {
        name: 'Mockup_de_todos_os_produtos_-_imagem_Gisele_Central_qxf32s',
        url: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1758849942/Mockup_de_todos_os_produtos_-_imagem_Gisele_Central_qxf32s.jpg',
        width: 2500,
        height: 2000,
        bytes: 1323008, // 1292 KB
        category: 'mockups',
        description: 'Mockup de todos os produtos - imagem Gisele Central'
    }
];

/**
 * Gerar URL otimizada
 */
function generateOptimizedUrl(originalUrl, width, height) {
    // Aplicar otimizações Cloudinary
    const baseUrl = originalUrl.split('/upload/')[0];
    const imagePath = originalUrl.split('/upload/')[1];

    // Determinar tamanho otimizado baseado no original
    let optWidth = width;
    let optHeight = height;

    // Para imagens grandes, reduzir para tamanhos mais práticos
    if (width > 1500) {
        optWidth = 1200;
        optHeight = Math.round((height * optWidth) / width);
    }

    // Transformações de otimização
    const transformations = [
        'f_auto',           // Formato automático (WebP, AVIF)
        'q_auto:good',      // Qualidade automática otimizada
        `w_${optWidth}`,    // Largura otimizada
        `h_${optHeight}`,   // Altura otimizada
        'c_limit'           // Limitar sem cortar
    ].join(',');

    return `${baseUrl}/upload/${transformations}/${imagePath}`;
}

/**
 * Gerar tags baseadas no nome e categoria
 */
function generateTags(name, category) {
    const tags = [category];

    const nameLower = name.toLowerCase();

    // Tags baseadas no conteúdo
    if (nameLower.includes('mockup')) tags.push('mockup', 'produto');
    if (nameLower.includes('guia')) tags.push('guia', 'educacional');
    if (nameLower.includes('cores')) tags.push('cores', 'estilo');
    if (nameLower.includes('inventario')) tags.push('organização', 'closet');
    if (nameLower.includes('detox')) tags.push('limpeza', 'organização');
    if (nameLower.includes('visagismo')) tags.push('rosto', 'acessórios');
    if (nameLower.includes('produtos')) tags.push('produtos', 'vendas');
    if (nameLower.includes('gisele')) tags.push('marca', 'personal');

    return [...new Set(tags)]; // Remove duplicatas
}

/**
 * Função principal
 */
async function main() {
    console.log('🖼️  INTEGRADOR DE IMAGENS CLOUDINARY');
    console.log('====================================');
    console.log(`📅 Data: ${new Date().toLocaleDateString('pt-BR')}`);
    console.log(`📊 Novas imagens: ${TODAY_IMAGES.length}`);
    console.log('');

    // Carregar banco existente ou criar novo
    const dbPath = './src/data/optimized-images.json';
    let database;

    if (existsSync(dbPath)) {
        console.log('📂 Carregando banco de imagens existente...');
        try {
            const content = readFileSync(dbPath, 'utf8');
            database = JSON.parse(content);
        } catch (error) {
            console.log('⚠️  Erro ao carregar banco, criando novo...');
            database = {
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                totalImages: 0,
                categories: [],
                images: []
            };
        }
    } else {
        console.log('🆕 Criando novo banco de imagens...');
        database = {
            version: '1.0.0',
            lastUpdated: new Date().toISOString(),
            totalImages: 0,
            categories: [],
            images: []
        };
    }

    console.log(`📊 Imagens existentes no banco: ${database.images.length}`);
    console.log('');

    // Processar novas imagens
    const newImages = [];
    const today = new Date().toISOString().split('T')[0];

    console.log('🔄 Processando novas imagens...');

    for (const img of TODAY_IMAGES) {
        // Verificar se já existe
        const exists = database.images.some(existing => existing.name === img.name);
        if (exists) {
            console.log(`⏭️  Pulando ${img.name} (já existe)`);
            continue;
        }

        const tags = generateTags(img.name, img.category);
        const optimizedUrl = generateOptimizedUrl(img.url, img.width, img.height);

        const imageEntry = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: img.name,
            url: img.url,
            optimizedUrl,
            category: img.category,
            tags,
            dimensions: {
                width: img.width,
                height: img.height
            },
            size: img.bytes,
            uploadDate: today,
            description: img.description
        };

        newImages.push(imageEntry);
        console.log(`✅ Processada: ${img.description}`);
        console.log(`   🔗 Original: ${img.url.substring(0, 80)}...`);
        console.log(`   🚀 Otimizada: ${optimizedUrl.substring(0, 80)}...`);
        console.log(`   📏 ${img.width}x${img.height}px (${Math.round(img.bytes / 1024)}KB)`);
        console.log(`   🏷️  Tags: ${tags.join(', ')}`);
        console.log('');
    }

    // Atualizar banco de dados
    database.images.push(...newImages);
    database.totalImages = database.images.length;
    database.lastUpdated = new Date().toISOString();

    // Atualizar categorias
    const allCategories = [...new Set(database.images.map(img => img.category))];
    database.categories = allCategories.sort();

    // Salvar banco atualizado
    try {
        writeFileSync(dbPath, JSON.stringify(database, null, 2));
        console.log('💾 Banco de imagens atualizado com sucesso!');
        console.log(`📊 Total de imagens no banco: ${database.totalImages}`);
        console.log(`📂 Categorias: ${database.categories.join(', ')}`);
        console.log(`💾 Arquivo salvo em: ${dbPath}`);
    } catch (error) {
        console.error('❌ Erro ao salvar banco de imagens:', error);
    }

    // Gerar arquivo de índice TypeScript
    const indexContent = `/**
 * 🖼️ BANCO DE IMAGENS OTIMIZADAS
 * 
 * Gerado automaticamente em ${new Date().toLocaleString('pt-BR')}
 * Total de imagens: ${database.totalImages}
 * Categorias: ${database.categories.join(', ')}
 */

import optimizedImages from './optimized-images.json';

export interface ImageEntry {
    id: string;
    name: string;
    url: string;
    optimizedUrl: string;
    category: string;
    tags: string[];
    dimensions: {
        width: number;
        height: number;
    };
    size: number;
    uploadDate: string;
    description?: string;
}

export interface ImageDatabase {
    version: string;
    lastUpdated: string;
    totalImages: number;
    categories: string[];
    images: ImageEntry[];
}

export const imageDatabase = optimizedImages as ImageDatabase;

export const getImagesByCategory = (category: string): ImageEntry[] => {
    return imageDatabase.images.filter(img => img.category === category);
};

export const getImagesByTag = (tag: string): ImageEntry[] => {
    return imageDatabase.images.filter(img => img.tags.includes(tag));
};

export const searchImages = (query: string): ImageEntry[] => {
    const queryLower = query.toLowerCase();
    return imageDatabase.images.filter(img => 
        img.name.toLowerCase().includes(queryLower) ||
        img.description?.toLowerCase().includes(queryLower) ||
        img.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
};

export default imageDatabase;
`;

    try {
        writeFileSync('./src/data/optimized-images.ts', indexContent);
        console.log('📝 Arquivo de índice TypeScript gerado!');
    } catch (error) {
        console.error('❌ Erro ao gerar índice TypeScript:', error);
    }

    console.log('');
    console.log('🎉 INTEGRAÇÃO CONCLUÍDA COM SUCESSO!');
}

// Executar se for o arquivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { main as integrateCloudinaryImages };