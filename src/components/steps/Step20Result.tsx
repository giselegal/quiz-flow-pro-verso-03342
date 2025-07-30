import React from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { useAuth } from '../../context/AuthContext';
import { getStep20Template, Step20TemplateData } from './Step20Template';
import { StyleResult } from '../../types/quiz';

/**
 * Componente Step20Result - Renderiza a página de resultados do quiz com dados reais
 * Este componente integra o template Step20Template com os dados calculados do useQuiz hook
 */
const Step20Result: React.FC = () => {
  const { primaryStyle, secondaryStyles, quizResult } = useQuiz();
  const { user } = useAuth();

  // Obter o nome do usuário a partir do contexto de autenticação ou localStorage
  const userName = React.useMemo(() => {
    if (user?.userName) {
      return user.userName;
    }
    
    // Tentar obter userName do quizResult se existir
    const storedResult = localStorage.getItem('quizResult');
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        if (parsed.userName && parsed.userName !== 'User') {
          return parsed.userName;
        }
      } catch (e) {
        console.warn('Error parsing stored quiz result:', e);
      }
    }
    
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      return storedName;
    }
    
    return 'Visitante';
  }, [user]);

  // Verificar se temos os dados necessários
  if (!primaryStyle || !secondaryStyles || secondaryStyles.length === 0) {
    console.error('Step20Result: Missing quiz data', { primaryStyle, secondaryStyles });
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFAF0] p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#432818]">
            Carregando seus resultados...
          </h2>
          <p className="text-[#8F7A6A]">
            Se esta mensagem persistir, tente refazer o quiz.
          </p>
        </div>
      </div>
    );
  }

  // Verificar se primaryStyle e secondaryStyles são do tipo StyleResult
  let processedPrimaryStyle: StyleResult;
  let processedSecondaryStyles: StyleResult[];

  // Se primaryStyle é uma string, criar um StyleResult válido
  if (typeof primaryStyle === 'string') {
    processedPrimaryStyle = {
      style: primaryStyle as any, // Forçar conversão
      category: primaryStyle,
      score: 15,
      points: 15,
      percentage: 85,
      rank: 1
    };
  } else {
    processedPrimaryStyle = primaryStyle;
  }

  // Se secondaryStyles são strings, criar StyleResult válidos
  if (Array.isArray(secondaryStyles) && secondaryStyles.length > 0) {
    if (typeof secondaryStyles[0] === 'string') {
      processedSecondaryStyles = (secondaryStyles as string[]).map((style, index) => ({
        style: style as any, // Forçar conversão
        category: style,
        score: 5 - index,
        points: 5 - index,
        percentage: 20 - (index * 5),
        rank: index + 2
      }));
    } else {
      processedSecondaryStyles = secondaryStyles as any; // Forçar conversão
    }
  } else {
    processedSecondaryStyles = [];
  }

  // Preparar os dados para o template
  const templateData: Step20TemplateData = {
    primaryStyle: processedPrimaryStyle,
    secondaryStyles: processedSecondaryStyles,
    userName
  };

  // Gerar os blocos com dados reais
  const blocks = getStep20Template(templateData);

  console.log('Step20Result: Rendering with data:', {
    userName,
    primaryStyle: processedPrimaryStyle.category,
    percentage: processedPrimaryStyle.percentage,
    secondaryStylesCount: processedSecondaryStyles.length
  });

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {blocks.map((block, index) => (
          <div
            key={block.id || `block-${index}`}
            className="mb-8"
          >
            {/* Renderização básica do bloco - pode ser substituída por um renderer mais sofisticado */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">{block.type}</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(block.properties, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step20Result;
