
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditorBlock } from '@/types/editor';
import { PropertyEditorRouter } from '@/components/live-editor/property-editors/PropertyEditorRouter';

interface AdvancedPropertyPanelProps {
  selectedBlockId: string | null;
  blocks: EditorBlock[];
  onClose: () => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

// Map EditorBlock types to QuizComponentData types
const mapEditorTypeToComponentType = (type: string) => {
  const typeMap: Record<string, string> = {
    'headline': 'headline',
    'text': 'text', 
    'image': 'image',
    'header': 'header',
    'hero-section': 'hero-section',
    'benefits': 'benefits',
    'pricing': 'pricing',
    'guarantee': 'guarantee',
    'cta': 'cta',
    'button': 'button',
    'testimonials': 'testimonials',
    'style-result': 'style-result',
    'secondary-styles': 'secondary-styles',
    'products': 'products',
    'spacer': 'spacer',
    'video': 'video',
    'divider': 'divider',
    'faq': 'faq'
  };
  
  return typeMap[type] || type;
};

export const AdvancedPropertyPanel: React.FC<AdvancedPropertyPanelProps> = ({
  selectedBlockId,
  blocks,
  onClose,
  onUpdate,
  onDelete,
}) => {
  console.log('🔍 [AdvancedPropertyPanel] selectedBlockId:', selectedBlockId);
  console.log('🔍 [AdvancedPropertyPanel] blocks:', blocks);

  if (!selectedBlockId) {
    return (
      <div className="h-full bg-white flex flex-col">
        <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
          <h2 className="font-medium text-[#432818]">Propriedades</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-[#8F7A6A]">
            Selecione um componente para editar suas propriedades
          </p>
        </div>
      </div>
    );
  }

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);
  console.log('🔍 [AdvancedPropertyPanel] selectedBlock:', selectedBlock);

  if (!selectedBlock) {
    return (
      <div className="h-full bg-white flex flex-col">
        <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
          <h2 className="font-medium text-[#432818]">Propriedades</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 text-[#8F7A6A]" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-[#8F7A6A]">
            Componente não encontrado
          </p>
        </div>
      </div>
    );
  }

  const getBlockTitle = () => {
    switch (selectedBlock.type) {
      case 'headline': return 'Título';
      case 'text': return 'Texto';
      case 'image': return 'Imagem';
      case 'header': return 'Cabeçalho';
      case 'hero-section': return 'Seção Hero';
      case 'benefits': return 'Benefícios';
      case 'pricing': return 'Preço';
      case 'guarantee': return 'Garantia';
      case 'cta': 
      case 'button': return 'Call to Action';
      case 'testimonials': return 'Depoimentos';
      case 'style-result': return 'Resultado do Estilo';
      case 'secondary-styles': return 'Estilos Secundários';
      case 'products': return 'Produtos';
      case 'spacer': return 'Espaçador';
      case 'video': return 'Vídeo';
      case 'divider': return 'Divisória';
      case 'faq': return 'FAQ';
      default: return selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1);
    }
  };

  // Convert EditorBlock to QuizComponentData format for PropertyEditorRouter
  const componentData = {
    id: selectedBlock.id,
    type: mapEditorTypeToComponentType(selectedBlock.type),
    data: selectedBlock.content || {},
    style: selectedBlock.content?.style || {},
    order: selectedBlock.order || 0
  };

  console.log('🔍 [AdvancedPropertyPanel] componentData:', componentData);

  const handleUpdate = (id: string, updates: any) => {
    console.log('🔍 [AdvancedPropertyPanel] handleUpdate called with:', { id, updates });
    
    // Merge the updates with existing content
    const newContent = {
      ...selectedBlock.content,
      ...updates.data,
      style: {
        ...selectedBlock.content?.style,
        ...updates.style
      }
    };
    
    console.log('🔍 [AdvancedPropertyPanel] calling onUpdate with:', newContent);
    onUpdate(id, newContent);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-4 border-b border-[#B89B7A]/20 flex justify-between items-center">
        <h2 className="font-medium text-[#432818]">
          {getBlockTitle()}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4 text-[#8F7A6A]" />
        </Button>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-1">
            <TabsTrigger value="properties">Propriedades</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1">
          <TabsContent value="properties" className="p-4 space-y-4">
            <PropertyEditorRouter 
              component={componentData} 
              onUpdate={handleUpdate} 
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <div className="p-4 border-t border-[#B89B7A]/20">
        <Button 
          variant="destructive" 
          onClick={() => onDelete(selectedBlockId)} 
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Componente
        </Button>
      </div>
    </div>
  );
};
