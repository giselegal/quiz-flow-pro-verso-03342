import { useEffect, useState } from 'react';
import { convertTemplateToEditorBlocks, createFallbackTemplate } from '../logic/templateConversion';
import { quizEstiloLoaderGateway, mapStepsToStepBlocks } from '@/domain/quiz/gateway';
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

            if (extractedInfo.templateId === 'quiz21StepsComplete' || extractedInfo.templateId === 'quiz-estilo') {
                try {
                    const canonical = await quizEstiloLoaderGateway.load();
                    const mapped = mapStepsToStepBlocks(canonical.steps as any);
                    const syntheticTemplate = Object.values(mapped).reduce((acc: any, blocksArr: any, idx) => {
                        acc[`step-${idx + 1}`] = blocksArr;
                        return acc;
                    }, {} as Record<string, any[]>);

                    const convertedBlocks = convertTemplateToEditorBlocks(syntheticTemplate);
                    if (convertedBlocks.length === 0) {
                        throw new Error('Definição canônica não produziu blocos válidos');
                    }
                    await crudContext.createFunnel('Quiz Estilo (Canônico)', { templateId: canonical.templateId, source: canonical.source });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    try {
                        const fallbackTemplate = createFallbackTemplate('quiz-estilo');
                        convertTemplateToEditorBlocks(fallbackTemplate);
                        if (!cancelled) setTemplateError(`Canônico falhou, fallback usado: ${errorMessage}`);
                    } catch (fallbackError) {
                        const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
                        if (!cancelled) setTemplateError(`Erro crítico canônico e fallback: ${errorMessage} / ${fallbackErrorMessage}`);
                    }
                } finally {
                    if (!cancelled) setIsLoadingTemplate(false);
                }
            } else {
                try {
                    const template = await loadFullTemplate(extractedInfo.templateId);
                    if (!template) throw new Error(`Template ${extractedInfo.templateId} não encontrado`);
                    convertTemplateToEditorFormat(template);
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