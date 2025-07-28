
import React from 'react';
import { CraftEditor } from '@/components/craft/CraftEditor';
import { useRoute } from 'wouter';

const CraftEditorPage: React.FC = () => {
  const [match, params] = useRoute('/craft-editor/:id?');
  const funnelId = params?.id;

  const handleSave = (content: string) => {
    console.log('Salvando conteúdo:', content);
    // Implementar salvamento real aqui
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <CraftEditor 
        funnelId={funnelId}
        onSave={handleSave}
      />
    </div>
  );
};

export default CraftEditorPage;
