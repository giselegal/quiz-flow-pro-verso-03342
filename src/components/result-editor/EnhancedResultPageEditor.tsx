
import React, { useState } from 'react';
import { StyleResult } from '@/types/quiz';
import { styleConfig, StyleConfigMap } from '@/config/styleConfig';
import StyleSelector from './StyleSelector';
import { ResultPageVisualEditor } from './ResultPageVisualEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EnhancedResultPageEditorProps {
  initialStyle?: StyleResult;
}

export const EnhancedResultPageEditor: React.FC<EnhancedResultPageEditorProps> = ({
  initialStyle
}) => {
  const [selectedStyle, setSelectedStyle] = useState<StyleResult>(
    initialStyle || {
      category: 'Natural' as any,
      score: 100,
      percentage: 100,
      style: 'Natural' as any,
      points: 100,
      rank: 1
    }
  );

  const [showTemplates, setShowTemplates] = useState(false);

  const handleStyleChange = (newStyle: StyleResult) => {
    setSelectedStyle(newStyle);
  };

  // Safe access to styleConfig
  const currentStyleConfig = (styleConfig as StyleConfigMap)[selectedStyle.category];
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/quiz-builder">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-playfair text-[#432818]">
            Editor de Página de Resultado
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleChange={handleStyleChange}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <ResultPageVisualEditor
          selectedStyle={selectedStyle}
          onShowTemplates={() => setShowTemplates(true)}
        />
      </div>

      {/* Template modal would go here */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <h2 className="text-xl font-medium mb-4">Selecionar Template</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.keys(styleConfig).map((style) => (
                <button
                  key={style}
                  className="p-4 border rounded-lg hover:border-[#B89B7A] transition-colors"
                  onClick={() => {
                    handleStyleChange({
                      category: style as any,
                      score: 100,
                      percentage: 100,
                      style: style as any,
                      points: 100,
                      rank: 1
                    });
                    setShowTemplates(false);
                  }}
                >
                  <div className="text-left">
                    <h3 className="font-medium">{style}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {(styleConfig as StyleConfigMap)[style]?.description.substring(0, 50)}...
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setShowTemplates(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedResultPageEditor;
