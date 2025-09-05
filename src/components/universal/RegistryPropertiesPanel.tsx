import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { X, Plus, Trash2, Upload, GripVertical } from 'lucide-react';
import { blocksRegistry } from '@/core/blocks/registry';

interface RegistryPropertiesPanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}


// ✅ Advanced Options Array Editor for Quiz Options
interface OptionsArrayEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  label: string;
}

const OptionsArrayEditor: React.FC<OptionsArrayEditorProps> = ({ value = [], onChange, label }) => {
  const handleAddOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: 'Nova opção',
      description: 'Descrição da nova opção',
      imageUrl: 'https://via.placeholder.com/256x256',
      value: `option-${value.length + 1}`,
      category: 'Categoria',
      points: 1,
    };
    onChange([...value, newOption]);
  };

  const handleUpdateOption = (index: number, updates: any) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], ...updates };
    onChange(newValue);
  };

  const handleRemoveOption = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < value.length) {
      const newValue = [...value];
      [newValue[index], newValue[newIndex]] = [newValue[newIndex], newValue[index]];
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Quick Config */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
            📝 {label} ({value.length} opções)
          </h4>
          <Button onClick={handleAddOption} size="sm" className="text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Adicionar Opção
          </Button>
        </div>

        {/* Quick Configuration */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-700">Preset</label>
            <Select defaultValue="custom">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">🎨 Personalizado</SelectItem>
                <SelectItem value="style-quiz">👗 Quiz de Estilo</SelectItem>
                <SelectItem value="multiple-choice">☑️ Múltipla Escolha</SelectItem>
                <SelectItem value="rating">⭐ Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-blue-700">Tipo de Conteúdo</label>
            <Select defaultValue="image-text">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image-text">🖼️ Imagem + Texto</SelectItem>
                <SelectItem value="text-only">📝 Apenas Texto</SelectItem>
                <SelectItem value="image-only">📷 Apenas Imagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              onClick={() => {
                const sampleOptions = [
                  { id: '1', text: 'Opção A', description: 'Primeira opção', imageUrl: 'https://via.placeholder.com/256', value: 'a', category: 'Categoria A', points: 1 },
                  { id: '2', text: 'Opção B', description: 'Segunda opção', imageUrl: 'https://via.placeholder.com/256', value: 'b', category: 'Categoria B', points: 2 },
                  { id: '3', text: 'Opção C', description: 'Terceira opção', imageUrl: 'https://via.placeholder.com/256', value: 'c', category: 'Categoria C', points: 3 },
                  { id: '4', text: 'Opção D', description: 'Quarta opção', imageUrl: 'https://via.placeholder.com/256', value: 'd', category: 'Categoria D', points: 4 },
                ];
                onChange(sampleOptions);
              }}
              variant="outline"
              size="sm"
              className="text-xs w-full"
            >
              🚀 Gerar Exemplo
            </Button>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {value.map((option, index) => (
          <div key={option.id || index} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
            {/* Option Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                <div className="w-6 h-6 bg-blue-500 text-white rounded text-xs flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm font-medium text-gray-700">Opção {index + 1}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => handleMoveOption(index, 'up')}
                  disabled={index === 0}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  ↑
                </Button>
                <Button
                  onClick={() => handleMoveOption(index, 'down')}
                  disabled={index === value.length - 1}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  ↓
                </Button>
                <Button
                  onClick={() => handleRemoveOption(index)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Option Content */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Image Preview */}
                <div className="space-y-2">
                  <Label className="text-xs">Imagem</Label>
                  <div className="relative group">
                    <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                      {option.imageUrl ? (
                        <img src={option.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Upload className="w-6 h-6 mx-auto mb-1" />
                          <span className="text-xs">Imagem</span>
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="URL da imagem..."
                      value={option.imageUrl || ''}
                      onChange={(e) => handleUpdateOption(index, { imageUrl: e.target.value })}
                      className="text-xs mt-1"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="col-span-2 space-y-3">
                  <div>
                    <Label className="text-xs">Texto Principal</Label>
                    <Textarea
                      placeholder="Ex: Natural & Confortável"
                      value={option.text || ''}
                      onChange={(e) => handleUpdateOption(index, { text: e.target.value })}
                      className="text-sm resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      placeholder="Ex: Amo roupas confortáveis e práticas"
                      value={option.description || ''}
                      onChange={(e) => handleUpdateOption(index, { description: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  {/* Quick Settings */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Valor/ID</Label>
                      <Input
                        placeholder="1a"
                        value={option.value || option.id || ''}
                        onChange={(e) => handleUpdateOption(index, { value: e.target.value, id: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Categoria</Label>
                      <Input
                        placeholder="Natural"
                        value={option.category || ''}
                        onChange={(e) => handleUpdateOption(index, { category: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Pontos</Label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={option.points || 1}
                          onChange={(e) => handleUpdateOption(index, { points: parseInt(e.target.value) || 1 })}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm mb-4">Nenhuma opção configurada</p>
            <Button onClick={handleAddOption} size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Adicionar Primeira Opção
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Property Field Renderer
interface PropSchema {
  label: string;
  kind: 'text' | 'number' | 'range' | 'switch' | 'select' | 'color' | 'textarea' | 'url' | 'array';
  default?: any;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  category?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  key?: string;
}


const RegistryPropertiesPanel: React.FC<RegistryPropertiesPanelProps> = ({
  selectedBlock,
  onUpdate: _onUpdate,
  onClose,
  onDelete,
}) => {
  if (!selectedBlock) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-2">🎯</div>
        <p>Selecione um componente para editar suas propriedades</p>
      </div>
    );
  }

  const blockDefinition = blocksRegistry[selectedBlock.type];

  if (!blockDefinition) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-2">❌</div>
        <h3 className="text-lg font-semibold mb-2">Tipo de bloco não suportado</h3>
        <p className="text-gray-600 mb-4">O tipo "{selectedBlock.type}" não foi encontrado no registro</p>
        <Button
          onClick={() => onDelete(selectedBlock.id)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Bloco
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              {blockDefinition.icon || '🧩'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{blockDefinition.title}</h2>
              <p className="text-sm text-gray-500 font-mono">
                {selectedBlock.id.slice(0, 12)}...
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🚧</div>
          <p>Painel de propriedades em desenvolvimento</p>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Sistema de propriedades simplificado
          </div>
          <Button
            onClick={() => onDelete(selectedBlock.id)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistryPropertiesPanel;
