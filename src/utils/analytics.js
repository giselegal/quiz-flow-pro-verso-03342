// Utilitários para rastreamento de eventos na aplicação

/**
 * Rastreia visualizações de página
 * @param {string} pageName - Nome da página visualizada
 * @param {object} pageData - Dados adicionais sobre a página
 */
export const trackPageView = (pageName, pageData = {}) => {
  if (typeof window === "undefined") return;

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_title: pageName,
      page_location: window.location.href,
      ...pageData,
    });
  }

  // Facebook Pixel - Removido: PageView não é evento principal
  // if (window.fbq) {
  //   window.fbq('track', 'PageView');
  // }

  // DataLayer para Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "page_view",
      pageName,
      ...pageData,
    });
  }

  console.log(`[Analytics] Visualização de página: ${pageName}`, pageData);
};

/**
 * Rastreia cliques em botões
 * @param {string} buttonId - Identificador único do botão
 * @param {string} buttonText - Texto exibido no botão
 * @param {string} pageName - Nome da página onde o botão está
 * @param {object} eventData - Dados adicionais sobre o evento
 */
export const trackButtonClick = (buttonId, buttonText, pageName, eventData = {}) => {
  if (typeof window === "undefined") return;

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", "button_click", {
      button_id: buttonId,
      button_text: buttonText,
      page_name: pageName,
      ...eventData,
    });
  }

  // Facebook Pixel - REMOVIDO: ButtonClick não é um evento principal

  // DataLayer para Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "button_click",
      buttonId,
      buttonText,
      pageName,
      ...eventData,
    });
  }

  console.log(`[Analytics] Clique em botão: ${buttonText} (${buttonId}) em ${pageName}`, eventData);
};

/**
 * Rastreia conversões (ex: inscrições, compras)
 * @param {string} conversionType - Tipo de conversão (ex: 'lead', 'purchase')
 * @param {object} conversionData - Dados sobre a conversão
 */
export const trackConversion = (conversionType, conversionData = {}) => {
  if (typeof window === "undefined") return;

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", conversionType, conversionData);
  }

  // Facebook Pixel
  if (window.fbq) {
    if (conversionType === "purchase") {
      window.fbq("track", "Purchase", conversionData);
    } else if (conversionType === "lead") {
      window.fbq("track", "Lead", conversionData);
    } else {
      window.fbq("trackCustom", conversionType, conversionData);
    }
  }

  // DataLayer para Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: conversionType,
      ...conversionData,
    });
  }

  console.log(`[Analytics] Conversão: ${conversionType}`, conversionData);
};

/**
 * Captura parâmetros UTM da URL e os armazena para uso em analytics
 * @returns {object} Objeto com os parâmetros UTM capturados
 */
export const captureUTMParameters = () => {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};

  // Lista de parâmetros UTM a capturar
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "ref",
    "source",
  ];

  // Extrair parâmetros da URL
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;

      // Armazenar no localStorage para uso posterior
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn(`[Analytics] Falha ao armazenar ${key} no localStorage`, e);
      }
    }
  });

  // Registrar no Google Analytics
  if (window.gtag && Object.keys(utmParams).length > 0) {
    window.gtag("set", "user_properties", utmParams);
  }

  // Facebook Pixel - REMOVIDO: UTMCapture não é um evento principal

  // DataLayer para Google Tag Manager
  if (window.dataLayer && Object.keys(utmParams).length > 0) {
    window.dataLayer.push({
      event: "utm_capture",
      ...utmParams,
    });
  }

  console.log("[Analytics] Parâmetros UTM capturados:", utmParams);
  return utmParams;
};

/**
 * Retorna todos os eventos de analytics rastreados (do dataLayer).
 * @returns {Array<object>} Array de eventos de analytics.
 */
export const getAnalyticsEvents = () => {
  if (typeof window !== "undefined" && window.dataLayer && Array.isArray(window.dataLayer)) {
    // Retorna uma cópia para evitar mutações externas do dataLayer original
    return [...window.dataLayer];
  }
  return [];
};

/**
 * Limpa os dados de analytics, incluindo o dataLayer e os parâmetros UTM armazenados.
 */
