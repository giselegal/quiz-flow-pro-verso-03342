import React from 'react';
import { useRoute } from 'wouter';
import SchemaDrivenEditorResponsive from '@/components/editor/SchemaDrivenEditorResponsive';

const SchemaDrivenEditorPage: React.FC = () => {
  const [match, params] = useRoute('/editor/:id');
  const funnelId = params?.id;

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <SchemaDrivenEditorResponsive funnelId={funnelId} className="h-full w-full" />
    </div>
  );
};

export default SchemaDrivenEditorPage;
