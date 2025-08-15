/**
 * 🎯 MAPEAMENTO COMPLETO DOS TEMPLATES - 21 ETAPAS
 * Sistema unificado que mapeia cada etapa para seu template correto
 */

// Import do Step 01 (coleta de nome)
import { ConnectedStep01Template } from './ConnectedStep01Template';

// Import dos Steps 02-19 (questões e transições)
import {
  ConnectedStep02Template,
  ConnectedStep03Template,
  ConnectedStep04Template,
  ConnectedStep05Template,
  ConnectedStep06Template,
  ConnectedStep07Template,
  ConnectedStep08Template,
  ConnectedStep09Template,
  ConnectedStep10Template,
  ConnectedStep11Template,
  ConnectedStep12Template,
  ConnectedStep13Template,
  ConnectedStep14Template,
  ConnectedStep15Template,
  ConnectedStep16Template,
  ConnectedStep17Template,
  ConnectedStep18Template,
  ConnectedStep19Template,
} from './ConnectedStepsFixed';

// Steps 20-21 will use placeholder templates for now

/**
 * 📋 FLUXO COMPLETO DO QUIZ (21 ETAPAS):
 * 
 * Etapa 1: Coleta do nome
 * Etapas 2-11: 10 questões principais (q1-q10)
 * Etapa 12: Transição 1 (para questões estratégicas)
 * Etapas 13-18: 6 questões estratégicas (strategic1-strategic6)
 * Etapa 19: Transição 2 (para resultado)
 * Etapas 20-21: Páginas de resultado e conversão
 */

export const STEP_TEMPLATES_MAP: Record<number, () => any[]> = {
  // 🎯 ETAPA 1: COLETA DE NOME
  1: ConnectedStep01Template,

  // 🎯 ETAPAS 2-11: QUESTÕES PRINCIPAIS (q1-q10)
  2: ConnectedStep02Template,   // q1: QUAL O SEU TIPO DE ROUPA FAVORITA?
  3: ConnectedStep03Template,   // q2: RESUMA A SUA PERSONALIDADE
  4: ConnectedStep04Template,   // q3: QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
  5: ConnectedStep05Template,   // q4: QUAIS DETALHES VOCÊ GOSTA?
  6: ConnectedStep06Template,   // q5: QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?
  7: ConnectedStep07Template,   // q6: QUAL CASACO É SEU FAVORITO?
  8: ConnectedStep08Template,   // q7: QUAL SUA CALÇA FAVORITA?
  9: ConnectedStep09Template,   // q8: QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?
  10: ConnectedStep10Template,  // q9: QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?
  11: ConnectedStep11Template,  // q10: VOCÊ ESCOLHE CERTOS TECIDOS...

  // 🎯 ETAPA 12: TRANSIÇÃO 1 (para questões estratégicas)
  12: ConnectedStep12Template,  // Transição: "Enquanto calculamos o seu resultado..."

  // 🎯 ETAPAS 13-18: QUESTÕES ESTRATÉGICAS (strategic1-strategic6)
  13: ConnectedStep13Template,  // strategic1: Como você se vê hoje?
  14: ConnectedStep14Template,  // strategic2: O que mais te desafia na hora de se vestir?
  15: ConnectedStep15Template,  // strategic3: Com que frequência você se pega pensando...
  16: ConnectedStep16Template,  // strategic4: Pense no quanto você já gastou...
  17: ConnectedStep17Template,  // strategic5: Se esse conteúdo completo custasse R$ 97,00...
  18: ConnectedStep18Template,  // strategic6: Qual desses resultados você mais gostaria...

  // 🎯 ETAPA 19: TRANSIÇÃO 2 (para resultado)
  19: ConnectedStep19Template,  // Transição: "Obrigada por compartilhar..."

  // 🎯 ETAPAS 20-21: RESULTADOS E CONVERSÃO (placeholder - retorna array vazio)
  20: () => [],        // Resultado personalizado + ofertas (Teste A)
  21: () => [],        // Oferta direta (Teste B)
};

/**
 * 🔄 FUNÇÃO PRINCIPAL PARA OBTER TEMPLATE POR STEP
 */
