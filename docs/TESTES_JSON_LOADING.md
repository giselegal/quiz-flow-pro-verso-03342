# 🧪 SUITE DE TESTES: Mecanismo de Carregamento JSON do Funil

## 📋 Resumo

Esta suite de testes valida o mecanismo completo de carregamento dos 21 steps do funil a partir do arquivo `quiz21-complete.json`.

## 🎯 O que está sendo testado

### 1. **Testes Unitários** (`tests/unit/template-service-json-loading.test.ts`)

Testam o `TemplateService` isoladamente:

- ✅ `setActiveFunnel()` - Define o funil ativo
- ✅ `getAllSteps()` - Carrega todos os 21 steps
- ✅ `getStep()` - Carrega step individual com blocks
- ✅ Normalização de IDs legados (`quiz-estilo-21-steps` → `quiz21StepsComplete`)
- ✅ Mapeamento de steps (STEP_MAPPING)
- ✅ Validação de steps (`hasStep()`)
- ✅ Ordem de steps (`getStepOrder()`)
- ✅ Tratamento de erros e fallbacks
- ✅ Performance e cache

**Total: ~30 testes unitários**

### 2. **Testes de Integração - Aliases** (`tests/integration/unified-registry-aliases.test.ts`)

Validam os aliases criados no `UNIFIED_TEMPLATE_REGISTRY`:

- ✅ Template principal `quiz21StepsComplete` existe
- ✅ Alias `quiz-estilo-completo` existe e aponta corretamente
- ✅ Alias `quiz-estilo-21-steps` existe e aponta corretamente
- ✅ Todos têm 21 steps (`stepCount: 21`)
- ✅ Metadados consistentes entre original e aliases
- ✅ Tags `legacy-alias` nos aliases
- ✅ API `TemplateRegistry` funciona com aliases
- ✅ Validação de estrutura obrigatória

**Total: ~20 testes de integração**

### 3. **Testes de Integração - Fluxo Completo** (`tests/integration/json-loading-flow.test.ts`)

Testam o fluxo end-to-end:

- ✅ `useQuizState` + `TemplateService` + JSON
- ✅ Carregamento com diferentes `funnelId`
- ✅ Normalização automática de IDs
- ✅ Blocos carregados do JSON
- ✅ Cálculo de progresso baseado em 21 steps
- ✅ Tratamento de erros (JSON indisponível, templateId inválido)

**Total: ~15 testes de integração**

### 4. **Testes E2E** (`tests/e2e/funnel-json-loading.spec.ts`)

Testam no navegador real com Playwright:

- ✅ Requisição HTTP para `quiz21-complete.json` retorna 200
- ✅ JSON contém 21 steps com blocks
- ✅ Step 1 renderiza sem "⚠️ Conteúdo Temporário"
- ✅ Navegação do step 1 → step 2 funciona
- ✅ Indicador de progresso mostra "Etapa X de 21"
- ✅ Todos os 21 steps carregam sem fallback
- ✅ Console não mostra `totalSteps: 1`
- ✅ `templateId` correto é usado nos logs
- ✅ Aliases funcionam (`/quiz/quiz-estilo-completo`)
- ✅ Performance: carregamento < 2 segundos
- ✅ Cache: JSON carregado apenas 1 vez
- ✅ Error handling: fallback gracioso se JSON falhar

**Total: ~15 testes E2E**

## 🚀 Como Executar

### Todos os testes de uma vez:

```bash
./scripts/test-json-loading.sh
```

### Testes individuais:

```bash
# Unitários
npm run test:unit tests/unit/template-service-json-loading.test.ts

# Integração - Aliases
npm run test:unit tests/integration/unified-registry-aliases.test.ts

# Integração - Fluxo
npm run test:unit tests/integration/json-loading-flow.test.ts

# E2E
npx playwright test tests/e2e/funnel-json-loading.spec.ts
```

### Com watch mode (desenvolvimento):

```bash
npm run test:watch tests/unit/template-service-json-loading.test.ts
```

### Com cobertura:

```bash
npm run test:coverage -- tests/unit/template-service-json-loading.test.ts
```

## 📊 Cobertura Esperada

| Componente | Cobertura Alvo | Status |
|------------|---------------|--------|
| `TemplateService.getAllSteps()` | 100% | ✅ |
| `TemplateService.getStep()` | 100% | ✅ |
| `UNIFIED_TEMPLATE_REGISTRY` aliases | 100% | ✅ |
| Normalização de IDs | 100% | ✅ |
| `useQuizState` com funnelId | 80% | ✅ |
| Renderização de steps | 90% | ✅ |

**Cobertura total esperada: ~95%**

## 🎯 Casos de Teste Críticos

### ✅ Cenário 1: Carregamento Padrão
```
Dado que o usuário acessa /quiz-estilo
Quando a página carrega
Então deve:
  - Carregar quiz21-complete.json
  - Exibir step 1 de 21
  - Não mostrar "Conteúdo Temporário"
```

### ✅ Cenário 2: Navegação Completa
```
Dado que o quiz está no step 1
Quando o usuário preenche nome e avança
Então deve:
  - Navegar para step 2
  - Mostrar progresso correto (~5%)
  - Carregar blocks do JSON
```

### ✅ Cenário 3: Aliases Funcionam
```
Dado que o usuário acessa /quiz/quiz-estilo-completo
Quando a página carrega
Então deve:
  - Normalizar para quiz21StepsComplete
  - Carregar 21 steps corretamente
  - Funcionar identicamente ao ID original
```

### ✅ Cenário 4: Error Handling
```
Dado que quiz21-complete.json está indisponível
Quando a página carrega
Então deve:
  - Usar fallback gracioso
  - Não quebrar a aplicação
  - Exibir mensagem amigável
```

## 🐛 Debugging

### Ver logs detalhados do TemplateService:

```javascript
// No console do navegador
localStorage.setItem('DEBUG_TEMPLATE_SERVICE', 'true');
```

### Ver requisições do JSON:

```javascript
// Abrir DevTools → Network → Filter: quiz21-complete.json
```

### Verificar normalização de IDs:

```javascript
// No console
import { templateService } from '@/services/canonical/TemplateService';
templateService.setActiveFunnel('quiz-estilo-21-steps');
const steps = await templateService.getAllSteps();
console.log(Object.keys(steps)); // Deve ter 21 steps
```

## 📈 Métricas de Sucesso

- ✅ Todos os testes passam
- ✅ Cobertura > 95%
- ✅ Zero fallbacks em produção
- ✅ `totalSteps: 21` em todos os cenários
- ✅ Tempo de carregamento < 2s
- ✅ Zero erros no console

## 🔄 CI/CD Integration

Adicione ao `.github/workflows/test.yml`:

```yaml
- name: Test JSON Loading Mechanism
  run: ./scripts/test-json-loading.sh

- name: E2E Tests
  run: npx playwright test tests/e2e/funnel-json-loading.spec.ts
```

## 📝 Notas

1. **Mock do fetch**: Testes unitários/integração usam mock do `fetch` para simular carregamento do JSON
2. **Playwright**: Testes E2E usam navegador real, então requerem servidor rodando
3. **Aliases**: Todos os IDs legados (`quiz-estilo-21-steps`, `quiz-estilo-completo`) devem ser testados
4. **Performance**: Testes validam que carregamento é < 2s e cache funciona

## 🎉 Resultado Esperado

```bash
✅ Testes Unitários: 30/30 passed
✅ Testes Integração (Aliases): 20/20 passed
✅ Testes Integração (Fluxo): 15/15 passed
✅ Testes E2E: 15/15 passed

Total: 80/80 tests passed (100%)
```
