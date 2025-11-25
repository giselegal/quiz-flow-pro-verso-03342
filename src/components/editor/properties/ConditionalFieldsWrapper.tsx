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
  children,
}) => {
  // Verifica se o campo deve ser exibido baseado nas condições
  const shouldShow = React.useMemo(() => {
    // Verificar condições do registry (when)
    const registryCondition = (property as any).when;
    if (registryCondition) {
      const dependentProperty = allProperties.find(p => p.key === registryCondition.key);
      if (dependentProperty) {
        return dependentProperty.value === registryCondition.value;
      }
    }

    // Se tem conditional, verificar
    const conditional = (property as any).conditional;
    if (conditional) {
      const dependentProperty = allProperties.find(p => p.key === conditional.key);
      if (dependentProperty) {
        return dependentProperty.value === conditional.value;
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