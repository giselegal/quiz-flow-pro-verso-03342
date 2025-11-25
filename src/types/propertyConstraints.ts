/**
 * 🎯 PROPERTY CONSTRAINTS
 * 
 * Definições de restrições para propriedades de blocos.
 * Usado pelo sistema de validação e painel de propriedades.
 */

export interface PropertyConstraints {
  /** Valor mínimo (para números/ranges) */
  min?: number;
  
  /** Valor máximo (para números/ranges) */
  max?: number;
  
  /** Step/incremento (para números/ranges) */
  step?: number;
  
  /** Pattern regex para validação (strings) */
  pattern?: string;
  
  /** Opções válidas (para selects/enums) */
  enum?: string[];
  
  /** Opções com label (para selects avançados) */
  options?: Array<{ value: any; label: string }>;
  
  /** Comprimento mínimo (strings/arrays) */
  minLength?: number;
  
  /** Comprimento máximo (strings/arrays) */
  maxLength?: number;
  
  /** Valor deve ser único */
  unique?: boolean;
  
  /** Formato específico (email, url, etc) */
  format?: 'email' | 'url' | 'color' | 'date' | 'time' | 'datetime';
}

/**
 * Valida um valor contra suas constraints
 */
export function validateConstraints(
  value: any,
  constraints: PropertyConstraints
): { valid: boolean; error?: string } {
  if (!constraints) return { valid: true };

  // Min/Max para números
  if (typeof value === 'number') {
    if (constraints.min !== undefined && value < constraints.min) {
      return { valid: false, error: `Valor mínimo: ${constraints.min}` };
    }
    if (constraints.max !== undefined && value > constraints.max) {
      return { valid: false, error: `Valor máximo: ${constraints.max}` };
    }
  }

  // Enum validation
  if (constraints.enum && !constraints.enum.includes(value)) {
    return { valid: false, error: `Valor deve ser um de: ${constraints.enum.join(', ')}` };
  }

  // Length validation
  if (typeof value === 'string' || Array.isArray(value)) {
    const length = value.length;
    if (constraints.minLength !== undefined && length < constraints.minLength) {
      return { valid: false, error: `Comprimento mínimo: ${constraints.minLength}` };
    }
    if (constraints.maxLength !== undefined && length > constraints.maxLength) {
      return { valid: false, error: `Comprimento máximo: ${constraints.maxLength}` };
    }
  }

  // Pattern validation
  if (typeof value === 'string' && constraints.pattern) {
    const regex = new RegExp(constraints.pattern);
    if (!regex.test(value)) {
      return { valid: false, error: 'Formato inválido' };
    }
  }

  // Format validation
  if (typeof value === 'string' && constraints.format) {
    switch (constraints.format) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { valid: false, error: 'Email inválido' };
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          return { valid: false, error: 'URL inválida' };
        }
        break;
      case 'color':
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
          return { valid: false, error: 'Cor inválida (use formato #RGB ou #RRGGBB)' };
        }
        break;
    }
  }

  return { valid: true };
}
