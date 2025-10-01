# 🧭 Guia de Migração: UniversalStepEditor → ModernUnifiedEditor

Este guia explica como migrar qualquer uso legado do `UniversalStepEditor` (ou variantes como `UniversalStepEditorPro`) para o editor definitivo `ModernUnifiedEditor`.

---
## 🎯 Objetivo da Migração
Unificar toda a experiência de edição em um único ponto de entrada performático e modular, eliminando código duplicado, padrões inconsistentes e carregamento excessivo.

| Item | UniversalStepEditor (legacy) | ModernUnifiedEditor (novo) |
|------|------------------------------|----------------------------|
| Arquitetura | Monolítica / acoplada | Modular (hooks + providers) |
| Suporte a Quiz Estilo | Parcial / adaptado | Nativo via bridge (`useQuizSyncBridge`) |
| CRUD Funil/Template | Inconsistente | Unificado (`UnifiedCRUDProvider`) |
| Lazy Loading | Limitado | Completo (toolbar, canvas, status) |
| Extensibilidade | Baixa | Alta (providers + hooks) |
| Telemetria | Fragmentada | Unificada (unifiedEventTracker) |

---
## 🏗️ Componentes Principais Novos
- `ModernUnifiedEditor`: Wrapper com providers e roteamento inteligente (detecção funnel vs template)
- `UnifiedEditorCanvas`: Renderização centralizada de blocos / steps
- `ModernToolbar`: Controle de modo, CRUD e ações globais
- `EditorStatusBar`: Estado e diagnósticos em tempo real
- Hooks de suporte: `useTemplateLifecycle`, `useFunnelSyncLogic`, `useQuizSyncBridge`, `useEditorCrudOperations`

---
## 🔍 Como Detectar Uso Legado (APÓS REMOÇÃO)
Busque por qualquer um dos padrões:
```
UniversalStepEditor
UniversalStepEditorPro
useUniversalStepEditor
```
Se encontrados: planejar substituição direta pela rota /editor usando o novo editor.

---
## 🚀 Passo a Passo de Migração
1. (Se ainda existir arquivo em branch divergente) Remover import antigo:
```diff
-import { UniversalStepEditor } from '@/components/editor/universal/UniversalStepEditor';
+import ModernUnifiedEditor from '@/pages/editor/ModernUnifiedEditor';
```
2. Substituir JSX:
```diff
-<UniversalStepEditor stepId={current} onStepChange={setCurrent} />
+<ModernUnifiedEditor funnelId={funnelId} />
```
3. Se havia controle manual de steps, mover lógica para:
   - Quiz: usar `quizBridge.currentStepKey` (dentro do editor) ou redirecionar para página especializada.
4. Ajustar eventos de tracking → usar `unifiedEventTracker.track({ type: 'editor_action', payload: { subType: '...' } })`.
5. Remover helpers legados de persistência substituídos por `useUnifiedCRUD()`.

---
## 🧪 Testes e Smoke Checks
Execute após migração:
```
npm run test:run:editor
npm run smoke:step1
npm run quiz:verify-blocks
```
Verifique no console ausência de warnings de alias de quiz (`warnIfDeprecatedQuizEstilo`).

---
## 🧹 Pós-Migração (Status)
✅ Stub `UniversalStepEditor` removido do branch principal.
Se um branch ainda contiver o arquivo, aplicar este guia antes de merge.
- Remover docs antigos: `UNIVERSAL_STEP_EDITOR_PRO_IMPLEMENTADO.md` se redundante
- Rodar auditorias:
```
npm run audit:adapter
npm run lint:legacy-analytics
```

---
## ❓ FAQ
**Posso ainda usar stepId manual?**
→ Preferencialmente não. O novo editor resolve contexto via URL ou bridge.

**Como habilito modo preview/headless?**
→ Ajustar estado via toolbar (prop `mode`) ou chamar `handleStateChange` futuramente exposto.

**Onde fica a navegação de steps?**
→ Integrada ao canvas via adapters ou páginas especializadas (ex: QuizEditorIntegratedPage).

---
## ✅ Checklist Rápido
- [ ] Substituiu todos os imports?
- [ ] Testes de editor passaram?
- [ ] Nenhum warning de depreciação no console?
- [ ] Quiz continua navegável?
- [ ] Blocos renderizam conforme esperado?

---
## 📝 Notas Finais
Este guia cobre migração funcional mínima. Para otimizações avançadas (prefetch adaptativo, preconnect CDN, lazy analytics), ver roadmap interno.

Em caso de dúvidas, abra uma issue: `Editor Migration`.
