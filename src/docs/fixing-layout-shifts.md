# Corrigindo Cumulative Layout Shift (CLS)

Este documento fornece diretrizes para resolver os problemas de mudança de layout (CLS) identificados no relatório do Lighthouse.

## Problemas Identificados

O relatório do Lighthouse identificou um CLS de 0.292, que está acima do recomendado (ideal < 0.1).

As principais causas de layout shift incluem:

1. `<div class="w-full max-w-md flex flex-col items-center space-y-6 pb-8">` - (pontuação: 0.291)
2. `<div class="w-28 h-auto mb-8">` com Logo Gisele Galvão - (pontuação: 0.001)

## Estratégias de Correção

### 1. Dimensões Explícitas para Imagens

Sempre defina largura e altura em imagens, especialmente na imagem do logo e na imagem principal:

```tsx
// Antes
<img
  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
  alt="Logo Gisele Galvão"
/>

// Depois
<img
  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
  alt="Logo Gisele Galvão"
  width={112}
  height={56}
  className="w-28 h-auto"
/>
```

### 2. Reservar Espaço para Conteúdo Carregado de Forma Assíncrona

Use placeholders com proporções corretas para conteúdo que será carregado:

```tsx
<div style={{ aspectRatio: '1/1' }} className="bg-gray-100 w-full max-w-md">
  {/* Conteúdo carregado de forma assíncrona */}
</div>
```

### 3. Evitar Inserção de Conteúdo Acima do Conteúdo Existente

Certifique-se de que elementos como banners, notificações ou modais não empurrem o conteúdo existente para baixo durante o carregamento da página.

### 4. Usar a Técnica de Placeholder de Tamanho Correto (LQIP)

Utilize a técnica de Low Quality Image Placeholder para manter a estrutura da página enquanto a imagem principal carrega:

```tsx
<div className="relative w-full" style={{ aspectRatio: '1/1' }}>
  {/* Imagem de baixa qualidade (carrega rapidamente) */}
  {!imageLoaded && (
    <img
      src={lowQualityUrl}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover blur-sm"
      width={width}
      height={height}
    />
  )}

  {/* Imagem de alta qualidade (carrega mais lentamente) */}
  <img
    src={highQualityUrl}
    alt={alt}
    className="w-full h-full object-cover"
    width={width}
    height={height}
    onLoad={() => setImageLoaded(true)}
    style={{ opacity: imageLoaded ? 1 : 0 }}
  />
</div>
```

### 5. Usar font-display: swap para Fontes da Web

Adicione a propriedade `font-display: swap` às suas declarações de fonte para evitar FOIT (Flash of Invisible Text):

```css
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Permite que o texto seja exibido com uma fonte alternativa enquanto a personalizada carrega */
}
```

### 6. Precarregar Fontes Críticas

Adicione tags `<link rel="preload">` para carregar fontes críticas com antecedência:

```html
<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
  as="style"
/>
```

### 7. Definir Altura para Contêineres de Conteúdo Dinâmico

Para contêineres que terão altura dinâmica, defina uma altura mínima:

```tsx
<div className="w-full max-w-md flex flex-col items-center space-y-6 pb-8 min-h-[300px]">
  {/* Conteúdo dinâmico */}
</div>
```

## Correções Específicas

### Para o Logo

```tsx
<div className="w-28 h-14 mb-8 flex items-center justify-center">
  <img
    src="https://res.cloudinary.com/dqljyf76t/image/upload/f_auto,q_auto:good/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
    alt="Logo Gisele Galvão"
    width={112}
    height={56}
    className="max-w-full max-h-full"
  />
</div>
```

### Para a Imagem Principal

```tsx
<div
  className="w-full max-w-md relative bg-white shadow-sm rounded-lg overflow-hidden"
  style={{ aspectRatio: '1/1' }}
>
  <img
    src={optimizedImageUrl}
    alt="Mulher elegante com roupas estilosas"
    className="w-full h-full object-cover"
    width={800}
    height={800}
    fetchPriority="high"
  />
</div>
```

## Conclusão

Ao implementar essas correções, o CLS deve diminuir significativamente, melhorando a experiência do usuário e as pontuações do Lighthouse. Lembre-se de testar em diferentes dispositivos e tamanhos de tela para garantir que as melhorias sejam consistentes.
