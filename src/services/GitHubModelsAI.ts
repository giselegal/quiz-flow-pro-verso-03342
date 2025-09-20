/**
 * 🤖 GITHUB MODELS AI INTEGRATION
 * 
 * GitHub Models oferece acesso gratuito a:
 * - GPT-4o, GPT-4o mini
 * - Claude 3.5 Sonnet  
 * - Llama 3.1 405B
 * - Phi-3.5 MoE, Phi-3.5 Vision
 * - Mistral Large 2, Mistral Nemo
 * - Cohere Command R, Command R+
 * 
 * Limite: 15 RPM (requests per minute) - Perfeito para desenvolvimento
 */

export interface GitHubModelsConfig {
    token: string; // GitHub Personal Access Token
    model: 'gpt-4o' | 'gpt-4o-mini' | 'claude-3.5-sonnet' | 'llama-3.1-405b' | 'phi-3.5-moe' | 'mistral-large-2';
    maxTokens?: number;
    temperature?: number;
}

export interface AIRequest {
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>;
    maxTokens?: number;
    temperature?: number;
}

export interface AIResponse {
    content: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string;
}

export class GitHubModelsAI {
    private config: GitHubModelsConfig;
    private baseUrl = 'https://models.inference.ai.azure.com';

    constructor(config: GitHubModelsConfig) {
        this.config = config;
    }

    /**
     * 🎯 Gerar conteúdo usando GitHub Models
     */
    async generateContent(request: AIRequest): Promise<AIResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.token}`,
                },
                body: JSON.stringify({
                    messages: request.messages,
                    model: this.config.model,
                    max_tokens: request.maxTokens || this.config.maxTokens || 1000,
                    temperature: request.temperature || this.config.temperature || 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`GitHub Models API error: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                content: data.choices[0].message.content,
                usage: {
                    promptTokens: data.usage.prompt_tokens,
                    completionTokens: data.usage.completion_tokens,
                    totalTokens: data.usage.total_tokens,
                },
                model: this.config.model,
            };
        } catch (error) {
            console.error('❌ GitHub Models API Error:', error);
            throw error;
        }
    }

    /**
     * 🎨 Gerar templates de quiz usando IA
     */
    async generateQuizTemplate(prompt: string): Promise<any> {
        const request: AIRequest = {
            messages: [
                {
                    role: 'system',
                    content: `Você é um especialista em criação de quizzes interativos. 
          Gere um quiz estruturado com base no prompt do usuário.
          Retorne apenas JSON válido com esta estrutura:
          {
            "title": "string",
            "description": "string",
            "steps": [
              {
                "question": "string",
                "type": "multiple-choice | single-choice | text-input",
                "options": ["option1", "option2", "option3", "option4"],
                "correctAnswer": "string (opcional)"
              }
            ]
          }`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            maxTokens: 2000
        };

        const response = await this.generateContent(request);

        try {
            return JSON.parse(response.content);
        } catch (error) {
            console.error('❌ Erro ao parsear JSON da IA:', error);
            throw new Error('IA retornou formato inválido');
        }
    }

    /**
     * 🚀 Gerar steps de funil usando IA
     */
    async generateFunnelSteps(prompt: string): Promise<any[]> {
        const request: AIRequest = {
            messages: [
                {
                    role: 'system',
                    content: `Você é um especialista em marketing digital e funis de conversão.
          Crie steps de funil baseados no prompt do usuário.
          Retorne apenas um JSON array com esta estrutura:
          [
            {
              "id": "step-1",
              "title": "Título do Step",
              "description": "Descrição",
              "type": "question | offer | result",
              "components": [
                {
                  "type": "text | image | button | form",
                  "content": "conteúdo do componente",
                  "properties": {}
                }
              ]
            }
          ]`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            maxTokens: 3000
        };

        const response = await this.generateContent(request);

        try {
            return JSON.parse(response.content);
        } catch (error) {
            console.error('❌ Erro ao parsear JSON da IA:', error);
            throw new Error('IA retornou formato inválido');
        }
    }

    /**
     * 📝 Melhorar texto usando IA
     */
    async improveText(text: string, context: string = ''): Promise<string> {
        const request: AIRequest = {
            messages: [
                {
                    role: 'system',
                    content: `Você é um copywriter especialista em conversão.
          Melhore o texto fornecido tornando-o mais persuasivo e envolvente.
          ${context ? `Contexto: ${context}` : ''}
          Retorne apenas o texto melhorado, sem explicações.`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.6,
            maxTokens: 1000
        };

        const response = await this.generateContent(request);
        return response.content.trim();
    }

    /**
     * 🎨 Gerar configurações de design usando IA
     */
    async generateDesignConfig(theme: string, brand: string = ''): Promise<any> {
        const request: AIRequest = {
            messages: [
                {
                    role: 'system',
                    content: `Você é um designer especialista em UI/UX.
          Gere uma configuração de design baseada no tema fornecido.
          ${brand ? `Marca/Empresa: ${brand}` : ''}
          Retorne apenas JSON válido com esta estrutura:
          {
            "primaryColor": "#hexcolor",
            "secondaryColor": "#hexcolor",
            "accentColor": "#hexcolor",
            "backgroundColor": "gradient ou cor sólida",
            "fontFamily": "nome da fonte",
            "button": {
              "background": "cor ou gradient",
              "textColor": "#hexcolor",
              "borderRadius": "px",
              "shadow": "shadow css"
            }
          }`
                },
                {
                    role: 'user',
                    content: `Tema: ${theme}`
                }
            ],
            temperature: 0.5,
            maxTokens: 1000
        };

        const response = await this.generateContent(request);

        try {
            return JSON.parse(response.content);
        } catch (error) {
            console.error('❌ Erro ao parsear JSON da IA:', error);
            throw new Error('IA retornou formato inválido');
        }
    }
}

// 🔧 Factory para criar instância configurada
export function createGitHubModelsAI(token?: string): GitHubModelsAI {
    const aiToken = token || import.meta.env.VITE_GITHUB_MODELS_TOKEN || '';

    if (!aiToken) {
        throw new Error('❌ GitHub Models token não configurado. Configure VITE_GITHUB_MODELS_TOKEN no .env');
    }

    return new GitHubModelsAI({
        token: aiToken,
        model: 'gpt-4o-mini', // Modelo rápido e gratuito
        maxTokens: 2000,
        temperature: 0.7,
    });
}

export default GitHubModelsAI;