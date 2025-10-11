# 📐 SCHEMA E PROPRIEDADES - DOCUMENTAÇÃO DETALHADA

**Complemento da**: `ANALISE_ESTRUTURA_COMPLETA.md`  
**Foco**: Schema de persistência e cobertura do painel de propriedades

---

## 📦 **1. FUNNEL_PERSISTENCE_SCHEMA - Estrutura Completa**

### **1.1. Metadados Básicos**

```typescript
export const FUNNEL_PERSISTENCE_SCHEMA = {
  // Identificação
  id: 'quiz21StepsComplete',
  name: 'Quiz de Estilo Pessoal - 21 Etapas Completo',
  description: 'Template completo para descoberta do estilo pessoal...',
  version: '2.0.0',
  category: 'quiz',
  templateType: 'quiz-complete',
  
  // ... resto da configuração
}
```

| Campo | Tipo | Descrição | Valor Atual |
|-------|------|-----------|-------------|
| `id` | string | Identificador único | quiz21StepsComplete |
| `name` | string | Nome legível | Quiz de Estilo Pessoal - 21 Etapas Completo |
| `description` | string | Descrição completa | Template completo para descoberta... |
| `version` | string | Versão semântica | 2.0.0 |
| `category` | enum | Categoria do funil | quiz |
| `templateType` | enum | Tipo específico | quiz-complete |

---

### **1.2. Configurações de Persistência**

#### **Tabela de Configurações**

| Configuração | Valor | Tipo | Descrição |
|--------------|-------|------|-----------|
| `enabled` | true | boolean | Persistência ativada |
| `storage` | ['localStorage', 'supabase', 'session'] | const[] | Locais de armazenamento |
| `autoSave` | true | boolean | Salvamento automático |
| `autoSaveInterval` | 30000 | number | Intervalo em ms (30s) |
| `compression` | true | boolean | Compressão de dados |
| `encryption` | false | boolean | Criptografia (desativada) |
| `backupEnabled` | true | boolean | Backup habilitado |
| `lazyLoading` | true | boolean | ✨ Carregamento sob demanda |
| `cacheEnabled` | true | boolean | ✨ Cache inteligente |

#### **1.2.1. Storage - Prioridade e Fallback**

```typescript
storage: ['localStorage', 'supabase', 'session'] as const
```

**Ordem de Prioridade**:
1. **localStorage** - Primeiro local de tentativa (persistente no browser)
2. **supabase** - Backup remoto (banco de dados)
3. **session** - Fallback temporário (apenas sessão atual)

**Estratégia de Fallback**:
```
localStorage disponível? 
  ✅ → Usar localStorage + sync com supabase em background
  ❌ → supabase disponível?
         ✅ → Usar supabase diretamente
         ❌ → Usar sessionStorage (dados perdidos ao fechar)
```

#### **1.2.2. Auto-Save - Mecânica**

```typescript
autoSave: true,
autoSaveInterval: 30000, // 30 segundos
```

**Funcionamento**:
- Timer inicia quando usuário faz primeira alteração
- A cada 30 segundos, salva automaticamente
- Salva imediatamente em eventos críticos:
  - Step completo
  - Resposta enviada
  - Navegação entre steps
  - Antes de fechar janela (beforeunload)

**Implementação Sugerida**:
```typescript
// Em QuizEditorContext ou similar
useEffect(() => {
  if (!autoSave) return;
  
  const interval = setInterval(() => {
    if (hasUnsavedChanges) {
      saveFunnelData();
    }
  }, autoSaveInterval);
  
  return () => clearInterval(interval);
}, [autoSave, autoSaveInterval, hasUnsavedChanges]);
```

#### **1.2.3. Compression - Otimização de Armazenamento**

```typescript
compression: true
```

**Técnica**: LZ-String compression

**Benefícios**:
- Reduz tamanho em localStorage (limite de 5-10MB)
- Diminui tempo de sync com Supabase
- Economiza bandwidth

**Implementação**:
```typescript
import LZString from 'lz-string';

// Ao salvar
const compressed = LZString.compress(JSON.stringify(funnelData));
localStorage.setItem('funnel-data', compressed);

// Ao carregar
const compressed = localStorage.getItem('funnel-data');
const decompressed = LZString.decompress(compressed);
const funnelData = JSON.parse(decompressed);
```

#### **1.2.4. Lazy Loading - Performance**

```typescript
lazyLoading: true
```

**Estratégia**:
- Carrega apenas step atual + próximo
- Steps anteriores mantidos em cache leve
- Blocos pesados (imagens) carregados sob demanda

**Implementação**:
```typescript
const loadStep = async (stepId: string) => {
  // Carrega step atual
  const currentStep = await fetchStepData(stepId);
  
  // Pré-carrega próximo step em background
  const nextStepId = getNextStepId(stepId);
  setTimeout(() => prefetchStepData(nextStepId), 500);
  
  return currentStep;
};
```

#### **1.2.5. Cache Inteligente**

```typescript
cacheEnabled: true
```

**Camadas de Cache**:
1. **Memory Cache** (React state) - Imediato
2. **localStorage** - Rápido (~5ms)
3. **IndexedDB** - Para blobs grandes (~20ms)
4. **Supabase** - Remoto (~100-500ms)

**TTL (Time To Live)**:
- Dados do usuário: 24h
- Template blocks: 7 dias
- Imagens: 30 dias

---

### **1.3. Estrutura de Dados (dataStructure)**

#### **1.3.1. funnel_data - Tabela Completa**

| Campo | Tipo | Obrigatório | Default | Descrição |
|-------|------|-------------|---------|-----------|
| `id` | string | ✅ | uuid() | ID único do funil |
| `name` | string | ✅ | - | Nome do funil |
| `description` | string | ✅ | - | Descrição |
| `category` | string | ✅ | 'quiz' | Categoria |
| `user_id` | string? | ❌ | null | ID do usuário (se logado) |
| `is_published` | boolean | ✅ | false | Status de publicação |
| `created_at` | timestamp | ✅ | now() | Data de criação |
| `updated_at` | timestamp | ✅ | now() | Última atualização |
| `settings` | FunnelSettings | ✅ | {} | Configurações gerais |
| `steps` | FunnelStep[] | ✅ | [] | Array de steps |
| `blocks` | Block[] | ✅ | [] | Array de blocos |
| `metadata` | FunnelMetadata | ✅ | {} | Metadados adicionais |
| `user_session` | UserSession | ✅ | {} | Dados da sessão do usuário |

#### **1.3.2. user_session - Dados do Usuário**

```typescript
user_session: {
  // Informações básicas
  userName: 'string',
  email: 'string?',
  phone: 'string?',
  
  // Controle de sessão
  startedAt: 'timestamp',
  completedAt: 'timestamp?',
  currentStep: 'number',
  progress: 'number', // 0-100
  
  // Respostas do quiz (pontuação)
  quiz_answers: {
    question_id: 'string',
    selected_options: 'string[]',
    scores: 'Record<string, number>',
    timestamp: 'timestamp'
  },
  
  // Respostas estratégicas (não pontuadas)
  strategic_answers: {
    question_id: 'string',
    answer: 'string',
    timestamp: 'timestamp'
  },
  
  // Resultado calculado
  result: {
    primary_style: 'string',
    secondary_styles: 'string[]',
    total_score: 'number',
    style_scores: 'Record<string, number>',
    personalized_recommendations: 'string[]'
  }
}
```

#### **1.3.3. Exemplo de Dados Reais**

