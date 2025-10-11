import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Block } from '@/types/editor';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from "@/components/result/editor/ColorPicker';
import StyleEditor from '../style-editors/StyleEditor';

// Lista de ícones disponíveis
const availableIcons = [
  { name: '✓', label: 'Marca de seleção' },
  { name: '✔', label: 'Marca de verificação' },
  { name: '✅', label: 'Marca de verificação em caixa' },
  { name: '✨', label: 'Brilho' },
  { name: '💎', label: 'Diamante' },
  { name: '🔥', label: 'Fogo' },
  { name: '⭐', label: 'Estrela' },
  { name: '👑', label: 'Coroa' },
  { name: '🎯', label: 'Alvo' },
  { name: '🚀', label: 'Foguete' },
  { name: '📌', label: 'Alfinete' },
  { name: '📊', label: 'Gráfico' },
  { name: '🔍', label: 'Lupa' },
  { name: '🔒', label: 'Cadeado' },
  { name: '❤️', label: 'Coração' },
  { name: '⚡', label: 'Raio' },
  { name: '🔔', label: 'Sino' },
  { name: '📱', label: 'Celular' },
  { name: '💻', label: 'Laptop' },
  { name: '📝', label: 'Nota' },
  { name: '🎁', label: 'Presente' },
  { name: '🏆', label: 'Troféu' },
  { name: '👍', label: 'Joinha' },
  { name: '👉', label: 'Apontar direita' },
  { name: '⏰', label: 'Relógio' },
];

interface IconBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const IconBlockEditor: React.FC<IconBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content || {
    icon: '✓',
    size: '48px',
    color: '#B89B7A',
    style: {},
  };
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = searchTerm
    ? availableIcons.filter(
        item =>
          item.name.includes(searchTerm) ||
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableIcons;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Tabs defaultValue="icon" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="icon" className="flex-1">
              Ícone
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1">
              Aparência
            </TabsTrigger>
          </TabsList>

          <TabsContent value="icon" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iconSearch">Buscar ícone</Label>
              <Input
                id="iconSearch"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Digite para buscar..."
              />
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
              {filteredIcons.map(item => (
                <div
                  key={item.name}
                  className={`cursor-pointer p-2 text-center text-2xl hover:bg-gray-100 rounded ${content.icon === item.name ? 'bg-gray-200' : ''}`}
                  title={item.label}
                  onClick={() => onUpdate({ ...content, icon: item.name })}
                >
                  {item.name}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconText">Ícone selecionado</Label>
              <div style={{ backgroundColor: '#FAF9F7' }}>
                <span
                  style={{
                    fontSize: content.size || '48px',
                    color: content.color || '#B89B7A',
                  }}
                >
                  {content.icon || '✓'}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iconSize">Tamanho do Ícone</Label>
              <Input
                id="iconSize"
                value={content.size || '48px'}
                onChange={e => onUpdate({ ...content, size: e.target.value })}
                placeholder="ex: 48px ou 3rem"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconColor">Cor do Ícone</Label>
              <ColorPicker
                color={content.color || '#B89B7A'}
                onChange={color => onUpdate({ ...content, color })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconTitle">Texto do Ícone (opcional)</Label>
              <Input
                id="iconTitle"
                value={content.title || ''}
                onChange={e => onUpdate({ ...content, title: e.target.value })}
                placeholder="Texto que aparece ao lado ou abaixo do ícone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconPosition">Posição do Texto</Label>
              <select
                id="iconPosition"
                className="w-full p-2 border rounded"
                value={content.position || 'right'}
                onChange={e =>
                  onUpdate({
                    ...content,
                    position: e.target.value as 'top' | 'right' | 'bottom' | 'left',
                  })
                }
              >
                <option value="top">Texto acima</option>
                <option value="right">Texto à direita</option>
                <option value="bottom">Texto abaixo</option>
                <option value="left">Texto à esquerda</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="space-y-2">
        <Label>Estilo do Container</Label>
        <StyleEditor
          style={content.style || {}}
          onUpdate={style => onUpdate({ ...content, style })}
        />
      </div>
    </div>
  );
};

export default IconBlockEditor;
