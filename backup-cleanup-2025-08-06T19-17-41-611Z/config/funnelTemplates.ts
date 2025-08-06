/**
 * 🚀 SISTEMA DE TEMPLATES REUTILIZÁVEIS
 *
 * Templates pré-configurados para diferentes tipos de funil.
 * Cada template é 100% customizável e responsivo.
 */

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  blocks: Array<{
    type: string;
    properties: Record<string, any>;
  }>;
}

// 🎯 TEMPLATE: DESCOBERTA DE ESTILO (baseado no funil real)
export const styleDiscoveryTemplate: FunnelTemplate = {
  id: "style-discovery",
  name: "Descoberta de Estilo",
  description: "Funil para consultoria de imagem e estilo pessoal",
  category: "Consultoria",
  preview: "https://exemplo.com/preview-style.jpg",
  blocks: [
    {
      type: "FunnelHeroBlock",
      properties: {
        title: "Chega de um guarda-roupa lotado e da sensação de que nada combina com você.",
        description:
          "Descubra seu Estilo e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
        ctaText: "Descobrir Meu Estilo - 5x R$ 8,83",
        ctaSubtext: "Acesso imediato + Garantia de 7 dias",
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Gisele Galvão - Consultoria de Estilo",
        heroImageUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745193445/4fb35a75-02dd-40b9-adae-854e90228675_ibkrmt.jpg",
        heroImageAlt: "Mulher descobrindo seu estilo autêntico",
        backgroundColor: "#FAF9F7",
        textColor: "#432818",
        primaryColor: "#B89B7A",
        layout: "side-by-side",
        imagePosition: "right",
      },
    },
    {
      type: "FunnelPainBlock",
      properties: {
        title: "Você Reconhece Esses Problemas?",
        subtitle: "Armário cheio, mas nada para vestir? Você não está sozinha.",
        conclusion:
          "A solução está em descobrir seu estilo autêntico. Com essa clareza, você criará um guarda-roupa harmonioso que expressa verdadeiramente quem você é.",
        painPoints: [
          {
            title: "Problemas de autoestima",
            description: "Você se sente insegura com sua imagem e não sabe como melhorar",
            icon: "Heart",
          },
          {
            title: "Compras sem direção",
            description: "Gasta dinheiro em roupas que não combinam com você",
            icon: "ShoppingBag",
          },
          {
            title: "Perda de tempo",
            description: "Demora horas para se arrumar e ainda não fica satisfeita",
            icon: "Clock",
          },
          {
            title: "Falta de estilo próprio",
            description: "Copia looks dos outros mas nunca fica do mesmo jeito",
            icon: "Users",
          },
        ],
        columns: 4,
        backgroundColor: "#ffffff",
        textColor: "#432818",
        primaryColor: "#B89B7A",
      },
    },
  ],
};

// 🏋️ TEMPLATE: FITNESS
export const fitnessTemplate: FunnelTemplate = {
  id: "fitness-transformation",
  name: "Transformação Fitness",
  description: "Funil para programas de emagrecimento e fitness",
  category: "Saúde",
  preview: "https://exemplo.com/preview-fitness.jpg",
  blocks: [
    {
      type: "FunnelHeroBlock",
      properties: {
        title: "Transforme Seu Corpo em 90 Dias",
        description:
          "Método comprovado que já ajudou mais de 10.000 pessoas a conquistarem o corpo dos sonhos.",
        ctaText: "Começar Transformação Agora",
        ctaSubtext: "Garantia de 30 dias ou seu dinheiro de volta",
        backgroundColor: "#f8fafc",
        textColor: "#1e293b",
        primaryColor: "#22c55e",
        layout: "side-by-side",
        imagePosition: "right",
      },
    },
    {
      type: "FunnelPainBlock",
      properties: {
        title: "Cansado de Tentar e Não Conseguir?",
        subtitle: "Sabemos como é frustrante não ver resultados.",
        painPoints: [
          {
            title: "Falta de energia",
            description: "Você se sente cansado o tempo todo",
            icon: "Zap",
          },
          {
            title: "Autoestima baixa",
            description: "Não gosta do que vê no espelho",
            icon: "Heart",
          },
          {
            title: "Dietas que não funcionam",
            description: "Já tentou várias dietas sem sucesso",
            icon: "Target",
          },
          {
            title: "Falta de orientação",
            description: "Não sabe por onde começar ou como treinar",
            icon: "Users",
          },
        ],
        columns: 4,
        backgroundColor: "#ffffff",
        textColor: "#1e293b",
        primaryColor: "#22c55e",
      },
    },
  ],
};

// 💼 TEMPLATE: NEGÓCIOS
export const businessTemplate: FunnelTemplate = {
  id: "business-growth",
  name: "Crescimento de Negócios",
  description: "Funil para consultoria empresarial e crescimento",
  category: "Negócios",
  preview: "https://exemplo.com/preview-business.jpg",
  blocks: [
    {
      type: "FunnelHeroBlock",
      properties: {
        title: "Multiplique o Faturamento da Sua Empresa",
        description:
          "Estratégias comprovadas para escalar seu negócio e aumentar os lucros em até 300%.",
        ctaText: "Acessar Estratégias Agora",
        ctaSubtext: "Consultoria personalizada inclusa",
        backgroundColor: "#ffffff",
        textColor: "#1e40af",
        primaryColor: "#3b82f6",
        layout: "side-by-side",
        imagePosition: "right",
      },
    },
    {
      type: "FunnelPainBlock",
      properties: {
        title: "Sua Empresa Está Estagnada?",
        subtitle: "Identifique os gargalos que impedem seu crescimento.",
        painPoints: [
          {
            title: "Vendas inconsistentes",
            description: "Faturamento instável e imprevisível",
            icon: "TrendingUp",
          },
          {
            title: "Falta de processos",
            description: "Tudo depende de você para funcionar",
            icon: "Settings",
          },
          {
            title: "Competição acirrada",
            description: "Dificuldade para se destacar no mercado",
            icon: "Target",
          },
          {
            title: "Equipe desmotivada",
            description: "Alta rotatividade e baixa produtividade",
            icon: "Users",
          },
        ],
        columns: 4,
        backgroundColor: "#f8fafc",
        textColor: "#1e40af",
        primaryColor: "#3b82f6",
      },
    },
  ],
};

// 📚 COLEÇÃO DE TODOS OS TEMPLATES
export const funnelTemplates: FunnelTemplate[] = [
  styleDiscoveryTemplate,
  fitnessTemplate,
  businessTemplate,
];

// 🔍 HELPERS PARA BUSCA E FILTRO
export const getTemplatesByCategory = (category: string): FunnelTemplate[] => {
  return funnelTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string): FunnelTemplate | undefined => {
  return funnelTemplates.find(template => template.id === id);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(funnelTemplates.map(template => template.category)));
};

/**
 * 🚀 FUNÇÃO PARA APLICAR TEMPLATE
 *
 * Aplica um template a uma página, criando blocos com IDs únicos
 */
export const applyTemplate = (template: FunnelTemplate, generateId: () => string) => {
  return template.blocks.map(blockData => ({
    id: generateId(),
    type: blockData.type,
    properties: { ...blockData.properties },
  }));
};
