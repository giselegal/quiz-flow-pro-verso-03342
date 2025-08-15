#!/usr/bin/env node
/**
 * 🏭 GERADOR DE TEMPLATES CONECTADOS
 * 
 * Gera templates conectados para Steps 3-19 baseado no padrão do Step02TemplateConnected
 * Usage: node generate-connected-templates.mjs
 */

import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();

// Configuração dos steps
const stepConfigs = {
  3: { title: 'Questão 2 - Qual seu tipo físico?', type: 'question', minSelections: 1 },
  4: { title: 'Questão 3 - Qual seu estilo de vida?', type: 'question', minSelections: 2 },
  5: { title: 'Questão 4 - Que ocasiões você mais veste?', type: 'question', minSelections: 3 },
  6: { title: 'Questão 5 - Qual seu orçamento?', type: 'question', minSelections: 1 },
  7: { title: 'Questão 6 - Onde você compra?', type: 'question', minSelections: 2 },
  8: { title: 'Questão 7 - Qual sua inspiração?', type: 'question', minSelections: 1 },
  9: { title: 'Questão 8 - Seu maior desafio?', type: 'question', minSelections: 1 },
  10: { title: 'Questão 9 - Suas prioridades?', type: 'question', minSelections: 2 },
  11: { title: 'Questão 10 - Seu objetivo?', type: 'question', minSelections: 1 },
  12: { title: 'Estratégica 1 - Perfil Detalhado', type: 'strategic', minSelections: 1 },
  13: { title: 'Estratégica 2 - Preferências Avançadas', type: 'strategic', minSelections: 1 },
  14: { title: 'Estratégica 3 - Estilo de Vida', type: 'strategic', minSelections: 1 },
  15: { title: 'Estratégica 4 - Ocasiões Especiais', type: 'strategic', minSelections: 1 },
  16: { title: 'Estratégica 5 - Investimento', type: 'strategic', minSelections: 1 },
  17: { title: 'Estratégica 6 - Marcas e Referências', type: 'strategic', minSelections: 1 },
  18: { title: 'Estratégica 7 - Objetivos Finais', type: 'strategic', minSelections: 1 },
  19: { title: 'Preparando seu Resultado...', type: 'result', minSelections: 0 }
};

