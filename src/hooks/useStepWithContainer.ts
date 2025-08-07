/**
 * 🚀 HOOK COMPOSTO PARA STEPS COM CONTAINER PROPERTIES
 * ==================================================
 *
 * Combina useContainerProperties com outras funcionalidades
 * para criar um hook completo para steps de quiz.
 */

import { useCallback, useMemo } from "react";
import { useIsMobile } from "./use-mobile";
import { useContainerProperties } from "./useContainerProperties";
import { usePerformanceOptimization } from "./usePerformanceOptimization";

export interface StepWithContainerProps {
  stepId: number;
  containerWidth?: "full" | "large" | "medium" | "small";
  containerPosition?: "left" | "center" | "right";
  spacing?: "none" | "small" | "compact" | "normal" | "comfortable" | "spacious";
  backgroundColor?: "transparent" | "white" | "gray-50" | "brand-light";
  enableMobileOptimizations?: boolean;
  enablePerformanceOptimizations?: boolean;
}

/**
 * Hook composto que integra container properties, mobile detection e performance
 */
export const useStepWithContainer = (props: StepWithContainerProps) => {
  const {
    stepId,
    enableMobileOptimizations = true,
    enablePerformanceOptimizations = true,
    ...containerProps
  } = props;

  // 🔗 Integrar hooks existentes
  const isMobile = useIsMobile();
  const performance = usePerformanceOptimization();

  // 📱 Otimizações específicas para mobile
  const mobileOptimizations = useMemo(() => {
    if (!enableMobileOptimizations || !isMobile) return {};

    return {
      // Container mais estreito no mobile
      containerWidth:
        containerProps.containerWidth === "large"
          ? ("medium" as const)
          : containerProps.containerWidth,
      // Espaçamento mais compacto no mobile
      spacing:
        containerProps.spacing === "spacious"
          ? ("comfortable" as const)
          : containerProps.spacing === "comfortable"
            ? ("normal" as const)
            : containerProps.spacing,
      // Grid sempre full no mobile
      gridColumns: "full" as const,
    };
  }, [isMobile, enableMobileOptimizations, containerProps.containerWidth, containerProps.spacing]);

  // ⚡ Classes otimizadas com base no dispositivo
  const optimizedContainerProps = useMemo(
    () => ({
      ...containerProps,
      ...mobileOptimizations,
    }),
    [containerProps, mobileOptimizations]
  );

  const { containerClasses, inlineStyles } = useContainerProperties(optimizedContainerProps);

  // 🎯 Performance optimizations
  const performanceOptimizations = useMemo(() => {
    if (!enablePerformanceOptimizations) return {};

    return {
      // Lazy loading para steps não visíveis
      shouldLazyLoad: stepId > 3,
      // Debounce para interações
      debounceTime: isMobile ? 300 : 150,
      // Throttle para animações
      throttleTime: isMobile ? 100 : 50,
    };
  }, [stepId, isMobile, enablePerformanceOptimizations]);

  // 🔧 Função para aplicar todas as classes
  const getStepClasses = useCallback(() => {
    const baseClasses = containerClasses;

    // Adicionar classes de performance se necessário
    const performanceClasses = performanceOptimizations.shouldLazyLoad
      ? "opacity-0 animate-in"
      : "";

    return `${baseClasses} ${performanceClasses}`.trim();
  }, [containerClasses, performanceOptimizations.shouldLazyLoad]);

  // 📊 Stats do hook composto
  const stats = useMemo(
    () => ({
      stepId,
      isMobile,
      hasContainerOptimizations: Object.keys(optimizedContainerProps).length > 0,
      hasMobileOptimizations: Object.keys(mobileOptimizations).length > 0,
      hasPerformanceOptimizations: Object.keys(performanceOptimizations).length > 0,
      totalOptimizations:
        Object.keys(mobileOptimizations).length + Object.keys(performanceOptimizations).length,
    }),
    [stepId, isMobile, optimizedContainerProps, mobileOptimizations, performanceOptimizations]
  );

  return {
    // 🎨 Classes CSS otimizadas
    stepClasses: getStepClasses(),
    containerClasses,
    inlineStyles,

    // 📱 Informações de device
    isMobile,

    // ⚡ Performance
    performance: performanceOptimizations,

    // 📊 Estatísticas
    stats,

    // 🔧 Utilitários
    applyContainerOptimizations: (additionalClasses?: string) => {
      return `${getStepClasses()} ${additionalClasses || ""}`.trim();
    },
  };
};

/**
 * 🎯 Hook especializado para Steps de Quiz
 */
export const useQuizStepContainer = (
  stepId: number,
  customProps?: Partial<StepWithContainerProps>
) => {
  // Configurações padrão otimizadas para steps de quiz
  const defaultQuizStepProps: StepWithContainerProps = {
    stepId,
    containerWidth: "large",
    containerPosition: "center",
    spacing: "small", // 🎯 Padrão alterado para "small" (0.75rem/12px)
    backgroundColor: "white",
    enableMobileOptimizations: true,
    enablePerformanceOptimizations: true,
    ...customProps,
  };

  return useStepWithContainer(defaultQuizStepProps);
};

export default useStepWithContainer;
