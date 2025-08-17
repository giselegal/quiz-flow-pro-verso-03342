# Guia de Otimização de Desempenho

Este documento apresenta diretrizes para melhorar o desempenho da aplicação, baseadas em recomendações do Lighthouse.

## Otimização de Imagens

As imagens são um dos principais fatores que afetam o desempenho da página. Seguir estas diretrizes pode reduzir significativamente o tempo de carregamento.

### Formatos Modernos

Use formatos modernos de imagem como WebP ou AVIF em vez de PNG ou JPEG:

```tsx
// Antes (não otimizado)
<img src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/imagem.png" />

// Depois (otimizado)
<img
  src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good/v1744920983/imagem.png"
  alt="Descrição da imagem"
/>
```

### Otimização com Cloudinary

Para imagens hospedadas no Cloudinary, adicione parâmetros de transformação na URL:

1. `f_auto` - Formato automático (entrega WebP para navegadores compatíveis)
2. `q_auto:good` - Qualidade otimizada automaticamente
3. `w_[largura]` - Especifique a largura exata necessária

```tsx
// URL otimizada para Cloudinary
src =
  'https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good,w_320/v1744920983/imagem.png';
```

### Dimensões Explícitas

Sempre defina os atributos `width` e `height` para evitar mudanças de layout durante o carregamento:

```tsx
<img
  src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good,w_320/v1744920983/imagem.png"
  alt="Descrição da imagem"
  width={320}
  height={180}
  className="w-full h-auto" // Responsivo, mas mantém proporção
/>
```

### Carregamento Preguiçoso

Use o atributo `loading="lazy"` para imagens abaixo da dobra:

```tsx
<img
  src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good,w_320/v1744920983/imagem.png"
  alt="Descrição da imagem"
  width={320}
  height={180}
  loading="lazy"
/>
```

Para imagens críticas acima da dobra, use `loading="eager"` ou omita o atributo.

## Redução de JavaScript

Reduza o tamanho do JavaScript para melhorar o desempenho:

1. **Importe apenas o necessário**:

   ```tsx
   // Ruim - importa toda a biblioteca
   import * as Lucide from 'lucide-react';

   // Bom - importa apenas os ícones necessários
   import { ShoppingCart, Clock } from 'lucide-react';
   ```

2. **Use lazy loading para componentes grandes**:

   ```tsx
   import React, { lazy, Suspense } from 'react';

   const HeavyComponent = lazy(() => import('./HeavyComponent'));

   const MyComponent = () => (
     <Suspense fallback={<LoadingSpinner />}>
       <HeavyComponent />
     </Suspense>
   );
   ```

## Redução de CSS Não Utilizado

Evite importar CSS que não é utilizado:

1. Use classes condicionais:

   ```tsx
   <div className={isActive ? 'active-class' : 'inactive-class'} />
   ```

2. Remova imports de CSS não utilizados.

## Prevenção de Layout Shifts (CLS)

Para evitar mudanças de layout durante o carregamento:

1. **Dimensões explícitas para mídia**: Sempre especifique width/height para imagens e vídeos
2. **Reservar espaço** para elementos que serão carregados dinamicamente
3. **Evitar inserir conteúdo** acima do conteúdo existente

```tsx
// Ruim - sem dimensões definidas
<div>
  <img src="..." alt="..." />
</div>

// Bom - espaço pré-definido mesmo antes da imagem carregar
<div style={{ aspectRatio: '16/9' }} className="bg-gray-100">
  <img src="..." alt="..." width={640} height={360} className="w-full h-auto" />
</div>
```

## Auditoria de Desempenho

Execute periodicamente auditorias com Lighthouse para identificar problemas:

1. Abra as Ferramentas de Desenvolvedor (F12)
2. Acesse a aba "Lighthouse"
3. Execute auditorias para Desempenho
4. Implemente as recomendações fornecidas

## Recursos Úteis

- [Web Vitals](https://web.dev/vitals/) - Métricas essenciais para qualidade da web
- [Otimização de Imagens com Cloudinary](https://cloudinary.com/documentation/image_optimization)
- [CSS Performance](https://web.dev/css-web-performance/)
