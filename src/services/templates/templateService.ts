import { QuizTemplate, TemplateListItem } from '@/types/quizTemplate';
import { styleQuizTemplate } from './styleQuizTemplate';

// Chave para armazenamento local
const TEMPLATES_STORAGE_KEY = 'quiz_templates';

// Carregar templates do armazenamento local
const loadTemplates = (): QuizTemplate[] => {
  try {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Se não existir, inicializa com template padrão vazio
    const defaultTemplates: QuizTemplate[] = [
      {
        id: 'default',
        name: 'Template Padrão',
        description: 'Template básico',
        questions: [],
        resultPageSettings: {
          styleType: 'classic',
          blocks: [],
          headerConfig: {},
          mainContentConfig: {},
          offerConfig: {},
        },
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(defaultTemplates));
    return defaultTemplates;
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
    return [
      {
        id: 'default',
        name: 'Template Padrão',
        description: 'Template básico',
        questions: [],
        resultPageSettings: {
          styleType: 'classic',
          blocks: [],
          headerConfig: {},
          mainContentConfig: {},
          offerConfig: {},
        },
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

// Salvar templates no armazenamento local
const saveTemplates = (templates: QuizTemplate[]): void => {
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Erro ao salvar templates:', error);
  }
};

// Obter todos os templates como lista resumida
export const getAllTemplates = (): TemplateListItem[] => {
  const templates = loadTemplates();
  return templates.map(({ id, name, description, isPublished, updatedAt }) => ({
    id,
    name,
    description,
    isPublished,
    updatedAt,
  }));
};

// Obter um template específico pelo ID
export const getTemplateById = (id: string): QuizTemplate | null => {
  const templates = loadTemplates();
  return templates.find(template => template.id === id) || null;
};

// Criar novo template
export const createTemplate = (
  template: Omit<QuizTemplate, 'id' | 'createdAt' | 'updatedAt'>
): string => {
  const templates = loadTemplates();
  const now = new Date().toISOString();
  const newTemplate: QuizTemplate = {
    ...template,
    id: `template_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };

  templates.push(newTemplate);
  saveTemplates(templates);

  return newTemplate.id;
};

// Duplicar template existente
export const duplicateTemplate = (id: string): string | null => {
  const templates = loadTemplates();
  const templateToDuplicate = templates.find(template => template.id === id);

  if (!templateToDuplicate) return null;

  const now = new Date().toISOString();
  const duplicatedTemplate: QuizTemplate = {
    ...templateToDuplicate,
    id: `template_${Date.now()}`,
    name: `${templateToDuplicate.name} (Cópia)`,
    isPublished: false,
    createdAt: now,
    updatedAt: now,
  };

  templates.push(duplicatedTemplate);
  saveTemplates(templates);

  return duplicatedTemplate.id;
};

// Atualizar template existente
export const updateTemplate = (id: string, updates: Partial<QuizTemplate>): boolean => {
  const templates = loadTemplates();
  const index = templates.findIndex(template => template.id === id);

  if (index === -1) return false;

  templates[index] = {
    ...templates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveTemplates(templates);
  return true;
};

// Salvar template completo
export const saveTemplate = (template: QuizTemplate): boolean => {
  const templates = loadTemplates();
  const index = templates.findIndex(t => t.id === template.id);

  if (index >= 0) {
    templates[index] = {
      ...template,
      updatedAt: new Date().toISOString(),
    };
  } else {
    templates.push({
      ...template,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  saveTemplates(templates);
  return true;
};

// Excluir template
export const deleteTemplate = (id: string): boolean => {
  const templates = loadTemplates();
  const filteredTemplates = templates.filter(template => template.id !== id);

  if (filteredTemplates.length === templates.length) return false;

  saveTemplates(filteredTemplates);
  return true;
};

// Publicar/despublicar template
export const toggleTemplatePublication = (id: string): boolean => {
  const templates = loadTemplates();
  const index = templates.findIndex(template => template.id === id);

  if (index === -1) return false;

  templates[index].isPublished = !templates[index].isPublished;
  templates[index].updatedAt = new Date().toISOString();

  saveTemplates(templates);
  return true;
};
