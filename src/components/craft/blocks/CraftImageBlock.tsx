
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CraftImageBlockProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export const CraftImageBlock: React.FC<CraftImageBlockProps> = ({
  src = 'https://via.placeholder.com/400x200',
  alt = 'Imagem',
  width = 400,
  height = 200
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="relative group"
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full h-auto rounded"
      />
    </div>
  );
};

const CraftImageBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="src">URL da Imagem</Label>
        <Input
          id="src"
          value={props.src}
          onChange={(e) => setProp((props: CraftImageBlockProps) => props.src = e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="alt">Texto Alternativo</Label>
        <Input
          id="alt"
          value={props.alt}
          onChange={(e) => setProp((props: CraftImageBlockProps) => props.alt = e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="width">Largura</Label>
        <Input
          id="width"
          type="number"
          value={props.width}
          onChange={(e) => setProp((props: CraftImageBlockProps) => props.width = Number(e.target.value))}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="height">Altura</Label>
        <Input
          id="height"
          type="number"
          value={props.height}
          onChange={(e) => setProp((props: CraftImageBlockProps) => props.height = Number(e.target.value))}
          className="mt-1"
        />
      </div>
    </div>
  );
};

(CraftImageBlock as any).craft = {
  displayName: 'Imagem',
  props: {
    src: 'https://via.placeholder.com/400x200',
    alt: 'Imagem',
    width: 400,
    height: 200
  },
  related: {
    settings: CraftImageBlockSettings
  }
};
