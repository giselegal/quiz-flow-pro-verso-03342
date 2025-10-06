/**
 * 🎯 JSON MASTER SERVICE
 * 
 * Serviço SIMPLES para ler o JSON master das 21 etapas
 * SEM complicação, SEM cache complexo, SEM enrolação!
 * 
 * APENAS:
 * 1. Lê /templates/quiz21-complete.json
 * 2. Retorna os dados
 * 3. PRONTO!
 */

export class JsonMasterService {
    private static instance: JsonMasterService;
    private cache: Map<string, any> = new Map();

    static getInstance(): JsonMasterService {
        if (!JsonMasterService.instance) {
            JsonMasterService.instance = new JsonMasterService();
        }
        return JsonMasterService.instance;
    }

    /**
     * 📄 Carrega template genérico por ID
     */
    async loadTemplate(templateId: string): Promise<any> {
        const key = templateId;

        // Retorna do cache se existir
        if (this.cache.has(key)) {
            console.log(`✅ [JsonMasterService] Retornando do cache: ${templateId}`);
            return structuredClone(this.cache.get(key));
        }

        // Mapeamento de templates para arquivos JSON
        const fileMap: Record<string, string> = {
            quiz21StepsComplete: '/templates/quiz21-complete.json'
        };

        const url = fileMap[templateId];
        if (!url) {
            throw new Error(`JsonMasterService: no mapping for templateId ${templateId}`);
        }

        console.log(`🔄 [JsonMasterService] Carregando: ${url}`);

        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            console.log(`✅ [JsonMasterService] Carregado com sucesso:`, {
                templateId,
                steps: data.steps?.length || 0,
                metadata: data.metadata
            });

            this.cache.set(key, data);
            return structuredClone(data);
        } catch (error) {
            console.error(`❌ [JsonMasterService] Erro ao carregar ${url}:`, error);
            throw error;
        }
    }

    /**
     * 📄 Carrega o JSON master do Quiz 21 Etapas (legacy method)
     * SIMPLES: fetch → JSON → pronto!
     */
    async loadQuiz21Steps(): Promise<any> {
        return this.loadTemplate('quiz21StepsComplete');
    }

    /**
     * 💾 Salva template genérico
     */
    async saveTemplate(templateId: string, payload: any): Promise<void> {
        this.cache.set(templateId, structuredClone(payload));
        console.info(`💾 [JsonMasterService] saveTemplate(${templateId}) — cache atualizado`, {
            steps: payload.steps?.length || 0
        });
    }

    /**
     * 🔄 Limpa o cache (útil para desenvolvimento)
     */
    clearCache(): void {
        console.log('🗑️ [JsonMasterService] Cache limpo');
        this.cache.clear();
    }

    /**
     * 💾 Salva mudanças de volta no JSON
     * (Por enquanto só loga, mas pode implementar depois)
     */
    async saveQuiz21Steps(data: any): Promise<void> {
        console.log('💾 [JsonMasterService] Salvando mudanças:', {
            id: data.metadata?.id,
            stepCount: data.steps?.length
        });

        // TODO: Implementar salvamento real
        // Opções:
        // 1. POST para backend que escreve o arquivo
        // 2. localStorage como fallback
        // 3. IndexedDB para persistência local

        // Por enquanto, só atualiza o cache
        this.cache.set('quiz21', data);

        console.log('✅ [JsonMasterService] Cache atualizado (salvamento real não implementado)');
    }
}

// Export singleton
export const jsonMasterService = JsonMasterService.getInstance();