```json
{
  "id": "quiz-session-abc123",
  "user_session": {
    "userName": "Maria Silva",
    "email": "maria@example.com",
    "startedAt": "2025-01-10T14:30:00Z",
    "currentStep": 8,
    "progress": 38,
    
    "quiz_answers": [
      {
        "question_id": "step-2",
        "selected_options": ["opt1", "opt3", "opt5"],
        "scores": {
          "Natural": 4,
          "Contemporâneo": 2,
          "Criativo": 1
        },
        "timestamp": "2025-01-10T14:32:15Z"
      },
      {
        "question_id": "step-3",
        "selected_options": ["opt2", "opt4"],
        "scores": {
          "Clássico": 5,
          "Elegante": 3
        },
        "timestamp": "2025-01-10T14:33:45Z"
      }
    ],
    
    "strategic_answers": [
      {
        "question_id": "step-13",
        "answer": "opt1",
        "timestamp": "2025-01-10T14:40:00Z"
      }
    ],
    
    "result": {
      "primary_style": "Clássico",
      "secondary_styles": ["Elegante", "Natural"],
      "total_score": 87,
      "style_scores": {
        "Natural": 12,
        "Clássico": 26,
        "Contemporâneo": 8,
        "Elegante": 18,
        "Romântico": 7,
        "Sexy": 4,
        "Dramático": 6,
        "Criativo": 6
      },
      "personalized_recommendations": [
        "Invista em peças de alfaiataria",
        "Cores neutras e sóbrias",
        "Acessórios minimalistas"
      ]
    }
  }
}
```

---

### **1.4. Analytics e Tracking**

#### **Configuração de Analytics**

```typescript
analytics: {
  enabled: true,
  realTime: true,
  trackingId: 'GA4-XXXXXXXXX',
  
  // Eventos customizados
  events: [
    'funnel_started',
    'step_completed',
    'quiz_question_answered',
    'strategic_question_answered',
    'result_calculated',
    'offer_viewed',
    'conversion_completed',
    'user_drop_off',
    'session_timeout'
  ],
  
  // Métricas de performance
  performance: {
    trackPageLoad: true,
    trackInteractions: true,
    trackScrollDepth: true,
    trackTimeOnStep: true,
    trackCompletionRate: true
  },
  
  // Heatmap
  heatmap: {
    enabled: true,
    hotjarId: '1234567',
    recordSessions: true,
    trackClicks: true,
    trackScrolls: true
  }
}
```

#### **Eventos Rastreados - Tabela Completa**

| Evento | Quando Dispara | Dados Enviados | Prioridade |
|--------|----------------|----------------|------------|
| `funnel_started` | Usuário entra no quiz | timestamp, utm_source, referrer | Alta |
| `step_completed` | Completa um step | step_id, duration, answers | Alta |
| `quiz_question_answered` | Responde questão pontuada | question_id, options, scores | Alta |
| `strategic_question_answered` | Responde questão estratégica | question_id, answer | Média |
| `result_calculated` | Algoritmo calcula resultado | primary_style, scores, time_to_result | Alta |
| `offer_viewed` | Visualiza step de oferta | offer_id, offer_type | Alta |
| `conversion_completed` | Conclui conversão | lead_id, offer_accepted | Crítica |
| `user_drop_off` | Abandona o quiz | last_step, time_spent, progress% | Alta |
| `session_timeout` | Sessão expira | last_active, duration | Média |

---

## 🎨 **2. PAINEL DE PROPRIEDADES - COBERTURA DETALHADA**

### **2.1. Tabs do Painel**

| Tab | Ícone | Linhas | Funcionalidade Principal |
|-----|-------|--------|--------------------------|
| **props** | 🎨 | 150 | Editar propriedades de blocos |
| **runtime** | ⚙️ | 45 | Configurar scoring e cálculo |
| **results** | 🏆 | 80 | Configurar exibição de resultados |
| **funnel** | 🔗 | 82 | Configurar integração e SEO |
| **theme** | 🌈 | - | Editor de tema (componente separado) |

---

### **2.2. Tab "props" - Propriedades de Blocos**

#### **2.2.1. DynamicPropertiesForm - Campos Suportados**

