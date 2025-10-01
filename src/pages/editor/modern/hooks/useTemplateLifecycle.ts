import { useEffect, useState } from 'react';
import { convertTemplateToEditorBlocks, createFallbackTemplate } from '../logic/templateConversion';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsAdapter';
import { loadFullTemplate, convertTemplateToEditorFormat } from '@/templates/registry';

interface TemplateLifecycleOptions {
    extractedInfo: { type: string; templateId: string | null; funnelId: string | null };
    crudContext: {
        createFunnel: (name: string, meta?: any) => Promise<any>;
    };
}

export function useTemplateLifecycle({ extractedInfo, crudContext }: TemplateLifecycleOptions) {
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const [templateError, setTemplateError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function run() {
            if (extractedInfo.type !== 'template' || !extractedInfo.templateId) return;
            setIsLoadingTemplate(true);
            setTemplateError(null);

            if (extractedInfo.templateId === 'quiz21StepsComplete') {
                try {
                    if (!QUIZ_STYLE_21_STEPS_TEMPLATE || Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).length === 0) {
                        throw new Error('Template quiz21StepsComplete está vazio ou não existe');
                    }
                    const convertedBlocks = convertTemplateToEditorBlocks(QUIZ_STYLE_21_STEPS_TEMPLATE);
                    if (convertedBlocks.length === 0) {
                        throw new Error('Template quiz21StepsComplete não produziu blocos válidos');
                    }
                    setTimeout(() => {
                        if (!cancelled) setIsLoadingTemplate(false);
                    }, 60);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    try {
                        const fallbackTemplate = createFallbackTemplate('quiz21StepsComplete');
                        convertTemplateToEditorBlocks(fallbackTemplate); // validação simples
                        if (!cancelled) setTemplateError(`Template original falhou, usando fallback: ${errorMessage}`);
                    } catch (fallbackError) {
                        const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                        if (!cancelled) setTemplateError(`Erro crítico: ${errorMessage}. Fallback falhou: ${fallbackErrorMessage}`);
                    }
                    if (!cancelled) setIsLoadingTemplate(false);
                }
            } else {
                try {
                    const template = await loadFullTemplate(extractedInfo.templateId);
                    if (!template) throw new Error(`Template ${extractedInfo.templateId} não encontrado`);
                    convertTemplateToEditorFormat(template); // apenas para validar conversão
                    await crudContext.createFunnel(template.name, { templateId: template.id });
                } catch (e: any) {
                    if (!cancelled) setTemplateError(e?.message || 'Erro ao carregar template');
                } finally {
                    if (!cancelled) setIsLoadingTemplate(false);
                }
            }
        }
        run();
        return () => { cancelled = true; };
    }, [extractedInfo.type, extractedInfo.templateId, crudContext]);

    return { isLoadingTemplate, templateError };
}

export default useTemplateLifecycle;