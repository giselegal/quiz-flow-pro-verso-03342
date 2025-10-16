# 🎨 SCHEMA STEP-01 - GUIA DE USO

## 📋 Resumo

O **schema step01Schema.ts** fornece validação Zod completa para todos os dados do Step-01 (Introdução).

- ✅ **Validação automática** de tipos e valores
- ✅ **Valores padrão** pré-configurados
- ✅ **Validação por campo** individual
- ✅ **TypeScript types** inferidos automaticamente

---

## 🚀 Instalação e Import

```typescript
// Importação completa
import step01Schema from '@/schemas/step01Schema';

// Importações específicas
import {
    introStep01MainSchema,
    introStep01DefaultData,
    validateIntroStep01Data,
    normalizeIntroStep01Data,
    validateIntroStep01Field,
    type IntroStep01MainData,
} from '@/schemas/step01Schema';

// Importação via index
import { step01Schema } from '@/schemas';
```

---

## 📦 Estrutura do Schema

### 1. **Schemas Individuais**

```typescript
// Header
introStep01HeaderSchema
// Title
introStep01TitleSchema
// Image
introStep01ImageSchema
// Description
introStep01DescriptionSchema
// Form
introStep01FormSchema
// Main (completo - todos os acima combinados)
introStep01MainSchema
```

### 2. **Types TypeScript**

```typescript
type IntroStep01HeaderData = z.infer<typeof introStep01HeaderSchema>;
type IntroStep01TitleData = z.infer<typeof introStep01TitleSchema>;
type IntroStep01ImageData = z.infer<typeof introStep01ImageSchema>;
type IntroStep01DescriptionData = z.infer<typeof introStep01DescriptionSchema>;
type IntroStep01FormData = z.infer<typeof introStep01FormSchema>;
type IntroStep01MainData = z.infer<typeof introStep01MainSchema>; // ⭐ Principal
```

---

## 💡 Exemplos de Uso

### ✅ Exemplo 1: Validação Completa

```typescript
import { validateIntroStep01Data } from '@/schemas/step01Schema';

const rawData = {
    title: 'Meu Quiz',
    buttonText: 'Começar',
    backgroundColor: '#FAF9F7',
    // ... outros campos
};

const result = validateIntroStep01Data(rawData);

if (result.success) {
    console.log('✅ Dados válidos:', result.data);
    // Use result.data (dados validados e tipados)
} else {
    console.error('❌ Erros:', result.error.errors);
    // result.error.errors contém array de erros Zod
}
```

---

### ✅ Exemplo 2: Normalização com Valores Padrão

```typescript
import { normalizeIntroStep01Data } from '@/schemas/step01Schema';

// Dados parciais do usuário
const partialData = {
    title: 'Meu Título Customizado',
    buttonText: 'Começar Agora',
};

// Normaliza e preenche campos faltantes com valores padrão
const fullData = normalizeIntroStep01Data(partialData);

console.log(fullData);
/*
{
    title: 'Meu Título Customizado', // ← usuário
    buttonText: 'Começar Agora',      // ← usuário
    backgroundColor: '#FAF9F7',        // ← padrão
    logoUrl: 'https://...',            // ← padrão
    progressValue: 5,                  // ← padrão
    // ... todos os outros campos com valores padrão
}
*/
```

---

### ✅ Exemplo 3: Validação Individual de Campo

```typescript
import { validateIntroStep01Field } from '@/schemas/step01Schema';

// Validar campo de cor
const colorResult = validateIntroStep01Field('backgroundColor', '#FAF9F7');
console.log(colorResult); // true

const invalidColor = validateIntroStep01Field('backgroundColor', 'red');
console.log(invalidColor); // "Cor deve estar no formato #RRGGBB"

// Validar URL
const urlResult = validateIntroStep01Field('imageUrl', 'https://example.com/image.png');
console.log(urlResult); // true

const invalidUrl = validateIntroStep01Field('imageUrl', 'not-a-url');
console.log(invalidUrl); // "URL inválida"
```

---

### ✅ Exemplo 4: Integração com React State

