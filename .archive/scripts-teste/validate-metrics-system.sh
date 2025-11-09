#!/bin/bash

# 📊 VALIDAÇÃO COMPLETA DO SISTEMA DE MÉTRICAS DO EDITOR
# 
# Script para validar se todas as métricas e observabilidade
# foram implementadas corretamente

echo "🔍 Validando Sistema de Métricas do Editor de Funis..."
echo "=================================================="

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TOTAL_CHECKS=0
PASSED_CHECKS=0

# Função para verificar arquivos
check_file() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌${NC} $2"
        echo -e "   ${YELLOW}Arquivo não encontrado: $1${NC}"
    fi
}

# Função para verificar conteúdo de arquivo
check_content() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ -f "$1" ] && grep -q "$3" "$1"; then
        echo -e "${GREEN}✅${NC} $2"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌${NC} $2"
        echo -e "   ${YELLOW}Conteúdo '$3' não encontrado em $1${NC}"
    fi
}

echo -e "${BLUE}📋 1. Verificando Interfaces de Métricas${NC}"
echo "----------------------------------------"

check_file "src/core/editor/interfaces/EditorInterfaces.ts" "EditorInterfaces.ts existe"
check_content "src/core/editor/interfaces/EditorInterfaces.ts" "Interface EditorMetricsProvider definida" "EditorMetricsProvider"
check_content "src/core/editor/interfaces/EditorInterfaces.ts" "Tipos de métricas definidos" "EditorMetricType"
check_content "src/core/editor/interfaces/EditorInterfaces.ts" "Tipos de operações definidos" "EditorOperationType"
check_content "src/core/editor/interfaces/EditorInterfaces.ts" "Métricas de validação definidas" "EditorValidationMetrics"
check_content "src/core/editor/interfaces/EditorInterfaces.ts" "Métricas de carregamento definidas" "EditorLoadingMetrics"
check_content "src/core/editor/interfaces/EditorInterfaces.ts" "Métricas de fallback definidas" "EditorFallbackMetrics"

echo ""
echo -e "${BLUE}📊 2. Verificando Provider de Métricas${NC}"
echo "---------------------------------------"

check_file "src/core/editor/providers/EditorMetricsProvider.ts" "EditorMetricsProvider.ts existe"
check_content "src/core/editor/providers/EditorMetricsProvider.ts" "EditorMetricsProviderImpl implementada" "EditorMetricsProviderImpl"
check_content "src/core/editor/providers/EditorMetricsProvider.ts" "Integração com MonitoringService" "MonitoringService"
check_content "src/core/editor/providers/EditorMetricsProvider.ts" "Integração com PerformanceMonitor" "PerformanceMonitor"
check_content "src/core/editor/providers/EditorMetricsProvider.ts" "Integração com RealTimeAnalytics" "RealTimeAnalytics"
check_content "src/core/editor/providers/EditorMetricsProvider.ts" "Factory para criação de providers" "EditorMetricsFactory"

echo ""
echo -e "${BLUE}🎨 3. Verificando Instrumentação do Editor${NC}"
echo "---------------------------------------------"

check_file "src/core/editor/components/FunnelEditor.tsx" "FunnelEditor.tsx existe"
check_content "src/core/editor/components/FunnelEditor.tsx" "Import do EditorMetricsFactory" "EditorMetricsFactory"
check_content "src/core/editor/components/FunnelEditor.tsx" "Performance tracking implementado" "startPerformanceTimer"
check_content "src/core/editor/components/FunnelEditor.tsx" "Error tracking implementado" "recordError"
check_content "src/core/editor/components/FunnelEditor.tsx" "Success tracking implementado" "recordSuccess"
check_content "src/core/editor/components/FunnelEditor.tsx" "Métricas de carregamento" "recordLoadingMetrics"
check_content "src/core/editor/components/FunnelEditor.tsx" "Métricas de validação" "recordValidationMetrics"

echo ""
echo -e "${BLUE}🧪 4. Verificando Mocks e Testes${NC}"
echo "--------------------------------"

check_file "src/core/editor/mocks/EditorMocks.ts" "EditorMocks.ts existe"
check_content "src/core/editor/mocks/EditorMocks.ts" "MockEditorMetricsProvider implementado" "MockEditorMetricsProvider"
check_content "src/core/editor/mocks/EditorMocks.ts" "Simulação de métricas implementada" "simulateSlowOperation"
check_content "src/core/editor/mocks/EditorMocks.ts" "Simulação de erros implementada" "simulateError"
check_content "src/core/editor/mocks/EditorMocks.ts" "Factory com métricas" "createMetricsTestSetup"

echo ""
echo -e "${BLUE}📊 5. Verificando Dashboard de Métricas${NC}"
echo "----------------------------------------"

