/**
 * Sistema de Internacionalização (I18n)
 * Suporte para múltiplos idiomas no editor
 */

export type SupportedLanguage = 'pt' | 'en' | 'es';

export interface TranslationKeys {
  // Editor UI
  editor: {
    title: string;
    save: string;
    preview: string;
    publish: string;
    addBlock: string;
    deleteBlock: string;
    duplicateBlock: string;
    moveUp: string;
    moveDown: string;
    settings: string;
    responsive: string;
    desktop: string;
    tablet: string;
    mobile: string;
  };
  
  // Quiz Steps
  quiz: {
    step: string;
    of: string;
    question: string;
    next: string;
    previous: string;
    finish: string;
    start: string;
    continue: string;
    result: string;
    offer: string;
    mainQuestions: string;
    strategicQuestions: string;
    transition: string;
  };
  
  // Block Types
  blocks: {
    header: string;
    text: string;
    image: string;
    button: string;
    quiz: string;
    nameInput: string;
    progressBar: string;
    decorativeBar: string;
    result: string;
    offer: string;
  };
  
  // Common UI
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    close: string;
    open: string;
    required: string;
    optional: string;
  };
  
  // Quiz Content
  content: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    welcomeDescription: string;
    nameInputLabel: string;
    nameInputPlaceholder: string;
    startQuizButton: string;
    greatWork: string;
    transitionMessage: string;
    resultReady: string;
    resultSubtitle: string;
    specialOffer: string;
    offerSubtitle: string;
    limitedTime: string;
    getConsultation: string;
  };
  
  // Notifications
  notifications: {
    blockAdded: string;
    blockDeleted: string;
    blockDuplicated: string;
    blockMoved: string;
    quizSaved: string;
    quizPublished: string;
    errorSaving: string;
    errorLoading: string;
  };
}

// Traduções em Português
const ptTranslations: TranslationKeys = {
  editor: {
    title: 'Editor de Quiz',
    save: 'Salvar',
    preview: 'Visualizar',
    publish: 'Publicar',
    addBlock: 'Adicionar Bloco',
    deleteBlock: 'Excluir Bloco',
    duplicateBlock: 'Duplicar Bloco',
    moveUp: 'Mover para Cima',
    moveDown: 'Mover para Baixo',
    settings: 'Configurações',
    responsive: 'Responsivo',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile'
  },
  quiz: {
    step: 'Etapa',
    of: 'de',
    question: 'Pergunta',
    next: 'Próxima',
    previous: 'Anterior',
    finish: 'Finalizar',
    start: 'Começar',
    continue: 'Continuar',
    result: 'Resultado',
    offer: 'Oferta',
    mainQuestions: 'Questões Principais',
    strategicQuestions: 'Questões Estratégicas',
    transition: 'Transição'
  },
  blocks: {
    header: 'Cabeçalho',
    text: 'Texto',
    image: 'Imagem',
    button: 'Botão',
    quiz: 'Quiz',
    nameInput: 'Entrada de Nome',
    progressBar: 'Barra de Progresso',
    decorativeBar: 'Barra Decorativa',
    result: 'Resultado',
    offer: 'Oferta'
  },
  common: {
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    warning: 'Aviso',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    open: 'Abrir',
    required: 'Obrigatório',
    optional: 'Opcional'
  },
  content: {
    welcomeTitle: 'Descubra Seu Estilo Pessoal',
    welcomeSubtitle: 'Quiz Personalizado para Você',
    welcomeDescription: 'Bem-vindo ao nosso quiz exclusivo! Vamos descobrir qual estilo combina mais com você através de algumas perguntas divertidas.',
    nameInputLabel: 'Como você gostaria de ser chamado?',
    nameInputPlaceholder: 'Digite seu primeiro nome...',
    startQuizButton: 'Começar Quiz',
    greatWork: 'Ótimo trabalho!',
    transitionMessage: 'Você completou as questões principais! Agora vamos fazer algumas perguntas estratégicas para personalizar ainda mais seu resultado.',
    resultReady: 'Seu Resultado Está Pronto!',
    resultSubtitle: 'Descubra seu estilo pessoal único',
    specialOffer: 'Oferta Especial Para Você!',
    offerSubtitle: 'Consultoria de Estilo Personalizada',
    limitedTime: 'Oferta válida apenas hoje!',
    getConsultation: 'Quero Minha Consultoria'
  },
  notifications: {
    blockAdded: 'Bloco adicionado com sucesso',
    blockDeleted: 'Bloco excluído com sucesso',
    blockDuplicated: 'Bloco duplicado com sucesso',
    blockMoved: 'Bloco movido com sucesso',
    quizSaved: 'Quiz salvo com sucesso',
    quizPublished: 'Quiz publicado com sucesso',
    errorSaving: 'Erro ao salvar o quiz',
    errorLoading: 'Erro ao carregar o quiz'
  }
};

