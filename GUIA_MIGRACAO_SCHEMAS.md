# 🔄 GUIA DE MIGRAÇÃO - Sistema Modular de Schemas

## 📋 Visão Geral

Este guia explica como migrar schemas legados para o novo sistema modular, mantendo compatibilidade total.

---

## 🎯 Status Atual

### ✅ Implementado
- Sistema modular completo em `/src/config/schemas/`
- 40+ presets reutilizáveis
- Lazy loading com SchemaAPI
- Builder pattern fluente
- Adapter para backward compatibility
- 5 schemas modernos criados:
  - `headline` - Título com subtítulo
  - `image` - Imagem com legenda
  - `button` - Botão/CTA completo
  - `options-grid` - Grid de opções (com requiredSelections)
  - `urgency-timer-inline` - Timer de urgência (com initialMinutes)

### ⚠️ Pendente de Migração
Schemas ainda no sistema legado (`blockSchema.ts`):
- `heading`
- `text`
- `divider`
- `spacer`
- `quiz-question`
- `transition`
- `result-headline`
- `result-secondary-list`
- `result-description`
- `offer-core`
- `offer-urgency`
- `checkout-button`
- E outros...

---

## 🚀 Como Migrar um Schema

### Passo 1: Identificar Schema Legado

Localizar schema em `/src/components/editor/quiz/schema/blockSchema.ts`:

```typescript
{
    type: 'heading',
    groups: [
        { id: 'content', label: 'Conteúdo', order: 1 },
        { id: 'style', label: 'Estilo', order: 2 }
    ],
    properties: [
        { key: 'text', label: 'Texto', type: 'string', required: true, default: 'Novo Título', group: 'content' },
        { key: 'level', label: 'Nível', type: 'number', default: 2, min: 1, max: 6, group: 'style' },
        { key: 'textAlign', label: 'Alinhamento', type: 'select', enumValues: ['left', 'center', 'right'], default: 'center', group: 'style' },
        { key: 'color', label: 'Cor', type: 'color', default: '#432818', group: 'style' },
        { key: 'fontSize', label: 'Tamanho Fonte', type: 'string', default: '24px', group: 'style' }
    ]
}
```

### Passo 2: Criar Arquivo Modular

Criar `/src/config/schemas/blocks/heading.ts`:

```typescript
/**
 * 📝 SCHEMA: HEADING
 * 
 * Bloco de título/heading (h1-h6)
 */

import { templates } from '../base/builder';
import { textField, alignmentField, colorFields, fontSizeField } from '../base/presets';
import { BlockFieldSchema } from '../base/types';

// Campo customizado para nível do heading
const levelField: BlockFieldSchema<number> = {
  key: 'level',
  label: 'Nível',
  type: 'number',
  group: 'style',
  min: 1,
  max: 6,
  default: 2,
  description: 'Nível do título (h1-h6)',
};

// Campo para permitir HTML
const allowHtmlField: BlockFieldSchema<boolean> = {
  key: 'allowHtml',
  label: 'Permitir HTML',
  type: 'boolean',
  group: 'content',
  default: false,
  description: 'Habilita interpretação de spans estilizadas (sanitizado)',
};

export const headingSchema = templates
  .full('heading', 'Título')
  .description('Bloco de título com níveis h1-h6')
  .category('content')
  .icon('Type')
  .addFields(
    textField('content'),
    allowHtmlField
  )
  .addFields(
    levelField,
    alignmentField('style'),
    ...colorFields('style'),
    fontSizeField('style')
  )
  .version('2.0.0')
  .build();
```

### Passo 3: Registrar no Sistema

Adicionar em `/src/config/schemas/dynamic.ts`:

```typescript
registerSchema('heading', () => 
  import('./blocks/heading').then(m => m.headingSchema)
);
```

### Passo 4: Exportar (Opcional)

Adicionar em `/src/config/schemas/index.ts`:

```typescript
export { headingSchema } from './blocks/heading';
```

