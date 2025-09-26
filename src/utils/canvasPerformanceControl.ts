/**
 * 🚀 CONTROLE DE DEBUG - CANVAS PERFORMANCE
 * 
 * Script para controlar logs de debug e renderização excessiva
 */

// Desabilitar logs de render por padrão
if (typeof window !== 'undefined') {
    // Desabilitar debug do DnD
    (window as any).__DND_DEBUG = false;

    // Desabilitar debug de estilos do canvas
    (window as any).__CANVAS_STYLES_DEBUG = false;

    // Limpar logs existentes
    if ((window as any).__DND_LOGS) {
        (window as any).__DND_LOGS.clear();
    }

    console.log('🎯 Canvas Performance: Debug logs desabilitados para melhor performance');
}

// Função para habilitar debug temporariamente (apenas desenvolvimento)
export const enableCanvasDebug = () => {
    if (process.env.NODE_ENV === 'development') {
        if (typeof window !== 'undefined') {
            (window as any).__DND_DEBUG = true;
            (window as any).__CANVAS_STYLES_DEBUG = true;
            console.log('🔍 Canvas Performance: Debug logs habilitados');
        }
    }
};

// Função para desabilitar debug
export const disableCanvasDebug = () => {
    if (typeof window !== 'undefined') {
        (window as any).__DND_DEBUG = false;
        (window as any).__CANVAS_STYLES_DEBUG = false;
        console.log('🎯 Canvas Performance: Debug logs desabilitados');
    }
};

export default {
    enableCanvasDebug,
    disableCanvasDebug
};