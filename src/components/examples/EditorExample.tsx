import React, { useState } from 'react';
import { ValidationProvider } from '../../context/ValidationContext';
import '../../styles/validated-components.css';
import { ValidationProps } from '../../types/editor';
import { ValidatedPropertyPanel } from '../editor/ValidatedPropertyPanel';

interface ExampleBlock {
  id: string;
  type: string;
  values: Record<string, unknown>;
}

const blockValidations: Record<string, ValidationProps[]> = {
  content: [
    {
      type: 'required',
      properties: {},
    },
    {
      type: 'minLength',
      properties: { min: 10 },
    },
  ],
  style: [
    {
      type: 'pattern',
      properties: {
        regex: '^[a-zA-Z-]+$',
        message: 'Apenas letras e hífens são permitidos',
      },
    },
  ],
  question: [
    {
      type: 'required',
      properties: {},
    },
  ],
  selected: [
    {
      type: 'options',
      properties: {
        min: 1,
        max: 3,
      },
    },
  ],
  src: [
    {
      type: 'required',
      properties: {},
    },
    {
      type: 'pattern',
      properties: {
        regex: '^https?://.+',
        message: 'URL inválida',
      },
    },
  ],
  alt: [
    {
      type: 'required',
      properties: {},
    },
  ],
};

export const EditorExample: React.FC = () => {
  const [blocks, setBlocks] = useState<ExampleBlock[]>([
    {
      id: 'block1',
      type: 'text',
      values: {
        content: '',
        style: '',
      },
    },
    {
      id: 'block2',
      type: 'options',
      values: {
        question: '',
        options: [
          { value: '1', label: 'Opção 1' },
          { value: '2', label: 'Opção 2' },
          { value: '3', label: 'Opção 3' },
        ],
        selected: [],
      },
    },
    {
      id: 'block3',
      type: 'image',
      values: {
        src: '',
        alt: '',
      },
    },
  ]);

  const handleBlockChange = (blockId: string, newValues: Record<string, unknown>) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === blockId ? { ...block, values: newValues } : block))
    );
  };

  return (
    <ValidationProvider>
      <div className="editor-example">
        {blocks.map(block => (
          <div key={block.id} className="editor-example-block">
            <h3>{block.type.toUpperCase()}</h3>
            <ValidatedPropertyPanel
              blockId={block.id}
              type={block.type}
              values={block.values}
              onChange={values => handleBlockChange(block.id, values)}
              validations={blockValidations}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .editor-example {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .editor-example-block {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
        }

        .editor-example-block h3 {
          margin: 0 0 16px;
          color: #1f2937;
        }
      `}</style>
    </ValidationProvider>
  );
};
