import { useState, useEffect } from 'react';

export interface ABTestVariation {
  id: string;
  name: string;
  domain?: string;
  trafficPercentage?: number;
  content?: {
    styles?: Record<string, string>;
    pricing?: Record<string, string>;
    checkoutUrl?: string;
    [key: string]: any;
  };
}

export interface ABTest {
  id: string;
  name: string;
  type: 'result' | 'sales';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  variations: ABTestVariation[];
}

/**
 * Hook para gerenciar testes A/B nas páginas de resultado e vendas
 * @param type - Tipo de página ('result' ou 'sales')
 * @returns Informações sobre a variação atual do teste A/B
 */
export const useABTest = (type: 'result' | 'sales') => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentVariation, setCurrentVariation] = useState<ABTestVariation | null>(null);
  const [activeTest, setActiveTest] = useState<ABTest | null>(null);

  useEffect(() => {
    const determineVariation = async () => {
      try {
        setIsLoading(true);

        // Carregar testes A/B do localStorage (em produção seria uma API)
        const storedTests = localStorage.getItem('ab_tests');
        if (!storedTests) {
          setIsLoading(false);
          return;
        }

        const tests: ABTest[] = JSON.parse(storedTests);

        // Filtrar testes ativos para o tipo de página atual
        const activeTests = tests.filter(
          test =>
            test.isActive &&
            test.type === type &&
            new Date(test.startDate) <= new Date() &&
            (!test.endDate || new Date(test.endDate) >= new Date())
        );

        if (activeTests.length === 0) {
          setIsLoading(false);
          return;
        }

        // Por simplicidade, usamos apenas o primeiro teste ativo encontrado
        const test = activeTests[0];
        setActiveTest(test);

        // Verificar se há correspondência de domínio
        const currentDomain = window.location.hostname;
        const domainMatch = test.variations.find(
          variation => variation.domain && currentDomain.includes(variation.domain)
        );

        if (domainMatch) {
          setCurrentVariation(domainMatch);
          setIsLoading(false);
          return;
        }

        // Se não houver correspondência de domínio, usar distribuição de tráfego
        // Obter um número aleatório entre 0 e 100
        const visitorId = localStorage.getItem(`ab_test_${test.id}_visitor_id`);
        let randomPercentage: number;

        if (visitorId) {
          // Usar ID existente para manter consistência na experiência do usuário
          randomPercentage = parseInt(visitorId, 10);
        } else {
          // Gerar novo ID para o usuário
          randomPercentage = Math.floor(Math.random() * 100);
          localStorage.setItem(`ab_test_${test.id}_visitor_id`, randomPercentage.toString());
        }

        // Encontrar a variação com base na distribuição de tráfego
        let accumulatedPercentage = 0;
        for (const variation of test.variations) {
          accumulatedPercentage += variation.trafficPercentage || 0;
          if (randomPercentage < accumulatedPercentage) {
            setCurrentVariation(variation);
            break;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao determinar variação A/B:', error);
        setIsLoading(false);
      }
    };

    determineVariation();
  }, [type]);

  /**
   * Registra uma conversão para a variação atual
   */
  const registerConversion = () => {
    if (!activeTest || !currentVariation) return;

    try {
      // Salvar a conversão no localStorage (em produção seria uma API)
      const conversionKey = `ab_test_${activeTest.id}_${currentVariation.id}_conversions`;
      const currentConversions = localStorage.getItem(conversionKey);
      const newConversions = currentConversions ? parseInt(currentConversions, 10) + 1 : 1;
      localStorage.setItem(conversionKey, newConversions.toString());

      // Registrar timestamp da conversão
      const timestampKey = `ab_test_${activeTest.id}_${currentVariation.id}_conversion_timestamps`;
      const currentTimestamps = localStorage.getItem(timestampKey);
      const timestamps = currentTimestamps ? JSON.parse(currentTimestamps) : [];
      timestamps.push(new Date().toISOString());
      localStorage.setItem(timestampKey, JSON.stringify(timestamps));

      console.log(
        `Conversão registrada para teste ${activeTest.id}, variação ${currentVariation.id}`
      );
    } catch (error) {
      console.error('Erro ao registrar conversão:', error);
    }
  };

  return {
    isLoading,
    currentVariation,
    activeTest,
    registerConversion,
  };
};
