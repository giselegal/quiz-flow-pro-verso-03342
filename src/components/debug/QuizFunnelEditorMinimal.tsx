import React from 'react';
import { useUnifiedCRUD } from '@/context/UnifiedCRUDProvider';

interface QuizFunnelEditorProps {
  funnelId?: string;
  templateId?: string;
}

const QuizFunnelEditorMinimal: React.FC<QuizFunnelEditorProps> = ({ funnelId, templateId }) => {
  const crud = useUnifiedCRUD();

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🎯 Quiz Funnel Editor (Minimal)</h1>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h2 className="font-semibold mb-2">Parâmetros:</h2>
          <p>FunnelId: <code>{funnelId || 'não informado'}</code></p>
          <p>TemplateId: <code>{templateId || 'não informado'}</code></p>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <h2 className="font-semibold mb-2">Status CRUD:</h2>
          <p>Current Funnel: <code>{crud.currentFunnel?.name || 'nenhum'}</code></p>
          <p>Funnels Count: <code>{crud.funnels.length}</code></p>
          <p>Loading: <code>{crud.loading ? 'sim' : 'não'}</code></p>
          <p>Error: <code>{crud.error || 'nenhum'}</code></p>
        </div>

        <div className="bg-yellow-50 p-4 rounded">
          <h2 className="font-semibold mb-2">Debug:</h2>
          <p>✅ QuizFunnelEditor carregado com sucesso</p>
          <p>✅ UnifiedCRUD Provider funcionando</p>
          <p>✅ Props recebidas corretamente</p>
        </div>
      </div>
    </div>
  );
};

export default QuizFunnelEditorMinimal;