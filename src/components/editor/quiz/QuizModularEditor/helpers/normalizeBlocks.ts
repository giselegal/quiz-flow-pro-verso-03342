// Helper para extrair/normalizar blocks de diferentes formatos de step
export function extractBlocksFromStepData(raw: any, stepId: string): any[] {
    try {
        if (!raw) return [];

        // Caso 1: Array direto (já normalizado)
        if (Array.isArray(raw)) {
            return raw.filter((b: any) => b && b.id && b.type);
        }

        // Caso 2: Objeto com propriedade .blocks
        if (raw.blocks && Array.isArray(raw.blocks)) {
            return raw.blocks.filter((b: any) => b && b.id && b.type);
        }

        // Caso 3: Estrutura aninhada { steps: { stepId: { blocks: [] } } } ou chaves numéricas
        if (raw.steps && raw.steps[stepId]?.blocks && Array.isArray(raw.steps[stepId].blocks)) {
            return raw.steps[stepId].blocks.filter((b: any) => b && b.id && b.type);
        }

        // Caso 4: steps como array [{ id, blocks }] (procura por id correspondente)
        if (raw.steps && Array.isArray(raw.steps)) {
            const found = raw.steps.find((s: any) => s?.id === stepId || String(s?.id) === String(Number(stepId.replace(/^step-/, ''))));
            if (found && Array.isArray(found.blocks)) {
                return found.blocks.filter((b: any) => b && b.id && b.type);
            }
        }

        // Formato não reconhecido — retornar array vazio para resiliência
        return [];
    } catch {
        // Em caso de qualquer erro inesperado, retornar array vazio (não quebrar render)
        return [];
    }
}

export default extractBlocksFromStepData;
