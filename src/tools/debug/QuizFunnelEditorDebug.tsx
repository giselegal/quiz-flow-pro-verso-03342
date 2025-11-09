import React from 'react';

// TESTE: Carregando imports um por um para identificar problema
// ✅ FASE 4: BlockRegistry removido (migrado para UnifiedBlockRegistry)

// Imports básicos do React
// ✅ React funcionando

// Imports utilitários
import { emitQuizEvent, setQuizAnalyticsNamespace } from '@/lib/utils/quizAnalytics';
import sanitizeHtml from '@/lib/utils/sanitizeHtml';

// Imports Zod
import { z } from 'zod';

// Imports contexto
import { useUnifiedCRUD } from '@/contexts';

// Imports UI
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Imports dados
import { templateService } from '@/services/canonical/TemplateService';
import { styleConfigGisele } from '@/data/styles';

// Imports ícones
// import { Plus, Save, Trash2, ArrowUp, ArrowDown, Copy, RefreshCw, ListTree } from 'lucide-react';
// import { Undo2, Redo2 } from 'lucide-react';

// Imports runtime
import { QuizRuntimeRegistryProvider, useQuizRuntimeRegistry } from '@/core/runtime/quiz/QuizRuntimeRegistry';
import { editorStepsToRuntimeMap } from '@/core/runtime/quiz/editorAdapter';
import QuizAppConnected from '@/components/quiz/QuizAppConnected';

interface QuizFunnelEditorProps {
    funnelId?: string;
    templateId?: string;
}

const QuizFunnelEditorDebug: React.FC<QuizFunnelEditorProps> = ({ funnelId, templateId }) => {
    const crud = useUnifiedCRUD();
    const allSteps = templateService.getAllStepsSync();

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">🔍 QuizFunnelEditor Debug</h1>
            <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded">
                    <h2 className="font-semibold mb-2">Imports básicos funcionando:</h2>
                    <p>✅ React</p>
                    <p>✅ Utils (quizAnalytics, sanitizeHtml)</p>
                    <p>✅ Zod</p>
                    <p>✅ UnifiedCRUD Context - funnel: {crud.currentFunnel?.name || 'nenhum'}</p>
                    <p>✅ UI Components (Button, Badge, Separator)</p>
                    <p>✅ Data (TemplateService: {Object.keys(allSteps).length} steps, styleConfig)</p>
                    <p>✅ Props recebidas: funnelId={funnelId}, templateId={templateId}</p>
                </div>

                <p className="text-sm text-gray-600">
                    Próximo: ativar imports um por um para identificar o problema
                </p>
            </div>
        </div>
    );
};

export default QuizFunnelEditorDebug;