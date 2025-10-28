/**
 * NavigationService - Serviço unificado de navegação entre steps
 * 
 * Consolida a lógica de navegação nextStep que estava espalhada em:
 * - editorAdapter.ts
 * - useQuizState.ts
 * - quizSteps.ts
 * - Templates TypeScript/JSON
 * 
 * @responsibilities
 * - Construir mapa de navegação de todos os steps
 * - Validar completude do grafo de navegação
 * - Auto-preencher nextStep quando ausente (navegação linear por order)
 * - Resolver nextStep considerando hierarquia de fontes
 * - Detectar ciclos e steps órfãos
 * - Aplicar configuração de steps opcionais (ex: step-21)
 */

import { getConfiguredNextStep, isStepEnabled } from '@/config/quizNavigation';

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

export class NavigationService {
  private navigationMap: NavigationMap = {};
  private graph: NavigationGraph | null = null;
  private steps: Map<string, StepNavigationInfo> = new Map();

  /**
   * Constrói o mapa de navegação a partir de uma lista de steps
   * 
   * @param steps - Lista de steps com informações de navegação
   * @returns Mapa de navegação construído
   */
  buildNavigationMap(steps: StepNavigationInfo[]): NavigationMap {
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

    return this.navigationMap;
  }

  /**
   * Constrói grafo de navegação para análise avançada
   * 
   * @private
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
   * 
   * Verifica:
   * - Steps órfãos (nunca referenciados)
   * - Ciclos no grafo
   * - nextStep apontando para steps inexistentes
   * - Completude geral
   * 
   * @returns Resultado da validação
   */
  validateNavigation(): NavigationValidationResult {
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
    // Assuma que steps com order=0 ou step-01 são pontos de entrada
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

    return result;
  }

  /**
   * Auto-preenche nextStep para steps que não têm usando navegação linear por order
   * 
   * @param steps - Steps com ordem definida
   * @returns Steps atualizados com nextStep preenchido
   */
  autoFillNextSteps(steps: StepNavigationInfo[]): StepNavigationInfo[] {
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

    return updated;
  }

  /**
   * Resolve nextStep com hierarquia de fontes
   * 
   * Ordem de prioridade:
   * 1. nextStep explícito no step
   * 2. Configuração de steps opcionais (ex: step-21)
   * 3. Navegação linear por order
   * 4. null (step terminal)
   * 
   * @param stepId - ID do step atual
   * @param steps - Lista de steps disponíveis
   * @returns ID do próximo step ou null
   */
  resolveNextStep(stepId: string, steps?: StepNavigationInfo[]): string | null {
    // Se há mapa de navegação construído, usar
    if (this.navigationMap[stepId] !== undefined) {
      const defaultNext = this.navigationMap[stepId];
      // Aplicar configuração de steps opcionais
      return getConfiguredNextStep(stepId, defaultNext);
    }

    // Se steps foram fornecidos, construir mapa temporário
    if (steps) {
      const sorted = [...steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const index = sorted.findIndex(s => s.id === stepId);

      if (index === -1) {
        return null; // Step não encontrado
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
      return getConfiguredNextStep(stepId, nextStepId);
    }

    // Sem informações suficientes
    return null;
  }

  /**
   * Retorna o mapa de navegação atual
   */
  getNavigationMap(): NavigationMap {
    return { ...this.navigationMap };
  }

  /**
   * Retorna informações de um step específico
   */
  getStepInfo(stepId: string): StepNavigationInfo | undefined {
    return this.steps.get(stepId);
  }

  /**
   * Retorna todos os steps registrados
   */
  getAllSteps(): StepNavigationInfo[] {
    return Array.from(this.steps.values());
  }

  /**
   * Limpa o estado interno
   */
  clear(): void {
    this.steps.clear();
    this.navigationMap = {};
    this.graph = null;
  }

  /**
   * Retorna estatísticas do grafo de navegação
   */
  getStats() {
    const graph = this.buildGraph();
    const validation = this.validateNavigation();

    return {
      totalSteps: graph.nodes.size,
      stepsWithNext: validation.stepsWithNext,
      terminalSteps: validation.terminalSteps.length,
      orphanedSteps: validation.orphanedSteps.length,
      cycles: validation.cycles.length,
      missingTargets: validation.missingTargets.length,
      isValid: validation.valid,
    };
  }
}

// Singleton instance
let navigationServiceInstance: NavigationService | null = null;

/**
 * Retorna a instância singleton do NavigationService
 */
export function getNavigationService(): NavigationService {
  if (!navigationServiceInstance) {
    navigationServiceInstance = new NavigationService();
  }
  return navigationServiceInstance;
}

/**
 * Cria uma nova instância do NavigationService (útil para testes)
 */
export function createNavigationService(): NavigationService {
  return new NavigationService();
}
