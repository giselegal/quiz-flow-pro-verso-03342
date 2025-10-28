# 🚀 Fluxo de Publicação NoCode - Quiz Flow Pro

## 📋 Visão Geral

Este documento explica **COMO FUNCIONA** o processo de publicação de um funil de quiz em produção, desde a edição no editor NoCode até a URL pública final.

---

## 🎯 Estado Atual da Implementação

### ✅ O que JÁ EXISTE

#### 1. **Editor NoCode Visual** ✅
- **Localização**: `src/components/editor/`
- **Componentes**:
  - `EditorProviderUnified`: Estado global do editor
  - `UnifiedStepContent`: Bridge entre JSON e componentes React
  - `ModularQuestionStep`, `ModularIntroStep`, etc.: 6 componentes modulares
  - 32 blocos atômicos em `src/components/editor/blocks/atomic/`

#### 2. **Template JSON (Fonte de Verdade)** ✅
- **Localização**: `public/templates/quiz21-complete.json` (3553 linhas)
- **Estrutura**:
```json
{
  "templateVersion": "3.0",
  "templateId": "quiz-estilo-21-steps",
  "metadata": {
    "author": "Sistema",
    "version": "3.0.0",
    "createdAt": "2025-01-13"
  },
  "steps": {
    "step-01": {
      "metadata": {
        "id": "step-01-intro-v3",
        "name": "Introdução",
        "category": "intro"
      },
      "theme": {
        "colors": { "primary": "#B89B7A", ... },
        "fonts": { "heading": "Playfair Display", ... }
      },
      "blocks": [
        {
          "id": "intro-logo",
          "type": "image",
          "content": { "url": "/images/logo.png", ... }
        },
        {
          "id": "intro-title",
          "type": "title",
          "content": { "text": "Bem-vindo ao Quiz", ... }
        }
      ]
    }
  }
}
```

#### 3. **Banco de Dados (Supabase)** ✅
- **Schema**: `shared/schema.ts` (Drizzle ORM)
- **Tabelas principais**:

```typescript
// Funil principal
funnels {
  id: text (PK)
  name: text
  description: text
  is_published: boolean
  settings: json  // ⚠️ AQUI ficam configs de publicação
  version: integer
  created_at: timestamp
  updated_at: timestamp
}

// Páginas do funil (21 steps)
funnel_pages {
  id: text (PK)
  funnel_id: text (FK → funnels.id)
  page_type: text  // 'intro', 'question', 'processing', etc.
  page_order: integer  // 1 a 21
  title: text
  blocks: json  // Array de blocos (vem do template JSON)
  metadata: json
  created_at: timestamp
}

// Participantes do quiz
quiz_participants {
  id: text (PK)
  name: text
  email: text
  quiz_id: text
  utm_source: text
  utm_medium: text
  utm_campaign: text
  created_at: timestamp
}

// Resultados do quiz
quiz_results {
  id: text (PK)
  participant_id: text (FK)
  primary_style: text  // Ex: "Romântico"
  style_percentage: integer
  all_styles: json  // Todos os scores
  answers: json  // Respostas do quiz
  utm_data: json
  created_at: timestamp
}

// Eventos de conversão
conversion_events {
  id: text (PK)
  event_type: text  // 'lead', 'purchase', 'quiz_complete'
  participant_id: text
  user_email: text
  utm_source: text
  utm_campaign: text
  facebook_event_id: text  // Para Pixel
  metadata: json
  created_at: timestamp
}
```

#### 4. **Serviço de Publicação** ✅
- **Localização**: `src/services/funnelPublishing.ts`
- **Função principal**:

```typescript
export const publishFunnel = async (
  funnelData: PublishFunnelData
): Promise<PublishResult> => {
  // 1. Valida dados (21 etapas, blocos, etc.)
  const validation = validateFunnelData(funnelData);
  
  // 2. Salva funil no Supabase
  await supabase.from('funnels').upsert({
    id: funnelData.id,
    name: funnelData.name,
    is_published: true,
    settings: funnelData.settings  // ⚠️ IMPORTANTE
  });
  
  // 3. Salva 21 páginas
  const pages = funnelData.stages.map(stage => ({
    funnel_id: funnelData.id,
    page_type: getPageType(stage.order),
    blocks: stage.blocks  // Vem do template JSON
  }));
  await supabase.from('funnel_pages').upsert(pages);
  
  // 4. Gera URL pública
  const publicUrl = `${baseUrl}/quiz/${funnelId}`;
  
  return { success: true, publicUrl };
};
```

