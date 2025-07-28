
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EyeIcon, MoveIcon, Trash2Icon, X } from 'lucide-react';
import { StyleResult } from '@/types/quiz';
import { useEditor } from '@/hooks/useEditor';

interface SalesPageEditorProps {
  primaryStyle: StyleResult;
  onClose?: () => void; // Made this optional to maintain compatibility
}

const SalesPageEditor: React.FC<SalesPageEditorProps> = ({ primaryStyle, onClose }) => {
  const { 
    config, 
    addBlock, 
    updateBlock, 
    deleteBlock, 
    reorderBlocks 
  } = useEditor();

  const [isPreviewing, setIsPreviewing] = useState(false);

  return (
    <div className="min-h-screen bg-[#fffaf7] p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-playfair text-[#B89B7A]">
              Editor Visual
            </h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsPreviewing(!isPreviewing)}
                className="bg-[#B89B7A] hover:bg-[#8F7A6A]"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                {isPreviewing ? 'Editar' : 'Previsualizar'}
              </Button>
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-[#B89B7A] text-[#B89B7A]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Fechar Editor
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {config.blocks.map((block) => (
              <Card key={block.id} className="p-4 relative border border-[#B89B7A]/20">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8"
                  >
                    <MoveIcon className="w-4 h-4 text-[#8F7A6A]" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteBlock(block.id)}
                    className="w-8 h-8 text-red-500"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </div>
                
                {block.type === 'headline' && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Título principal"
                      value={block.content.title || ''}
                      onChange={(e) => updateBlock(block.id, {
                        ...block.content,
                        title: e.target.value
                      })}
                      className="border-[#B89B7A]/20"
                    />
                    <Textarea
                      placeholder="Subtítulo"
                      value={block.content.subtitle || ''}
                      onChange={(e) => updateBlock(block.id, {
                        ...block.content,
                        subtitle: e.target.value
                      })}
                      className="border-[#B89B7A]/20"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Button
              onClick={() => addBlock('headline')}
              className="bg-[#B89B7A] hover:bg-[#8F7A6A]"
            >
              + Headline
            </Button>
            <Button
              onClick={() => addBlock('image')}
              className="bg-[#B89B7A] hover:bg-[#8F7A6A]"
            >
              + Imagem
            </Button>
            <Button
              onClick={() => addBlock('benefits')}
              className="bg-[#B89B7A] hover:bg-[#8F7A6A]"
            >
              + Benefícios
            </Button>
            <Button
              onClick={() => addBlock('testimonials')}
              className="bg-[#B89B7A] hover:bg-[#8F7A6A]"
            >
              + Depoimentos
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SalesPageEditor;
