import type { EditableQuizStep } from '../QuizFunnelEditor';

export interface CycleReport {
    hasCycle: boolean;
    path: string[];
    cycles: string[][];
}

export function detectCycle(steps: EditableQuizStep[]): CycleReport {
    const idMap = new Map<string, EditableQuizStep>();
    steps.forEach(s => idMap.set(s.id, s));

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[][] = [];
    const pathStack: string[] = [];

    function dfs(id: string): boolean { // retorna true se ciclo
        if (visiting.has(id)) {
            // Encontramos ciclo - extrair sequência
            const idx = pathStack.indexOf(id);
            if (idx !== -1) {
                const cyc = pathStack.slice(idx).concat(id);
                cycles.push(cyc);
            }
            return true;
        }

        if (visited.has(id)) return false;

        visiting.add(id);
        pathStack.push(id);

        const step = idMap.get(id);
        if (step?.nextStep && idMap.has(step.nextStep)) {
            if (dfs(step.nextStep)) {
                visiting.delete(id);
                pathStack.pop();
                visited.add(id);
                return true; // early stop se desejado
            }
        }

        visiting.delete(id);
        pathStack.pop();
        visited.add(id);
        return false;
    }

    // Considerar primeiro step como raiz; mas buscar ciclos em qualquer componente alcançável
    for (const s of steps) {
        if (!visited.has(s.id)) {
            dfs(s.id);
        }
    }

    return {
        hasCycle: cycles.length > 0,
        path: cycles[0] || [],
        cycles
    };
}