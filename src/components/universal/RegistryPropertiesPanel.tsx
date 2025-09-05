import React from 'react';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { Textarea } from '@/components/ui/textarea';
// import { Slider } from '@/components/ui/slider';
import { X, Trash2 } from 'lucide-react';
import { blocksRegistry } from '@/core/blocks/registry';

interface RegistryPropertiesPanelProps {
  selectedBlock: any;
  onUpdate: (blockId: string, updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (blockId: string) => void;
}


// ✅ Advanced Options Array Editor for Quiz Options
// (OptionsArrayEditor removido neste painel para simplificar)

// ✅ Property Field Renderer
// Mantido apenas como referência futura
// interface PropSchema { /* removida - não utilizada aqui */ }


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
