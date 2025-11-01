// Minimal but compatible implementation used for development/type-check.
// Replace with a real provider integration when available.

export interface GitHubModelsAIOptions {
  token?: string;
  model?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export class GitHubModelsAI {
  private options: GitHubModelsAIOptions;

  constructor(options: GitHubModelsAIOptions = {}) {
    this.options = options;
  }

  async analyzeTemplate(_: any): Promise<any> {
    return { ok: true };
  }

  async generateContent(_: {
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{ content: string }> {
    // Dev fallback: return minimal JSON content
    return { content: JSON.stringify({ ok: true }) };
  }

  async improveText(text: string, _context?: string): Promise<string> {
    // Dev fallback: echo text
    return text;
  }
}
