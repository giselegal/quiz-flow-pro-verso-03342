import React from 'react';
import { AVAILABLE_TEMPLATES, TemplateService } from '../../config/templates';

const TemplateDebugPage: React.FC = () => {
    console.log('🔍 AVAILABLE_TEMPLATES:', AVAILABLE_TEMPLATES);
    console.log('🔍 TemplateService:', TemplateService);
    console.log('🔍 getActiveTemplates:', TemplateService.getActiveTemplates());
    console.log('🔍 quiz21StepsComplete:', TemplateService.getTemplate('quiz21StepsComplete'));

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Templates</h1>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h2 className="font-semibold mb-2">Total de Templates: {AVAILABLE_TEMPLATES.length}</h2>
                <h2 className="font-semibold mb-2">Templates Ativos: {TemplateService.getActiveTemplates().length}</h2>
            </div>

            <div className="space-y-4">
                {AVAILABLE_TEMPLATES.map(template => (
                    <div
                        key={template.id}
                        className={`p-4 border rounded-lg ${template.isActive ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
                    >
                        <h3 className="font-bold">{template.name}</h3>
                        <p className="text-sm text-gray-600">ID: {template.id}</p>
                        <p className="text-sm">Categoria: {template.category}</p>
                        <p className="text-sm">Dificuldade: {template.difficulty}</p>
                        <p className="text-sm">Ativo: {template.isActive ? '✅ SIM' : '❌ NÃO'}</p>
                        <p className="text-sm">Etapas: {template.stepCount}</p>
                        {template.id === 'quiz21StepsComplete' && (
                            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                                <strong>🎯 ESTE É O TEMPLATE QUE ESTAMOS PROCURANDO!</strong>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateDebugPage;