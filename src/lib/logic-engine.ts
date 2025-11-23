/**
 * 🎯 LOGIC ENGINE - Sistema de Jump Logic JSON-based
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

  private setNestedValue(path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    let current = this.context;
    for (const key of keys) {
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
  }

  private getNestedValue(path: string): any {
    return path.split('.').reduce((obj, key) => obj?.[key], this.context);
  }

  updateContext(key: string, value: any): void {
    this.setNestedValue(key, value);
    this.history.push({
      timestamp: new Date(),
      field: key,
      value
    });
  }

  updateMultiple(updates: Record<string, any>): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.updateContext(key, value);
    });
  }

  getValue(field: string): any {
    return this.getNestedValue(field);
  }

  getContext(): LogicContext {
    return { ...this.context };
  }

  clearContext(): void {
    this.context = {};
    this.history = [];
  }

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
          return defaultNext;
        case 'showResult':
          return target;
        case 'end':
          return null;
        default:
          console.warn(`Unknown action: ${action}`);
          return defaultNext;
      }
    }
    
    return defaultNext;
  }

  shouldShowResult(conditions: Condition[], resultId: string): boolean {
    const matchedCondition = this.evaluateConditions(conditions);
    
    if (!matchedCondition) return false;
    
    return (
      matchedCondition.then.action === 'showResult' &&
      matchedCondition.then.target === resultId
    );
  }

  getHistory(): Array<{ timestamp: Date; field: string; value: any }> {
    return [...this.history];
  }

  export(): { context: LogicContext; history: any[] } {
    return {
      context: this.getContext(),
      history: this.getHistory()
    };
  }

  import(state: { context: LogicContext; history?: any[] }): void {
    this.context = { ...state.context };
    if (state.history) {
      this.history = state.history.map(h => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }));
    }
  }

  debug(): void {
    console.log('🔍 Logic Engine Debug:');
    console.log('Context:', this.context);
    console.log('History:', this.history.length, 'entries');
  }
}

export function createLogicEngine(initialContext?: LogicContext): LogicEngine {
  return new LogicEngine(initialContext);
}

export const LogicHelpers = {
  equals(id: string, field: string, value: any, target: string): Condition {
    return {
      id,
      if: { operator: 'equals', field, value },
      then: { action: 'goto', target }
    };
  },

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

  optionIn(id: string, field: string, options: string[], target: string): Condition {
    return {
      id,
      if: { operator: 'in', field, value: options },
      then: { action: 'goto', target }
    };
  },

  skipIf(id: string, field: string, value: any): Condition {
    return {
      id,
      if: { operator: 'equals', field, value },
      then: { action: 'skip', target: '' }
    };
  },

  endIf(id: string, field: string, value: any): Condition {
    return {
      id,
      if: { operator: 'equals', field, value },
      then: { action: 'end', target: '' }
    };
  }
};
