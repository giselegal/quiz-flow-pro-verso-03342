/**
 * 🎯 PÁGINA DE DEMO DO EDITOR DE ETAPAS REAIS
 * 
 * Demonstração completa do editor de componentes específicos das 21 etapas
 */

import React, { useState } from 'react';
// import { RealStepEditor } from '../components/editor/real-step-components/RealStepEditor'; // Arquivo foi integrado no editor principal
import { RealComponentProps } from '../components/editor/real-step-components/types';
import { cn } from '@/lib/utils';
import { Home, Book, Settings } from 'lucide-react';

export default function RealStepEditorDemoPage() {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isTestMode, setIsTestMode] = useState(false);

    const handleStepChange = (newStep: number) => {
        setCurrentStep(newStep);
    };

    const handleSave = (stepNumber: number, components: RealComponentProps[]) => {
        console.log(`💾 Salvando etapa ${stepNumber}:`, components);
        // Aqui você integraria com UnifiedCRUD ou outro sistema de persistência
        alert(`Etapa ${stepNumber} salva com sucesso! (${components.length} componentes)`);
    };

    const handlePreview = (stepNumber: number) => {
        console.log(`👁️ Visualizando etapa ${stepNumber} em produção`);
        // Aqui você abriria o preview real da etapa
        window.open(`/quiz-estilo?step=${stepNumber}`, '_blank');
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* 🎯 Header da aplicação */}
            <header className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Book className="h-6 w-6 text-blue-500" />
                            <h1 className="text-xl font-bold text-gray-900">
                                Editor de Etapas Reais
                            </h1>
                        </div>

                        <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            ✨ Sistema Modular Específico
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <a
                            href="/"
                            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Home size={18} />
                            <span>Início</span>
                        </a>

                        <a
                            href="/editor"
                            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Settings size={18} />
                            <span>Editor Principal</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* 📊 Navegação das etapas */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex space-x-2 overflow-x-auto">
                        {Array.from({ length: 21 }, (_, i) => i + 1).map((step) => (
                            <button
                                key={step}
                                onClick={() => handleStepChange(step)}
                                className={cn(
                                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                                    currentStep === step
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                )}
                            >
                                {step}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                            Etapa {currentStep} de 21
                        </span>

                        <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / 21) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

      {/* 🎨 Editor principal */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎯 Sistema Modular Integrado!
          </h2>
          <p className="text-gray-600 mb-6">
            O sistema de componentes modulares específicos foi integrado diretamente no editor principal.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              ✅ Acesse <strong>/editor</strong> e clique no botão <strong>"Modular"</strong>
            </p>
            <p className="text-sm text-gray-500">
              ✅ Selecione qualquer etapa para ver seus componentes específicos
            </p>
            <p className="text-sm text-gray-500">
              ✅ Edite cada componente de forma modular e independente
            </p>
          </div>
          <div className="mt-6">
            <a
              href="/editor"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ir para o Editor Principal
            </a>
          </div>
        </div>
      </div>            {/* 📝 Informações do sistema */}
            <footer className="bg-white border-t border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        ✅ Editor modular específico • Componentes reais das 21 etapas • Preserva lógica de negócio
                    </div>
                    <div>
                        🎯 Desenvolvido especificamente para o quiz de estilo pessoal
                    </div>
                </div>
            </footer>
        </div>
    );
}