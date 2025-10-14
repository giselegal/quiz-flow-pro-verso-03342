# 🔍 Análise: Painel de Propriedades Não Carrega Imagens/Pontuação/Categoria

## 📋 Problema Relatado

**Comportamento**:
- ✅ Título e textos das questões/opções: **Carregam corretamente**
- ❌ Pontuação (points): **NÃO carrega**
- ❌ Categoria (category): **NÃO carrega**  
- ❌ Imagens (imageUrl): **NÃO carregam**

## 🔬 Investigação Realizada

### 1. Template TEM os Dados ✅

Verificado em `/src/templates/quiz21StepsComplete.ts`:

```typescript
"options": [
  {
    "id": "2a",
    "text": "Vestidos fluidos e confortáveis",
    "imageUrl": "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
    "value": "2a",
    "category": "Natural",
    "points": 1
  },
  // ... mais opções
]
```

✅ **Confirmado**: Template contém `imageUrl`, `category` e `points`

### 2. Código de Carregamento ESTÁ CORRETO ✅

Verificado em `QuizModularProductionEditor.tsx` (linha 686):

```typescript
push({
    type: 'quiz-options',
    content: { options: quizStep.options || [] },  // ✅ CORRETO
    properties: { /* ... */ }
});
```

✅ **Confirmado**: Options são colocadas em `content` (local correto)

### 3. PropertiesPanel Faz Merge CORRETO ✅

Verificado em `PropertiesPanel.tsx` (linha 146):

```typescript
<DynamicPropertiesForm
    type={selectedBlock.type}
    values={{ ...selectedBlock.properties, ...selectedBlock.content }}  // ✅ Merge correto
    onChange={(patch) => onBlockPatch(patch)}
/>
```

✅ **Confirmado**: Merge de properties + content está implementado

### 4. DynamicPropertiesForm Renderiza Campos ✅

Verificado em `DynamicPropertiesForm.tsx` (linhas 130-220):

```typescript
if (prop.type === 'options-list') {
    const arr = Array.isArray(value) ? value : [];
    return (
        <div className="space-y-2">
            {arr.map((item: any, idx: number) => (
                <div>
                    {/* Texto da opção */}
                    <Input value={item.text || ''} {...} />
                    
                    {/* Upload de imagem com preview */}
                    <ImageUploadField value={item.imageUrl || ''} {...} />  // ✅
                    
                    {/* Pontuação e Categoria */}
                    <Input value={item.points ?? item.score ?? ''} {...} />  // ✅
                    <Input value={item.category || ''} {...} />              // ✅
                </div>
            ))}
        </div>
    );
}
```

✅ **Confirmado**: Campos estão implementados e leem `item.imageUrl`, `item.points`, `item.category`

## 🤔 Hipóteses do Problema

### Hipótese 1: Dados Não Vêm do Supabase ⚠️
**Possível causa**: Template local tem dados, mas funnel salvo no Supabase NÃO tem

**Como verificar**:
```sql
SELECT id, name, steps FROM quiz_funnel_drafts WHERE id = 'seu-funnel-id';
```

**Verificar**: Se `steps[].blocks[].content.options[]` tem `imageUrl`, `points`, `category`

### Hipótese 2: Formato Diferente entre Template e Banco ⚠️
**Possível causa**: Template usa `options-grid`, banco salva como `quiz-options`

**Template usa**:
```typescript
{
  "type": "options-grid",  // ❓ Tipo diferente
  "content": {
    "options": [...]
  }
}
```

**Editor espera**:
```typescript
{
  "type": "quiz-options",  // ❓ Tipo diferente
  "content": {
    "options": [...]
  }
}
```

### Hipótese 3: Conversão Legacy Perde Dados ⚠️
**Possível causa**: Ao converter template antigo para novo formato, campos são perdidos

**Código suspeito** (linha 688-692):
```typescript
push({
    type: 'quiz-options',
    content: { options: quizStep.options || [] },  // ✅ Parece OK
    properties: {
        question: quizStep.questionText,
        // ... configurações
    }
});
```

**Mas**: `quizStep.options` pode vir de onde? Do template antigo?

### Hipótese 4: Options Vazias ao Criar Novo ⚠️
**Possível causa**: Ao criar novo bloco da biblioteca, options são criadas vazias

**Verificar**: COMPONENT_LIBRARY (linha 335-377) - JÁ CORRIGIDO com valores padrão

## 🧪 Testes de Diagnóstico

### Teste 1: Ver Logs no Console ✅ IMPLEMENTADO

Adicionados logs de debug em:
1. `PropertiesPanel.tsx`:
   ```typescript
   console.log('🔍 PropertiesPanel - selectedBlock:', selectedBlock);
   console.log('🔍 PropertiesPanel - properties:', selectedBlock.properties);
   console.log('🔍 PropertiesPanel - content:', selectedBlock.content);
   ```