export const clearAnalyticsData = () => {
  if (typeof window === "undefined") return;

  // Limpar o dataLayer
  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.length = 0; // Esvazia o array mantendo a referência
    console.log("[Analytics] window.dataLayer foi limpo.");
  }

  // Lista de parâmetros UTM para remover do localStorage
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "ref",
    "source",
  ];

  // Remover parâmetros UTM do localStorage
  utmKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Analytics] Falha ao remover ${key} do localStorage`, e);
    }
  });
  console.log("[Analytics] Parâmetros UTM do localStorage foram limpos.");

  // Nota: A limpeza do cache de métricas (resetMetricsCache) é feita em analyticsHelpers.ts
  // e deve ser chamada separadamente se necessário.
};

/**
 * Testa a configuração do Facebook Pixel enviando um evento de teste principal.
 * (Esta é uma função de exemplo, pode precisar de ajustes)
 */
export const testFacebookPixel = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", "QuizStart", { test: true });
    console.log("[Analytics] Evento QuizStart de teste enviado para o Facebook Pixel.");
    return true;
  }
  console.warn("[Analytics] Facebook Pixel (window.fbq) não encontrado.");
  return false;
};

/**
 * Rastreia o início de um quiz.
 * @param {string} quizId - Identificador do quiz.
 * @param {object} eventData - Dados adicionais sobre o evento.
 */
export const trackQuizStart = (quizId, eventData = {}) => {
  if (typeof window === "undefined") return;
  const data = { quiz_id: quizId, ...eventData };

  if (window.gtag) {
    window.gtag("event", "quiz_start", data);
  }
  if (window.fbq) {
    window.fbq("trackCustom", "QuizStart", data);
  }
  if (window.dataLayer) {
    window.dataLayer.push({ event: "quiz_start", ...data });
  }
  console.log(`[Analytics] Quiz iniciado: ${quizId}`, data);
};

/**
 * Rastreia uma resposta a uma pergunta do quiz.
 * @param {string} quizId - Identificador do quiz.
 * @param {string} questionId - Identificador da pergunta.
 * @param {string} answer - Resposta fornecida.
 * @param {object} eventData - Dados adicionais sobre o evento.
 */
export const trackQuizAnswer = (quizId, questionId, answer, eventData = {}) => {
  if (typeof window === "undefined") return;
  const data = {
    quiz_id: quizId,
    question_id: questionId,
    answer: answer,
    ...eventData,
  };

  if (window.gtag) {
    window.gtag("event", "quiz_answer", data);
  }
  // Facebook Pixel - REMOVIDO: QuizAnswer não é um evento principal
  if (window.dataLayer) {
    window.dataLayer.push({ event: "quiz_answer", ...data });
  }
  console.log(`[Analytics] Resposta ao quiz: ${questionId} - ${answer}`, data);
};

/**
 * Rastreia a conclusão de um quiz.
 * @param {string} quizId - Identificador do quiz.
 * @param {object} eventData - Dados adicionais sobre o evento (ex: pontuação).
 */
export const trackQuizComplete = (quizId, eventData = {}) => {
  if (typeof window === "undefined") return;
  const data = { quiz_id: quizId, ...eventData };

  if (window.gtag) {
    window.gtag("event", "quiz_complete", data);
  }
  // Facebook Pixel - REMOVIDO: QuizComplete não é um evento principal
  if (window.dataLayer) {
    window.dataLayer.push({ event: "quiz_complete", ...data });
  }
  console.log(`[Analytics] Quiz concluído: ${quizId}`, data);
};

/**
 * Rastreia a visualização da página de resultados do quiz.
 * @param {string} quizId - Identificador do quiz.
 * @param {string} resultId - Identificador do resultado/persona.
 * @param {object} eventData - Dados adicionais sobre o evento.
 */
export const trackResultView = (quizId, resultId, eventData = {}) => {
  if (typeof window === "undefined") return;
  const data = { quiz_id: quizId, result_id: resultId, ...eventData };

  if (window.gtag) {
    window.gtag("event", "result_view", data);
  }
  if (window.fbq) {
    window.fbq("trackCustom", "ResultView", data);
  }
  if (window.dataLayer) {
    window.dataLayer.push({ event: "result_view", ...data });
  }
  console.log(`[Analytics] Visualização de resultado: ${quizId} - ${resultId}`, data);
};

/**
 * Rastreia a geração de um lead.
 * @param {string} formId - Identificador do formulário ou origem do lead.
 * @param {object} leadData - Dados adicionais sobre o lead (ex: email, nome).
 */
export const trackLeadGeneration = (formId, leadData = {}) => {
  if (typeof window === "undefined") return;
  const data = { form_id: formId, ...leadData };

  // Usa a função trackConversion com o tipo 'lead'
  trackConversion("lead", data);

  // Log específico para lead generation, se necessário, além do que trackConversion já faz.
  console.log(`[Analytics] Geração de Lead: ${formId}`, data);
};

/**
 * Formata o nome do criativo para exibição mais amigável
 * @param {string} utmContent - Valor do parâmetro utm_content
 * @returns {string} - Nome formatado do criativo
 */
function formatCreativeName(utmContent) {
  if (!utmContent || utmContent === "unknown") return "Desconhecido";

  // Converter snake_case para Title Case
  return utmContent
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Obter dados de performance por criativo usando utm_content como identificador
 * @param {number} days - Número de dias para filtrar os dados (7, 30, etc)
 * @returns {object} - Objeto com estatísticas por criativo
 */
export const getCreativePerformance = (days = 7) => {
  // Recuperar eventos do localStorage
  const events = JSON.parse(localStorage.getItem("all_tracked_events") || "[]");

  // Filtrar por período, se necessário
  const filteredEvents = days
    ? events.filter(event => {
        const eventDate = new Date(event.date || event.timestamp);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return eventDate >= cutoffDate;
      })
    : events;

  // Objeto para armazenar estatísticas por criativo
  const creativeStats = {};

  // Processar eventos para calcular estatísticas
  filteredEvents.forEach(event => {
    const creative = event.utm_content || "unknown";

    if (!creativeStats[creative]) {
      creativeStats[creative] = {
        creative_name: formatCreativeName(creative),
        page_views: 0,
        quiz_starts: 0,
        quiz_completions: 0,
        leads: 0,
        purchases: 0,
        revenue: 0,
        conversion_rate: "0%",
        cost_per_lead: 0,
      };
    }

    switch (event.event_name) {
      case "PageView":
        creativeStats[creative].page_views++;
        break;
      case "QuizStart":
        creativeStats[creative].quiz_starts++;
        break;
      case "QuizComplete":
        creativeStats[creative].quiz_completions++;
        break;
      case "Lead":
        creativeStats[creative].leads++;
        break;
      case "Purchase":
        creativeStats[creative].purchases++;
        creativeStats[creative].revenue += event.value || 0;
        break;
    }
  });

  // Calcular taxas e métricas derivadas
  Object.values(creativeStats).forEach(stats => {
    if (stats.page_views > 0) {
      const convRate = (stats.leads / stats.page_views) * 100;
      stats.conversion_rate = `${convRate.toFixed(1)}%`;

      // Custo por lead simulado (assumindo um CPC médio de R$1,20)
      const assumedCPC = 1.2;
      const assumedCost = stats.page_views * assumedCPC;
      stats.cost_per_lead = stats.leads > 0 ? assumedCost / stats.leads : 0;
    }
  });

  return creativeStats;
};

/**
 * Rastreia conversões de venda especificamente
 * @param {number} value - Valor da venda
 * @param {string} currency - Moeda da venda
 * @param {string} productName - Nome do produto
 * @param {object} additionalData - Dados adicionais sobre a venda
 */
export const trackSaleConversion = (value, currency = "BRL", productName, additionalData = {}) => {
  if (typeof window === "undefined") return;

  const saleData = {
    value: value,
    currency: currency,
    content_name: productName,
    content_type: "product",
    ...additionalData,
  };

  // Usar a função trackConversion existente com tipo 'purchase'
  trackConversion("purchase", saleData);

  console.log(
    `[Analytics] Conversão de venda rastreada: ${productName} - ${currency} ${value}`,
    saleData
  );
};
