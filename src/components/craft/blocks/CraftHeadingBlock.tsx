
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CraftHeadingBlockProps {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  marginTop?: number;
  marginBottom?: number;
}

export const CraftHeadingBlock: React.FC<CraftHeadingBlockProps> = ({
  text = 'Cabeçalho',
  level = 2,
  textAlign = 'left',
  color = '#000000',
  marginTop = 0,
  marginBottom = 16
}) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const getFontSize = () => {
    const sizes = {
      1: '2.5rem',
      2: '2rem',
      3: '1.75rem',
      4: '1.5rem',
      5: '1.25rem',
      6: '1rem'
    };
    return sizes[level];
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group"
      style={{
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`
      }}
    >
      <HeadingTag
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const target = e.target as HTMLElement;
          setProp((props: CraftHeadingBlockProps) => props.text = target.innerText);
        }}
        style={{
          fontSize: getFontSize(),
          fontWeight: 'bold',
          textAlign,
          color,
          outline: 'none',
          cursor: 'text'
        }}
        className="min-h-[1.2em] py-2 px-1 rounded hover:bg-gray-50 transition-colors"
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
        <Label htmlFor="text">Texto do Cabeçalho</Label>
        <Input
          id="text"
          value={props.text}
          onChange={(e) => setProp((props: CraftHeadingBlockProps) => props.text = e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="level">Nível do Cabeçalho</Label>
        <Select 
          value={props.level.toString()} 
          onValueChange={(value) => setProp((props: CraftHeadingBlockProps) => props.level = Number(value) as any)}
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
      
      <div>
        <Label htmlFor="marginTop">Margem Superior</Label>
        <Input
          id="marginTop"
          type="number"
          value={props.marginTop}
          onChange={(e) => setProp((props: CraftHeadingBlockProps) => props.marginTop = Number(e.target.value))}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="marginBottom">Margem Inferior</Label>
        <Input
          id="marginBottom"
          type="number"
          value={props.marginBottom}
          onChange={(e) => setProp((props: CraftHeadingBlockProps) => props.marginBottom = Number(e.target.value))}
          className="mt-1"
        />
      </div>
    </div>
  );
};

(CraftHeadingBlock as any).craft = {
  displayName: 'Cabeçalho',
  props: {
    text: 'Cabeçalho',
    level: 2,
    textAlign: 'left',
    color: '#000000',
    marginTop: 0,
    marginBottom: 16
  },
  related: {
    settings: CraftHeadingBlockSettings
  }
};
