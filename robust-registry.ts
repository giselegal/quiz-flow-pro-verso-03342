// Versão robusta do getOptimizedBlockComponent - SOLUÇÃO FINAL
// Este arquivo pode substituir a versão atual se necessário

import React from 'react';
import { ENHANCED_BLOCK_REGISTRY } from '@/components/editor/blocks/EnhancedBlockRegistry';

// Importações diretas como fallback de emergência
import QuizIntroHeaderBlock from '@/components/editor/blocks/QuizIntroHeaderBlock';
import TextInlineBlock from '@/components/editor/blocks/TextInlineBlock';
import ImageInlineBlock from '@/components/editor/blocks/ImageInlineBlock';
import ButtonInlineBlock from '@/components/editor/blocks/ButtonInlineBlock';
import VisualBlockFallback from '@/components/core/renderers/VisualBlockFallback';

// Mapa de fallbacks diretos para componentes críticos
const DIRECT_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    'quiz-intro-header': QuizIntroHeaderBlock,
    'text': TextInlineBlock,
    'text-inline': TextInlineBlock,
    'image': ImageInlineBlock,
    'image-inline': ImageInlineBlock,
    'button': ButtonInlineBlock,
    'button-inline': ButtonInlineBlock,
};

const COMPONENT_CACHE = new Map<string, React.ComponentType<any>>();

export const getOptimizedBlockComponentRobust = (type: string): React.ComponentType<any> => {
    console.log(`🔍 [ROBUST] Buscando componente para: "${type}"`);

    // 1. Verificar cache primeiro
    const cached = COMPONENT_CACHE.get(type);
    if (cached) {
        console.log(`✅ [ROBUST] Cache hit para "${type}"`);
        return cached;
    }

    // 2. Tentar fallback direto para componentes críticos
    if (DIRECT_COMPONENT_MAP[type]) {
        console.log(`✅ [ROBUST] Fallback direto para "${type}"`);
        const component = DIRECT_COMPONENT_MAP[type];
        COMPONENT_CACHE.set(type, component);
        return component;
    }

    // 3. Tentar registry se disponível
    try {
        if (ENHANCED_BLOCK_REGISTRY && ENHANCED_BLOCK_REGISTRY[type]) {
            console.log(`✅ [ROBUST] Registry hit para "${type}"`);
            const component = ENHANCED_BLOCK_REGISTRY[type];
            COMPONENT_CACHE.set(type, component as React.ComponentType<any>);
            return component as React.ComponentType<any>;
        }
    } catch (error) {
        console.warn(`⚠️ [ROBUST] Erro ao acessar registry para "${type}":`, error);
    }

    // 4. Fallbacks por padrão de tipo
    if (type.includes('text') || type.includes('title') || type.includes('paragraph')) {
        console.log(`✅ [ROBUST] Fallback de texto para "${type}"`);
        COMPONENT_CACHE.set(type, TextInlineBlock);
        return TextInlineBlock;
    }

    if (type.includes('image') || type.includes('img') || type.includes('photo')) {
        console.log(`✅ [ROBUST] Fallback de imagem para "${type}"`);
        COMPONENT_CACHE.set(type, ImageInlineBlock);
        return ImageInlineBlock;
    }

    if (type.includes('button') || type.includes('btn') || type.includes('cta')) {
        console.log(`✅ [ROBUST] Fallback de botão para "${type}"`);
        COMPONENT_CACHE.set(type, ButtonInlineBlock);
        return ButtonInlineBlock;
    }

    if (type.includes('header') || type.includes('intro') || type.includes('quiz')) {
        console.log(`✅ [ROBUST] Fallback de header para "${type}"`);
        COMPONENT_CACHE.set(type, QuizIntroHeaderBlock);
        return QuizIntroHeaderBlock;
    }

    // 5. Fallback visual final
    console.warn(`⚠️ [ROBUST] Usando fallback visual para "${type}"`);
    const VisualFallback: React.ComponentType<any> = ({ block }) => {
        return React.createElement(VisualBlockFallback, {
            blockType: type,
            blockId: block?.id || 'unknown',
            block: block
        });
    };
    VisualFallback.displayName = `RobustFallback(${type})`;

    COMPONENT_CACHE.set(type, VisualFallback);
    return VisualFallback;
};

// Função para testar todos os componentes críticos
export const testCriticalComponents = () => {
    console.group('🧪 [ROBUST] Testando componentes críticos');

    const criticalTypes = ['quiz-intro-header', 'text', 'image', 'button'];

    criticalTypes.forEach(type => {
        try {
            const component = getOptimizedBlockComponentRobust(type);
            console.log(`✅ [ROBUST] "${type}":`, component.displayName || component.name || 'OK');
        } catch (error) {
            console.error(`❌ [ROBUST] "${type}":`, error);
        }
    });

    console.groupEnd();
};

console.log('🚀 [ROBUST] Registry robusto carregado');