/**
 * 🧭 PÁGINA DO NAVEGADOR DE TIPOS DE FUNIS - VERSÃO SIMPLES PARA TESTE
 */

import React from 'react';

const FunnelTypesPageSimple: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Editor de Funis Multi-Tipo
                </h1>
                <p className="text-gray-600 mb-8">
                    Escolha o tipo de funil que deseja editar.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-medium mb-2">Quiz de Estilo Pessoal</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Quiz completo com 21 etapas para descoberta do estilo pessoal
                        </p>
                        <a 
                            href="/editor/quiz-estilo-demo" 
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Abrir Editor
                        </a>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-medium mb-2">Landing Page</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Página de captura ou conversão com formulário
                        </p>
                        <a 
                            href="/editor/landing-demo" 
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Abrir Editor
                        </a>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-medium mb-2">Funil de Vendas</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Funil completo com apresentação e checkout
                        </p>
                        <a 
                            href="/editor/sales-demo" 
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Abrir Editor
                        </a>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-medium mb-2">Lead Magnet</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Captura de leads com material gratuito
                        </p>
                        <a 
                            href="/editor/lead-demo" 
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Abrir Editor
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunnelTypesPageSimple;