// 🎯 COMPONENTES MODULARES BASEADOS NO QUIZINTRO TEMPLATE
// 
// Este sistema fornece componentes modulares, independentes e editáveis
// baseados no template QuizIntro fornecido, adaptados para usar a lógica
// e hooks existentes do projeto com integração Supabase.

// Componentes Individuais
export { default as HeaderLogoComponent } from './HeaderLogoComponent';
export { default as TitleSectionComponent } from './TitleSectionComponent';
export { default as OptimizedImageComponent } from './OptimizedImageComponent';
export { default as DescriptionTextComponent } from './DescriptionTextComponent';
export { default as NameFormComponent } from './NameFormComponent';
export { default as FooterComponent } from './FooterComponent';
export { default as SkipLinkComponent } from './SkipLinkComponent';

// Template Completo Compositor
export { default as ModularQuizIntroTemplate } from './ModularQuizIntroTemplate';

// 📋 GUIA DE USO DOS COMPONENTES MODULARES

/**
 * ## COMPONENTES DISPONÍVEIS
 * 
 * ### 1. HeaderLogoComponent
 * - Logo otimizado com WebP/PNG
 * - Barra dourada configurável
 * - Totalmente editável
 * 
 * ### 2. TitleSectionComponent
 * - Título com fonte Playfair Display
 * - Palavras destacadas configuráveis
 * - Cores da marca
 * 
 * ### 3. OptimizedImageComponent
 * - Suporte AVIF/WebP/PNG
 * - Otimização de carregamento
 * - Configuração flexível
 * 
 * ### 4. DescriptionTextComponent
 * - Texto com frases destacadas
 * - Formatação responsiva
 * - Cores da marca
 * 
 * ### 5. NameFormComponent
 * - Integrado com UserDataContext
 * - Conectado com Supabase
 * - Validação em tempo real
 * 
 * ### 6. FooterComponent
 * - Copyright automático
 * - Configuração flexível
 * 
 * ### 7. SkipLinkComponent
 * - Acessibilidade
 * - Navegação por teclado
 * 
 * ### 8. ModularQuizIntroTemplate
 * - Compositor completo
 * - Reproduz layout original
 * - Totalmente configurável
 */

// 🚀 EXEMPLOS DE USO

/**
 * ## USO INDIVIDUAL DOS COMPONENTES
 * 
 * ```tsx
 * import { HeaderLogoComponent, NameFormComponent } from '@/components/modular';
 * 
 * function MyPage() {
 *   return (
 *     <div>
 *       <HeaderLogoComponent 
 *         logoWidth={150}
 *         showGoldenBar={true}
 *         isEditable={true}
 *       />
 *       <NameFormComponent 
 *         onStart={(nome) => console.log('Nome:', nome)}
 *         primaryColor="#B89B7A"
 *         isEditable={false}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * ## USO DO TEMPLATE COMPLETO
 * 
 * ```tsx
 * import { ModularQuizIntroTemplate } from '@/components/modular';
 * 
 * function IntroPage() {
 *   return (
 *     <ModularQuizIntroTemplate
 *       onStart={(nome) => {
 *         console.log('Quiz iniciado por:', nome);
 *         // Navegar para próxima etapa
 *       }}
 *       isEditable={false}
 *       config={{
 *         title: {
 *           title: "Seu título customizado",
 *           highlightedWordsBefore: ["Palavra1"],
 *           fontSize: "lg"
 *         },
 *         form: {
 *           buttonText: "Iniciar Minha Jornada!"
 *         }
 *       }}
 *     />
 *   );
 * }
 * ```
 */

// 🎨 CONFIGURAÇÕES PADRÃO

export const DEFAULT_BRAND_COLORS = {
  primary: '#B89B7A',
  primaryDark: '#A1835D',
  secondary: '#432818',
  background: '#FEFEFE',
  backgroundAlt: '#F8F5F0',
  text: '#432818',
  textLight: '#6B7280',
  border: '#E5E7EB',
} as const;

export const DEFAULT_CONFIG = {
  skipLink: {
    target: '#quiz-form',
    text: 'Pular para o formulário',
  },
  header: {
    logoWidth: 120,
    logoHeight: 50,
    showGoldenBar: true,
    goldenBarWidth: '300px',
    alt: 'Logo Gisele Galvão',
  },
  title: {
    title: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',
    highlightedWordsBefore: ['Chega'],
    highlightedWordsAfter: ['Você'],
    titleColor: '#432818',
    highlightColor: '#B89B7A',
    fontSize: 'lg' as const,
  },
  image: {
    alt: 'Descubra seu estilo predominante e transforme seu guarda-roupa',
    width: 300,
    height: 204,
    aspectRatio: '1.47',
    borderRadius: 'lg',
    showShadow: true,
  },
  description: {
    description: 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
    highlightedPhrases: [
      { text: 'Estilo Predominante', color: '#B89B7A', fontWeight: '600' },
      { text: 'essência', color: '#432818', fontWeight: '600' },
      { text: 'confiança', color: '#432818', fontWeight: '600' },
    ],
    textColor: '#6B7280',
    fontSize: 'base' as const,
  },
  form: {
    label: 'NOME',
    placeholder: 'Digite seu nome',
    buttonText: 'Quero Descobrir meu Estilo Agora!',
    buttonTextDisabled: 'Digite seu nome para continuar',
    errorMessage: 'Por favor, digite seu nome para continuar',
    primaryColor: '#B89B7A',
    primaryDarkColor: '#A1835D',
  },
  footer: {
    companyName: 'Gisele Galvão',
    copyrightText: 'Todos os direitos reservados',
    textColor: '#6B7280',
  },
} as const;

// 🧩 TIPOS PARA TYPESCRIPT

export type ModularComponentType = 
  | 'header-logo'
  | 'title-section'
  | 'optimized-image'
  | 'description-text'
  | 'name-form'
  | 'footer'
  | 'skip-link';

export interface ModularComponentProps {
  className?: string;
  isEditable?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

// 📦 INFORMAÇÕES DOS COMPONENTES

export const COMPONENT_INFO = {
  'header-logo': {
    name: 'Header Logo',
    description: 'Logo com barra dourada',
    category: 'Media',
    icon: '🏛️',
  },
  'title-section': {
    name: 'Title Section',
    description: 'Título com palavras destacadas',
    category: 'Content',
    icon: '📝',
  },
  'optimized-image': {
    name: 'Optimized Image',
    description: 'Imagem otimizada multi-formato',
    category: 'Media',
    icon: '🖼️',
  },
  'description-text': {
    name: 'Description Text',
    description: 'Texto descritivo com destaques',
    category: 'Content',
    icon: '📄',
  },
  'name-form': {
    name: 'Name Form',
    description: 'Formulário conectado com Supabase',
    category: 'Form',
    icon: '📋',
  },
  'footer': {
    name: 'Footer',
    description: 'Rodapé com copyright',
    category: 'Structure',
    icon: '🦶',
  },
  'skip-link': {
    name: 'Skip Link',
    description: 'Link de acessibilidade',
    category: 'Structure',
    icon: '♿',
  },
} as const;