import React, { useState } from 'react';
import { StyleResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Edit, Eye, EyeOff, Save, Refresh } from 'lucide-react';
import { ResultPageConfig, Section, OfferSection, MentorSection } from '@/types/resultPageConfig';
import { EditableSection } from './EditableSection';
import { EditSectionOverlay } from './EditSectionOverlay';
import { toast } from '@/components/ui/use-toast';

interface ResultPageEditorProps {
  selectedStyle: StyleResult;
}

export const ResultPageEditor: React.FC<ResultPageEditorProps> = ({ selectedStyle }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const {
    resultPageConfig,
    updateSection,
    saveConfig,
    resetConfig,
    importConfig,
    loading
  } = useResultPageConfig(selectedStyle.category);

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSectionEdit = (sectionKey: string) => {
    setActiveSection(sectionKey);
  };

  const handleSectionSave = (sectionKey: string, data: any) => {
    updateSection(sectionKey, data);
    setActiveSection(null);
  };

  const handleConfigUpdate = (newConfig: ResultPageConfig) => {
    importConfig(newConfig);
  };

  const handleConfigSave = () => {
    saveConfig();
  };

  // Safe access to config properties with defaults
  const getConfigValue = (path: string): any => {
    const parts = path.split('.');
    let current: any = resultPageConfig;
    
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return {};
      }
    }
    
    return current || {};
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  const sectionTitles = {
    header: 'Cabeçalho',
    mainContent: 'Conteúdo Principal',
    secondaryStyles: 'Estilos Secundários',
    'offer.hero': 'Oferta Principal',
    'offer.products': 'Produtos',
    'offer.benefits': 'Benefícios',
    'offer.pricing': 'Preço',
    'offer.testimonials': 'Depoimentos',
    'offer.guarantee': 'Garantia',
  };

  const getSectionTitle = (sectionKey: string) => {
    return sectionTitles[sectionKey] || sectionKey;
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleResetConfig = () => {
    resetConfig();
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram redefinidas para o padrão.",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Editor da Página de Resultados</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={togglePreviewMode}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Editar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </>
            )}
          </Button>
          <Button onClick={handleConfigSave} className="bg-[#B89B7A] hover:bg-[#A38A69]">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button variant="destructive" onClick={handleResetConfig}>
            <Refresh className="w-4 h-4 mr-2" />
            Resetar
          </Button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6">
        {!isPreviewMode ? (
          <div className="space-y-8">
            {/* Header Section */}
            <EditableSection
              title="Cabeçalho"
              sectionPath="header"
              content={getConfigValue('header.content')}
              style={getConfigValue('header.style')}
              visible={getConfigValue('header.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('header')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />

            {/* Main Content Section */}
            <EditableSection
              title="Conteúdo Principal"
              sectionPath="mainContent"
              content={getConfigValue('mainContent.content')}
              style={getConfigValue('mainContent.style')}
              visible={getConfigValue('mainContent.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('mainContent')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />

            {/* Secondary Styles Section */}
            {getConfigValue('secondaryStyles') && (
              <EditableSection
                title="Estilos Secundários"
                sectionPath="secondaryStyles"
                content={getConfigValue('secondaryStyles.content')}
                style={getConfigValue('secondaryStyles.style')}
                visible={getConfigValue('secondaryStyles.visible') !== false}
                isPreview={false}
                onEdit={() => handleSectionEdit('secondaryStyles')}
                onToggleVisibility={() => {}}
                onStyleEdit={() => {}}
                primaryStyle={selectedStyle}
              />
            )}

            {/* Offer Sections */}
            <EditableSection
              title="Oferta Principal"
              sectionPath="offer.hero"
              content={getConfigValue('offer.hero.content')}
              style={getConfigValue('offer.hero.style')}
              visible={getConfigValue('offer.hero.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('offer.hero')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />

            <EditableSection
              title="Produtos"
              sectionPath="offer.products"
              content={getConfigValue('offer.products.content')}
              style={getConfigValue('offer.products.style')}
              visible={getConfigValue('offer.products.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('offer.products')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />

            <EditableSection
              title="Benefícios"
              sectionPath="offer.benefits"
              content={getConfigValue('offer.benefits.content')}
              style={getConfigValue('offer.benefits.style')}
              visible={getConfigValue('offer.benefits.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('offer.benefits')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />

            <EditableSection
              title="Preço"
              sectionPath="offer.pricing"
              content={getConfigValue('offer.pricing.content')}
              style={getConfigValue('offer.pricing.style')}
              visible={getConfigValue('offer.pricing.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('offer.pricing')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />

            <EditableSection
              title="Depoimentos"
              sectionPath="offer.testimonials"
              content={getConfigValue('offer.testimonials.content')}
              style={getConfigValue('offer.testimonials.style')}
              visible={getConfigValue('offer.testimonials.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('offer.testimonials')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />

            <EditableSection
              title="Garantia"
              sectionPath="offer.guarantee"
              content={getConfigValue('offer.guarantee.content')}
              style={getConfigValue('offer.guarantee.style')}
              visible={getConfigValue('offer.guarantee.visible') !== false}
              isPreview={false}
              onEdit={() => handleSectionEdit('offer.guarantee')}
              onToggleVisibility={() => {}}
              onStyleEdit={() => {}}
              primaryStyle={selectedStyle}
            />
          </div>
        ) : (
          <div>Preview mode content</div>
        )}
      </div>

      {/* Edit Section Overlay */}
      {activeSection && (
        <EditSectionOverlay
          section={activeSection}
          data={getConfigValue(activeSection)}
          onSave={(data) => handleSectionSave(activeSection, data)}
          onCancel={() => setActiveSection(null)}
        />
      )}
    </div>
  );
};