#### 5. **Hook de Publicação** ✅
- **Localização**: `src/hooks/useFunnelPublication.ts`
- **Interface de configurações**:

```typescript
interface FunnelPublicationSettings {
  // Domínio
  domain: {
    customDomain?: string;
    subdomain?: string;
    slug: string;
  };
  
  // Resultados (baseado em pontuação)
  results: {
    primary: ResultConfiguration;
    secondary?: ResultConfiguration[];
    keywords: KeywordResultMapping[];  // Mapeia palavras → resultado
  };
  
  // SEO
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    robots?: string;
  };
  
  // Tracking
  tracking: {
    googleAnalytics?: string;
    facebookPixel?: string;
    customPixels?: PixelConfiguration[];
    utmParameters: UTMConfiguration;
  };
}
```

#### 6. **Painel de Publicação NoCode** ✅
- **Localização**: `src/components/editor/publication/FunnelPublicationPanel.tsx`
- **Tabs disponíveis**:
  - 🌐 **Domínio**: Configurar URL pública
  - 🎯 **Resultados**: Mapear pontuação → perfis
  - 📈 **SEO**: Meta tags, OG image
  - 🔍 **Tracking**: Google Analytics, Facebook Pixel, UTMs
  - 🔒 **Segurança**: Tokens, webhooks

#### 7. **Botão "Publicar" no Editor** ✅
- **Localização**: `src/components/editor/publication/PublicationButton.tsx`
- **Status visual**:
  - 🟢 **Online**: Publicado com sucesso
  - ⭕ **Rascunho**: Ainda não publicado
  - 🔴 **Erro**: Falha na publicação

---

## ❌ O que FALTA Implementar

### 1. **Sistema de Pontuação/Scoring** ⚠️
**Status**: Parcialmente implementado

**O que existe**:
- Campo `points` em `OptionsGridBlock` (cada opção pode ter pontos)
- Campo `weight` em `ModularQuestionStep` (peso da pergunta)
- Função `isScoringPhase()` em `lib/quiz/selectionRules.ts`

**O que falta**:
```typescript
// ❌ NÃO EXISTE AINDA
lib/quiz/scoring.ts {
  calculateStyleScores(answers: QuizAnswers): StyleScores {
    // Calcular pontuação por estilo (Romântico, Clássico, etc.)
    // Baseado em:
    // - points de cada opção selecionada
    // - weight de cada pergunta
    // - Regras de negócio específicas
  }
  
  determineResult(scores: StyleScores): ResultProfile {
    // Determinar perfil vencedor
    // Aplicar thresholds (ex: mínimo 30% para ser primário)
    // Retornar perfil completo (username, avatar, descrição)
  }
}
```

### 2. **Mapeamento Palavras-Chave → Resultados** ❌
**Status**: Interface existe, lógica não

**O que existe**:
- Interface `KeywordResultMapping` no hook
- UI para configurar keywords no painel

**O que falta**:
```typescript
// ❌ NÃO EXISTE
lib/quiz/keywordMatching.ts {
  matchKeywordsToResult(
    keywords: string[], 
    mappings: KeywordResultMapping[]
  ): string {
    // Encontrar melhor resultado baseado em palavras-chave
    // Exemplo: ["minimalista", "clean"] → Perfil "Moderno"
  }
}
```

### 3. **Validação com Zod Schema** ⚠️
**Status**: Parcialmente implementado

**O que existe**:
- `shared/schema.ts`: Schemas Drizzle (SQLite)
- `src/utils/schemaValidation.ts`: Validação básica
- `useStepValidation.ts`: Hook com Zod importado

**O que falta**:
```typescript
// ❌ Schemas Zod completos para publicação
lib/schemas/publicationSchemas.ts {
  export const FunnelPublicationSchema = z.object({
    domain: z.object({
      slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
      subdomain: z.string().optional(),
      customDomain: z.string().url().optional()
    }),
    seo: z.object({
      title: z.string().min(10).max(60),
      description: z.string().min(50).max(160),
      ogImage: z.string().url()
    }),
    tracking: z.object({
      facebookPixel: z.string().regex(/^\d+$/),
      googleAnalytics: z.string().regex(/^G-[A-Z0-9]+$/)
    })
  });
}
```

