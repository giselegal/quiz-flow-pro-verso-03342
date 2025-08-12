// @ts-nocheck
/**
 * Demonstração do Sistema Modernizado de Componentes
 *
 * Este arquivo mostra como usar os novos componentes criados
 */

import React, { useState } from 'react';
import { ModernPropertyPanel } from '@/components/editor/ModernPropertyPanel';
import { Block } from '@/hooks/useBlockForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Dados de exemplo para teste
const sampleBlocks: Block[] = [
  {
    id: 'text-1',
    type: 'text',
    properties: {
      content: 'Este é um texto de exemplo',
      fontSize: 16,
      textColor: '#000000',
      textAlign: 'left',
    },
  },
  {
    id: 'button-1',
    type: 'button',
    properties: {
      text: 'Clique Aqui',
      link: 'https://exemplo.com',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      paddingX: 16,
      paddingY: 8,
      borderRadius: 6,
      fullWidth: false,
    },
  },
  {
    id: 'quiz-step-1',
    type: 'quiz-step',
    properties: {
      headerEnabled: true,
      logoUrl: '',
      showProgressBar: true,
      showBackButton: true,
      questionText: 'Qual é sua cor favorita?',
      questionTextColor: '#000000',
      questionTextSize: 24,
      questionTextAlign: 'center',
      layout: '2-columns',
      direction: 'vertical',
      disposition: 'image-text',
      options: [
        { id: '1', text: 'Azul', imageUrl: '', value: 'blue' },
        { id: '2', text: 'Vermelho', imageUrl: '', value: 'red' },
        { id: '3', text: 'Verde', imageUrl: '', value: 'green' },
      ],
      isMultipleChoice: false,
      isRequired: true,
      autoProceed: false,
      borderRadius: 'medium',
      boxShadow: 'medium',
      spacing: 'medium',
      detail: 'none',
      optionStyle: 'card',
      primaryColor: '#3b82f6',
      secondaryColor: '#ffffff',
      borderColor: '#e5e7eb',
      maxWidth: 100,
    },
  },
];

export function ComponentsDemo() {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(sampleBlocks[0]);
  const [blocks, setBlocks] = useState<Block[]>(sampleBlocks);

  const handleBlockUpdate = (updates: Partial<Block>) => {
    if (!selectedBlock) return;

    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === selectedBlock.id ? { ...block, ...updates } : block))
    );

    // Atualiza o selectedBlock também
    setSelectedBlock(prev => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <div className="h-screen flex">
      {/* Lista de Blocos */}
      <div style={{ borderColor: '#E5DDD5' }}>
        <div className="space-y-4">
          <div>
            <h2 style={{ color: '#432818' }}>Demo - Sistema Modernizado</h2>
            <p style={{ color: '#6B4F43' }}>
              Teste os novos componentes criados com Shadcn UI + React Hook Form + Zod
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 style={{ color: '#6B4F43' }}>Blocos Disponíveis</h3>
            {blocks.map(block => (
              <Card
                key={block.id}
                className={`cursor-pointer transition-all ${
                  selectedBlock?.id === block.id ? 'ring-2 ring-[#B89B7A]' : ''
                }`}
                onClick={() => setSelectedBlock(block)}
              >
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{block.type}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {block.id}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {getBlockDescription(block)}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 style={{ color: '#6B4F43' }}>Funcionalidades</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Validação em tempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Debounce automático</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Componentes Shadcn UI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>TypeScript + Zod</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel de Propriedades Modernizado */}
      <div className="flex-1">
        <ModernPropertyPanel selectedBlock={selectedBlock} onUpdate={handleBlockUpdate} />
      </div>

      {/* Preview (opcional) */}
      <div style={{ borderColor: '#E5DDD5' }}>
        <div className="space-y-4">
          <h3 style={{ color: '#432818' }}>Preview</h3>

          {selectedBlock && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{selectedBlock.type} Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <pre style={{ backgroundColor: '#E5DDD5' }}>
                    {JSON.stringify(selectedBlock.properties, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          <div style={{ color: '#8B7355' }}>
            <h4 className="font-medium">Status:</h4>
            <div className="space-y-1">
              <div>✅ Schemas Zod criados</div>
              <div>✅ Hook useBlockForm funcionando</div>
              <div>✅ Componentes UI modernizados</div>
              <div>✅ Validação em tempo real</div>
              <div>✅ Painel de propriedades tipado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getBlockDescription(block: Block): string {
  switch (block.type) {
    case 'text':
      return `"${(block.properties.content || '').substring(0, 30)}..."`;
    case 'button':
      return `Botão: "${block.properties.text}"`;
    case 'quiz-step':
      return `Quiz: "${(block.properties.questionText || '').substring(0, 30)}..."`;
    default:
      return 'Bloco personalizado';
  }
}

export default ComponentsDemo;
