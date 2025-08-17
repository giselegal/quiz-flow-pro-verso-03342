import { SavedTemplatesDashboard } from '@/components/dashboard/SavedTemplatesDashboard';
import React from 'react';
import { useLocation } from 'wouter';

export const MyTemplatesPage: React.FC = () => {
  const [, setLocation] = useLocation();

  const handleLoadTemplate = (templateId: string) => {
    // Redirecionar para o editor com o template carregado
    setLocation(`/editor?templateId=${templateId}`);
  };

  const handleEditTemplate = (templateId: string) => {
    // Redirecionar para o editor no modo de edição
    setLocation(`/editor?editTemplateId=${templateId}`);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    console.log('Template duplicado:', templateId);
    // Template já foi duplicado pelo hook, só precisamos de feedback
  };

  const handleSelectTemplate = (templateId: string) => {
    console.log('Template selecionado:', templateId);
    // Pode abrir um modal de preview ou outra ação
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#432818] mb-2">Meus Templates</h1>
              <p className="text-[#6B4F43] text-lg">
                Gerencie e reutilize seus templates de funil salvos
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLocation('/editor')}
                className="px-4 py-2 bg-[#B89B7A] text-white rounded-lg hover:bg-[#A38A69] transition-colors"
              >
                Criar Novo Funil
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard de templates */}
        <SavedTemplatesDashboard
          onLoadTemplate={handleLoadTemplate}
          onEditTemplate={handleEditTemplate}
          onDuplicateTemplate={handleDuplicateTemplate}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </div>
  );
};

export default MyTemplatesPage;
