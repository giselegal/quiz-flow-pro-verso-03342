import { trackButtonClick } from './analytics';
import { ABTestVariant, ABTestConfig } from '@/types/abtest';

// Configuração do teste A/B para landing pages
export const LANDING_PAGE_AB_TEST: ABTestConfig = {
  testName: 'landing_page_conversion_test',
  variantA: {
    route: '/resultado',
    description: 'Página de Resultado Original',
  },
  variantB: {
    route: '/descubra-seu-estilo',
    description: 'Landing Page Quiz Estilo',
  },
  trafficSplit: 50, // 50% para cada versão
};

/**
 * Determina qual variante do teste A/B o usuário deve ver
 * Usa uma combinação de hash do IP/user agent e timestamp para distribuição
 */
export function getABTestVariant(testConfig: ABTestConfig): ABTestVariant {
  // Chave única para o usuário baseada em informações disponíveis
  const userKey = getUserUniqueKey();

  // Hash simples para distribuição consistente
  const hash = simpleHash(userKey + testConfig.testName);
  const percentage = Math.abs(hash) % 100;

  const variant: ABTestVariant = percentage < testConfig.trafficSplit ? 'B' : 'A';

  // Track da variante atribuída
  trackABTestAssignment(testConfig.testName, variant);

  return variant;
}

/**
 * Gera uma chave única para o usuário baseada em informações disponíveis
 */
function getUserUniqueKey(): string {
  // Tenta usar sessionStorage primeiro para manter consistência na sessão
  const sessionKey = 'ab_test_user_key';
  let userKey = sessionStorage.getItem(sessionKey);

  if (!userKey) {
    // Gera chave baseada em dados disponíveis
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getDate(), // Muda diariamente para rebalanceamento
    ].join('|');

    userKey = fingerprint;
    sessionStorage.setItem(sessionKey, userKey);
  }

  return userKey;
}

/**
 * Hash simples para distribuição consistente
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Registra a atribuição de variante para analytics
 */
function trackABTestAssignment(testName: string, variant: ABTestVariant) {
  try {
    trackButtonClick(`ab_test_${testName}_variant_${variant}`, `AB Test ${variant}`, testName);

    // Salva no localStorage para referência
    localStorage.setItem(`ab_test_${testName}_variant`, variant);

    console.log(`✅ A/B Test: Usuário atribuído à variante ${variant} do teste ${testName}`);
  } catch (error) {
    console.error('Erro ao rastrear atribuição do teste A/B:', error);
  }
}

/**
 * Registra uma conversão para o teste A/B atual
 */
export function trackABTestConversion(
  testName: string,
  conversionType: string,
  additionalData?: Record<string, any>
) {
  try {
    const variant = localStorage.getItem(`ab_test_${testName}_variant`) as ABTestVariant;

    if (variant) {
      trackButtonClick(
        `ab_test_${testName}_conversion_${conversionType}`,
        `AB Test Conversion ${conversionType}`,
        testName
      );

      console.log(
        `🎯 A/B Test Conversion: ${conversionType} para variante ${variant} do teste ${testName}`
      );
    }
  } catch (error) {
    console.error('Erro ao rastrear conversão do teste A/B:', error);
  }
}

/**
 * Obtém a URL de redirecionamento baseada na variante do teste A/B
 */
export function getABTestRedirectUrl(testConfig: ABTestConfig): string {
  const variant = getABTestVariant(testConfig);
  return variant === 'A' ? testConfig.variantA.route : testConfig.variantB.route;
}

/**
 * Hook para obter informações do teste A/B atual
 */
export function useABTestInfo(testConfig: ABTestConfig) {
  const variant = getABTestVariant(testConfig);
  const currentVariant = variant === 'A' ? testConfig.variantA : testConfig.variantB;

  return {
    variant,
    route: currentVariant.route,
    description: currentVariant.description,
    trackConversion: (conversionType: string, additionalData?: Record<string, any>) =>
      trackABTestConversion(testConfig.testName, conversionType, additionalData),
  };
}

/**
 * Força uma variante específica (útil para testes)
 */
export function forceABTestVariant(testName: string, variant: ABTestVariant) {
  localStorage.setItem(`ab_test_${testName}_variant`, variant);
  localStorage.setItem(`ab_test_${testName}_forced`, 'true');
  console.log(`🔧 A/B Test: Forçando variante ${variant} para o teste ${testName}`);
}

/**
 * Remove o forçamento de variante
 */
export function clearForcedABTestVariant(testName: string) {
  localStorage.removeItem(`ab_test_${testName}_variant`);
  localStorage.removeItem(`ab_test_${testName}_forced`);
  sessionStorage.removeItem('ab_test_user_key');
  console.log(`🔧 A/B Test: Removendo forçamento para o teste ${testName}`);
}

export const logABTestView = (
  testName: string,
  variant: ABTestVariant,
  page: string = 'unknown'
) => {
  try {
    const logEntry = {
      test_name: testName,
      variant: variant,
      timestamp: new Date().toISOString(),
      page: page,
    };

    const existingLogs = localStorage.getItem('ab_test_views') || '[]';
    const logs = JSON.parse(existingLogs);
    logs.push(logEntry);
    localStorage.setItem('ab_test_views', JSON.stringify(logs));
  } catch (error) {
    console.error('Error logging AB test view:', error);
  }
};

export const logABTestConversion = (
  testName: string,
  variant: ABTestVariant,
  conversionType: string,
  page: string = 'unknown'
) => {
  try {
    const logEntry = {
      test_name: testName,
      variant: variant,
      conversion_type: conversionType,
      timestamp: new Date().toISOString(),
      page: page,
    };

    const existingLogs = localStorage.getItem('ab_test_conversions') || '[]';
    const logs = JSON.parse(existingLogs);
    logs.push(logEntry);
    localStorage.setItem('ab_test_conversions', JSON.stringify(logs));
  } catch (error) {
    console.error('Error logging AB test conversion:', error);
  }
};
