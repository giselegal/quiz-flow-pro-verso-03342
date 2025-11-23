/**
 * 🎯 LOGIC ENGINE - Sistema de Jump Logic JSON-based
 * 
 * Motor de lógica condicional para navegação dinâmica entre steps
 * Baseado em análise de projetos similares (Formbricks, OpnForm)
 */

export interface Condition {
  id: string;
  if: {
    operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'in';
    field: string;
    value: any;
  };
  then: {
    action: 'goto' | 'showResult' | 'skip' | 'end';
    target: string;
  };
}

export interface LogicContext {
  [key: string]: any;
}

export class LogicEngine {
  private context: LogicContext;
  private history: Array<{ timestamp: Date; field: string; value: any }> = [];

  constructor(initialContext: LogicContext = {}) {
    this.context = { ...initialContext };
  }

  /**
   * Atualiza o contexto com novo valor
   */
  updateContext(key: string, value: any): void {
    this.context[key] = value;
    this.history.push({
      timestamp: new Date(),
      field: key,
      value
    });
  }

  /**
   * Atualiza múltiplos valores no contexto
   */
  updateMultiple(updates: Record<string, any>): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.updateContext(key, value);
    });
  }

  /**
   * Obtém valor do contexto (suporta dot notation)
   */
  getValue(field: string): any {
    return this.getNestedValue(field);
  }

  /**
   * Obtém todo o contexto
   */
  getContext(): LogicContext {
    return { ...this.context };
  }

  /**
   * Limpa o contexto
   */
  clearContext(): void {
    this.context = {};
    this.history = [];
  }

  /**
   * Avalia uma única condição
   */
  evaluateCondition(condition: Condition): boolean {
    const { operator, field, value } = condition.if;
    const fieldValue = this.getNestedValue(field);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      
      case 'notEquals':
        return fieldValue !== value;
      
      case 'greaterThan':
        return Number(fieldValue) > Number(value);
      
      case 'lessThan':
        return Number(fieldValue) < Number(value);
      
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(value);
        }
        if (typeof fieldValue === 'string') {
          return fieldValue.includes(String(value));
        }
        return false;
      
      case 'in':
        if (!Array.isArray(value)) {
          console.warn(`Operator 'in' expects array value, got ${typeof value}`);
          return false;
        }
        return value.includes(fieldValue);
      
      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Avalia múltiplas condições e retorna a primeira que passar
   */
  evaluateConditions(conditions: Condition[]): Condition | null {
    for (const condition of conditions) {
      try {
        if (this.evaluateCondition(condition)) {
          return condition;
        }
      } catch (error) {
        console.error(`Error evaluating condition ${condition.id}:`, error);
      }
    }
    return null;
  }

  /**
   * Determina o próximo step baseado em condições
   */
  getNextStep(
    currentStep: string,
    conditions: Condition[],
    defaultNext: string | null
  ): string | null {
    const matchedCondition = this.evaluateConditions(conditions);
    
    if (matchedCondition) {
      const { action, target } = matchedCondition.then;
      
      switch (action) {
        case 'goto':
          return target;
        
        case 'skip':
          // Pular o step atual e ir para o próximo
          return defaultNext;
        
        case 'showResult':
          // Ir para step de resultado
          return target;
        
        case 'end':
          // Finalizar quiz
          return null;
        
        default:
          console.warn(`Unknown action: ${action}`);
          return defaultNext;
      }
    }
    
    return defaultNext;
  }

  /**
   * Verifica se deve mostrar um resultado específico
   */
  shouldShowResult(conditions: Condition[], resultId: string): boolean {
    const matchedCondition = this.evaluateConditions(conditions);
    
    if (!matchedCondition) return false;
    
    return (
      matchedCondition.then.action === 'showResult' &&
      matchedCondition.then.target === resultId
    );
  }

  /**
   * Obtém histórico de mudanças no contexto
   */
  getHistory(): Array<{ timestamp: Date; field: string; value: any }> {
    return [...this.history];
  }

  /**
   * Exporta estado para persistência
   */
  export(): { context: LogicContext; history: any[] } {
    return {
      context: this.getContext(),
      history: this.getHistory()
    };
  }

  /**
   * Importa estado de persistência
   */
  import(state: { context: LogicContext; history?: any[] }): void {
    this.context = { ...state.context };
    if (state.history) {
      this.history = state.history.map(h => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }));
    }
  }

  /**
   * Obtém valor aninhado usando dot notation (ex: "user.name", "scores.natural")
   */
  private getNestedValue(path: string): any {
    return path.split('.').reduce((obj, key) => obj?.[key], this.context);
  }

  /**
   * Debug: imprime estado atual
   */
  debug(): void {
    console.log('🔍 Logic Engine Debug:');
    console.log('Context:', this.context);
    console.log('History:', this.history.length, 'entries');
  }
}

/**
 * Hook para usar LogicEngine em componentes React
 */
export function createLogicEngine(initialContext?: LogicContext): LogicEngine {
  return new LogicEngine(initialContext);
}

/**
 * Helpers para criar condições comuns
 */
export const LogicHelpers = {
  /**
   * Condição: campo igual a valor
   */
  equals(id: string, field: string, value: any, target: string): Condition {
    return {
      id,
      if: { operator: 'equals', field, value },
      then: { action: 'goto', target }
    };
  },

  /**
   * Condição: score maior que threshold
   */
  scoreGreaterThan(
    id: string,
    category: string,
    threshold: number,
    resultTarget: string
  ): Condition {
    return {
      id,
      if: { operator: 'greaterThan', field: `scores.${category}`, value: threshold },
      then: { action: 'showResult', target: resultTarget }
    };
  },

  /**
   * Condição: opção selecionada está na lista
   */
  optionIn(id: string, field: string, options: string[], target: string): Condition {
    return {
      id,
      if: { operator: 'in', field, value: options },
      then: { action: 'goto', target }
    };
  },

  /**
   * Condição: skip step se condição for verdadeira
   */
  skipIf(id: string, field: string, value: any): Condition {
    return {
      id,
      if: { operator: 'equals', field, value },
      then: { action: 'skip', target: '' }
    };
  },

  /**
   * Condição: finalizar quiz
   */
  endIf(id: string, field: string, value: any): Condition {
    return {
      id,
      if: { operator: 'equals', field, value },
      then: { action: 'end', target: '' }
    };
  }
};

/**
 * Exemplo de uso:
 * 
 * ```typescript
 * const engine = new LogicEngine();
 * 
 * // Atualizar contexto
 * engine.updateContext('selectedStyle', 'natural');
 * engine.updateContext('scores.natural', 25);
 * 
 * // Definir condições
 * const conditions: Condition[] = [
 *   {
 *     id: 'high-natural-score',
 *     if: { operator: 'greaterThan', field: 'scores.natural', value: 20 },
 *     then: { action: 'showResult', target: 'result-natural' }
 *   },
 *   {
 *     id: 'style-is-natural',
 *     if: { operator: 'equals', field: 'selectedStyle', value: 'natural' },
 *     then: { action: 'goto', target: 'step-10' }
 *   }
 * ];
 * 
 * // Determinar próximo step
 * const nextStep = engine.getNextStep('step-05', conditions, 'step-06');
 * console.log(nextStep); // 'result-natural' (primeira condição passou)
 * ```
 */
