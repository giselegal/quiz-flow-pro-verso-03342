
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CraftTextBlockProps {
  text: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'light';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  lineHeight?: number;
}

export const CraftTextBlock: React.FC<CraftTextBlockProps> = ({
  text = 'Texto de exemplo',
  fontSize = 16,
  fontWeight = 'normal',
  textAlign = 'left',
  color = '#000000',
  lineHeight = 1.5
}) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="relative group"
    >
      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setProp((props: CraftTextBlockProps) => props.text = e.target.innerText)}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          textAlign,
          color,
          lineHeight,
          outline: 'none',
          cursor: 'text'
        }}
        className="min-h-[1.5em] py-2 px-1 rounded hover:bg-gray-50 transition-colors"
      >
        {text}
      </p>
    </div>
  );
};

const CraftTextBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={props.text}
          onChange={(e) => setProp((props: CraftTextBlockProps) => props.text = e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <Input
          id="fontSize"
          type="number"
          value={props.fontSize}
          onChange={(e) => setProp((props: CraftTextBlockProps) => props.fontSize = Number(e.target.value))}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="fontWeight">Peso da Fonte</Label>
        <Select 
          value={props.fontWeight} 
          onValueChange={(value) => setProp((props: CraftTextBlockProps) => props.fontWeight = value as any)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Leve</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Negrito</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="textAlign">Alinhamento</Label>
        <Select 
          value={props.textAlign} 
          onValueChange={(value) => setProp((props: CraftTextBlockProps) => props.textAlign = value as any)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Esquerda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="color">Cor</Label>
        <Input
          id="color"
          type="color"
          value={props.color}
          onChange={(e) => setProp((props: CraftTextBlockProps) => props.color = e.target.value)}
          className="mt-1 h-10"
        />
      </div>
      
      <div>
        <Label htmlFor="lineHeight">Altura da Linha</Label>
        <Input
          id="lineHeight"
          type="number"
          step="0.1"
          value={props.lineHeight}
          onChange={(e) => setProp((props: CraftTextBlockProps) => props.lineHeight = Number(e.target.value))}
          className="mt-1"
        />
      </div>
    </div>
  );
};

CraftTextBlock.craft = {
  displayName: 'Texto',
  props: {
    text: 'Texto de exemplo',
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#000000',
    lineHeight: 1.5
  },
  related: {
    settings: CraftTextBlockSettings
  }
};
