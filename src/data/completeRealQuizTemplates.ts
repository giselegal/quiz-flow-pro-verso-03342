// Templates completos com componentes visuais padronizados
export const COMPLETE_REAL_TEMPLATES = {
  intro: {
    id: "intro",
    title: "Descubra Seu Estilo Pessoal",
    type: "intro" as const,
    progress: 0,
    showHeader: true,
    showProgress: false,
    components: [
      {
        id: "intro-title",
        type: "heading",
        data: {
          text: "Descubra Seu Estilo Pessoal",
          level: 1,
          color: "#432818",
        },
        style: {
          textAlign: "center",
          marginBottom: "1rem",
        },
      },
      {
        id: "intro-subtitle",
        type: "paragraph",
        data: {
          text: "Responda algumas perguntas rápidas e descubra qual estilo combina mais com você",
          color: "#8F7A6A",
        },
        style: {
          textAlign: "center",
          fontSize: "1.1rem",
        },
      },
    ],
  },

  loading: {
    id: "loading",
    title: "Calculando resultado...",
    type: "loading" as const,
    progress: 90,
    showHeader: true,
    showProgress: true,
    components: [
      {
        id: "loading-spinner",
        type: "loading",
        data: {
          text: "Analisando suas respostas...",
        },
        style: {
          textAlign: "center",
          padding: "2rem",
        },
      },
    ],
  },

  result: {
    id: "result",
    title: "Seu Resultado",
    type: "result" as const,
    progress: 100,
    showHeader: true,
    showProgress: false,
    components: [
      {
        id: "result-title",
        type: "heading",
        data: {
          text: "Seu Estilo é...",
          level: 1,
          color: "#432818",
        },
        style: {
          textAlign: "center",
          marginBottom: "2rem",
        },
      },
    ],
  },

  offer: {
    id: "offer",
    title: "Oferta Especial",
    type: "offer" as const,
    progress: 100,
    showHeader: true,
    showProgress: false,
    components: [
      {
        id: "offer-title",
        type: "heading",
        data: {
          text: "Oferta Especial Para Você",
          level: 1,
          color: "#432818",
        },
        style: {
          textAlign: "center",
          marginBottom: "2rem",
        },
      },
    ],
  },
};

// Questões normais Q1-Q10 com componentes visuais completos
export const generateCompleteNormalQuestions = () => {
  return [
    {
      id: "q1",
      title: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
      type: "question" as const,
      progress: 10,
      showHeader: true,
      showProgress: true,
      questionType: "both",
      multiSelect: 3,
      components: [
        {
          id: "q1-question",
          type: "multipleChoice",
          data: {
            text: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
            maxSelections: 3,
            options: [
              {
                id: "1a",
                text: "Conforto, leveza e praticidade no vestir",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
                styleCategory: "Natural",
                points: { natural: 1 },
              },
              {
                id: "1b",
                text: "Discrição, caimento clássico e sobriedade",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
                styleCategory: "Clássico",
                points: { classico: 1 },
              },
              {
                id: "1c",
                text: "Praticidade com um toque de estilo atual",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
                styleCategory: "Contemporâneo",
                points: { contemporaneo: 1 },
              },
              {
                id: "1d",
                text: "Elegância refinada, moderna e sem exageros",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
                styleCategory: "Elegante",
                points: { elegante: 1 },
              },
              {
                id: "1e",
                text: "Delicadeza em tecidos suaves e fluidos",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
                styleCategory: "Romântico",
                points: { romantico: 1 },
              },
              {
                id: "1f",
                text: "Sensualidade com destaque para o corpo",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
                styleCategory: "Sexy",
                points: { sexy: 1 },
              },
              {
                id: "1g",
                text: "Impacto visual com peças estruturadas e assimétricas",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
                styleCategory: "Dramático",
                points: { dramatico: 1 },
              },
              {
                id: "1h",
                text: "Mix criativo com formas ousadas e originais",
                imageUrl:
                  "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
                styleCategory: "Criativo",
                points: { criativo: 1 },
              },
            ],
          },
          style: {
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
    // Outras questões Q2-Q10 seriam geradas da mesma forma...
  ];
};

// Questões estratégicas S1-S6 com componentes visuais completos
export const generateCompleteStrategicQuestions = () => {
  return [
    // Transição 1
    {
      id: "transition1",
      title: "🕐 Enquanto calculamos o seu resultado...",
      type: "transition" as const,
      progress: 75,
      showHeader: true,
      showProgress: true,
      components: [
        {
          id: "transition1-content",
          type: "text",
          data: {
            text: "🕐 Enquanto calculamos o seu resultado...\n\nQueremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.\nA ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.\n\n💬 Responda com sinceridade. Isso é só entre você e a sua nova versão.",
            fontSize: "1.1rem",
            textAlign: "center",
            color: "#432818",
            lineHeight: "1.6",
          },
          style: {
            backgroundColor: "#f8f9fa",
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
          },
        },
      ],
    },

    // S1: Como você se vê hoje?
    {
      id: "s1",
      title: "Como você se vê hoje?",
      type: "question" as const,
      progress: 78,
      showHeader: true,
      showProgress: true,
      questionType: "text",
      components: [
        {
          id: "s1-question",
          type: "singleChoice",
          data: {
            text: "Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?",
            options: [
              {
                id: "s1a",
                text: "Me sinto desconectada da mulher que sou hoje",
                category: "low_confidence",
              },
              {
                id: "s1b",
                text: "Tenho dúvidas sobre o que realmente me valoriza",
                category: "uncertain",
              },
              {
                id: "s1c",
                text: "Às vezes acerto, às vezes erro",
                category: "moderate",
              },
              {
                id: "s1d",
                text: "Me sinto segura, mas sei que posso evoluir",
                category: "confident",
              },
            ],
            isStrategic: true,
          },
          style: {
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },

    // S5: Preço R$97
    {
      id: "s5",
      title: "Se esse conteúdo completo custasse R$ 97,00...",
      type: "question" as const,
      progress: 90,
      showHeader: true,
      showProgress: true,
      questionType: "text",
      components: [
        {
          id: "s5-question",
          type: "singleChoice",
          data: {
            text: "Se esse conteúdo completo custasse R$ 97,00 — incluindo Guia de Estilo, bônus especiais e um passo a passo prático para transformar sua imagem pessoal — você consideraria um bom investimento?",
            options: [
              {
                id: "s5a",
                text: "Sim! Por esse resultado, vale muito",
                category: "high_value",
              },
              {
                id: "s5b",
                text: "Sim, mas só se eu tiver certeza de que funciona pra mim",
                category: "need_proof",
              },
              {
                id: "s5c",
                text: "Talvez — depende do que está incluso",
                category: "need_details",
              },
              {
                id: "s5d",
                text: "Não, ainda não estou pronta para investir",
                category: "not_ready",
              },
            ],
            isStrategic: true,
          },
          style: {
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          },
        },
      ],
    },
  ];
};
