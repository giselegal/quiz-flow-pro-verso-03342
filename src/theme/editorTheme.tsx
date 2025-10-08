import React, { createContext, useContext, useMemo } from 'react';

export interface DesignTokens {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    radius: Record<string, string>;
    fontScale: Record<string, string>;
}

export const defaultTokens: DesignTokens = {
    colors: {
        primary: '#B89B7A',
        primaryHover: '#a08464',
        bg: '#FFFFFF',
        surface: '#F8F9FA',
        border: '#E2E8F0',
        text: '#1F2937'
    },
    spacing: { none: '0', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
    radius: { none: '0', sm: '4px', md: '8px', lg: '12px', pill: '999px' },
    fontScale: { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px', '2xl': '24px' }
};

interface ThemeContextValue {
    tokens: DesignTokens;
}

const EditorThemeContext = createContext<ThemeContextValue>({ tokens: defaultTokens });

export const EditorThemeProvider: React.FC<{ tokens?: Partial<DesignTokens>; children: React.ReactNode; }> = ({ tokens, children }) => {
    const merged = useMemo<DesignTokens>(() => ({
        colors: { ...defaultTokens.colors, ...(tokens?.colors || {}) },
        spacing: { ...defaultTokens.spacing, ...(tokens?.spacing || {}) },
        radius: { ...defaultTokens.radius, ...(tokens?.radius || {}) },
        fontScale: { ...defaultTokens.fontScale, ...(tokens?.fontScale || {}) }
    }), [tokens]);

    return (
        <EditorThemeContext.Provider value={{ tokens: merged }}>
            <style>{
                `:root{${Object.entries(merged.colors).map(([k, v]) => `--color-${k}:${v};`).join('')}
        ${Object.entries(merged.spacing).map(([k, v]) => `--space-${k}:${v};`).join('')}
        ${Object.entries(merged.radius).map(([k, v]) => `--radius-${k}:${v};`).join('')}
        ${Object.entries(merged.fontScale).map(([k, v]) => `--font-${k}:${v};`).join('')}}`
            }</style>
            {children}
        </EditorThemeContext.Provider>
    );
};

export function useEditorTheme() {
    return useContext(EditorThemeContext);
}