### Passo 5: Remover do Legado (Futuro)

Após validar funcionamento, remover entrada de `INITIAL_BLOCK_SCHEMAS` em `blockSchema.ts`.

---

## 🎨 Mapeamento de Presets

### Campos Comuns

| Legado | Preset |
|--------|--------|
| `{ key: 'title', label: 'Título', type: 'string' }` | `titleField('content')` |
| `{ key: 'subtitle', label: 'Subtítulo', type: 'string' }` | `subtitleField('content')` |
| `{ key: 'description', label: 'Descrição', type: 'richtext' }` | `descriptionField('content')` |
| `{ key: 'text', label: 'Texto', type: 'string' }` | `textField('content')` |
| `{ key: 'imageUrl', label: 'URL da Imagem', type: 'string' }` | `imageUrlField('content')` |
| `{ key: 'backgroundColor', label: 'Fundo', type: 'color' }` | `backgroundColorField('style')` |
| `{ key: 'textColor', label: 'Cor do Texto', type: 'color' }` | `textColorField('style')` |
| `{ key: 'alignment', label: 'Alinhamento', type: 'select' }` | `alignmentField('layout')` |
| `{ key: 'padding', label: 'Espaçamento Interno', type: 'number' }` | `paddingField('layout')` |
| `{ key: 'fontSize', label: 'Tamanho da Fonte', type: 'number' }` | `fontSizeField('style')` |

### Conjuntos de Campos

| Legado | Preset |
|--------|--------|
| Multiple color fields | `...colorFields('style')` |
| Multiple spacing fields | `...spacingFields('layout')` |
| Multiple image fields | `...imageFields('content')` |
| Multiple button fields | `...buttonFields('content')` |
| Multiple typography fields | `...typographyFields('style')` |

---

## 🔧 Campos Customizados

### Quando Criar Campo Customizado

1. **Campo não tem preset correspondente**
2. **Campo tem lógica de validação específica**
3. **Campo tem valores enum específicos do domínio**

### Exemplo: Campo com Validação

```typescript
const scoreField: BlockFieldSchema<number> = {
  key: 'score',
  label: 'Pontuação',
  type: 'number',
  group: 'logic',
  min: 0,
  max: 100,
  default: 0,
  validate: (value) => {
    if (value < 0) return 'Pontuação não pode ser negativa';
    if (value > 100) return 'Pontuação máxima é 100';
    return null;
  },
  description: 'Pontuação da opção (0-100)',
};
```

### Exemplo: Campo com Condição

```typescript
const maxSelectionsField: BlockFieldSchema<number> = {
  key: 'maxSelections',
  label: 'Máximo de Seleções',
  type: 'number',
  group: 'logic',
  min: 1,
  max: 10,
  when: (values) => values.multipleSelect === true,
  description: 'Número máximo de opções que podem ser selecionadas',
};
```

---

## 📊 Checklist de Migração

Para cada schema migrado:

- [ ] Criar arquivo em `/src/config/schemas/blocks/`
- [ ] Usar presets quando possível
- [ ] Definir campos customizados necessários
- [ ] Adicionar validações se necessário
- [ ] Registrar em `dynamic.ts`
- [ ] Exportar em `index.ts` (opcional)
- [ ] Testar carregamento com `SchemaAPI.get()`
- [ ] Verificar campos no editor
- [ ] Documentar campos especiais no README
- [ ] Validar com testes

---

## 🧪 Como Testar

### Teste Manual no Console

```typescript
// No DevTools console
import { SchemaAPI } from '@/config/schemas';

// Carregar schema
const schema = await SchemaAPI.get('your-block-type');
console.log(schema);

// Verificar estrutura
console.log('Properties:', schema.properties);
console.log('Groups:', schema.groups);

// Listar campos
schema.properties.forEach(p => {
  console.log(`${p.key} (${p.type}) - ${p.label}`);
});
```

### Teste no Editor

