/**
 * 🔧 INTERCEPTOR DE ERROS SUPABASE MELHORADO
 * 
 * Sistema mais robusto para interceptar e tratar erros 404 do Supabase
 * fornecendo fallbacks locais para desenvolvimento e preview
 */

interface FallbackData {
    [key: string]: any;
}

class SupabaseErrorInterceptor {
    private static instance: SupabaseErrorInterceptor;
    private originalFetch: typeof fetch;
    private fallbackData: Map<string, FallbackData> = new Map();
    private isActive = false;

    private constructor() {
        this.originalFetch = window.fetch;
        this.setupFallbackData();
    }

    static getInstance(): SupabaseErrorInterceptor {
        if (!SupabaseErrorInterceptor.instance) {
            SupabaseErrorInterceptor.instance = new SupabaseErrorInterceptor();
        }
        return SupabaseErrorInterceptor.instance;
    }

    /**
     * Ativar interceptor
     */
    activate(): void {
        if (this.isActive) return;

        console.log('🛡️ Ativando interceptor Supabase...');
        
        window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
            const url = typeof input === 'string' ? input : input.toString();
            
            // Detectar URLs do Supabase que podem dar erro
            if (this.isSupabaseUrl(url)) {
                console.log(`🔍 Interceptando requisição Supabase: ${this.extractEndpoint(url)}`);
                
                try {
                    const response = await this.originalFetch(input, init);
                    
                    // Se 404 ou erro, usar fallback
                    if (response.status === 404 || !response.ok) {
                        console.log(`📦 Fornecendo dados locais para: ${this.extractEndpoint(url)}`);
                        return this.createFallbackResponse(url);
                    }
                    
                    return response;
                } catch (error) {
                    console.warn(`⚠️ Erro na requisição Supabase, usando fallback:`, error);
                    return this.createFallbackResponse(url);
                }
            }
            
            // Requisições normais passam direto
            return this.originalFetch(input, init);
        };

        this.isActive = true;
    }

    /**
     * Desativar interceptor
     */
    deactivate(): void {
        if (!this.isActive) return;

        console.log('🔄 Desativando interceptor Supabase...');
        window.fetch = this.originalFetch;
        this.isActive = false;
    }

    /**
     * Verificar se é URL do Supabase
     */
    private isSupabaseUrl(url: string): boolean {
        return url.includes('supabase.co') && 
               (url.includes('quiz_drafts') || 
                url.includes('quiz_production') || 
                url.includes('/rest/v1/'));
    }

    /**
     * Extrair endpoint da URL
     */
    private extractEndpoint(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname + urlObj.search;
        } catch {
            return url;
        }
    }

    /**
     * Configurar dados de fallback
     */
    private setupFallbackData(): void {
        // Quiz drafts fallback
        this.fallbackData.set('quiz_drafts', {
            id: 'quiz-estilo-21-steps',
            name: 'Quiz Estilo Local',
            slug: 'quiz-estilo',
            steps: [
                {
                    id: 'step-1',
                    type: 'intro',
                    title: 'Descubra seu Estilo Pessoal',
                    order: 1,
                    blocks: []
                },
                {
                    id: 'step-2',
                    type: 'question',
                    title: 'Qual é seu estilo preferido?',
                    order: 2,
                    blocks: []
                }
            ],
            version: 1,
            is_published: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        // Quiz production fallback
        this.fallbackData.set('quiz_production', {
            slug: 'quiz-estilo',
            steps: [],
            runtime: {
                totalSteps: 21,
                currentVersion: '1.0.0'
            },
            results: {
                profiles: ['casual', 'elegante', 'boho', 'moderno']
            },
            ui: {
                theme: 'default',
                colors: {
                    primary: '#B89B7A',
                    secondary: '#432818'
                }
            },
            settings: {
                showProgress: true,
                allowBack: true
            },
            version: 1,
            published_at: new Date().toISOString()
        });
    }

    /**
     * Criar resposta de fallback
     */
    private createFallbackResponse(url: string): Response {
        let responseData: any = [];

        // Determinar tipo de dados baseado na URL
        if (url.includes('quiz_drafts')) {
            const draftData = this.fallbackData.get('quiz_drafts');
            responseData = draftData ? [draftData] : [];
        } else if (url.includes('quiz_production')) {
            const prodData = this.fallbackData.get('quiz_production');
            responseData = prodData ? [prodData] : [];
        } else {
            // Resposta genérica para outras endpoints
            responseData = { 
                data: [], 
                message: 'Local fallback response',
                error: null 
            };
        }

        return new Response(JSON.stringify(responseData), {
            status: 200,
            statusText: 'OK (Local Fallback)',
            headers: {
                'Content-Type': 'application/json',
                'X-Fallback': 'true',
                'X-Fallback-Source': 'supabase-interceptor'
            }
        });
    }

    /**
     * Adicionar dados de fallback customizados
     */
    addFallbackData(key: string, data: FallbackData): void {
        this.fallbackData.set(key, data);
    }

    /**
     * Status do interceptor
     */
    getStatus() {
        return {
            active: this.isActive,
            fallbackCount: this.fallbackData.size,
            fallbackKeys: Array.from(this.fallbackData.keys())
        };
    }
}

// Instância singleton
export const supabaseInterceptor = SupabaseErrorInterceptor.getInstance();

// Auto-ativar em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    supabaseInterceptor.activate();
}

export default supabaseInterceptor;