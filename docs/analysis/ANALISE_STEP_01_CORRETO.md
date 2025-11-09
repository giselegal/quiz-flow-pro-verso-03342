# 🔍 Análise: Qual Step-01 está sendo usado?

## ✅ CONCLUSÃO: Está usando o arquivo CORRETO!

---

## 📋 Arquivos Step-01 Encontrados

### 1. `/public/templates/blocks/step-01.json` ✅ **[EM USO]**

**Prioridade**: 🥇 PRIMEIRA (linha 247 do ConsolidatedTemplateService)

**Estrutura** (5 blocos atômicos - v3.1):
```json
{
  "id": "step-01",
  "title": "Introdução - Bem-vindo ao Quiz de Estilo",
  "blocks": [
    { "type": "intro-logo", "id": "intro-logo" },
    { "type": "intro-title", "id": "intro-title" },
    { "type": "intro-image", "id": "intro-image" },      ← 🖼️ TEM A IMAGEM
    { "type": "intro-description", "id": "intro-description" },
    { "type": "intro-form", "id": "intro-form" }
  ],
  "metadata": {
    "version": "3.0.0",
    "generatedFrom": "master",
    "generatedAt": "2025-10-30T11:27:34.173Z"
  }
}
```

**Conteúdo da Imagem**:
```json
{
  "type": "intro-image",
  "content": {
    "src": "https://res.cloudinary.com/der8kogzu/image/upload/.../Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png",
    "imageUrl": "[mesma URL]",
    "alt": "Descubra seu estilo predominante",
    "width": 300,
    "height": 204
  },
  "properties": {
    "objectFit": "contain",
    "maxWidth": 300,
    "borderRadius": "8px"
  }
}
```

---

### 2. `/public/templates/normalized/step-01.json` ❌ **[NÃO USADO]**

**Prioridade**: 🥉 FALLBACK 1 (só usado se blocks/ não existir)

**Estrutura** (2 blocos compostos - v3.0 antigo):
```json
{
  "id": "step-01",
  "type": "intro",
  "templateVersion": "3.0",
  "blocks": [
    { "type": "hero-block", "id": null },
    { "type": "welcome-form-block", "id": null }
  ]
}
```

❌ **Problema**: NÃO tem bloco `intro-image`!

---

## 🔄 Ordem de Carregamento (ConsolidatedTemplateService)

```typescript
// Linha 245-275 do arquivo
async loadFromJSON(templateId: string) {
    // PRIORIDADE 1: /templates/blocks/step-XX.json ✅ ← USA ESTE!
    let response = await fetch(`/templates/blocks/${normalizedId}.json`);
    if (response.ok) return this.convertJSONTemplate(await response.json());

    // PRIORIDADE 2: /templates/step-XX-v3.json
    response = await fetch(`/templates/${normalizedId}-v3.json`);
    if (response.ok) return this.convertJSONTemplate(await response.json());

    // PRIORIDADE 3: /templates/step-XX.json (normalized/)
    const fallback = await fetch(`/templates/${normalizedId}.json`);
    if (fallback.ok) return this.convertJSONTemplate(await fallback.json());
}
```

---

## ✅ Verificação de Componentes

### IntroImageBlock.tsx ✅

**Localização**: `/src/components/editor/blocks/atomic/IntroImageBlock.tsx`

**Status**: 
- ✅ Componente implementado
- ✅ Importado no BlockTypeRenderer (linha 33)
- ✅ Mapeado corretamente: `case 'intro-image'` → `IntroImageBlock`

**Lógica de src (prioridade)**:
1. `content.imageUrl` ← Usado no JSON atual
2. `content.src`
3. `properties.src`

**Renderização**:
```tsx
<img
  src={src}
  alt={alt}
  className="w-full object-contain rounded-lg"
  style={{ maxWidth: '300px' }}
/>
```

---

## 🧪 Como Verificar no Navegador

### Teste Rápido:
```javascript
// Abra o Console (F12) em http://localhost:8080/editor?template=quiz21StepsComplete
const response = await fetch('/templates/blocks/step-01.json');
const data = await response.json();
console.log('📦 Blocos:', data.blocks.map(b => b.type));
// Deve mostrar: ["intro-logo", "intro-title", "intro-image", "intro-description", "intro-form"]
```

### Verificar imagem no DOM:
```javascript
const img = document.querySelector('[alt="Descubra seu estilo predominante"]');
console.log('🖼️ Imagem encontrada:', !!img);
console.log('URL:', img?.src);
console.log('Dimensões:', img?.width, 'x', img?.height);
```

---

## 📊 Comparação dos Arquivos

| Aspecto | `/templates/blocks/` ✅ | `/templates/normalized/` ❌ |
|---------|-------------------------|------------------------------|
| **Versão** | 3.0.0 (v3.1 atômico) | 3.0 (v3.0 composto) |
| **Blocos** | 5 blocos atômicos | 2 blocos compostos |
| **intro-image** | ✅ Presente | ❌ Ausente |
| **intro-logo** | ✅ Presente | ❌ Integrado no hero-block |
| **intro-form** | ✅ Atômico | ❌ Composto (welcome-form-block) |
| **Compatibilidade** | ✅ Editor modular | ⚠️ Sistema antigo |
| **Usado pelo sistema** | ✅ SIM (prioridade 1) | ❌ NÃO (apenas fallback) |

---

## 🎯 Resultado Final

### ✅ **TUDO CORRETO!**

1. ✅ Sistema usa `/public/templates/blocks/step-01.json`
2. ✅ Arquivo contém o bloco `intro-image`
3. ✅ Componente `IntroImageBlock` está implementado
4. ✅ Mapeamento no `BlockTypeRenderer` está correto
5. ✅ URL da imagem é acessível (HTTP 200)

### 🖼️ Estrutura de Renderização Esperada:

```
Step-01 (Introdução)
├── 1. intro-logo      → IntroLogoBlock
├── 2. intro-title     → IntroTitleBlock
├── 3. intro-image     → IntroImageBlock ← RENDERIZA A IMAGEM
├── 4. intro-description → IntroDescriptionBlock
└── 5. intro-form      → IntroFormBlock
```

---

## 💡 Se a Imagem NÃO Aparecer

### Possíveis Causas:

1. **Cache do navegador**: Ctrl+Shift+R para hard refresh
2. **Build desatualizado**: `npm run dev` (servidor já rodando)
3. **Erro no console**: Verifique DevTools (F12) → Console
4. **CSS escondendo**: Verifique estilos com Inspector

### Debug Steps:

```javascript
// 1. Verificar se o JSON está correto
fetch('/templates/blocks/step-01.json').then(r => r.json()).then(console.log);

// 2. Verificar se o componente renderiza
console.log('Blocks rendered:', 
  Array.from(document.querySelectorAll('[data-block-type]'))
    .map(el => el.getAttribute('data-block-type'))
);

// 3. Verificar logs do IntroImageBlock
// Deveria mostrar: "🖼️ [IntroImageBlock] Debug: ..."
```

---

**Data da Análise**: 2025-10-30  
**Status**: ✅ VERIFICADO - Sistema usando arquivo correto com bloco de imagem
