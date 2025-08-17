# 🔍 **Sistema de IDs dos Templates dos Funis**

## **📋 Visão Geral**

O sistema utiliza uma arquitetura híbrida com três tipos principais de identificadores:

### **🆔 Tipos de IDs**

1. **`templateId`** - ID único do template (ex: `"quiz-step-01"`)
2. **`funnelId`** - UUID do funil no banco (ex: `"550e8400-e29b-41d4-a716-446655440000"`)
3. **`stageId`** - ID da etapa do funil (ex: `"step-1"`, `"step-21"`)

---

## **🎯 Template IDs - Sistema de Identificação**

### **📁 Estrutura de Arquivos**

```
/src/config/templates/
├── step-01.json    → templateId: "quiz-step-01"
├── step-02.json    → templateId: "quiz-step-02"
├── step-03.json    → templateId: "quiz-step-03"
├── ...
└── step-21.json    → templateId: "quiz-step-21"
```

### **🔗 Mapeamento Template → Etapa**

```typescript
// Exemplo de template step-01.json
{
  "templateVersion": "2.0",
  "metadata": {
    "id": "quiz-step-01",                    // ← Template ID único
    "name": "Intro - Descubra seu Estilo",  // ← Nome amigável
    "description": "Introdução ao Quiz",     // ← Descrição
    "category": "quiz-intro",                // ← Categoria
    "type": "intro",                         // ← Tipo de template
    "tags": ["quiz", "style", "intro"],      // ← Tags para busca
    "author": "giselegal"                    // ← Autor
  },
  "blocks": [...]                            // ← Blocos do template
}
```

---

## **🗄️ Funil IDs - Sistema de Banco**

### **📊 Tabela `funnels`**

```sql
CREATE TABLE funnels (
  id UUID PRIMARY KEY,           -- ← Funnel ID único (UUID)
  name TEXT NOT NULL,            -- ← Nome do funil
  description TEXT,              -- ← Descrição
  author_id UUID,                -- ← ID do autor
  template_id TEXT,              -- ← Template base usado
  is_published BOOLEAN,          -- ← Status de publicação
  settings JSONB,                -- ← Configurações específicas
  created_at TIMESTAMP,          -- ← Data de criação
  updated_at TIMESTAMP           -- ← Última atualização
);
```

### **🔗 Tabela `funnel_steps`**

```sql
CREATE TABLE funnel_steps (
  id UUID PRIMARY KEY,           -- ← Step ID único
  funnel_id UUID,                -- ← Referência ao funil pai
  name TEXT,                     -- ← Nome da etapa
  type TEXT,                     -- ← Tipo da etapa
  order_index INTEGER,           -- ← Ordem no funil (1-21)
  blocks_count INTEGER,          -- ← Quantidade de blocos
  is_active BOOLEAN,             -- ← Se está ativa
  settings JSONB                 -- ← Configurações da etapa
);
```

---

## **⚙️ Como Funciona o Sistema**

### **🔄 Fluxo de Carregamento**

1. **Identificação do Funil**

```typescript
// 1. Obter funnelId de várias fontes
const funnelId = getFunnelIdFromEnvOrStorage() || 'default-funnel';

// Fontes em ordem de prioridade:
// - URL params (?funnelId=...)
// - localStorage (editor:funnelId)
// - Variável ambiente (VITE_DEFAULT_FUNNEL_ID)
// - Fallback: 'default-funnel'
```

2. **Mapeamento Stage → Template**

```typescript
// 2. Converter stageId para stepNumber
const stepNumber = parseStepNumberFromStageId('step-5'); // → 5

// 3. Gerar templateId
const templateId = `quiz-step-${stepNumber.toString().padStart(2, '0')}`;
// → "quiz-step-05"
```

3. **Carregamento do Template**

```typescript
// 4. Carregar template JSON
const template = await loadTemplate(stepNumber);
// → Carrega /src/config/templates/step-05.json

// 5. Converter para blocos do editor
const blocks = await templateService.convertTemplateToBlocks(template);
```

### **🎨 Sistema de Design**

Cada template possui sua própria paleta de cores:

