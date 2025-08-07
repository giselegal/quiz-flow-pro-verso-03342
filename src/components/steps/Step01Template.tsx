import Step01Intro from "../editor/steps/Step01Intro";

export interface Step01Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step01 = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step01Props) => {
  return <div className="step-01">{/* Conteúdo da Etapa 1 renderizado aqui */}</div>;
};

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 1 - MODELO EXATO
export const getStep01Template = () => {
  return [
    // 🎯 CABEÇALHO DO QUIZ COM LOGO E PROGRESSO
    {
      id: "quiz-intro-header-step01",
      type: "quiz-intro-header",
      properties: {
        logoUrl:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 120,
        logoHeight: 120,
        progressValue: 0,
        progressMax: 100,
        showBackButton: false,
        showProgress: false,
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "full", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "auto", // w-full md:w-[calc(50%-0.5rem)]
        spacing: "normal", // p-4 (16px padding)
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: "transparent",
      },
    },

    // 🎨 BARRA DECORATIVA DOURADA
    {
      id: "decorative-bar-step01",
      type: "decorative-bar-inline",
      properties: {
        width: "100%",
        height: 4,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 3,
        marginTop: 8,
        marginBottom: 24,
        showShadow: true,
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "full", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "auto", // w-full md:w-[calc(50%-0.5rem)]
        spacing: "normal", // p-4 (16px padding)
        backgroundColor: "transparent",
      },
    },

    // 📝 TÍTULO PRINCIPAL COM PROPRIEDADES EDITÁVEIS
    {
      id: "main-title-step01",
      type: "text-inline",
      properties: {
        content: "Chega de um guarda-roupa lotado e da sensação de que [#432818]nada combina com você[/#432818].",
        fontSize: "text-3xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        textAlign: "text-center",
        color: "#B89B7A", // Cor dourada da marca como padrão (texto normal)
        marginBottom: 32,
        lineHeight: "1.2",
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "large", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "full", // 🎯 Alterado de "auto" para "full" para usar 100% da largura
        spacing: "normal", // p-4 (16px padding)
        marginTop: 0,
        backgroundColor: "transparent",
      },
    },

    // 🖼️ IMAGEM HERO RESPONSIVA
    {
      id: "hero-image-step01",
      type: "image-display-inline",
      properties: {
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
        alt: "Transforme seu guarda-roupa",
        width: 600,
        height: 400,
        className: "object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg",
        textAlign: "text-center",
        marginBottom: 32,
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "large", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "auto", // w-full md:w-[calc(50%-0.5rem)]
        spacing: "normal", // p-4 (16px padding)
        marginTop: 0,
        backgroundColor: "transparent",
      },
    },

    // 💬 TEXTO MOTIVACIONAL UNIFICADO COM MÚLTIPLAS CORES E FORMATAÇÃO
    {
      id: "motivation-unified-step01",
      type: "text-inline",
      properties: {
        content: "Em poucos minutos, descubra seu [#B89B7A]**Estilo Predominante**[/#B89B7A] — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
        fontSize: "text-xl",
        textAlign: "text-center",
        color: "#432818", // Cor marrom escuro (texto padrão)
        marginTop: 0,
        marginBottom: 40,
        lineHeight: "1.6",
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "medium", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "full", // 🎯 Largura 100% para melhor apresentação
        spacing: "normal", // p-4 (16px padding)
        backgroundColor: "transparent",
      },
    },

    // 📋 CAMPO DE ENTRADA DE NOME
    {
      id: "name-input-step01",
      type: "form-input",
      properties: {
        label: "COMO VOCÊ GOSTARIA DE SER CHAMADA?",
        placeholder: "Digite seu nome aqui...",
        required: true,
        inputType: "text",
        helperText: "Seu nome será usado para personalizar sua experiência",
        name: "userName",
        textAlign: "text-center",
        marginBottom: 32,
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "medium", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "auto", // w-full md:w-[calc(50%-0.5rem)]
        spacing: "normal", // p-4 (16px padding)
        marginTop: 0,
        backgroundColor: "transparent",
      },
    },

    // 🎯 BOTÃO CTA PRINCIPAL
    {
      id: "cta-button-step01",
      type: "button-inline",
      properties: {
        text: "✨ Quero Descobrir meu Estilo Agora! ✨",
        variant: "primary",
        size: "large",
        fullWidth: true,
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        requiresValidInput: true,
        textAlign: "text-center",
        borderRadius: "rounded-full",
        padding: "py-4 px-8",
        fontSize: "text-lg",
        fontWeight: "font-bold",
        boxShadow: "shadow-xl",
        hoverEffect: true,
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "large", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "auto", // w-full md:w-[calc(50%-0.5rem)]
        spacing: "normal", // p-4 (16px padding)
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // ⚖️ AVISO LEGAL E COPYRIGHT
    {
      id: "legal-notice-step01",
      type: "legal-notice-inline",
      properties: {
        privacyText:
          "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",
        copyrightText: "© 2025 Gisele Galvão - Todos os direitos reservados",
        showIcon: true,
        iconType: "shield",
        textAlign: "text-center",
        textSize: "text-xs",
        textColor: "#6B7280",
        linkColor: "#B89B7A",
        marginTop: 24,
        marginBottom: 0,
        backgroundColor: "transparent",
        // ⚙️ PROPRIEDADES DE CONTAINER E POSICIONAMENTO
        containerWidth: "full", // Opções: "full", "large", "medium", "small"
        containerPosition: "center", // Opções: "left", "center", "right"
        gridColumns: "auto", // w-full md:w-[calc(50%-0.5rem)]
        spacing: "compact", // p-2 (8px padding) para textos menores
      },
    },
  ];
};

export default Step01Intro;
