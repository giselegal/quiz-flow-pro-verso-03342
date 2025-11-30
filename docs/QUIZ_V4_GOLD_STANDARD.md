# 🏆 Quiz Template V4 - Gold Standard

## 📖 Visão Geral

Este é o template **Gold Standard** do Quiz de Estilo Pessoal, 100% validado conforme o schema Zod V4. Serve como referência para:

- ✅ Desenvolvimento de novos templates
- ✅ Validação de estrutura JSON
- ✅ Testes automatizados
- ✅ Documentação de melhores práticas

## ✨ Características

### ✅ Validação 100% Completa

- **Sem placeholders** - Todos os tokens `{{...}}` foram resolvidos
- **Formato ISO 8601** - Datas em formato completo
- **Cores hex válidas** - Todos os valores de cor no formato `#RRGGBB`
- **Schema Zod** - Passa em todas as validações do `QuizSchemaZ`

### 📊 Estrutura

```json
{
  "version": "4.0.0",
  "schemaVersion": "1.0",
  "metadata": { ... },
  "theme": { ... },
  "settings": { ... },
  "steps": [ ... 21 steps ],
  "results": { ... },
  "blockLibrary": { ... }
}
```

### 🎯 Métricas

| Métrica | Valor |
|---------|-------|
| Tamanho | 94.87 KB |
| Steps | 21 |
| Blocos totais | 103 |
| Tipos de blocos | 25 |
| Placeholders | 0 |

## 🚀 Como Foi Criado

Este arquivo foi gerado automaticamente pelo script `fix-quiz21-v4-placeholders.js`:

```bash
npm run fix-v4-placeholders
```

### Correções Aplicadas

1. **Metadata**
   - ✅ `createdAt`: `"2025-01-13"` → `"2025-01-13T00:00:00.000Z"`

2. **Theme**
   - ✅ `{{theme.colors.primary}}` → `#B89B7A`
   - ✅ `{{theme.colors.secondary}}` → `#432818`
   - ✅ 30+ substituições de placeholders

3. **Assets**
   - ✅ `{{asset.logo}}` → URL Cloudinary completa

4. **Validation**
   - ✅ Convertido `required: ["selectedOptions"]` para estrutura correta
   - ✅ 17 steps corrigidos

5. **Blocks**
   - ✅ Adicionado `content: {}` em blocos sem content

## 🛠️ Validação

### Script Rápido

```bash
node scripts/validate-quiz21-v4-gold.js
```

### Testes Automatizados

```bash
npm run test -- quiz21-v4-gold
```

## 📚 Referências

### Arquivos Relacionados

- **Template original**: `public/templates/quiz21-v4.json`
- **Script de correção**: `scripts/fix-quiz21-v4-placeholders.js`
- **Validador**: `scripts/validate-quiz21-v4-gold.js`
- **Testes**: `src/templates/__tests__/quiz21-v4-gold.test.ts`
- **Tokens**: `src/config/themeTokens.ts`

### Schema Zod

O template é validado contra:
- `src/schemas/quiz-schema.zod.ts`
- Função: `validateQuizSchema()`

## 🎨 Theme Tokens

Todos os tokens foram resolvidos para valores reais:

```typescript
{
  primary: '#B89B7A',
  primaryHover: '#A68B6A',
  primaryLight: '#F3E8D3',
  secondary: '#432818',
  background: '#FAF9F7',
  text: '#1F2937',
  border: '#E5E7EB'
}
```

Veja `src/config/themeTokens.ts` para a lista completa.

## 🔄 Regeneração

Para regenerar o arquivo gold standard a partir do template V4 atual:

```bash
# 1. Fazer alterações em quiz21-v4.json
# 2. Executar script de correção
node scripts/fix-quiz21-v4-placeholders.js

# 3. Validar resultado
node scripts/validate-quiz21-v4-gold.js

# 4. Executar testes
npm run test -- quiz21-v4-gold
```

## 📋 Checklist de Qualidade

- [x] Version format `X.Y.Z`
- [x] SchemaVersion format `X.Y`
- [x] Metadata com ID, name, description
- [x] CreatedAt/updatedAt em ISO 8601 completo
- [x] Theme colors sem placeholders
- [x] Todos os steps com ID `step-XX`
- [x] Todos os blocks com `content: {}`
- [x] Validation.required como boolean
- [x] Navigation.nextStep como string ou null
- [x] Block types válidos
- [x] Sem placeholders `{{...}}`

## 🎯 Uso Recomendado

### Como Template Base

```typescript
import goldTemplate from '@/../public/templates/quiz21-v4-gold.json';

// Usar como base para novos quizzes
const newQuiz = {
  ...goldTemplate,
  metadata: {
    ...goldTemplate.metadata,
    id: 'my-new-quiz',
    name: 'Meu Novo Quiz'
  }
};
```

### Como Referência de Validação

```typescript
import { validateQuizSchema } from '@/schemas/quiz-schema.zod';
import goldTemplate from '@/../public/templates/quiz21-v4-gold.json';

// Garantir que novos templates seguem o padrão
const result = validateQuizSchema(myTemplate);
if (!result.success) {
  console.error('Template não segue o padrão gold');
}
```

## 🐛 Solução de Problemas

### Erro: "Placeholders encontrados"

Execute o script de correção:
```bash
node scripts/fix-quiz21-v4-placeholders.js
```

### Erro: "validation.required is array"

Estrutura correta:
```json
{
  "validation": {
    "required": true,
    "rules": {
      "selectedOptions": {
        "minItems": 1,
        "errorMessage": "Selecione uma opção"
      }
    }
  }
}
```

### Erro: "createdAt format invalid"

Usar ISO 8601 completo:
```json
{
  "createdAt": "2025-01-13T00:00:00.000Z"
}
```

## 📈 Histórico de Versões

### v4.0.0 (2025-11-30)
- ✅ Criação do gold standard
- ✅ Remoção de todos os placeholders
- ✅ Validação 100% Zod completa
- ✅ Documentação e testes

## 🤝 Contribuindo

Ao fazer alterações no template:

1. Edite `quiz21-v4.json`
2. Execute script de correção
3. Valide com Zod
4. Atualize testes se necessário
5. Commit com mensagem descritiva

## 📝 Licença

Propriedade do Quiz Flow Pro - Uso interno.

---

**Última atualização**: 30 de novembro de 2025  
**Versão do Schema**: 1.0  
**Status**: ✅ Produção
