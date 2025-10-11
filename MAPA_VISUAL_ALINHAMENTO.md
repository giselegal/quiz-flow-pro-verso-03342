# 🎯 Mapa Visual de Alinhamento - Templates JSON

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE TEMPLATES JSON                            │
│                                                                          │
│  ✅ = Alinhado  |  ⚠️ = Precisa Alinhamento  |  🟢 = Não Urgente       │
└─────────────────────────────────────────────────────────────────────────┘

                                   📁 /templates/
                                   21 JSON Files
                                        │
                                        ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                           🔄 CAMADA DE CONVERSÃO                          │
│                                                                           │
│  ✅ QuizStepAdapter.ts (465 linhas)                                      │
│     ├─ fromJSON(): JSON → QuizStep                                       │
│     ├─ toJSON(): QuizStep → JSON                                        │
│     └─ Validação de estrutura                                            │
│                                                                           │
│  ✅ useTemplateLoader.ts                                                 │
│     ├─ loadTemplate(stepNumber)                                          │
│     ├─ Cache em memória                                                  │
│     └─ Fallback para defaults                                            │
│                                                                           │
│  ✅ useFeatureFlags.ts (143 linhas)                                      │
│     ├─ shouldUseJsonTemplates                                            │
│     ├─ Rollout percentage                                                │
│     └─ A/B testing                                                        │
└───────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ↓                   ↓                   ↓
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│   🎨 EDITOR VISUAL   │  │  🚀 RENDERIZAÇÃO     │  │  🔧 PROPRIEDADES     │
│                      │  │                      │  │                      │
│ ✅ /editor/          │  │ ⚠️ QuizApp.tsx      │  │ ✅ PropertiesPanel   │
│    json-templates    │  │    ├─ Loading       │  │    (Quiz Editor)     │
│    (682 linhas)      │  │    ├─ Error         │  │                      │
│                      │  │    └─ Rendering     │  │ ⚠️ Dynamic           │
│ Features:            │  │                      │  │    PropertiesPanel   │
│ ├─ Lista templates   │  │ ⚠️ useQuizState.ts  │  │    Improved          │
│ ├─ Edit metadata     │  │    ├─ Load JSON     │  │                      │
│ ├─ Edit layout       │  │    └─ Feature flag  │  │ ✅ Quiz              │
│ ├─ Edit JSON         │  │                      │  │    EditorProperties  │
│ ├─ Validação         │  │ ⚠️ BlockRenderer    │  │    Panel             │
│ ├─ Import/Export     │  │    ├─ Styling       │  │                      │
│ ├─ Duplicate         │  │    └─ Animations    │  │ 🟢 Enhanced          │
│ ├─ Delete            │  │                      │  │    Universal         │
│ └─ Preview           │  │ ⚠️ Template Service │  │    PropertiesPanel   │
│                      │  │    (criar novo)      │  │                      │
│ Route:               │  │    ├─ getTemplate   │  │                      │
│ /editor/             │  │    ├─ saveTemplate  │  │                      │
│ json-templates       │  │    └─ validate      │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
                                        │
                                        ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                        📝 EDITORES PRODUÇÃO                               │
│                                                                           │
│  🟡 QuizModularProductionEditor.tsx (2000+ linhas)                       │
│     ├─ Integrar QuizStepAdapter.toJSON()                                 │
│     ├─ Salvar como JSON                                                  │
│     └─ Carregar de JSON                                                  │
│                                                                           │
│  🟡 EditorProUnified.tsx                                                 │
│     ├─ Suportar JSON blocks                                              │
│     └─ Validar com adapter                                               │
│                                                                           │
│  🟡 QuizFunnelEditorWYSIWYG_Refactored.tsx                              │
│     ├─ Usar useTemplateLoader                                            │
│     └─ Salvar com toJSON()                                               │
│                                                                           │
│  🟢 EditorTemplatesPage (/editor/templates) - LEGADO                     │
│     └─ Migrar para /editor/json-templates                                │
└───────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                         📐 TIPOS E VALIDAÇÃO                              │
│                                                                           │
│  ⚠️ src/types/editor.ts                                                  │
│     ├─ BlockType (linha 72)                                              │
│     ├─ Adicionar isJsonBlockType()                                       │
│     └─ Garantir compatibilidade JSON                                     │
│                                                                           │
│  🟡 src/lib/schema-validation.ts                                         │
│     └─ Adicionar validateJsonTemplate()                                  │
│                                                                           │
│  🟡 src/types/unified-schema.ts                                          │
│     └─ Adicionar JsonTemplate type                                       │
└───────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                         🔌 HOOKS E ESTADO                                 │
│                                                                           │
│  🟡 useGlobalState.ts                                                    │
│     ├─ Adicionar templates state                                         │
│     ├─ loadTemplate action                                               │
│     ├─ saveTemplate action                                               │
│     └─ toggleJsonTemplates                                               │
│                                                                           │
│  ⚠️ useQuizState.ts [PRIORIDADE ALTA]                                   │
│     ├─ Usar useTemplateLoader                                            │
│     ├─ Usar useFeatureFlags                                              │
│     └─ Carregar JSON ou TS baseado em flag                               │
└───────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                       🌐 SERVIÇOS E BACKEND                               │
│                                                                           │
│  ⚠️ Template Service (CRIAR NOVO)                                        │
│     ├─ getTemplate(stepNumber)                                           │
│     ├─ saveTemplate(template)                                            │
│     ├─ validateTemplate(template)                                        │
│     └─ listTemplates()                                                   │
│                                                                           │
│  🟢 ConfigurationAPI.ts                                                  │
│     └─ Adicionar config para JSON templates                              │
│                                                                           │
│  🟢 schemaDrivenFunnelService.ts                                         │
│     └─ Usar JSON como source                                             │
└───────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                        🎯 PLANO DE AÇÃO PRIORIZADO
═══════════════════════════════════════════════════════════════════════════

