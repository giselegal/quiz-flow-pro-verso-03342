// @ts-nocheck
import React, { useState } from 'react';
import { StyleResult } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from '@/components/ui/use-toast';
import EditableComponent from './EditableComponent';
import { useQuizResultConfig } from '@/hooks/useQuizResultConfig';
import { useAutosave } from '@/hooks/useAutosave';

interface QuizResultProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

// Create a simple QuizResult component since it's missing
const QuizResult: React.FC<QuizResultProps> = ({ primaryStyle, secondaryStyles }) => {
  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-playfair text-[#432818] mb-6">
          Seu estilo é {primaryStyle.category}
        </h1>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-medium text-[#432818] mb-4">Estilo Principal</h2>
            <p className="text-[#1A1818]/70">Score: {primaryStyle.score}</p>
            <p className="text-[#1A1818]/70">Percentual: {primaryStyle.percentage}%</p>
          </div>

          {secondaryStyles.length > 0 && (
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-medium text-[#432818] mb-4">Estilos Secundários</h2>
              <div className="space-y-2">
                {secondaryStyles.map((style, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{style.category}</span>
                    <span>{style.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ResultPageEditorWithControlsProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
}

export const ResultPageEditorWithControls: React.FC<ResultPageEditorWithControlsProps> = ({
  primaryStyle,
  secondaryStyles,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { config, updateConfig, saveConfig } = useQuizResultConfig(primaryStyle.category);

  const { isSaving, lastSaved, saveNow } = useAutosave({
    data: config,
    onSave: saveConfig,
    interval: 5000,
    enabled: !isPreviewMode,
  });

  const handleConfigUpdate = (sectionKey: string, data: any) => {
    updateConfig(sectionKey, data);
  };

  const togglePreviewMode = () => {
    if (!isPreviewMode) {
      saveNow();
    }
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link to="/resultado">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-playfair text-[#432818]">Editor da Página de Resultados</h1>
        </div>

        <div className="flex items-center gap-3">
          {!isPreviewMode && (
            <div className="text-sm text-muted-foreground">
              {isSaving ? (
                <span>Salvando...</span>
              ) : (
                lastSaved && <span>Salvo às {lastSaved.toLocaleTimeString()}</span>
              )}
            </div>
          )}

          <Button variant="outline" onClick={togglePreviewMode}>
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

          <Button className="bg-[#B89B7A] hover:bg-[#A38A69]" onClick={saveNow} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {isPreviewMode ? (
          <QuizResult primaryStyle={primaryStyle} secondaryStyles={secondaryStyles} />
        ) : (
          <EditableComponent
            components={{
              primaryStyle,
              secondaryStyles,
              config,
            }}
            onUpdate={handleConfigUpdate}
          />
        )}
      </div>
    </div>
  );
};
