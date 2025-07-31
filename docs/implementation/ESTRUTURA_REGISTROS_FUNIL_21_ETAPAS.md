# 📊 COMO O FUNIL DE 21 ETAPAS SERÁ REGISTRADO NO BANCO

## 🎯 DESCOBERTA IMPORTANTE

Existem **DUAS estruturas diferentes** no banco:

1. **Tabela `quizzes`** (original do sistema de quiz)
2. **Tabelas `funnels` + `funnel_pages`** (nova estrutura para funis)

O serviço está tentando usar `quizzes` (que existe), mas a estrutura correta para funis é `funnels` + `funnel_pages`.

## 📋 ESTRUTURA 1: Tabela `quizzes` (Atual/Incorreta para Funis)

### Campos da tabela `quizzes`:
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id),
  category TEXT DEFAULT 'geral',
  difficulty TEXT DEFAULT 'medium',
  is_published BOOLEAN DEFAULT false,
  settings JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### ❌ Como o serviço está tentando salvar (INCORRETO):
```json
{
  "id": "funnel_abc123",
  "title": "Quiz Quest Challenge - 21 Etapas", 
  "description": "Funil interativo com 21 etapas",
  "category": "geral",
  "difficulty": "medium",
  "data": {
    "funnel": { /* todo o objeto funnel */ },
    "pages": [ /* array com 21 páginas */ ],
    "config": { /* configurações */ }
  },
  "is_published": false
}
```

**Problema**: As 21 etapas ficam em um campo JSON gigante, perdendo estrutura relacional.

## 🗄️ ESTRUTURA 2: Tabelas `funnels` + `funnel_pages` (Correta)

