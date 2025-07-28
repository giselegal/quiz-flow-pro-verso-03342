
import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CraftQuizStartBlockProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  showImage?: boolean;
  imageUrl?: string;
  backgroundColor?: string;
}

export const CraftQuizStartBlock: React.FC<CraftQuizStartBlockProps> = ({
  title = 'Bem-vindo ao Quiz!',
  subtitle = 'Descubra mais sobre você',
  description = 'Este quiz irá ajudá-lo a descobrir aspectos importantes sobre sua personalidade.',
  buttonText = 'Iniciar Quiz',
  showImage = false,
  imageUrl = 'https://via.placeholder.com/400x200',
  backgroundColor = '#ffffff'
}) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="relative group w-full"
      style={{ backgroundColor }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          {showImage && imageUrl && (
            <div className="mb-6">
              <img 
                src={imageUrl} 
                alt="Quiz" 
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
          )}
          <CardTitle className="text-3xl font-bold mb-2">{title}</CardTitle>
          {subtitle && (
            <p className="text-xl text-gray-600 mb-4">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent className="text-center">
          {description && (
            <p className="text-gray-700 mb-8 leading-relaxed">{description}</p>
          )}
          <Button size="lg" className="w-full max-w-xs">
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CraftQuizStartBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => setProp((props: CraftQuizStartBlockProps) => props.title = e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          value={props.subtitle}
          onChange={(e) => setProp((props: CraftQuizStartBlockProps) => props.subtitle = e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={props.description}
          onChange={(e) => setProp((props: CraftQuizStartBlockProps) => props.description = e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="buttonText">Texto do Botão</Label>
        <Input
          id="buttonText"
          value={props.buttonText}
          onChange={(e) => setProp((props: CraftQuizStartBlockProps) => props.buttonText = e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="showImage">Mostrar Imagem</Label>
        <input
          id="showImage"
          type="checkbox"
          checked={props.showImage}
          onChange={(e) => setProp((props: CraftQuizStartBlockProps) => props.showImage = e.target.checked)}
          className="mt-1"
        />
      </div>
      
      {props.showImage && (
        <div>
          <Label htmlFor="imageUrl">URL da Imagem</Label>
          <Input
            id="imageUrl"
            value={props.imageUrl}
            onChange={(e) => setProp((props: CraftQuizStartBlockProps) => props.imageUrl = e.target.value)}
            className="mt-1"
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="backgroundColor">Cor de Fundo</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={props.backgroundColor}
          onChange={(e) => setProp((props: CraftQuizStartBlockProps) => props.backgroundColor = e.target.value)}
          className="mt-1 h-10"
        />
      </div>
    </div>
  );
};

CraftQuizStartBlock.craft = {
  displayName: 'Início do Quiz',
  props: {
    title: 'Bem-vindo ao Quiz!',
    subtitle: 'Descubra mais sobre você',
    description: 'Este quiz irá ajudá-lo a descobrir aspectos importantes sobre sua personalidade.',
    buttonText: 'Iniciar Quiz',
    showImage: false,
    imageUrl: 'https://via.placeholder.com/400x200',
    backgroundColor: '#ffffff'
  },
  related: {
    settings: CraftQuizStartBlockSettings
  }
};