🔴 PRIORIDADE ALTA (Fazer AGORA - Semana 1)
═══════════════════════════════════════════════════════════════════════════

1. ⚠️ useQuizState.ts
   ├─ Integrar useTemplateLoader
   ├─ Integrar useFeatureFlags
   └─ Carregar JSON vs TS baseado em flag
   ⏱️ Estimativa: 2-3 horas
   📄 Guia: FASE_2_GUIA_RAPIDO.md

2. ⚠️ QuizApp.tsx
   ├─ Adicionar loading states
   ├─ Adicionar error boundaries
   └─ Adicionar fallback UI
   ⏱️ Estimativa: 1-2 horas

3. ⚠️ BlockRenderer
   ├─ Verificar renderização de JSON blocks
   ├─ Aplicar styling do JSON
   └─ Executar animations do JSON
   ⏱️ Estimativa: 1 hora

4. ⚠️ src/types/editor.ts
   ├─ Revisar BlockType
   └─ Adicionar isJsonBlockType()
   ⏱️ Estimativa: 30 min

5. ⚠️ Template Service (CRIAR)
   ├─ Criar src/services/templateService.ts
   ├─ Implementar CRUD methods
   └─ Adicionar validação
   ⏱️ Estimativa: 1-2 horas

───────────────────────────────────────────────────────────────────────────

🟡 PRIORIDADE MÉDIA (Semana 2)
═══════════════════════════════════════════════════════════════════════════

6. 🟡 QuizModularProductionEditor.tsx
   ├─ Adicionar save as JSON
   └─ Adicionar load from JSON
   ⏱️ Estimativa: 3-4 horas

7. 🟡 DynamicPropertiesPanelImproved
   ├─ Editar metadata do JSON
   ├─ Editar layout config
   └─ Editar validation rules
   ⏱️ Estimativa: 2-3 horas

8. 🟡 useGlobalState.ts
   ├─ Adicionar templates state
   └─ Adicionar actions
   ⏱️ Estimativa: 1-2 horas

9. 🟡 Schema Validation
   └─ Adicionar validateJsonTemplate()
   ⏱️ Estimativa: 1 hora

10. 🟡 Unified Schema
    └─ Adicionar JsonTemplate type
    ⏱️ Estimativa: 30 min

───────────────────────────────────────────────────────────────────────────

🟢 PRIORIDADE BAIXA (Semana 3+)
═══════════════════════════════════════════════════════════════════════════

11. EditorProUnified - Suporte JSON
12. QuizFunnelEditorWYSIWYG - Migração
13. EnhancedUniversalPropertiesPanel - Suporte JSON
14. Configuration API - Templates config
15. Schema Driven Funnel Service - JSON source
16. Depreciar /editor/templates (antigo)


═══════════════════════════════════════════════════════════════════════════
                         📊 MATRIZ DE STATUS
═══════════════════════════════════════════════════════════════════════════