### 4. **Página Pública do Quiz (SSR)** ⚠️
**Status**: Componente criado, não integrado

**O que existe**:
- `PublicQuizPage.tsx`: Componente React completo (485 linhas)
- `public-quiz-standalone.html`: Demo funcional

**O que falta**:
- Integração com Next.js (App Router)
- Rota dinâmica `/quiz/[quizId]/page.tsx`
- Buscar dados do Supabase (SSR)
- Renderizar template JSON como UI pública
- Salvar respostas e calcular resultado

### 5. **Empacotamento Otimizado** ❌
**Status**: Não implementado

**O que falta**:
- Build separado para público vs editor
- Code splitting por rota
- Tree shaking de DnD-kit (não incluir no bundle público)
- Otimização de imagens (responsive, lazy loading)
- Minificação e compressão (Gzip/Brotli)

---

## 🔄 Fluxo Completo (Como DEVERIA Funcionar)

### 1️⃣ **Edição NoCode no Editor**

```
Usuário abre editor → http://localhost:5173/editor/[funnelId]
  ↓
EditorProviderUnified carrega template JSON
  ↓
Usuário edita no visual:
  - Arrasta blocos
  - Edita textos
  - Configura opções (com pontos/pesos)
  - Escolhe cores/fontes
  ↓
Cada edit chama: editor.actions.updateBlock()
  ↓
EditorStateManager persiste mudanças
  ↓
Template JSON é atualizado (fonte de verdade)
```

### 2️⃣ **Configuração de Publicação**

```
Usuário clica "Publicação" (botão no toolbar)
  ↓
Abre FunnelPublicationPanel com 5 tabs:
```

**Tab 1: Domínio 🌐**
```
- Subdomínio: meu-quiz
- Slug: /estilo-pessoal
- Custom domain: quiz.meusite.com (opcional)
→ URL final: meu-quiz.quizflowpro.com/estilo-pessoal
```

**Tab 2: Resultados 🎯**
```
- Perfil 1: "Romântico"
  - Username: @estilo_romantico
  - Descrição: "Você valoriza o charme clássico..."
  - Avatar: /images/romantico.jpg
  - Keywords: ["florais", "vintage", "delicado"]
  - Threshold: 30% (mínimo para ser primário)
  
- Perfil 2: "Minimalista"
  - Username: @estilo_clean
  - Keywords: ["clean", "simples", "neutro"]
  
→ Sistema calcula pontuação e mapeia para perfil correto
```

**Tab 3: SEO 📈**
```
- Title: "Descubra Seu Estilo Pessoal | Quiz Gratuito"
- Description: "Responda 13 perguntas e descubra qual estilo..."
- OG Image: /images/og-quiz.png
- Keywords: ["quiz de estilo", "teste personalidade"]
→ Meta tags para Google/redes sociais
```

**Tab 4: Tracking 🔍**
```
- Google Analytics: G-XXXXXXXXXX
- Facebook Pixel: 1234567890
- UTM Parameters:
  - utm_source: instagram
  - utm_medium: stories
  - utm_campaign: lancamento_quiz
→ Rastreamento de conversões
```

**Tab 5: Segurança 🔒**
```
- Webhook URL: https://api.meusite.com/quiz-webhook
- API Token: sk_live_xxxxx
→ Notificações de conversão
```

### 3️⃣ **Clique em "Publicar"**

```typescript
// src/components/editor/publication/PublicationButton.tsx

handlePublish() {
  // 1. Validar com Zod
  const validation = FunnelPublicationSchema.safeParse(settings);
  if (!validation.success) {
    toast.error("Configurações inválidas!");
    return;
  }
  
  // 2. Buscar template JSON atualizado
  const template = await TemplateManager.getTemplate(funnelId);
  
  // 3. Publicar no Supabase
  const result = await publishFunnel({
    id: funnelId,
    name: template.name,
    stages: template.steps,
    settings: {
      domain: settings.domain,
      results: settings.results,
      seo: settings.seo,
      tracking: settings.tracking
    }
  });
  
  // 4. Build otimizado (futuro)
  // await buildPublicVersion(funnelId);
  
  // 5. Mostrar URL pública
  toast.success(`Publicado! ${result.publicUrl}`);
}
```

