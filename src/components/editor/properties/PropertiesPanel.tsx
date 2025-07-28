
import React from 'react';
import { SimpleComponent } from '@/types/quiz';

export interface PropertiesPanelProps {
  selectedComponent: SimpleComponent;
  onUpdateComponent: (componentId: string, newData: Partial<SimpleComponent>) => void;
  onDeleteComponent: (componentId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent
}) => {
  const handleUpdate = (updates: Partial<SimpleComponent>) => {
    onUpdateComponent(selectedComponent.id, updates);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Properties</h3>
      
      {selectedComponent.type === 'text' && (
        <div>
          <label className="block text-sm font-medium mb-2">Text</label>
          <textarea
            value={selectedComponent.text || ''}
            onChange={(e) => handleUpdate({ text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )}
      
      {selectedComponent.type === 'image' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={selectedComponent.src || ''}
              onChange={(e) => handleUpdate({ src: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Alt Text</label>
            <input
              type="text"
              value={selectedComponent.alt || ''}
              onChange={(e) => handleUpdate({ alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}
      
      {selectedComponent.type === 'button' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Button Text</label>
            <input
              type="text"
              value={selectedComponent.text || ''}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Link URL</label>
            <input
              type="url"
              value={selectedComponent.href || ''}
              onChange={(e) => handleUpdate({ href: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}
      
      <div className="pt-4 border-t">
        <button
          onClick={() => onDeleteComponent(selectedComponent.id)}
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Component
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
