/**
 * 🎨 HOOK PARA GERENCIAR ESTILOS DOS CONTAINERS DO CANVAS
 * 
 * Sistema de customização dinâmica dos containers, botões de navegação
 * e elementos do editor com persistência local.
 */

import { useState, useEffect, useCallback } from 'react';

interface CanvasContainerStyles {
    // === ÁREA PRINCIPAL DO CANVAS ===
    canvasBackground: string;
    canvasOpacity: number;
    canvasBorder: string;
    canvasBorderRadius: number;
    canvasPadding: number;
    canvasMargin: number;

    // === CONTAINERS DOS COMPONENTES ===
    componentContainerBackground: string;
    componentContainerBorder: string;
    componentContainerBorderRadius: number;
    componentContainerPadding: number;
    componentContainerShadow: string;
    componentContainerHoverEffect: boolean;

    // === BOTÕES DE NAVEGAÇÃO ===
    navigationButtonBackground: string;
    navigationButtonTextColor: string;
    navigationButtonHoverBackground: string;
    navigationButtonBorder: string;
    navigationButtonBorderRadius: number;
    navigationButtonPadding: string;

    // === ÁREA DE TOOLBAR ===
    toolbarBackground: string;
    toolbarBorder: string;
    toolbarButtonBackground: string;
    toolbarButtonHoverBackground: string;

    // === DROPZONES ===
    dropzoneActiveBackground: string;
    dropzoneActiveBorder: string;
    dropzoneHoverBackground: string;
    dropzoneIndicatorColor: string;
}

const DEFAULT_CANVAS_STYLES: CanvasContainerStyles = {
    // Canvas principal
    canvasBackground: '#FEFEFE',
    canvasOpacity: 100,
    canvasBorder: '#E5E5E5',
    canvasBorderRadius: 8,
    canvasPadding: 16,
    canvasMargin: 0,

    // Containers dos componentes
    componentContainerBackground: '#FFFFFF',
    componentContainerBorder: '#B89B7A',
    componentContainerBorderRadius: 8,
    componentContainerPadding: 16,
    componentContainerShadow: '0 2px 4px rgba(0,0,0,0.1)',
    componentContainerHoverEffect: true,

    // Botões de navegação
    navigationButtonBackground: '#F8F9FA',
    navigationButtonTextColor: '#374151',
    navigationButtonHoverBackground: '#E5E7EB',
    navigationButtonBorder: '#D1D5DB',
    navigationButtonBorderRadius: 6,
    navigationButtonPadding: '8px 16px',

    // Toolbar
    toolbarBackground: '#1F2937',
    toolbarBorder: '#374151',
    toolbarButtonBackground: 'transparent',
    toolbarButtonHoverBackground: '#374151',

    // Dropzones
    dropzoneActiveBackground: '#B89B7A10',
    dropzoneActiveBorder: '#B89B7A40',
    dropzoneHoverBackground: '#B89B7A05',
    dropzoneIndicatorColor: '#B89B7A',
};

const STORAGE_KEY = 'quiz-quest-canvas-container-styles';

