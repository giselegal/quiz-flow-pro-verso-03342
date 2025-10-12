
import { useState, useCallback, useEffect } from 'react';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { useUnifiedCRUDOptional } from '@/contexts';
import { safeGetItem as getCtx, safeSetItem as setCtx } from '@/utils/contextualStorage';

/**
 * 🎨 useBrandKit - Hook para gerenciar identidade visual
 * 
 * Integra com BrandKitManager.tsx (513 linhas)
 * Controla cores, fontes, assets automaticamente
 */

interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
}

interface BrandFonts {
    heading: string;
    body: string;
    accent?: string;
}

interface BrandAssets {
    logo: string;
    favicon: string;
    backgroundImage?: string;
    watermark?: string;
}

interface BrandKitConfig {
    colors: BrandColors;
    fonts: BrandFonts;
    assets: BrandAssets;
    name: string;
    description: string;
}

const DEFAULT_BRAND_KIT: BrandKitConfig = {
    name: 'Brand Kit Padrão',
    description: 'Configuração visual padrão do sistema',
    colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#EC4899',
        background: '#FFFFFF',
        text: '#1F2937',
        muted: '#9CA3AF'
    },
    fonts: {
        heading: 'Inter',
        body: 'Inter'
    },
    assets: {
        logo: '',
        favicon: '',
        backgroundImage: '',
        watermark: ''
    }
};

const STORAGE_KEY = 'brand-kit-config';

export const useBrandKit = () => {
    // Determinar contexto ativo (fallback EDITOR)
    let activeContext: FunnelContext = FunnelContext.EDITOR;
    try {
        const crud = useUnifiedCRUDOptional();
        if (crud?.funnelContext) activeContext = crud.funnelContext;
    } catch { }

    const [brandKit, setBrandKit] = useState<BrandKitConfig>(() => {
        try {
            // Tenta chave contextualizada primeiro
            const savedCtx = getCtx(STORAGE_KEY, activeContext);
            const savedLegacy = !savedCtx ? localStorage.getItem(STORAGE_KEY) : null;
            const saved = savedCtx ?? savedLegacy;
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...DEFAULT_BRAND_KIT, ...parsed };
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar Brand Kit:', error);
        }
        return DEFAULT_BRAND_KIT;
    });

    // 💾 Salvar no localStorage quando mudar
    useEffect(() => {
        try {
            const serialized = JSON.stringify(brandKit);
            // Salvar contextualizado e remover legado para evitar colisões
            setCtx(STORAGE_KEY, serialized, activeContext);
            try { localStorage.removeItem(STORAGE_KEY); } catch { }
            // Aplicar CSS variables automaticamente
            applyBrandKitToDOM(brandKit);
        } catch (error) {
            console.warn('⚠️ Erro ao salvar Brand Kit:', error);
        }
    }, [brandKit, activeContext]);

    // 🎨 Atualizar cores
    const updateColors = useCallback((colors: Partial<BrandColors>) => {
        setBrandKit(prev => ({
            ...prev,
            colors: { ...prev.colors, ...colors }
        }));
    }, []);

    // 🔤 Atualizar fontes
    const updateFonts = useCallback((fonts: Partial<BrandFonts>) => {
        setBrandKit(prev => ({
            ...prev,
            fonts: { ...prev.fonts, ...fonts }
        }));
    }, []);

    // 🖼️ Atualizar assets
    const updateAssets = useCallback((assets: Partial<BrandAssets>) => {
        setBrandKit(prev => ({
            ...prev,
            assets: { ...prev.assets, ...assets }
        }));
    }, []);

    // 🎯 Aplicar Brand Kit completo
    const applyBrandKit = useCallback((newBrandKit: Partial<BrandKitConfig>) => {
        setBrandKit(prev => ({
            ...prev,
            ...newBrandKit,
            colors: { ...prev.colors, ...(newBrandKit.colors || {}) },
            fonts: { ...prev.fonts, ...(newBrandKit.fonts || {}) },
            assets: { ...prev.assets, ...(newBrandKit.assets || {}) }
        }));
    }, []);

    // 🔄 Reset para padrão
    const resetBrandKit = useCallback(() => {
        setBrandKit(DEFAULT_BRAND_KIT);
    }, []);

    // 📤 Exportar configuração
    const exportBrandKit = useCallback(() => {
        return JSON.stringify(brandKit, null, 2);
    }, [brandKit]);

    // 📥 Importar configuração
    const importBrandKit = useCallback((jsonString: string) => {
        try {
            const imported = JSON.parse(jsonString);
            applyBrandKit(imported);
            return true;
        } catch (error) {
            console.error('❌ Erro ao importar Brand Kit:', error);
            return false;
        }
    }, [applyBrandKit]);

    return {
        brandKit,
        updateColors,
        updateFonts,
        updateAssets,
        applyBrandKit,
        resetBrandKit,
        exportBrandKit,
        importBrandKit
    };
};

// 🎨 Função para aplicar Brand Kit no DOM
const applyBrandKitToDOM = (brandKit: BrandKitConfig) => {
    const root = document.documentElement;

    // Aplicar CSS variables para cores
    root.style.setProperty('--brand-primary', brandKit.colors.primary);
    root.style.setProperty('--brand-secondary', brandKit.colors.secondary);
    root.style.setProperty('--brand-accent', brandKit.colors.accent);
    root.style.setProperty('--brand-background', brandKit.colors.background);
    root.style.setProperty('--brand-text', brandKit.colors.text);
    root.style.setProperty('--brand-muted', brandKit.colors.muted);

    // Aplicar fontes
    root.style.setProperty('--brand-font-heading', brandKit.fonts.heading);
    root.style.setProperty('--brand-font-body', brandKit.fonts.body);

    console.log('🎨 Brand Kit aplicado ao DOM:', brandKit.name);
};