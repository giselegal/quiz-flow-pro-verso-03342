import { BlockDefinition } from "@/types/editor";
import { AlignLeft, Heading, Image, Minus, Square, Type } from "lucide-react";

// Import real components instead of placeholder
import ImageDisplayInlineBlock from "@/components/blocks/inline/ImageDisplayInlineBlock";
// import StyleCardInlineBlock from "@/components/blocks/inline/StyleCardInlineBlock";
import BadgeInlineBlock from "@/components/editor/blocks/BadgeInlineBlock";
import DecorativeBarInlineBlock from "@/components/editor/blocks/DecorativeBarInlineBlock";
import FinalStepEditor from "@/components/editor/blocks/FinalStepEditor";
import FormInputBlock from "@/components/editor/blocks/FormInputBlock";
import HeadingInlineBlock from "@/components/editor/blocks/HeadingInlineBlock";
import LegalNoticeInlineBlock from "@/components/editor/blocks/LegalNoticeInlineBlock";
import OptionsGridBlock from "@/components/editor/blocks/OptionsGridBlock";
import QuizIntroHeaderBlock from "@/components/editor/blocks/QuizIntroHeaderBlock";
import QuizProgressBlock from "@/components/editor/blocks/QuizProgressBlock";
import QuizResultsEditor from "@/components/editor/blocks/QuizResultsEditor";
import SpacerInlineBlock from "@/components/editor/blocks/SpacerInlineBlock";
import StyleResultsEditor from "@/components/editor/blocks/StyleResultsEditor";
import TextInlineBlock from "@/components/editor/blocks/TextInlineBlock";

