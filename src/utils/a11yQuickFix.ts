/**
 * Quick fix utilities para problemas comuns de acessibilidade
 * 
 * Use com cautela - valide sempre após aplicar correções automáticas
 */

export interface QuickFixResult {
  fixed: number;
  skipped: number;
  errors: string[];
  details: string[];
}

/**
 * Adiciona alt text a todas as imagens sem alt
 * 
 * ATENÇÃO: Usa alt genérico - revise manualmente após
 */
export function fixMissingAltText(container: HTMLElement = document.body): QuickFixResult {
  const result: QuickFixResult = {
    fixed: 0,
    skipped: 0,
    errors: [],
    details: [],
  };

  const images = container.querySelectorAll('img:not([alt])');
  
  images.forEach((img: Element) => {
    try {
      const htmlImg = img as HTMLImageElement;
      const src = htmlImg.src || htmlImg.getAttribute('src') || '';
      
      // Gerar alt text baseado no src
      const filename = src.split('/').pop()?.split('.')[0] || 'imagem';
      const altText = filename
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
      
      htmlImg.setAttribute('alt', altText);
      result.fixed++;
      result.details.push(`Adicionado alt="${altText}" em ${src}`);
    } catch (error) {
      result.errors.push(`Erro ao processar imagem: ${error}`);
      result.skipped++;
    }
  });

  return result;
}

/**
 * Adiciona aria-label a botões sem texto acessível
 * 
 * ATENÇÃO: Usa label genérico - revise manualmente após
 */
export function fixButtonLabels(container: HTMLElement = document.body): QuickFixResult {
  const result: QuickFixResult = {
    fixed: 0,
    skipped: 0,
    errors: [],
    details: [],
  };

  const buttons = container.querySelectorAll('button:not([aria-label])');
  
  buttons.forEach((button: Element) => {
    try {
      const htmlButton = button as HTMLButtonElement;
      
      // Verificar se já tem texto visível
      const textContent = htmlButton.textContent?.trim() || '';
      if (textContent) {
        result.skipped++;
        return;
      }
      
      // Procurar ícones comuns
      const hasIcon = htmlButton.querySelector('svg, [class*="icon"]');
      if (!hasIcon) {
        result.skipped++;
        return;
      }
      
      // Tentar inferir ação pelo contexto
      const classList = Array.from(htmlButton.classList);
      let label = 'Ação';
      
      if (classList.some(c => /delete|remove|trash/i.test(c))) {
        label = 'Excluir';
      } else if (classList.some(c => /edit|pencil/i.test(c))) {
        label = 'Editar';
      } else if (classList.some(c => /add|plus/i.test(c))) {
        label = 'Adicionar';
      } else if (classList.some(c => /close|x/i.test(c))) {
        label = 'Fechar';
      } else if (classList.some(c => /save|check/i.test(c))) {
        label = 'Salvar';
      }
      
      htmlButton.setAttribute('aria-label', label);
      result.fixed++;
      result.details.push(`Adicionado aria-label="${label}" em botão`);
    } catch (error) {
      result.errors.push(`Erro ao processar botão: ${error}`);
      result.skipped++;
    }
  });

  return result;
}

/**
 * Adiciona aria-hidden="true" a ícones decorativos
 */
export function fixDecorativeIcons(container: HTMLElement = document.body): QuickFixResult {
  const result: QuickFixResult = {
    fixed: 0,
    skipped: 0,
    errors: [],
    details: [],
  };

  // SVGs dentro de botões/links que já têm label
  const icons = container.querySelectorAll('button svg:not([aria-hidden]), a svg:not([aria-hidden])');
  
  icons.forEach((icon: Element) => {
    try {
      const parent = icon.parentElement;
      if (!parent) return;
      
      // Verificar se parent tem aria-label ou texto
      const hasLabel = parent.hasAttribute('aria-label') || 
                      parent.hasAttribute('aria-labelledby') ||
                      (parent.textContent?.trim().length || 0) > 0;
      
      if (hasLabel) {
        icon.setAttribute('aria-hidden', 'true');
        result.fixed++;
        result.details.push('Marcado ícone como decorativo');
      } else {
        result.skipped++;
      }
    } catch (error) {
      result.errors.push(`Erro ao processar ícone: ${error}`);
      result.skipped++;
    }
  });

  return result;
}

/**
 * Adiciona labels a inputs sem label
 * 
 * ATENÇÃO: Usa label baseado em placeholder - revise manualmente
 */
export function fixInputLabels(container: HTMLElement = document.body): QuickFixResult {
  const result: QuickFixResult = {
    fixed: 0,
    skipped: 0,
    errors: [],
    details: [],
  };

  const inputs = container.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  
  inputs.forEach((input: Element) => {
    try {
      const htmlInput = input as HTMLInputElement;
      
      // Verificar se já tem label associado
      if (htmlInput.id) {
        const hasLabel = container.querySelector(`label[for="${htmlInput.id}"]`);
        if (hasLabel) {
          result.skipped++;
          return;
        }
      }
      
      // Usar placeholder como label
      const placeholder = htmlInput.placeholder;
      if (placeholder) {
        htmlInput.setAttribute('aria-label', placeholder);
        result.fixed++;
        result.details.push(`Adicionado aria-label="${placeholder}" em input`);
      } else {
        result.skipped++;
      }
    } catch (error) {
      result.errors.push(`Erro ao processar input: ${error}`);
      result.skipped++;
    }
  });

  return result;
}

/**
 * Executa todas as correções automáticas
 * 
 * ATENÇÃO: Use apenas em desenvolvimento. Revise todas as correções!
 */
export function fixAllCommonIssues(container: HTMLElement = document.body): {
  altText: QuickFixResult;
  buttonLabels: QuickFixResult;
  decorativeIcons: QuickFixResult;
  inputLabels: QuickFixResult;
  summary: {
    totalFixed: number;
    totalSkipped: number;
    totalErrors: number;
  };
} {
  console.log('🔧 Aplicando correções automáticas de acessibilidade...');
  console.warn('⚠️ ATENÇÃO: Revise todas as correções manualmente!');

  const altText = fixMissingAltText(container);
  const buttonLabels = fixButtonLabels(container);
  const decorativeIcons = fixDecorativeIcons(container);
  const inputLabels = fixInputLabels(container);

  const summary = {
    totalFixed: altText.fixed + buttonLabels.fixed + decorativeIcons.fixed + inputLabels.fixed,
    totalSkipped: altText.skipped + buttonLabels.skipped + decorativeIcons.skipped + inputLabels.skipped,
    totalErrors: altText.errors.length + buttonLabels.errors.length + decorativeIcons.errors.length + inputLabels.errors.length,
  };

  console.log('✅ Correções aplicadas:', summary);
  console.log('📋 Detalhes:', { altText, buttonLabels, decorativeIcons, inputLabels });

  return { altText, buttonLabels, decorativeIcons, inputLabels, summary };
}

// Exportar para uso global no console
if (typeof window !== 'undefined') {
  (window as any).a11yQuickFix = {
    fixMissingAltText,
    fixButtonLabels,
    fixDecorativeIcons,
    fixInputLabels,
    fixAllCommonIssues,
  };
}
