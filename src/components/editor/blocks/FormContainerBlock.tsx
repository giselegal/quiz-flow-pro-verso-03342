import React, { useEffect } from 'react';
import type { BlockComponentProps, BlockData } from '@/types/blocks';
import { getBlockComponent } from '@/config/enhancedBlockRegistry';

/**
 * FormContainerBlock
 * Renderiza um container de formulário e seus filhos definidos via JSON (properties.children).
 */
const FormContainerBlock: React.FC<BlockComponentProps> = ({ block }) => {
  const { properties = {} } = block || {};
  const { elementId, className, marginTop, marginBottom } = (properties as any) || {};

  // Fonte única de verdade para children: prioriza block.children e faz fallback para properties.children
  const childrenList = (block as any)?.children || (properties as any)?.children || [];

  const containerStyle: React.CSSProperties = {
    marginTop,
    marginBottom,
    paddingTop: (properties as any)?.paddingTop,
    paddingBottom: (properties as any)?.paddingBottom,
    paddingLeft: (properties as any)?.paddingLeft,
    paddingRight: (properties as any)?.paddingRight,
    // Suporta tanto backgroundColor quanto containerBackgroundColor (padrão do design system universal)
    backgroundColor:
      (properties as any)?.backgroundColor ?? (properties as any)?.containerBackgroundColor,
  };

  const combinedClassName = className ? `w-full ${className}` : 'w-full';

  // 🔒 Regra: habilitar botão somente após nome válido (configurável no painel)
  useEffect(() => {
    // ✅ Lista de IDs de botão possíveis no Step-01
    const possibleButtonIds = [
      'intro-cta-button', // ✅ ID principal do template Step01
      'step01-cta-button', // ✅ ID alternativo
      'step01-start-button', // ✅ ID alternativo
      'cta-button-modular', // ✅ ID genérico
      (properties as any)?.targetButtonId, // ✅ ID configurável via properties
    ].filter(Boolean);

    // Estado inicial: desabilitar visualmente todos os botões possíveis
    const applyDisabled = (disabled: boolean, targetId?: string) => {
      const idsToCheck = targetId ? [targetId] : possibleButtonIds;

      idsToCheck.forEach(buttonId => {
        const btn = document.getElementById(buttonId) as HTMLButtonElement | null;
        if (!btn) return;

        btn.disabled = disabled;
        if ((properties as any)?.visuallyDisableButton) {
          btn.classList.toggle('opacity-50', disabled);
          btn.classList.toggle('pointer-events-none', disabled);
          btn.classList.toggle('cursor-not-allowed', disabled);
        }

        // Log apenas quando encontrar o botão
        if (btn) {
          console.log(
            `🔘 [FormContainerBlock] Button ${buttonId} ${disabled ? 'DISABLED' : 'ENABLED'}`
          );
        }
      });
    };

    // Aplica estado inicial (desabilitar todos)
    applyDisabled(true);

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        buttonId: string;
        enabled: boolean;
        disabled: boolean;
      };

      if (!detail || !possibleButtonIds.includes(detail.buttonId)) return;

      // Log apenas mudanças de estado importantes
      if (detail.enabled) {
        console.log(`✅ [FormContainerBlock] Button ${detail.buttonId} ENABLED`);
      }

      applyDisabled(!detail.enabled, detail.buttonId);
    };

    window.addEventListener('step01-button-state-change', handler as EventListener);
    return () => window.removeEventListener('step01-button-state-change', handler as EventListener);
  }, [properties]);

  return (
    <div id={elementId} className={combinedClassName} style={containerStyle}>
      {Array.isArray(childrenList) &&
        childrenList.map((child: any, index: number) => {
          const Component = getBlockComponent(child.type);
          if (!Component) return null;

          const childBlock: BlockData = {
            id: child.id || `${block.id}-child-${index}`,
            type: child.type,
            properties: child.properties || {},
            content: child.content || {},
            order: index,
          };

          // Renderizamos o componente filho passando o bloco completo
          return <Component key={childBlock.id} {...childBlock} />;
        })}
    </div>
  );
};

export default FormContainerBlock;
