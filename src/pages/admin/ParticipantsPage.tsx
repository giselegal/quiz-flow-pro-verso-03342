/**
 * 📋 PÁGINA DE PARTICIPANTES
 * 
 * Página dedicada para visualizar e gerenciar participantes do quiz
 */

import React from 'react';
import ParticipantsTable from '@/components/dashboard/ParticipantsTable';

const ParticipantsPage: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1
                    className="text-3xl font-bold text-[#432818]"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    Participantes do Quiz
                </h1>
                <p className="text-[#8F7A6A] mt-2">
                    Acompanhe o progresso e analise as respostas detalhadas de cada participante
                </p>
            </div>
            
            <ParticipantsTable />
        </div>
    );
};

export default ParticipantsPage;