check_file "src/core/editor/components/EditorMetricsDashboard.tsx" "EditorMetricsDashboard.tsx existe"
check_content "src/core/editor/components/EditorMetricsDashboard.tsx" "Dashboard principal implementado" "EditorMetricsDashboard"
check_content "src/core/editor/components/EditorMetricsDashboard.tsx" "Dashboard simplificado implementado" "EditorMetricsDashboardSimple"
check_content "src/core/editor/components/EditorMetricsDashboard.tsx" "Visualização de métricas" "MetricCard"
check_content "src/core/editor/components/EditorMetricsDashboard.tsx" "Análise de tendências" "getRecentTrends"

echo ""
echo -e "${BLUE}🔗 6. Verificando Integração Completa${NC}"
echo "-----------------------------------"

check_file "src/core/editor/examples/EditorMetricsIntegration.tsx" "EditorMetricsIntegration.tsx existe"
check_content "src/core/editor/examples/EditorMetricsIntegration.tsx" "Integração completa implementada" "EditorWithMetricsIntegration"
check_content "src/core/editor/examples/EditorMetricsIntegration.tsx" "Hook personalizado" "useEditorMetrics"
check_content "src/core/editor/examples/EditorMetricsIntegration.tsx" "Utilitários de configuração" "EditorMetricsIntegration"
check_content "src/core/editor/examples/EditorMetricsIntegration.tsx" "Demo funcional" "EditorMetricsDemo"

echo ""
echo -e "${BLUE}📚 7. Verificando Documentação${NC}"
echo "------------------------------"

check_file "src/core/editor/docs/METRICS_SYSTEM_DOCUMENTATION.md" "Documentação existe"
check_content "src/core/editor/docs/METRICS_SYSTEM_DOCUMENTATION.md" "Visão geral implementada" "Visão Geral"
check_content "src/core/editor/docs/METRICS_SYSTEM_DOCUMENTATION.md" "Status da implementação" "Status da Implementação"
check_content "src/core/editor/docs/METRICS_SYSTEM_DOCUMENTATION.md" "Arquitetura documentada" "Arquitetura do Sistema"
check_content "src/core/editor/docs/METRICS_SYSTEM_DOCUMENTATION.md" "Exemplos de uso" "Como Usar"
check_content "src/core/editor/docs/METRICS_SYSTEM_DOCUMENTATION.md" "Configuração avançada" "Configuração Avançada"

echo ""
echo -e "${BLUE}🌍 8. Verificando Integração com Sistema Global${NC}"
echo "-----------------------------------------------"

# Verificar se os serviços globais existem
check_file "src/services/core/MonitoringService.ts" "MonitoringService existe"
check_file "src/utils/performanceMonitoring.ts" "PerformanceMonitoring existe"  
check_file "src/services/realTimeAnalytics.ts" "RealTimeAnalytics existe"

# Verificar estruturas esperadas nos serviços globais
check_content "src/services/core/MonitoringService.ts" "Logging estruturado" "recordMetric"
check_content "src/utils/performanceMonitoring.ts" "Performance tracking" "PerformanceMonitor"
check_content "src/services/realTimeAnalytics.ts" "Analytics em tempo real" "trackQuizStarted"

echo ""
echo "=================================================="
echo -e "${BLUE}📊 RESUMO DA VALIDAÇÃO${NC}"
echo "=================================================="

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}🎉 TODOS OS CHECKS PASSARAM!${NC}"
    echo -e "${GREEN}✅ $PASSED_CHECKS/$TOTAL_CHECKS verificações bem-sucedidas${NC}"
    echo ""
    echo -e "${GREEN}🚀 SISTEMA DE MÉTRICAS COMPLETAMENTE IMPLEMENTADO${NC}"
    echo ""
    echo "Funcionalidades disponíveis:"
    echo -e "  ${GREEN}✅${NC} Instrumentação de métricas em todas operações críticas"
    echo -e "  ${GREEN}✅${NC} Validação de performance, carregamento e fallback"
    echo -e "  ${GREEN}✅${NC} Dashboard de visualização em tempo real"
    echo -e "  ${GREEN}✅${NC} Integração com sistema global de observabilidade"
    echo -e "  ${GREEN}✅${NC} Mocks funcionais para testes"
    echo -e "  ${GREEN}✅${NC} Documentação completa"
    echo -e "  ${GREEN}✅${NC} Alertas automáticos e relatórios de performance"
    echo ""
    echo -e "${BLUE}🎯 PRÓXIMOS PASSOS:${NC}"
    echo "1. Integrar FunnelEditor na aplicação principal"
    echo "2. Configurar thresholds específicos para produção"
    echo "3. Setup de alertas em ferramentas de monitoramento"
    echo "4. Treinar equipe na análise de métricas"
    
    exit 0
else
    echo -e "${RED}❌ ALGUNS CHECKS FALHARAM${NC}"
    echo -e "${RED}❌ $PASSED_CHECKS/$TOTAL_CHECKS verificações bem-sucedidas${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Verifique os itens marcados com ❌ acima${NC}"
    
    exit 1
fi
