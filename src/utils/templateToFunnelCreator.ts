/**
 * 🔧 Template to Funnel Creator
 * 
 * Utilitário para criar funis isolados a partir de templates,
 * corrigindo o problema de IDs duplicados e edição compartilhada.
 */

import { funnelTemplateService } from '@/services/funnelTemplateService';

interface CreateFunnelFromTemplateOptions {
    templateId: string;
    funnelName?: string;
    redirectToEditor?: boolean;
}

interface CreateFunnelResult {
    success: boolean;
    funnelId?: string;
    error?: string;
    editorUrl?: string;
}

/**
 * Cria um novo funil isolado a partir de um template
 */
export async function createFunnelFromTemplate(
    options: CreateFunnelFromTemplateOptions
): Promise<CreateFunnelResult> {
    try {
        console.log('🎯 Creating funnel from template:', options);

        // Criar novo funil usando o serviço
        const newFunnelId = await funnelTemplateService.createFunnelFromTemplate(
            options.templateId,
            options.funnelName
        );

        if (!newFunnelId) {
            return {
                success: false,
                error: 'Failed to create funnel - no ID returned'
            };
        }

        console.log('✅ New funnel created with ID:', newFunnelId);

        // Gerar URL do editor com o ID específico
        const editorUrl = `/editor?funnel=${newFunnelId}`;

        // Redirecionar se solicitado
        if (options.redirectToEditor && typeof window !== 'undefined') {
            console.log('🔀 Redirecting to editor:', editorUrl);
            window.location.href = editorUrl;
        }

        return {
            success: true,
            funnelId: newFunnelId,
            editorUrl
        };

    } catch (error) {
        console.error('❌ Error creating funnel from template:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Navega para o editor com um funil específico
 */
export function navigateToFunnelEditor(funnelId: string): void {
    if (typeof window === 'undefined') return;

    const url = `/editor?funnel=${funnelId}`;
    console.log('🔀 Navigating to funnel editor:', url);
    window.location.href = url;
}

/**
 * Extrai funnelId da URL atual
 */
export function getCurrentFunnelId(): string | null {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    return params.get('funnel');
}

/**
 * Verifica se o editor está editando um funil específico ou um template genérico
 */
export function isEditingSpecificFunnel(): boolean {
    const funnelId = getCurrentFunnelId();
    return funnelId !== null && funnelId !== 'local-funnel';
}

/**
 * Wrapper para o dashboard usar ao clicar em "Editar Template"
 */
export async function handleEditTemplate(templateId: string, templateName?: string): Promise<void> {
    try {
        // Criar novo funil e redirecionar
        const result = await createFunnelFromTemplate({
            templateId,
            funnelName: templateName ? `${templateName} - Cópia` : undefined,
            redirectToEditor: true
        });

        if (!result.success) {
            alert(`Erro ao criar funil: ${result.error}`);
        }
    } catch (error) {
        console.error('❌ Error in handleEditTemplate:', error);
        alert('Erro ao criar funil a partir do template');
    }
}

/**
 * Debug: informações sobre o estado atual
 */
export function debugTemplateState(): void {
    console.log('🔍 Template Debug Info:', {
        currentUrl: window.location.href,
        funnelId: getCurrentFunnelId(),
        isEditingSpecific: isEditingSpecificFunnel(),
        urlParams: Object.fromEntries(new URLSearchParams(window.location.search))
    });
}

// Expor globalmente para debug
if (typeof window !== 'undefined') {
    (window as any).templateUtils = {
        createFunnelFromTemplate,
        navigateToFunnelEditor,
        getCurrentFunnelId,
        isEditingSpecificFunnel,
        handleEditTemplate,
        debugTemplateState
    };
}
