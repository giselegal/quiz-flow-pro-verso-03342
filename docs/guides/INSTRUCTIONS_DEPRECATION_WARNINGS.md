# 🚨 INSTRUÇÕES: Aplicar Deprecation Warnings

## ✅ Componente Criado

O componente `DeprecatedRouteWarning` foi criado em:
```
/workspaces/quiz-flow-pro-verso/src/components/routing/DeprecatedRouteWarning.tsx
```

## 📝 PRÓXIMO PASSO: Atualizar App.tsx

### 1. Adicione o import no topo:

```typescript
import { DeprecatedRouteWarning } from '@/components/routing/DeprecatedRouteWarning';
```

### 2. Envolva as rotas obsoletas:


  {/* 🚨 DEPRECATED: /editor-new */}
  <Route
    path="/editor-new"
    element={
      <DeprecatedRouteWarning
        routePath="/editor-new"
        recommendedRoute="/editor"
        reason="Substituído por QuizModularProductionEditor"
      >
        <QuizFunnelEditorWYSIWYG_Refactored />
      </DeprecatedRouteWarning>
    }
  />

  {/* 🚨 DEPRECATED: /quiz-old */}
  <Route
    path="/quiz-old"
    element={
      <DeprecatedRouteWarning
        routePath="/quiz-old"
        recommendedRoute="/quiz-estilo"
        reason="Versão antiga do quiz"
      >
        <QuizRendererOld />
      </DeprecatedRouteWarning>
    }
  />

  {/* 🚨 DEPRECATED: /builder-legacy */}
  <Route
    path="/builder-legacy"
    element={
      <DeprecatedRouteWarning
        routePath="/builder-legacy"
        recommendedRoute="/editor"
        reason="Builder descontinuado"
      >
        <LegacyBuilder />
      </DeprecatedRouteWarning>
    }
  />

## 🎯 Resultado Esperado

Quando usuário acessar rotas obsoletas:
- ✅ Banner amarelo de aviso aparece
- ✅ Toast de notificação
- ✅ Console warning com detalhes
- ✅ Botão para ir para nova rota
- ✅ Redirect automático em 10s
- ✅ Link clicável para rota recomendada

## 📊 Rotas Mapeadas

1. **/editor-new** → /editor
   - Motivo: Substituído por QuizModularProductionEditor
   - Remoção: v4.0 (Janeiro 2026)

2. **/quiz-old** → /quiz-estilo
   - Motivo: Versão antiga do quiz
   - Remoção: v4.0 (Janeiro 2026)

3. **/builder-legacy** → /editor
   - Motivo: Builder descontinuado
   - Remoção: v4.0 (Janeiro 2026)

## 🧪 Testar

```bash
npm run dev
# Acesse http://localhost:8080/editor-new
# Deve ver warning e redirect para /editor
```

## 📄 Documentação

Veja DEPRECATED.md para lista completa de rotas obsoletas.
