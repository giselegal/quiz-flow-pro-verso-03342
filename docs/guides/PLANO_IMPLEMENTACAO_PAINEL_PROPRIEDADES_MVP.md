# 🎯 PLANO DE IMPLEMENTAÇÃO - Painel de Propriedades MVP

## 📊 Estado Atual do Painel de Propriedades

### ✅ O Que Já Está Funcionando

1. **EnhancedUniversalPropertiesPanel** - Componente principal implementado
2. **useUnifiedProperties** - Hook com lógica de propriedades
3. **Integração com editor-fixed** - Conectado no layout de 4 colunas
4. **Tipos de campos suportados**:
   - TEXT (Input simples)
   - TEXTAREA (Área de texto)
   - NUMBER/RANGE (Números e sliders)
   - SELECT (Dropdown)
   - SWITCH (Toggle)
   - COLOR (Seletor de cor)

### ❌ O Que Precisa Ser Implementado/Corrigido

#### 1. **Propriedades Específicas para Componentes do Quiz**

```typescript
// MISSING: Propriedades específicas para componentes de quiz
- quiz-question-inline: opções de pergunta, tipo de resposta
- quiz-results-block: configuração de resultado, categorias
- button-inline: ações, navegação entre etapas
- step-header-inline: configuração de cabeçalho por etapa
```

#### 2. **Sincronização com Dados das Etapas**

```typescript
// PROBLEMA: Painel não está sincronizado com dados das 21 etapas
- Propriedades não persistem entre navegação de etapas
- Não há salvamento automático no localStorage/Supabase
- Mudanças se perdem ao trocar de etapa
```

#### 3. **Propriedades Específicas por Etapa**

```typescript
// MISSING: Cada etapa deveria ter configurações específicas
Etapa 1 (Intro): título, descrição, imagem de fundo
Etapa 2 (Nome): placeholder do input, validação
Etapas 3-19 (Perguntas): texto da pergunta, opções, pontuação
Etapa 20 (Resultado): template de resultado, cores
Etapa 21 (Oferta): CTA, preço, benefícios
```

## 🚀 PLANO DE IMPLEMENTAÇÃO - MVP

### FASE 1: Corrigir Funcionalidades Básicas (2-3 horas)

#### 1.1 Implementar Persistência de Propriedades

```typescript
// Arquivo: src/hooks/useStageProperties.ts
export const useStageProperties = (stageId: string) => {
  // Salvar propriedades específicas por etapa
  // Integrar com localStorage
  // Sincronizar com EditorContext
};
```

#### 1.2 Conectar com StepsContext

```typescript
// Atualizar: src/context/StepsContext.tsx
// Adicionar campo 'properties' para cada etapa
interface QuizStep {
  id: string;
  name: string;
  order: number;
  type: string;
  properties: Record<string, any>; // ← ADICIONAR
}
```

#### 1.3 Corrigir Sincronização com EditorContext

```typescript
// Atualizar: src/pages/editor-fixed-dragdrop.tsx
// Garantir que mudanças no painel atualizem a etapa ativa
```

### FASE 2: Implementar Propriedades Específicas do Quiz (3-4 horas)

#### 2.1 Configurações por Tipo de Etapa

```typescript
// Criar: src/config/stagePropertyDefinitions.ts

export const STAGE_PROPERTY_DEFINITIONS = {
  intro: [
    { key: 'title', type: 'text', label: 'Título da Introdução' },
    { key: 'description', type: 'textarea', label: 'Descrição' },
    { key: 'backgroundImage', type: 'image', label: 'Imagem de Fundo' },
  ],
  question: [
    { key: 'questionText', type: 'textarea', label: 'Texto da Pergunta' },
    { key: 'questionType', type: 'select', label: 'Tipo de Pergunta' },
    { key: 'options', type: 'array', label: 'Opções de Resposta' },
  ],
  result: [
    { key: 'resultTemplate', type: 'select', label: 'Template do Resultado' },
    { key: 'showScores', type: 'switch', label: 'Exibir Pontuações' },
  ],
};
```

#### 2.2 Painel de Propriedades da Etapa

```typescript
// Criar: src/components/editor/properties/StagePropertiesPanel.tsx

interface StagePropertiesPanelProps {
  stageId: string;
  stageType: string;
  properties: Record<string, any>;
  onUpdate: (properties: Record<string, any>) => void;
}
```

### FASE 3: Melhorar UX do Editor (1-2 horas)

#### 3.1 Abas no Painel de Propriedades

```typescript
// Duas abas:
// 1. "Componente" - propriedades do bloco selecionado
// 2. "Etapa" - propriedades da etapa ativa
```

#### 3.2 Preview em Tempo Real

```typescript
// Atualizar preview conforme propriedades mudam
// Debounce para evitar muitas atualizações
```

#### 3.3 Salvamento Automático

```typescript
// Auto-save a cada 2 segundos
// Indicador visual de "salvando..."
```

## 📝 IMPLEMENTAÇÃO IMEDIATA - Próximos Passos

### Passo 1: Testar Estado Atual (15 min)

1. Abrir http://localhost:3000/editor-fixed
2. Selecionar uma etapa
3. Adicionar um componente
4. Verificar se painel de propriedades aparece
5. Testar mudanças nas propriedades

### Passo 2: Identificar Problemas Críticos (30 min)

1. Verificar erros no console
2. Testar navegação entre etapas
3. Verificar se mudanças são salvas
4. Verificar se componentes respondem às mudanças

### Passo 3: Implementar Correções Básicas (2 horas)

1. Corrigir persistência de dados
2. Melhorar sincronização entre painéis
3. Adicionar loading states

## 🎯 CRITÉRIOS DE SUCESSO MVP

### Funcionalidades Obrigatórias:

- [ ] Painel aparece ao selecionar um componente
- [ ] Mudanças nas propriedades refletem no componente
- [ ] Propriedades são salvas ao navegar entre etapas
- [ ] Cada tipo de componente tem propriedades relevantes
- [ ] Interface é intuitiva e responsiva

### Funcionalidades Desejáveis:

- [ ] Preview em tempo real
- [ ] Validação de campos obrigatórios
- [ ] Undo/Redo para mudanças
- [ ] Export/Import de configurações
- [ ] Templates pré-definidos por etapa

## 🚨 PRÓXIMA AÇÃO IMEDIATA

**VAMOS COMEÇAR TESTANDO E IDENTIFICANDO OS PROBLEMAS ESPECÍFICOS**

1. Abrir o editor no navegador
2. Testar o painel de propriedades
3. Identificar exatamente o que não está funcionando
4. Implementar correções uma por vez
5. Testar cada correção antes de continuar

**Pronto para começar?** 🚀
