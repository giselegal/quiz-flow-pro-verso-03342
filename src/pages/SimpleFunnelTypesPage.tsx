/**
 * 🧭 PÁGINA SIMPLES PARA TESTE
 */

import React from 'react';

const SimpleFunnelTypesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Editor de Funis - Tipos Disponíveis
                </h1>
                <p className="text-gray-600 mb-8">
                    Sistema funcionando! Aqui você pode escolher o tipo de funil para editar.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quiz de Estilo */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-xl font-semibold mb-2">Quiz de Estilo Pessoal</h2>
                        <p className="text-gray-600 mb-4">21 etapas com HybridTemplateService</p>
                        <a
                            href="/editor/quiz-estilo-demo"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Abrir Editor
                        </a>
                    </div>

                    {/* Landing Page */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-xl font-semibold mb-2">Landing Page</h2>
                        <p className="text-gray-600 mb-4">Página de captura com formulário</p>
                        <a
                            href="/editor/landing-demo"
                            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Abrir Editor
                        </a>
                    </div>

                    {/* Funil de Vendas */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-xl font-semibold mb-2">Funil de Vendas</h2>
                        <p className="text-gray-600 mb-4">E-commerce com checkout</p>
                        <a
                            href="/editor/sales-demo"
                            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            Abrir Editor
                        </a>
                    </div>

                    {/* Lead Magnet */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-xl font-semibold mb-2">Lead Magnet</h2>
                        <p className="text-gray-600 mb-4">Captura de leads com material gratuito</p>
                        <a
                            href="/editor/lead-demo"
                            className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                        >
                            Abrir Editor
                        </a>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Como usar:</h3>
                    <ul className="text-blue-800 text-sm space-y-1">
                        <li>• Clique em "Abrir Editor" para testar com dados demo</li>
                        <li>• O sistema detecta automaticamente o tipo baseado no ID</li>
                        <li>• Para IDs customizados, use: /editor/seu-id-personalizado</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SimpleFunnelTypesPage;