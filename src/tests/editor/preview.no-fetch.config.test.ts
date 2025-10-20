import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

/**
 * Verifica que, em modo preview/editor (editorMode=true),
 * o hook useComponentConfiguration não realiza chamadas de rede (fetch)
 * e não invoca ConfigurationAPI.getConfiguration, retornando defaults.
 */

describe('Preview sem fetch para configurações (useComponentConfiguration)', () => {
  let fetchSpy: any;

  beforeEach(() => {
    vi.resetModules();
    fetchSpy = vi.spyOn(global as any, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('editorMode=true deve carregar defaultProperties e não chamar fetch/getConfiguration', async () => {
  // Carregar módulos frescos com mocks (dinâmico para garantir spies corretos)
  const apiMod = await import('@/services/ConfigurationAPI');
  const hookMod = await import('@/hooks/useComponentConfiguration');

    // Espionar métodos da API real
    const getConfigSpy = vi.spyOn(apiMod.ConfigurationAPI.prototype, 'getConfiguration');
    const getDefSpy = vi.spyOn(apiMod.ConfigurationAPI.prototype, 'getComponentDefinition');

    const { result } = renderHook(() => hookMod.useComponentConfiguration({
      componentId: 'quiz-global-config',
      funnelId: 'preview-funnel',
      editorMode: true, // chave: ativa caminho de preview
      realTimeSync: true,
    } as any));

    // Aguardar sair do loading (sem waitFor para compatibilidade)
    await new Promise<void>((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        if (!result.current.isLoading) return resolve();
        if (Date.now() - start > 3000) return reject(new Error('timeout'));
        setTimeout(tick, 20);
      };
      tick();
    });

    // Deve ter buscado a definição (para pegar defaultProperties), mas não configuração
    expect(getDefSpy).toHaveBeenCalledTimes(1);
    expect(getConfigSpy).not.toHaveBeenCalled();

    // Não deve ter realizado fetch HTTP
    expect(fetchSpy).not.toHaveBeenCalled();

    // Deve ter propriedades padrão definidas
    expect(result.current.properties).toBeTruthy();
    expect(Object.keys(result.current.properties).length).toBeGreaterThan(0);
  });
});