### 4️⃣ **Empacotamento para Produção**

**Build Process (Next.js)**:
```bash
# Versão Pública (lightweight)
npm run build:public
  → Output: .next/server/app/(public)/quiz/[quizId]/
  → Bundle: ~45KB (sem editor, sem DnD)
  → SSR: Busca template do Supabase
  → Renderiza: PublicQuizPage.tsx
  
# Versão Editor (full features)
npm run build:editor
  → Output: .next/server/app/editor/[funnelId]/
  → Bundle: ~580KB (com DnD, todas libs)
  → Client-only: Não precisa SSR
```

**Otimizações**:
```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    // Remover DnD-kit do bundle público
    if (isPublicRoute) {
      config.externals.push('@dnd-kit/*');
    }
    return config;
  },
  
  // Compressão
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200]
  }
};
```

### 5️⃣ **Acesso Público Final**

```
Usuário visita: https://meu-quiz.quizflowpro.com/estilo-pessoal?utm_source=instagram
  ↓
Next.js (SSR):
  1. Busca funnel no Supabase: SELECT * FROM funnels WHERE slug='estilo-pessoal'
  2. Busca páginas: SELECT * FROM funnel_pages WHERE funnel_id=...
  3. Renderiza PublicQuizPage.tsx com template JSON
  ↓
Usuário responde quiz:
  - Clica opções (cada uma tem points e style)
  - Avança pelos 21 steps
  - Sistema calcula pontuação em real-time
  ↓
Ao finalizar:
  1. calculateStyleScores(answers) → { Romântico: 45%, Clássico: 30%, ... }
  2. determineResult(scores) → Perfil "Romântico"
  3. Salvar no Supabase:
     - quiz_participants (nome, email, UTMs)
     - quiz_results (scores, respostas)
     - conversion_events (tipo: 'quiz_complete')
  4. Disparar eventos:
     - Facebook Pixel: fbq('track', 'Lead', { value: 0 })
     - Google Analytics: gtag('event', 'quiz_complete')
     - Webhook: POST /api/webhook { participant_id, result }
  5. Mostrar resultado:
     - Avatar do perfil
     - Descrição personalizada
     - CTAs (baixar guia, agendar consulta, etc.)
```

---

## 📁 Estrutura de Arquivos (Como DEVE Ser)

```
src/
├── components/
│   ├── editor/              # Editor NoCode (client-only)
│   │   ├── blocks/atomic/   # 32 blocos editáveis
│   │   ├── quiz-estilo/     # 6 modulares (edição)
│   │   └── publication/     # Painel de publicação
│   │
│   └── quiz/                # Versão pública (SSR-safe)
│       ├── IntroBlock.tsx
│       ├── QuestionBlock.tsx
│       ├── TransitionBlock.tsx
│       └── ResultBlock.tsx
│
├── lib/
│   ├── quiz/
│   │   ├── scoring.ts       # ⚠️ FALTA: Calcular pontuação
│   │   ├── keywordMatching.ts  # ⚠️ FALTA: Mapear keywords
│   │   ├── validation.ts    # ✅ Validação de respostas
│   │   └── navigation.ts    # ✅ Lógica de avançar/voltar
│   │
│   └── schemas/
│       └── publicationSchemas.ts  # ⚠️ FALTA: Zod schemas
│
├── services/
│   ├── funnelPublishing.ts  # ✅ Publicar no Supabase
│   └── scoring/
│       ├── calculator.ts    # ⚠️ FALTA: Calcular scores
│       └── resultMapper.ts  # ⚠️ FALTA: Score → Perfil
│
├── hooks/
│   ├── useFunnelPublication.ts  # ✅ Hook de publicação
│   └── useQuizScoring.ts        # ⚠️ FALTA: Hook de scoring
│
└── app/                     # Next.js App Router
    ├── (public)/
    │   └── quiz/
    │       └── [quizId]/
    │           └── page.tsx  # ⚠️ FALTA: Página pública SSR
    │
    └── editor/
        └── [funnelId]/
            └── page.tsx      # ✅ Editor existente

public/
└── templates/
    └── quiz21-complete.json  # ✅ Fonte de verdade

shared/
└── schema.ts                 # ✅ Schema Supabase (Drizzle)
```

---

