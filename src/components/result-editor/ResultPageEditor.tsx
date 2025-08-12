// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Save, Eye } from 'lucide-react';
import EditableSection from './EditableSection';
import { useResultPageEditor } from '@/hooks/useResultPageEditor';

interface ResultPageEditorProps {
  selectedStyle: {
    category: string;
    score: number;
    percentage: number;
  };
  onShowTemplates?: () => void;
}

export const ResultPageEditor: React.FC<ResultPageEditorProps> = ({ selectedStyle }) => {
  const {
    resultPageConfig,
    loading,
    isPreviewing,
    actions: { handleSave, handleReset, togglePreview, updateSection },
  } = useResultPageEditor(selectedStyle.category);

  const sectionTitles: Record<string, string> = {
    header: 'Cabeçalho',
    mainContent: 'Conteúdo Principal',
    secondaryStyles: 'Estilos Secundários',
    'offer.hero': 'Oferta - Hero',
    'offer.products': 'Oferta - Produtos',
    'offer.benefits': 'Oferta - Benefícios',
    'offer.pricing': 'Oferta - Preços',
    'offer.testimonials': 'Oferta - Depoimentos',
    'offer.guarantee': 'Oferta - Garantia',
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[#1A1818]/70">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Editor de Resultados</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={togglePreview}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewing ? 'Esconder Preview' : 'Mostrar Preview'}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {Object.keys(sectionTitles).map(key => {
            const sectionContent = (resultPageConfig as any)?.[key] || {};
            return (
              <Card key={key} className="shadow-md">
                <EditableSection
                  title={sectionTitles[key]}
                  content={sectionContent}
                  onChange={(newContent: any) => updateSection(key, newContent)}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
