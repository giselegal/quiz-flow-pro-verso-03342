import React from 'react';
import { ModularEditor } from '../components/editor/ModularEditor';

// =====================================================================
// 🎯 MODULAR COMPONENTS DEMO - Demonstração dos Componentes Modulares
// =====================================================================

const ModularComponentsDemo: React.FC = () => {
  const initialComponents = [
    {
      id: 'text_1',
      type: 'text' as const,
      properties: {
        text: 'Bem-vindo ao Editor Modular',
        size: '2xl',
        weight: 'bold',
        color: '#1a202c',
        align: 'center'
      }
    },
    {
      id: 'text_2',
      type: 'text' as const,
      properties: {
        text: 'Este é um exemplo de texto editável criado com componentes modulares flexíveis. Você pode editar todas as propriedades através do painel lateral.',
        size: 'base',
        weight: 'normal',
        color: '#4a5568',
        align: 'center'
      }
    },
    {
      id: 'image_1',
      type: 'image' as const,
      properties: {
        src: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=400&h=250&fit=crop',
        alt: 'Imagem de demonstração',
        width: 400,
        height: 250,
        objectFit: 'cover',
        rounded: true
      }
    },
    {
      id: 'button_1',
      type: 'button' as const,
      properties: {
        text: 'Botão de Exemplo',
        variant: 'primary',
        size: 'lg',
        fullWidth: false,
        disabled: false
      }
    }
  ];

  const handleComponentsChange = (components: any[]) => {
    console.log('Componentes atualizados:', components);
  };

  return (
    <div className="h-screen bg-gray-100">
      <ModularEditor
        initialComponents={initialComponents}
        onComponentsChange={handleComponentsChange}
      />
    </div>
  );
};

export default ModularComponentsDemo;
