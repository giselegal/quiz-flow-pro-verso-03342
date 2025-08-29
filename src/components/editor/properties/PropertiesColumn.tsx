import React, { Suspense } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';

const PropertiesPanel = React.lazy(
  () => import('@/components/editor/properties/PropertiesPanel')
);

export interface PropertiesColumnProps {
  selectedBlock: Block | undefined;
  onUpdate: (updates: Record<string, any>) => void;
  onClose: () => void;
  onDelete: () => void;
  className?: string;
}

export const PropertiesColumn: React.FC<PropertiesColumnProps> = ({
  selectedBlock,
  onUpdate,
  onClose,
  onDelete,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex-shrink-0 h-screen sticky top-0 overflow-y-auto bg-white border-l border-gray-200 flex flex-col',
        'w-[20rem] min-w-[20rem] max-w-[20rem]',
        className
      )}
    >
      {selectedBlock ? (
        <Suspense fallback={<div className="p-4 text-sm text-gray-600">Carregando propriedades…</div>}>
          <PropertiesPanel
            selectedBlock={selectedBlock as any}
            onUpdate={onUpdate}
            onClose={onClose}
            onDelete={onDelete}
          />
        </Suspense>
      ) : (
        <div className="h-full p-6 text-sm text-gray-600">
          Selecione um bloco no canvas para editar suas propriedades.
        </div>
      )}
    </div>
  );
};

export default PropertiesColumn;