**Grupo: Layout**
| Propriedade | Input Type | Valores | Editável | Coverage |
|-------------|------------|---------|----------|----------|
| `maxWidth` | text | px, %, rem, vw | ✅ | 100% |
| `padding` | text | CSS value | ✅ | 100% |
| `marginTop` | number | px | ✅ | 100% |
| `marginBottom` | number | px | ✅ | 100% |
| `textAlign` | select | left, center, right, justify | ✅ | 100% |
| `display` | select | block, flex, grid, inline | ⚠️ | 60% |

**Grupo: Tipografia**
| Propriedade | Input Type | Valores | Editável | Coverage |
|-------------|------------|---------|----------|----------|
| `fontSize` | text | Tailwind classes | ✅ | 100% |
| `fontWeight` | select | font-normal, font-bold, etc. | ✅ | 100% |
| `lineHeight` | text | leading-tight, etc. | ⚠️ | 70% |
| `color` | color | HEX | ✅ | 100% |
| `fontFamily` | select | font-sans, font-serif, etc. | ⚠️ | 50% |

**Grupo: Cores e Estilos**
| Propriedade | Input Type | Valores | Editável | Coverage |
|-------------|------------|---------|----------|----------|
| `backgroundColor` | color | HEX | ✅ | 100% |
| `borderRadius` | text | px, rem | ✅ | 100% |
| `boxShadow` | select | shadow-sm, shadow-lg, etc. | ✅ | 90% |
| `border` | text | CSS value | ⚠️ | 60% |
| `opacity` | range | 0-1 | ⚠️ | 50% |

**Grupo: Imagem**
| Propriedade | Input Type | Valores | Editável | Coverage |
|-------------|------------|---------|----------|----------|
| `objectFit` | select | cover, contain, fill | ✅ | 80% |
| `width` | text | px, %, auto | ✅ | 100% |
| `height` | text | px, %, auto | ✅ | 100% |
| `filter` | text | CSS filter | ❌ | 0% |

**Grupo: Animação**
| Propriedade | Input Type | Valores | Editável | Coverage |
|-------------|------------|---------|----------|----------|
| `animation` | text | CSS animation | ⚠️ | 30% |
| `transition` | text | CSS transition | ❌ | 0% |
| `transform` | text | CSS transform | ❌ | 0% |

#### **2.2.2. Operações de Blocos**

| Operação | Botão | Ícone | Funcionalidade | Suporta Multi-seleção |
|----------|-------|-------|----------------|----------------------|
| Duplicar | "Duplicar" | Copy | Cria cópia do bloco | ❌ |
| Duplicar em… | "Duplicar em…" | ArrowRightCircle | Copia para outro step | ❌ |
| Copiar | "Copiar {n}" | Copy | Copia múltiplos blocos | ✅ |
| Remover | "Remover {n}" | Trash2 | Remove múltiplos blocos | ✅ |
| Salvar Snippet | "Salvar como Snippet" | Copy | Salva bloco(s) como snippet | ✅ |

#### **2.2.3. Snippets - Sistema de Templates**

**Estrutura do Snippet**:
```typescript
interface Snippet {
  id: string;
  name: string;
  blocks: Block[];
  createdAt: timestamp;
  tags?: string[];
}
```

**Operações**:
- **Insert** - Insere snippet no step atual
- **Renomear** - Renomeia snippet
- **Del** - Deleta snippet
- **Filtrar** - Busca por nome

**Storage**: localStorage em `funnel-snippets`

---

### **2.3. Tab "runtime" - Configuração de Scoring**

#### **2.3.1. Tie-Break (Desempate)**

| Opção | Valor | Descrição | Quando Usar |
|-------|-------|-----------|-------------|
| Alfabético | `alphabetical` | Ordena estilos alfabeticamente | Default, mais previsível |
| Primeiro | `first` | Mantém primeiro encontrado | Performance |
| Natural Primeiro | `natural-first` | Prioriza estilo "Natural" | Bias intencional |
| Aleatório | `random` | Escolhe aleatoriamente | Diversidade |