2. `DynamicPropertiesForm.tsx`:
   ```typescript
   console.log('🔍 DynamicPropertiesForm - type:', type);
   console.log('🔍 DynamicPropertiesForm - values:', values);
   console.log('🔍 DynamicPropertiesForm - values.options:', values.options);
   ```

**Como executar**:
1. Abrir DevTools Console (F12)
2. Abrir editor com funnel existente: `http://localhost:5173/quiz-editor/modular?funnel=SEU_ID`
3. Clicar em bloco de opções (quiz-options ou options-grid)
4. Verificar logs 🔍 no console

**O que procurar**:
- `selectedBlock.content.options` TEM array com objetos?
- Objetos TÊM `imageUrl`, `points`, `category`?
- `values.options` TEM os dados ou está vazio?

### Teste 2: Criar Novo Bloco da Biblioteca

1. Arrastar "Opções de Quiz" da biblioteca
2. Selecionar bloco criado
3. Verificar se aparece:
   - ✅ 3 opções com imagens de exemplo
   - ✅ Pontos: 10, 20, 30
   - ✅ Categorias: A, B, C

**Se APARECER**: Biblioteca está OK, problema é no carregamento do banco
**Se NÃO APARECER**: Problema nas correções anteriores

### Teste 3: Verificar Supabase Diretamente

```sql
-- Ver estrutura de um funnel salvo
SELECT 
    id, 
    name,
    jsonb_pretty(steps::jsonb) as steps_formatted
FROM quiz_funnel_drafts 
WHERE id = 'SEU_FUNNEL_ID'
LIMIT 1;
```

**Verificar**:
```json
{
  "blocks": [
    {
      "type": "quiz-options",
      "content": {
        "options": [
          {
            "id": "opt1",
            "text": "Opção 1",
            "imageUrl": "...",   // ❓ TEM isso?
            "points": 10,         // ❓ TEM isso?
            "category": "A"       // ❓ TEM isso?
          }
        ]
      }
    }
  ]
}
```

## 🎯 Próximos Passos

### Passo 1: Executar Teste 1 (Logs Console) ✅
**Status**: Implementado, aguardando resultado

**Ação**: Você precisa:
1. Abrir o editor
2. Clicar em bloco de opções
3. **Copiar e colar os logs do console aqui**

### Passo 2: Analisar Resultado dos Logs

**Cenário A**: Logs mostram que `content.options` TEM dados
```
✅ Dados chegam do banco
❌ Problema é no formulário/renderização
➡️ Investigar DynamicPropertiesForm renderização
```

**Cenário B**: Logs mostram que `content.options` está VAZIO ou sem campos
```
❌ Dados NÃO chegam do banco
✅ Problema é no carregamento/conversão
➡️ Investigar QuizEditorBridge ou template conversion
```

**Cenário C**: Logs mostram que `content.options` não existe
```
❌ Estrutura incorreta
✅ Options estão em outro lugar (properties?)
➡️ Verificar onde options são realmente salvas
```

### Passo 3: Correção Baseada no Diagnóstico

Aguardando resultado dos testes para determinar correção exata.

## 📊 Checklist de Verificação

- [x] Template tem dados (imageUrl, points, category) ✅
- [x] Código de carregamento coloca em content ✅
- [x] PropertiesPanel faz merge correto ✅
- [x] DynamicPropertiesForm renderiza campos ✅
- [x] Logs de debug implementados ✅
- [ ] Logs executados e analisados ⏳
- [ ] Causa raiz identificada ⏳
- [ ] Correção aplicada ⏳
- [ ] Teste de validação ⏳

## 🎓 Lições Aprendidas (Provisórias)

### 1. Diferença entre Template e Runtime
- **Template**: Estrutura de dados estática (quiz21StepsComplete.ts)
- **Runtime**: Dados salvos no Supabase após edição
- **Problema**: Template pode ter estrutura diferente do runtime

### 2. Dois Tipos de Blocks de Opções
- `options-grid`: Usado no template original
- `quiz-options`: Usado no editor modular
- **Problema**: Conversão pode perder dados

### 3. Importância de Logs de Debug
- Sem logs, é impossível saber se dados chegam
- Logs ajudam a isolar problema (banco vs UI vs lógica)

## 🚀 Status

- **Fase Atual**: Diagnóstico - Aguardando logs do usuário
- **Próxima Fase**: Análise dos logs → Identificação da causa raiz → Correção
- **Commit**: d911d6992 (debug: adicionar logs para investigar)

---

**Por favor, execute o Teste 1 e me envie os logs do console! 🙏**
