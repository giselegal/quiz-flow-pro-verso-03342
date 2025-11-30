/**
 * 📋 Step Panel - Coluna 1: Lista de Steps
 * 
 * Funcionalidades:
 * - Listar todos os steps do quiz
 * - Selecionar step (onclick)
 * - Visual de step selecionado
 * - Contador de blocos por step
 */

import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';

export function StepPanel() {
    const quiz = useQuizStore((state) => state.quiz);
    const { selectedStepId, selectStep } = useEditorStore();

    if (!quiz) {
        return (
            <div className="w-52 border-r border-gray-200 bg-white flex items-center justify-center">
                <p className="text-sm text-gray-500">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="w-52 border-r border-gray-200 bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">
                    Etapas ({quiz.steps?.length || 0})
                </h2>
            </div>

            {/* Lista de steps */}
            <div className="flex-1 overflow-y-auto">
                {quiz.steps?.map((step: any) => {
                    const isSelected = selectedStepId === step.id;
                    const blockCount = step.blocks?.length || 0;

                    return (
                        <button
                            key={step.id}
                            onClick={() => selectStep(step.id)}
                            className={`
                w-full p-3 text-left border-b border-gray-100
                hover:bg-blue-50 transition-colors
                ${isSelected ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''}
              `}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'
                                        }`}>
                                        {step.title || step.id}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {blockCount} {blockCount === 1 ? 'bloco' : 'blocos'}
                                    </p>
                                </div>

                                {/* Badge com número da ordem */}
                                <span className={`
                  flex-shrink-0 ml-2 px-2 py-1 text-xs font-medium rounded
                  ${isSelected ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'}
                `}>
                                    {step.order}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer com info */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600">
                    {selectedStepId ? 'Etapa selecionada' : 'Selecione uma etapa'}
                </p>
            </div>
        </div>
    );
}
