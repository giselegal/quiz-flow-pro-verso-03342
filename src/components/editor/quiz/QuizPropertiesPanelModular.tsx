/**
 * 🎛️ PAINEL DE PROPRIEDADES MODULAR
 * 
 * Editor de propriedades para blocos selecionados
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Settings, Palette, Type, Layout } from 'lucide-react';
import { Block } from '@/types/editor';

interface QuizPropertiesPanelModularProps {
  blockId: string;
  onClose: () => void;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
}

export const QuizPropertiesPanelModular: React.FC<QuizPropertiesPanelModularProps> = ({
  blockId,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');

  // Mock block data - in real implementation, this would come from context
  const blockData: Block = {
    id: blockId,
    type: 'headline',
    order: 0,
    content: {
      title: 'Título do bloco',
      subtitle: 'Subtítulo opcional',
      textAlign: 'center',
      fontSize: '2xl',
      fontWeight: 'bold',
      color: '#333333'
    }
  };

  const tabs = [
    { id: 'content', label: 'Conteúdo', icon: <Type className="h-4 w-4" /> },
    { id: 'style', label: 'Estilo', icon: <Palette className="h-4 w-4" /> },
    { id: 'advanced', label: 'Avançado', icon: <Settings className="h-4 w-4" /> }
  ];

  const handleContentChange = (field: string, value: any) => {
    onUpdate(blockId, {
      content: {
        ...blockData.content,
        [field]: value
      }
    });
  };

  const renderContentTab = () => {
    switch (blockData.type) {
      case 'headline':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={blockData.content.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Digite o título"
              />
            </div>
            
            <div>
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={blockData.content.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                placeholder="Digite o subtítulo (opcional)"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Texto</Label>
              <Textarea
                id="text"
                value={blockData.content.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                placeholder="Digite o texto"
                rows={6}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Propriedades não disponíveis para este tipo de bloco
            </p>
          </div>
        );
    }
  };

  const renderStyleTab = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="textAlign">Alinhamento</Label>
        <select
          id="textAlign"
          value={blockData.content.textAlign || 'left'}
          onChange={(e) => handleContentChange('textAlign', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
        </select>
      </div>

      <div>
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <select
          id="fontSize"
          value={blockData.content.fontSize || 'base'}
          onChange={(e) => handleContentChange('fontSize', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="xs">Muito Pequeno</option>
          <option value="sm">Pequeno</option>
          <option value="base">Normal</option>
          <option value="lg">Grande</option>
          <option value="xl">Muito Grande</option>
          <option value="2xl">Extra Grande</option>
        </select>
      </div>

      <div>
        <Label htmlFor="color">Cor do Texto</Label>
        <Input
          id="color"
          type="color"
          value={blockData.content.color || '#333333'}
          onChange={(e) => handleContentChange('color', e.target.value)}
        />
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-4">
      <div>
        <Label>ID do Bloco</Label>
        <Input value={blockId} disabled />
      </div>

      <div>
        <Label>Tipo do Bloco</Label>
        <Input value={blockData.type} disabled />
      </div>

      <div>
        <Label>Ordem</Label>
        <Input
          type="number"
          value={blockData.order}
          onChange={(e) => onUpdate(blockId, { order: parseInt(e.target.value) })}
        />
      </div>
    </div>
  );

  return (
    <div className="w-80 border-l bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Propriedades</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="p-4 border-b">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="gap-2"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'style' && renderStyleTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>
      </ScrollArea>
    </div>
  );
};