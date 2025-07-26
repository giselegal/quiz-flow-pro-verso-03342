import React, { useState } from 'react';
import { AVAILABLE_BLOCKS, getBlocksByCategory, getPopularBlocks } from '../../../src/components/editor/blocks/BlockComponents';
import { BLOCK_REGISTRY, renderBlock } from './BlockRegistry';

export const BlocksDemo: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<string>('heading');
  const [blockProps, setBlockProps] = useState<any>({});

  const popularBlocks = getPopularBlocks();
  const basicBlocks = getBlocksByCategory('basic');
  const quizBlocks = getBlocksByCategory('quiz');

  const handleBlockSelect = (blockType: string) => {
    setSelectedBlock(blockType);
    
    // Set default props based on block type
    const defaultProps: Record<string, any> = {
      'heading': {
        level: 'h1',
        content: 'Este é um Título Personalizado',
        fontSize: 36,
        textColor: '#B89B7A',
        textAlign: 'center'
      },
      'text': {
        content: 'Este é um parágrafo de exemplo que demonstra como o bloco de texto funciona no editor. Você pode personalizar a fonte, cor e alinhamento.',
        fontSize: 18,
        textColor: '#333333',
        textAlign: 'left'
      },
      'button': {
        text: 'Clique Aqui Para Continuar',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        paddingX: 32,
        paddingY: 16,
        borderRadius: 12,
        fullWidth: false
      },
      'image': {
        src: 'https://via.placeholder.com/400x250/B89B7A/ffffff?text=Imagem+de+Exemplo',
        alt: 'Imagem de exemplo',
        width: 400,
        height: 250,
        objectFit: 'cover',
        borderRadius: 12
      },
      'spacer': {
        height: 40,
        backgroundColor: 'transparent',
        borderStyle: 'dashed',
        borderColor: '#B89B7A'
      },
      'quiz-question': {
        questionText: 'Qual é a sua preferência de estilo?',
        questionTextSize: 32,
        questionTextColor: '#432818',
        questionTextAlign: 'center',
        layout: '2-columns',
        options: [
          {
            id: '1',
            text: 'Estilo Clássico',
            imageUrl: 'https://via.placeholder.com/150x150/B89B7A/ffffff?text=Clássico',
            value: 'classic'
          },
          {
            id: '2',
            text: 'Estilo Moderno',
            imageUrl: 'https://via.placeholder.com/150x150/8F7A6A/ffffff?text=Moderno',
            value: 'modern'
          },
          {
            id: '3',
            text: 'Estilo Casual',
            imageUrl: 'https://via.placeholder.com/150x150/432818/ffffff?text=Casual',
            value: 'casual'
          },
          {
            id: '4',
            text: 'Estilo Elegante',
            imageUrl: 'https://via.placeholder.com/150x150/FAF9F7/432818?text=Elegante',
            value: 'elegant'
          }
        ],
        primaryColor: '#B89B7A',
        secondaryColor: '#ffffff',
        borderColor: '#e5e7eb',
        showProgressBar: true,
        progressValue: 40
      }
    };

    setBlockProps(defaultProps[blockType] || {});
  };

  return (
    <div className="blocks-demo p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#432818] mb-2">🧱 Demonstração dos Blocos</h1>
        <p className="text-[#8F7A6A]">
          Teste todos os componentes disponíveis na aba "Blocos" do editor
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar com lista de blocos */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#B89B7A]/20 rounded-lg overflow-hidden">
            {/* Populares */}
            <div className="p-4 border-b border-[#B89B7A]/10">
              <h3 className="font-semibold text-[#432818] mb-3 flex items-center">
                ⭐ Populares
              </h3>
              {popularBlocks.map((block) => (
                <button
                  key={block.type}
                  className={`w-full text-left p-2 rounded mb-1 transition-colors ${
                    selectedBlock === block.type
                      ? 'bg-[#B89B7A] text-white'
                      : 'hover:bg-[#FAF9F7] text-[#8F7A6A]'
                  }`}
                  onClick={() => handleBlockSelect(block.type)}
                >
                  <div className="flex items-center gap-2">
                    <block.icon className="w-4 h-4" />
                    <span className="text-sm">{block.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Básicos */}
            <div className="p-4 border-b border-[#B89B7A]/10">
              <h3 className="font-semibold text-[#432818] mb-3">🔧 Básicos</h3>
              {basicBlocks.map((block) => (
                <button
                  key={block.type}
                  className={`w-full text-left p-2 rounded mb-1 transition-colors ${
                    selectedBlock === block.type
                      ? 'bg-[#B89B7A] text-white'
                      : 'hover:bg-[#FAF9F7] text-[#8F7A6A]'
                  }`}
                  onClick={() => handleBlockSelect(block.type)}
                >
                  <div className="flex items-center gap-2">
                    <block.icon className="w-4 h-4" />
                    <span className="text-sm">{block.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quiz */}
            <div className="p-4">
              <h3 className="font-semibold text-[#432818] mb-3">❓ Quiz</h3>
              {quizBlocks.map((block) => (
                <button
                  key={block.type}
                  className={`w-full text-left p-2 rounded mb-1 transition-colors ${
                    selectedBlock === block.type
                      ? 'bg-[#B89B7A] text-white'
                      : 'hover:bg-[#FAF9F7] text-[#8F7A6A]'
                  }`}
                  onClick={() => handleBlockSelect(block.type)}
                >
                  <div className="flex items-center gap-2">
                    <block.icon className="w-4 h-4" />
                    <span className="text-sm">{block.label}</span>
                    {block.isPro && <span className="text-xs">👑</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-[#B89B7A]/20 rounded-lg">
            {/* Header */}
            <div className="p-4 border-b border-[#B89B7A]/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#432818]">
                  Preview: {AVAILABLE_BLOCKS.find(b => b.type === selectedBlock)?.label}
                </h3>
                <div className="text-sm text-[#8F7A6A]">
                  {AVAILABLE_BLOCKS.find(b => b.type === selectedBlock)?.description}
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-8 min-h-[400px] bg-[#FAF9F7]/30">
              <div className="max-w-4xl mx-auto">
                {renderBlock(selectedBlock, blockProps)}
              </div>
            </div>

            {/* Properties Info */}
            <div className="p-4 border-t border-[#B89B7A]/10 bg-gray-50">
              <h4 className="font-medium text-[#432818] mb-2">Propriedades Configuráveis:</h4>
              <div className="text-sm text-[#8F7A6A] space-y-1">
                {Object.keys(blockProps).map((prop) => (
                  <div key={prop} className="flex">
                    <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded mr-2">
                      {prop}
                    </span>
                    <span>{JSON.stringify(blockProps[prop])}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#B89B7A]/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#B89B7A]">{AVAILABLE_BLOCKS.length}</div>
          <div className="text-sm text-[#8F7A6A]">Total de Blocos</div>
        </div>
        <div className="bg-white border border-[#B89B7A]/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{popularBlocks.length}</div>
          <div className="text-sm text-[#8F7A6A]">Populares</div>
        </div>
        <div className="bg-white border border-[#B89B7A]/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {AVAILABLE_BLOCKS.filter(b => b.isPro).length}
          </div>
          <div className="text-sm text-[#8F7A6A]">Pro Features</div>
        </div>
        <div className="bg-white border border-[#B89B7A]/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Object.keys(BLOCK_REGISTRY).length}
          </div>
          <div className="text-sm text-[#8F7A6A]">Implementados</div>
        </div>
      </div>
    </div>
  );
};