```typescript
import React, { useState } from 'react';
import { normalizeIntroStep01Data, type IntroStep01MainData } from '@/schemas/step01Schema';

function MyComponent() {
    const [stepData, setStepData] = useState<IntroStep01MainData>(
        normalizeIntroStep01Data({
            title: 'Título Inicial',
            buttonText: 'Começar',
        })
    );

    const handleUpdate = (field: keyof IntroStep01MainData, value: any) => {
        setStepData(prev => 
            normalizeIntroStep01Data({
                ...prev,
                [field]: value,
            })
        );
    };

    return (
        <div>
            <input
                value={stepData.title}
                onChange={(e) => handleUpdate('title', e.target.value)}
            />
            <button style={{ backgroundColor: stepData.buttonColor }}>
                {stepData.buttonText}
            </button>
        </div>
    );
}
```

---

### ✅ Exemplo 5: Validação no Submit de Formulário

```typescript
import { validateIntroStep01Data } from '@/schemas/step01Schema';

function handleSubmit(formData: unknown) {
    const result = validateIntroStep01Data(formData);

    if (!result.success) {
        // Mostrar erros ao usuário
        const errors = result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
        }));

        console.error('Erros de validação:', errors);
        alert(`Erros encontrados:\n${errors.map(e => `- ${e.field}: ${e.message}`).join('\n')}`);
        return;
    }

    // Dados válidos - salvar no banco de dados
    const validData = result.data;
    console.log('✅ Salvando:', validData);
    // await saveToDatabase(validData);
}
```

---

### ✅ Exemplo 6: Editor com Validação em Tempo Real

```typescript
import { validateIntroStep01Field, type IntroStep01MainData } from '@/schemas/step01Schema';

function PropertiesPanel({ data, onUpdate }: { 
    data: IntroStep01MainData; 
    onUpdate: (field: keyof IntroStep01MainData, value: any) => void;
}) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFieldChange = (field: keyof IntroStep01MainData, value: any) => {
        // Validar campo antes de atualizar
        const validation = validateIntroStep01Field(field, value);

        if (validation === true) {
            // Válido - atualizar
            onUpdate(field, value);
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        } else {
            // Inválido - mostrar erro
            setErrors(prev => ({
                ...prev,
                [field]: validation,
            }));
        }
    };

    return (
        <div>
            <div>
                <label>Cor de Fundo:</label>
                <input
                    type="text"
                    value={data.backgroundColor}
                    onChange={(e) => handleFieldChange('backgroundColor', e.target.value)}
                />
                {errors.backgroundColor && (
                    <p className="text-red-500 text-xs">{errors.backgroundColor}</p>
                )}
            </div>

            <div>
                <label>Progresso (0-100):</label>
                <input
                    type="number"
                    value={data.progressValue}
                    onChange={(e) => handleFieldChange('progressValue', Number(e.target.value))}
                />
                {errors.progressValue && (
                    <p className="text-red-500 text-xs">{errors.progressValue}</p>
                )}
            </div>
        </div>
    );
}
```

---

## 📊 Campos Disponíveis (47+ propriedades)