// Traduções em Inglês
const enTranslations: TranslationKeys = {
  editor: {
    title: 'Quiz Editor',
    save: 'Save',
    preview: 'Preview',
    publish: 'Publish',
    addBlock: 'Add Block',
    deleteBlock: 'Delete Block',
    duplicateBlock: 'Duplicate Block',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    settings: 'Settings',
    responsive: 'Responsive',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile'
  },
  quiz: {
    step: 'Step',
    of: 'of',
    question: 'Question',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    start: 'Start',
    continue: 'Continue',
    result: 'Result',
    offer: 'Offer',
    mainQuestions: 'Main Questions',
    strategicQuestions: 'Strategic Questions',
    transition: 'Transition'
  },
  blocks: {
    header: 'Header',
    text: 'Text',
    image: 'Image',
    button: 'Button',
    quiz: 'Quiz',
    nameInput: 'Name Input',
    progressBar: 'Progress Bar',
    decorativeBar: 'Decorative Bar',
    result: 'Result',
    offer: 'Offer'
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    open: 'Open',
    required: 'Required',
    optional: 'Optional'
  },
  content: {
    welcomeTitle: 'Discover Your Personal Style',
    welcomeSubtitle: 'Personalized Quiz for You',
    welcomeDescription: 'Welcome to our exclusive quiz! Let\'s discover which style suits you best through some fun questions.',
    nameInputLabel: 'What would you like to be called?',
    nameInputPlaceholder: 'Enter your first name...',
    startQuizButton: 'Start Quiz',
    greatWork: 'Great work!',
    transitionMessage: 'You completed the main questions! Now let\'s ask some strategic questions to further personalize your result.',
    resultReady: 'Your Result is Ready!',
    resultSubtitle: 'Discover your unique personal style',
    specialOffer: 'Special Offer for You!',
    offerSubtitle: 'Personalized Style Consultation',
    limitedTime: 'Offer valid today only!',
    getConsultation: 'Get My Consultation'
  },
  notifications: {
    blockAdded: 'Block added successfully',
    blockDeleted: 'Block deleted successfully',
    blockDuplicated: 'Block duplicated successfully',
    blockMoved: 'Block moved successfully',
    quizSaved: 'Quiz saved successfully',
    quizPublished: 'Quiz published successfully',
    errorSaving: 'Error saving quiz',
    errorLoading: 'Error loading quiz'
  }
};

// Traduções em Espanhol
const esTranslations: TranslationKeys = {
  editor: {
    title: 'Editor de Quiz',
    save: 'Guardar',
    preview: 'Vista Previa',
    publish: 'Publicar',
    addBlock: 'Agregar Bloque',
    deleteBlock: 'Eliminar Bloque',
    duplicateBlock: 'Duplicar Bloque',
    moveUp: 'Mover Arriba',
    moveDown: 'Mover Abajo',
    settings: 'Configuraciones',
    responsive: 'Responsivo',
    desktop: 'Escritorio',
    tablet: 'Tablet',
    mobile: 'Móvil'
  },
  quiz: {
    step: 'Paso',
    of: 'de',
    question: 'Pregunta',
    next: 'Siguiente',
    previous: 'Anterior',
    finish: 'Finalizar',
    start: 'Comenzar',
    continue: 'Continuar',
    result: 'Resultado',
    offer: 'Oferta',
    mainQuestions: 'Preguntas Principales',
    strategicQuestions: 'Preguntas Estratégicas',
    transition: 'Transición'
  },
  blocks: {
    header: 'Encabezado',
    text: 'Texto',
    image: 'Imagen',
    button: 'Botón',
    quiz: 'Quiz',
    nameInput: 'Entrada de Nombre',
    progressBar: 'Barra de Progreso',
    decorativeBar: 'Barra Decorativa',
    result: 'Resultado',
    offer: 'Oferta'
  },
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    open: 'Abrir',
    required: 'Requerido',
    optional: 'Opcional'
  },
  content: {
    welcomeTitle: 'Descubre Tu Estilo Personal',
    welcomeSubtitle: 'Quiz Personalizado para Ti',
    welcomeDescription: '¡Bienvenido a nuestro quiz exclusivo! Vamos a descubrir qué estilo te queda mejor a través de algunas preguntas divertidas.',
    nameInputLabel: '¿Cómo te gustaría que te llamemos?',
    nameInputPlaceholder: 'Ingresa tu primer nombre...',
    startQuizButton: 'Comenzar Quiz',
    greatWork: '¡Excelente trabajo!',
    transitionMessage: '¡Completaste las preguntas principales! Ahora hagamos algunas preguntas estratégicas para personalizar aún más tu resultado.',
    resultReady: '¡Tu Resultado Está Listo!',
    resultSubtitle: 'Descubre tu estilo personal único',
    specialOffer: '¡Oferta Especial Para Ti!',
    offerSubtitle: 'Consultoría de Estilo Personalizada',
    limitedTime: '¡Oferta válida solo hoy!',
    getConsultation: 'Quiero Mi Consultoría'
  },
  notifications: {
    blockAdded: 'Bloque agregado exitosamente',
    blockDeleted: 'Bloque eliminado exitosamente',
    blockDuplicated: 'Bloque duplicado exitosamente',
    blockMoved: 'Bloque movido exitosamente',
    quizSaved: 'Quiz guardado exitosamente',
    quizPublished: 'Quiz publicado exitosamente',
    errorSaving: 'Error al guardar el quiz',
    errorLoading: 'Error al cargar el quiz'
  }
};