**Implementação Sugerida**:
```typescript
const resolveTieBreak = (tiedStyles: string[], tieBreak: TieBreakStrategy) => {
  switch (tieBreak) {
    case 'alphabetical':
      return tiedStyles.sort()[0];
    case 'first':
      return tiedStyles[0];
    case 'natural-first':
      return tiedStyles.includes('Natural') ? 'Natural' : tiedStyles[0];
    case 'random':
      return tiedStyles[Math.floor(Math.random() * tiedStyles.length)];
  }
};
```

#### **2.3.2. Pesos (Style Weights)**

**Formato JSON**:
```json
{
  "natural": 1.2,
  "classico": 1.0,
  "contemporaneo": 0.9,
  "elegante": 1.1
}
```

**Uso**:
```typescript
const applyWeights = (scores: Record<string, number>, weights: Record<string, number>) => {
  return Object.entries(scores).reduce((acc, [style, score]) => {
    const weight = weights[style.toLowerCase()] || 1;
    acc[style] = score * weight;
    return acc;
  }, {} as Record<string, number>);
};
```

**Exemplo**:
```
Scores Originais:
- Natural: 20
- Clássico: 18

Com Pesos (natural: 1.2, classico: 1.0):
- Natural: 20 * 1.2 = 24 ✅ Vencedor
- Clássico: 18 * 1.0 = 18
```

---

### **2.4. Tab "results" - Exibição de Resultados**

#### **2.4.1. Checkboxes de Exibição**

| Checkbox | unifiedConfig Path | Default | Descrição |
|----------|-------------------|---------|-----------|
| Exibir nome do usuário | `ui.behavior.resultDisplay.showUserName` | true | Mostra "Parabéns, {userName}!" |
| Exibir nome do estilo | `ui.behavior.resultDisplay.showStyleName` | true | Mostra nome do estilo predominante |
| Exibir % predominante | `ui.behavior.resultDisplay.showPrimaryPercentage` | true | Mostra porcentagem do estilo principal |
| Exibir ranking secundários | `ui.behavior.resultDisplay.showSecondaryRanking` | true | Mostra 2º e 3º lugares |

#### **2.4.2. Configuração de Estilos**

**Campos por Estilo**:
| Campo | Tipo | Uso | Exemplo |
|-------|------|-----|---------|
| `title` | text | Título do estilo | "Estilo Natural" |
| `description` | textarea | Descrição longa | "Você valoriza conforto..." |
| `category` | text | Categoria | "Casual" |
| `keywords` | text (CSV) | Palavras-chave | "conforto, natural, leve" |
| `image` | text (URL) | Imagem do estilo | https://... |
| `guideImage` | text (URL) | Imagem do guia/material | https://... |

**Exemplo de Configuração**:
```json
{
  "results": {
    "styles": {
      "Natural": {
        "title": "Estilo Natural",
        "description": "Você valoriza conforto e autenticidade...",
        "category": "Casual",
        "keywords": ["conforto", "natural", "leve", "prático"],
        "image": "https://res.cloudinary.com/.../natural.webp",
        "guideImage": "https://res.cloudinary.com/.../guia-natural.pdf"
      },
      "Clássico": {
        "title": "Estilo Clássico",
        "description": "Você aprecia elegância atemporal...",
        "category": "Formal",
        "keywords": ["elegante", "clássico", "sofisticado"],
        "image": "https://res.cloudinary.com/.../classico.webp",
        "guideImage": "https://res.cloudinary.com/.../guia-classico.pdf"
      }
    }
  }
}
```

---

### **2.5. Tab "funnel" - Integrações e SEO**

#### **2.5.1. Configurações Gerais**

| Campo | unifiedConfig Path | Tipo | Descrição |
|-------|-------------------|------|-----------|
| URL Base | `settings.seo.canonical` | URL | URL canônica do funil |
| Pixel ID | `settings.analytics.facebookPixel.pixelId` | string | ID do pixel do Facebook |
| Token | `settings.integrations.custom.token` | string | Token de API |
| API Base | `settings.integrations.custom.apiBaseUrl` | URL | URL base da API |
| Webhook URL | `settings.integrations.webhooks[0].url` | URL | URL do webhook de leads |

