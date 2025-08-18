// @ts-nocheck
/**
 * RichTextBlock - Componente de texto rico usando Quill.js
 *
 * Fornece edição de texto avançada com formatação, listas, links, etc.
 */

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import 'quill/dist/quill.snow.css';

// Importação lazy do ReactQuill

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const ReactQuill = lazy(() => import('react-quill'));

export interface RichTextBlockProps {
  blockId: string;
  content: string;
  onChange: (content: string) => void;
  isEditing?: boolean;
  isSelected?: boolean;
  onEdit?: () => void;
  onSelect?: () => void;
  className?: string;
  minHeight?: number;
  placeholder?: string;
}

// Configuração do toolbar do Quill
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'bullet',
  'align',
  'link',
  'image',
];

export const RichTextBlock: React.FC<RichTextBlockProps> = ({
  blockId,
  content,
  onChange,
  isEditing = false,
  isSelected = false,
  onEdit,
  onSelect,
  className = '',
  minHeight = 100,
  placeholder = 'Clique para selecionar e editar no painel',
}) => {
  const [currentContent, setCurrentContent] = useState(content);

  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  const handleClick = () => {
    onSelect?.();
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const isEmpty = !currentContent || stripHtml(currentContent).trim().length === 0;

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-[#B89B7A] ring-opacity-50' : ''
      } ${className}`}
      onClick={handleClick}
    >
      <div
        className={`rich-text-display cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-4 rounded-md border-2 border-transparent hover:border-gray-200 ${
          isEmpty ? 'text-gray-400 italic' : ''
        }`}
        style={{ minHeight: `${minHeight}px` }}
        dangerouslySetInnerHTML={{
          __html: isEmpty ? placeholder : currentContent,
        }}
      />

      {/* CSS customizado para o Quill */}
      <style>{`
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
        }

        .rich-text-editor .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
          font-family: inherit;
        }

        .rich-text-editor .ql-editor {
          min-height: ${minHeight}px;
          font-size: 14px;
          line-height: 1.5;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: italic;
        }

        .rich-text-display h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .rich-text-display h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
        }

        .rich-text-display h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .rich-text-display p {
          margin-bottom: 1rem;
        }

        .rich-text-display ul, .rich-text-display ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .rich-text-display li {
          margin-bottom: 0.25rem;
        }

        .rich-text-display a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .rich-text-display a:hover {
          color: #1d4ed8;
        }

        .rich-text-display strong {
          font-weight: bold;
        }

        .rich-text-display em {
          font-style: italic;
        }

        .rich-text-display img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
};

export default RichTextBlock;
