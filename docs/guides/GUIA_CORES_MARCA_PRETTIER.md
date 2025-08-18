# 🎨 GUIA DE CORES DA MARCA - QUIZ QUEST

## 📋 PALETA OFICIAL

### Cores Primárias

```css
/* Cor principal - Dourado elegante */
--brand-primary: #b89b7a;

/* Cor secundária - Bege claro */
--brand-light: #d4c2a8;

/* Cor escura - Dourado escuro */
--brand-dark: #a38a69;

/* Cor de texto - Marrom escuro */
--brand-text: #432818;
```

### Classes Tailwind da Marca

```tsx
// ✅ Backgrounds
bg - brand - primary; // #B89B7A
bg - brand - light; // #D4C2A8
bg - brand - dark; // #A38A69

// ✅ Texto
text - brand - primary; // #B89B7A
text - brand - light; // #D4C2A8
text - brand - text; // #432818

// ✅ Bordas
border - brand - primary; // #B89B7A
border - brand - light; // #D4C2A8

// ✅ Anéis (focus)
ring - brand - primary; // #B89B7A
```

## 🎯 CORES ESTRATÉGICAS (uso limitado)

### Verde - Apenas para CTAs de Sucesso

```tsx
// ✅ Uso correto
<button className="bg-green-500 text-white">Salvar Quiz</button>
<div className="text-green-600">✓ Quiz salvo com sucesso</div>

// ❌ Uso incorreto
<div className="bg-green-100">Conteúdo normal</div>
```

### Vermelho - Apenas para CTAs de Urgência/Erro

```tsx
// ✅ Uso correto
<button className="bg-red-500 text-white">Excluir</button>
<div className="text-red-600">Erro: Campo obrigatório</div>

// ❌ Uso incorreto
<div className="bg-red-50">Conteúdo normal</div>
```

## 🔄 MIGRAÇÃO DE CORES

### Antes (cores não-brand)

```tsx
// ❌ Cores antigas
className = 'bg-blue-500 text-blue-600 border-blue-300';
className = 'bg-yellow-100 text-yellow-800';
className = 'bg-orange-50 border-orange-300';
className = 'text-purple-600';
```

### Depois (cores da marca)

```tsx
// ✅ Cores da marca
className = 'bg-brand-primary text-brand-primary border-brand-primary';
className = 'bg-stone-100 text-stone-700';
className = 'bg-brand-primary/10 border-brand-primary/40';
className = 'text-brand-primary';
```

## 📚 EXEMPLOS PRÁTICOS

### Botão Primário

```tsx
<button className="bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-md border border-brand-primary focus:ring-2 focus:ring-brand-primary">
  Criar Quiz
</button>
```

### Card com Cores da Marca

```tsx
<div className="bg-white border border-brand-light rounded-lg p-6">
  <h3 className="text-brand-text font-semibold">Título do Card</h3>
  <p className="text-stone-600">Descrição em tom neutro</p>
  <div className="bg-brand-primary/10 p-3 rounded border-l-4 border-brand-primary">
    <span className="text-brand-primary">Destaque da marca</span>
  </div>
</div>
```

### Input com Foco na Marca

```tsx
<input
  className="w-full px-3 py-2 border border-stone-300 rounded-md 
             focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 
             text-brand-text placeholder-stone-500"
  placeholder="Digite aqui..."
/>
```

### Estados de Feedback

```tsx
// ✅ Sucesso (verde estratégico)
<div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded">
  Quiz criado com sucesso!
</div>

// ⚠️ Aviso (cores da marca)
<div className="bg-brand-primary/10 border border-brand-primary text-brand-text p-3 rounded">
  Atenção: Revise as configurações
</div>

// ❌ Erro (vermelho estratégico)
<div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded">
  Erro ao salvar o quiz
</div>
```

## 🛠️ FERRAMENTAS E CONFIGURAÇÃO

### Prettier Configuration

O arquivo `.prettierrc.json` está configurado para formatar automaticamente as classes Tailwind seguindo a ordem das cores da marca.

### Tailwind Config

O arquivo `tailwind.config.ts` inclui as cores da marca:

```typescript
colors: {
  brand: {
    primary: "#B89B7A",
    light: "#D4C2A8",
    dark: "#A38A69",
    text: "#432818",
  }
}
```

### Scripts de Migração

- `aplicar-cores-marca.sh` - Substitui cores antigas por cores da marca
- `formatacao-prettier-cores.sh` - Aplica formatação Prettier

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Configuração de cores da marca no Tailwind
- [x] Criação do arquivo de configuração de cores (`brandColors.ts`)
- [x] Script de migração automática de cores
- [x] Configuração do Prettier para formatação
- [x] Documentação completa de uso
- [x] Exemplos práticos de implementação

## 🎯 PRÓXIMOS PASSOS

1. **Executar migração**: `./aplicar-cores-marca.sh`
2. **Aplicar formatação**: `./formatacao-prettier-cores.sh`
3. **Testar aplicação**: `npm run dev`
4. **Revisar componentes** que ainda usam cores não-brand
5. **Ajustar cores estratégicas** conforme necessário

## 📝 NOTAS IMPORTANTES

- **Verde e vermelho** devem ser usados APENAS para CTAs e feedback
- **Cores da marca** (#B89B7A, #D4C2A8, #432818) são prioritárias
- **Tons neutros** (stone) para elementos de interface
- **Consistência visual** é fundamental para a identidade da marca
