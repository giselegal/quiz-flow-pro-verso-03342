
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  📚 GUIA DEFINITIVO - O QUE CADA BLOCO PRECISA              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RESPOSTA DIRETA: O QUE É NECESSÁRIO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para um bloco FUNCIONAR e RENDERIZAR no editor, você precisa de:

1️⃣  COMPONENTE REACT (obrigatório)
    📁 src/components/.../MeuBloco.tsx
    ✅ Arquivo físico que renderiza o bloco
    
2️⃣  REGISTRO NO REGISTRY (obrigatório)
    �� src/registry/UnifiedBlockRegistry.ts
    ✅ Mapeia 'tipo-do-bloco' → Componente React
    
3️⃣  DADOS NO JSON (obrigatório para aparecer no editor)
    📁 public/templates/quiz21-complete.json
    ✅ Define quais blocos aparecem em cada step

❌ NÃO PRECISA:
   - Schema Zod específico (opcional, só para validação forte)
   - JSON separado por bloco (dados ficam no JSON master)
   - HTML estático (componentes renderizam HTML dinamicamente)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 ANATOMIA DE UM BLOCO COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Exemplo: question-hero

┌────────────────────────────────────────────────────────────┐
│ 1️⃣  COMPONENTE REACT                                       │
└────────────────────────────────────────────────────────────┘

📁 src/components/sections/questions/QuestionHeroSection.tsx

```tsx
export const QuestionHeroSection: React.FC<Props> = (props) => {
  return (
    <div className="question-hero">
      <h2>{props.content?.questionText}</h2>
      <span>{props.content?.questionNumber}</span>
    </div>
  );
};
```

✅ Recebe props
✅ Renderiza JSX
✅ Exporta como named export

┌────────────────────────────────────────────────────────────┐
│ 2️⃣  REGISTRO NO REGISTRY                                   │
└────────────────────────────────────────────────────────────┘

📁 src/registry/UnifiedBlockRegistry.ts

```typescript
export const UNIFIED_BLOCK_REGISTRY = {
  'question-hero': () => import('@/components/sections/questions')
    .then(({ QuestionHeroSection }) => ({
      default: QuestionHeroSection
    }))
};
```

✅ Lazy load do componente
✅ Mapeia tipo 'question-hero' → QuestionHeroSection

┌────────────────────────────────────────────────────────────┐
│ 3️⃣  DADOS NO JSON                                          │
└────────────────────────────────────────────────────────────┘

📁 public/templates/quiz21-complete.json

```json
{
  "steps": {
    "step-05": {
      "blocks": [
        {
          "id": "question-hero-05",
          "type": "question-hero",
          "order": 2,
          "properties": {
            "padding": 16
          },
          "content": {
            "questionText": "QUAIS DETALHES VOCÊ GOSTA?",
            "questionNumber": "4 de 10"
          }
        }
      ]
    }
  }
}
```

✅ Define id único
✅ Define type (deve bater com Registry)
✅ Define properties (estáticas)
✅ Define content (dados do bloco)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 FLUXO DE RENDERIZAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TemplateLoader carrega step-05 do JSON
   ↓
2. Encontra bloco { "type": "question-hero", ... }
   ↓
3. UniversalBlockRenderer procura no Registry
   ↓
4. Registry retorna QuestionHeroSection
   ↓
5. Renderiza <QuestionHeroSection {...props} />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TIPOS DE BLOCOS: SIMPLE vs COMPLEX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────────────┐
│ ⚪ SIMPLE (Blocos Simples)                                 │
└────────────────────────────────────────────────────────────┘

Características:
✅ Props estáticas vindas do JSON
✅ Renderização direta (sem lógica complexa)
✅ Sem estado interno pesado
✅ Sem virtualizaçã ou lazy loading interno

Exemplos:
- text
- heading
- image
- button
- question-hero ← ESTE É SIMPLE!

Estrutura de dados:
```json
{
  "type": "text",
  "content": {
    "text": "Meu texto aqui"
  }
}
```

┌────────────────────────────────────────────────────────────┐
│ 🔴 COMPLEX (Blocos Complexos)                              │
└────────────────────────────────────────────────────────────┘

Características:
⚡ Props dinâmicas (processadas em runtime)
⚡ Lógica de estado complexa
⚡ Virtualização de listas grandes
⚡ HTML dinâmico (dangerouslySetInnerHTML)
⚡ Processamento de JSON complexo

Exemplos:
- options-grid (virtualização + JSON de opções)
- quiz-result-display (cálculos + HTML dinâmico)
- offer-section (dados de produto + validações)

Estrutura de dados:
```json
{
  "type": "options-grid",
  "content": {
    "options": [
      {"id": 1, "label": "Opção 1", "score": 10},
      {"id": 2, "label": "Opção 2", "score": 20}
    ],
    "maxSelections": 3,
    "validationRules": { ... }
  }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ RECURSOS OPCIONAIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────────────────────────────────┐
│ 📋 ZOD SCHEMAS (Opcional)                                  │
└────────────────────────────────────────────────────────────┘

Quando usar?
- Validação forte de dados do JSON
- TypeScript safety em props
- Contratos de API com backend

Onde fica?
📁 src/schemas/blocks/question-hero.schema.ts

```typescript
import { z } from 'zod';

