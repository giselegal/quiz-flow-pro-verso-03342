# Padrões de Carregamento (Loading Patterns)

Este documento descreve os padrões de carregamento padronizados para o projeto Quiz Sell Genius.

## Componentes Disponíveis

### 1. LoadingSpinner

Um spinner de carregamento simples e customizável para uso em qualquer contexto.

```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

<LoadingSpinner
  size="md" // Tamanhos: xs, sm, md, lg, xl
  color="#B89B7A" // Cor personalizada (opcional)
  className="mb-4" // Classes adicionais (opcional)
  thickness="normal" // Espessura: thin, normal, thick (opcional)
/>;
```

### 2. LoadingState

Um estado de carregamento em tela cheia, ideal para carregamento inicial de páginas.

```tsx
import { LoadingState } from '@/components/ui/loading-state';

<LoadingState
  message="Carregando quiz..." // Mensagem personalizada (opcional)
  showLogo={true} // Mostrar ou não o logo (opcional)
/>;
```

### 3. Skeleton Loading

Para componentes específicos (como a página de resultados), utilizamos o padrão de "esqueletos" com animação pulse.

```tsx
<div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md" />
```

## Diretrizes de Uso

1. **Evite implementar spinners personalizados**. Sempre use `LoadingSpinner` ou `LoadingState`.

2. Para indicadores de carregamento em botões, use:

   ```tsx
   <Button disabled={isLoading}>
     {isLoading ? (
       <>
         <div className="mr-2 inline-block">
           <LoadingSpinner size="xs" color="#FFFFFF" />
         </div>
         Carregando...
       </>
     ) : (
       'Salvar'
     )}
   </Button>
   ```

3. Para carregamento de página inteira, use `LoadingState`.

4. Para componentes que precisam de um esqueleto durante o carregamento, use a classe `animate-pulse` para criar estados de carregamento visualmente agradáveis.

## Animações Disponíveis

1. `animate-spin` - Rotação 360°
2. `animate-pulse` - Efeito de pulsação
3. `animate-loading-bar` - Barra de progresso animada

## Benefícios

- Interface consistente em todo o aplicativo
- Redução de código duplicado
- Melhor experiência do usuário com feedback visual apropriado
- Facilidade de manutenção
