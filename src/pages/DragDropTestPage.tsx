import React from 'react';
import SchemaDrivenEditorResponsive from '../components/editor/SchemaDrivenEditorResponsive';

const DragDropTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold mb-2">🎯 Sistema de Drag & Drop Ativado</h1>
        <p className="text-gray-600">
          O sistema de drag & drop foi implementado e ativado no editor! 
          Arraste componentes da barra lateral esquerda para o canvas central.
        </p>
        <div className="mt-3 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
          <strong>Como usar:</strong> Clique e arraste qualquer componente da sidebar para o canvas. 
          Use os controles nos blocos para reordenar, duplicar ou deletar.
        </div>
      </div>
      <SchemaDrivenEditorResponsive />
    </div>
  );
};

export default DragDropTestPage;
