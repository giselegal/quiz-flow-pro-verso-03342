// 🎯 ETAPA 1 - CONFIGURAÇÃO MODULAR BASEADA EM JSON
// Template baseado no JSON fornecido pelo usuário para Quiz de Estilo Pessoal

export const getStep01Template = () => {
  return [
    // 🎯 1. CABEÇALHO DO QUIZ - QUIZ INTRO HEADER
    {
      id: "quiz-intro-header-modular",
      type: "quiz-intro-header",
      properties: {
        // ✨ CONFIGURAÇÕES DO LOGO (baseado no JSON)
        logoUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão - Quiz de Estilo Pessoal",
        logoWidth: 120,
        logoHeight: 120,

        // ✨ CONFIGURAÇÕES DE PROGRESSO
        progressValue: 0,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,

        // ✨ TEXTOS CONFIGURÁVEIS (do JSON meta)
        title: "Quiz Estilo Pessoal - Template Completo",
        subtitle: "Modelo completo para quiz de estilo pessoal, pronto para sistemas de moda",
        description: "Versão 1.2.3 - by Gisele Legal",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "full",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "normal",
        marginTop: 0,
        marginBottom: 16,

        // ✨ CONFIGURAÇÕES DE CORES (do JSON design)
        backgroundColor: "#FAF9F7", // backgroundColor do JSON
        textColor: "#432818", // secondaryColor do JSON

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileLogoWidth: 80,
        mobileLogoHeight: 80,
        mobileFontSize: "text-lg",
      },
    },

    // 🎨 2. BARRA DECORATIVA (usando cores do JSON design)
    {
      id: "decorative-bar-modular",
      type: "decorative-bar-inline",
      properties: {
        // ✨ CONFIGURAÇÕES VISUAIS (cores do JSON)
        width: "100%",
        height: 6, // progressBar height do JSON
        color: "#B89B7A", // primaryColor do JSON
        gradientColors: ["#B89B7A", "#aa6b5d", "#B89B7A"], // primary + accent do JSON
        borderRadius: 3,
        showShadow: true,

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "full",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "none",
        marginTop: 0,
        marginBottom: 24,

        // ✨ CONFIGURAÇÕES DE CORES
        backgroundColor: "#F3E8E6", // progressBar background do JSON

        // ✨ CONFIGURAÇÕES DE ANIMAÇÃO
        animationType: "fadeIn",
        animationDuration: 0.5,
        animationDelay: 0.2,
      },
    },

    // 📝 3. TÍTULO PRINCIPAL (baseado no step intro do JSON)
    {
      id: "main-title-modular",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO (do JSON steps[0] - intro)
        content: "Bem-vinda ao Quiz de Estilo",
        text: "Bem-vinda ao Quiz de Estilo",

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA (do JSON design.fontFamily)
        fontSize: "text-4xl",
        fontWeight: "font-bold",
        fontFamily: "'Playfair Display', 'Inter', serif", // do JSON design.fontFamily
        lineHeight: "1.2",
        letterSpacing: "normal",

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-center",
        textWidth: "w-full",

        // ✨ CONFIGURAÇÕES DE CORES (do JSON design)
        color: "#432818", // secondaryColor do JSON
        textColor: "#432818",
        backgroundColor: "transparent",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "large",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "normal",
        marginTop: 0,
        marginBottom: 20,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-3xl",
        mobileLineHeight: "1.3",
        mobileMarginBottom: 16,
      },
    },

    // 📄 4. DESCRIÇÃO SUPERIOR (do JSON steps[0].descriptionTop)
    {
      id: "description-top-modular",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO (do JSON)
        content: "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",
        text: "Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.",

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        fontSize: "text-xl",
        fontWeight: "font-normal",
        fontFamily: "'Playfair Display', 'Inter', serif",
        lineHeight: "1.6",
        letterSpacing: "normal",

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-center",
        textWidth: "w-full",

        // ✨ CONFIGURAÇÕES DE CORES
        color: "#432818", // secondaryColor do JSON
        textColor: "#432818",
        backgroundColor: "transparent",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "normal",
        marginTop: 0,
        marginBottom: 24,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-lg",
        mobileLineHeight: "1.5",
        mobileMarginBottom: 20,
      },
    },

    // 🖼️ 5. IMAGEM DE INTRODUÇÃO (do JSON steps[0].imageIntro)
    {
      id: "intro-image-modular",
      type: "image-display-inline",
      properties: {
        // ✨ CONFIGURAÇÕES DA IMAGEM (do JSON)
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911667/WhatsApp_Image_2025-04-02_at_09.40.53_cv8p5y.jpg",
        alt: "Quiz de Estilo Pessoal - Imagem Introdutória",
        width: 600,
        height: 400,

        // ✨ CONFIGURAÇÕES DE ESTILO (baseado no JSON design.card)
        className: "object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg",
        borderRadius: 16, // do JSON design.card.borderRadius
        shadow: true, // do JSON design.card.shadow
        objectFit: "cover",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: "text-center",
        containerWidth: "large",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "normal",
        marginTop: 0,
        marginBottom: 24,

        // ✨ CONFIGURAÇÕES DE CORES
        backgroundColor: "#fff", // do JSON design.card.background
        borderColor: "#B89B7A", // primaryColor do JSON

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileWidth: 350,
        mobileHeight: 280,
        mobileClassName: "object-cover w-full h-72 rounded-lg mx-auto shadow-md",

        // ✨ CONFIGURAÇÕES DE EFEITOS
        hoverEffect: true,
        zoomOnHover: false,
        lazyLoading: true,
      },
    },

    // 📝 6. DESCRIÇÃO INFERIOR (do JSON steps[0].descriptionBottom)
    {
      id: "description-bottom-modular",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO (do JSON)
        content: "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
        text: "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        fontSize: "text-lg",
        fontWeight: "font-normal",
        fontFamily: "'Playfair Display', 'Inter', serif",
        lineHeight: "1.6",
        letterSpacing: "normal",

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-center",
        textWidth: "w-full",

        // ✨ CONFIGURAÇÕES DE CORES
        color: "#432818", // secondaryColor do JSON
        textColor: "#432818",
        backgroundColor: "transparent",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "normal",
        marginTop: 0,
        marginBottom: 32,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-base",
        mobileLineHeight: "1.5",
        mobileMarginBottom: 24,
      },
    },

    // 🏷️ 7. LABEL DO INPUT (do JSON steps[0].inputLabel)
    {
      id: "input-label-modular",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO (do JSON)
        content: "NOME *",
        text: "NOME *",

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        fontSize: "text-sm",
        fontWeight: "font-semibold",
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.4",
        letterSpacing: "0.05em",

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-left",
        textWidth: "w-full",

        // ✨ CONFIGURAÇÕES DE CORES
        color: "#432818", // secondaryColor do JSON
        textColor: "#432818",
        backgroundColor: "transparent",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "tight",
        marginTop: 0,
        marginBottom: 8,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-sm",
        mobileMarginBottom: 6,
      },
    },

    // 📋 8. CAMPO DE ENTRADA DE NOME (baseado no JSON steps[0])
    {
      id: "name-input-modular",
      type: "form-input",
      properties: {
        // ✨ CONFIGURAÇÕES DO CAMPO (do JSON)
        label: "", // removido porque temos um componente separado acima
        placeholder: "Digite seu nome", // do JSON steps[0].inputPlaceholder
        name: "userName",
        inputType: "text", // do JSON steps[0].inputType
        required: true, // do JSON steps[0].required

        // ✨ CONFIGURAÇÕES DE VALIDAÇÃO (do JSON steps[0].validation)
        minLength: 2, // do JSON steps[0].validation.minLength
        maxLength: 50,
        pattern: "[A-Za-zÀ-ÿ\\s]+",
        helperText: "Seu nome será usado para personalizar sua experiência",
        errorMessage: "Digite seu nome para continuar", // do JSON steps[0].validation.errorMessage

        // ✨ CONFIGURAÇÕES DE ESTILO (baseado no JSON design.button)
        borderColor: "#B89B7A", // primaryColor do JSON
        focusColor: "#aa6b5d", // accentColor do JSON
        backgroundColor: "#ffffff",
        textColor: "#432818", // secondaryColor do JSON

        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: "text-left",
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "normal",
        marginTop: 0,
        marginBottom: 24,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileWidth: "100%",
        mobilePadding: "12px",
        mobileFontSize: "16px",

        // ✨ CONFIGURAÇÕES DE COMPORTAMENTO
        autoFocus: false,
        autoComplete: "given-name",
        spellCheck: true,
      },
    },

    // 🎯 9. BOTÃO CTA (baseado no JSON steps[0].buttonText e design.button)
    {
      id: "cta-button-modular",
      type: "button-inline",
      properties: {
        // ✨ CONFIGURAÇÕES DO TEXTO (do JSON)
        text: "Quero Descobrir Meu Estilo!", // Texto quando habilitado

        // ✨ CONFIGURAÇÕES DE ESTILO (do JSON design.button)
        variant: "primary",
        size: "large",
        fullWidth: true,

        // ✨ CONFIGURAÇÕES DE CORES (do JSON design.button)
        backgroundColor: "#B89B7A", // do JSON design.button.background (gradient simplificado)
        textColor: "#fff", // do JSON design.button.textColor
        borderColor: "#B89B7A",
        hoverBackgroundColor: "#aa6b5d", // accentColor do JSON
        hoverTextColor: "#fff",
        activeBackgroundColor: "#8B7355",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: "text-center",
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "normal",

        // ✨ CONFIGURAÇÕES DE APARÊNCIA (do JSON design.button)
        borderRadius: "rounded-lg", // do JSON design.button.borderRadius
        padding: "py-4 px-8",
        fontSize: "text-lg",
        fontWeight: "font-bold",
        boxShadow: "shadow-lg", // baseado no JSON design.button.shadow

        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 0,
        marginBottom: 32,

        // ✨ CONFIGURAÇÕES DE COMPORTAMENTO
        requiresValidInput: true,
        action: "next-step",
        disabled: false,

        // ✨ CONFIGURAÇÕES DE EFEITOS (do JSON design.animations.button)
        hoverEffect: true,
        clickEffect: true,
        loadingState: false,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFullWidth: true,
        mobilePadding: "py-3 px-6",
        mobileFontSize: "text-base",

        // ✨ CONFIGURAÇÕES DE TRANSIÇÃO
        transitionDuration: "0.2s",
        transitionEasing: "ease-in-out",
      },
    },

    // 📜 10. TEXTO DE PRIVACIDADE (do JSON steps[0].privacyText)
    {
      id: "privacy-text-modular",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO (do JSON)
        content: "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",
        text: "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        fontSize: "text-xs",
        fontWeight: "font-normal",
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.4",
        letterSpacing: "normal",

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-center",
        textWidth: "w-full",

        // ✨ CONFIGURAÇÕES DE CORES
        color: "#6B7280", // cor mais suave para texto legal
        textColor: "#6B7280",
        backgroundColor: "transparent",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "tight",
        marginTop: 0,
        marginBottom: 16,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-xs",
        mobileLineHeight: "1.3",
        mobileMarginBottom: 12,
      },
    },

    // ⚖️ 11. FOOTER COPYRIGHT (do JSON steps[0].footerText)
    {
      id: "footer-copyright-modular",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO (do JSON)
        content: "© 2025 Gisele Galvão - Todos os direitos reservados",
        text: "© 2025 Gisele Galvão - Todos os direitos reservados",

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        fontSize: "text-xs",
        fontWeight: "font-normal",
        fontFamily: "'Inter', sans-serif",
        lineHeight: "1.4",
        letterSpacing: "normal",

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-center",
        textWidth: "w-full",

        // ✨ CONFIGURAÇÕES DE CORES
        color: "#6B7280", // cor mais suave para footer
        textColor: "#6B7280",
        backgroundColor: "transparent",

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "full",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "tight",
        marginTop: 24,
        marginBottom: 16,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-xs",
        mobileLineHeight: "1.3",
        mobileMarginTop: 16,
        mobileMarginBottom: 12,
      },
    },
  ];
};
