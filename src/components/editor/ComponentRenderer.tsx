
import React from 'react';
import { Block } from '@/types/editor';

interface ComponentRendererProps {
  block: Block;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
  isPreviewMode: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  block,
  isSelected,
  onUpdate,
  isPreviewMode
}) => {
  const renderComponent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div className="p-4">
            <p style={block.properties?.style || {}}>
              {block.properties?.text || 'Sample text'}
            </p>
          </div>
        );
      
      case 'image':
        return (
          <div className="p-4">
            <img
              src={block.properties?.src || '/api/placeholder/400/300'}
              alt={block.properties?.alt || 'Image'}
              className="max-w-full h-auto"
              style={block.properties?.style || {}}
            />
          </div>
        );
      
      case 'button':
        return (
          <div className="p-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              style={block.properties?.style || {}}
            >
              {block.properties?.text || 'Button'}
            </button>
          </div>
        );
      
      case 'header':
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold" style={block.properties?.style || {}}>
              {block.properties?.text || 'Header'}
            </h1>
          </div>
        );
      
      case 'spacer':
        return (
          <div
            className="bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center"
            style={{
              height: block.properties?.height || 40,
              ...block.properties?.style
            }}
          >
            <span className="text-gray-400 text-sm">
              Spacer ({block.properties?.height || 40}px)
            </span>
          </div>
        );
      
      case 'video':
        return (
          <div className="p-4">
            <video
              src={block.properties?.src}
              controls={block.properties?.controls !== false}
              className="w-full"
              style={block.properties?.style || {}}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      default:
        return (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded">
            <p className="text-gray-600">Unknown component: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {renderComponent()}
    </div>
  );
};

export default ComponentRenderer;