1. Abrir editor de quiz
2. Adicionar bloco do tipo migrado
3. Selecionar bloco
4. Verificar painel de propriedades à direita
5. Testar edição de cada campo
6. Verificar validações

### Teste Automatizado

```typescript
describe('Schema: heading', () => {
  it('deve ter todos os campos necessários', async () => {
    const schema = await SchemaAPI.get('heading');
    const keys = schema?.properties.map(p => p.key) || [];
    
    expect(keys).toContain('text');
    expect(keys).toContain('level');
    expect(keys).toContain('textAlign');
    expect(keys).toContain('color');
  });
});
```

---

## 🎯 Priorização de Migração

### Alta Prioridade (Blocos mais usados)
1. ✅ `heading` → migrar próximo
2. `text` - Texto simples
3. `button` - ✅ JÁ MIGRADO
4. `image` - ✅ JÁ MIGRADO
5. `options-grid` - ✅ JÁ MIGRADO

### Média Prioridade
6. `divider` - Divisor visual
7. `spacer` - Espaçamento
8. `quiz-question` - Pergunta de quiz
9. `transition` - Transição entre steps
10. `urgency-timer-inline` - ✅ JÁ MIGRADO

### Baixa Prioridade
11. `result-headline` - Título de resultado
12. `result-secondary-list` - Lista secundária
13. `result-description` - Descrição de resultado
14. `offer-core` - Oferta principal
15. `offer-urgency` - Urgência da oferta
16. `checkout-button` - Botão de checkout

---

## 🔄 Compatibilidade Durante Migração

O sistema **mantém compatibilidade total** durante a migração:

1. **Código legado funciona normalmente**
2. **Novos schemas são priorizados automaticamente**
3. **Fallback para legado se novo não existir**
4. **Sem breaking changes**

### Ordem de Prioridade

```
getBlockSchema('my-block')
  ↓
Tenta novo sistema (SchemaAPI)
  ↓ (não encontrado)
Fallback para legado (blockSchemaMap)
  ↓ (não encontrado)
Retorna undefined
```

---

## 🐛 Troubleshooting

### Schema não aparece no editor

**Verificar:**
```typescript
// 1. Schema está registrado?
SchemaAPI.has('my-block'); // deve ser true

// 2. Schema carrega?
const schema = await SchemaAPI.get('my-block');
console.log(schema); // deve ter dados

// 3. Campos estão corretos?
console.log(schema.properties);
```

### Campos não aparecem no painel

**Verificar:**
- Group IDs estão corretos?
- Campos têm `group` definido?
- Groups estão registrados no schema?

### Validação não funciona

**Verificar:**
- Função `validate` retorna string ou null?
- Validação está no campo correto?
- Valores estão sendo passados corretamente?

---

## 📚 Recursos

### Documentação
- `/src/config/schemas/README.md` - Documentação completa
- `/src/config/schemas/base/presets.ts` - Lista de presets
- `/src/config/schemas/base/types.ts` - Definições de tipos

### Exemplos
- `/src/config/schemas/blocks/headline.ts` - Exemplo básico
- `/src/config/schemas/blocks/button.ts` - Exemplo com variantes
- `/src/config/schemas/blocks/options-grid.ts` - Exemplo complexo

### Testes
- `/src/__tests__/schemas.modular-system.test.ts` - Testes do sistema

---

## ✅ Conclusão

A migração para o sistema modular traz:

- ✅ **Manutenibilidade**: Código organizado e fácil de manter
- ✅ **Performance**: Lazy loading reduz bundle size
- ✅ **DRY**: Presets eliminam duplicação
- ✅ **Type-Safety**: TypeScript com generics
- ✅ **Escalabilidade**: Fácil adicionar novos schemas
- ✅ **Compatibilidade**: Zero breaking changes

**A migração pode ser feita gradualmente, um schema por vez, sem afetar o sistema existente.**

---

**Última atualização:** 2024  
**Versão:** 2.0.0  
**Status:** ✅ Produção Ready
