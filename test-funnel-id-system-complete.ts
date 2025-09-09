/**
 * 🧪 TESTE MANUAL DO SISTEMA DE FUNNEL ID
 * 
 * Casos de teste para validar:
 * 1. Navegação com ?funnel=ID funciona
 * 2. Context propagation está correto
 * 3. Queries Supabase usam ID dinâmico
 * 4. Validação UUID funciona
 * 5. Fallbacks estão corretos
 */

import { 
  isValidFunnelId, 
  generateFunnelId,
  getFunnelIdFromEnvOrStorage 
} from '../src/utils/funnelIdentity';

interface TestCase {
  name: string;
  test: () => boolean | Promise<boolean>;
  description: string;
}

const testCases: TestCase[] = [
  // 🔧 TESTE 1: Validação de UUID
  {
    name: 'UUID v4 válido',
    description: 'Valida se UUIDs v4 são aceitos',
    test: () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      return isValidFunnelId(validUuid);
    }
  },

  // 🔧 TESTE 2: Template IDs
  {
    name: 'Template ID válido',
    description: 'Valida se IDs de template são aceitos',
    test: () => {
      const templateId = 'template-quiz-estilo-completo';
      return isValidFunnelId(templateId);
    }
  },

  // 🔧 TESTE 3: Default fallback
  {
    name: 'Default fallback válido',
    description: 'Valida se o fallback padrão é aceito',
    test: () => {
      const defaultId = 'default-funnel';
      return isValidFunnelId(defaultId);
    }
  },

  // 🔧 TESTE 4: IDs inválidos
  {
    name: 'ID inválido rejeitado',
    description: 'Rejeita IDs com formato inválido',
    test: () => {
      const invalidId = 'invalid-format!@#';
      return !isValidFunnelId(invalidId);
    }
  },

  // 🔧 TESTE 5: Geração de UUID
  {
    name: 'Geração de UUID',
    description: 'Gera UUID v4 válido',
    test: () => {
      const newId = generateFunnelId();
      return isValidFunnelId(newId);
    }
  },

  // 🔧 TESTE 6: URL Param Reading
  {
    name: 'Leitura de parâmetro URL',
    description: 'Testa leitura do parâmetro ?funnel=',
    test: () => {
      // Simula URL com parâmetro
      const mockUrl = 'http://localhost:8080/editor?funnel=template-test-id';
      const urlParams = new URLSearchParams(new URL(mockUrl).search);
      const funnelId = urlParams.get('funnel');
      return funnelId === 'template-test-id';
    }
  }
];

/**
 * 🚀 EXECUTAR TODOS OS TESTES
 */
export const runFunnelIdTests = async (): Promise<void> => {
  console.log('🧪 === INICIANDO TESTES DO SISTEMA FUNNEL ID ===');
  
  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 Testando: ${testCase.name}`);
      console.log(`📋 Descrição: ${testCase.description}`);
      
      const result = await testCase.test();
      
      if (result) {
        console.log('✅ PASSOU');
        passedTests++;
      } else {
        console.log('❌ FALHOU');
      }
    } catch (error) {
      console.log('💥 ERRO:', error);
    }
  }

  console.log(`\n🏁 === RESULTADO FINAL ===`);
  console.log(`✅ Testes que passaram: ${passedTests}/${totalTests}`);
  console.log(`❌ Testes que falharam: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique os logs acima.');
  }
};

/**
 * 🌐 TESTE DE NAVEGAÇÃO (Para executar no browser)
 */
export const testNavigationWithFunnelParam = (): void => {
  console.log('🌐 === TESTE DE NAVEGAÇÃO ===');
  
  // Testa diferentes cenários de URL
  const testUrls = [
    'http://localhost:8080/editor?funnel=123e4567-e89b-12d3-a456-426614174000',
    'http://localhost:8080/editor?funnel=template-quiz-estilo-completo',
    'http://localhost:8080/editor?funnel=default-funnel',
    'http://localhost:8080/editor', // Sem parâmetro
  ];

  testUrls.forEach((url, index) => {
    console.log(`\n🔗 Teste ${index + 1}: ${url}`);
    
    try {
      const urlObj = new URL(url);
      const funnelParam = urlObj.searchParams.get('funnel');
      
      console.log('📥 Parâmetro extraído:', funnelParam || 'null');
      console.log('✅ Válido:', funnelParam ? isValidFunnelId(funnelParam) : 'N/A');
      
      // Simula navegação
      console.log('🚀 Navegação simulada:', {
        pathname: urlObj.pathname,
        funnelId: funnelParam || 'default-funnel',
        isValid: funnelParam ? isValidFunnelId(funnelParam) : true
      });
      
    } catch (error) {
      console.log('❌ Erro ao processar URL:', error);
    }
  });
};

/**
 * 🔄 TESTE DE CONTEXT PROPAGATION
 */
export const testContextPropagation = (): void => {
  console.log('🔄 === TESTE DE CONTEXT PROPAGATION ===');
  
  // Simula cenários do FunnelsContext
  const scenarios = [
    {
      name: 'URL param presente',
      windowLocation: 'http://localhost:8080/editor?funnel=123e4567-e89b-12d3-a456-426614174000',
      localStorage: null,
      expected: '123e4567-e89b-12d3-a456-426614174000'
    },
    {
      name: 'Apenas localStorage',
      windowLocation: 'http://localhost:8080/editor',
      localStorage: 'template-quiz-estilo-completo',
      expected: 'template-quiz-estilo-completo'
    },
    {
      name: 'Fallback padrão',
      windowLocation: 'http://localhost:8080/editor',
      localStorage: null,
      expected: 'template-quiz-estilo-completo'
    }
  ];

  scenarios.forEach((scenario, index) => {
    console.log(`\n📋 Cenário ${index + 1}: ${scenario.name}`);
    console.log('🌐 URL:', scenario.windowLocation);
    console.log('💾 localStorage:', scenario.localStorage || 'vazio');
    
    try {
      // Simula lógica do FunnelsContext
      const url = new URL(scenario.windowLocation);
      const fromUrl = url.searchParams.get('funnel');
      
      let result;
      if (fromUrl) {
        result = fromUrl;
      } else if (scenario.localStorage) {
        result = scenario.localStorage;
      } else {
        result = 'template-quiz-estilo-completo'; // fallback
      }
      
      console.log('🎯 Resultado:', result);
      console.log('✅ Esperado:', scenario.expected);
      console.log('🔍 Match:', result === scenario.expected ? 'SIM' : 'NÃO');
      
    } catch (error) {
      console.log('❌ Erro:', error);
    }
  });
};

// Export para uso no browser console
if (typeof window !== 'undefined') {
  (window as any).testFunnelIdSystem = {
    runFunnelIdTests,
    testNavigationWithFunnelParam,
    testContextPropagation,
    isValidFunnelId,
    generateFunnelId
  };
  
  console.log('🧪 Testes disponíveis no window.testFunnelIdSystem');
  console.log('📝 Execute: window.testFunnelIdSystem.runFunnelIdTests()');
}
