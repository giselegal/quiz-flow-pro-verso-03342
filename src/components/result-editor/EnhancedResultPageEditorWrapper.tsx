import React, { useState, useEffect } from 'react';
import { EnhancedResultPageEditor } from './EnhancedResultPageEditor';
import { StyleResult } from '@/types/quiz';
import { QuizFunnel } from '@/types/quizResult';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EnhancedResultPageEditorWrapperProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  initialFunnel?: QuizFunnel;
}

export const EnhancedResultPageEditorWrapper: React.FC<EnhancedResultPageEditorWrapperProps> = ({
  primaryStyle,
  secondaryStyles,
  initialFunnel
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [savedFunnel, setSavedFunnel] = useState<QuizFunnel | null>(null);

  // Função para salvar o funil no localStorage e potencialmente no backend
  const handleSaveFunnel = (funnel: QuizFunnel) => {
    setIsLoading(true);
    
    try {
      // Salvar no localStorage para persistência local
      localStorage.setItem('currentQuizFunnel', JSON.stringify(funnel));
      
      // Aqui você pode adicionar código para salvar no backend
      // Por exemplo: await api.saveFunnel(funnel);
      
      setSavedFunnel(funnel);
      
      toast({
        title: "Funil salvo com sucesso",
        description: "Todas as alterações foram salvas e estão prontas para uso.",
      });
    } catch (error) {
      console.error('Erro ao salvar funil:', error);
      
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar funil salvo do localStorage ao iniciar
  useEffect(() => {
    if (!initialFunnel) {
      try {
        const savedFunnelData = localStorage.getItem('currentQuizFunnel');
        if (savedFunnelData) {
          const parsedFunnel = JSON.parse(savedFunnelData);
          setSavedFunnel(parsedFunnel);
        }
      } catch (error) {
        console.error('Erro ao carregar funil salvo:', error);
      }
    }
  }, [initialFunnel]);

  return (
    <div className="h-screen flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg">Salvando alterações...</p>
          </div>
        </div>
      )}
      
      <EnhancedResultPageEditor
        primaryStyle={primaryStyle}
        secondaryStyles={secondaryStyles}
        initialFunnel={initialFunnel || savedFunnel || undefined}
        onSave={handleSaveFunnel}
      />
    </div>
  );
};

// Componente para a página que utiliza o editor
export const EnhancedResultPageEditorPage: React.FC = () => {
  const [primaryStyle, setPrimaryStyle] = useState<StyleResult | null>(null);
  const [secondaryStyles, setSecondaryStyles] = useState<StyleResult[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tentativa de carregar os resultados do localStorage
    try {
      const savedResult = localStorage.getItem('quizResult');
      
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        
        if (parsedResult?.primaryStyle) {
          setPrimaryStyle(parsedResult.primaryStyle);
          setSecondaryStyles(parsedResult.secondaryStyles || []);
        } else {
          console.error("Formato de resultado inválido");
          // Usar um resultado padrão em vez de redirecionar
          const defaultStyle: StyleResult = {
            category: 'Natural',
            score: 10,
            percentage: 100,
            style: 'natural',
            points: 10,
            rank: 1
          };
          
          setPrimaryStyle(defaultStyle);
          setSecondaryStyles([]);
        }
      } else {
        // Se não houver resultado salvo, usar um resultado padrão para edição
        const defaultStyle: StyleResult = {
          category: 'Natural',
          score: 10,
          percentage: 100,
          style: 'natural',
          points: 10,
          rank: 1
        };
        
        setPrimaryStyle(defaultStyle);
        setSecondaryStyles([]);
      }
    } catch (error) {
      console.error("Erro ao carregar resultados:", error);
      // Usar um resultado padrão em vez de redirecionar
      const defaultStyle: StyleResult = {
        category: 'Natural',
        score: 10,
        percentage: 100,
        style: 'natural',
        points: 10,
        rank: 1
      };
      
      setPrimaryStyle(defaultStyle);
      setSecondaryStyles([]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando editor...</p>
      </div>
    );
  }

  if (!primaryStyle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Erro: Nenhum resultado encontrado para editar</p>
          <Button 
            onClick={() => navigate('/resultado')}
          >
            Voltar para Resultados
          </Button>
        </div>
      </div>
    );
  }

  return (
    <EnhancedResultPageEditorWrapper 
      primaryStyle={primaryStyle} 
      secondaryStyles={secondaryStyles} 
    />
  );
};

export default EnhancedResultPageEditorPage;