### Tabela `funnels` (Dados principais):
```sql
CREATE TABLE funnels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela `funnel_pages` (21 Etapas separadas):
```sql
CREATE TABLE funnel_pages (
  id TEXT PRIMARY KEY,
  funnel_id TEXT REFERENCES funnels(id),
  page_type TEXT NOT NULL,
  page_order INTEGER NOT NULL,
  title TEXT,
  blocks JSONB DEFAULT '[]',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 📝 EXEMPLO PRÁTICO: Quiz Quest Challenge com 21 Etapas

### 1️⃣ Registro na tabela `funnels`:
```json
{
  "id": "quiz_quest_challenge_v1",
  "name": "Quiz Quest Challenge - 21 Etapas",
  "description": "Funil interativo para descobrir o perfil do usuário",
  "user_id": "user_12345",
  "is_published": false,
  "version": 1,
  "settings": {
    "theme": "quiz-quest",
    "analytics": true,
    "autoSave": false,
    "showProgressBar": true,
    "allowBack": true
  },
  "created_at": "2025-07-25T10:00:00Z",
  "updated_at": "2025-07-25T10:00:00Z"
}
```

### 2️⃣ Registros na tabela `funnel_pages` (21 registros):

#### Etapa 1 - Boas-vindas:
```json
{
  "id": "page_welcome",
  "funnel_id": "quiz_quest_challenge_v1",
  "page_type": "intro",
  "page_order": 1,
  "title": "Bem-vindo ao Quiz Quest Challenge!",
  "blocks": [
    {
      "id": "block_title_1",
      "type": "title",
      "content": "Descubra seu perfil de herói!",
      "style": { "fontSize": "2xl", "color": "primary" }
    },
    {
      "id": "block_text_1", 
      "type": "text",
      "content": "Responda 20 perguntas e descubra qual tipo de herói você seria em uma aventura épica."
    },
    {
      "id": "block_button_1",
      "type": "button", 
      "text": "Começar Aventura",
      "action": "next_page"
    }
  ],
  "metadata": {
    "backgroundColor": "#1a365d",
    "textColor": "#ffffff"
  }
}
```

#### Etapa 2 - Primeira Pergunta:
```json
{
  "id": "page_q1",
  "funnel_id": "quiz_quest_challenge_v1", 
  "page_type": "question",
  "page_order": 2,
  "title": "Qual ambiente você prefere?",
  "blocks": [
    {
      "id": "block_question_1",
      "type": "question",
      "content": "Em qual ambiente você se sente mais à vontade para uma aventura?",
      "questionType": "single_choice"
    },
    {
      "id": "block_options_1",
      "type": "options",
      "options": [
        { "id": "opt1", "text": "🏔️ Montanhas geladas", "value": "mountains", "points": { "warrior": 2, "mage": 1 } },
        { "id": "opt2", "text": "🌊 Oceanos profundos", "value": "ocean", "points": { "explorer": 2, "healer": 1 } },
        { "id": "opt3", "text": "🌲 Florestas místicas", "value": "forest", "points": { "ranger": 2, "druid": 2 } },
        { "id": "opt4", "text": "🏜️ Desertos áridos", "value": "desert", "points": { "nomad": 2, "warrior": 1 } }
      ]
    }
  ],
  "metadata": {
    "scoring": {
      "type": "points",
      "categories": ["warrior", "mage", "explorer", "healer", "ranger", "druid", "nomad"]
    }
  }
}
```

#### Etapa 3-20 - Perguntas do Quiz:
```json
{
  "id": "page_q2",
  "funnel_id": "quiz_quest_challenge_v1",
  "page_type": "question", 
  "page_order": 3,
  "title": "Qual sua arma preferida?",
  "blocks": [
    {
      "id": "block_question_2",
      "type": "question",
      "content": "Se você fosse um herói, qual arma escolheria?",
      "questionType": "single_choice"
    },
    {
      "id": "block_options_2", 
      "type": "options",
      "options": [
        { "id": "opt1", "text": "⚔️ Espada longa", "value": "sword", "points": { "warrior": 3 } },
        { "id": "opt2", "text": "🏹 Arco élfico", "value": "bow", "points": { "ranger": 3 } },
        { "id": "opt3", "text": "🔮 Cajado mágico", "value": "staff", "points": { "mage": 3 } },
        { "id": "opt4", "text": "🛡️ Escudo protetor", "value": "shield", "points": { "healer": 3 } }
      ]
    }
  ]
}
```

#### Etapa 21 - Resultado:
```json
{
  "id": "page_result",
  "funnel_id": "quiz_quest_challenge_v1",
  "page_type": "result",
  "page_order": 21,
  "title": "Seu Perfil de Herói!",
  "blocks": [
    {
      "id": "block_result_title",
      "type": "title",
      "content": "🎉 Descobrimos seu perfil!"
    },
    {
      "id": "block_result_display",
      "type": "result_calculator",
      "resultLogic": {
        "type": "highest_score",
        "profiles": {
          "warrior": {
            "title": "⚔️ Guerreiro Corajoso",
            "description": "Você é brave e determinado, sempre pronto para enfrentar qualquer desafio de frente!",
            "image": "/images/warrior.png"
          },
          "mage": {
            "title": "🔮 Mago Sábio", 
            "description": "Sua inteligência e conhecimento místico fazem de você um poderoso aliado!",
            "image": "/images/mage.png"
          },
          "ranger": {
            "title": "🏹 Arqueiro Ágil",
            "description": "Sua precisão e conexão com a natureza são incomparáveis!",
            "image": "/images/ranger.png"
          }
        }
      }
    },
    {
      "id": "block_cta",
      "type": "button",
      "text": "Compartilhar Resultado",
      "action": "share"
    }
  ]
}
```

## 📊 COMPARAÇÃO DOS MÉTODOS

### ❌ Método Atual (quizzes - JSON único):
- **Vantagem**: Simples, 1 tabela
- **Desvantagens**: 
  - JSON gigante difícil de consultar
  - Sem relações estruturadas
  - Difícil buscar etapas específicas
  - Performance ruim para grandes funis

### ✅ Método Correto (funnels + funnel_pages):
- **Vantagens**:
  - Estrutura relacional limpa
  - Fácil consultar etapas específicas
  - Performance otimizada
  - Flexibilidade para crescer
  - Índices eficientes
- **Desvantagem**: Mais complexo (2 tabelas)

## 🎯 RESUMO

**Para salvar o funil de 21 etapas corretamente:**

1. **1 registro** na tabela `funnels` (dados principais)
2. **21 registros** na tabela `funnel_pages` (uma para cada etapa)
3. **Relação**: `funnel_pages.funnel_id` → `funnels.id`

**Estado atual**: Tentando salvar tudo em 1 registro JSON na tabela `quizzes`
**Estado desejado**: Estrutura normalizada com dados relacionais adequados
