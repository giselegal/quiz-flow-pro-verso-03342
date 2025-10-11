// @ts-nocheck
import React, { useState } from 'react';
import { StyleResult } from '@/types/quiz';
import { Card } from '@/components/ui/card';
import { ResultPageConfig, OfferContent } from '@/types/resultPageConfig';
import { EditSectionOverlay } from './EditSectionOverlay';
import ResultHeader from "../quiz/result-pages/ResultHeader';
import PrimaryStyleCard from "../quiz/result-pages/PrimaryStyleCard';
import SecondaryStylesSection from "../quiz/result-pages/SecondaryStylesSection';
import OfferCard from "../quiz/result-pages/sales/OfferCard';

interface EditableSectionsProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  config: ResultPageConfig;
  onSectionUpdate: (path: string, data: any) => void;
}

export const EditableSections: React.FC<EditableSectionsProps> = ({
  primaryStyle,
  secondaryStyles,
  config,
  onSectionUpdate,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Visitante');

  // Quando o usuário clica para editar uma seção
  const handleEditSection = (sectionKey: string) => {
    setActiveSection(sectionKey);
  };

  // Salvar alterações da seção
  const handleSaveSection = (sectionKey: string, data: any) => {
    onSectionUpdate(sectionKey, data);
    setActiveSection(null);
  };

  // Carregar as configurações da seção ou usar valores padrão
  const headerConfig = config.header?.content || {};
  const primaryStyleConfig = config.mainContent?.content || {};
  const offerConfig = (config.offer?.hero?.content as OfferContent) || {};

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className={activeSection ? 'opacity-50 pointer-events-none' : ''}>
        {/* Seção do cabeçalho - Editável */}
        <div
          className="relative py-6 group cursor-pointer"
          onClick={() => handleEditSection('header.content')}
        >
          <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#B89B7A] rounded-lg opacity-0 group-hover:opacity-100" />
          <div className="absolute top-0 right-0 bg-[#B89B7A] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">
            Editar cabeçalho
          </div>

          <ResultHeader userName={userName} customTitle={headerConfig.title} />
        </div>

        {/* Seção do estilo primário - Editável */}
        <Card
          className="p-6 bg-white shadow-md border border-[#B89B7A]/20 mb-8 relative group cursor-pointer"
          onClick={() => handleEditSection('mainContent.content')}
        >
          <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#B89B7A] rounded-lg opacity-0 group-hover:opacity-100" />
          <div className="absolute top-0 right-0 bg-[#B89B7A] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">
            Editar estilo primário
          </div>

          <PrimaryStyleCard
            primaryStyle={primaryStyle}
            customDescription={primaryStyleConfig.description}
            customImage={primaryStyleConfig.customImage}
          />
          <SecondaryStylesSection secondaryStyles={secondaryStyles} />
        </Card>

        {/* Seção de oferta - Editável */}
        <div
          className="relative group cursor-pointer"
          onClick={() => handleEditSection('offer.hero.content')}
        >
          <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#B89B7A] rounded-lg opacity-0 group-hover:opacity-100" />
          <div className="absolute top-0 right-0 bg-[#B89B7A] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100">
            Editar oferta
          </div>

          <OfferCard primaryStyle={primaryStyle} config={offerConfig} />
        </div>
      </div>

      {/* Overlay de edição */}
      {activeSection && (
        <EditSectionOverlay
          section={activeSection}
          data={getSectionData(config, activeSection)}
          onSave={data => handleSaveSection(activeSection, data)}
          onCancel={() => setActiveSection(null)}
        />
      )}
    </div>
  );
};

// Função auxiliar para obter dados de uma seção por caminho
function getSectionData(config: ResultPageConfig, path: string): any {
  const parts = path.split('.');
  let current: any = config;

  for (const part of parts) {
    if (current[part] === undefined) {
      return {};
    }
    current = current[part];
  }

  return current || {};
}

export default EditableSections;