// Template base para gerar os componentes
const generateTemplate = (stepNumber, config) => {
  const stepStr = stepNumber.toString().padStart(2, '0');
  const stepType = config.type;
  
  return `import ConnectedTemplateWrapper from '@/components/quiz/ConnectedTemplateWrapper';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';

interface Step${stepStr}TemplateProps {
  sessionId: string;
  onNext?: () => void;
}

/**
 * 🎯 STEP ${stepStr}: ${config.title}
 * ✅ CONECTADO AOS HOOKS: useQuizLogic.${stepType === 'question' ? 'answerQuestion' : stepType === 'strategic' ? 'answerStrategicQuestion' : 'completeQuiz'}()
 *
 * ${stepType === 'question' ? 'Questão regular do quiz que coleta preferências de estilo' : 
     stepType === 'strategic' ? 'Questão estratégica para dados complementares' :
     'Etapa de resultado que exibe cálculos finais'}
 */
const Step${stepStr}TemplateConnected: React.FC<Step${stepStr}TemplateProps> = ({ sessionId, onNext }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  ${config.minSelections > 0 ? `const [isLoading, setIsLoading] = useState(false);` : ''}

  ${config.minSelections > 0 ? `// Opções da questão (configurar baseado no JSON template)
  const options = [
    {
      id: '${stepNumber}a',
      text: 'Opção A - Configurar baseado no step-${stepStr}.json',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
      category: 'Natural', // Ajustar conforme necessário
      points: 1,
    },
    {
      id: '${stepNumber}b',
      text: 'Opção B - Configurar baseado no step-${stepStr}.json', 
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
      category: 'Clássico', // Ajustar conforme necessário
      points: 2,
    },
    // TODO: Adicionar mais opções baseadas no JSON template
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelected = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]${config.minSelections === 1 ? '' : `.slice(0, ${config.minSelections})`}; ${config.minSelections === 1 ? '// Single selection' : `// Max ${config.minSelections} selections`}

      // Disparar evento para ConnectedTemplateWrapper capturar
      window.dispatchEvent(
        new CustomEvent('quiz-selection-change', {
          detail: {
            blockId: 'step${stepStr}-options-grid',
            selectedOptions: newSelected,
            isValid: newSelected.length >= ${config.minSelections},
            minSelections: ${config.minSelections},
            maxSelections: ${config.minSelections === 1 ? 1 : config.minSelections},
          },
        })
      );

      return newSelected;
    });
  };

  const isValidSelection = selectedOptions.length >= ${config.minSelections};` : 
  
  `// Resultado automático - sem seleção necessária
  const isValidSelection = true;`}

  return (
    <ConnectedTemplateWrapper 
      stepNumber={${stepNumber}} 
      stepType="${stepType}" 
      sessionId={sessionId}
    >
      {/* Navegação */}
      <QuizNavigation
        canProceed={isValidSelection}
        onNext={onNext || (() => {})}
        currentQuestionType="${stepType === 'strategic' ? 'strategic' : 'normal'}"
        selectedOptionsCount={${config.minSelections > 0 ? 'selectedOptions.length' : '0'}}
        isLastQuestion={${stepNumber} === 21}
        currentStep={${stepNumber}}
        totalSteps={21}
        stepName="${config.title}"
        showUserInfo={true}
        sessionId={sessionId}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-white to-[#B89B7A]/10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                alt="Gisele Galvão Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#432818] mb-2">
              ${config.title.toUpperCase()}
            </h1>
            <p className="text-sm text-gray-600">
              ${stepType === 'question' ? `Questão ${stepNumber - 1} de 10` : 
                stepType === 'strategic' ? `Dados Complementares ${stepNumber - 11} de 7` :
                'Processando seu resultado...'} ${config.minSelections > 0 ? `• Selecione ${config.minSelections === 1 ? '1 opção' : `${config.minSelections} opções`}` : ''}
            </p>
          </div>

          ${config.minSelections > 0 ? `{/* Grid de opções */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {options.map(option => {
              const isSelected = selectedOptions.includes(option.id);
              
              return (
                <Card 
                  key={option.id}
                  className={\`cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 \${
                    isSelected 
                      ? 'border-[#B89B7A] border-2 bg-[#B89B7A]/10 shadow-lg' 
                      : 'border-gray-200 hover:border-[#B89B7A]/50'
                  }\`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square mb-3">
                      <img
                        src={option.imageUrl}
                        alt={option.text}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <p className="text-sm text-center text-gray-700">
                      {option.text}
                    </p>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mt-2">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>` : 
          
          `{/* Resultado em processamento */}
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mb-4"></div>
            <p className="text-gray-600">Analisando suas respostas...</p>
          </div>`}

          {/* Botão de continuar */}
          <div className="text-center">
            <button
              onClick={onNext}
              disabled={!isValidSelection}
              className={\`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 \${
                isValidSelection
                  ? 'bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] hover:scale-105 shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed opacity-60'
              }\`}
            >
              {isValidSelection 
                ? '${stepNumber < 21 ? 'Próxima Questão →' : 'Ver Resultado Final'}' 
                : \`${config.minSelections > 0 ? `Selecione \${${config.minSelections} - selectedOptions.length} opções para continuar` : 'Processando...'}\`
              }
            </button>
            
            ${config.minSelections > 0 ? `{selectedOptions.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedOptions.length}/${config.minSelections} opções selecionadas
              </p>
            )}` : ''}
          </div>

          {/* Debug info */}
          <div className="text-xs text-center text-gray-400 mt-4">
            Step ${stepNumber} | Type: ${stepType} | SessionId: {sessionId}
          </div>
        </div>
      </div>
    </ConnectedTemplateWrapper>
  );
};

export default Step${stepStr}TemplateConnected;`;
};

// Gerar todos os templates
console.log('🏭 INICIANDO GERAÇÃO DE TEMPLATES CONECTADOS');
console.log('============================================');

let generatedCount = 0;
let skippedCount = 0;

Object.entries(stepConfigs).forEach(([stepNumber, config]) => {
  const stepStr = stepNumber.padStart(2, '0');
  const fileName = `Step${stepStr}TemplateConnected.tsx`;
  const filePath = path.join(baseDir, 'src', 'components', 'steps', fileName);
  
  // Verificar se já existe
  if (fs.existsSync(filePath)) {
    console.log(`⏭️ ${fileName} - Already exists, skipping`);
    skippedCount++;
    return;
  }
  
  // Gerar template
  const templateContent = generateTemplate(parseInt(stepNumber), config);
  
  // Salvar arquivo
  try {
    fs.writeFileSync(filePath, templateContent);
    console.log(`✅ ${fileName} - Generated (${Math.round(templateContent.length/1024)}KB)`);
    generatedCount++;
  } catch (error) {
    console.log(`❌ ${fileName} - Error: ${error.message}`);
  }
});

console.log('\n📊 RESULTADO DA GERAÇÃO:');
console.log('========================');
console.log(`✅ Gerados: ${generatedCount} templates`);
console.log(`⏭️ Ignorados: ${skippedCount} templates (já existiam)`);
console.log(`📁 Localização: src/components/steps/`);

console.log('\n🎯 PRÓXIMOS PASSOS:');
console.log('==================');
console.log('1. Revisar cada template gerado');
console.log('2. Configurar opções baseadas nos JSONs correspondentes');  
console.log('3. Ajustar categorias e pontuações para cálculo');
console.log('4. Testar integração em navegador');
console.log('5. Ativar persistência Supabase quando necessário');

console.log('\n✅ GERAÇÃO CONCLUÍDA!');