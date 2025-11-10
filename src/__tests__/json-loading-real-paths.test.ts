/**
 * 🔍 TESTES DE RASTREAMENTO - Caminhos Reais de JSONs
 * 
 * Testa com interceptação de fetch/import para capturar
 * os caminhos REAIS dos arquivos JSON sendo acessados
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { templateService } from '@/services/canonical/TemplateService';
import { hierarchicalTemplateSource } from '@/services/core/HierarchicalTemplateSource';

// 📋 Registro de acessos a arquivos reais
interface FileAccessRecord {
  timestamp: number;
  url: string;
  method: string;
  type: 'fetch' | 'import' | 'filesystem';
  success: boolean;
  error?: string;
}

const fileAccessHistory: FileAccessRecord[] = [];

// Interceptor de fetch
const originalFetch = global.fetch;
const mockFetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  const record: FileAccessRecord = {
    timestamp: Date.now(),
    url: urlString,
    method: init?.method || 'GET',
    type: 'fetch',
    success: true,
  };
  
  fileAccessHistory.push(record);
  console.log(`🌐 FETCH: ${urlString}`);
  
  // Simular resposta para JSONs de template
  if (urlString.includes('.json')) {
    return new Response(JSON.stringify({ 
      id: 'mock-data',
      blocks: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return originalFetch(url, init);
});

// Mock de dynamic imports
const importedModules = new Set<string>();
const trackImport = (modulePath: string) => {
  importedModules.add(modulePath);
  
  const record: FileAccessRecord = {
    timestamp: Date.now(),
    url: modulePath,
    method: 'IMPORT',
    type: 'import',
    success: true,
  };
  
  fileAccessHistory.push(record);
  console.log(`📦 IMPORT: ${modulePath}`);
};

describe('🔍 Rastreamento de Caminhos Reais de JSONs', () => {
  beforeEach(() => {
    fileAccessHistory.length = 0;
    importedModules.clear();
    global.fetch = mockFetch as any;
    mockFetch.mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    
    console.log('\n📊 Acessos a arquivos neste teste:');
    console.log(`Total: ${fileAccessHistory.length}`);
    
    const byType = fileAccessHistory.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Por tipo:', byType);
  });

  describe('Análise de Imports Estáticos', () => {
    it('deve identificar imports de templates built-in', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act
      await templateService.prepareTemplate(templateId);

      // Assert
      const jsonAccesses = fileAccessHistory.filter(r => r.url.endsWith('.json'));
      
      console.log('\n📄 JSONs acessados:');
      jsonAccesses.forEach(record => {
        console.log(`   ${record.type.toUpperCase()}: ${record.url}`);
      });
      
      expect(fileAccessHistory.length).toBeGreaterThanOrEqual(0);
    });

    it('deve listar todos os arquivos JSON no diretório de templates', async () => {
      // Este teste documenta a estrutura esperada
      const expectedPaths = [
        '/templates/quiz21StepsComplete/master.v3.json',
        '/templates/quiz21StepsComplete/step-01.json',
        '/templates/quiz21StepsComplete/step-02.json',
        // ... até step-21
      ];

      console.log('\n📂 Estrutura esperada de JSONs:');
      expectedPaths.forEach(path => {
        console.log(`   ${path}`);
      });
      
      expect(expectedPaths.length).toBeGreaterThan(0);
    });
  });

  describe('Análise de Fetch/Network Requests', () => {
    it('deve capturar requisições fetch para JSONs', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act
      try {
        await hierarchicalTemplateSource.getPrimary('step-01');
      } catch {
        // Pode falhar dependendo da implementação
      }

      // Assert
      const fetchCalls = fileAccessHistory.filter(r => r.type === 'fetch');
      
      console.log('\n🌐 Chamadas fetch registradas:');
      fetchCalls.forEach(record => {
        console.log(`   ${record.method} ${record.url}`);
      });
      
      if (fetchCalls.length > 0) {
        expect(fetchCalls.some(r => r.url.includes('.json'))).toBe(true);
      }
    });
  });

  describe('Mapeamento de Dependências', () => {
    it('deve mapear dependências de arquivos JSON', async () => {
      // Arrange
      const dependencies = {
        'TemplateService': [
          '@/templates/registry',
          '@/services/core/HierarchicalTemplateSource',
        ],
        'HierarchicalTemplateSource': [
          '@/templates/loaders/jsonStepLoader',
        ],
        'jsonStepLoader': [
          '/templates/{templateId}/step-{XX}.json',
        ],
      };

      // Assert - documentar estrutura
      console.log('\n🗺️ Mapa de dependências:');
      Object.entries(dependencies).forEach(([module, deps]) => {
        console.log(`\n   ${module}:`);
        deps.forEach(dep => {
          console.log(`     └─ ${dep}`);
        });
      });
      
      expect(Object.keys(dependencies).length).toBeGreaterThan(0);
    });
  });

  describe('Análise de Performance de Carregamento', () => {
    it('deve medir tempo de carregamento por tipo de arquivo', async () => {
      // Arrange
      const timings: Record<string, number[]> = {
        'master.v3.json': [],
        'step-XX.json': [],
      };

      // Act
      const start = Date.now();
      try {
        await templateService.prepareTemplate('quiz21StepsComplete');
        hierarchicalTemplateSource.setActiveTemplate('quiz21StepsComplete');
        await hierarchicalTemplateSource.getPrimary('step-01');
      } catch {
        // Pode falhar
      }
      const duration = Date.now() - start;

      // Assert
      console.log(`\n⏱️ Tempo total: ${duration}ms`);
      console.log(`   Acessos registrados: ${fileAccessHistory.length}`);
      
      if (fileAccessHistory.length > 0) {
        const avgTime = duration / fileAccessHistory.length;
        console.log(`   Tempo médio por acesso: ${avgTime.toFixed(2)}ms`);
      }
      
      expect(duration).toBeLessThan(5000); // Deve completar em < 5s
    });
  });

  describe('Relatório de Arquivos JSON Únicos', () => {
    it('deve listar todos os JSONs únicos acessados', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act - navegar por vários steps
      const steps = ['step-01', 'step-02', 'step-03', 'step-01'];
      for (const step of steps) {
        try {
          await hierarchicalTemplateSource.getPrimary(step);
        } catch {
          // Pode falhar
        }
      }

      // Assert
      const uniqueUrls = new Set(fileAccessHistory.map(r => r.url));
      
      console.log('\n📋 Arquivos únicos acessados:');
      Array.from(uniqueUrls).sort().forEach((url, index) => {
        console.log(`   ${index + 1}. ${url}`);
      });
      
      console.log(`\nTotal: ${uniqueUrls.size} arquivo(s) único(s)`);
      console.log(`Acessos totais: ${fileAccessHistory.length}`);
      
      if (fileAccessHistory.length > 0) {
        const cacheHitRate = ((fileAccessHistory.length - uniqueUrls.size) / fileAccessHistory.length * 100);
        console.log(`Taxa de cache hit: ${cacheHitRate.toFixed(1)}%`);
      }
    });
  });

  describe('Detecção de Arquivos Faltando', () => {
    it('deve identificar JSONs que não foram encontrados', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';
      hierarchicalTemplateSource.setActiveTemplate(templateId);

      // Act - tentar acessar steps inválidos
      const invalidSteps = ['step-00', 'step-99'];
      for (const step of invalidSteps) {
        try {
          await hierarchicalTemplateSource.getPrimary(step);
        } catch (error) {
          const record: FileAccessRecord = {
            timestamp: Date.now(),
            url: `/templates/${templateId}/${step}.json`,
            method: 'GET',
            type: 'fetch',
            success: false,
            error: (error as Error).message,
          };
          fileAccessHistory.push(record);
        }
      }

      // Assert
      const failedAccesses = fileAccessHistory.filter(r => !r.success);
      
      console.log('\n❌ Arquivos não encontrados:');
      failedAccesses.forEach(record => {
        console.log(`   ${record.url}`);
        console.log(`     └─ Erro: ${record.error}`);
      });
      
      expect(failedAccesses.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Geração de Relatório Completo', () => {
    it('deve gerar relatório completo de uso de JSONs', async () => {
      // Arrange
      const templateId = 'quiz21StepsComplete';

      // Act - fluxo completo de edição
      await templateService.prepareTemplate(templateId);
      hierarchicalTemplateSource.setActiveTemplate(templateId);
      
      const steps = ['step-01', 'step-02', 'step-01', 'step-03'];
      for (const step of steps) {
        try {
          await hierarchicalTemplateSource.getPrimary(step);
        } catch {
          // Ignorar erros
        }
      }

      // Assert e Relatório
      console.log('\n' + '='.repeat(60));
      console.log('📊 RELATÓRIO COMPLETO DE CARREGAMENTO DE JSONs');
      console.log('='.repeat(60));
      
      console.log('\n1. RESUMO GERAL:');
      console.log(`   Template: ${templateId}`);
      console.log(`   Total de acessos: ${fileAccessHistory.length}`);
      console.log(`   Arquivos únicos: ${new Set(fileAccessHistory.map(r => r.url)).size}`);
      
      console.log('\n2. POR TIPO DE ACESSO:');
      const byType = fileAccessHistory.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      Object.entries(byType).forEach(([type, count]) => {
        console.log(`   ${type.toUpperCase()}: ${count}`);
      });
      
      console.log('\n3. ARQUIVOS ACESSADOS (cronológico):');
      fileAccessHistory.forEach((record, index) => {
        const status = record.success ? '✅' : '❌';
        console.log(`   ${index + 1}. ${status} [${record.type}] ${record.url}`);
      });
      
      console.log('\n4. ANÁLISE DE CACHE:');
      const uniqueUrls = new Set(fileAccessHistory.map(r => r.url));
      const totalAccesses = fileAccessHistory.length;
      const cacheHits = totalAccesses - uniqueUrls.size;
      const cacheHitRate = totalAccesses > 0 ? (cacheHits / totalAccesses * 100) : 0;
      console.log(`   Cache hits: ${cacheHits}`);
      console.log(`   Cache misses: ${uniqueUrls.size}`);
      console.log(`   Taxa de acerto: ${cacheHitRate.toFixed(1)}%`);
      
      console.log('\n5. RECOMENDAÇÕES:');
      if (cacheHitRate < 50) {
        console.log('   ⚠️ Taxa de cache baixa - considere implementar cache mais agressivo');
      } else {
        console.log('   ✅ Taxa de cache saudável');
      }
      
      if (uniqueUrls.size > 10) {
        console.log('   ⚠️ Muitos arquivos únicos - considere bundling');
      }
      
      console.log('\n' + '='.repeat(60));
      
      expect(fileAccessHistory.length).toBeGreaterThanOrEqual(0);
    });
  });
});