export const useCanvasContainerStyles = () => {
    const [styles, setStyles] = useState<CanvasContainerStyles>(DEFAULT_CANVAS_STYLES);
    const [isLoaded, setIsLoaded] = useState(false);

    // Carregar estilos do localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsedStyles = JSON.parse(saved);
                setStyles({ ...DEFAULT_CANVAS_STYLES, ...parsedStyles });
            }
        } catch (error) {
            console.warn('Erro ao carregar estilos dos containers:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Salvar estilos no localStorage
    const saveStyles = useCallback((newStyles: Partial<CanvasContainerStyles>) => {
        try {
            const updatedStyles = { ...styles, ...newStyles };
            setStyles(updatedStyles);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStyles));
        } catch (error) {
            console.warn('Erro ao salvar estilos dos containers:', error);
        }
    }, [styles]);

    // Resetar para padrão
    const resetStyles = useCallback(() => {
        setStyles(DEFAULT_CANVAS_STYLES);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn('Erro ao resetar estilos dos containers:', error);
        }
    }, []);

    // Aplicar estilos CSS dinâmicos
    const applyStyles = useCallback(() => {
        if (!isLoaded) return;

        try {
            // Remover estilos anteriores se existirem
            const existingStyle = document.getElementById('canvas-container-dynamic-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            // Criar novo elemento style
            const styleElement = document.createElement('style');
            styleElement.id = 'canvas-container-dynamic-styles';

            // Gerar CSS dinâmico
            const css = `
        /* === ÁREA PRINCIPAL DO CANVAS === */
        [data-canvas-container] {
          background-color: ${styles.canvasBackground} !important;
          opacity: ${styles.canvasOpacity / 100} !important;
          border-color: ${styles.canvasBorder} !important;
          border-radius: ${styles.canvasBorderRadius}px !important;
          padding: ${styles.canvasPadding}px !important;
          margin: ${styles.canvasMargin}px !important;
        }

        /* Canvas Drop Zone Principal */
        .dnd-droppable-zone {
          background-color: ${styles.canvasBackground} !important;
          border-color: ${styles.canvasBorder} !important;
          border-radius: ${styles.canvasBorderRadius}px !important;
          padding: ${styles.canvasPadding}px !important;
        }

        /* === CONTAINERS DOS COMPONENTES === */
        [data-dnd-dropzone-type="bloco"] {
          background-color: ${styles.componentContainerBackground} !important;
          border-color: ${styles.componentContainerBorder} !important;
          border-radius: ${styles.componentContainerBorderRadius}px !important;
          padding: ${styles.componentContainerPadding}px !important;
          box-shadow: ${styles.componentContainerShadow} !important;
        }

        /* Hover effect para containers de componentes */
        ${styles.componentContainerHoverEffect ? `
        [data-dnd-dropzone-type="bloco"]:hover {
          transform: scale(1.02) !important;
          transition: transform 0.2s ease-in-out !important;
        }
        ` : ''}

        /* === BOTÕES DE NAVEGAÇÃO === */
        .navigation-button,
        [data-navigation-button] {
          background-color: ${styles.navigationButtonBackground} !important;
          color: ${styles.navigationButtonTextColor} !important;
          border-color: ${styles.navigationButtonBorder} !important;
          border-radius: ${styles.navigationButtonBorderRadius}px !important;
          padding: ${styles.navigationButtonPadding} !important;
        }

        .navigation-button:hover,
        [data-navigation-button]:hover {
          background-color: ${styles.navigationButtonHoverBackground} !important;
        }

        /* Botões específicos da toolbar (CanvasArea.tsx) */
        .bg-gray-800\\/80 {
          background-color: ${styles.toolbarBackground} !important;
          border-color: ${styles.toolbarBorder} !important;
        }

        .hover\\:bg-gray-700\\/50:hover {
          background-color: ${styles.toolbarButtonHoverBackground} !important;
        }

        /* === DROPZONES === */
        [data-dnd-dropzone-type="slot"][data-over="true"] {
          background-color: ${styles.dropzoneActiveBackground} !important;
          border-color: ${styles.dropzoneActiveBorder} !important;
        }

        .bg-brand\\/10 {
          background-color: ${styles.dropzoneActiveBackground} !important;
        }

        .border-brand\\/40 {
          border-color: ${styles.dropzoneActiveBorder} !important;
        }

        .bg-brand\\/5 {
          background-color: ${styles.dropzoneHoverBackground} !important;
        }

        .text-brand {
          color: ${styles.dropzoneIndicatorColor} !important;
        }

        /* === SELETORES ESPECÍFICOS DO EDITOR === */
        
        /* Header do editor (CanvasArea.tsx linha 93) */
        .bg-gray-900 {
          background-color: ${styles.toolbarBackground} !important;
        }

        /* Containers de controles da toolbar */
        .bg-gray-800\\/50 {
          background-color: ${styles.toolbarButtonBackground} !important;
        }

        /* Botões hover da toolbar */
        .hover\\:bg-gray-700\\/50:hover {
          background-color: ${styles.toolbarButtonHoverBackground} !important;
        }

        /* Ring de seleção dos componentes */
        .ring-\\[\\#B89B7A\\] {
          --tw-ring-color: ${styles.componentContainerBorder} !important;
        }

        .hover\\:ring-\\[\\#B89B7A\\]\\/40:hover {
          --tw-ring-color: ${styles.componentContainerBorder}66 !important;
        }

        /* === CUSTOMIZAÇÕES ESPECÍFICAS === */
        
        /* Canvas principal com gradiente se definido */
        ${styles.canvasBackground.includes('gradient') ? `
        [data-canvas-container],
        .dnd-droppable-zone {
          background: ${styles.canvasBackground} !important;
        }
        ` : ''}
        
        /* Animações suaves para mudanças de estilo */
        [data-canvas-container],
        .dnd-droppable-zone,
        [data-dnd-dropzone-type="bloco"],
        .navigation-button,
        [data-navigation-button] {
          transition: all 0.3s ease-in-out !important;
        }
      `;

            styleElement.textContent = css;
            document.head.appendChild(styleElement);

            console.log('🎨 Estilos dos containers aplicados:', styles);
        } catch (error) {
            console.error('Erro ao aplicar estilos dos containers:', error);
        }
    }, [styles, isLoaded]);

    // Aplicar estilos sempre que mudarem
    useEffect(() => {
        applyStyles();
    }, [applyStyles]);

    // Função para obter CSS customizado como string (útil para exports/imports)
    const getCustomCSS = useCallback(() => {
        return `/* Canvas Container Styles - Gerado automaticamente */
:root {
  --canvas-bg: ${styles.canvasBackground};
  --canvas-opacity: ${styles.canvasOpacity / 100};
  --canvas-border: ${styles.canvasBorder};
  --canvas-border-radius: ${styles.canvasBorderRadius}px;
  --canvas-padding: ${styles.canvasPadding}px;
  
  --component-bg: ${styles.componentContainerBackground};
  --component-border: ${styles.componentContainerBorder};
  --component-border-radius: ${styles.componentContainerBorderRadius}px;
  --component-padding: ${styles.componentContainerPadding}px;
  --component-shadow: ${styles.componentContainerShadow};
  
  --nav-btn-bg: ${styles.navigationButtonBackground};
  --nav-btn-text: ${styles.navigationButtonTextColor};
  --nav-btn-hover: ${styles.navigationButtonHoverBackground};
  --nav-btn-border: ${styles.navigationButtonBorder};
  
  --toolbar-bg: ${styles.toolbarBackground};
  --toolbar-border: ${styles.toolbarBorder};
  --toolbar-btn-bg: ${styles.toolbarButtonBackground};
  --toolbar-btn-hover: ${styles.toolbarButtonHoverBackground};
  
  --dropzone-active-bg: ${styles.dropzoneActiveBackground};
  --dropzone-active-border: ${styles.dropzoneActiveBorder};
  --dropzone-hover-bg: ${styles.dropzoneHoverBackground};
  --dropzone-indicator: ${styles.dropzoneIndicatorColor};
}`;
    }, [styles]);

    return {
        styles,
        isLoaded,
        updateStyles: saveStyles,
        resetStyles,
        applyStyles,
        getCustomCSS,
        defaultStyles: DEFAULT_CANVAS_STYLES
    };
};

export type { CanvasContainerStyles };
