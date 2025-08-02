
import React from 'react';
import { EditableContent } from '@/types/editor';

interface HeaderBlockProps {
  content?: EditableContent;
  onClick?: () => void;
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({ 
  content = {}, 
  onClick 
}) => {
  // Provide safe defaults for all properties
  const safeContent = {
    title: content.title || 'Novo Cabeçalho',
    subtitle: content.subtitle || '',
    logo: content.logo || '',
    logoAlt: content.logoAlt || 'Logo',
    ...content
  };

  return (
    <div 
      className="text-center p-4 border-2 border-dashed border-[#B89B7A]/40 rounded-lg cursor-pointer hover:bg-[#FAF9F7]" 
      onClick={onClick}
    >
      {safeContent.logo && (
        <img 
          src={safeContent.logo} 
          alt={safeContent.logoAlt} 
          className="mx-auto w-36 mb-6" 
        />
      )}
      <h1 className="text-4xl md:text-5xl font-bold text-[#aa6b5d]">
        {safeContent.title}
      </h1>
      {safeContent.subtitle && (
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          {safeContent.subtitle}
        </p>
      )}
    </div>
  );
};