export const QuestionHeroSchema = z.object({
  id: z.string(),
  type: z.literal('question-hero'),
  content: z.object({
    questionText: z.string(),
    questionNumber: z.string(),
  }),
});
```

⚠️ NÃO É OBRIGATÓRIO! Muitos blocos não têm.

┌────────────────────────────────────────────────────────────┐
│ 🎨 PROP NORMALIZERS (Opcional)                             │
└────────────────────────────────────────────────────────────┘

Quando usar?
- Transformar dados do JSON em props do componente
- Adicionar valores default
- Compatibilidade com múltiplos formatos

Onde fica?
📁 src/core/adapters/PropNormalizer.ts

```typescript
export function normalizeQuestionHeroProps(block: Block) {
  return {
    questionText: block.content?.questionText || '',
    questionNumber: block.content?.questionNumber || '1 de 10',
    showProgress: block.properties?.showProgress ?? true,
  };
}
```

✅ Usado no Registry para normalizar antes de passar pro componente

┌────────────────────────────────────────────────────────────┐
│ 📄 JSON POR BLOCO (Não Necessário)                        │
└────────────────────────────────────────────────────────────┘

❌ NÃO precisa criar JSON separado para cada bloco!

Dados ficam em:
�� public/templates/quiz21-complete.json

Estrutura:
```json
{
  "steps": {
    "step-01": { "blocks": [...] },
    "step-02": { "blocks": [...] },
    ...
  }
}
```

Todos os blocos de todos os steps em UM único JSON master!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CHECKLIST PARA CRIAR UM NOVO BLOCO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para criar 'meu-bloco-novo':

☑️  1. Criar componente React
    �� src/components/sections/meu-bloco/MeuBloco.tsx
    
☑️  2. Registrar no Registry
    📁 src/registry/UnifiedBlockRegistry.ts
    Adicionar: 'meu-bloco-novo': () => import(...)

☑️  3. Adicionar dados no JSON
    📁 public/templates/quiz21-complete.json
    Adicionar bloco com type: 'meu-bloco-novo'

☑️  4. (Opcional) Criar PropNormalizer
    📁 src/core/adapters/PropNormalizer.ts
    
☑️  5. (Opcional) Criar Schema Zod
    📁 src/schemas/blocks/meu-bloco.schema.ts

☑️  6. Rebuild templates
    $ npm run build:templates

☑️  7. Testar no editor
    http://localhost:8080/editor?resource=quiz21StepsComplete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 PROBLEMAS COMUNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ "Bloco não renderiza"
   → Verifique se está no Registry
   → Verifique se o type no JSON bate com o Registry
   → Veja console por erros de import

❌ "Props undefined"
   → Verifique estrutura do JSON (content vs properties)
   → Use PropNormalizer para adicionar defaults
   → Veja console.log das props recebidas

❌ "Bloco não aparece no step"
   → Bloco não está no JSON daquele step
   → JSON não foi carregado (problema de TemplateLoader)
   → Step está sendo carregado do Supabase (não do JSON)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EXEMPLO COMPLETO: question-hero
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ COMPONENTE EXISTE:
   src/components/sections/questions/QuestionHeroSection.tsx

✅ REGISTRADO:
   src/registry/UnifiedBlockRegistry.ts
   'question-hero': () => Promise.all([...])

✅ NORMALIZER EXISTE:
   src/core/adapters/PropNormalizer.ts
   normalizeQuestionHeroProps()

✅ DADOS NO JSON:
   public/templates/quiz21-complete.json
   step-05 → blocks → { type: 'question-hero', ... }

❌ SCHEMA ZOD: Não tem (não é necessário)
❌ JSON SEPARADO: Não tem (dados no master)
❌ HTML ESTÁTICO: Não tem (JSX dinâmico)

CLASSIFICAÇÃO: SIMPLE
- Props estáticas do JSON
- Sem lógica complexa
- Renderização direta

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RESUMO FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBRIGATÓRIO (3 coisas):
1. Componente React (.tsx)
2. Registro no Registry
3. Dados no JSON master

OPCIONAL:
- Schema Zod (validação)
- PropNormalizer (transformação)
- TypeScript types (segurança)

NÃO PRECISA:
- JSON por bloco
- HTML estático
- Schema SQL
- API endpoints

╔══════════════════════════════════════════════════════════════╗
║  ✅ É ISSO! Não é mais complicado que isso.                 ║
║  ✅ Cada bloco = Componente + Registry + JSON               ║
║  ✅ Resto é opcional para melhorar qualidade                ║
╚══════════════════════════════════════════════════════════════╝

