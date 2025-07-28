import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface CraftHeadingBlockProps {
  text: string;
  level: number;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

export const CraftHeadingBlock: React.FC<CraftHeadingBlockProps> = ({
  text = 'Título de Exemplo',
  level = 1,
  textAlign = 'left',
  color = '#000000'
}) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();

  const HeadingTag = `h${level}` as keyof React.ReactHTML;

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group"
    >
      <HeadingTag
        style={{
          textAlign,
          color,
          outline: 'none',
          cursor: 'text'
        }}
        className="min-h-[1.5em] py-2 px-1 rounded hover:bg-gray-50 transition-colors"
      >
        {text}
      </HeadingTag>
    </div>
  );
};

const CraftHeadingBlockSettings = () => {
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
          onChange={(e) => setProp((props: CraftHeadingBlockProps) => props.text = e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="level">Nível do Título</Label>
        <Select 
          value={props.level.toString()} 
          onValueChange={(value) => setProp((props: CraftHeadingBlockProps) => props.level = Number(value))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="textAlign">Alinhamento</Label>
        <Select 
          value={props.textAlign} 
          onValueChange={(value) => setProp((props: CraftHeadingBlockProps) => props.textAlign = value as any)}
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
          onChange={(e) => setProp((props: CraftHeadingBlockProps) => props.color = e.target.value)}
          className="mt-1 h-10"
        />
      </div>
    </div>
  );
};

(CraftHeadingBlock as any).craft = {
  displayName: 'Título',
  props: {
    text: 'Título de Exemplo',
    level: 1,
    textAlign: 'left',
    color: '#000000'
  },
  related: {
    settings: CraftHeadingBlockSettings
  }
};
