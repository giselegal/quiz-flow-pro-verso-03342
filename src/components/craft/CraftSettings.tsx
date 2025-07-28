
import React from 'react';
import { useEditor } from '@craftjs/core';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export const CraftSettings: React.FC = () => {
  const { selected, actions, query } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').last();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related?.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      };
    }

    return {
      selected
    };
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Propriedades</h2>
        {selected && (
          <p className="text-sm text-gray-600 mt-1">
            Editando: {selected.name}
          </p>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {selected ? (
          <div className="space-y-4">
            {/* Renderizar configurações do componente selecionado */}
            {selected.settings && React.createElement(selected.settings)}
            
            {/* Botão para deletar */}
            {selected.isDeletable && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => actions.delete(selected.id)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar Componente
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Selecione um componente para editar suas propriedades</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