#### **2.5.2. UTM Parameters**

| Parâmetro | Path | Exemplo |
|-----------|------|---------|
| Source | `settings.analytics.utm.source` | facebook, instagram, google |
| Medium | `settings.analytics.utm.medium` | cpc, social, email |
| Campaign | `settings.analytics.utm.campaign` | quiz-estilo-jan-2025 |

**URL Gerada**:
```
https://quiz-sell-genius.com/quiz-estilo?utm_source=facebook&utm_medium=cpc&utm_campaign=quiz-estilo-jan-2025
```

#### **2.5.3. SEO - Meta Tags**

| Campo | Path | Max Length | Descrição |
|-------|------|------------|-----------|
| SEO Title | `settings.seo.title` | 60 chars | Título para Google |
| SEO Description | `settings.seo.description` | 160 chars | Descrição para snippet |

**Exemplo**:
```html
<head>
  <title>Descubra Seu Estilo Pessoal - Quiz Interativo</title>
  <meta name="description" content="Faça nosso quiz personalizado e descubra qual é o seu estilo predominante em poucos minutos!">
</head>
```

---

### **2.6. Tab "theme" - Editor de Tema**

**Componente Separado**: `ThemeEditorPanel`

**Funcionalidades**:
- Seleção de paleta de cores
- Tipografia (fontes)
- Espaçamentos
- Border radius
- Sombras
- Aplicar tema globalmente

**Não coberto nesta análise** (componente separado)

---

## 📊 **3. MATRIZ DE COBERTURA DO PAINEL**

### **3.1. Por Tipo de Bloco**

| Tipo de Bloco | Coverage | Props Editáveis | Props Não Editáveis | Observações |
|---------------|----------|-----------------|---------------------|-------------|
| `text` | 90% | fontSize, color, align, margins, fontWeight | fontFamily avançada | Excelente |
| `text-inline` | 90% | fontSize, color, align, margins, fontWeight | transform, filter | Excelente |
| `image` | 70% | width, height, objectFit, borderRadius | filter, transform | Bom |
| `button-inline` | 85% | backgroundColor, color, padding, borderRadius | hover states | Muito bom |
| `options-grid` | 60% | Layout básico (cols, gap) | **scores** ❌ | ⚠️ Falta editor de scores |
| `form-container` | 75% | Layout, spacing | Validações avançadas | Bom |
| `quiz-intro-header` | 80% | Logo, progress, colors | Layout customizado | Muito bom |
| `result-header-inline` | 50% | Texto básico | Layout do resultado | ⚠️ Limitado |
| `secondary-styles` | 40% | Exibir/ocultar | Formatação visual | ⚠️ Muito limitado |
| `fashion-ai-generator` | 30% | Exibir/ocultar | Config de engines, prompts | ❌ Quase nenhuma edição |
| `testimonials` | 65% | Conteúdo, layout básico | Carousel config | Bom |
| `urgency-timer-inline` | 70% | Countdown, texto | Efeitos visuais | Bom |
| `conversion` | 60% | CTA, cores | Lógica de conversão | Bom |

### **3.2. Por Categoria de Propriedade**

| Categoria | Coverage Total | Gaps Principais |
|-----------|----------------|-----------------|
| Layout (width, height, margins) | 95% | display: grid avançado |
| Tipografia | 85% | fontFamily customizada, letter-spacing |
| Cores | 100% | ✅ Completo |
| Bordas e Sombras | 90% | box-shadow customizado |
| Animações | 30% | ❌ Muito limitado |
| Transformações | 10% | ❌ Praticamente ausente |
| Imagens | 70% | Filtros CSS |
| **Scoring de Opções** | 0% | ❌ **NÃO EDITÁVEL** |
| **Variáveis Dinâmicas** | 0% | ❌ **NÃO EDITÁVEL** |

---

## 🚨 **4. GAPS CRÍTICOS IDENTIFICADOS**

