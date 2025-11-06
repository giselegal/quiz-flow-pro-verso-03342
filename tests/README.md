# 🧪 Testes Automatizados do Quiz Builder

Este diretório contém testes automatizados para validar a renderização e funcionamento do sistema de blocos e do quiz de 21 etapas.

## 📁 Estrutura

```
tests/
├── blocks/
│   ├── BlockComplexityMap.test.ts    # Valida mapeamento SIMPLE/COMPLEX
│   └── BlockRendering.test.tsx       # Valida renderização de blocos
├── quiz21/
│   └── Quiz21StepsComplete.test.tsx  # Valida os 21 steps do quiz
└── README.md                         # Este arquivo
```

## 🚀 Como Executar

### Todos os testes
```bash
npm test
```

### Testes específicos
```bash
# Apenas testes de blocos
npm test tests/blocks

# Apenas testes do quiz21
npm test tests/quiz21

# Teste específico
npm test tests/blocks/BlockRendering.test.tsx
```

### Modo watch (desenvolvimento)
```bash
npm run test:watch
```

### Com cobertura
```bash
npm run test:coverage
```

### UI interativa
```bash
npm run test:ui
```

## 📊 O Que É Testado

### 1. Block Complexity Map (`tests/blocks/BlockComplexityMap.test.ts`)

Valida o mapeamento de complexidade dos blocos:
- ✅ Todos os blocos SIMPLE têm templates HTML
- ✅ Todos os blocos COMPLEX têm componentes React
- ✅ Templates HTML existem no diretório correto
- ✅ Blocos críticos estão mapeados corretamente
- ✅ Não há inconsistências no mapeamento

### 2. Block Rendering (`tests/blocks/BlockRendering.test.tsx`)

Valida a renderização dos blocos:
- ✅ Blocos SIMPLE renderizam com templates HTML
- ✅ Blocos COMPLEX renderizam com React components
- ✅ Nenhum bloco exibe "Sem conteúdo"
- ✅ Blocos com dados vazios têm fallbacks
- ✅ Blocos desconhecidos têm graceful degradation

### 3. Quiz 21 Steps Complete (`tests/quiz21/Quiz21StepsComplete.test.tsx`)

Valida o template completo do quiz:
- ✅ Estrutura com exatamente 21 steps
- ✅ Todos os steps têm blocos válidos
- ✅ Nenhum bloco com conteúdo vazio (exceto spacers/dividers)
- ✅ Todos os tipos de blocos usados estão mapeados
- ✅ IDs únicos por step
- ✅ Blocos ordenados corretamente
- ✅ Blocos de texto têm propriedade `text`
- ✅ Blocos de imagem têm propriedade `src`

## 🎯 Garantias

Estes testes garantem que:

1. **Nenhum Bloco Quebrado**: Todos os blocos renderizam corretamente
2. **Sem "Sem Conteúdo"**: Nenhum bloco exibe mensagem de erro
3. **Templates Existem**: Todos os templates HTML necessários existem
4. **Componentes Existem**: Todos os componentes React estão disponíveis
5. **Dados Válidos**: Todos os blocos têm dados mínimos necessários
6. **21 Steps Completos**: O quiz inteiro está funcional

## 🔧 Configuração

Os testes usam:
- **Vitest**: Framework de testes
- **@testing-library/react**: Testes de componentes React
- **happy-dom**: Ambiente de testes otimizado

Configuração em: `vitest.config.ts`

## 📝 Adicionando Novos Testes

### Para novos blocos:

1. Adicione o tipo em `getMinimalPropsForBlock()` em `BlockRendering.test.tsx`
2. Adicione validação específica se necessário
3. Execute `npm test` para validar

### Para novos steps:

1. Os testes do quiz21 são automáticos
2. Basta adicionar o step em `quiz21StepsComplete.ts`
3. Execute `npm test tests/quiz21` para validar

## 🐛 Debug

Se um teste falhar:

1. Execute em modo verbose: `npm test -- --reporter=verbose`
2. Use UI interativa: `npm run test:ui`
3. Verifique logs específicos no terminal
4. Compare com auditoria em `docs/AUDITORIA_BLOCOS_QUIZ21.md`

## 📈 Cobertura

Para ver cobertura de testes:

```bash
npm run test:coverage
```

Relatório HTML disponível em: `coverage/index.html`

## 🎓 Boas Práticas

- ✅ Execute testes antes de commit
- ✅ Mantenha cobertura acima de 80%
- ✅ Adicione testes para novos blocos
- ✅ Use nomes descritivos para testes
- ✅ Documente testes complexos

## 🔗 Links Úteis

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Block Complexity Map](../src/config/block-complexity-map.ts)
- [Quiz 21 Template](../src/templates/quiz21StepsComplete.ts)
