import React from 'react';

interface CanvasDropZoneProps {
  children?: React.ReactNode;
  onDrop?: (item: any) => void;
  className?: string;
  blocks?: any[];
  onSelectBlock?: (id: string) => void;
  selectedBlockId?: string | null;
  onUpdateBlock?: (id: string, updates: any) => void;
  onDeleteBlock?: (id: string) => void;
  isPreviewing?: boolean;
  scopeId?: number;
}

const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({ 
  children, 
  onDrop, 
  className = '',
  blocks: _blocks = [],
  onSelectBlock: _onSelectBlock,
  selectedBlockId: _selectedBlockId,
  onUpdateBlock: _onUpdateBlock,
  onDeleteBlock: _onDeleteBlock,
  isPreviewing: _isPreviewing,
  scopeId: _scopeId
}) => {
  return (
    <div 
      className={`canvas-drop-zone min-h-96 border-2 border-dashed border-gray-300 p-4 ${className}`}
      onDrop={(e) => {
        e.preventDefault();
        if (onDrop) {
          onDrop({ type: 'dropped' });
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {children || (
        <div className="text-center text-gray-500 py-12">
          <p>Drop components here</p>
        </div>
      )}
    </div>
  );
};

export { CanvasDropZone };
export default CanvasDropZone;