## ⚙️ Configurações NoCode (Por Funil)

Cada funil tem suas próprias configurações salvas em `funnels.settings` (JSON no Supabase):

```json
{
  "domain": {
    "slug": "estilo-pessoal",
    "subdomain": "meu-quiz",
    "customDomain": null
  },
  "results": {
    "calculationType": "weighted",  // ou "keyword-based"
    "profiles": [
      {
        "id": "romantico",
        "username": "@estilo_romantico",
        "title": "Romântico",
        "description": "Você valoriza o charme clássico...",
        "threshold": 30,
        "keywords": ["florais", "vintage", "delicado"],
        "images": {
          "avatar": "/images/romantico-avatar.jpg",
          "banner": "/images/romantico-banner.jpg"
        },
        "characteristics": [
          "Adora estampas florais",
          "Prefere tons pastel",
          "Valoriza detalhes delicados"
        ]
      }
    ]
  },
  "scoring": {
    "questions": {
      "step-02": { "weight": 1.0 },
      "step-03": { "weight": 1.5 },  // Pergunta mais importante
      "step-04": { "weight": 1.0 }
    },
    "options": {
      "step-02-option-1": { "style": "romantico", "points": 10 },
      "step-02-option-2": { "style": "minimalista", "points": 10 },
      "step-02-option-3": { "style": "classico", "points": 10 }
    }
  },
  "seo": {
    "title": "Descubra Seu Estilo Pessoal",
    "description": "Responda 13 perguntas e descubra...",
    "keywords": ["quiz de estilo", "personalidade"],
    "ogImage": "/images/og-quiz.png",
    "ogType": "website",
    "twitterCard": "summary_large_image"
  },
  "tracking": {
    "googleAnalytics": "G-XXXXXXXXXX",
    "facebookPixel": "1234567890",
    "gtm": null,
    "utmDefaults": {
      "utm_source": "organic",
      "utm_medium": "referral"
    },
    "events": {
      "quiz_started": true,
      "quiz_completed": true,
      "lead_captured": true
    }
  },
  "pixels": [
    {
      "provider": "facebook",
      "pixelId": "1234567890",
      "events": ["PageView", "Lead", "CompleteRegistration"],
      "customEvents": {
        "quiz_complete": {
          "eventName": "QuizComplete",
          "parameters": { "value": 0, "currency": "BRL" }
        }
      }
    },
    {
      "provider": "google",
      "conversionId": "AW-XXXXXXXXX",
      "conversionLabel": "abc123"
    }
  ],
  "webhooks": [
    {
      "url": "https://api.meusite.com/quiz-webhook",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer sk_live_xxxxx"
      },
      "events": ["quiz.completed", "lead.created"]
    }
  ],
  "branding": {
    "logo": "/images/logo.png",
    "favicon": "/images/favicon.ico",
    "primaryColor": "#B89B7A",
    "fontFamily": "Playfair Display"
  }
}
```

---

## 🎨 Painel NoCode Visual

### Interface de Configuração (Figma Mockup)

```
┌─────────────────────────────────────────────────────────────┐
│ 📡 Configurações de Publicação - Quiz de Estilo Pessoal   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tabs: [🌐 Domínio] [🎯 Resultados] [📈 SEO] [🔍 Track] [🔒 API]
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🌐 Domínio e URL Pública                            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                      │  │
│  │  Subdomínio:  [meu-quiz____________]  .quizflow.com │  │
│  │  Slug:        [estilo-pessoal______]                │  │
│  │  Custom:      [____________________] (opcional)      │  │
│  │                                                      │  │
│  │  📎 URL Final:                                       │  │
│  │  https://meu-quiz.quizflow.com/estilo-pessoal       │  │
│  │  [📋 Copiar]  [🔗 Abrir]                            │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [⬅️ Cancelar]           [💾 Salvar] [🚀 Publicar Agora]  │
└─────────────────────────────────────────────────────────────┘
```

