/**
 * 🧪 TESTE DE INTEGRAÇÃO DO STEP 1
 * 
 * Verificar se o Step 1 modular está funcionando
 * corretamente com o sistema de registro.
 */

import React from 'react';
import { stepRegistry, StepRenderer } from './index';

// Componente de teste para verificar o funcionamento
const Step01TestComponent: React.FC = () => {
    // Dados de teste simulando useQuizState
    const mockData = {
        userName: '',
        currentStep: 1,
        totalSteps: 21,
        funnelId: 'test-funnel-123'
    };

    const mockHandlers = {
        onNext: () => console.log('🔄 Próximo step solicitado'),
        onPrevious: () => console.log('🔄 Step anterior solicitado'),
        onSave: (data: any) => console.log('💾 Dados salvos:', data),
    };

    // Verificar se o step está registrado
    const step01 = stepRegistry.get('step-01');

    if (!step01) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    ❌ Step 01 não encontrado!
                </h2>
                <p className="text-gray-600 mb-4">
                    O Step 01 não foi registrado corretamente no sistema.
                </p>
                <details className="text-left">
                    <summary className="cursor-pointer text-blue-600">
                        📋 Debug do Registry
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-sm">
                        Steps registrados: {stepRegistry.count()}
                        {stepRegistry.count() > 0 && (
                            <div>
                                Lista: {stepRegistry.getAll().map(s => s.id).join(', ')}
                            </div>
                        )}
                    </pre>
                </details>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header de teste */}
            <div className="bg-white shadow-sm border-b p-4">
                <h1 className="text-xl font-bold text-gray-800">
                    🧪 Teste do Step 01 Modular
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    Step registrado: <span className="font-mono text-green-600">{step01.name}</span>
                </p>
            </div>

            {/* Renderizar o step usando StepRenderer */}
            <StepRenderer
                stepId="step-01"
                stepNumber={1}
                isActive={true}
                isEditable={true}
                data={mockData}
                funnelId={mockData.funnelId}
                {...mockHandlers}
            />

            {/* Debug info */}
            <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
                <h3 className="font-bold text-sm mb-2">🔍 Debug Info</h3>
                <ul className="text-xs space-y-1">
                    <li>✅ Step 01 registrado</li>
                    <li>📊 Total steps: {stepRegistry.count()}</li>
                    <li>🎯 Step ativo: step-01</li>
                    <li>📝 Modo: {mockData.userName ? 'Visualização' : 'Edição'}</li>
                </ul>
            </div>
        </div>
    );
};

export default Step01TestComponent;