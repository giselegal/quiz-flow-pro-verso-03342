
import React from 'react';
import { useRoute } from 'wouter';
import { SchemaDrivenEditorClean } from '@/components/editor/SchemaDrivenEditorClean';

const SchemaDrivenEditorPage: React.FC = () => {
  const [match, params] = useRoute('/editor/:id');
  const funnelId = params?.id;

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <SchemaDrivenEditorClean funnelId={funnelId} />
    </div>
  );
};

export default SchemaDrivenEditorPage;
