
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface CraftButtonBlockProps {
  text: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export const CraftButtonBlock: React.FC<CraftButtonBlockProps> = ({
  text = 'Botão',
  variant = 'default',
  size = 'md',
  href = '#'
}) => {
  const { connectors: { connect, drag } } = useNode();

  const handleClick = () => {
    if (href && href !== '#') {
      window.open(href, '_blank');
    }
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group"
    >
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className="cursor-pointer"
      >
        {text}
      </Button>
    </div>
  );
};

const CraftButtonBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Texto do Botão</Label>
        <Input
          id="text"
          value={props.text}
          onChange={(e) => setProp((props: CraftButtonBlockProps) => props.text = e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="variant">Variante</Label>
        <Select 
          value={props.variant} 
          onValueChange={(value) => setProp((props: CraftButtonBlockProps) => props.variant = value as any)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Padrão</SelectItem>
            <SelectItem value="destructive">Destrutivo</SelectItem>
            <SelectItem value="outline">Contorno</SelectItem>
            <SelectItem value="ghost">Fantasma</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="size">Tamanho</Label>
        <Select 
          value={props.size} 
          onValueChange={(value) => setProp((props: CraftButtonBlockProps) => props.size = value as any)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="md">Médio</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="href">Link (URL)</Label>
        <Input
          id="href"
          value={props.href}
          onChange={(e) => setProp((props: CraftButtonBlockProps) => props.href = e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

(CraftButtonBlock as any).craft = {
  displayName: 'Botão',
  props: {
    text: 'Botão',
    variant: 'default',
    size: 'md',
    href: '#'
  },
  related: {
    settings: CraftButtonBlockSettings
  }
};
