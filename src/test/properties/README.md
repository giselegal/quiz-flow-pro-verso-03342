# 🧪 Testes do Painel de Propriedades - Quiz Quest

## Visão Geral

Esta suíte de testes abrange **validação completa das funcionalidades do painel de propriedades** para todos os **21 componentes das etapas do quiz**, incluindo renderização, atualização, validação, persistência e integração de contexto.

## 📁 Estrutura dos Testes

```
src/test/properties/
├── PropertiesPanel.test.tsx          # 🎯 Testes principais do painel
├── Step20Components.test.tsx          # 🔥 Testes específicos Step 20
├── PropertiesValidation.test.tsx      # ✅ Validação de schemas
├── PropertiesPanelE2E.test.tsx        # 🚀 Testes end-to-end
└── ../test-utils.tsx                  # 🛠️ Utilitários para testes
└── ../setup.ts                       # ⚙️ Configuração global
```

## 🎯 Cobertura de Testes

### Por Etapa do Quiz

| Etapa | Componentes | Status | Testes |
|-------|-------------|--------|---------|
| **1** | `quiz-intro-header`, `text-inline`, `form-input`, `button-inline` | ✅ | 15 testes |
| **2-11** | `quiz-question-inline`, `options-grid` | ✅ | 12 testes |
| **12** | `quiz-navigation` | ✅ | 8 testes |
| **13-18** | `heading-inline` + questões | ✅ | 10 testes |
| **19** | `progress-inline` | ✅ | 6 testes |
| **20** | Componentes Step 20 modulares | ✅ | 25 testes |
| **21** | `urgency-timer`, `value-anchoring`, `bonus`, etc | ✅ | 18 testes |

### Categorias de Teste

- **🎨 Renderização**: Verificação de elementos visuais
- **🔄 Atualização**: Sincronização de propriedades
- **✅ Validação**: Schemas e regras de negócio
- **💾 Persistência**: Salvamento e carregamento
- **🎛️ Interação**: Eventos e feedback
- **♿ Acessibilidade**: Navegação e screen readers
- **⚡ Performance**: Otimização e responsividade

## 🚀 Como Executar

### Comandos Principais

```bash
# Executar todos os testes de propriedades
npm run test:properties

# Executar com interface visual
npm run test:properties:ui

# Executar uma vez (CI/CD)
npm run test:properties:run

# Executar com cobertura
npm run test:properties:coverage

# Executar modo watch (desenvolvimento)
npm run test:watch
```

### Testes Específicos

```bash
# Apenas testes do Step 20
npm run test:properties -- Step20

# Apenas validação
npm run test:properties -- Validation

# Apenas E2E
npm run test:properties -- E2E

# Arquivo específico
npm run test:properties src/test/properties/PropertiesPanel.test.tsx
```

## 📋 Componentes Testados

### Etapa 1 - Introdução
- **quiz-intro-header**: Título, subtítulo, cores de fundo
- **text-inline**: Texto, formatação, alinhamento
- **form-input**: Labels, validação, tipos de campo
- **button-inline**: Texto, variantes, tamanhos

### Etapas 2-11 - Questões Pontuadas
- **quiz-question-inline**: Perguntas, seleção múltipla, limites
- **options-grid**: Opções, pontuação, layout de grid

### Etapa 12 - Transição
- **quiz-navigation**: Progresso, textos de navegação

### Etapas 13-18 - Questões Estratégicas  
- **heading-inline**: Títulos, níveis, estilos

### Etapa 19 - Transição
- **progress-inline**: Barras de progresso, animações

### Etapa 20 - Resultado (Componentes Modulares)
- **step20-result-header**: Celebração, confetti, cores
- **step20-style-reveal**: Nome do estilo, descrição, animação
- **step20-user-greeting**: Saudações personalizadas, avatar
- **step20-compatibility**: Percentual, contador animado, cores
- **step20-secondary-styles**: Estilos secundários, layout
- **step20-personalized-offer**: Ofertas, descontos, CTAs

### Etapa 21 - Oferta Final
- **urgency-timer-inline**: Contadores regressivos, formato de tempo
- **value-anchoring**: Preços originais/atuais, economia
- **bonus**: Títulos, valores, imagens
- **mentor-section-inline**: Mentores, depoimentos, credibilidade

## 🔧 Utilitários de Teste

### Mock do Context
```typescript
import { createMockEditorContext } from '@/test/test-utils';

const mockContext = createMockEditorContext();
// Context configurado com todas as actions mockadas
```

### Factory de Blocos
```typescript
import { createTestBlock } from '@/test/test-utils';

const block = createTestBlock('quiz-intro-header', {
  title: 'Título Customizado',
  backgroundColor: '#ff0000'
});
```