┌────────────────────────────┬────────┬──────────────────────────────────┐
│ Componente                 │ Status │ Ação                             │
├────────────────────────────┼────────┼──────────────────────────────────┤
│ QuizStepAdapter            │   ✅   │ Nenhuma - completo               │
│ useTemplateLoader          │   ✅   │ Nenhuma - completo               │
│ useFeatureFlags            │   ✅   │ Nenhuma - completo               │
│ Editor JSON Templates      │   ✅   │ Nenhuma - completo               │
│ Templates JSON (21)        │   ✅   │ Manter atualizados               │
│ App.tsx Routes             │   ✅   │ Nenhuma - alinhado               │
├────────────────────────────┼────────┼──────────────────────────────────┤
│ useQuizState               │   ⚠️   │ Integrar hooks (ALTA)            │
│ QuizApp                    │   ⚠️   │ Loading/Error states (ALTA)      │
│ BlockRenderer              │   ⚠️   │ Verificar rendering (ALTA)       │
│ editor.ts types            │   ⚠️   │ Alinhar BlockType (ALTA)         │
│ Template Service           │   ⚠️   │ Criar serviço (ALTA)             │
├────────────────────────────┼────────┼──────────────────────────────────┤
│ QuizModularProdEditor      │   🟡   │ JSON save/load (MÉDIA)           │
│ DynamicPropertiesPanel     │   🟡   │ Edit metadata (MÉDIA)            │
│ useGlobalState             │   🟡   │ Template state (MÉDIA)           │
│ Schema Validation          │   🟡   │ JSON validation (MÉDIA)          │
│ Unified Schema             │   🟡   │ Types (MÉDIA)                    │
├────────────────────────────┼────────┼──────────────────────────────────┤
│ EditorProUnified           │   🟢   │ Futuro (BAIXA)                   │
│ EnhancedUniversalProps     │   🟢   │ Futuro (BAIXA)                   │
│ Configuration API          │   🟢   │ Futuro (BAIXA)                   │
│ Editores Legados           │   🟢   │ Futuro (BAIXA)                   │
└────────────────────────────┴────────┴──────────────────────────────────┘

Total: 6 ✅ | 5 ⚠️ | 5 🟡 | 4 🟢


═══════════════════════════════════════════════════════════════════════════
                        🚀 COMANDOS ÚTEIS
═══════════════════════════════════════════════════════════════════════════

# Verificar imports antigos
grep -r "from '@/data/quizStepsTS'" src/

# Verificar uso do adapter
grep -r "QuizStepAdapter" src/ --include="*.tsx" --include="*.ts"

# Verificar feature flags
grep -r "useFeatureFlags\|useTemplateLoader" src/

# Rodar testes
npm test

# Abrir editor JSON
npm run dev
# Navegar para: http://localhost:5173/editor/json-templates

# Validar todos os templates
npm run templates:validate


═══════════════════════════════════════════════════════════════════════════
                        📚 DOCUMENTAÇÃO
═══════════════════════════════════════════════════════════════════════════

1. ALINHAMENTO_ARQUITETURA_TEMPLATES_JSON.md  ← VOCÊ ESTÁ AQUI
2. FASE_1_COMPLETA_STATUS.md - Status Fase 1
3. FASE_2_GUIA_RAPIDO.md - Guia implementação Fase 2
4. EDITOR_JSON_TEMPLATES_GUIA.md - Guia do editor
5. PLANO_ACAO_IMPLEMENTACAO_JSON.md - Plano completo
6. EDITOR_PRONTO_PARA_TESTAR.md - Guia de testes


═══════════════════════════════════════════════════════════════════════════
                        ✅ CHECKLIST RÁPIDO
═══════════════════════════════════════════════════════════════════════════

Componente está alinhado quando:
☑️ Usa QuizStepAdapter para conversão
☑️ Carrega templates via useTemplateLoader
☑️ Respeita feature flags
☑️ Valida templates antes de salvar
☑️ Renderiza styling e animations do JSON
☑️ Tem error boundaries
☑️ Tem loading states
☑️ Está testado


═══════════════════════════════════════════════════════════════════════════
                        🎓 PRÓXIMOS PASSOS
═══════════════════════════════════════════════════════════════════════════

AGORA:
1. Ler FASE_2_GUIA_RAPIDO.md
2. Implementar useQuizState
3. Atualizar QuizApp
4. Testar no navegador

DEPOIS:
1. Implementar itens 🟡 MÉDIA
2. Adicionar mais testes
3. Preparar backend API

FUTURO:
1. Implementar itens 🟢 BAIXA
2. Migrar editores legados
3. Depreciar código antigo


═══════════════════════════════════════════════════════════════════════════

📅 Data: 11 de Outubro de 2025
📊 Status: Fase 1 ✅ Completa | Fase 2 ⚠️ Em Progresso
🎯 Meta: Sistema 100% JSON até fim do mês

```
