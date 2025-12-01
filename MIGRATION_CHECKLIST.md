# Checklist de Migração - Quiz v4 → SaaS

## 📋 Pré-Migração

- [x] Backup do `quiz21-v4.json` original
- [x] Executar script `upgrade-quiz21-to-saas.mjs`
- [x] Validar JSON gerado (`quiz21-v4-saas.json`)
- [x] Revisar estatísticas de transformação
- [x] Criar adapter de compatibilidade

## 🔧 Atualização de Código

### 1. Componentes de Opções

**Arquivos a atualizar**:
- [ ] `src/components/OptionsGrid.tsx`
- [ ] `src/components/ModernQuizEditor/blocks/OptionsGridBlock.tsx`
- [ ] Qualquer componente que renderize `block.content.options`

**Mudanças necessárias**:
```typescript
// ❌ ANTES
option.text || option.label
option.image || option.imageUrl

// ✅ DEPOIS
option.label
option.imageUrl
```

**Checklist**:
- [ ] Atualizar referências `option.text` → `option.label`
- [ ] Atualizar referências `option.image` → `option.imageUrl`
- [ ] Adicionar suporte a `option.score`
- [ ] Usar `normalizeOption()` do adapter para compatibilidade

---

### 2. Rich-Text Rendering

**Arquivos a atualizar**:
- [ ] `src/components/IntroTitle.tsx`
- [ ] `src/components/IntroDescription.tsx`
- [ ] Qualquer componente que renderize `content.text` ou `content.title`

**Mudanças necessárias**:
```typescript
// ❌ ANTES (HTML inline)
<div dangerouslySetInnerHTML={{ __html: content.text }} />

// ✅ DEPOIS (rich-text seguro)
import { RichText } from '@/components/RichText';
<RichText content={content.text} />
```

**Checklist**:
- [ ] Remover `dangerouslySetInnerHTML`
- [ ] Importar e usar `<RichText>` component
- [ ] Testar com string simples E rich-text object
- [ ] Adicionar fallback para formato antigo

---

### 3. Scoring Engine

**Arquivos a atualizar**:
- [ ] `src/lib/scoring.ts` ou equivalente
- [ ] `src/hooks/useQuizScoring.ts`
- [ ] Componente de resultado que calcula estilo predominante

**Mudanças necessárias**:
```typescript
// ❌ ANTES (inferir de ID)
const category = optionId; // "natural"

// ✅ DEPOIS (explícito)
import { calculateScoring, getPredominantStyle } from '@/lib/quiz-v4-saas-adapter';

const selectedOptions = selections.map(id => 
  normalizeOption(allOptions.find(o => o.id === id))
);

const scores = calculateScoring(selectedOptions, quiz.settings.scoring.categories);
const predominant = getPredominantStyle(selectedOptions, quiz.settings.scoring.categories);
```

**Checklist**:
- [ ] Atualizar lógica de cálculo para usar `option.score.category`
- [ ] Usar `calculateScoring()` do adapter
- [ ] Testar com diferentes combinações de opções
- [ ] Validar que resultado bate com versão antiga

---

### 4. Validações

**Arquivos a atualizar**:
- [ ] `src/hooks/useStepValidation.ts`
- [ ] `src/components/QuizStep.tsx`
- [ ] Lógica de validação de formulários

**Mudanças necessárias**:
```typescript
// ❌ ANTES (ler de step diretamente)
const minSelections = step.validation?.rules?.selectedOptions?.minItems;

// ✅ DEPOIS (considerar defaults)
import { resolveValidation } from '@/lib/quiz-v4-saas-adapter';

const rules = resolveValidation(
  step.validation,
  step.type,
  quiz.settings.validation.defaults
);

const minSelections = rules.minSelections;
```

**Checklist**:
- [ ] Implementar lógica de `inheritsDefaults`
- [ ] Ler de `settings.validation.defaults` quando aplicável
- [ ] Alinhar com `minSelections/maxSelections` dos blocks
- [ ] Testar validação em intro, question e result steps

---

### 5. Asset URLs

**Arquivos a atualizar**:
- [ ] `src/lib/assets.ts` ou config de CDN
- [ ] Componentes de imagem
- [ ] `next.config.js` ou `vite.config.ts` (image domains)

