// @ts-nocheck
// EXEMPLO PRÁTICO - Implementação de um novo componente seguindo o checklist

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';

/**
 * Exemplo de Componente Editável para o Editor Fixed
 *
 * Este é um exemplo prático de como implementar um componente
 * que segue todas as diretrizes do checklist.
 *
 * @example
 * ```tsx
 * <ExampleEditableComponent
 *   id="example-1"
 *   properties={{
 *     enabled: true,
 *     title: "Título do Exemplo",
 *     subtitle: "Subtítulo opcional",
 *     backgroundColor: "#f0f9ff",
 *     textColor: "#1e40af"
 *   }}
 *   isEditing={true}
 *   onUpdate={(id, updates) => console.log(updates)}
 * />
 * ```
 */

// ✅ 1. DEFINIÇÃO DA INTERFACE (OBRIGATÓRIA)
interface ExampleEditableComponentProps {
  // Propriedades básicas (OBRIGATÓRIAS)
  id: string;
  className?: string;
  style?: React.CSSProperties;

  // Propriedades editáveis (CUSTOMIZÁVEIS)
  properties?: {
    // Controles principais
    enabled?: boolean;

    // Conteúdo
    title?: string;
    subtitle?: string;
    showBadge?: boolean;

    // Estilo visual
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    padding?: string;
    textAlign?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';

    // Configurações avançadas
    animation?: boolean;
    shadow?: boolean;
  };

  // Propriedades de edição (OBRIGATÓRIAS)
  isEditing?: boolean;
  isSelected?: boolean;
  onUpdate?: (id: string, updates: any) => void;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
}

// ✅ 2. IMPLEMENTAÇÃO DO COMPONENTE
export const ExampleEditableComponent: React.FC<ExampleEditableComponentProps> = ({
  id,
  className = '',
  style = {},
  properties = {
    // ✅ Valores padrão definidos
    enabled: true,
    title: 'Título do Exemplo',
    subtitle: 'Subtítulo opcional',
    showBadge: true,
    backgroundColor: '#f0f9ff',
    textColor: '#1e40af',
    borderRadius: 8,
    padding: '16px',
    textAlign: 'center',
    size: 'medium',
    animation: true,
    shadow: true,
  },
  isEditing = false,
  isSelected = false,
  onUpdate,
  onClick,
  onPropertyChange,
}) => {
  // ✅ 3. ESTADO LOCAL SE NECESSÁRIO
  const [isHovered, setIsHovered] = useState(false);

  // ✅ 4. SISTEMA DE DEBUG E MONITORAMENTO
  useEffect(() => {
    if (isEditing) {
      console.log(`ExampleComponent ${id} entered editing mode`);
    }
  }, [isEditing, id]);

  useEffect(() => {
    console.log(`ExampleComponent ${id} properties updated:`, properties);
  }, [properties, id]);

  // ✅ 5. FUNÇÃO DE ATUALIZAÇÃO
  const _handleUpdate = (updates: any) => {
    onUpdate?.(id, updates);
    console.log(`ExampleComponent ${id} updated:`, updates);
  };

  // ✅ 6. FUNÇÃO DE CLIQUE
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();

    if (isEditing && properties.enabled) {
      // Lógica específica de edição
      console.log(`ExampleComponent ${id} clicked in editing mode`);
    }
  };

  // ✅ 7. CALCULAR ESTILOS BASEADOS NAS PROPRIEDADES
  const getSizeStyles = () => {
    switch (properties.size) {
      case 'small':
        return { fontSize: '14px' };
      case 'large':
        return { fontSize: '20px' };
      default:
        return { fontSize: '16px' };
    }
  };

  const containerStyles: React.CSSProperties = {
    // Propriedades básicas
    backgroundColor: properties.backgroundColor,
    color: properties.textColor,
    borderRadius: `${properties.borderRadius}px`,
    padding: properties.padding,
    textAlign: properties.textAlign as 'left' | 'center' | 'right',
    ...getSizeStyles(),

    // Box model
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',

    // Visual feedback
    cursor: isEditing ? 'pointer' : 'default',
    border: isSelected ? '2px dashed #B89B7A' : '1px solid #e5e7eb',
    transition: properties.animation ? 'all 0.3s ease' : 'none',
    boxShadow: properties.shadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',

    // Estados especiais
    opacity: properties.enabled === false ? 0.5 : isHovered ? 0.9 : 1,
    pointerEvents: properties.enabled === false ? 'none' : 'auto',
    transform: isHovered && properties.animation ? 'translateY(-2px)' : 'none',

    // Aplicar estilos externos
    ...style,
  };

  // ✅ 8. RENDERIZAÇÃO CONDICIONAL QUANDO DESABILITADO
  if (!properties.enabled && !isEditing) {
    return null;
  }

  return (
    <div
      id={id}
      className={`example-editable-component ${className} ${isEditing ? 'editing-mode' : ''}`}
      style={containerStyles}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ 9. CONTEÚDO PRINCIPAL */}
      <div className="component-content">
        <h3 style={{ margin: 0, marginBottom: properties.subtitle ? '8px' : 0 }}>
          {properties.title}
        </h3>

        {properties.subtitle && (
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9em' }}>{properties.subtitle}</p>
        )}

        {properties.showBadge && (
          <Badge
            variant="secondary"
            style={{
              marginTop: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: properties.textColor,
            }}
          >
            Exemplo
          </Badge>
        )}
      </div>

      {/* ✅ 10. INDICADORES DE ESTADO NO MODO DE EDIÇÃO */}
      {isEditing && (
        <div
          className="editing-overlay"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          <Badge variant="outline" style={{ fontSize: '10px', padding: '2px 6px' }}>
            {properties.size}
          </Badge>
          {!properties.enabled && (
            <Badge variant="destructive" style={{ fontSize: '10px', padding: '2px 6px' }}>
              Desabilitado
            </Badge>
          )}
        </div>
      )}

      {/* ✅ 11. MODO DE DESENVOLVIMENTO - INFORMAÇÕES DEBUG */}
      {process.env.NODE_ENV === 'development' && isEditing && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '4px',
            fontSize: '10px',
            color: 'rgba(0, 0, 0, 0.5)',
            fontFamily: 'monospace',
          }}
        >
          ID: {id}
        </div>
      )}
    </div>
  );
};

// ✅ 12. EXPORTAÇÃO PADRÃO E NOMEADA
export default ExampleEditableComponent;

/*
 * ✅ CHECKLIST DE VERIFICAÇÃO:
 *
 * [x] Interface TypeScript completa
 * [x] Propriedades padrão definidas
 * [x] Callbacks de edição implementados
 * [x] Estilos responsivos configurados
 * [x] Estados de interação funcionais
 * [x] Sistema de logs para debug
 * [x] Renderização condicional
 * [x] Feedback visual de estados
 * [x] Documentação JSDoc
 * [x] Exportação adequada
 *
 * PRÓXIMOS PASSOS:
 * 1. Adicionar ao ComponentSpecificPropertiesPanel.tsx
 * 2. Criar função renderExampleEditableComponentProperties()
 * 3. Registrar no switch principal
 * 4. Adicionar ao ComponentTestingPanel.tsx
 * 5. Configurar nome amigável e ícone
 */