### Helpers de Teste
```typescript
import { TestHelpers } from '@/test/test-utils';

// Aguardar debounce
await TestHelpers.waitForDebounce();

// Simular arquivo
const file = TestHelpers.createMockFile('test.jpg');

// Configurar viewport
TestHelpers.setViewport(375, 667); // Mobile
```

## 📊 Validação de Propriedades

### Schemas Suportados
- **Texto**: Validação de comprimento, sanitização XSS
- **Cores**: Formatos hex, rgb, hsl, nomes
- **Números**: Ranges, tipos, validação
- **URLs**: Protocolos seguros, sanitização
- **Datas**: Formatos ISO, validação de futuro/passado

### Exemplos de Validação
```typescript
// ✅ Propriedades válidas
const valid = validateBlockProperties('quiz-intro-header', {
  title: 'Quiz de Estilo',
  backgroundColor: '#ffffff',
  textColor: '#000000'
});

// ❌ Propriedades inválidas  
const invalid = validateBlockProperties('quiz-intro-header', {
  title: '', // vazio
  backgroundColor: 'cor-inválida',
  textColor: null
});
```

## 🎭 Testes de Acessibilidade

### Verificações Incluídas
- **Labels**: Todos os inputs têm labels apropriados
- **Navegação**: Tab order e focus management
- **Screen Readers**: ARIA labels e roles
- **Contraste**: Verificação de cores e legibilidade
- **Keyboard**: Suporte completo a navegação por teclado

### Exemplo de Teste A11y
```typescript
it('deve ter labels apropriados para todos os inputs', () => {
  render(<PropertiesColumn selectedBlock={block} />);
  
  const inputs = screen.getAllByRole('textbox');
  inputs.forEach(input => {
    expect(input).toHaveAccessibleName();
  });
});
```

## ⚡ Testes de Performance

### Otimizações Testadas
- **Debounce**: Inputs de texto com debounce de 300ms
- **Re-renders**: Otimização com React.memo
- **Memória**: Limpeza de timers e event listeners
- **Batch Updates**: Agrupamento de updates do contexto

### Exemplo de Teste Performance
```typescript
it('deve fazer debounce adequado em campos de texto', async () => {
  const updateSpy = vi.fn();
  render(<PropertiesColumn selectedBlock={block} />);
  
  await user.type(textInput, 'texto rápido');
  expect(updateSpy).not.toHaveBeenCalled(); // Ainda não
  
  await TestHelpers.waitForDebounce();
  expect(updateSpy).toHaveBeenCalledTimes(1); // Agora sim
});
```

## 🐛 Tratamento de Erros

### Cenários Testados
- **Falhas de Rede**: Retry automático e feedback visual
- **Dados Corruptos**: Sanitização e valores padrão
- **Context Indisponível**: Fallbacks graceful
- **Propriedades Inválidas**: Validação e correção

### Recuperação de Estado
```typescript
it('deve manter estado local quando há falhas', async () => {
  const failingUpdate = vi.fn().mockRejectedValue(new Error('Falha'));
  
  await user.type(textInput, ' modificado');
  
  // Valor local mantido mesmo com falha
  expect(textInput).toHaveValue('Original modificado');
});
```

## 📈 Métricas e Cobertura

### Metas de Cobertura
- **Linhas**: > 90%
- **Funções**: > 85%
- **Branches**: > 80%
- **Statements**: > 90%

### Relatórios
```bash
# Gerar relatório de cobertura
npm run test:properties:coverage

# Ver relatório HTML
open coverage/index.html
```

## 🔄 Integração com CI/CD

### GitHub Actions
```yaml
- name: Testes de Propriedades
  run: npm run test:properties:run

- name: Cobertura de Código
  run: npm run test:properties:coverage
```

### Verificações Pré-commit
- Execução de testes modificados
- Verificação de cobertura mínima
- Lint e formatação dos arquivos de teste

## 📚 Documentação Adicional

### Arquivos de Referência
- `src/types/editor.ts` - Tipos e interfaces
- `src/components/editor/EditorProvider.tsx` - Context principal
- `vitest.config.properties.ts` - Configuração específica

### Links Úteis
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Accessibility](https://testing-library.com/docs/guide-which-query/)

---

## 🎯 Resultado Esperado

Com esta suíte de testes completa, você terá:

✅ **Cobertura total** dos 21 componentes das etapas  
✅ **Validação robusta** das propriedades e schemas  
✅ **Testes E2E** do fluxo completo do usuário  
✅ **Verificação de acessibilidade** em todos os componentes  
✅ **Otimização de performance** validada por testes  
✅ **Tratamento de erros** abrangente e resiliente  

**Total: ~150+ testes** cobrindo todas as funcionalidades críticas do painel de propriedades! 🚀