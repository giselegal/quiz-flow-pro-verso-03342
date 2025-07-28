
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorBlock, EditableContent } from '@/types/editor';
import { StyleControls } from '@/components/editor/controls/StyleControls';

interface PropertiesPanelProps {
  selectedComponentId: string | null;
  onClose: () => void;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onDelete?: () => void;
  blocks?: EditorBlock[];
}

const PropertiesPanel = ({ 
  selectedComponentId, 
  onClose, 
  onUpdate,
  onDelete,
  blocks 
}: PropertiesPanelProps) => {
  const selectedBlock = blocks?.find(block => block.id === selectedComponentId);

  if (!selectedComponentId || !selectedBlock) {
    return (
      <div className="h-full p-4 bg-white">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-playfair text-[#432818]">Propriedades</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-[#8F7A6A] text-sm">
          <p>Selecione um componente para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 bg-white overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-lg font-playfair text-[#432818]">Propriedades</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Content Properties */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#432818]">Conteúdo</h3>
          
          {selectedBlock.type === 'quiz-question' && (
            <>
              <div>
                <label className="text-sm text-[#8F7A6A]">Pergunta</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded"
                  value={selectedBlock.content.question || ''}
                  onChange={(e) => onUpdate?.({ question: e.target.value })}
                  placeholder="Digite sua pergunta aqui..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#432818]">Cabeçalho</h4>
                <div>
                  <label className="text-sm text-[#8F7A6A]">URL do Logo</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    value={selectedBlock.content.logoUrl || ''}
                    onChange={(e) => onUpdate?.({ logoUrl: e.target.value })}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8F7A6A]">Progresso (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full mt-1 p-2 border rounded"
                    value={selectedBlock.content.progressPercent || 0}
                    onChange={(e) => onUpdate?.({ progressPercent: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8F7A6A]">Botão Voltar</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={selectedBlock.content.showBackButton || false}
                      onChange={(e) => onUpdate?.({ showBackButton: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Mostrar botão voltar</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#432818]">Configurações</h4>
                <div>
                  <label className="text-sm text-[#8F7A6A]">Múltipla Seleção</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={selectedBlock.content.multipleSelection || false}
                      onChange={(e) => onUpdate?.({ multipleSelection: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Permitir múltiplas seleções</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#8F7A6A]">Máximo de Seleções</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full mt-1 p-2 border rounded"
                    value={selectedBlock.content.maxSelections || 3}
                    onChange={(e) => onUpdate?.({ maxSelections: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8F7A6A]">Layout das Opções</label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={selectedBlock.content.optionLayout || 'grid'}
                    onChange={(e) => onUpdate?.({ optionLayout: e.target.value as 'vertical' | 'horizontal' | 'grid' })}
                  >
                    <option value="grid">Grid (2 colunas)</option>
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#8F7A6A]">Mostrar Imagens</label>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={selectedBlock.content.showImages !== false}
                      onChange={(e) => onUpdate?.({ showImages: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Exibir imagens nas opções</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedBlock.type === 'image' && (
            <>
              <div>
                <label className="text-sm text-[#8F7A6A]">URL da Imagem</label>
                <input 
                  type="text"
                  className="w-full mt-1 p-2 border rounded"
                  value={selectedBlock.content.imageUrl || ''}
                  onChange={(e) => onUpdate?.({ imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div>
                <label className="text-sm text-[#8F7A6A]">Texto Alternativo</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded"
                  value={selectedBlock.content.imageAlt || ''}
                  onChange={(e) => onUpdate?.({ imageAlt: e.target.value })}
                  placeholder="Descrição da imagem"
                />
              </div>
            </>
          )}
        </div>

        {/* Style Properties */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#432818]">Estilos</h3>
          <StyleControls
            style={selectedBlock.content.style || {}}
            onUpdate={(newStyle) => {
              onUpdate?.({
                ...selectedBlock.content,
                style: newStyle
              });
            }}
          />
        </div>

        {/* Delete button */}
        <div className="pt-4 border-t">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={onDelete}
          >
            Excluir Componente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
