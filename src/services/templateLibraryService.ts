import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

export interface FunnelTemplate {
  id: string;
  name: string;
  version: string;
  steps: Record<string, any[]>;
  metadata?: any;
  variables?: any[];
}

const LOCAL_KEY = 'qqcv_funnel_templates';

function loadCustomTemplates(): FunnelTemplate[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveCustomTemplates(list: FunnelTemplate[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch { }
}

export const templateLibraryService = {
  listBuiltins(): FunnelTemplate[] {
    return [{
      id: 'quiz-style-21-steps',
      name: 'Quiz de Estilo - 21 Etapas',
      version: '3.0.0',
      steps: QUIZ_STYLE_21_STEPS_TEMPLATE,
      metadata: {
        collectUserName: true,
        seo: {
          title: 'Quiz de Estilo Pessoal',
          description: 'Descubra seu estilo'
        }
      },
      variables: [
        { key: 'romantico', label: 'Romântico', scoringWeight: 1 },
        { key: 'classico', label: 'Clássico', scoringWeight: 1 },
        { key: 'natural', label: 'Natural', scoringWeight: 1 },
        { key: 'elegante', label: 'Elegante', scoringWeight: 1 },
        { key: 'criativo', label: 'Criativo', scoringWeight: 1 },
        { key: 'dramatico', label: 'Dramático', scoringWeight: 1 },
        { key: 'sensual', label: 'Sensual', scoringWeight: 1 }
      ]
    }];
  },
  listAll(): FunnelTemplate[] {
    return [...this.listBuiltins(), ...loadCustomTemplates()];
  },
  getById(id: string): FunnelTemplate | null {
    // 🔧 ALIASES: Todas as variações redirecionam para o template único
    const aliases: Record<string, string> = {
      'default-quiz-funnel-21-steps': 'quiz-style-21-steps',
      'style-quiz-21-steps': 'quiz-style-21-steps',
      'funil-21-etapas': 'quiz-style-21-steps',
      'optimized-21-steps-funnel': 'quiz-style-21-steps',
      'optimized-21-steps': 'quiz-style-21-steps',
      'quiz-21-otimizado': 'quiz-style-21-steps',
      'quiz21StepsComplete': 'quiz-style-21-steps',
      'quiz-estilo-completo': 'quiz-style-21-steps',
      'QUIZ_STYLE_21_STEPS_TEMPLATE': 'quiz-style-21-steps',
      'template-quiz21StepsComplete': 'quiz-style-21-steps',
      'template-optimized-21-steps-funnel': 'quiz-style-21-steps',
    };
    const resolvedId = aliases[id] || id;
    const found = this.listAll().find(t => t.id === resolvedId);
    
    if (!found) {
      console.warn('⚠️ Template não encontrado:', { originalId: id, resolvedId, availableIds: this.listAll().map(t => t.id) });
    }
    
    return found || null;
  },
  saveCustom(template: FunnelTemplate) {
    const list = loadCustomTemplates();
    const idx = list.findIndex(t => t.id === template.id);
    if (idx >= 0) list[idx] = template;
    else list.push(template);
    saveCustomTemplates(list);
  },
};
