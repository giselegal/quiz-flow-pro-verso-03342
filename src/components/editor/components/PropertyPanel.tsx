
import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface PropertyPanelProps {
  selectedComponent: any | null;
  onChange: (updatedComponent: any) => void;
}

export default function PropertyPanel({ 
  selectedComponent,
  onChange 
}: PropertyPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="mb-4 text-4xl">🎯</div>
        <h3 className="mb-2 font-medium">Propriedades</h3>
        <p className="text-sm">Selecione um componente para editar suas propriedades</p>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    const updated = {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    };
    onChange(updated);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Propriedades</h3>
      
      <div>
        <Label htmlFor="component-type">Tipo</Label>
        <div className="mt-1 rounded border bg-gray-50 p-2 text-sm capitalize">
          {selectedComponent.type || 'Componente'}
        </div>
      </div>

      <div>
        <Label htmlFor="component-id">ID</Label>
        <Input 
          id="component-id"
          type="text" 
          value={selectedComponent.id || ''}
          onChange={(e) => onChange({...selectedComponent, id: e.target.value})}
          placeholder="ID único do componente"
        />
      </div>

      {/* Propriedades específicas para texto */}
      {(selectedComponent.type === 'heading' || selectedComponent.type === 'paragraph' || selectedComponent.type === 'button') && (
        <div>
          <Label htmlFor="component-text">Texto</Label>
          <Textarea 
            id="component-text"
            value={selectedComponent.props?.text || ''}
            onChange={(e) => updateProperty('text', e.target.value)}
            placeholder="Digite o texto aqui"
          />
        </div>
      )}

      {/* Propriedades específicas para heading */}
      {selectedComponent.type === 'heading' && (
        <div>
          <Label htmlFor="heading-level">Nível do Título</Label>
          <Select 
            value={selectedComponent.props?.level?.toString() || '1'}
            onValueChange={(value) => updateProperty('level', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1 - Título Principal</SelectItem>
              <SelectItem value="2">H2 - Subtítulo</SelectItem>
              <SelectItem value="3">H3 - Título Menor</SelectItem>
              <SelectItem value="4">H4 - Título Pequeno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Propriedades específicas para button */}
      {selectedComponent.type === 'button' && (
        <div>
          <Label htmlFor="button-variant">Estilo do Botão</Label>
          <Select 
            value={selectedComponent.props?.variant || 'primary'}
            onValueChange={(value) => updateProperty('variant', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primário</SelectItem>
              <SelectItem value="secondary">Secundário</SelectItem>
              <SelectItem value="outline">Contorno</SelectItem>
              <SelectItem value="ghost">Fantasma</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Propriedades específicas para image */}
      {selectedComponent.type === 'image' && (
        <>
          <div>
            <Label htmlFor="image-src">URL da Imagem</Label>
            <Input 
              id="image-src"
              type="url" 
              value={selectedComponent.props?.src || ''}
              onChange={(e) => updateProperty('src', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          <div>
            <Label htmlFor="image-alt">Texto Alternativo</Label>
            <Input 
              id="image-alt"
              type="text" 
              value={selectedComponent.props?.alt || ''}
              onChange={(e) => updateProperty('alt', e.target.value)}
              placeholder="Descrição da imagem"
            />
          </div>
        </>
      )}
    </div>
  );
}
