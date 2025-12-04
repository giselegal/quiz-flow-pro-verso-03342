/**
 * 🗂️ UNIFIED TEMPLATES REGISTRY
 * 
 * Fonte única e centralizada para templates de funis
 * ✅ Apenas template principal + opção vazia
 */

export interface UnifiedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: string;
  stepCount: number;
  isOfficial: boolean;
  usageCount: number;
  tags: string[];
  features: string[];
  conversionRate: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  version: string;
}

/**
 * Registry oficial de templates
 * ✅ Apenas template principal validado
 */
export const UNIFIED_TEMPLATE_REGISTRY: Record<string, UnifiedTemplate> = {
  'quiz21StepsComplete': {
    id: 'quiz21StepsComplete',
    name: 'Quiz de Estilo Pessoal - 21 Etapas',
    description: 'Template principal completo com 21 etapas: coleta de dados, quiz pontuado, questões estratégicas e ofertas',
    category: 'quiz-complete',
    theme: 'fashion-premium',
    stepCount: 21,
    isOfficial: true,
    usageCount: 2150,
    tags: ['principal', 'estilo', 'completo', '21-etapas', 'premium'],
    features: [
      'Quiz Pontuado Completo',
      'Questões Estratégicas',
      'Resultado + Oferta Premium',
      'Persistência JSON',
      'SEO Otimizado',
    ],
    conversionRate: '94%',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    createdAt: '2024-12-01T00:00:00.000Z',
    updatedAt: '2025-09-11T14:30:00.000Z',
    version: '4.0.0',
  },
};

/**
 * Categorias de templates disponíveis
 */
export const TEMPLATE_CATEGORIES = [
  {
    id: 'quiz-complete',
    name: 'Quiz Completo',
    description: 'Templates de quiz completos e validados',
    icon: 'sparkles',
  },
];

/**
 * Retorna lista de templates do registry
 */
export function getUnifiedTemplates(): UnifiedTemplate[] {
  return Object.values(UNIFIED_TEMPLATE_REGISTRY);
}

/**
 * Busca template por ID
 */
export function getTemplateById(id: string): UnifiedTemplate | undefined {
  return UNIFIED_TEMPLATE_REGISTRY[id];
}

/**
 * Aliases legados para compatibilidade
 */
export const TEMPLATE_ALIASES: Record<string, string> = {
  'quiz-estilo-completo': 'quiz21StepsComplete',
  'quiz-estilo-21-steps': 'quiz21StepsComplete',
  'quiz21-v4': 'quiz21StepsComplete',
};

/**
 * Resolve alias para ID real
 */
export function resolveTemplateAlias(idOrAlias: string): string {
  return TEMPLATE_ALIASES[idOrAlias] || idOrAlias;
}

export default UNIFIED_TEMPLATE_REGISTRY;
