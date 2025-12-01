# 🚀 Guia Rápido - V4.1-SaaS Implementation

**Para**: Desenvolvedores e Time de Produto  
**Objetivo**: Usar os novos componentes v4.1-SaaS no dia a dia

---

## 📦 O Que Foi Implementado?

Migração completa do quiz para formato **SaaS-grade** com:
- ✅ Options normalizadas (formato único)
- ✅ Rich-text seguro (sem XSS)
- ✅ CDN automático (Cloudinary)
- ✅ Scoring explícito (option.score.category)

---

## 🎯 Como Usar os Novos Componentes

### 1. Renderizar Texto Seguro (Rich-Text)

**Antes** ❌:
```tsx
<h1 dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />
```

**Depois** ✅:
```tsx
import { RichText } from '@/components/shared/RichText';

<RichText 
  content={title} 
  as="h1" 
  className="text-3xl font-bold"
  allowLegacyHTML={true}
/>
```

**Funciona com**:
- String simples: `"Texto sem formatação"`
- HTML legado: `"<strong>Chega</strong> de guarda-roupa lotado"`
- Rich-text v4.1: `{ type: 'rich-text', blocks: [...] }`

---

### 2. Carregar Imagens do CDN

**Antes** ❌:
```tsx
<img src="/quiz-assets/questions/q1-option-1.jpg" alt="Opção 1" />
```

**Depois** ✅:
```tsx
import { OptimizedImage } from '@/components/shared/OptimizedImage';

<OptimizedImage 
  src="/quiz-assets/questions/q1-option-1.jpg"
  alt="Opção 1"
  className="w-64 h-64 object-cover"
  placeholder="blur"
/>
```

**Features automáticas**:
- ✅ Resolve para CDN (`https://res.cloudinary.com/...`)
- ✅ Lazy loading nativo
- ✅ Placeholder enquanto carrega
- ✅ Fallback em caso de erro

---

### 3. Normalizar Options (v4.0 → v4.1)

**Antes** ❌:
```tsx
const options = [
  { id: '1', text: 'Opção 1', image: 'path.jpg' },
  { id: '2', label: 'Opção 2', imageUrl: 'path.jpg' }
];
```

**Depois** ✅:
```tsx
import { normalizeOption } from '@/lib/quiz-v4-saas-adapter';

const normalizedOptions = options.map(opt => normalizeOption(opt));
// Resultado:
// [
//   { id: '1', label: 'Opção 1', imageUrl: 'path.jpg', value: '1', score: {...} },
//   { id: '2', label: 'Opção 2', imageUrl: 'path.jpg', value: '2', score: {...} }
// ]
```

**Garantias**:
- ✅ Formato único (label, imageUrl, value, score)
- ✅ Backward compatibility (aceita text, image, etc.)
- ✅ Scoring explícito sempre presente

---

### 4. Calcular Scoring (Novo Formato)

**Antes** ❌:
```tsx
// Scoring implícito via IDs
if (optionId.includes('natural')) score.natural += 10;
```

**Depois** ✅:
```tsx
import { calculateScoresFromNormalizedOptions } from '@/lib/scoring-migration';

const scores = calculateScoresFromNormalizedOptions(answers);
// Resultado:
// { natural: 45, classico: 30, romantico: 25 }
```

**Compatibilidade**:
- ✅ Lê `answer.normalizedOptions` (v4.1)
- ✅ Fallback para `answer.weights` (v4.0)
- ✅ Cálculo automático de percentuais

---

## 🛠️ Configuração Necessária

### Environment Variables (.env.local)

```env
# Asset CDN (obrigatório para produção)
VITE_ASSET_CDN_BASE_URL=https://res.cloudinary.com/dqljyf76t/image/upload
VITE_ENABLE_ASSET_CDN=true
```

**Como testar localmente**:
```bash
# 1. Adicionar ao .env.local (já feito!)
# 2. Reiniciar servidor
npm run dev
# 3. Verificar Network tab: URLs devem apontar para Cloudinary
```

---

## 📋 Checklist para Novos Componentes

Ao criar um novo componente de quiz:

- [ ] **Texto**: Usar `<RichText>` ao invés de `dangerouslySetInnerHTML`
- [ ] **Imagens**: Usar `<OptimizedImage>` ao invés de `<img>`
- [ ] **Options**: Normalizar com `normalizeOption()` antes de renderizar
- [ ] **Scoring**: Salvar `normalizedOptions` ao persistir respostas
- [ ] **TypeScript**: Importar `SaaSOption` type para options

---

## 🐛 Troubleshooting

### Imagens não carregam
```bash
# Verificar:
1. VITE_ASSET_CDN_BASE_URL está no .env.local?
2. VITE_ENABLE_ASSET_CDN=true?
3. Path começa com /quiz-assets/?
4. Network tab mostra URL do Cloudinary?
```

### Rich-text não renderiza
```bash
# Verificar:
1. Import correto: import { RichText } from '@/components/shared/RichText'
2. Prop allowLegacyHTML={true} se for HTML legado
3. Content não é undefined ou null
```

### Scoring não funciona
```bash
# Verificar:
1. normalizedOptions está sendo salvo? (ver StorageService)
2. calcResults.ts prioriza normalizedOptions?
3. Fallback para weights funciona?
4. Console tem erros de cálculo?
```

---

## 📚 Documentação Completa

- **Relatório Técnico**: `IMPLEMENTACAO_V4_SAAS_COMPLETA.md`
- **Exemplos de Código**: `docs/v4-saas/CODE_EXAMPLES.md`
- **Checklist de Migração**: `docs/v4-saas/MIGRATION_CHECKLIST.md`
- **Comparação Before/After**: `docs/v4-saas/BEFORE_AFTER_COMPARISON.md`

---

## ❓ Perguntas Frequentes

**Q: Preciso migrar todos os componentes de uma vez?**  
A: Não! O sistema é 100% backward compatible. Migre gradualmente.

**Q: O que acontece com templates v4.0 antigos?**  
A: Continuam funcionando. O adapter normaliza automaticamente.

**Q: Posso usar sem CDN em desenvolvimento?**  
A: Sim! Configure `VITE_ENABLE_ASSET_CDN=false` no .env.local.

**Q: Como sei se o scoring está usando v4.1?**  
A: Verifique logs do console: `[calcResults] V4.1-SAAS format detected`

---

## 🚀 Deploy para Produção

1. ✅ Confirmar `.env.production` tem `VITE_ASSET_CDN_BASE_URL`
2. ✅ Build: `npm run build`
3. ✅ Testar em staging primeiro
4. ✅ Validar imagens carregando do CDN
5. ✅ Smoke test: Quiz end-to-end
6. ✅ Monitorar logs por 24h

---

## 💬 Suporte

**Dúvidas técnicas**: Ver `IMPLEMENTACAO_V4_SAAS_COMPLETA.md`  
**Bugs**: Abrir issue com label `v4.1-saas`  
**Features**: Discussão no Slack #quiz-development

---

**Última atualização**: 2024-12-01  
**Versão**: v4.1.0  
**Status**: ✅ Produção-ready