export const blockDefinitions: BlockDefinition[] = [
  {
    type: "heading",
    name: "Título",
    description: "Título principal com diferentes níveis (H1-H6)",
    category: "Text",
    icon: Heading,
    component: HeadingInlineBlock, // ✅ CONECTADO ao componente correto
    properties: {
      content: {
        type: "string",
        default: "Título Principal",
        label: "Conteúdo",
        description: "Texto do título",
      },
      level: {
        type: "select",
        default: "h2",
        label: "Nível do Título",
        options: [
          { value: "h1", label: "Título 1 (H1)" },
          { value: "h2", label: "Título 2 (H2)" },
          { value: "h3", label: "Título 3 (H3)" },
          { value: "h4", label: "Título 4 (H4)" },
          { value: "h5", label: "Título 5 (H5)" },
          { value: "h6", label: "Título 6 (H6)" },
        ],
      },
      textAlign: {
        type: "select",
        default: "left",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
        ],
      },
      fontWeight: {
        type: "select",
        default: "bold",
        label: "Peso da Fonte",
        options: [
          { value: "light", label: "Leve" },
          { value: "normal", label: "Normal" },
          { value: "medium", label: "Médio" },
          { value: "semibold", label: "Semi-negrito" },
          { value: "bold", label: "Negrito" },
          { value: "extrabold", label: "Extra-negrito" },
        ],
      },
      color: {
        type: "color",
        default: "#1f2937",
        label: "Cor do Texto",
        description: "Cor do texto do título",
      },
      backgroundColor: {
        type: "color",
        default: "transparent",
        label: "Cor de Fundo",
        description: "Cor de fundo do título",
      },
      maxWidth: {
        type: "select",
        default: "full",
        label: "Largura Máxima",
        options: [
          { value: "sm", label: "Pequena" },
          { value: "md", label: "Média" },
          { value: "lg", label: "Grande" },
          { value: "xl", label: "Extra Grande" },
          { value: "2xl", label: "2X Grande" },
          { value: "full", label: "Total" },
        ],
      },
    },
    label: "Título",
    defaultProps: {
      content: "Título Principal",
      level: "h2",
      textAlign: "left",
      fontWeight: "bold",
      color: "#1f2937",
      backgroundColor: "transparent",
      maxWidth: "full",
    },
  },
  {
    type: "headline",
    name: "Título Legado",
    description: "Título principal e subtítulo (versão legada)",
    category: "Text",
    icon: Type,
    component: TextInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      title: {
        type: "string",
        default: "Novo Título",
        label: "Título",
        description: "Título principal",
      },
      subtitle: {
        type: "string",
        default: "",
        label: "Subtítulo",
        description: "Subtítulo opcional",
      },
      alignment: {
        type: "select",
        default: "left",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
          { value: "justify", label: "Justificado" },
        ],
      },
    },
    label: "Título Legado",
    defaultProps: {
      title: "Novo Título",
      subtitle: "",
      alignment: "left",
    },
  },
  {
    type: "text",
    name: "Texto",
    description: "Parágrafo de texto simples",
    category: "Text",
    icon: AlignLeft,
    component: TextInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      text: {
        type: "textarea",
        default: "Digite seu texto aqui...",
        label: "Texto",
        description: "Conteúdo do texto",
      },
      fontSize: {
        type: "select",
        default: "1rem",
        label: "Tamanho da fonte",
        options: [
          { value: "0.875rem", label: "Pequeno" },
          { value: "1rem", label: "Normal" },
          { value: "1.125rem", label: "Médio" },
          { value: "1.25rem", label: "Grande" },
          { value: "1.5rem", label: "Extra Grande" },
        ],
      },
      alignment: {
        type: "select",
        default: "left",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
          { value: "justify", label: "Justificado" },
        ],
      },
    },
    label: "Texto",
    defaultProps: {
      text: "Digite seu texto aqui...",
      fontSize: "1rem",
      alignment: "left",
    },
  },
  {
    type: "decorative-bar-inline",
    name: "Barra Decorativa",
    description: "Barra dourada decorativa com controles de altura e cor",
    category: "Layout",
    icon: Minus,
    component: DecorativeBarInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      height: {
        type: "number",
        default: 4,
        label: "Altura",
        description: "Altura da barra em pixels (1-50px)",
        min: 1,
        max: 50,
        step: 1,
      },
      width: {
        type: "string",
        default: "100%",
        label: "Largura",
        description: "Largura da barra",
      },
      color: {
        type: "color",
        default: "#B89B7A",
        label: "Cor Principal",
        description: "Cor da barra decorativa",
      },
      borderRadius: {
        type: "number",
        default: 3,
        label: "Borda Arredondada",
        description: "Raio da borda em pixels (0-25px)",
        min: 0,
        max: 25,
        step: 1,
      },
      marginTop: {
        type: "number",
        default: 8,
        label: "Margem Superior",
        description: "Espaçamento acima da barra (0-100px)",
        min: 0,
        max: 100,
        step: 1,
      },
      marginBottom: {
        type: "number",
        default: 24,
        label: "Margem Inferior",
        description: "Espaçamento abaixo da barra (0-100px)",
        min: 0,
        max: 100,
        step: 1,
      },
      showShadow: {
        type: "boolean",
        default: true,
        label: "Mostrar Sombra",
        description: "Adicionar sombra à barra",
      },
    },
    label: "Barra Decorativa",
    defaultProps: {
      height: 4,
      width: "100%",
      color: "#B89B7A",
      borderRadius: 3,
      marginTop: 8,
      marginBottom: 24,
      showShadow: true,
    },
  },
  {
    type: "image",
    name: "Imagem",
    description: "Componente de imagem",
    category: "Media",
    icon: Image,
    component: ImageDisplayInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      url: {
        type: "string",
        default: "",
        label: "URL da imagem",
        description: "Endereço da imagem",
      },
      alt: {
        type: "string",
        default: "Imagem",
        label: "Texto alternativo",
        description: "Descrição da imagem para acessibilidade",
      },
      width: {
        type: "string",
        default: "100%",
        label: "Largura",
        description: "Largura da imagem",
      },
      height: {
        type: "string",
        default: "auto",
        label: "Altura",
        description: "Altura da imagem",
      },
      borderRadius: {
        type: "string",
        default: "0.5rem",
        label: "Borda arredondada",
        description: "Raio da borda",
      },
      objectFit: {
        type: "select",
        default: "cover",
        label: "Ajuste da imagem",
        options: [
          { value: "cover", label: "Cobrir" },
          { value: "contain", label: "Conter" },
          { value: "fill", label: "Preencher" },
          { value: "none", label: "Nenhum" },
          { value: "scale-down", label: "Reduzir" },
        ],
      },
    },
    label: "Imagem",
    defaultProps: {
      url: "",
      alt: "Imagem",
      width: "100%",
      height: "auto",
      borderRadius: "0.5rem",
      objectFit: "cover",
    },
  },
  {
    type: "button",
    name: "Botão",
    description: "Botão de ação",
    category: "Interactive",
    icon: Square,
    component: BadgeInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      text: {
        type: "string",
        default: "Clique aqui",
        label: "Texto do botão",
        description: "Texto exibido no botão",
      },
      url: {
        type: "string",
        default: "#",
        label: "URL de destino",
        description: "Link para onde o botão deve levar",
      },
      style: {
        type: "select",
        default: "primary",
        label: "Estilo",
        options: [
          { value: "primary", label: "Primário" },
          { value: "secondary", label: "Secundário" },
          { value: "outline", label: "Contorno" },
          { value: "ghost", label: "Fantasma" },
        ],
      },
    },
    label: "Botão",
    defaultProps: {
      text: "Clique aqui",
      url: "#",
      style: "primary",
    },
  },
  {
    type: "spacer",
    name: "Espaçador",
    description: "Espaço em branco vertical",
    category: "Layout",
    icon: Minus,
    component: SpacerInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      height: {
        type: "number",
        default: 40,
        label: "Altura (px)",
        description: "Altura do espaçamento em pixels",
      },
    },
    label: "Espaçador",
    defaultProps: {
      height: 40,
    },
  },
  {
    type: "quiz-intro-header",
    name: "Cabeçalho do Quiz",
    description: "Componente cabeçalho do quiz com propriedades configuráveis",
    category: "Quiz",
    icon: Type,
    component: QuizIntroHeaderBlock,
    properties: {
      logoUrl: {
        type: "string",
        default:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        label: "URL do Logo",
      },
      logoAlt: {
        type: "string",
        default: "Logo",
        label: "Alt do Logo",
      },
      progressValue: {
        type: "number",
        default: 0,
        label: "Progresso (%)",
        min: 0,
        max: 100,
      },
      showProgress: {
        type: "boolean",
        default: true,
        label: "Mostrar Progresso",
      },
      backgroundColor: {
        type: "color",
        default: "#F9F5F1",
        label: "Cor de Fundo",
      },
      height: {
        type: "number",
        default: 80,
        label: "Altura (px)",
        min: 50,
        max: 200,
      },
    },
    label: "Cabeçalho do Quiz",
    defaultProps: {
      logoUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo",
      progressValue: 0,
      showProgress: true,
      backgroundColor: "#F9F5F1",
      height: 80,
    },
  },

  {
    type: "form-input",
    name: "Campo de Formulário",
    description: "Componente campo de formulário com propriedades configuráveis",
    category: "Form",
    icon: Type,
    component: FormInputBlock,
    properties: {
      label: {
        type: "string",
        default: "Campo de Input",
        label: "Rótulo",
      },
      placeholder: {
        type: "string",
        default: "Digite aqui...",
        label: "Placeholder",
      },
      required: {
        type: "boolean",
        default: false,
        label: "Obrigatório",
      },
      type: {
        type: "select",
        default: "text",
        label: "Tipo",
        options: [
          { value: "text", label: "Texto" },
          { value: "email", label: "Email" },
          { value: "tel", label: "Telefone" },
          { value: "password", label: "Senha" },
        ],
      },
      width: {
        type: "string",
        default: "100%",
        label: "Largura",
      },
      backgroundColor: {
        type: "color",
        default: "#FFFFFF",
        label: "Cor de Fundo",
      },
      borderColor: {
        type: "color",
        default: "#B89B7A",
        label: "Cor da Borda",
      },
    },
    label: "Campo de Formulário",
    defaultProps: {
      label: "Campo de Input",
      placeholder: "Digite aqui...",
      required: false,
      type: "text",
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderColor: "#B89B7A",
    },
  },

  {
    type: "legal-notice-inline",
    name: "Aviso Legal",
    description: "Componente aviso legal com propriedades configuráveis",
    category: "Text",
    icon: Type,
    component: LegalNoticeInlineBlock,
    properties: {
      privacyText: {
        type: "string",
        default: "Política de privacidade",
        label: "Texto de Privacidade",
      },
      copyrightText: {
        type: "string",
        default: "© 2025 Todos os direitos reservados",
        label: "Texto de Copyright",
      },
      termsText: {
        type: "string",
        default: "Termos de uso",
        label: "Texto de Termos",
      },
      fontSize: {
        type: "select",
        default: "text-xs",
        label: "Tamanho da Fonte",
        options: [
          { value: "text-xs", label: "Extra Pequeno" },
          { value: "text-sm", label: "Pequeno" },
          { value: "text-base", label: "Normal" },
        ],
      },
      textAlign: {
        type: "select",
        default: "center",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
        ],
      },
      color: {
        type: "color",
        default: "#6B7280",
        label: "Cor do Texto",
      },
      linkColor: {
        type: "color",
        default: "#B89B7A",
        label: "Cor dos Links",
      },
    },
    label: "Aviso Legal",
    defaultProps: {
      privacyText: "Política de privacidade",
      copyrightText: "© 2025 Todos os direitos reservados",
      termsText: "Termos de uso",
      fontSize: "text-xs",
      textAlign: "center",
      color: "#6B7280",
      linkColor: "#B89B7A",
    },
  },

  {
    type: "image-display-inline",
    name: "Imagem Inline",
    description: "Componente imagem inline com propriedades configuráveis",
    category: "Media",
    icon: Type,
    component: ImageDisplayInlineBlock,
    properties: {
      src: {
        type: "string",
        default: "",
        label: "URL da Imagem",
      },
      alt: {
        type: "string",
        default: "Imagem",
        label: "Texto Alternativo",
      },
      width: {
        type: "string",
        default: "100%",
        label: "Largura",
      },
      height: {
        type: "string",
        default: "auto",
        label: "Altura",
      },
      objectFit: {
        type: "select",
        default: "cover",
        label: "Ajuste",
        options: [
          { value: "cover", label: "Cobrir" },
          { value: "contain", label: "Conter" },
          { value: "fill", label: "Preencher" },
          { value: "none", label: "Nenhum" },
        ],
      },
      borderRadius: {
        type: "number",
        default: 8,
        label: "Borda Arredondada",
        min: 0,
        max: 50,
      },
      shadow: {
        type: "boolean",
        default: false,
        label: "Sombra",
      },
      alignment: {
        type: "select",
        default: "center",
        label: "Alinhamento",
        options: [
          { value: "left", label: "Esquerda" },
          { value: "center", label: "Centro" },
          { value: "right", label: "Direita" },
        ],
      },
    },
    label: "Imagem Inline",
    defaultProps: {
      src: "",
      alt: "Imagem",
      width: "100%",
      height: "auto",
      objectFit: "cover",
      borderRadius: 8,
      shadow: false,
      alignment: "center",
    },
  },

  {
    type: "options-grid",
    name: "Grade de Opções",
    description: "Componente grade de opções com propriedades configuráveis",
    category: "Quiz",
    icon: Type,
    component: OptionsGridBlock,
    properties: {
      question: {
        type: "textarea",
        default: "Qual opção você escolhe?",
        label: "Pergunta",
      },
      columns: {
        type: "select",
        default: "2",
        label: "Colunas",
        options: [
          { value: "1", label: "1 Coluna" },
          { value: "2", label: "2 Colunas" },
          { value: "3", label: "3 Colunas" },
          { value: "4", label: "4 Colunas" },
        ],
      },
      gap: {
        type: "number",
        default: 16,
        label: "Espaçamento",
        min: 0,
        max: 50,
      },
      selectionMode: {
        type: "select",
        default: "single",
        label: "Seleção",
        options: [
          { value: "single", label: "Única" },
          { value: "multiple", label: "Múltipla" },
        ],
      },
      primaryColor: {
        type: "color",
        default: "#B89B7A",
        label: "Cor Principal",
      },
      accentColor: {
        type: "color",
        default: "#D4C2A8",
        label: "Cor de Destaque",
      },
      showImages: {
        type: "boolean",
        default: true,
        label: "Mostrar Imagens",
      },
      imagePosition: {
        type: "select",
        default: "top",
        label: "Posição da Imagem",
        options: [
          { value: "top", label: "Acima" },
          { value: "left", label: "Esquerda" },
          { value: "right", label: "Direita" },
          { value: "background", label: "Fundo" },
        ],
      },
    },
    label: "Grade de Opções",
    defaultProps: {
      question: "Qual opção você escolhe?",
      columns: "2",
      gap: 16,
      selectionMode: "single",
      primaryColor: "#B89B7A",
      accentColor: "#D4C2A8",
      showImages: true,
      imagePosition: "top",
    },
  },

  {
    type: "quiz-progress",
    name: "Progresso do Quiz",
    description: "Componente progresso do quiz com propriedades configuráveis",
    category: "Quiz",
    icon: Type,
    component: QuizProgressBlock,
    properties: {
      currentStep: {
        type: "number",
        default: 1,
        label: "Etapa Atual",
        min: 1,
        max: 21,
      },
      totalSteps: {
        type: "number",
        default: 21,
        label: "Total de Etapas",
        min: 1,
        max: 50,
      },
      showNumbers: {
        type: "boolean",
        default: true,
        label: "Mostrar Números",
      },
      showPercentage: {
        type: "boolean",
        default: true,
        label: "Mostrar Percentual",
      },
      barColor: {
        type: "color",
        default: "#B89B7A",
        label: "Cor da Barra",
      },
      backgroundColor: {
        type: "color",
        default: "#E5E7EB",
        label: "Cor de Fundo",
      },
      height: {
        type: "number",
        default: 8,
        label: "Altura (px)",
        min: 4,
        max: 20,
      },
      borderRadius: {
        type: "number",
        default: 4,
        label: "Borda Arredondada",
        min: 0,
        max: 20,
      },
      animated: {
        type: "boolean",
        default: true,
        label: "Animado",
      },
    },
    label: "Progresso do Quiz",
    defaultProps: {
      currentStep: 1,
      totalSteps: 21,
      showNumbers: true,
      showPercentage: true,
      barColor: "#B89B7A",
      backgroundColor: "#E5E7EB",
      height: 8,
      borderRadius: 4,
      animated: true,
    },
  },

  {
    type: "quiz-results",
    name: "Resultados do Quiz",
    description: "Componente resultados do quiz com propriedades configuráveis",
    category: "Quiz",
    icon: Type,
    component: QuizResultsEditor,
    properties: {
      title: {
        type: "string",
        default: "Seus Resultados",
        label: "Título",
      },
      showScores: {
        type: "boolean",
        default: true,
        label: "Mostrar Pontuações",
      },
      showPercentages: {
        type: "boolean",
        default: true,
        label: "Mostrar Percentuais",
      },
      showRanking: {
        type: "boolean",
        default: false,
        label: "Mostrar Ranking",
      },
      primaryColor: {
        type: "color",
        default: "#B89B7A",
        label: "Cor Principal",
      },
      secondaryColor: {
        type: "color",
        default: "#D4C2A8",
        label: "Cor Secundária",
      },
      layout: {
        type: "select",
        default: "vertical",
        label: "Layout",
        options: [
          { value: "vertical", label: "Vertical" },
          { value: "horizontal", label: "Horizontal" },
          { value: "grid", label: "Grade" },
        ],
      },
      showImages: {
        type: "boolean",
        default: true,
        label: "Mostrar Imagens",
      },
      animatedEntry: {
        type: "boolean",
        default: true,
        label: "Entrada Animada",
      },
    },
    label: "Resultados do Quiz",
    defaultProps: {
      title: "Seus Resultados",
      showScores: true,
      showPercentages: true,
      showRanking: false,
      primaryColor: "#B89B7A",
      secondaryColor: "#D4C2A8",
      layout: "vertical",
      showImages: true,
      animatedEntry: true,
    },
  },

  {
    type: "style-results",
    name: "Resultados de Estilo",
    description: "Componente resultados de estilo com propriedades configuráveis",
    category: "Quiz",
    icon: Type,
    component: StyleResultsEditor,
    properties: {
      title: {
        type: "string",
        default: "Seu Estilo Predominante",
        label: "Título",
      },
      showAllStyles: {
        type: "boolean",
        default: false,
        label: "Mostrar Todos os Estilos",
      },
      showGuideImage: {
        type: "boolean",
        default: true,
        label: "Mostrar Guia",
      },
      guideImageUrl: {
        type: "string",
        default:
          "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
        label: "URL do Guia",
      },
      primaryStyle: {
        type: "select",
        default: "Natural",
        label: "Estilo Principal",
        options: [
          { value: "Natural", label: "Natural" },
          { value: "Clássico", label: "Clássico" },
          { value: "Elegante", label: "Elegante" },
          { value: "Contemporâneo", label: "Contemporâneo" },
          { value: "Romântico", label: "Romântico" },
        ],
      },
      layout: {
        type: "select",
        default: "card",
        label: "Layout",
        options: [
          { value: "card", label: "Card" },
          { value: "banner", label: "Banner" },
          { value: "split", label: "Dividido" },
        ],
      },
      showDescription: {
        type: "boolean",
        default: true,
        label: "Mostrar Descrição",
      },
      showPercentage: {
        type: "boolean",
        default: true,
        label: "Mostrar Percentual",
      },
    },
    label: "Resultados de Estilo",
    defaultProps: {
      title: "Seu Estilo Predominante",
      showAllStyles: false,
      showGuideImage: true,
      guideImageUrl:
        "https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp",
      primaryStyle: "Natural",
      layout: "card",
      showDescription: true,
      showPercentage: true,
    },
  },

  {
    type: "final-step",
    name: "Etapa Final",
    description: "Componente etapa final com propriedades configuráveis",
    category: "Quiz",
    icon: Type,
    component: FinalStepEditor,
    properties: {
      stepNumber: {
        type: "number",
        default: 21,
        label: "Número da Etapa",
        min: 1,
        max: 50,
      },
      title: {
        type: "string",
        default: "Seu Estilo Predominante",
        label: "Título",
      },
      subtitle: {
        type: "string",
        default: "Descubra seu estilo de moda único",
        label: "Subtítulo",
      },
      showNavigation: {
        type: "boolean",
        default: true,
        label: "Mostrar Navegação",
      },
      showProgress: {
        type: "boolean",
        default: true,
        label: "Mostrar Progresso",
      },
      backgroundColor: {
        type: "color",
        default: "#F9F5F1",
        label: "Cor de Fundo",
      },
      accentColor: {
        type: "color",
        default: "#B89B7A",
        label: "Cor de Destaque",
      },
      layout: {
        type: "select",
        default: "centered",
        label: "Layout",
        options: [
          { value: "centered", label: "Centralizado" },
          { value: "split", label: "Dividido" },
          { value: "full", label: "Tela Cheia" },
        ],
      },
    },
    label: "Etapa Final",
    defaultProps: {
      stepNumber: 21,
      title: "Seu Estilo Predominante",
      subtitle: "Descubra seu estilo de moda único",
      showNavigation: true,
      showProgress: true,
      backgroundColor: "#F9F5F1",
      accentColor: "#B89B7A",
      layout: "centered",
    },
  },
];

export const getCategories = (): string[] => {
  const categories = new Set<string>();
  blockDefinitions.forEach(block => {
    categories.add(block.category);
  });
  return Array.from(categories);
};

export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return blockDefinitions.filter(block => block.category === category);
};

export const getBlockByType = (type: string): BlockDefinition | undefined => {
  return blockDefinitions.find(block => block.type === type);
};