export const getStepTemplate = (step: number): any[] | null => {
  try {
    const templateFunction = STEP_TEMPLATES_MAP[step];
    
    if (!templateFunction) {
      console.error(`❌ Template não encontrado para step ${step}`);
      return null;
    }

    const template = templateFunction();
    
    if (!template || !Array.isArray(template)) {
      console.error(`❌ Template inválido para step ${step}:`, template);
      return null;
    }

    console.log(`✅ Template carregado para step ${step}:`, template.length, 'blocos');
    return template;

  } catch (error) {
    console.error(`❌ Erro ao carregar template para step ${step}:`, error);
    return null;
  }
};

/**
 * 📊 FUNÇÃO PARA OBTER INFORMAÇÕES DO STEP
 */
export const getStepInfo = (step: number) => {
  const stepDescriptions: Record<number, { title: string; type: string; description: string }> = {
    1: { title: 'Coleta de Nome', type: 'name-input', description: 'Página inicial para coletar o nome do usuário' },
    2: { title: 'Questão 1', type: 'quiz-question', description: 'QUAL O SEU TIPO DE ROUPA FAVORITA?' },
    3: { title: 'Questão 2', type: 'quiz-question', description: 'RESUMA A SUA PERSONALIDADE:' },
    4: { title: 'Questão 3', type: 'quiz-question', description: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?' },
    5: { title: 'Questão 4', type: 'quiz-question', description: 'QUAIS DETALHES VOCÊ GOSTA?' },
    6: { title: 'Questão 5', type: 'quiz-question', description: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?' },
    7: { title: 'Questão 6', type: 'quiz-question', description: 'QUAL CASACO É SEU FAVORITO?' },
    8: { title: 'Questão 7', type: 'quiz-question', description: 'QUAL SUA CALÇA FAVORITA?' },
    9: { title: 'Questão 8', type: 'quiz-question', description: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?' },
    10: { title: 'Questão 9', type: 'quiz-question', description: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA?' },
    11: { title: 'Questão 10', type: 'quiz-question', description: 'VOCÊ ESCOLHE CERTOS TECIDOS...' },
    12: { title: 'Transição 1', type: 'transition', description: 'Página de transição para questões estratégicas' },
    13: { title: 'Questão Estratégica 1', type: 'strategic-question', description: 'Como você se vê hoje?' },
    14: { title: 'Questão Estratégica 2', type: 'strategic-question', description: 'O que mais te desafia na hora de se vestir?' },
    15: { title: 'Questão Estratégica 3', type: 'strategic-question', description: 'Com que frequência você se pega pensando...' },
    16: { title: 'Questão Estratégica 4', type: 'strategic-question', description: 'Pense no quanto você já gastou...' },
    17: { title: 'Questão Estratégica 5', type: 'strategic-question', description: 'Se esse conteúdo completo custasse R$ 97,00...' },
    18: { title: 'Questão Estratégica 6', type: 'strategic-question', description: 'Qual desses resultados você mais gostaria...' },
    19: { title: 'Transição 2', type: 'transition', description: 'Página de transição para resultado' },
    20: { title: 'Resultado Teste A', type: 'result-page', description: 'Página de resultado personalizada + ofertas' },
    21: { title: 'Resultado Teste B', type: 'offer-page', description: 'Página de oferta direta (QuizOfferPage)' },
  };

  return stepDescriptions[step] || { title: `Etapa ${step}`, type: 'unknown', description: 'Etapa não definida' };
};

/**
 * 🔢 FUNÇÃO PARA VALIDAR SE UM STEP EXISTE
 */
export const isValidStep = (step: number): boolean => {
  return step >= 1 && step <= 21 && STEP_TEMPLATES_MAP.hasOwnProperty(step);
};

/**
 * 📋 FUNÇÃO PARA LISTAR TODOS OS STEPS DISPONÍVEIS
 */
export const getAllSteps = (): number[] => {
  return Object.keys(STEP_TEMPLATES_MAP).map(Number).sort((a, b) => a - b);
};

// Exports para compatibilidade
export { ConnectedStep01Template };
export default STEP_TEMPLATES_MAP;