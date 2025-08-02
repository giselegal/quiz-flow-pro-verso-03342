
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StyleResult } from '@/types/quiz';
import { ResultPageConfig, Section } from '@/types/resultPageConfig';
import { Eye, EyeOff, Save, Settings } from 'lucide-react';

interface ResultPageEditorProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

export const ResultPageEditor: React.FC<ResultPageEditorProps> = ({
  primaryStyle,
  secondaryStyles
}) => {
  const [config, setConfig] = useState<ResultPageConfig>({
    styleType: primaryStyle.category,
    header: {
      visible: true,
      content: {
        title: `Seu estilo é ${primaryStyle.category}`
      },
      style: {}
    },
    mainContent: {
      visible: true,
      content: {
        description: `Descrição do estilo ${primaryStyle.category}`
      },
      style: {}
    },
    offer: {
      hero: {
        visible: true,
        content: {
          title: "Oferta Especial",
          subtitle: "Descubra mais sobre seu estilo"
        },
        style: {}
      },
      benefits: {
        visible: true,
        content: {},
        style: {}
      },
      products: {
        visible: true,
        content: {},
        style: {}
      },
      pricing: {
        visible: true,
        content: {},
        style: {}
      },
      testimonials: {
        visible: true,
        content: {},
        style: {}
      },
      guarantee: {
        visible: true,
        content: {},
        style: {}
      }
    },
    blocks: []
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const updateSection = (sectionPath: string, updates: Partial<Section>) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const pathParts = sectionPath.split('.');
      
      let current: any = newConfig;
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      const lastKey = pathParts[pathParts.length - 1];
      current[lastKey] = { ...current[lastKey], ...updates };
      
      return newConfig;
    });
  };

  const toggleVisibility = (sectionPath: string, visible: boolean) => {
    updateSection(sectionPath, { visible });
  };

  const updateContent = (sectionPath: string, content: any) => {
    updateSection(sectionPath, { content });
  };

  const handleSave = () => {
    localStorage.setItem(`result_config_${primaryStyle.category}`, JSON.stringify(config));
    console.log('Configuração salva:', config);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-playfair text-[#432818]">
          Editor - {primaryStyle.category}
        </h1>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Editar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </>
            )}
          </Button>
          
          <Button onClick={handleSave} className="bg-[#B89B7A] hover:bg-[#A38A69]">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#432818]">Cabeçalho</h3>
            <Switch
              checked={config.header.visible}
              onCheckedChange={(visible: boolean) => toggleVisibility('header', visible)}
            />
          </div>
          
          {config.header.visible && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="header-title">Título</Label>
                <Input
                  id="header-title"
                  value={config.header.content.title || ''}
                  onChange={(e) => updateContent('header', { 
                    ...config.header.content, 
                    title: e.target.value 
                  })}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Main Content Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#432818]">Conteúdo Principal</h3>
            <Switch
              checked={config.mainContent.visible}
              onCheckedChange={(visible: boolean) => toggleVisibility('mainContent', visible)}
            />
          </div>
          
          {config.mainContent.visible && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="main-description">Descrição</Label>
                <Textarea
                  id="main-description"
                  value={config.mainContent.content.description || ''}
                  onChange={(e) => updateContent('mainContent', { 
                    ...config.mainContent.content, 
                    description: e.target.value 
                  })}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Offer Hero Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#432818]">Seção de Oferta - Hero</h3>
            <Switch
              checked={config.offer.hero.visible}
              onCheckedChange={(visible: boolean) => toggleVisibility('offer.hero', visible)}
            />
          </div>
          
          {config.offer.hero.visible && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="offer-title">Título da Oferta</Label>
                <Input
                  id="offer-title"
                  value={config.offer.hero.content.title || ''}
                  onChange={(e) => updateContent('offer.hero', { 
                    ...config.offer.hero.content, 
                    title: e.target.value 
                  })}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Benefits Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#432818]">Benefícios</h3>
            <Switch
              checked={config.offer.benefits.visible}
              onCheckedChange={(visible: boolean) => toggleVisibility('offer.benefits', visible)}
            />
          </div>
          
          {config.offer.benefits.visible && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="benefits-content">Conteúdo dos Benefícios</Label>
                <Textarea
                  id="benefits-content"
                  value={JSON.stringify(config.offer.benefits.content, null, 2)}
                  onChange={(e) => {
                    try {
                      const content = JSON.parse(e.target.value);
                      updateContent('offer.benefits', content);
                    } catch (error) {
                      // Invalid JSON, ignore
                    }
                  }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Products Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#432818]">Produtos</h3>
            <Switch
              checked={config.offer.products.visible}
              onCheckedChange={(visible: boolean) => toggleVisibility('offer.products', visible)}
            />
          </div>
          
          {config.offer.products.visible && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="products-content">Conteúdo dos Produtos</Label>
                <Textarea
                  id="products-content"
                  value={JSON.stringify(config.offer.products.content, null, 2)}
                  onChange={(e) => {
                    try {
                      const content = JSON.parse(e.target.value);
                      updateContent('offer.products', content);
                    } catch (error) {
                      // Invalid JSON, ignore
                    }
                  }}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResultPageEditor;
