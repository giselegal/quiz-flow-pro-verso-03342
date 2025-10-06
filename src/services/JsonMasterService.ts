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
     * 📄 Carrega o JSON master do Quiz 21 Etapas
     * SIMPLES: fetch → JSON → pronto!
     */
    async loadQuiz21Steps(): Promise<any> {
        console.log('🎯 [JsonMasterService] Carregando quiz21-complete.json...');

        // Cache simples (só durante a sessão)
        if (this.cache.has('quiz21')) {
            console.log('✅ [JsonMasterService] Usando cache');
            return this.cache.get('quiz21');
        }

        try {
            const response = await fetch('/templates/quiz21-complete.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log('✅ [JsonMasterService] JSON carregado:', {
                templateVersion: data.templateVersion,
                stepCount: data.metadata?.stepCount,
                stepsLength: data.steps?.length,
                size: JSON.stringify(data).length + ' bytes'
            });

            // Cache para próximas chamadas
            this.cache.set('quiz21', data);

            return data;
        } catch (error) {
            console.error('❌ [JsonMasterService] Erro ao carregar JSON:', error);
            throw new Error(`Falha ao carregar quiz21-complete.json: ${error.message}`);
        }
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
