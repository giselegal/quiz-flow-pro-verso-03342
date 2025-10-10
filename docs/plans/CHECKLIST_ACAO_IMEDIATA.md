# ⚡ CHECKLIST DE AÇÃO IMEDIATA - CORREÇÃO ESTRUTURA QUIZ

**Data:** 17 de Setembro de 2025  
**Sprint:** Correção Arquitetural Crítica  

## 🔴 AÇÕES CRÍTICAS - FAZER HOJE

### 1. 🏗️ Auditoria de Sistemas de Cálculo
- [ ] **Mapear todos os pontos de entrada**
  ```bash
  grep -r "calculateResult\|quizResult" src/ --include="*.ts" --include="*.tsx"
  ```
- [ ] **Identificar conflitos de implementação**
  - [ ] `src/core/quiz/quizEngine.ts` (Legado)
  - [ ] `src/hooks/useQuizLogic.ts` (React Hook)
  - [ ] `src/components/quiz/ResultOrchestrator.tsx` (Unificado)
- [ ] **Marcar sistema principal como fonte única**

### 2. 🔧 Correções TypeScript Urgentes
- [ ] **EditorContextValue Interface**
  ```typescript
  interface EditorContextValue {
    // ❌ FALTANDO:
    adicionarBloco: (tipo: string) => void;
    ativoStepId: string | null;
  }
  ```
- [ ] **DynamicPropertiesPanel Props**
  ```typescript
  interface DynamicPropertiesPanelProps {
    // ❌ FALTANDO:
    children?: React.ReactNode;
    onUpdate?: (patch: any) => void;
  }
  ```

### 3. 🧪 Validação de Testes
- [ ] **Rodar testes críticos**
  ```bash
  npm run test -- PropertiesPanel.test.tsx
  ```
- [ ] **Corrigir mocks faltantes**
- [ ] **Adicionar propriedades em testes**

## 🟡 AÇÕES PLANEJADAS - ESTA SEMANA

### 4. 🔄 Unificação Gradual
- [ ] **Depreciar quizEngine.ts**
  ```typescript
  // @deprecated - Use ResultOrchestrator instead
  export const calculateQuizResult = () => {
    console.warn('quizEngine deprecated. Use ResultOrchestrator');
    // ...
  }
  ```

- [ ] **Centralizar em ResultOrchestrator**
  ```typescript
  // Único ponto de entrada
  export const calculateUnifiedResult = async (
    selections: Record<string, string[]>,
    userInfo: UserInfo
  ): Promise<QuizResult> => {
    // Lógica unificada aqui
  }
  ```

### 5. 🧹 Limpeza de Componentes Duplicados
- [ ] **ConnectedQuizResultsBlock consolidação**
  - [ ] Manter versão principal em `/src/components/blocks/`
  - [ ] Remover duplicata em `/src/components/results/`
- [ ] **Step20Template unificação**
  - [ ] Eliminar `Step20FallbackTemplate.tsx`
  - [ ] Consolidar lógica no `Step20Template.tsx` principal

## 🟢 VALIDAÇÃO CONTÍNUA

### 6. 📋 Checklist de Funcionalidade
- [ ] **Fluxo completo 1→21**
  - [ ] Etapa 1: Nome capturado ✓
  - [ ] Etapas 2-11: Pontuação correta ✓  
  - [ ] Etapa 12: Transição automática ✓
  - [ ] Etapas 13-18: Rastreamento sem pontuação ✓
  - [ ] Etapa 19: Processamento ✓
  - [ ] Etapa 20: Resultado calculado ✓
  - [ ] Etapa 21: Oferta apresentada ✓

### 7. 🎯 Métricas de Sucesso
```typescript
// Validações automáticas
const validarEstrutura = () => {
  // ✅ Apenas um sistema de cálculo ativo
  // ✅ Zero erros TypeScript
  // ✅ Todos os testes passando
  // ✅ Performance < 2s para cálculo
  // ✅ Cache funcionando corretamente
}
```

## 📁 ARQUIVOS PRIORITÁRIOS PARA REVIEW

### 🔴 Críticos (Revisar Hoje)
```
src/core/editor/DynamicPropertiesPanel.tsx
src/components/editor/ComponentsSidebar.tsx  
src/components/blocks/inline/LeadFormBlock.tsx
tests/PropertiesPanel.test.tsx
```

### 🟡 Importantes (Esta Semana)
```
src/core/quiz/quizEngine.ts (deprecar)
src/hooks/useQuizLogic.ts (migrar)
src/components/quiz/ResultOrchestrator.tsx (centralizar)
src/components/results/ConnectedQuizResultsBlock.tsx (consolidar)
```

## ⚡ COMANDOS RÁPIDOS

```bash
# Verificar erros TypeScript
npm run type-check

# Rodar testes específicos
npm run test -- --grep "Properties|Quiz|Result"

# Build de produção
npm run build

# Verificar dependências não utilizadas
npm run analyze:unused

# Linter + formatter
npm run lint:fix && npm run format
```

---

## 🎯 OBJETIVO FINAL

**Meta:** Sistema de quiz unificado, limpo e funcionando perfeitamente com as 21 etapas documentadas.

**Success Criteria:**
- ✅ Zero erros de build/TypeScript
- ✅ Único sistema de cálculo ativo (ResultOrchestrator)
- ✅ Testes 100% passando
- ✅ Performance otimizada
- ✅ Código limpo e maintível

**Next Review:** 18 de Setembro de 2025