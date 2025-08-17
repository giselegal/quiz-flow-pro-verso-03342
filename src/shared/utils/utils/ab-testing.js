// Utilitários para testes A/B
import { setCookie, getCookie } from './cookies';

/**
 * Marca o usuário como parte de um grupo de teste específico
 * @param {string} testId - Identificador único do teste
 * @param {string} variant - Variante do teste (ex: 'A', 'B')
 * @param {number} expireDays - Dias para expirar o cookie
 */
export const markTestVariant = (testId, variant, expireDays = 30) => {
  // Salva a variante do teste em um cookie
  setCookie(`test_${testId}`, variant, expireDays);

  // Registra a variante no dataLayer para o Google Analytics
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'ab_test_assignment',
      testId,
      variant,
    });
  }

  console.log(`[AB Testing] Usuário marcado para teste ${testId}, variante ${variant}`);

  return variant;
};

/**
 * Verifica a qual variante de teste o usuário pertence
 * @param {string} testId - Identificador único do teste
 * @param {string} defaultVariant - Variante padrão se o usuário não estiver marcado
 * @returns {string} - A variante do teste ('A', 'B', etc)
 */
export const getTestVariant = (testId, defaultVariant = 'A') => {
  const variant = getCookie(`test_${testId}`);
  return variant || defaultVariant;
};

/**
 * Verifica se o usuário está na variante especificada do teste
 * @param {string} testId - Identificador único do teste
 * @param {string} variant - Variante a verificar
 * @returns {boolean} - Verdadeiro se o usuário está na variante especificada
 */
export const isInTestVariant = (testId, variant) => {
  return getTestVariant(testId) === variant;
};

/**
 * Registra uma conversão para um teste A/B
 * @param {string} testId - Identificador único do teste
 * @param {string} conversionType - Tipo de conversão (ex: 'click', 'purchase')
 * @param {object} extraData - Dados adicionais sobre a conversão
 */
export const trackTestConversion = (testId, conversionType, extraData = {}) => {
  const variant = getTestVariant(testId);

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'ab_test_conversion',
      testId,
      variant,
      conversionType,
      ...extraData,
    });
  }

  console.log(
    `[AB Testing] Conversão registrada para teste ${testId}, variante ${variant}, tipo ${conversionType}`
  );
};
