/**
 * 🧪 PÁGINA DE TESTE SIMPLES PARA TEMPLATES
 */

import React from 'react';
import { AVAILABLE_TEMPLATES, TemplateService } from '@/config/templates';

const TemplateTestPage: React.FC = () => {
    const allTemplates = AVAILABLE_TEMPLATES;
    const activeTemplates = TemplateService.getActiveTemplates();
    const quiz21Template = TemplateService.getTemplate('quiz21StepsComplete');

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🧪 Teste de Templates</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">📊 Estatísticas</h2>
                        <p>Total de templates: <strong>{allTemplates.length}</strong></p>
                        <p>Templates ativos: <strong>{activeTemplates.length}</strong></p>
                        <p>quiz21StepsComplete encontrado: <strong>{quiz21Template ? '✅ Sim' : '❌ Não'}</strong></p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">🎯 Quiz 21 Detalhes</h2>
                        {quiz21Template ? (
                            <div>
                                <p><strong>Nome:</strong> {quiz21Template.name}</p>
                                <p><strong>ID:</strong> {quiz21Template.id}</p>
                                <p><strong>Categoria:</strong> {quiz21Template.category}</p>
                                <p><strong>Ativo:</strong> {quiz21Template.isActive ? '✅' : '❌'}</p>
                                <p><strong>Etapas:</strong> {quiz21Template.stepCount}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">Template não encontrado!</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">🔗 Links</h2>
                        <div className="space-y-2">
                            <a
                                href="/dashboard/funnel-templates"
                                className="block text-blue-600 hover:underline"
                                target="_blank"
                            >
                                📋 Página de Templates
                            </a>
                            <a
                                href="/debug/templates"
                                className="block text-blue-600 hover:underline"
                                target="_blank"
                            >
                                🔍 Diagnóstico de Templates
                            </a>
                            {quiz21Template && (
                                <a
                                    href={quiz21Template.editorUrl}
                                    className="block text-green-600 hover:underline"
                                    target="_blank"
                                >
                                    ✨ Abrir Quiz 21 no Editor
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">📝 Lista de Todos os Templates</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Nome</th>
                                    <th className="px-4 py-2 text-left">Categoria</th>
                                    <th className="px-4 py-2 text-left">Ativo</th>
                                    <th className="px-4 py-2 text-left">Etapas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTemplates.map(template => (
                                    <tr key={template.id} className="border-t">
                                        <td className="px-4 py-2 font-mono text-sm">{template.id}</td>
                                        <td className="px-4 py-2">{template.name}</td>
                                        <td className="px-4 py-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                {template.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {template.isActive ? '✅' : '❌'}
                                        </td>
                                        <td className="px-4 py-2">{template.stepCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateTestPage;