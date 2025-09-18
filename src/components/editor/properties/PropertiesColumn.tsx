import React from 'react';

interface PropertiesColumnProps {
  children?: React.ReactNode;
  selectedBlock?: any;
  onUpdate?: (updates: any) => void;
  onClose?: () => void;
  onDelete?: () => void;
}

const PropertiesColumn: React.FC<PropertiesColumnProps> = ({ 
  children, 
  selectedBlock,
  onUpdate,
  onClose,
  onDelete 
}) => {
  return (
    <div className="properties-column w-64 bg-white border-l border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        )}
      </div>
      <div className="properties-content">
        {selectedBlock ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Block Type</label>
              <div className="text-sm text-gray-600">{selectedBlock.type || 'Unknown'}</div>
            </div>
            {onUpdate && (
              <div className="space-y-2">
                <button 
                  onClick={() => onUpdate({})} 
                  className="w-full px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Properties
                </button>
                {onDelete && (
                  <button 
                    onClick={onDelete} 
                    className="w-full px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete Block
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          children || (
            <div className="text-center text-gray-500 py-8">
              <p>Select an element to edit properties</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export { PropertiesColumn };
export default PropertiesColumn;