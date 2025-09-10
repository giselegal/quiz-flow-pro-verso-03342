/**
 * 🖼️ SERVIÇO DE GERAÇÃO DE THUMBNAILS PARA TEMPLATES
 * 
 * Gera imagens de preview baseadas na primeira etapa do template
 */

import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

export interface TemplateThumbnail {
    id: string;
    dataUrl: string;
    width: number;
    height: number;
    generatedAt: Date;
}

/**
 * Gerar thumbnail baseado nos blocos da etapa 1
 */
export const generateTemplateThumbnail = async (
    templateId: string,
    step1Blocks?: Block[]
): Promise<TemplateThumbnail> => {
    const blocks = step1Blocks || QUIZ_STYLE_21_STEPS_TEMPLATE['step-1'] || [];

    // Criar canvas para renderizar o thumbnail
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Não foi possível criar contexto do canvas');
    }

    // Configurações do thumbnail
    const THUMBNAIL_WIDTH = 400;
    const THUMBNAIL_HEIGHT = 300;

    canvas.width = THUMBNAIL_WIDTH;
    canvas.height = THUMBNAIL_HEIGHT;

    // Background
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

    // Extrair informações principais dos blocos
    const titleBlock = blocks.find(b => b.type === 'text' || b.id.includes('title'));
    const headerBlock = blocks.find(b => b.type === 'quiz-intro-header');
    const inputBlock = blocks.find(b => b.type === 'text-input');

    let yOffset = 20;

    // Renderizar logo se existir
    if (headerBlock?.properties?.logoUrl) {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    const logoSize = 80;
                    const logoX = (THUMBNAIL_WIDTH - logoSize) / 2;
                    ctx.drawImage(img, logoX, yOffset, logoSize, logoSize);
                    resolve(true);
                };
                img.onerror = reject;
                img.src = headerBlock.properties.logoUrl;
            });

            yOffset += 100;
        } catch (error) {
            console.warn('Erro ao carregar logo:', error);
            // Desenhar placeholder da logo
            ctx.fillStyle = '#B89B7A';
            ctx.fillRect((THUMBNAIL_WIDTH - 80) / 2, yOffset, 80, 80);
            yOffset += 100;
        }
    }

    // Renderizar título
    if (titleBlock?.content?.text) {
        ctx.fillStyle = '#432818';
        ctx.font = 'bold 24px "Playfair Display", serif';
        ctx.textAlign = 'center';

        // Extrair texto limpo (remove HTML)
        const cleanText = titleBlock.content.text
            .replace(/<[^>]*>/g, '')
            .substring(0, 100) + (titleBlock.content.text.length > 100 ? '...' : '');

        // Quebrar texto em linhas
        const words = cleanText.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > THUMBNAIL_WIDTH - 40 && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);

        // Renderizar linhas
        lines.slice(0, 3).forEach((line, index) => {
            ctx.fillText(line, THUMBNAIL_WIDTH / 2, yOffset + (index * 30));
        });

        yOffset += lines.length * 30 + 20;
    }

    // Renderizar campo de input (placeholder)
    if (inputBlock || yOffset < THUMBNAIL_HEIGHT - 80) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(40, yOffset, THUMBNAIL_WIDTH - 80, 40);
        ctx.strokeStyle = '#B89B7A';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, yOffset, THUMBNAIL_WIDTH - 80, 40);

        // Placeholder text
        ctx.fillStyle = '#8B7355';
        ctx.font = '16px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Digite seu nome...', 50, yOffset + 25);

        yOffset += 60;
    }

    // Renderizar botão (placeholder)
    if (yOffset < THUMBNAIL_HEIGHT - 40) {
        ctx.fillStyle = '#B89B7A';
        ctx.fillRect((THUMBNAIL_WIDTH - 120) / 2, yOffset, 120, 40);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Continuar', THUMBNAIL_WIDTH / 2, yOffset + 25);
    }

    // Converter para data URL
    const dataUrl = canvas.toDataURL('image/png', 0.8);

    return {
        id: templateId,
        dataUrl,
        width: THUMBNAIL_WIDTH,
        height: THUMBNAIL_HEIGHT,
        generatedAt: new Date(),
    };
};

/**
 * Cache de thumbnails para evitar regeneração desnecessária
 */
const thumbnailCache = new Map<string, TemplateThumbnail>();

/**
 * Obter thumbnail com cache
 */
export const getTemplateThumbnail = async (
    templateId: string,
    step1Blocks?: Block[]
): Promise<string> => {
    const cacheKey = `${templateId}-${Date.now()}`;

    if (thumbnailCache.has(templateId)) {
        const cached = thumbnailCache.get(templateId)!;
        // Cache válido por 1 hora
        if (Date.now() - cached.generatedAt.getTime() < 3600000) {
            return cached.dataUrl;
        }
    }

    try {
        const thumbnail = await generateTemplateThumbnail(templateId, step1Blocks);
        thumbnailCache.set(templateId, thumbnail);
        return thumbnail.dataUrl;
    } catch (error) {
        console.error('Erro ao gerar thumbnail:', error);

        // Retornar imagem placeholder em caso de erro
        return generatePlaceholderThumbnail(templateId);
    }
};

/**
 * Gerar thumbnail placeholder simples
 */
const generatePlaceholderThumbnail = (templateId: string): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = 400;
    canvas.height = 300;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#F8F9FA');
    gradient.addColorStop(1, '#E9ECEF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    // Icon
    ctx.fillStyle = '#B89B7A';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📋', 200, 120);

    // Text
    ctx.fillStyle = '#432818';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Template Preview', 200, 160);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#6B4F43';
    ctx.fillText(templateId, 200, 180);

    return canvas.toDataURL('image/png', 0.8);
};

/**
 * Limpar cache de thumbnails
 */
export const clearThumbnailCache = () => {
    thumbnailCache.clear();
};
