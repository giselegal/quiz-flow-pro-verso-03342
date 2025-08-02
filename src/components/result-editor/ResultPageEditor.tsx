
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Save, Eye, EyeOff } from 'lucide-react';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import EditableSection from './EditableSection';
import { StyleResult } from '@/types/quiz';

interface ResultPageEditorProps {
  selectedStyle: StyleResult;
}

const ResultPageEditor: React.FC<ResultPageEditorProps> = ({ selectedStyle }) => {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const { 
    resultPageConfig, 
    updateSection,
    saveConfig,
    resetConfig,
    loading 
  } = useResultPageConfig(selectedStyle.category);

  const handleSectionUpdate = (sectionKey: string, data: any) => {
    updateSection(sectionKey, data);
  };

  const getSectionTitle = (sectionKey: string): string => {
    const sectionTitles: Record<string, string> = {
      header: 'Cabeçalho',
      mainContent: 'Conteúdo Principal',
      secondaryStyles: 'Estilos Secundários',
      'offer.hero': 'Hero da Oferta',
      'offer.products': 'Produtos',
      'offer.benefits': 'Benefícios',
      'offer.pricing': 'Preços',
      'offer.testimonials': 'Depoimentos',
      'offer.guarantee': 'Garantia'
    };
    
    return sectionTitles[sectionKey] || sectionKey;
  };

  const getSectionData = (sectionKey: string) => {
    const config = resultPageConfig as Record<string, any>;
    if (sectionKey.includes('.')) {
      const [parent, child] = sectionKey.split('.');
      return config[parent]?.[child];
    }
    return config[sectionKey];
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Editor da Página de Resultado</h1>
            <p className="text-gray-600">Estilo: {selectedStyle.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewing(!isPreviewing)}
            >
              {isPreviewing ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewing ? 'Editar' : 'Visualizar'}
            </Button>
            <Button
              variant="outline"
              onClick={resetConfig}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <Button onClick={saveConfig}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Section */}
          <Card>
            <CardHeader>
              <CardTitle>Cabeçalho</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableSection
                title="Cabeçalho"
                isVisible={resultPageConfig.header?.visible ?? true}
                content={resultPageConfig.header?.content ?? {}}
                onToggleVisibility={(visible) => 
                  updateSection('header', { 
                    ...resultPageConfig.header, 
                    visible 
                  })
                }
                onContentChange={(content) => 
                  updateSection('header', { 
                    ...resultPageConfig.header, 
                    content 
                  })
                }
              />
            </CardContent>
          </Card>

          {/* Main Content Section */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableSection
                title="Conteúdo Principal"
                isVisible={resultPageConfig.mainContent?.visible ?? true}
                content={resultPageConfig.mainContent?.content ?? {}}
                onToggleVisibility={(visible) => 
                  updateSection('mainContent', { 
                    ...resultPageConfig.mainContent, 
                    visible 
                  })
                }
                onContentChange={(content) => 
                  updateSection('mainContent', { 
                    ...resultPageConfig.mainContent, 
                    content 
                  })
                }
              />
            </CardContent>
          </Card>

          {/* Secondary Styles Section */}
          {resultPageConfig.secondaryStyles && (
            <Card>
              <CardHeader>
                <CardTitle>Estilos Secundários</CardTitle>
              </CardHeader>
              <CardContent>
                <EditableSection
                  title="Estilos Secundários"
                  isVisible={resultPageConfig.secondaryStyles.visible ?? true}
                  content={resultPageConfig.secondaryStyles.content ?? {}}
                  onToggleVisibility={(visible) => 
                    updateSection('secondaryStyles', { 
                      ...resultPageConfig.secondaryStyles, 
                      visible 
                    })
                  }
                  onContentChange={(content) => 
                    updateSection('secondaryStyles', { 
                      ...resultPageConfig.secondaryStyles, 
                      content 
                    })
                  }
                />
              </CardContent>
            </Card>
          )}

          {/* Offer Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Seções da Oferta</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableSection
                title="Hero da Oferta"
                isVisible={resultPageConfig.offer?.hero?.visible ?? true}
                content={resultPageConfig.offer?.hero?.content ?? {}}
                onToggleVisibility={(visible) => 
                  updateSection('offer', { 
                    ...resultPageConfig.offer, 
                    hero: { ...resultPageConfig.offer?.hero, visible }
                  })
                }
                onContentChange={(content) => 
                  updateSection('offer', { 
                    ...resultPageConfig.offer, 
                    hero: { ...resultPageConfig.offer?.hero, content }
                  })
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableSection
                title="Produtos"
                isVisible={resultPageConfig.offer?.products?.visible ?? true}
                content={resultPageConfig.offer?.products?.content ?? {}}
                onToggleVisibility={(visible) => 
                  updateSection('offer', { 
                    ...resultPageConfig.offer, 
                    products: { ...resultPageConfig.offer?.products, visible }
                  })
                }
                onContentChange={(content) => 
                  updateSection('offer', { 
                    ...resultPageConfig.offer, 
                    products: { ...resultPageConfig.offer?.products, content }
                  })
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultPageEditor;
