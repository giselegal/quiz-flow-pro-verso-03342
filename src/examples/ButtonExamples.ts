// 🎯 EXEMPLOS PRÁTICOS - Botão Responsivo e Editável
// Diferentes configurações para casos de uso diversos

export const BUTTON_EXAMPLES = {
  // 🎨 BOTÃO PADRÃO STEP01 (atual)
  defaultStep01: {
    text: "Quero Descobrir Meu Estilo!",
    backgroundColor: "#B89B7A",
    textColor: "#ffffff",
    conditionalActivation: true,
    validationTarget: "name-input-modular",
    action: "next-step",
    nextStep: "step-02",
    borderRadius: "rounded-xl",
    hoverEffect: true,
    responsive: true,
  },

  // 🔥 BOTÃO CHAMATIVO COM GRADIENTE
  gradientButton: {
    text: "COMEÇAR AGORA!",
    gradientBackground: true,
    gradientColors: ["#B89B7A", "#D4A574", "#aa6b5d"],
    textColor: "#ffffff",
    fontSize: "text-xl",
    fontWeight: "font-black",
    borderRadius: "rounded-2xl",
    hoverEffect: true,
    glowEffect: true,
    boxShadow: "shadow-2xl",
    padding: "py-5 px-10",
    animationDuration: "500ms",
  },

  // 📱 OTIMIZADO PARA MOBILE
  mobileOptimized: {
    text: "Continuar",
    mobileFullWidth: true,
    mobileSize: "large",
    mobileFontSize: "text-lg",
    tabletSize: "medium",
    desktopSize: "medium",
    backgroundColor: "#B89B7A",
    borderRadius: "rounded-lg",
    padding: "py-4 px-6",
    marginTop: 16,
    marginBottom: 16,
  },

  // 🎯 BOTÃO DE AÇÃO COM URL
  urlAction: {
    text: "Visite Nosso Site",
    action: "url",
    targetUrl: "https://giselegale.com",
    openInNewTab: true,
    backgroundColor: "#432818",
    textColor: "#ffffff",
    borderColor: "#B89B7A",
    borderWidth: "2px",
    borderRadius: "rounded-full",
    hoverBackgroundColor: "#B89B7A",
    hoverTextColor: "#ffffff",
  },

  // ⚡ BOTÃO DE SUBMIT RÁPIDO
  submitButton: {
    text: "Enviar Resposta",
    label: "AÇÃO",
    action: "submit",
    backgroundColor: "#10B981",
    hoverBackgroundColor: "#059669",
    textColor: "#ffffff",
    clickEffect: true,
    loading: false, // Pode ser true para mostrar spinner
    fontSize: "text-base",
    fontWeight: "font-semibold",
    borderRadius: "rounded-md",
    padding: "py-3 px-6",
  },

  // 🎨 BOTÃO MINIMALISTA
  minimalist: {
    text: "Próximo",
    backgroundColor: "transparent",
    textColor: "#B89B7A",
    borderColor: "#B89B7A",
    borderWidth: "1px",
    borderStyle: "solid",
    hoverBackgroundColor: "#B89B7A",
    hoverTextColor: "#ffffff",
    borderRadius: "rounded-none",
    fontSize: "text-sm",
    fontWeight: "font-normal",
    padding: "py-2 px-4",
    hoverEffect: false,
    boxShadow: "none",
  },

  // 🔒 BOTÃO COM VALIDAÇÃO CUSTOMIZADA
  customValidation: {
    text: "Continuar Quiz",
    conditionalActivation: true,
    validationTarget: "email-input",
    requiresValidInput: true,
    backgroundColor: "#6366F1",
    hoverBackgroundColor: "#4F46E5",
    textColor: "#ffffff",
    borderRadius: "rounded-lg",
    action: "next-step",
    nextStep: "step-03",
    ariaLabel: "Continuar para próxima questão do quiz",
  },

  // 🎪 BOTÃO DIVERTIDO COM ANIMAÇÕES
  playful: {
    text: "🎉 Vamos Lá!",
    backgroundColor: "#F59E0B",
    hoverBackgroundColor: "#D97706",
    textColor: "#ffffff",
    fontSize: "text-2xl",
    fontWeight: "font-bold",
    borderRadius: "rounded-full",
    padding: "py-4 px-8",
    hoverEffect: true,
    clickEffect: true,
    glowEffect: true,
    animationType: "bounce",
    animationDuration: "600ms",
    boxShadow: "shadow-xl",
  },

  // 💼 BOTÃO CORPORATIVO
  corporate: {
    text: "Prosseguir",
    backgroundColor: "#1F2937",
    hoverBackgroundColor: "#374151",
    textColor: "#ffffff",
    fontSize: "text-sm",
    fontWeight: "font-medium",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "rounded-md",
    padding: "py-2.5 px-5",
    boxShadow: "shadow-sm",
    letterSpacing: "tracking-wide",
    textTransform: "uppercase",
  },

  // 🌈 BOTÃO COLORIDO RESPONSIVO
  colorfulResponsive: {
    text: "Descobrir Cores!",
    backgroundColor: "#EC4899",
    hoverBackgroundColor: "#DB2777",
    textColor: "#ffffff",

    // Diferentes tamanhos por dispositivo
    mobileSize: "small",
    mobileFontSize: "text-sm",
    tabletSize: "medium",
    desktopSize: "large",

    // Responsividade de largura
    fullWidth: false,
    mobileFullWidth: true,
    width: "250px", // Desktop fixo

    borderRadius: "rounded-xl",
    hoverEffect: true,
    glowEffect: true,
  },

  // 🛡️ BOTÃO ACESSÍVEL
  accessible: {
    text: "Iniciar Avaliação",
    backgroundColor: "#059669",
    textColor: "#ffffff",
    fontSize: "text-lg",
    padding: "py-4 px-8",
    borderRadius: "rounded-lg",

    // Acessibilidade completa
    ariaLabel: "Iniciar avaliação de estilo pessoal - Duração estimada: 5 minutos",
    title: "Clique para começar seu quiz personalizado",
    tabIndex: 0,

    // Foco visível
    focusColor: "#065F46",

    // Alto contraste
    hoverBackgroundColor: "#047857",
    hoverTextColor: "#ffffff",
  },
};