// Mapa de traduções
const translations: Record<SupportedLanguage, TranslationKeys> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations
};

/**
 * Classe principal para gerenciamento de internacionalização
 */
export class I18nManager {
  private static instance: I18nManager;
  private currentLanguage: SupportedLanguage = 'pt';
  private fallbackLanguage: SupportedLanguage = 'en';
  
  private constructor() {
    // Detectar idioma do navegador
    this.detectBrowserLanguage();
  }
  
  public static getInstance(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  /**
   * Define o idioma atual
   */
  public setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    localStorage.setItem('quiz-editor-language', language);
    
    // Disparar evento para componentes reagirem à mudança
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language } 
    }));
  }

  /**
   * Obtém o idioma atual
   */
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Obtém uma tradução por chave
   */
  public t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    // Navegar pela estrutura de chaves
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // Se não encontrou, tentar idioma de fallback
    if (value === undefined) {
      value = translations[this.fallbackLanguage];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }
    
    // Se ainda não encontrou, retornar a chave
    return value || key;
  }

  /**
   * Obtém uma tradução com interpolação de variáveis
   */
  public tWithVars(key: string, vars: Record<string, string | number>): string {
    let translation = this.t(key);
    
    // Substituir variáveis no formato {{variavel}}
    Object.entries(vars).forEach(([varKey, varValue]) => {
      translation = translation.replace(
        new RegExp(`{{${varKey}}}`, 'g'), 
        String(varValue)
      );
    });
    
    return translation;
  }

  /**
   * Obtém todas as traduções para o idioma atual
   */
  public getAllTranslations(): TranslationKeys {
    return translations[this.currentLanguage];
  }

  /**
   * Verifica se um idioma é suportado
   */
  public isLanguageSupported(language: string): language is SupportedLanguage {
    return ['pt', 'en', 'es'].includes(language);
  }

  /**
   * Obtém lista de idiomas suportados
   */
  public getSupportedLanguages(): Array<{code: SupportedLanguage, name: string}> {
    return [
      { code: 'pt', name: 'Português' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ];
  }

  /**
   * Detecta o idioma do navegador
   */
  private detectBrowserLanguage(): void {
    // Verificar localStorage primeiro
    const savedLanguage = localStorage.getItem('quiz-editor-language');
    if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // Detectar do navegador
    const browserLanguage = navigator.language.split('-')[0];
    if (this.isLanguageSupported(browserLanguage)) {
      this.currentLanguage = browserLanguage;
    }
  }

  /**
   * Formata números de acordo com o idioma
   */
  public formatNumber(number: number): string {
    const locales = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES'
    };
    
    return new Intl.NumberFormat(locales[this.currentLanguage]).format(number);
  }

  /**
   * Formata datas de acordo com o idioma
   */
  public formatDate(date: Date): string {
    const locales = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES'
    };
    
    return new Intl.DateTimeFormat(locales[this.currentLanguage]).format(date);
  }
}

// Hook React para usar o I18n
export function useI18n() {
  const i18n = I18nManager.getInstance();
  
  return {
    t: i18n.t.bind(i18n),
    tWithVars: i18n.tWithVars.bind(i18n),
    setLanguage: i18n.setLanguage.bind(i18n),
    getCurrentLanguage: i18n.getCurrentLanguage.bind(i18n),
    getSupportedLanguages: i18n.getSupportedLanguages.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n)
  };
}

// Exportar instância singleton
export const i18n = I18nManager.getInstance();