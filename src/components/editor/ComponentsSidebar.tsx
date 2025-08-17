import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { Block, BlockType } from '@/types/editor';

export const ComponentsSidebar: React.FC = () => {
  const { addBlock } = useEditor();

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
  };

  return (
    <div className="components-sidebar">
      <h2 className="sidebar-title">Componentes</h2>
      
      <div className="block-categories">
        <div className="category">
          <h3>Conteúdo</h3>
          <div className="block-list">
            <button onClick={() => handleAddBlock('text-block')}>Texto</button>
            <button onClick={() => handleAddBlock('heading-block')}>Título</button>
            <button onClick={() => handleAddBlock('image-block')}>Imagem</button>
            <button onClick={() => handleAddBlock('video-block')}>Vídeo</button>
          </div>
        </div>

        <div className="category">
          <h3>Quiz</h3>
          <div className="block-list">
            <button onClick={() => handleAddBlock('question-block')}>Pergunta</button>
            <button onClick={() => handleAddBlock('options-block')}>Opções</button>
            <button onClick={() => handleAddBlock('result-block')}>Resultado</button>
          </div>
        </div>

        <div className="category">
          <h3>Layout</h3>
          <div className="block-list">
            <button onClick={() => handleAddBlock('container-block')}>Container</button>
            <button onClick={() => handleAddBlock('grid-block')}>Grid</button>
            <button onClick={() => handleAddBlock('divider-block')}>Divisor</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .components-sidebar {
          padding: 16px;
          border-right: 1px solid #e5e7eb;
          height: 100%;
          width: 280px;
          background: white;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #111827;
        }

        .category {
          margin-bottom: 24px;
        }

        .category h3 {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .block-list {
          display: grid;
          gap: 8px;
        }

        button {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        button:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  );
};
