// 🎯 TEMPLATE DE BLOCOS DA ETAPA 01
import Step01Intro from "../editor/steps/Step01Intro";

export const getStep01Template = () => {
  return [
    // 🎯 1. CABEÇALHO DO QUIZ COM LOGO E PROGRESSO
    {
      id: "quiz-intro-header-step01",
      type: "quiz-intro-header",
      properties: {
        // ✨ CONFIGURAÇÕES DO LOGO
        logoUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão - Consultoria de Estilo",
        logoWidth: 120,
        logoHeight: 120,
        
        // ✨ CONFIGURAÇÕES DE PROGRESSO
        progressValue: 0,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        
        // ✨ TEXTOS CONFIGURÁVEIS
        title: "Descubra Seu Estilo Pessoal",
        subtitle: "Quiz Personalizado de Estilo",
        description: "Em poucos minutos, descubra seu estilo predominante",
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "full",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "normal",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 0,
        marginBottom: 16,
        
        // ✨ CONFIGURAÇÕES DE CORES
        backgroundColor: "transparent",
        textColor: "#432818",
        
        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileLogoWidth: 80,
        mobileLogoHeight: 80,
        mobileFontSize: "text-lg",
      },
    },

    // 🎨 2. BARRA DECORATIVA DOURADA
    {
      id: "decorative-bar-step01",
      type: "decorative-bar-inline",
      properties: {
        // ✨ CONFIGURAÇÕES VISUAIS
        width: "100%",
        height: 4,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 3,
        showShadow: true,
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "full",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "none",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 0,
        marginBottom: 24,
        
        // ✨ CONFIGURAÇÕES DE CORES
        backgroundColor: "transparent",
        
        // ✨ CONFIGURAÇÕES DE ANIMAÇÃO
        animationType: "fadeIn",
        animationDuration: 0.5,
        animationDelay: 0.2,
      },
    },

    // 📝 3. TÍTULO PRINCIPAL COM PROPRIEDADES EDITÁVEIS
    {
      id: "main-title-step01",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO CONFIGURÁVEL
        content: "Chega de um guarda-roupa lotado e da sensação de que [#432818]nada combina com você[/#432818].",
        text: "Chega de um guarda-roupa lotado e da sensação de que nada combina com você.",
        
        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        fontSize: "text-3xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        lineHeight: "1.2",
        letterSpacing: "normal",
        
        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-center",
        textWidth: "w-full",
        
        // ✨ CONFIGURAÇÕES DE CORES
        color: "#B89B7A",
        textColor: "#B89B7A",
        backgroundColor: "transparent",
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "large",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "none",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 0,
        marginBottom: 20,
        marginLeft: 0,
        marginRight: 0,
        
        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-2xl",
        mobileLineHeight: "1.3",
        mobileMarginBottom: 16,
        
        // ✨ CONFIGURAÇÕES DE EFEITOS
        hoverEffect: true,
        shadowEffect: false,
        borderEffect: false,
      },
    },

    // 🖼️ 4. IMAGEM HERO RESPONSIVA
    {
      id: "hero-image-step01",
      type: "image-display-inline",
      properties: {
        // ✨ CONFIGURAÇÕES DA IMAGEM
        src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp",
        alt: "Transforme seu guarda-roupa - Descubra seu estilo pessoal",
        width: 600,
        height: 400,
        
        // ✨ CONFIGURAÇÕES DE ESTILO
        className: "object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg",
        borderRadius: 12,
        shadow: true,
        objectFit: "cover",
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: "text-center",
        containerWidth: "large",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "small",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 0,
        marginBottom: 20,
        
        // ✨ CONFIGURAÇÕES DE CORES
        backgroundColor: "transparent",
        borderColor: "#B89B7A",
        
        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileWidth: 350,
        mobileHeight: 250,
        mobileClassName: "object-cover w-full h-60 rounded-lg mx-auto shadow-md",
        
        // ✨ CONFIGURAÇÕES DE EFEITOS
        hoverEffect: true,
        zoomOnHover: false,
        lazyLoading: true,
      },
    },

    // 💬 5. TEXTO MOTIVACIONAL UNIFICADO
    {
      id: "motivation-unified-step01",
      type: "text-inline",
      properties: {
        // ✨ CONTEÚDO CONFIGURÁVEL
        content: "Em poucos minutos, descubra seu [#B89B7A]**Estilo Predominante**[/#B89B7A] — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
        text: "Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.",
        
        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        fontSize: "text-xl",
        fontWeight: "font-normal",
        fontFamily: "Inter, sans-serif",
        lineHeight: "1.6",
        letterSpacing: "normal",
        
        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: "text-center",
        textWidth: "w-full",
        
        // ✨ CONFIGURAÇÕES DE CORES
        color: "#432818",
        textColor: "#432818",
        backgroundColor: "transparent",
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "full",
        spacing: "small",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 24,
        marginBottom: 24,
        marginLeft: 0,
        marginRight: 0,
        
        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: "text-lg",
        mobileLineHeight: "1.5",
        mobileMarginTop: 16,
        mobileMarginBottom: 16,
        
        // ✨ CONFIGURAÇÕES DE EFEITOS
        hoverEffect: false,
        shadowEffect: false,
        borderEffect: false,
      },
    },

    // 📋 6. CAMPO DE ENTRADA DE NOME
    {
      id: "name-input-step01",
      type: "form-input",
      properties: {
        // ✨ CONFIGURAÇÕES DO CAMPO
        label: "COMO VOCÊ GOSTARIA DE SER CHAMADA?",
        placeholder: "Digite seu nome aqui...",
        name: "userName",
        inputType: "text",
        required: true,
        
        // ✨ CONFIGURAÇÕES DE VALIDAÇÃO
        minLength: 2,
        maxLength: 50,
        pattern: "[A-Za-zÀ-ÿ\\s]+",
        helperText: "Seu nome será usado para personalizar sua experiência",
        errorMessage: "Por favor, digite um nome válido",
        
        // ✨ CONFIGURAÇÕES DE ESTILO
        borderColor: "#B89B7A",
        focusColor: "#A38A69",
        backgroundColor: "#ffffff",
        textColor: "#432818",
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: "text-center",
        containerWidth: "medium",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "small",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 0,
        marginBottom: 20,
        
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

    // 🎯 7. BOTÃO CTA PRINCIPAL
    {
      id: "cta-button-step01",
      type: "button-inline",
      properties: {
        // ✨ CONFIGURAÇÕES DO TEXTO
        text: "✨ Quero Descobrir meu Estilo Agora! ✨",
        
        // ✨ CONFIGURAÇÕES DE ESTILO
        variant: "primary",
        size: "large",
        fullWidth: true,
        
        // ✨ CONFIGURAÇÕES DE CORES
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        borderColor: "#B89B7A",
        hoverBackgroundColor: "#A38A69",
        hoverTextColor: "#ffffff",
        activeBackgroundColor: "#8B7355",
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: "text-center",
        containerWidth: "large",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "small",
        
        // ✨ CONFIGURAÇÕES DE APARÊNCIA
        borderRadius: "rounded-full",
        padding: "py-4 px-8",
        fontSize: "text-lg",
        fontWeight: "font-bold",
        boxShadow: "shadow-xl",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 0,
        marginBottom: 24,
        
        // ✨ CONFIGURAÇÕES DE COMPORTAMENTO
        requiresValidInput: true,
        action: "next-step",
        disabled: false,
        
        // ✨ CONFIGURAÇÕES DE EFEITOS
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

    // ⚖️ 8. AVISO LEGAL E COPYRIGHT
    {
      id: "legal-notice-step01",
      type: "legal-notice-inline",
      properties: {
        // ✨ CONFIGURAÇÕES DE CONTEÚDO
        privacyText: "Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade",
        copyrightText: "© 2025 Gisele Galvão - Todos os direitos reservados",
        termsText: "Termos de Uso",
        
        // ✨ CONFIGURAÇÕES DE ÍCONE
        showIcon: true,
        iconType: "shield",
        iconColor: "#B89B7A",
        
        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA
        textAlign: "text-center",
        textSize: "text-xs",
        fontSize: 12,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        lineHeight: "1.4",
        
        // ✨ CONFIGURAÇÕES DE CORES
        textColor: "#6B7280",
        linkColor: "#B89B7A",
        backgroundColor: "transparent",
        
        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: "full",
        containerPosition: "center",
        gridColumns: "auto",
        spacing: "small",
        
        // ✨ CONFIGURAÇÕES DE MARGENS
        marginTop: 24,
        marginBottom: 16,
        
        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: 11,
        mobileLineHeight: "1.3",
        mobileMarginTop: 16,
        mobileMarginBottom: 12,
        
        // ✨ CONFIGURAÇÕES DE LINKS
        privacyUrl: "/privacy-policy",
        termsUrl: "/terms-of-service",
        linkTarget: "_blank",
        
        // ✨ CONFIGURAÇÕES DE COMPORTAMENTO
        showPrivacyLink: true,
        showTermsLink: true,
        showCopyright: true,
      },
    },
  ];
};

export default Step01Intro;