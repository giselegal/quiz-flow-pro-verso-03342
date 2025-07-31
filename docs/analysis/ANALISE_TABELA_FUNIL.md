# 🗄️ ESTRUTURA DA TABELA DE FUNIS

## Problema Encontrado
O serviço `schemaDrivenFunnelService.ts` está tentando salvar na tabela `quizzes` que **NÃO EXISTE** no schema do Supabase.

## Estrutura Correta do Banco de Dados

### 1. Tabela `funnels` (Principal)
```sql
CREATE TABLE funnels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,
  settings JSONB,
  user_id TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único do funil
- `name`: Nome do funil
- `description`: Descrição opcional
- `is_published`: Se o funil está publicado
- `settings`: Configurações gerais (JSON)
- `user_id`: ID do usuário proprietário
- `version`: Versão do funil
- `created_at/updated_at`: Timestamps

### 2. Tabela `funnel_pages` (Etapas/Páginas)
```sql
CREATE TABLE funnel_pages (
  id TEXT PRIMARY KEY,
  funnel_id TEXT REFERENCES funnels(id),
  title TEXT,
  page_type TEXT NOT NULL,
  page_order INTEGER NOT NULL,
  blocks JSONB DEFAULT '[]',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Campos:**
- `id`: Identificador único da página
- `funnel_id`: Referência ao funil (FK)
- `title`: Título da página/etapa
- `page_type`: Tipo da página (question, result, etc.)
- `page_order`: Ordem da página (1-21)
- `blocks`: Array de blocos/componentes (JSON)
- `metadata`: Metadados adicionais (JSON)

## Como o Funil com 21 Etapas Deve Ser Salvo

### Estrutura de Salvamento:
1. **Funil Principal** → tabela `funnels`
2. **21 Etapas** → 21 registros na tabela `funnel_pages`

### Exemplo de Dados:

**Tabela `funnels`:**
```json
{
  "id": "funnel_123",
  "name": "Quiz Quest Challenge - 21 Etapas",
  "description": "Funil com 21 etapas interativas",
  "is_published": false,
  "settings": {
    "theme": "default",
    "analytics": true,
    "autoSave": false
  },
  "version": 1
}
```

**Tabela `funnel_pages` (exemplo das primeiras etapas):**
```json
[
  {
    "id": "page_1",
    "funnel_id": "funnel_123",
    "title": "Boas-vindas",
    "page_type": "intro",
    "page_order": 1,
    "blocks": [
      {"type": "title", "content": "Bem-vindo ao Quiz!"},
      {"type": "button", "text": "Começar"}
    ]
  },
  {
    "id": "page_2", 
    "funnel_id": "funnel_123",
    "title": "Primeira Pergunta",
    "page_type": "question",
    "page_order": 2,
    "blocks": [
      {"type": "question", "text": "Qual sua idade?"},
      {"type": "options", "options": ["18-25", "26-35", "36+"]}
    ]
  }
  // ... até page_21
]
```

## Correção Necessária

O arquivo `src/services/schemaDrivenFunnelService.ts` precisa ser corrigido para:
1. Usar tabela `funnels` em vez de `quizzes`
2. Salvar as páginas na tabela `funnel_pages` 
3. Manter a relação entre funil e páginas via `funnel_id`

## Status
❌ **ERRO CRÍTICO**: Serviço salvando na tabela errada
✅ **SOLUÇÃO**: Corrigir o serviço para usar as tabelas corretas
