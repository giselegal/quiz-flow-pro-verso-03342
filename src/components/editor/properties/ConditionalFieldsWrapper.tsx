/**
 * 🎛️ WRAPPER PARA CAMPOS CONDICIONAIS
 * 
 * Componente que mostra/oculta campos baseado em condições
 * de outros campos no painel de propriedades
 */

import React from 'react';
import { PropertyField } from '@/services/PropertyExtractionService';

interface ConditionalFieldsWrapperProps {
  property: PropertyField;
  allProperties: PropertyField[];
  children: React.ReactNode;
}

export const ConditionalFieldsWrapper: React.FC<ConditionalFieldsWrapperProps> = ({
  property,
  allProperties,
  children
}) => {
  // Verifica se o campo deve ser exibido baseado nas condições
  const shouldShow = React.useMemo(() => {
    // Se não tem condição, sempre mostrar
    if (!property.validation || property.validation.length === 0) {
      return true;
    }

    // Verificar condições do registry (when)
    const registryCondition = (property as any).when;
    if (registryCondition) {
      const dependentProperty = allProperties.find(p => p.key === registryCondition.key);
      if (dependentProperty) {
        return dependentProperty.value === registryCondition.value;
      }
    }

    // Verificar outras validações
    for (const rule of property.validation) {
      if (rule.type === 'custom') {
        // Lógica customizada para mostrar/ocultar
        const customRule = rule.value as any;
        if (customRule?.dependsOn) {
          const dependentProperty = allProperties.find(p => p.key === customRule.dependsOn);
          if (dependentProperty && dependentProperty.value !== customRule.when) {
            return false;
          }
        }
      }
    }

    return true;
  }, [property, allProperties]);

  if (!shouldShow) {
    return null;
  }

  return <>{children}</>;
};

export default ConditionalFieldsWrapper;