/**
 * 🧪 TESTE DA TABELA DE PARTICIPANTES
 * 
 * Página de teste para verificar o funcionamento da tabela
 */

import React from 'react';
import ParticipantsTable from '@/components/dashboard/ParticipantsTable';

const TestParticipantsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#432818] mb-2">
                        🧪 Teste - Tabela de Participantes
                    </h1>
                    <p className="text-[#8F7A6A]">
                        Visualização das respostas e progresso dos participantes do quiz
                    </p>
                </div>

                <ParticipantsTable />
            </div>
        </div>
    );
};

export default TestParticipantsPage;
