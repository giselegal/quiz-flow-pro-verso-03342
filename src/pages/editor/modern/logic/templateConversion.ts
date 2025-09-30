// 🔧 Template Conversion Utilities (extraído de ModernUnifiedEditor)
// Responsável por converter estrutura de template em lista/agrupamento utilizável pelo editor
import { measure } from '@/utils/perf/measure';

export function convertTemplateToEditorBlocks(templateData: Record<string, any[]>): any[] {
    return measure('convertTemplateToEditorBlocks', () => {
        const allBlocks: any[] = [];
        Object.entries(templateData).forEach(([stepKey, stepBlocks]) => {
            if (stepKey.startsWith('step-') && Array.isArray(stepBlocks)) {
                stepBlocks.forEach((block, index) => {
                    allBlocks.push({
                        ...block,
                        id: `${stepKey}-${block.id}`,
                        stepId: stepKey,
                        stepNumber: parseInt(stepKey.replace('step-', '')),
                        order: (parseInt(stepKey.replace('step-', '')) - 1) * 100 + index
                    });
                });
            }
        });
        if (process.env.NODE_ENV !== 'production') {
            console.log(`📊 [templateConversion] Convertidos ${allBlocks.length} blocos de ${Object.keys(templateData).length} steps`);
        }
        return allBlocks;
    });
}

export function createFallbackTemplate(templateId: string) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`⚠️ [templateConversion] Criando template de fallback para: ${templateId}`);
    }
    return {
        'step-1': [
            {
                id: 'fallback-welcome',
                type: 'text-inline',
                properties: {
                    content: `Template "${templateId}" não encontrado. Este é um template de demonstração.`,
                    textAlign: 'center',
                    fontSize: 'text-xl',
                    fontWeight: 'font-bold',
                    color: '#1A365D'
                },
                content: {},
                order: 0
            },
            {
                id: 'fallback-description',
                type: 'text-inline',
                properties: {
                    content: 'Por favor, verifique se o template existe ou entre em contato com o suporte.',
                    textAlign: 'center',
                    fontSize: 'text-base',
                    color: '#718096'
                },
                content: {},
                order: 1
            }
        ]
    };
}
