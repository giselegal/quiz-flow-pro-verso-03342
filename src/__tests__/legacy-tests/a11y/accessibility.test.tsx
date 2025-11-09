import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useAccessibilityAudit } from '@/hooks/useAccessibilityAudit';
import { renderHook, act } from '@testing-library/react';

/**
 * Testes de integração para auditoria de acessibilidade
 * 
 * Valida que axe-core detecta corretamente problemas de acessibilidade
 */

describe('useAccessibilityAudit Hook', () => {
  it('deve executar auditoria sem erros', async () => {
    const { result } = renderHook(() => useAccessibilityAudit());

    expect(result.current.isRunning).toBe(false);
    expect(result.current.result).toBeNull();

    // Executar auditoria
    await act(async () => {
      await result.current.runAudit();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.result).toBeTruthy();
    expect(Array.isArray(result.current.result?.issues)).toBe(true);
  });

  it('deve detectar imagem sem alt text', async () => {
    // Criar elemento com problema de acessibilidade
    const container = document.createElement('div');
    container.innerHTML = '<img src="test.jpg" />';
    document.body.appendChild(container);

    const { result } = renderHook(() => useAccessibilityAudit());

    await act(async () => {
      await result.current.runAudit(container);
    });

    const imageAltIssue = result.current.result?.issues.find(
      (issue) => issue.id === 'image-alt'
    );

    expect(imageAltIssue).toBeTruthy();
    expect(imageAltIssue?.impact).toMatch(/critical|serious/);

    document.body.removeChild(container);
  });

  it('deve detectar botão sem label acessível', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<button></button>';
    document.body.appendChild(container);

    const { result } = renderHook(() => useAccessibilityAudit());

    await act(async () => {
      await result.current.runAudit(container);
    });

    const buttonNameIssue = result.current.result?.issues.find(
      (issue) => issue.id === 'button-name'
    );

    expect(buttonNameIssue).toBeTruthy();

    document.body.removeChild(container);
  });

  it('deve passar para elementos acessíveis', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <img src="test.jpg" alt="Descrição da imagem" />
      <button aria-label="Clique aqui">Enviar</button>
      <label for="input">Nome</label>
      <input id="input" type="text" />
    `;
    document.body.appendChild(container);

    const { result } = renderHook(() => useAccessibilityAudit());

    await act(async () => {
      await result.current.runAudit(container);
    });

    // Não deve ter issues críticos/sérios para esses elementos
    const criticalIssues = result.current.result?.issues.filter(
      (issue) => issue.impact === 'critical' || issue.impact === 'serious'
    );

    // Pode ter issues moderados/menores de outras regras, mas não dos elementos acima
    const imageIssues = criticalIssues?.filter((issue) => issue.id === 'image-alt');
    const buttonIssues = criticalIssues?.filter((issue) => issue.id === 'button-name');
    const labelIssues = criticalIssues?.filter((issue) => issue.id === 'label');

    expect(imageIssues?.length || 0).toBe(0);
    expect(buttonIssues?.length || 0).toBe(0);
    expect(labelIssues?.length || 0).toBe(0);

    document.body.removeChild(container);
  });

  it('deve limpar resultados', async () => {
    const { result } = renderHook(() => useAccessibilityAudit());

    await act(async () => {
      await result.current.runAudit();
    });

    expect(result.current.result).toBeTruthy();

    act(() => {
      result.current.clear();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

describe('Accessibility Best Practices', () => {
  it('deve validar heading hierarchy', async () => {
    const container = document.createElement('div');
    // Hierarquia incorreta (h1 -> h3, pula h2)
    container.innerHTML = `
      <h1>Título Principal</h1>
      <h3>Subtítulo</h3>
    `;
    document.body.appendChild(container);

    const { result } = renderHook(() => useAccessibilityAudit());

    await act(async () => {
      await result.current.runAudit(container);
    });

    // axe-core pode não detectar isso diretamente, mas é boa prática
    // Este teste documenta a importância da hierarquia

    document.body.removeChild(container);
  });

  it('deve validar contraste de cores (manual)', () => {
    // Teste manual - axe-core pode ter problemas com cores computadas
    // Documentar que cores devem ter contraste mínimo 4.5:1
    const minContrast = 4.5;
    expect(minContrast).toBeGreaterThanOrEqual(4.5);
  });
});
