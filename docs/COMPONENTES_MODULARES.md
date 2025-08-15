# 🎯 Componentes Modulares QuizIntro

Sistema de componentes modulares, independentes e editáveis baseado no template QuizIntro original, adaptados para usar a lógica e hooks existentes do projeto com integração Supabase.

## 🚀 Características Principais

- **Modulares**: Cada componente é independente e pode ser usado isoladamente
- **Editáveis**: Todos os componentes suportam modo de edição via propriedades
- **Conectados**: Integração completa com hooks e Supabase existentes
- **Otimizados**: Imagens multi-formato (AVIF/WebP/PNG) e performance otimizada
- **Acessíveis**: Skip links e navegação por teclado
- **Responsivos**: Design mobile-first com breakpoints configuráveis

## 📦 Componentes Disponíveis

### 1. HeaderLogoComponent
Logo otimizado com barra dourada configurável.

```tsx
import { HeaderLogoComponent } from '@/components/modular';

<HeaderLogoComponent
  logoWidth={120}
  logoHeight={50}
  showGoldenBar={true}
  goldenBarWidth="300px"
  alt="Logo da Empresa"
  isEditable={false}
/>
```

### 2. TitleSectionComponent
Título com fonte Playfair Display e palavras destacadas.

```tsx
import { TitleSectionComponent } from '@/components/modular';

<TitleSectionComponent
  title="Chega de um guarda-roupa lotado e da sensação de que nada combina com Você."
  highlightedWordsBefore={["Chega"]}
  highlightedWordsAfter={["Você"]}
  titleColor="#432818"
  highlightColor="#B89B7A"
  fontSize="lg"
/>
```

### 3. OptimizedImageComponent
Imagem com múltiplos formatos e otimização automática.

```tsx
import { OptimizedImageComponent } from '@/components/modular';

<OptimizedImageComponent
  width={300}
  height={204}
  aspectRatio="1.47"
  borderRadius="lg"
  showShadow={true}
  alt="Descrição da imagem"
/>
```

### 4. DescriptionTextComponent
Texto descritivo com frases destacadas configuráveis.

```tsx
import { DescriptionTextComponent } from '@/components/modular';

<DescriptionTextComponent
  description="Seu texto descritivo aqui..."
  highlightedPhrases={[
    { text: "palavra destacada", color: "#B89B7A", fontWeight: "600" }
  ]}
  textColor="#6B7280"
  fontSize="base"
/>
```

### 5. NameFormComponent
Formulário conectado com UserDataContext e Supabase.

```tsx
import { NameFormComponent } from '@/components/modular';

<NameFormComponent
  label="NOME"
  placeholder="Digite seu nome"
  buttonText="Quero Descobrir meu Estilo Agora!"
  onStart={(nome) => console.log('Quiz iniciado por:', nome)}
  primaryColor="#B89B7A"
  primaryDarkColor="#A1835D"
/>
```

### 6. FooterComponent
Rodapé com copyright automático.

```tsx
import { FooterComponent } from '@/components/modular';

<FooterComponent
  companyName="Gisele Galvão"
  copyrightText="Todos os direitos reservados"
  textColor="#6B7280"
/>
```

### 7. SkipLinkComponent
Link de acessibilidade para navegação por teclado.

```tsx
import { SkipLinkComponent } from '@/components/modular';

<SkipLinkComponent
  target="#quiz-form"
  text="Pular para o formulário"
/>
```

## 🏗️ Template Completo

Para usar todos os componentes juntos, use o `ModularQuizIntroTemplate`:

```tsx
import { ModularQuizIntroTemplate } from '@/components/modular';

function IntroPage() {
  const handleStartQuiz = (nome: string) => {
    console.log('Quiz iniciado por:', nome);
    // Navegar para próxima etapa
  };

  return (
    <ModularQuizIntroTemplate
      onStart={handleStartQuiz}
      isEditable={false}
      config={{
        title: {
          title: "Seu título personalizado",
          highlightedWordsBefore: ["Palavra1"],
          fontSize: "lg"
        },
        form: {
          buttonText: "Iniciar Minha Jornada!"
        },
        image: {
          width: 350,
          height: 238
        }
      }}
    />
  );
}
```

## 🎨 Configurações Padrão

```tsx
import { DEFAULT_CONFIG, DEFAULT_BRAND_COLORS } from '@/components/modular';

// Cores da marca
const colors = DEFAULT_BRAND_COLORS;
// {
//   primary: '#B89B7A',
//   primaryDark: '#A1835D',
//   secondary: '#432818',
//   background: '#FEFEFE',
//   // ...
// }

// Configuração padrão completa
const config = DEFAULT_CONFIG;
```

## 🛠️ Modo de Edição

Todos os componentes suportam modo de edição:

```tsx
<HeaderLogoComponent
  isEditable={true}
  onPropertyChange={(key, value) => {
    console.log(`Propriedade ${key} alterada para:`, value);
  }}
/>
```

## 🔗 Integração com Hooks Existentes

O `NameFormComponent` já está integrado com:

- **UserDataContext**: Para gerenciamento de estado do usuário
- **Supabase**: Para persistência automática dos dados
- **useUserName**: Hook para coleta e validação de nome

```tsx
// O componente usa automaticamente:
import { useUserName } from '@/context/UserDataContext';

// E persiste os dados via Supabase automaticamente
```

## 📱 Demo Interativa

Acesse `/demo/modular` para ver todos os componentes em ação com:

- Modo de edição ativo/inativo
- Componentes individuais
- Template completo
- Configurações personalizadas

## 🎯 Casos de Uso

### 1. Landing Page de Quiz
Use o template completo para páginas de introdução de quiz.

### 2. Páginas de Captura
Use `HeaderLogoComponent` + `NameFormComponent` para páginas simples.

### 3. Seções de Conteúdo
Use `TitleSectionComponent` + `DescriptionTextComponent` para seções informativas.

### 4. Galeria de Imagens
Use `OptimizedImageComponent` para exibição otimizada de imagens.

## 🚨 Importante

- Todos os componentes respeitam as cores da marca definidas
- A integração com Supabase é automática no `NameFormComponent`
- Os componentes são acessíveis por padrão
- Suportam modo escuro via CSS custom properties
- São responsivos e mobile-first

## 📄 Licença

Estes componentes fazem parte do sistema Quiz Quest Challenge Verse e seguem a mesma licença do projeto principal.