### Tab "Resultados" (Mais Complexa)

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 Configuração de Resultados                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tipo de Cálculo:  ⚪ Pontuação Ponderada  ⚫ Palavras-Chave
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Perfil 1: Romântico                      [❌ Remover] │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Username:        [@estilo_romantico___________]     │  │
│  │  Título:          [Romântico__________________]      │  │
│  │  Descrição:       [Você valoriza o charme...   ]     │  │
│  │                   [________________________________]  │  │
│  │  Threshold:       [30___] % (mínimo para ser 1º)    │  │
│  │                                                      │  │
│  │  Keywords: [florais] [vintage] [delicado] [+ Add]   │  │
│  │                                                      │  │
│  │  Avatar:  [🖼️ Arrastar imagem ou clicar]            │  │
│  │           /images/romantico-avatar.jpg               │  │
│  │                                                      │  │
│  │  Características:                                    │  │
│  │  • [Adora estampas florais_________] [❌]           │  │
│  │  • [Prefere tons pastel____________] [❌]           │  │
│  │  • [Valoriza detalhes delicados____] [❌]           │  │
│  │  [+ Adicionar característica]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [+ Adicionar Novo Perfil]                                 │
│                                                             │
│  ⚙️ Configuração de Pontuação (Avançado)                   │
│  [▼ Mostrar pesos de perguntas e opções]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementação Pendente (To-Do List)

### Sprint 1: Sistema de Pontuação ⏱️ 8-12h
- [ ] `lib/quiz/scoring.ts`: Calcular scores por estilo
- [ ] `lib/quiz/resultMapper.ts`: Mapear score → perfil
- [ ] `hooks/useQuizScoring.ts`: Hook React
- [ ] Adicionar peso nas perguntas (UI no editor)
- [ ] Adicionar pontos nas opções (UI no editor)
- [ ] Testes unitários

### Sprint 2: Validação com Zod ⏱️ 4-6h
- [ ] `lib/schemas/publicationSchemas.ts`: Schemas completos
- [ ] Integrar no `handlePublish()`
- [ ] Mensagens de erro amigáveis
- [ ] Validação em tempo real (onChange)

### Sprint 3: Página Pública SSR ⏱️ 12-16h
- [ ] Migrar para Next.js App Router
- [ ] `app/(public)/quiz/[quizId]/page.tsx`
- [ ] SSR: Buscar funil do Supabase
- [ ] Renderizar template JSON
- [ ] Calcular resultado ao finalizar
- [ ] Salvar em `quiz_results`
- [ ] Disparar pixels/webhooks

### Sprint 4: Empacotamento Otimizado ⏱️ 6-8h
- [ ] Webpack config para remover DnD
- [ ] Code splitting por rota
- [ ] Image optimization (responsive)
- [ ] Bundle analyzer
- [ ] Lighthouse 90+

### Sprint 5: Keywords + Webhooks ⏱️ 6-8h
- [ ] `lib/quiz/keywordMatching.ts`
- [ ] UI para mapear keywords
- [ ] Sistema de webhooks
- [ ] Retry logic (falhas)
- [ ] Dashboard de logs

---

## 📊 Métricas de Sucesso

Após implementação completa:

✅ **Bundle Size**:
- Público: < 50KB (gzipped)
- Editor: < 600KB

✅ **Performance**:
- Lighthouse: 90+ em todas métricas
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s

✅ **Funcional**:
- Publicação em < 30s (do clique ao URL público)
- Cálculo de resultado < 100ms
- 100% dos pixels disparando corretamente

✅ **NoCode**:
- Configuração completa sem código
- Preview em tempo real
- Validação com feedback visual

---

## 🆘 Troubleshooting

### Problema: "Funil não publica"
**Solução**:
1. Verificar console: erros de validação?
2. Checar Supabase: permissões RLS?
3. Ver logs do `publishFunnel()`

### Problema: "Pontuação errada"
**Solução**:
1. Verificar pesos das perguntas
2. Conferir pontos das opções
3. Debug: `console.log(calculateStyleScores(answers))`

### Problema: "Pixels não disparam"
**Solução**:
1. Facebook Pixel Helper (extensão Chrome)
2. Verificar IDs corretos
3. Testar eventos manualmente: `fbq('track', 'PageView')`

---

## 📚 Recursos

- **Documentação Supabase**: https://supabase.com/docs
- **Next.js App Router**: https://nextjs.org/docs/app
- **Zod Validation**: https://zod.dev
- **Facebook CAPI**: https://developers.facebook.com/docs/marketing-api/conversions-api

---

**Última atualização**: 28/10/2025  
**Versão do template**: 3.0.0  
**Status**: 60% implementado (core pronto, falta scoring + SSR + build)
