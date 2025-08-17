import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/editor';
import { Type } from 'lucide-react';
import React from 'react';
import { PropertyInput } from '../components/PropertyInput';
import { PropertySelect } from '../components/PropertySelect';

interface HeaderPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const HeaderPropertyEditor: React.FC<HeaderPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  // Propriedades específicas do header
  const title = block.content?.title || '';
  const subtitle = block.content?.subtitle || '';
  const headerType = block.content?.headerType || 'main';
  const showLogo = block.content?.showLogo || false;
  const showProgress = block.content?.showProgress || false;
  const showNavigation = block.content?.showNavigation || false;

  const handleContentUpdate = (field: string, value: any) => {
    const updates = {
      content: {
        ...block.content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  const headerTypeOptions = [
    { value: 'main', label: 'Principal' },
    { value: 'section', label: 'Seção' },
    { value: 'hero', label: 'Hero' },
  ];

  if (isPreviewMode) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className={`space-y-1 ${headerType === 'hero' ? 'text-center' : ''}`}>
          <h2
            className={`font-bold ${
              headerType === 'hero' ? 'text-2xl' : headerType === 'section' ? 'text-xl' : 'text-lg'
            } text-[#6B4F43]`}
          >
            {title || 'Título do Header'}
          </h2>
          {subtitle && <p className="text-[#8B7355] text-sm">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="h-5 w-5 text-[#B89B7A]" />
          Propriedades do Header
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <PropertyInput
          label="Título"
          value={title}
          onChange={value => handleContentUpdate('title', value)}
          required={true}
          placeholder="Digite o título principal..."
        />

        <PropertyInput
          label="Subtítulo"
          value={subtitle}
          onChange={value => handleContentUpdate('subtitle', value)}
          placeholder="Digite o subtítulo (opcional)..."
        />

        <PropertySelect
          label="Tipo do Header"
          value={headerType}
          options={headerTypeOptions}
          onChange={value => handleContentUpdate('headerType', value)}
        />

        {/* Configurações Avançadas */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Elementos de Interface</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showLogo">Mostrar Logo</Label>
              <p className="text-sm text-gray-500">Exibe o logo do quiz no header</p>
            </div>
            <Switch
              id="showLogo"
              checked={showLogo}
              onCheckedChange={checked => handleContentUpdate('showLogo', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showProgress">Mostrar Progresso</Label>
              <p className="text-sm text-gray-500">Exibe a barra de progresso do quiz</p>
            </div>
            <Switch
              id="showProgress"
              checked={showProgress}
              onCheckedChange={checked => handleContentUpdate('showProgress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showNavigation">Mostrar Navegação</Label>
              <p className="text-sm text-gray-500">Exibe botões de navegação (anterior/próximo)</p>
            </div>
            <Switch
              id="showNavigation"
              checked={showNavigation}
              onCheckedChange={checked => handleContentUpdate('showNavigation', checked)}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-[#6B4F43] mb-2">Preview:</h4>
          <div className={`space-y-1 ${headerType === 'hero' ? 'text-center' : ''}`}>
            <h2
              className={`font-bold ${
                headerType === 'hero'
                  ? 'text-2xl'
                  : headerType === 'section'
                    ? 'text-xl'
                    : 'text-lg'
              } text-[#6B4F43]`}
            >
              {title || 'Título do Header'}
            </h2>
            {subtitle && <p className="text-[#8B7355] text-sm">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
