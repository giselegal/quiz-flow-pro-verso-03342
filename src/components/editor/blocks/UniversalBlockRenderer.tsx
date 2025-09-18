import React from 'react';

export interface BlockProps {
  id?: string;
  type?: string;
  properties?: any;
  children?: React.ReactNode;
  block?: any;
  isSelected?: boolean;
  isPreviewing?: boolean;
  mode?: string;
  onUpdate?: (updates?: any) => void;
  onDelete?: (id?: any) => void;
  onPropertyChange?: (key: any, value: any) => void;
  onClick?: () => void;
}

export interface UniversalBlockRendererProps extends BlockProps {
  // Additional props for Universal Block Renderer
}

export const TextBlock: React.FC<BlockProps> = ({ properties, children }) => (
  <div className="text-block p-2">
    {children || properties?.text || 'Text Block'}
  </div>
);

export const ButtonBlock: React.FC<BlockProps> = ({ properties }) => (
  <button className="btn-block px-4 py-2 bg-blue-500 text-white rounded">
    {properties?.text || 'Button'}
  </button>
);

export const ImageBlock: React.FC<BlockProps> = ({ properties }) => (
  <div className="image-block p-2">
    {properties?.src ? (
      <img src={properties.src} alt={properties.alt || 'Image'} />
    ) : (
      <div className="bg-gray-200 p-4 text-center">Image Placeholder</div>
    )}
  </div>
);

export const FormBlock: React.FC<BlockProps> = ({ properties }) => (
  <div className="form-block p-2">
    <input 
      type={properties?.type || 'text'} 
      placeholder={properties?.placeholder || 'Enter text'} 
      className="border p-2 rounded w-full"
    />
  </div>
);

const UniversalBlockRenderer: React.FC<BlockProps> = ({ type, ...props }) => {
  switch (type) {
    case 'text':
      return <TextBlock {...props} />;
    case 'button':
      return <ButtonBlock {...props} />;
    case 'image':
      return <ImageBlock {...props} />;
    case 'form':
      return <FormBlock {...props} />;
    default:
      return <div className="unknown-block p-2 border">Unknown Block: {type}</div>;
  }
};

export default UniversalBlockRenderer;