
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { EditorBlock } from '@/types/editor';
import { BenefitsBlockEditor } from './block-editors/BenefitsBlockEditor';
import PricingBlockEditor from './block-editors/PricingBlockEditor';
import { ImageBlockEditor } from '../editor/blocks/ImageBlockEditor';
import FAQBlockEditor from './block-editors/FAQBlockEditor';

interface EditableBlockProps {
  block: EditorBlock;
  isSelected: boolean;
  onUpdate: (content: any) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

const EditableBlock: React.FC<EditableBlockProps> = ({
  block,
  isSelected,
  onUpdate,
  onDelete,
  onMove
}) => {
  const renderEditor = () => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            value={block.content?.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
          />
        );
      
      case 'image':
        return <ImageBlockEditor block={block} onUpdate={onUpdate} />;
      
      case 'header':
        return (
          <div className="space-y-2">
            <input
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Título"
            />
            <input
              value={block.content?.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Subtítulo"
            />
          </div>
        );
      
      case 'benefits':
        // Extract string items for benefits editor
        const stringItems = Array.isArray(block.content?.items) 
          ? block.content.items.filter((item): item is string => typeof item === 'string')
          : [];
        
        const benefitsContent = {
          ...block.content,
          items: stringItems
        };
        
        return <BenefitsBlockEditor block={{ ...block, content: benefitsContent }} onUpdate={onUpdate} />;
      
      case 'pricing':
        return <PricingBlockEditor block={block} onUpdate={onUpdate} />;
      
      case 'guarantee':
        return (
          <textarea
            value={block.content?.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
          />
        );
      
      case 'cta':
        return (
          <div className="space-y-2">
            <input
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Título"
            />
            <input
              value={block.content?.buttonText || ''}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Texto do botão"
            />
          </div>
        );
      
      case 'faq':
        return <FAQBlockEditor content={block.content || {}} onUpdate={onUpdate} />;
      
      default:
        return <p>Editor não disponível para o tipo: {block.type}</p>;
    }
  };

  const renderPreview = () => {
    switch (block.type) {
      case 'text':
        return <p className="text-gray-800">{block.content?.text || 'Texto vazio'}</p>;
      
      case 'header':
        return (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{block.content?.title || 'Título'}</h1>
            {block.content?.subtitle && (
              <p className="text-gray-600">{block.content.subtitle}</p>
            )}
          </div>
        );
      
      case 'image':
        return block.content?.imageUrl ? (
          <img
            src={block.content.imageUrl}
            alt={block.content.imageAlt || 'Imagem'}
            className="max-w-full h-auto rounded"
          />
        ) : (
          <div className="bg-gray-100 h-32 flex items-center justify-center rounded">
            <span className="text-gray-500">Sem imagem</span>
          </div>
        );
      
      case 'benefits':
        const items = Array.isArray(block.content?.items) 
          ? block.content.items.filter((item): item is string => typeof item === 'string')
          : [];
        
        return (
          <div>
            <h3 className="font-medium mb-2">{block.content?.title || 'Benefícios'}</h3>
            <ul className="list-disc list-inside">
              {items.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        );
      
      default:
        return <p>Preview não disponível para: {block.type}</p>;
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">{block.type}</span>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onMove('up'); }}>
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onMove('down'); }}>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {isSelected ? renderEditor() : renderPreview()}
    </div>
  );
};

export default EditableBlock;
