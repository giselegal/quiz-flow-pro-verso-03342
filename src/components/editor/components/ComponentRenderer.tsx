
import React from 'react';
import { Button } from '../../ui/button';

interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface ComponentRendererProps {
  component: Component;
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { type, props } = component;

  switch (type) {
    case 'heading':
      const HeadingTag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag 
          className={`font-bold ${getHeadingClasses(props.level)} ${props.className || ''}`}
          style={props.style}
        >
          {props.text || 'Título'}
        </HeadingTag>
      );

    case 'paragraph':
      return (
        <p 
          className={`text-gray-700 leading-relaxed ${props.className || ''}`}
          style={props.style}
        >
          {props.text || 'Parágrafo de texto.'}
        </p>
      );

    case 'button':
      return (
        <Button
          variant={props.variant || 'default'}
          size={props.size || 'default'}
          className={props.className}
          onClick={(e) => e.preventDefault()}
        >
          {props.text || 'Botão'}
        </Button>
      );

    case 'image':
      return (
        <img
          src={props.src || 'https://via.placeholder.com/400x200'}
          alt={props.alt || 'Imagem'}
          className={`max-w-full h-auto rounded ${props.className || ''}`}
          style={props.style}
        />
      );

    case 'divider':
      return (
        <hr 
          className={`border-gray-300 ${props.className || ''}`}
          style={props.style}
        />
      );

    case 'container':
      return (
        <div
          className={`rounded border-2 border-dashed border-gray-300 min-h-[100px] flex items-center justify-center ${props.className || ''}`}
          style={props.style}
        >
          <span className="text-gray-400">Container - Arraste componentes aqui</span>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-gray-100 rounded border-2 border-dashed">
          <span className="text-gray-500">Componente desconhecido: {type}</span>
        </div>
      );
  }
}

function getHeadingClasses(level: number): string {
  switch (level) {
    case 1: return 'text-4xl';
    case 2: return 'text-3xl';
    case 3: return 'text-2xl';
    case 4: return 'text-xl';
    case 5: return 'text-lg';
    case 6: return 'text-base';
    default: return 'text-4xl';
  }
}
