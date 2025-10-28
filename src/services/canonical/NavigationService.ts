/**
 * 🧭 NAVIGATION SERVICE - Canonical Service
 * 
 * Serviço canônico para navegação entre steps do quiz
 * 
 * CONSOLIDA:
 * - NavigationService.ts (legacy)
 * - Lógica de navegação de editorAdapter.ts
 * - Lógica de navegação de useQuizState.ts
 * - Configurações de quizNavigation
 * 
 * @responsibilities
 * - Construir mapa de navegação de todos os steps
 * - Validar completude do grafo de navegação
 * - Auto-preencher nextStep quando ausente (navegação linear por order)
 * - Resolver nextStep considerando hierarquia de fontes
 * - Detectar ciclos e steps órfãos
 * - Aplicar configuração de steps opcionais (ex: step-21)
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import { BaseCanonicalService, ServiceOptions, ServiceResult } from './types';
import { CanonicalServicesMonitor } from './monitoring';
import { getConfiguredNextStep, isStepEnabled } from '@/config/quizNavigation';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface StepNavigationInfo {
  id: string;
  nextStep?: string | null;
  order?: number;
  type?: string;
}

export interface NavigationMap {
  [stepId: string]: string | null; // stepId -> nextStepId
}

export interface NavigationValidationResult {
  valid: boolean;
  totalSteps: number;
  stepsWithNext: number;
  terminalSteps: string[]; // steps com nextStep: null ou undefined
  orphanedSteps: string[]; // steps nunca referenciados como nextStep
  cycles: string[][]; // ciclos detectados
  missingTargets: { from: string; to: string }[]; // nextStep aponta para step inexistente
}

export interface NavigationGraph {
  nodes: Set<string>;
  edges: Map<string, string | null>;
  incomingEdges: Map<string, Set<string>>; // stepId -> Set de steps que apontam para ele
}

export interface NavigationStats {
  totalSteps: number;
  stepsWithNext: number;
  terminalSteps: number;
  orphanedSteps: number;
  cycles: number;
  missingTargets: number;
  isValid: boolean;
}

// ============================================================================
// NAVIGATION SERVICE - MAIN CLASS
// ============================================================================

export class NavigationService extends BaseCanonicalService {
  private static instance: NavigationService;
  private navigationMap: NavigationMap = {};
  private graph: NavigationGraph | null = null;
  private steps: Map<string, StepNavigationInfo> = new Map();

  private constructor(options?: ServiceOptions) {
    super('NavigationService', '1.0.0', options);
  }

  static getInstance(options?: ServiceOptions): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService(options);
    }
    return NavigationService.instance;
  }

  protected async onInitialize(): Promise<void> {
    this.log('NavigationService initialized');
  }

  protected async onDispose(): Promise<void> {
    this.clear();
    this.log('NavigationService disposed');
  }

  // ==================== CORE OPERATIONS ====================

  /**
   * Constrói o mapa de navegação a partir de uma lista de steps
   */
  buildNavigationMap(steps: StepNavigationInfo[]): ServiceResult<NavigationMap> {
    try {
      CanonicalServicesMonitor.trackUsage(this.name, 'buildNavigationMap');
      
      this.steps.clear();
      this.navigationMap = {};
      this.graph = null;

      // Indexar steps por id
      for (const step of steps) {
        this.steps.set(step.id, step);
      }

      // Construir mapa básico aplicando configuração de steps opcionais
      for (const step of steps) {
        const defaultNext = step.nextStep ?? null;
        // Aplicar configuração (ex: desabilitar step-21 se ENABLE_OFFER_STEP=false)
        this.navigationMap[step.id] = getConfiguredNextStep(step.id, defaultNext);
      }

      this.log(`Navigation map built with ${steps.length} steps`);
      return this.createResult(this.navigationMap);
    } catch (error) {
      this.error('buildNavigationMap failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Constrói grafo de navegação para análise avançada
   */
  private buildGraph(): NavigationGraph {
    if (this.graph) return this.graph;

    const nodes = new Set<string>(this.steps.keys());
    const edges = new Map<string, string | null>();
    const incomingEdges = new Map<string, Set<string>>();

    // Inicializar incomingEdges
    for (const stepId of nodes) {
      incomingEdges.set(stepId, new Set());
    }

    // Construir edges e incomingEdges
    for (const [stepId, step] of this.steps.entries()) {
      const nextStep = step.nextStep ?? null;
      edges.set(stepId, nextStep);

      if (nextStep && nodes.has(nextStep)) {
        const incoming = incomingEdges.get(nextStep);
        if (incoming) {
          incoming.add(stepId);
        }
      }
    }

    this.graph = { nodes, edges, incomingEdges };
    return this.graph;
  }

  /**
   * Valida o grafo de navegação
   */
  validateNavigation(): ServiceResult<NavigationValidationResult> {
    try {
      CanonicalServicesMonitor.trackUsage(this.name, 'validateNavigation');
      
      const graph = this.buildGraph();
      const result: NavigationValidationResult = {
        valid: true,
        totalSteps: graph.nodes.size,
        stepsWithNext: 0,
        terminalSteps: [],
        orphanedSteps: [],
        cycles: [],
        missingTargets: [],
      };

      // Contar steps com nextStep
      for (const [stepId, nextStep] of graph.edges.entries()) {
        if (nextStep !== null) {
          result.stepsWithNext++;
        } else {
          result.terminalSteps.push(stepId);
        }
      }

      // Detectar nextStep apontando para step inexistente
      for (const [stepId, nextStep] of graph.edges.entries()) {
        if (nextStep && !graph.nodes.has(nextStep)) {
          result.missingTargets.push({ from: stepId, to: nextStep });
          result.valid = false;
        }
      }

      // Detectar steps órfãos (exceto o primeiro)
      const entryPoints = new Set(['step-01']);
      const sortedSteps = Array.from(this.steps.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      if (sortedSteps.length > 0) {
        entryPoints.add(sortedSteps[0].id);
      }

      for (const stepId of graph.nodes) {
        const incoming = graph.incomingEdges.get(stepId);
        if ((!incoming || incoming.size === 0) && !entryPoints.has(stepId)) {
          result.orphanedSteps.push(stepId);
        }
      }

      // Detectar ciclos usando DFS
      const visited = new Set<string>();
      const recursionStack = new Set<string>();
      const currentPath: string[] = [];

      const detectCycleDFS = (stepId: string): boolean => {
        visited.add(stepId);
        recursionStack.add(stepId);
        currentPath.push(stepId);

        const nextStep = graph.edges.get(stepId);
        if (nextStep && graph.nodes.has(nextStep)) {
          if (!visited.has(nextStep)) {
            if (detectCycleDFS(nextStep)) {
              return true;
            }
          } else if (recursionStack.has(nextStep)) {
            // Ciclo detectado
            const cycleStart = currentPath.indexOf(nextStep);
            const cycle = currentPath.slice(cycleStart);
            cycle.push(nextStep); // Fechar o ciclo
            result.cycles.push(cycle);
            result.valid = false;
            return true;
          }
        }

        currentPath.pop();
        recursionStack.delete(stepId);
        return false;
      };

      for (const stepId of graph.nodes) {
        if (!visited.has(stepId)) {
          detectCycleDFS(stepId);
        }
      }

      return this.createResult(result);
    } catch (error) {
      this.error('validateNavigation failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Auto-preenche nextStep para steps que não têm usando navegação linear por order
   */
  autoFillNextSteps(steps: StepNavigationInfo[]): ServiceResult<StepNavigationInfo[]> {
    try {
      CanonicalServicesMonitor.trackUsage(this.name, 'autoFillNextSteps');
      
      // Ordenar por order
      const sorted = [...steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const updated = sorted.map((step, index) => {
        // Se já tem nextStep definido, manter
        if (step.nextStep !== undefined) {
          return step;
        }

        // Se é o último step, nextStep = null
        if (index === sorted.length - 1) {
          return { ...step, nextStep: null };
        }

        // Próximo step na ordem
        const nextStep = sorted[index + 1];
        return { ...step, nextStep: nextStep.id };
      });

      return this.createResult(updated);
    } catch (error) {
      this.error('autoFillNextSteps failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Resolve nextStep com hierarquia de fontes
   */
  resolveNextStep(stepId: string, steps?: StepNavigationInfo[]): ServiceResult<string | null> {
    try {
      CanonicalServicesMonitor.trackUsage(this.name, 'resolveNextStep');
      
      // Se há mapa de navegação construído, usar
      if (this.navigationMap[stepId] !== undefined) {
        const defaultNext = this.navigationMap[stepId];
        // Aplicar configuração de steps opcionais
        const resolved = getConfiguredNextStep(stepId, defaultNext);
        return this.createResult(resolved);
      }

      // Se steps foram fornecidos, construir mapa temporário
      if (steps) {
        const sorted = [...steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const index = sorted.findIndex(s => s.id === stepId);

        if (index === -1) {
          return this.createResult(null); // Step não encontrado
        }

        const step = sorted[index];

        // 1. nextStep explícito
        let nextStepId: string | null = null;
        if (step.nextStep !== undefined) {
          nextStepId = step.nextStep;
        }
        // 2. Navegação linear
        else if (index < sorted.length - 1) {
          nextStepId = sorted[index + 1].id;
        }
        // 3. Step terminal
        else {
          nextStepId = null;
        }

        // Aplicar configuração de steps opcionais
        const resolved = getConfiguredNextStep(stepId, nextStepId);
        return this.createResult(resolved);
      }

      // Sem informações suficientes
      return this.createResult(null);
    } catch (error) {
      this.error('resolveNextStep failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Retorna o mapa de navegação atual
   */
  getNavigationMap(): ServiceResult<NavigationMap> {
    try {
      return this.createResult({ ...this.navigationMap });
    } catch (error) {
      this.error('getNavigationMap failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Retorna informações de um step específico
   */
  getStepInfo(stepId: string): ServiceResult<StepNavigationInfo | null> {
    try {
      const stepInfo = this.steps.get(stepId);
      return this.createResult(stepInfo || null);
    } catch (error) {
      this.error('getStepInfo failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Retorna todos os steps registrados
   */
  getAllSteps(): ServiceResult<StepNavigationInfo[]> {
    try {
      return this.createResult(Array.from(this.steps.values()));
    } catch (error) {
      this.error('getAllSteps failed:', error);
      return this.createError(error as Error);
    }
  }

  /**
   * Limpa o estado interno
   */
  clear(): void {
    this.steps.clear();
    this.navigationMap = {};
    this.graph = null;
    this.log('Navigation state cleared');
  }

  /**
   * Retorna estatísticas do grafo de navegação
   */
  getStats(): ServiceResult<NavigationStats> {
    try {
      const graph = this.buildGraph();
      const validationResult = this.validateNavigation();
      
      if (!validationResult.success) {
        return this.createError(validationResult.error);
      }

      const validation = validationResult.data;

      const stats: NavigationStats = {
        totalSteps: graph.nodes.size,
        stepsWithNext: validation.stepsWithNext,
        terminalSteps: validation.terminalSteps.length,
        orphanedSteps: validation.orphanedSteps.length,
        cycles: validation.cycles.length,
        missingTargets: validation.missingTargets.length,
        isValid: validation.valid,
      };

      return this.createResult(stats);
    } catch (error) {
      this.error('getStats failed:', error);
      return this.createError(error as Error);
    }
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<boolean> {
    try {
      // Test basic navigation map building
      const testSteps: StepNavigationInfo[] = [
        { id: 'step-01', order: 1, nextStep: 'step-02' },
        { id: 'step-02', order: 2, nextStep: null },
      ];
      
      const result = this.buildNavigationMap(testSteps);
      return result.success;
    } catch {
      return false;
    }
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Instância singleton do NavigationService
 * 
 * @example
 * ```typescript
 * import { navigationService } from '@/services/canonical/NavigationService';
 * 
 * // Construir mapa de navegação
 * const result = navigationService.buildNavigationMap(steps);
 * if (result.success) {
 *   console.log(result.data); // NavigationMap
 * }
 * 
 * // Resolver próximo step
 * const nextResult = navigationService.resolveNextStep('step-01', steps);
 * if (nextResult.success) {
 *   console.log(nextResult.data); // 'step-02' | null
 * }
 * 
 * // Validar navegação
 * const validation = navigationService.validateNavigation();
 * if (validation.success) {
 *   console.log(validation.data.valid); // true | false
 * }
 * 
 * // Obter estatísticas
 * const stats = navigationService.getStats();
 * ```
 */
export const navigationService = NavigationService.getInstance({ debug: false });

// Expor no window para debug
if (typeof window !== 'undefined') {
  (window as any).__canonicalNavigationService = navigationService;
}

// ==================== LEGACY COMPATIBILITY HELPERS ====================

/**
 * Helper para compatibilidade com código legacy que usa getNavigationService()
 * @deprecated Use navigationService diretamente
 */
export function getNavigationService(): NavigationService {
  console.warn('[NavigationService] getNavigationService() is deprecated. Use navigationService directly.');
  return navigationService;
}

/**
 * Helper para criar nova instância (útil para testes)
 */
export function createNavigationService(): NavigationService {
  // For testing, create a new instance by bypassing singleton
  return NavigationService.getInstance({ debug: false });
}
