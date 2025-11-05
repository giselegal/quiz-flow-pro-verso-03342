/**
 * ⏱️ CALCULADORA DE TEMPO ESTIMADO
 * Estima o tempo necessário para completar o quiz baseado em:
 * - Tipo de step (intro, question, offer, etc)
 * - Complexidade do conteúdo
 * - Número de opções
 */

interface QuizStep {
  type: string;
  blocks?: Array<{
    type: string;
    content?: {
      text?: string;
      options?: any[];
    };
    properties?: any;
  }>;
  validation?: {
    rules?: {
      selectedOptions?: {
        minItems?: number;
        maxItems?: number;
      };
    };
  };
}

interface TimeEstimateConfig {
  baseTimings: Record<string, number>;
  optionPenalty: number;
  complexityBonus: number;
  textInputPenalty: number;
}

interface TimeEstimate {
  totalMinutes: number;
  totalSeconds: number;
  breakdown: Array<{
    stepId: string;
    seconds: number;
    factors: string[];
  }>;
  confidence: 'low' | 'medium' | 'high';
}

interface TimeEstimateConfig {
    baseTimings: Record<string, number>; // segundos por tipo
    optionPenalty: number;               // segundos extras por opção adicional
    complexityThreshold: number;         // caracteres que indicam complexidade
    complexityBonus: number;             // segundos extras para conteúdo complexo
}

const DEFAULT_CONFIG: TimeEstimateConfig = {
    baseTimings: {
        'intro': 15,
        'question': 30,
        'multiple-choice': 20,
        'single-choice': 20,
        'text-input': 45,
        'image-choice': 25,
        'rating': 15,
        'transition': 10,
        'result': 60,
        'offer': 90,
        'thank-you': 20
    },
    optionPenalty: 3,
    complexityThreshold: 1000,
    complexityBonus: 10
};

export function calculateEstimatedTime(
  steps: Record<string, QuizStep>,
  config?: Partial<TimeEstimateConfig>
): TimeEstimate {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const breakdown: any[] = [];
    let totalSeconds = 0;
    
    steps.forEach(step => {
        const factors: string[] = [];
        
        // Tempo base
        const baseTime = finalConfig.baseTimings[step.type] || 30;
        factors.push(`Base (${step.type}): ${baseTime}s`);
        let stepTime = baseTime;
        
        // Penalidade por número de opções
        const optionCount = step.blocks?.filter((b: any) => 
            b.type.includes('option')
        )?.length || 0;
        
        if (optionCount > 5) {
            const penalty = (optionCount - 5) * finalConfig.optionPenalty;
            stepTime += penalty;
            factors.push(`Opções extras (+${optionCount - 5}): +${penalty}s`);
        }
        
        // Bonus de complexidade
        const contentLength = JSON.stringify(step).length;
        if (contentLength > finalConfig.complexityThreshold) {
            stepTime += finalConfig.complexityBonus;
            factors.push(`Conteúdo complexo: +${finalConfig.complexityBonus}s`);
        }
        
        // Penalidade para inputs de texto livre
        const hasTextInput = step.blocks?.some((b: any) => 
            b.type === 'text-input' || b.type === 'textarea'
        );
        if (hasTextInput) {
            stepTime += 15;
            factors.push('Input de texto: +15s');
        }
        
        breakdown.push({
            stepId: step.id || step.metadata?.id,
            seconds: Math.round(stepTime),
            factors
        });
        
        totalSeconds += stepTime;
    });
    
    // Calcular confiança baseado em completude dos dados
    const hasAllTypes = steps.every(s => s.type);
    const hasBlockInfo = steps.every(s => s.blocks);
    const confidence = hasAllTypes && hasBlockInfo ? 'high'
        : hasAllTypes ? 'medium'
        : 'low';
    
    return {
        totalMinutes: Math.ceil(totalSeconds / 60),
        totalSeconds: Math.round(totalSeconds),
        breakdown,
        confidence
    };
}

/**
 * Atualiza propriedade calculatedTime em blocos quiz-intro-header
 */
export function updateEstimatedTimeInHeader(
    blocks: any[],
    estimatedMinutes: number
): any[] {
    return blocks.map(block => {
        if (block.type === 'quiz-intro-header') {
            return {
                ...block,
                properties: {
                    ...block.properties,
                    calculatedTime: estimatedMinutes,
                    subtitle: block.properties?.subtitle?.replace(
                        /{calculatedTime}/g,
                        String(estimatedMinutes)
                    ) || `⏱️ Tempo estimado: ${estimatedMinutes} minutos`
                }
            };
        }
        return block;
    });
}

/**
 * Formatar tempo de forma user-friendly
 */
export function formatEstimatedTime(minutes: number): string {
    if (minutes < 1) return 'Menos de 1 minuto';
    if (minutes === 1) return '1 minuto';
    if (minutes < 5) return `${minutes} minutos`;
    
    // Arredondar para múltiplos de 5
    const rounded = Math.ceil(minutes / 5) * 5;
    return `Cerca de ${rounded} minutos`;
}

/**
 * Calcular tempo restante baseado no progresso
 */
export function calculateRemainingTime(
    totalMinutes: number,
    progressPercent: number
): {
    remainingMinutes: number;
    elapsedMinutes: number;
    formatted: string;
} {
    const elapsedMinutes = Math.floor((progressPercent / 100) * totalMinutes);
    const remainingMinutes = Math.max(0, totalMinutes - elapsedMinutes);
    
    return {
        remainingMinutes,
        elapsedMinutes,
        formatted: remainingMinutes < 1 
            ? 'Quase lá!'
            : `${remainingMinutes} min restantes`
    };
}
