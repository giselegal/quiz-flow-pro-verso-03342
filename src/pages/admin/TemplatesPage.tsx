import { EnhancedEditorDashboard } from '@/components/enhanced-editor/dashboard/EnhancedEditorDashboard';
import React from 'react';

const TemplatesPage: React.FC = () => {
  const handleCreateFunnel = () => {
    window.location.href = '/editor';
  };

  const handleEditFunnel = (funnelId: string) => {
    window.location.href = `/editor/${funnelId}`;
  };

  const handlePreviewFunnel = (funnelId: string) => {
    window.open(`/quiz/${funnelId}`, '_blank');
  };

  const handleDuplicateFunnel = (funnelId: string) => {
    console.log('Duplicar funil:', funnelId);
    // Implementar lógica de duplicação
  };

  const handleDeleteFunnel = (funnelId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funil?')) {
      console.log('Excluir funil:', funnelId);
      // Implementar lógica de exclusão
    }
  };

  const handleCreateFromTemplate = (templateId: string) => {
    window.location.href = `/editor?template=${templateId}`;
  };

  const handleLoadSavedTemplate = (templateId: string) => {
    window.location.href = `/editor?savedTemplate=${templateId}`;
  };

  const handleEditSavedTemplate = (templateId: string) => {
    window.location.href = `/editor?editTemplate=${templateId}`;
  };

  const handleDuplicateSavedTemplate = (templateId: string) => {
    console.log('Duplicar template salvo:', templateId);
    // Implementar lógica de duplicação de template
  };

  const handleImportTemplate = () => {
    console.log('Importar template');
    // Implementar lógica de importação
  };

  const handleExportTemplate = (templateId: string) => {
    console.log('Exportar template:', templateId);
    // Implementar lógica de exportação
  };

  return (
    <div className="p-6">
      <EnhancedEditorDashboard
        onCreateFunnel={handleCreateFunnel}
        onEditFunnel={handleEditFunnel}
        onDuplicateFunnel={handleDuplicateFunnel}
        onDeleteFunnel={handleDeleteFunnel}
        onPreviewFunnel={handlePreviewFunnel}
        onCreateFromTemplate={handleCreateFromTemplate}
        onLoadSavedTemplate={handleLoadSavedTemplate}
        onEditSavedTemplate={handleEditSavedTemplate}
        onDuplicateSavedTemplate={handleDuplicateSavedTemplate}
        onImportTemplate={handleImportTemplate}
        onExportTemplate={handleExportTemplate}
      />
    </div>
  );
};

export default TemplatesPage;
