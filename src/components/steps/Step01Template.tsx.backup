// 🎯 ETAPA 1 - CONFIGURAÇÃO MODULAR BASEADA EM PRODUÇÃO
// Template otimizado baseado no QuizIntro em produção com funcionalidades avançadas
// 🎯 INTEGRAÇÃO RECOMENDADA: useBlockForm para gerenciamento de estado do formulário

export const getStep01Template = () => {
  return [
    // 🎯 1. CABEÇALHO DO QUIZ - QUIZ INTRO HEADER (OTIMIZADO PARA PRODUÇÃO)
    {
      id: 'quiz-intro-header-modular',
      type: 'quiz-intro-header',
      properties: {
        // ✨ URLS OTIMIZADAS DO CLOUDINARY (baseado na produção)
        logoUrl:
          'https://res.cloudinary.com/der8kogzu/image/upload/f_webp,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.webp',
        logoUrlFallback:
          'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_120,h_50,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 120,
        logoHeight: 50,

        // ✨ CONFIGURAÇÕES DE PROGRESSO
        progressValue: 0,
        progressMax: 100,
        showBackButton: false,
        showProgress: false, // Desabilitado na introdução

        // ✨ CONFIGURAÇÕES DE PERFORMANCE (baseado na produção)
        loading: 'eager',
        fetchPriority: 'high',
        decoding: 'async',

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: 'full',
        containerPosition: 'center',
        gridColumns: 'auto',
        spacing: 'normal',
        marginTop: 0,
        marginBottom: 8,

        // ✨ CONFIGURAÇÕES DE CORES (design system da produção)
        backgroundColor: '#FEFEFE',
        textColor: '#432818',

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileLogoWidth: 120,
        mobileLogoHeight: 50,
        mobileFontSize: 'text-lg',

        // ✨ ACESSIBILIDADE
        ariaLabel: 'Logo Gisele Galvão - Quiz de Estilo Pessoal',
        role: 'img',
      },
    },

    // 🎨 2. BARRA DECORATIVA (usando cores do JSON design)
    {
      id: 'decorative-bar-modular',
      type: 'decorative-bar-inline',
      properties: {
        // ✨ CONFIGURAÇÕES VISUAIS (cores do JSON)
        width: '100%',
        height: 6, // progressBar height do JSON
        color: '#B89B7A', // primaryColor do JSON
        gradientColors: ['#B89B7A', '#aa6b5d', '#B89B7A'], // primary + accent do JSON
        borderRadius: 3,
        showShadow: true,

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: 'full',
        containerPosition: 'center',
        gridColumns: 'auto',
        spacing: 'none',
        marginTop: 0,
        marginBottom: 24,

        // ✨ CONFIGURAÇÕES DE CORES
        backgroundColor: '#F3E8E6', // progressBar background do JSON

        // ✨ CONFIGURAÇÕES DE ANIMAÇÃO
        animationType: 'fadeIn',
        animationDuration: 0.5,
        animationDelay: 0.2,
      },
    },

    // 📝 3. TÍTULO PRINCIPAL (BASEADO NA PRODUÇÃO)
    {
      id: 'main-title-modular',
      type: 'text-inline',
      properties: {
        // ✨ CONTEÚDO EXATO DA PRODUÇÃO
        content:
          '<span class="text-[#B89B7A]">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com <span class="text-[#B89B7A]">Você</span>.',
        text: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA (Playfair Display da produção)
        fontSize: 'text-2xl sm:text-3xl md:text-4xl',
        fontWeight: 'font-bold',
        fontFamily: '"Playfair Display", serif',
        lineHeight: '1.2',
        letterSpacing: 'normal',

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: 'text-center',
        textWidth: 'w-full',

        // ✨ CONFIGURAÇÕES DE CORES (design system da produção)
        color: '#432818',
        textColor: '#432818',
        backgroundColor: 'transparent',

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: 'large',
        containerPosition: 'center',
        gridColumns: 'full',
        spacing: 'normal',
        marginTop: 0,
        marginBottom: 8,

        // ✨ CONFIGURAÇÕES RESPONSIVAS (da produção)
        mobileFontSize: 'text-2xl',
        mobileLineHeight: '1.3',
        mobileMarginBottom: 8,

        // ✨ CLASSES CSS CUSTOMIZADAS
        className: 'playfair-display leading-tight px-2',
        customStyle: { fontWeight: 400 },
      },
    },

    // �️ 4. IMAGEM DE INTRODUÇÃO (OTIMIZADA PARA LCP - BASEADA NA PRODUÇÃO)
    {
      id: 'intro-image-modular',
      type: 'image-display-inline',
      properties: {
        // ✨ URLS OTIMIZADAS DO CLOUDINARY (múltiplos formatos para performance)
        src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
        srcWebp:
          'https://res.cloudinary.com/der8kogzu/image/upload/f_webp,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.webp',
        srcFallback:
          'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
        alt: 'Descubra seu estilo predominante e transforme seu guarda-roupa',
        width: 300,
        height: 204,

        // ✨ CONFIGURAÇÕES DE PERFORMANCE (LCP otimizado)
        loading: 'eager',
        fetchPriority: 'high',
        decoding: 'async',
        id: 'lcp-image',

        // ✨ CONFIGURAÇÕES DE ESTILO (da produção)
        className: 'w-full h-full object-contain',
        borderRadius: 8, // rounded-lg da produção
        shadow: true,
        objectFit: 'contain',
        aspectRatio: '1.47',
        maxHeight: '204px',

        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: 'text-center',
        containerWidth: 'medium',
        containerPosition: 'center',
        gridColumns: 'auto',
        spacing: 'normal',
        marginTop: 2,
        marginBottom: 24,

        // ✨ CONFIGURAÇÕES DE CORES (da produção)
        backgroundColor: '#F8F5F0', // background placeholder
        borderColor: 'transparent',

        // ✨ CONFIGURAÇÕES RESPONSIVAS (da produção)
        mobileWidth: 300,
        mobileHeight: 204,
        mobileClassName: 'w-full h-full object-contain',

        // ✨ CONFIGURAÇÕES DE CONTAINER (da produção)
        containerStyle: {
          aspectRatio: '1.47',
          maxHeight: '204px',
          overflow: 'hidden',
        },

        // ✨ WEB VITALS E PERFORMANCE
        performanceMarks: ['lcp_rendered'],
      },
    },

    // 📝 5. DESCRIÇÃO PRINCIPAL (TEXTO EXATO DA PRODUÇÃO)
    {
      id: 'description-bottom-modular',
      type: 'text-inline',
      properties: {
        // ✨ CONTEÚDO EXATO DA PRODUÇÃO COM SPANS DESTACADOS
        content:
          'Em poucos minutos, descubra seu <span class="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar looks que realmente refletem sua <span class="font-semibold text-[#432818]">essência</span>, com praticidade e <span class="font-semibold text-[#432818]">confiança</span>.',
        text: 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA (da produção)
        fontSize: 'text-sm sm:text-base',
        fontWeight: 'font-normal',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.6', // leading-relaxed
        letterSpacing: 'normal',

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: 'text-center',
        textWidth: 'w-full',

        // ✨ CONFIGURAÇÕES DE CORES (da produção)
        color: '#6B7280', // text-gray-600
        textColor: '#6B7280',
        backgroundColor: 'transparent',

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: 'medium',
        containerPosition: 'center',
        gridColumns: 'full',
        spacing: 'normal',
        marginTop: 0,
        marginBottom: 32, // mt-8

        // ✨ CONFIGURAÇÕES RESPONSIVAS (da produção)
        mobileFontSize: 'text-sm',
        mobileLineHeight: '1.6',
        mobileMarginBottom: 24,

        // ✨ CLASSES CSS DA PRODUÇÃO
        className: 'leading-relaxed px-2',
      },
    },

    // 🏷️ 6. LABEL DO INPUT (EXATO DA PRODUÇÃO)
    {
      id: 'input-label-modular',
      type: 'text-inline',
      properties: {
        // ✨ CONTEÚDO EXATO DA PRODUÇÃO
        content: 'NOME <span class="text-red-500">*</span>',
        text: 'NOME *',

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA (da produção)
        fontSize: 'text-xs',
        fontWeight: 'font-semibold',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        letterSpacing: '0.05em',

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: 'text-left',
        textWidth: 'w-full',

        // ✨ CONFIGURAÇÕES DE CORES (da produção)
        color: '#432818',
        textColor: '#432818',
        backgroundColor: 'transparent',

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: 'medium',
        containerPosition: 'center',
        gridColumns: 'full',
        spacing: 'tight',
        marginTop: 0,
        marginBottom: 6, // mb-1.5

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: 'text-xs',
        mobileMarginBottom: 6,

        // ✨ ATRIBUTOS HTML (da produção)
        htmlFor: 'name',
        role: 'label',
      },
    },

    // 📋 7. CAMPO DE ENTRADA DE NOME (FUNCIONALIDADES AVANÇADAS DA PRODUÇÃO)
    {
      id: 'name-input-modular',
      type: 'form-input',
      properties: {
        // ✨ CONFIGURAÇÕES BÁSICAS DO CAMPO (da produção)
        label: '',
        placeholder: 'Digite seu nome',
        name: 'name', // mesmo ID da produção
        id: 'name', // mesmo ID da produção
        inputType: 'text',
        required: true,

        // ✨ VALIDAÇÃO AVANÇADA (da produção)
        minLength: 1,
        maxLength: 32, // mesmo limite da produção
        pattern: '[A-Za-zÀ-ÿ\\s]+',
        helperText: '',
        errorMessage: 'Por favor, digite seu nome para continuar', // mensagem exata da produção

        // ✨ CONFIGURAÇÕES DE ESTILO AVANÇADAS (da produção)
        borderColor: '#B89B7A',
        borderColorError: '#EF4444', // red-500
        borderWidth: '2px', // border-2
        focusColor: '#A1835D', // primaryDark da produção
        focusRingColor: '#A1835D',
        focusRingWidth: '2px',
        focusRingOffset: '2px',
        backgroundColor: '#FEFEFE', // exato da produção
        textColor: '#432818',

        // ✨ CONFIGURAÇÕES DE LAYOUT
        textAlign: 'text-left',
        containerWidth: 'full', // w-full da produção
        containerPosition: 'center',
        gridColumns: 'auto',
        spacing: 'normal',
        marginTop: 0,
        marginBottom: 24, // space-y-6

        // ✨ CONFIGURAÇÕES RESPONSIVAS (da produção)
        mobileWidth: '100%',
        mobilePadding: '10px', // p-2.5
        mobileFontSize: '16px', // evita zoom no iOS

        // ✨ CONFIGURAÇÕES DE COMPORTAMENTO AVANÇADAS (da produção)
        autoFocus: true, // autoFocus da produção
        autoComplete: 'off', // desabilitado na produção
        autoCorrect: 'off',
        autoCapitalize: 'words',
        spellCheck: false,
        inputMode: 'text',

        // ✨ ACESSIBILIDADE AVANÇADA (da produção)
        ariaRequired: 'true',
        ariaInvalid: false,
        ariaDescribedBy: 'name-error',

        // ✨ ESTADOS E HOOKS (da produção)
        useStateHook: true, // indica que deve usar useState
        errorStateVar: 'error', // nome da variável de erro
        valueStateVar: 'nome', // nome da variável de valor
        onChangeHandler: true, // indica que precisa de onChange personalizado
        errorClearing: true, // limpa erro ao digitar

        // ✨ CLASSES CSS CUSTOMIZADAS (da produção)
        className:
          'w-full p-2.5 bg-[#FEFEFE] rounded-md border-2 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-offset-2 focus:ring-offset-[#FEFEFE] focus-visible:ring-offset-[#FEFEFE]',
        classNameError: 'border-red-500 focus:ring-red-500 focus-visible:ring-red-500',
        classNameValid: 'border-[#B89B7A] focus:ring-[#A1835D] focus-visible:ring-[#A1835D]',
      },
    },

    // 🎯 8. BOTÃO CTA AVANÇADO (FUNCIONALIDADES COMPLETAS DA PRODUÇÃO)
    {
      id: 'cta-button-modular',
      type: 'button-inline',
      properties: {
        // ✨ TEXTOS CONDICIONAIS (da produção)
        text: 'Quero Descobrir meu Estilo Agora!', // texto quando habilitado
        textWhenDisabled: 'Digite seu nome para continuar', // texto quando desabilitado
        label: '',

        // ✨ ESTILO E VARIANTE
        variant: 'primary',
        size: 'large',

        // ✨ CORES EXATAS DA PRODUÇÃO
        backgroundColor: '#B89B7A', // primary
        backgroundColorDisabled: 'rgba(184, 155, 122, 0.5)', // #B89B7A/50
        textColor: '#ffffff',
        textColorDisabled: 'rgba(255, 255, 255, 0.9)', // text-white/90
        borderColor: '#B89B7A',
        hoverBackgroundColor: '#A1835D', // primaryDark
        activeBackgroundColor: '#947645', // mais escuro
        focusColor: '#B89B7A',

        // ✨ TAMANHO E LAYOUT RESPONSIVO (da produção)
        fullWidth: true,
        width: 'auto',
        height: 'auto',
        minWidth: '200px',
        maxWidth: 'none',

        // ✨ TIPOGRAFIA (da produção)
        fontSize: 'text-sm sm:text-base md:text-lg',
        fontWeight: 'font-semibold',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.5',
        letterSpacing: 'normal',
        textTransform: 'none',

        // ✨ BORDAS E CANTOS ARREDONDADOS (da produção)
        borderRadius: 'rounded-md', // da produção
        borderWidth: '0px', // sem borda na produção
        borderStyle: 'solid',

        // ✨ ESPAÇAMENTO (da produção)
        padding: 'py-2 px-3 sm:py-3 sm:px-4 md:py-3.5',
        paddingX: '',
        paddingY: '',

        // ✨ MARGENS
        marginTop: 0,
        marginBottom: 4, // pequena margem para o texto de privacidade
        marginLeft: 0,
        marginRight: 0,

        // ✨ EFEITOS E SOMBRAS (da produção)
        boxShadow: 'shadow-md hover:shadow-lg',
        hoverEffect: true,
        clickEffect: true,
        glowEffect: false,
        gradientBackground: false,

        // ✨ COMPORTAMENTO E VALIDAÇÃO CONDICIONAIS (FUNCIONALIDADE PRINCIPAL DA PRODUÇÃO)
        conditionalActivation: true, // funcionalidade chave
        requiresValidInput: true,
        validationTarget: 'name-input-modular',
        validationFunction: 'nome.trim()', // expressão JavaScript da produção
        disabled: false, // controlado por estado
        loading: false,

        // ✨ NAVEGAÇÃO E AÇÃO (da produção)
        action: 'custom', // usa função personalizada
        customAction: 'handleSubmit', // nome da função da produção
        onSubmitFunction: true, // indica que precisa da função handleSubmit
        preventDefault: true, // e.preventDefault()
        stopPropagation: false,
        nextStep: 'step-02',
        targetUrl: '',
        openInNewTab: false,
        scrollToTop: true,

        // ✨ RESPONSIVIDADE DETALHADA (da produção)
        mobileFullWidth: true,
        mobileSize: 'medium',
        mobileFontSize: 'text-sm',
        tabletSize: 'large',
        desktopSize: 'large',

        // ✨ ANIMAÇÕES E TRANSIÇÕES (da produção)
        animationType: 'scale', // hover:scale-[1.01]
        animationDuration: '300ms', // transition-all duration-300
        animationDelay: '0ms',
        transitionEasing: 'ease-in-out',
        hoverScale: '1.01', // transform hover:scale-[1.01]

        // ✨ LAYOUT AVANÇADO
        textAlign: 'text-center',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        position: 'relative',
        zIndex: 'auto',

        // ✨ ACESSIBILIDADE AVANÇADA (da produção)
        ariaLabel: 'Iniciar quiz de estilo pessoal',
        ariaDisabled: false, // controlado por estado
        title: 'Clique para descobrir seu estilo',
        tabIndex: 0,
        role: 'button',
        type: 'submit', // type="submit" da produção

        // ✨ CLASSES CSS CUSTOMIZADAS (da produção)
        className:
          'w-full py-2 px-3 text-sm font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-offset-2 sm:py-3 sm:px-4 sm:text-base md:py-3.5 md:text-lg',
        classNameEnabled:
          'bg-[#B89B7A] text-white hover:bg-[#A1835D] active:bg-[#947645] hover:shadow-lg transform hover:scale-[1.01]',
        classNameDisabled: 'bg-[#B89B7A]/50 text-white/90 cursor-not-allowed',

        // ✨ ESTADOS E HOOKS (da produção)
        useConditionalRendering: true, // renderização condicional baseada no estado
        conditionalExpression: 'nome.trim()', // expressão da produção

        // ✨ PERFORMANCE E WEB VITALS
        performanceMarks: ['user-interaction'],
      },
    },

    // 📜 9. TEXTO DE PRIVACIDADE (EXATO DA PRODUÇÃO)
    {
      id: 'privacy-text-modular',
      type: 'text-inline',
      properties: {
        // ✨ CONTEÚDO EXATO DA PRODUÇÃO COM LINK
        content:
          'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa <a href="#" class="text-[#B89B7A] hover:text-[#A1835D] underline focus:outline-none focus:ring-1 focus:ring-[#B89B7A] rounded">política de privacidade</a>',
        text: 'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA (da produção)
        fontSize: 'text-xs',
        fontWeight: 'font-normal',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        letterSpacing: 'normal',

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: 'text-center',
        textWidth: 'w-full',

        // ✨ CONFIGURAÇÕES DE CORES (da produção)
        color: '#6B7280', // text-gray-500
        textColor: '#6B7280',
        backgroundColor: 'transparent',

        // ✨ CONFIGURAÇÕES DE LAYOUT
        containerWidth: 'medium',
        containerPosition: 'center',
        gridColumns: 'full',
        spacing: 'tight',
        marginTop: 4, // pt-1 da produção
        marginBottom: 24, // espaço para o footer

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: 'text-xs',
        mobileLineHeight: '1.3',
        mobileMarginBottom: 20,

        // ✨ ACESSIBILIDADE DO LINK
        linkProps: {
          href: '#',
          className:
            'text-[#B89B7A] hover:text-[#A1835D] underline focus:outline-none focus:ring-1 focus:ring-[#B89B7A] rounded',
          role: 'link',
          ariaLabel: 'Política de privacidade',
        },
      },
    },

    // ⚖️ 10. FOOTER COPYRIGHT (EXATO DA PRODUÇÃO)
    {
      id: 'footer-copyright-modular',
      type: 'text-inline',
      properties: {
        // ✨ CONTEÚDO DINÂMICO DA PRODUÇÃO
        content: '© {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados',
        text: `© ${new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados`,

        // ✨ CONFIGURAÇÕES DE TIPOGRAFIA (da produção)
        fontSize: 'text-xs',
        fontWeight: 'font-normal',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        letterSpacing: 'normal',

        // ✨ CONFIGURAÇÕES DE ALINHAMENTO
        textAlign: 'text-center',
        textWidth: 'w-full',

        // ✨ CONFIGURAÇÕES DE CORES (da produção)
        color: '#6B7280', // text-gray-500
        textColor: '#6B7280',
        backgroundColor: 'transparent',

        // ✨ CONFIGURAÇÕES DE LAYOUT (da produção)
        containerWidth: 'full',
        containerPosition: 'center',
        gridColumns: 'full',
        spacing: 'tight',
        marginTop: 24, // pt-6
        marginBottom: 16,

        // ✨ CONFIGURAÇÕES RESPONSIVAS
        mobileFontSize: 'text-xs',
        mobileLineHeight: '1.3',
        mobileMarginTop: 20,
        mobileMarginBottom: 12,

        // ✨ POSICIONAMENTO (da produção)
        position: 'footer', // indica que é um footer
        containerProps: {
          as: 'footer',
          className:
            'w-full max-w-xs sm:max-w-md md:max-w-lg px-4 mt-auto pt-6 text-center mx-auto',
        },
      },
    },
  ];
};