// 🎨 TEMAS PRÉ-DEFINIDOS
export const BUTTON_THEMES = {
  elegant: {
    backgroundColor: "#8B5A5A",
    textColor: "#FFFFFF",
    borderRadius: "rounded-lg",
    fontFamily: "'Playfair Display', serif",
    fontSize: "text-lg",
    padding: "py-4 px-8",
    boxShadow: "shadow-lg",
  },

  modern: {
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF",
    borderRadius: "rounded-xl",
    fontFamily: "'Inter', sans-serif",
    fontSize: "text-base",
    fontWeight: "font-semibold",
    padding: "py-3 px-6",
    hoverEffect: true,
  },

  vintage: {
    backgroundColor: "#A16207",
    textColor: "#FEF3C7",
    borderColor: "#92400E",
    borderWidth: "2px",
    borderRadius: "rounded-sm",
    fontFamily: "'Times New Roman', serif",
    fontSize: "text-lg",
    letterSpacing: "tracking-wide",
    padding: "py-4 px-8",
  },

  neon: {
    backgroundColor: "#0F172A",
    textColor: "#00FF88",
    borderColor: "#00FF88",
    borderWidth: "1px",
    borderRadius: "rounded-none",
    glowEffect: true,
    fontFamily: "'Courier New', monospace",
    fontSize: "text-sm",
    textTransform: "uppercase",
    padding: "py-2 px-4",
  },
};

// 📱 CONFIGURAÇÕES RESPONSIVAS PRÉ-DEFINIDAS
export const RESPONSIVE_CONFIGS = {
  // Mobile first - cresce com tela
  mobileFirst: {
    mobileSize: "small",
    mobileFontSize: "text-sm",
    tabletSize: "medium",
    desktopSize: "large",
    mobileFullWidth: true,
    fullWidth: false,
  },

  // Desktop first - diminui com tela
  desktopFirst: {
    mobileSize: "medium",
    tabletSize: "large",
    desktopSize: "large",
    mobileFullWidth: false,
    fullWidth: true,
  },

  // Consistente em todos os tamanhos
  consistent: {
    mobileSize: "medium",
    tabletSize: "medium",
    desktopSize: "medium",
    mobileFullWidth: true,
    fullWidth: true,
  },
};

export default BUTTON_EXAMPLES;