### **Background** (4 campos)
- `backgroundColor` - Cor de fundo (#RRGGBB)
- `backgroundImage` - URL de imagem de fundo (opcional)
- `minHeight` - Altura mínima (padrão: "100vh")
- `padding` - Padding geral (padrão: "2rem")

### **Header** (9 campos)
- `logoUrl` - URL do logo
- `logoAlt` - Texto alternativo do logo
- `logoWidth`, `logoHeight` - Dimensões do logo
- `showBackButton` - Exibir botão voltar
- `backButtonText` - Texto do botão voltar
- `backButtonColor` - Cor do botão voltar
- `showProgressBar` - Exibir barra de progresso
- `progressValue` - Valor do progresso (0-100)
- `progressColor`, `progressBgColor` - Cores da barra

### **Title** (6 campos)
- `title` - Texto do título (suporta HTML)
- `titleColor` - Cor do título
- `titleAccentColor` - Cor de destaque
- `titleSize` - Tamanho da fonte (16-72px)
- `titleAlign` - Alinhamento (left/center/right)
- `titleWeight` - Peso da fonte (normal/bold/semibold/extrabold)

### **Image** (7 campos)
- `imageUrl` - URL da imagem
- `imageAlt` - Texto alternativo
- `imageMaxWidth`, `imageMaxHeight` - Dimensões máximas
- `showShadow` - Exibir sombra
- `shadowColor` - Cor da sombra
- `borderRadius` - Raio da borda

### **Description** (5 campos)
- `description` - Texto da descrição (suporta HTML)
- `descriptionColor` - Cor do texto
- `descriptionSize` - Tamanho da fonte (12-32px)
- `descriptionAlign` - Alinhamento
- `descriptionLineHeight` - Altura da linha (1-3)

### **Form** (16 campos)
- `formQuestion` - Pergunta do formulário
- `formQuestionColor`, `formQuestionSize` - Estilo da pergunta
- `inputPlaceholder`, `inputLabel` - Configuração do input
- `inputBgColor`, `inputBorderColor`, `inputTextColor` - Cores do input
- `buttonText` - Texto do botão
- `buttonColor`, `buttonTextColor`, `buttonHoverColor` - Cores do botão
- `required` - Campo obrigatório
- `minLength`, `maxLength` - Validação de tamanho
- `pattern` - RegEx de validação
- `errorMessage` - Mensagem de erro

---

## 🎯 Valores Padrão

Todos os campos têm valores padrão sensatos pré-configurados. Acesse via:

```typescript
import { introStep01DefaultData } from '@/schemas/step01Schema';

console.log(introStep01DefaultData);
// {
//   backgroundColor: '#FAF9F7',
//   logoUrl: 'https://...',
//   title: '<span style="color: #B89B7A;">Chega</span> de...',
//   ... (47+ campos)
// }
```

---

## ✅ Validações Implementadas

### **Cores** (`#RRGGBB`)
- ✅ Formato hexadecimal válido
- ❌ `"red"` → Erro
- ✅ `"#FF0000"` → OK

### **URLs**
- ✅ URL válida ou string vazia
- ❌ `"not-a-url"` → Erro
- ✅ `"https://example.com/image.png"` → OK

### **Números Positivos**
- ✅ Maior ou igual a 0
- ❌ `-10` → Erro
- ✅ `50` → OK

### **Ranges Específicos**
- `progressValue`: 0-100
- `titleSize`: 16-72px
- `descriptionLineHeight`: 1-3

---

## 🎉 Resumo das Funções

| Função | Descrição | Retorno |
|--------|-----------|---------|
| `validateIntroStep01Data(data)` | Valida dados completos | `{ success, data?, error? }` |
| `normalizeIntroStep01Data(partial)` | Preenche campos faltantes | `IntroStep01MainData` |
| `validateIntroStep01Field(field, value)` | Valida um campo específico | `true \| string` |

---

## 🔧 Manutenção

### **Adicionar novo campo:**

1. Adicione ao schema apropriado:
```typescript
export const introStep01TitleSchema = z.object({
    title: z.string().min(1),
    // ... campos existentes
    newField: z.string().default('valor padrão'), // ← novo
});
```

2. Adicione ao `introStep01MainSchema`:
```typescript
export const introStep01MainSchema = z.object({
    ...introStep01TitleSchema.shape,
    // ...
});
```

3. Adicione ao `introStep01DefaultData`:
```typescript
export const introStep01DefaultData = {
    // ...
    newField: 'valor padrão', // ← novo
};
```

---

## 📚 Recursos Adicionais

- 📖 [Documentação Zod](https://zod.dev/)
- 📖 [TypeScript Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- 📁 Localização: `/src/schemas/step01Schema.ts`

---

## ✅ Conclusão

O schema Step-01 fornece:

- ✅ **47+ campos** validados automaticamente
- ✅ **Type safety** completo com TypeScript
- ✅ **Valores padrão** prontos para uso
- ✅ **Validação granular** por campo
- ✅ **Integração fácil** com React e formulários

🎉 **100% pronto para produção!**