```typescript
{
  "design": {
    "primaryColor": "#B89B7A",      // ← Cor primária (dourado)
    "secondaryColor": "#432818",    // ← Cor secundária (marrom escuro)
    "accentColor": "#aa6b5d",       // ← Cor de destaque
    "backgroundColor": "#FAF9F7",   // ← Fundo (creme)
    "fontFamily": "'Playfair Display', serif",
    "button": {
      "background": "linear-gradient(90deg, #B89B7A, #aa6b5d)",
      "textColor": "#fff",
      "borderRadius": "10px"
    }
  }
}
```

---

## **🔧 Funções Principais**

### **📍 Identificação**

```typescript
// Obter funnel ID atual
getFunnelIdFromEnvOrStorage(): string

// Validar funnel ID
isValidFunnelId(funnelId: string): boolean

// Extrair número da etapa
parseStepNumberFromStageId(stageId: string): number
```

### **📥 Carregamento**

```typescript
// Carregar template por etapa
templateService.getTemplateByStep(stepNumber: number): Promise<TemplateData>

// Carregar template por ID
templateService.getTemplate(templateId: string): Promise<TemplateData>

// Buscar templates
templateService.searchTemplates(query: string): Promise<TemplateData[]>
```

### **🔄 Conversão**

```typescript
// Template → Blocos do Editor
templateService.convertTemplateToBlocks(template: TemplateData): Block[]

// Normalizar stage ID
normalizeStageIdLabel(stageId: string): string
```

---

## **📝 Exemplos Práticos**

### **🎯 Caso 1: Carregar Template da Etapa 15**

```typescript
// Input
const stageId = 'step-15';

// Processamento
const stepNumber = parseStepNumberFromStageId(stageId); // → 15
const templateId = `quiz-step-${stepNumber.toString().padStart(2, '0')}`; // → "quiz-step-15"
const template = await templateService.getTemplate(templateId);

// Output
console.log(template.metadata.name); // → "Pergunta sobre Ocasiões Especiais"
```

### **🎯 Caso 2: Criar Novo Funil**

```typescript
// Dados do funil
const newFunnel = {
  name: 'Quiz Personalizado',
  description: 'Funil para descobrir estilo pessoal',
  template_id: 'quiz-step-01', // ← Template base
  author_id: userId,
  settings: {
    maxSteps: 21,
    theme: 'gisele-galvao',
    colors: {
      primary: '#B89B7A',
      secondary: '#432818',
    },
  },
};

// Salvar no banco
const funnel = await supabase.from('funnels').insert(newFunnel);
```

### **🎯 Caso 3: Navegação entre Etapas**

```typescript
// Navegar da etapa atual para próxima
const currentStage = 'step-5';
const currentStep = parseStepNumberFromStageId(currentStage); // → 5
const nextStep = currentStep + 1; // → 6
const nextStage = `step-${nextStep}`; // → "step-6"

// Carregar próximo template
await loadStageTemplate(nextStage);
```

---

## **🔍 Debugging e Logs**

O sistema inclui logging detalhado para facilitar o debug:

```bash
🔍 FunnelId da URL: quiz-demo-funnel
🔢 StepNumber extraído: step-15 => 15
✅ Template 15 carregado via fetch
🎨 EditorContext: Carregando template automaticamente para step-15
✅ Template step-15 carregado: 8 blocos
```

---

## **⚠️ Considerações Importantes**

### **🚨 Validações**

- **FunnelIds** devem ser UUIDs válidos ou strings alfanuméricas
- **StepNumbers** devem estar no range 1-21
- **TemplateIds** seguem padrão `quiz-step-XX`

### **🔄 Compatibilidade**

- Sistema suporta IDs legados (`step-01`, `step-1`)
- Normalização automática de formatos
- Fallbacks para casos de erro

### **💾 Persistência**

- FunnelId salvo no localStorage para sessão
- Templates carregados sob demanda
- Cache inteligente para performance

---

## **🎉 Resumo**

O sistema de IDs dos templates funciona em **três camadas**:

1. **📁 Templates** (step-XX.json) → Contém estrutura e design
2. **🗄️ Funis** (UUID no banco) → Instância personalizável
3. **🔗 Etapas** (step-N) → Mapeamento template → funil

Esta arquitetura permite **reutilização** de templates em múltiplos funis, **personalização** individual e **escalabilidade** do sistema.