### **Gap #1: Editor de Scores para options-grid**

**Problema**: Scores das opções não são editáveis via painel

**Impacto**: 
- Pontuação precisa ser editada manualmente no código
- Impossível ajustar pesos sem deploy
- Dificulta testes A/B de scoring

**Solução Proposta**:
```tsx
// Adicionar no DynamicPropertiesForm quando type === 'options-grid'
{selectedBlock.type === 'options-grid' && (
  <div className="space-y-3">
    <h4 className="font-semibold">Pontuação das Opções</h4>
    {selectedBlock.content.options.map((option, idx) => (
      <div key={option.id} className="border p-3 rounded">
        <p className="text-sm font-medium">{option.text}</p>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {STYLE_NAMES.map(style => (
            <div key={style}>
              <label className="text-xs">{style}</label>
              <input 
                type="number" 
                min={0} 
                max={5}
                value={option.scores?.[style] || 0}
                onChange={(e) => updateOptionScore(idx, style, Number(e.target.value))}
                className="w-full border rounded px-1 py-0.5"
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}
```

### **Gap #2: Variáveis Dinâmicas Não Editáveis**

**Problema**: Variáveis como `{userName}`, `{resultStyle}` não são editáveis

**Impacto**:
- Impossível adicionar novas variáveis
- Impossível testar personalizações
- Dificulta customização

**Solução Proposta**:
```tsx
// Adicionar campo de texto com autocomplete
<div className="space-y-2">
  <label className="text-xs font-medium">Texto (use {'{var}'} para variáveis)</label>
  <textarea 
    value={content.text}
    onChange={(e) => updateContent('text', e.target.value)}
    onKeyDown={handleVariableAutocomplete} // Detecta { e mostra sugestões
    className="w-full border rounded px-2 py-1 font-mono text-xs"
  />
  <div className="flex flex-wrap gap-1">
    {AVAILABLE_VARIABLES.map(v => (
      <button 
        key={v}
        onClick={() => insertVariable(v)}
        className="text-[10px] bg-blue-50 px-2 py-0.5 rounded"
      >
        {'{' + v + '}'}
      </button>
    ))}
  </div>
</div>
```

### **Gap #3: Componentes Avançados Limitados**

**Problemas**:
- `fashion-ai-generator` - Não edita engines ou prompts
- `secondary-styles` - Não edita formatação visual
- `result-header-inline` - Layout não customizável

**Solução**: Criar editores específicos para cada componente avançado

---

## ✅ **5. RECOMENDAÇÕES**

### **Prioridade P0 (Crítica)**

1. **Implementar Editor de Scores**
   - Esforço: 8h
   - Impacto: Crítico
   - Bloqueia uso real do quiz

2. **Adicionar Suporte a Variáveis**
   - Esforço: 4h
   - Impacto: Alto
   - Melhora muito UX do editor

### **Prioridade P1 (Alta)**

3. **Expandir Suporte a Animações**
   - Esforço: 6h
   - Impacto: Médio
   - Melhora experiência visual

4. **Editor de Componentes Avançados**
   - Esforço: 12h
   - Impacto: Médio
   - Permite customização completa

### **Prioridade P2 (Média)**

5. **Validações de Runtime**
   - Esforço: 4h
   - Impacto: Baixo
   - Previne erros de config

6. **Melhorar Cache e Performance**
   - Esforço: 6h
   - Impacto: Baixo
   - Otimização de velocidade

---

## 📚 **6. PRÓXIMOS PASSOS**

1. **Fase 1**: Implementar editor de scores (Gap #1)
2. **Fase 2**: Adicionar suporte a variáveis (Gap #2)
3. **Fase 3**: Expandir componentes avançados (Gap #3)
4. **Fase 4**: Otimizações e polish

**Estimativa Total**: 3-4 semanas

---

**Documento gerado em**: 11/10/2025  
**Relacionado a**: `ANALISE_ESTRUTURA_COMPLETA.md`  
**Próxima revisão**: Após implementação dos gaps P0