**Mudanças necessárias**:
```typescript
// ✅ Usar resolver
import { resolveAssetUrl } from '@/lib/quiz-v4-saas-adapter';

const imageUrl = resolveAssetUrl(block.content.imageUrl);

// Config (Next.js example)
images: {
  domains: ['res.cloudinary.com'],
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' }
  ]
}
```

**Checklist**:
- [ ] Configurar mapeamento `/quiz-assets/` → CDN
- [ ] Atualizar todos os componentes de imagem para usar `resolveAssetUrl()`
- [ ] Testar carregamento de imagens
- [ ] Implementar fallback para imagens faltando

---

## 🧪 Testes

### Funcionalidade Core
- [ ] Carregar template `quiz21-v4-saas.json`
- [ ] Renderizar step intro (com rich-text)
- [ ] Renderizar step de pergunta (com options padronizadas)
- [ ] Selecionar 3 opções
- [ ] Avançar entre steps
- [ ] Calcular resultado final (scoring)
- [ ] Exibir estilo predominante

### Compatibilidade
- [ ] Testar com template antigo (`quiz21-v4.json`)
- [ ] Verificar que adapter funciona nos 2 casos
- [ ] Validar que scoring bate entre versões

### Edge Cases
- [ ] Opção sem imagem
- [ ] Texto sem highlights (string simples)
- [ ] Step com validação customizada (não-default)
- [ ] Asset URL inválida/faltando

### Performance
- [ ] Carregar template não degrada performance
- [ ] Normalização de options é eficiente
- [ ] Render de rich-text não causa re-renders extras

---

## 📱 Validação Visual

- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet
- [ ] Dark mode (se aplicável)

---

## 🚀 Deploy

### Staging
- [ ] Deploy de `quiz21-v4-saas.json` para staging
- [ ] Deploy de código atualizado
- [ ] Teste end-to-end em staging
- [ ] Revisão de QA

### Production
- [ ] Feature flag para rollout gradual (opcional)
- [ ] Deploy de template
- [ ] Deploy de código
- [ ] Monitorar erros (Sentry, Datadog, etc)
- [ ] Validar analytics (eventos de tracking)

---

## 📊 Métricas de Sucesso

- [ ] 0 erros de parsing de JSON
- [ ] 0 regressões visuais
- [ ] Scoring identical entre v4 e v4-saas
- [ ] Performance igual ou melhor
- [ ] Taxa de conversão mantida ou aumentada

---

## 🔄 Rollback Plan

### Se algo der errado:
1. [ ] Reverter para `quiz21-v4.json` via feature flag
2. [ ] Rollback de código (git revert)
3. [ ] Investigar logs de erro
4. [ ] Corrigir issue
5. [ ] Re-deploy após validação

### Critérios de Rollback:
- Erro crítico que impede conclusão do quiz
- Taxa de conversão cai > 10%
- Scoring incorreto identificado
- Performance degrada > 20%

---

## 📚 Documentação

- [x] `UPGRADE_QUIZ21_SAAS.md` (guide completo)
- [x] `quiz-v4-saas-adapter.ts` (código utilitário)
- [x] Exemplos de componentes atualizados
- [ ] Atualizar README.md (se necessário)
- [ ] Atualizar CHANGELOG.md

---

## 🎯 Pós-Migração

### Imediato
- [ ] Remover `quiz21-v4.json` antigo (ou mover para `_archived/`)
- [ ] Remover código de compatibilidade antigo (após período de transição)
- [ ] Limpar console.logs de debug

### Médio Prazo
- [ ] Migrar outros templates para padrão SaaS
- [ ] Criar ferramenta de migração automatizada
- [ ] Implementar presets de blocos

### Longo Prazo
- [ ] Editor visual com drag-and-drop
- [ ] Sistema de asset keys
- [ ] Multi-pontuação por opção
- [ ] Internacionalização (i18n)

---

## ✅ Sign-Off

- [ ] **Dev Lead**: Código revisado e aprovado
- [ ] **QA**: Testes passaram
- [ ] **Product**: Funcionalidade validada
- [ ] **DevOps**: Deploy realizado com sucesso

---

**Status**: 🟡 Em Progresso  
**Última Atualização**: 2025-12-01  
**Responsável**: [Seu Nome]
