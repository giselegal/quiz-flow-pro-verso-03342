# 📊 SISTEMA DE ANALYTICS E RASTREAMENTO DE CLIQUES

## 🎯 COMO OS EVENTOS DE CLIQUES SÃO REGISTRADOS

O sistema possui **múltiplas camadas** para capturar e analisar interações do usuário:

## 📋 ESTRUTURA DAS TABELAS DE ANALYTICS

### 1️⃣ Tabela `quiz_analytics` (Eventos gerais)

```sql
CREATE TABLE quiz_analytics (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  event_type TEXT CHECK (event_type IN (
    'view', 'start', 'complete', 'abandon', 'share'
  )),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2️⃣ Tabela `quiz_attempts` (Tentativas de quiz)

```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES profiles(id),
  answers JSONB DEFAULT '{}',
  score NUMERIC,
  time_taken INTEGER, -- em segundos
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  metadata JSONB DEFAULT '{}'
);
```

### 3️⃣ Tabela `question_responses` (Respostas individuais)

```sql
CREATE TABLE question_responses (
  id UUID PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts(id),
  question_id UUID REFERENCES questions(id),
  answer JSONB NOT NULL,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  time_spent INTEGER, -- em segundos
  answered_at TIMESTAMP DEFAULT NOW()
);
```

## 🖱️ TIPOS DE EVENTOS RASTREADOS

### Eventos do AnalyticsService:

```typescript
export interface AnalyticsEvent {
  quiz_id: string;
  user_id?: string;
  session_id: string;
  event_type:
    | 'quiz_started'
    | 'question_answered'
    | 'quiz_completed'
    | 'page_viewed'
    | 'button_clicked'
    | 'form_submitted';
  event_data: Record<string, any>;
  timestamp: string;
  user_agent?: string;
  ip_address?: string;
  page_url?: string;
}
```

## 📝 EXEMPLOS PRÁTICOS DE REGISTROS

### 🔥 1. Evento: Usuário clica no botão "Começar Quiz"

**Tabela `quiz_analytics`:**

```json
{
  "id": "event_001",
  "quiz_id": "quiz_quest_challenge_v1",
  "event_type": "start",
  "user_id": "user_12345",
  "session_id": "session_2025_abc123",
  "user_agent": "Mozilla/5.0...",
  "metadata": {
    "button_text": "Começar Aventura",
    "page_id": "page_welcome"
  },
  "created_at": "2025-07-25T10:15:30Z"
}
```

**Tabela `quiz_attempts`:**

```json
{
  "id": "attempt_001",
  "quiz_id": "quiz_quest_challenge_v1",
  "user_id": "user_12345",
  "status": "in_progress",
  "started_at": "2025-07-25T10:15:30Z",
  "metadata": {
    "entry_point": "welcome_page",
    "utm_source": "instagram"
  }
}
```

### 🎯 2. Evento: Usuário responde uma pergunta

**Via AnalyticsService:**

```javascript
// No frontend, quando usuário clica em uma opção:
analyticsService.trackQuestionAnswer(
  'quiz_quest_challenge_v1',
  'question_1',
  'mountains', // resposta selecionada
  'user_12345'
);

analyticsService.trackButtonClick(
  'quiz_quest_challenge_v1',
  'option_mountains',
  '🏔️ Montanhas geladas',
  'user_12345'
);
```

**Resultado na tabela `question_responses`:**

```json
{
  "id": "response_001",
  "attempt_id": "attempt_001",
  "question_id": "question_1",
  "answer": {
    "selected_option": "mountains",
    "option_text": "🏔️ Montanhas geladas",
    "points": { "warrior": 2, "mage": 1 }
  },
  "points_earned": 2,
  "time_spent": 15, // segundos para responder
  "answered_at": "2025-07-25T10:16:00Z"
}
```

### 🏆 3. Evento: Usuário completa o quiz

**Tabela `quiz_analytics`:**

```json
{
  "event_type": "complete",
  "metadata": {
    "final_result": "warrior",
    "total_score": 45,
    "time_taken": 300,
    "questions_answered": 20
  }
}
```

**Tabela `quiz_attempts` (atualizada):**

```json
{
  "id": "attempt_001",
  "score": 0.85, // 85% de acerto
  "total_points": 45,
  "time_taken": 300,
  "completed_at": "2025-07-25T10:20:30Z",
  "status": "completed",
  "answers": {
    "question_1": "mountains",
    "question_2": "sword",
    "final_result": "warrior"
  }
}
```

## 📈 CÁLCULOS DE MÉTRICAS E RESULTADOS

### 1️⃣ **Taxa de Conversão por Etapa:**

```sql
-- Funil de conversão das 21 etapas
SELECT
  step_order,
  step_name,
  COUNT(DISTINCT user_id) as users_reached,
  LAG(COUNT(DISTINCT user_id)) OVER (ORDER BY step_order) as previous_step_users,
  (COUNT(DISTINCT user_id)::float /
   LAG(COUNT(DISTINCT user_id)) OVER (ORDER BY step_order)) * 100 as conversion_rate
FROM (
  SELECT
    qa.user_id,
    JSON_EXTRACT_PATH_TEXT(qa.metadata, 'current_step')::int as step_order,
    'Etapa ' || JSON_EXTRACT_PATH_TEXT(qa.metadata, 'current_step') as step_name
  FROM quiz_analytics qa
  WHERE qa.quiz_id = 'quiz_quest_challenge_v1'
  AND qa.event_type = 'view'
) steps
GROUP BY step_order, step_name
ORDER BY step_order;
```

### 2️⃣ **Análise de Abandonos:**

```sql
-- Onde os usuários mais abandonam
SELECT
  JSON_EXTRACT_PATH_TEXT(metadata, 'page_id') as abandon_page,
  COUNT(*) as abandon_count,
  AVG(EXTRACT(EPOCH FROM (created_at - started_at))) as avg_time_before_abandon
FROM quiz_analytics qa
JOIN quiz_attempts qat ON qa.quiz_id = qat.quiz_id AND qa.user_id = qat.user_id
WHERE qa.event_type = 'abandon'
GROUP BY abandon_page
ORDER BY abandon_count DESC;
```

### 3️⃣ **Tempo por Pergunta:**

```sql
-- Tempo médio de resposta por pergunta
SELECT
  qr.question_id,
  AVG(qr.time_spent) as avg_response_time,
  COUNT(*) as total_responses,
  AVG(qr.points_earned) as avg_points
FROM question_responses qr
JOIN quiz_attempts qa ON qr.attempt_id = qa.id
WHERE qa.quiz_id = 'quiz_quest_challenge_v1'
GROUP BY qr.question_id
ORDER BY avg_response_time DESC;
```

### 4️⃣ **Distribuição de Resultados:**

```sql
-- Qual perfil de herói é mais comum
SELECT
  JSON_EXTRACT_PATH_TEXT(answers, 'final_result') as hero_type,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / (SELECT COUNT(*) FROM quiz_attempts WHERE status = 'completed') * 100, 2) as percentage
FROM quiz_attempts
WHERE quiz_id = 'quiz_quest_challenge_v1'
AND status = 'completed'
GROUP BY hero_type
ORDER BY count DESC;
```

### 5️⃣ **Análise de Cliques por Botão:**

```sql
-- Quais botões são mais clicados
SELECT
  JSON_EXTRACT_PATH_TEXT(metadata, 'button_text') as button_text,
  JSON_EXTRACT_PATH_TEXT(metadata, 'page_id') as page_id,
  COUNT(*) as click_count,
  COUNT(DISTINCT user_id) as unique_users
FROM quiz_analytics
WHERE event_type = 'start' -- ou outros eventos de clique
AND quiz_id = 'quiz_quest_challenge_v1'
GROUP BY button_text, page_id
ORDER BY click_count DESC;
```

## 🎯 IMPLEMENTAÇÃO NO CÓDIGO

### Rastreamento automático no editor:

```typescript
// Em SchemaDrivenEditorResponsive.tsx
const handleSave = async () => {
  // Rastrear clique no botão salvar
  await analyticsService.trackButtonClick(funnel?.id || '', 'save_button', 'Salvar Funil');

  // Salvar funil
  await saveFunnel(true);

  // Rastrear sucesso
  await analyticsService.trackEvent({
    quiz_id: funnel?.id || '',
    event_type: 'form_submitted',
    event_data: {
      action: 'funnel_saved',
      pages_count: funnel?.pages?.length || 0,
    },
  });
};
```

### Rastreamento de navegação:

```typescript
// Quando usuário muda de página/etapa
const setCurrentPage = (pageId: string) => {
  setCurrentPageId(pageId);

  // Rastrear visualização da página
  analyticsService.trackPageView(funnel?.id || '', pageId);
};
```

## 📊 DASHBOARD DE MÉTRICAS

O sistema gera automaticamente:

1. **Taxa de Conclusão** = (Completos / Iniciados) × 100
2. **Tempo Médio** = Média de `time_taken` dos completos
3. **Taxa de Abandono** = (Abandonos / Iniciados) × 100
4. **Conversão por Etapa** = Usuários que passaram / Usuários que chegaram
5. **Distribuição de Resultados** = % de cada tipo de resultado
6. **Cliques por Elemento** = Heatmap de interações

## 🔄 FLUXO COMPLETO

1. **Usuário chega** → `quiz_analytics` (event_type: 'view')
2. **Clica "Começar"** → `quiz_analytics` (event_type: 'start') + `quiz_attempts` criado
3. **Responde pergunta** → `question_responses` + `analytics_events` (button_clicked)
4. **Navega páginas** → `analytics_events` (page_viewed)
5. **Completa quiz** → `quiz_attempts` atualizado + `quiz_analytics` (event_type: 'complete')

**Resultado**: Dados granulares para análise profunda de comportamento e otimização do funil!
