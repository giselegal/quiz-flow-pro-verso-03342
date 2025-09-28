#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CORREÇÃO AUTOMÁTICA DOS 21 TEMPLATES DE ETAPAS\n');

const stepsDir = path.join(__dirname, 'src/components/steps');

// 🎯 DEFINIÇÕES CORRETAS PARA CADA ETAPA
const stepsConfig = {
  'Step02Template.tsx': {
    question: 'Como você descreveria sua rotina diária?',
    stepNumber: 2,
    progress: 10,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838121/20250509_2138_Rotina_e_Energia_simple_compose_01jtvt0g29ddz8cq7xt7d3c7kz_fqfkqs.webp',
    options: [
      {
        value: 'corrida',
        label: 'Correria total - sempre em movimento',
        points: {
          elegante: 1,
          casual: 3,
          criativo: 2,
          classico: 1,
          romantico: 1,
          minimalista: 2,
          boho: 1,
        },
      },
      {
        value: 'equilibrada',
        label: 'Equilibrada - trabalho e descanso',
        points: {
          elegante: 2,
          casual: 2,
          criativo: 2,
          classico: 3,
          romantico: 2,
          minimalista: 3,
          boho: 2,
        },
      },
      {
        value: 'tranquila',
        label: 'Tranquila - prefiro o meu ritmo',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 2,
          classico: 2,
          romantico: 3,
          minimalista: 2,
          boho: 3,
        },
      },
      {
        value: 'criativa',
        label: 'Criativa - sempre em novos projetos',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 2,
          minimalista: 1,
          boho: 3,
        },
      },
    ],
  },
  'Step03Template.tsx': {
    question: 'Qual peça de roupa te faz sentir mais confiante?',
    stepNumber: 3,
    progress: 15,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838124/20250509_2139_Confian%C3%A7a_e_Estilo_simple_compose_01jtvt1j8s09a2vvp6jzke52md_iey8qo.webp',
    options: [
      {
        value: 'blazer',
        label: 'Blazer bem cortado',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 2,
          boho: 1,
        },
      },
      {
        value: 'jeans-perfeito',
        label: 'Jeans perfeito',
        points: {
          elegante: 1,
          casual: 3,
          criativo: 2,
          classico: 2,
          romantico: 1,
          minimalista: 2,
          boho: 2,
        },
      },
      {
        value: 'vestido-feminino',
        label: 'Vestido feminino',
        points: {
          elegante: 2,
          casual: 1,
          criativo: 2,
          classico: 2,
          romantico: 3,
          minimalista: 1,
          boho: 2,
        },
      },
      {
        value: 'peca-unica',
        label: 'Peça única e diferente',
        points: {
          elegante: 1,
          casual: 1,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 1,
          boho: 3,
        },
      },
    ],
  },
  'Step04Template.tsx': {
    question: 'Quais cores mais te atraem no guarda-roupa?',
    stepNumber: 4,
    progress: 20,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838127/20250509_2140_Cores_e_Personalidade_simple_compose_01jtvt2mzfbcq68h6e1q15zj0y_blnmwh.webp',
    options: [
      {
        value: 'neutros-sofisticados',
        label: 'Neutros sofisticados (preto, cinza, bege)',
        points: {
          elegante: 3,
          casual: 2,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 3,
          boho: 1,
        },
      },
      {
        value: 'cores-vibrantes',
        label: 'Cores vibrantes e alegres',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 2,
          minimalista: 1,
          boho: 3,
        },
      },
      {
        value: 'tons-pastel',
        label: 'Tons pastel e delicados',
        points: {
          elegante: 2,
          casual: 1,
          criativo: 2,
          classico: 2,
          romantico: 3,
          minimalista: 2,
          boho: 2,
        },
      },
      {
        value: 'basicos-versateis',
        label: 'Básicos versáteis para qualquer ocasião',
        points: {
          elegante: 2,
          casual: 3,
          criativo: 1,
          classico: 2,
          romantico: 1,
          minimalista: 3,
          boho: 1,
        },
      },
    ],
  },
  'Step05Template.tsx': {
    question: 'Para ocasiões especiais, você prefere:',
    stepNumber: 5,
    progress: 25,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838130/20250509_2141_Ocasi%C3%B5es_Especiais_simple_compose_01jtvt3q1sggne0aj2nzm5kxtw_brvmhu.webp',
    options: [
      {
        value: 'elegancia-classica',
        label: 'Elegância clássica e atemporal',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 2,
          minimalista: 2,
          boho: 1,
        },
      },
      {
        value: 'conforto-estiloso',
        label: 'Conforto estiloso',
        points: {
          elegante: 1,
          casual: 3,
          criativo: 2,
          classico: 2,
          romantico: 1,
          minimalista: 3,
          boho: 2,
        },
      },
      {
        value: 'romantismo-feminino',
        label: 'Romantismo e feminilidade',
        points: {
          elegante: 2,
          casual: 1,
          criativo: 2,
          classico: 2,
          romantico: 3,
          minimalista: 1,
          boho: 2,
        },
      },
      {
        value: 'originalidade-criativa',
        label: 'Originalidade e criatividade',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 1,
          boho: 3,
        },
      },
    ],
  },
  'Step06Template.tsx': {
    question: 'Qual estilo de cabelo combina mais com você?',
    stepNumber: 6,
    progress: 30,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838133/20250509_2142_Cabelo_e_Estilo_simple_compose_01jtvt4st04zrr6gk5d7a0qj1v_uqtlaz.webp',
    options: [
      {
        value: 'liso-impecavel',
        label: 'Liso e impecável',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 3,
          boho: 1,
        },
      },
      {
        value: 'ondas-naturais',
        label: 'Ondas naturais e descontraídas',
        points: {
          elegante: 1,
          casual: 3,
          criativo: 2,
          classico: 2,
          romantico: 2,
          minimalista: 2,
          boho: 3,
        },
      },
      {
        value: 'cachos-definidos',
        label: 'Cachos bem definidos e volumosos',
        points: {
          elegante: 2,
          casual: 2,
          criativo: 2,
          classico: 1,
          romantico: 3,
          minimalista: 1,
          boho: 3,
        },
      },
      {
        value: 'corte-moderno',
        label: 'Corte moderno e diferenciado',
        points: {
          elegante: 2,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 2,
          boho: 2,
        },
      },
    ],
  },
  'Step07Template.tsx': {
    question: 'Seus acessórios favoritos são:',
    stepNumber: 7,
    progress: 35,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838136/20250509_2143_Acess%C3%B3rios_e_Estilo_simple_compose_01jtvt5vk8n4fj2q2r5f9g4hmw_mtwhnn.webp',
    options: [
      {
        value: 'joias-classicas',
        label: 'Joias clássicas e atemporais',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 2,
          minimalista: 2,
          boho: 1,
        },
      },
      {
        value: 'bolsas-praticas',
        label: 'Bolsas práticas e funcionais',
        points: {
          elegante: 1,
          casual: 3,
          criativo: 1,
          classico: 2,
          romantico: 1,
          minimalista: 3,
          boho: 1,
        },
      },
      {
        value: 'bijoux-delicadas',
        label: 'Bijuterias delicadas e femininas',
        points: {
          elegante: 2,
          casual: 2,
          criativo: 2,
          classico: 2,
          romantico: 3,
          minimalista: 2,
          boho: 2,
        },
      },
      {
        value: 'pecas-artesanais',
        label: 'Peças artesanais e únicas',
        points: {
          elegante: 1,
          casual: 1,
          criativo: 3,
          classico: 1,
          romantico: 2,
          minimalista: 1,
          boho: 3,
        },
      },
    ],
  },
  'Step08Template.tsx': {
    question: 'Quando o assunto são estampas, você prefere:',
    stepNumber: 8,
    progress: 40,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838139/20250509_2144_Estampas_e_Padr%C3%B5es_simple_compose_01jtvt6y84tcz2w0tqp7j3rbpy_nwevaw.webp',
    options: [
      {
        value: 'sem-estampas',
        label: 'Prefiro sem estampas - lisas e elegantes',
        points: {
          elegante: 3,
          casual: 2,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 3,
          boho: 1,
        },
      },
      {
        value: 'listras-classicas',
        label: 'Listras clássicas',
        points: {
          elegante: 2,
          casual: 3,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 2,
          boho: 1,
        },
      },
      {
        value: 'florais-delicadas',
        label: 'Florais delicadas e femininas',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 2,
          classico: 2,
          romantico: 3,
          minimalista: 1,
          boho: 3,
        },
      },
      {
        value: 'geometricas-modernas',
        label: 'Geométricas e modernas',
        points: {
          elegante: 2,
          casual: 1,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 2,
          boho: 2,
        },
      },
    ],
  },
  'Step09Template.tsx': {
    question: 'Seus calçados preferidos para o dia a dia:',
    stepNumber: 9,
    progress: 45,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838142/20250509_2145_Cal%C3%A7ados_e_Conforto_simple_compose_01jtvt805qp6r9vbhm0ny4qp3g_lf4grr.webp',
    options: [
      {
        value: 'salto-alto',
        label: 'Salto alto - sempre elegante',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 2,
          romantico: 3,
          minimalista: 1,
          boho: 1,
        },
      },
      {
        value: 'tenis-estiloso',
        label: 'Tênis estiloso e confortável',
        points: {
          elegante: 1,
          casual: 3,
          criativo: 2,
          classico: 1,
          romantico: 1,
          minimalista: 2,
          boho: 2,
        },
      },
      {
        value: 'sapatilha-delicada',
        label: 'Sapatilha delicada',
        points: {
          elegante: 2,
          casual: 2,
          criativo: 1,
          classico: 3,
          romantico: 3,
          minimalista: 3,
          boho: 1,
        },
      },
      {
        value: 'botas-personalizadas',
        label: 'Botas ou sapatos com personalidade',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 1,
          boho: 3,
        },
      },
    ],
  },
  'Step10Template.tsx': {
    question: 'Seu estilo de maquiagem preferido:',
    stepNumber: 10,
    progress: 50,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838145/20250509_2146_Maquiagem_e_Beleza_simple_compose_01jtvt92fckdz7pz5r9n3j4q8m_bvtwpb.webp',
    options: [
      {
        value: 'sofisticada-marcante',
        label: 'Sofisticada e marcante',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 2,
          romantico: 2,
          minimalista: 1,
          boho: 1,
        },
      },
      {
        value: 'natural-pratica',
        label: 'Natural e prática',
        points: {
          elegante: 1,
          casual: 3,
          criativo: 1,
          classico: 2,
          romantico: 1,
          minimalista: 3,
          boho: 2,
        },
      },
      {
        value: 'romantica-delicada',
        label: 'Romântica e delicada',
        points: {
          elegante: 2,
          casual: 1,
          criativo: 2,
          classico: 3,
          romantico: 3,
          minimalista: 2,
          boho: 2,
        },
      },
      {
        value: 'colorida-criativa',
        label: 'Colorida e criativa',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 1,
          boho: 3,
        },
      },
    ],
  },
  'Step11Template.tsx': {
    question: 'No ambiente de trabalho, você se veste:',
    stepNumber: 11,
    progress: 55,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838148/20250509_2147_Trabalho_e_Profissionalismo_simple_compose_01jtvta4gb3qhd4d6v3xr3jvtw_wnpshv.webp',
    options: [
      {
        value: 'executiva-formal',
        label: 'Executiva e formal',
        points: {
          elegante: 3,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 1,
          minimalista: 2,
          boho: 1,
        },
      },
      {
        value: 'smart-casual',
        label: 'Smart casual - elegante mas descontraída',
        points: {
          elegante: 2,
          casual: 2,
          criativo: 2,
          classico: 2,
          romantico: 2,
          minimalista: 3,
          boho: 1,
        },
      },
      {
        value: 'feminina-profissional',
        label: 'Feminina e profissional',
        points: {
          elegante: 2,
          casual: 1,
          criativo: 1,
          classico: 3,
          romantico: 3,
          minimalista: 2,
          boho: 1,
        },
      },
      {
        value: 'criativa-autentica',
        label: 'Criativa e autêntica',
        points: {
          elegante: 1,
          casual: 2,
          criativo: 3,
          classico: 1,
          romantico: 1,
          minimalista: 1,
          boho: 3,
        },
      },
    ],
  },
};

// 🎯 TEMPLATES ESPECIAIS PARA ETAPAS DE TRANSIÇÃO E RESULTADO
const specialTemplates = {
  'Step12Template.tsx': {
    title: 'Analisando seu Perfil...',
    stepNumber: 12,
    progress: 60,
    description: 'Estamos processando suas respostas para identificar seu estilo único.',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838151/20250509_2148_An%C3%A1lise_de_Dados_simple_compose_01jtvtb6j93t4r2hvdza0n0fqm_axmjjx.webp',
  },
  'Step13Template.tsx': {
    question: 'Quanto você investe mensalmente em roupas?',
    stepNumber: 13,
    progress: 65,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838154/20250509_2149_Or%C3%A7amento_e_Investimento_simple_compose_01jtvtc8grfgxdq3pvr9c4jqan_drrewn.webp',
    options: [
      { value: 'ate-200', label: 'Até R$ 200', segment: 'economica' },
      { value: '200-500', label: 'R$ 200 - R$ 500', segment: 'media' },
      { value: '500-1000', label: 'R$ 500 - R$ 1000', segment: 'premium' },
      { value: 'acima-1000', label: 'Acima de R$ 1000', segment: 'luxury' },
    ],
  },
  'Step14Template.tsx': {
    question: 'Qual sua faixa etária?',
    stepNumber: 14,
    progress: 70,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838157/20250509_2150_Idade_e_Experi%C3%AAncia_simple_compose_01jtvtdbkfcj3g9f8tmexn5chm_wppuxb.webp',
    options: [
      { value: '18-25', label: '18-25 anos', segment: 'jovem' },
      { value: '26-35', label: '26-35 anos', segment: 'adulta' },
      { value: '36-45', label: '36-45 anos', segment: 'madura' },
      { value: '46-mais', label: '46+ anos', segment: 'experiente' },
    ],
  },
  'Step15Template.tsx': {
    question: 'Qual sua área profissional?',
    stepNumber: 15,
    progress: 75,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838160/20250509_2151_Profiss%C3%A3o_e_Carreira_simple_compose_01jtvtecg7bmy8r4q9b6vhx3py_ktdzhz.webp',
    options: [
      { value: 'corporativo', label: 'Corporativo/Executiva', segment: 'executiva' },
      { value: 'criativa', label: 'Área Criativa', segment: 'criativa' },
      { value: 'saude-educacao', label: 'Saúde/Educação', segment: 'cuidadora' },
      { value: 'empreendedora', label: 'Empreendedora', segment: 'empreendedora' },
    ],
  },
  'Step16Template.tsx': {
    question: 'Seu principal objetivo com o estilo:',
    stepNumber: 16,
    progress: 80,
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838163/20250509_2152_Objetivos_e_Metas_simple_compose_01jtvtfem6tx7rj7scv8k50qqm_z5qtgj.webp',
    options: [
      { value: 'confianca', label: 'Ganhar mais confiança', goal: 'autoestima' },
      { value: 'praticidade', label: 'Ter mais praticidade', goal: 'eficiencia' },
      { value: 'elegancia', label: 'Ser mais elegante', goal: 'sofisticacao' },
      { value: 'autenticidade', label: 'Expressar minha personalidade', goal: 'autenticidade' },
    ],
  },
  'Step17Template.tsx': {
    title: 'Finalizando sua Análise...',
    stepNumber: 17,
    progress: 85,
    description: 'Estamos cruzando todos os dados para criar seu perfil de estilo personalizado.',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838166/20250509_2153_Finaliza%C3%A7%C3%A3o_simple_compose_01jtvtggn0nvy3q7bnz5z4mvcj_q4bgjl.webp',
  },
  'Step18Template.tsx': {
    title: 'Calculando seu Resultado...',
    stepNumber: 18,
    progress: 90,
    description: 'Seus dados estão sendo processados por nosso algoritmo de estilo. Aguarde...',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838169/20250509_2154_C%C3%A1lculo_Final_simple_compose_01jtvthhq8wcbj2q6r9f8g3jrm_dqbdpt.webp',
  },
  'Step19Template.tsx': {
    title: 'Preparando seu Resultado...',
    stepNumber: 19,
    progress: 95,
    description: 'Quase pronto! Estamos preparando seu relatório de estilo personalizado.',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838172/20250509_2155_Prepara%C3%A7%C3%A3o_Resultado_simple_compose_01jtvtik6tcmy4r8h9m2k5zztw_wjkgse.webp',
  },
  'Step20Template.tsx': {
    title: 'Seu Resultado Está Pronto!',
    stepNumber: 20,
    progress: 100,
    description:
      'Parabéns! Descobrimos seu estilo predominante e criamos um guia personalizado para você.',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838175/20250509_2156_Resultado_Final_simple_compose_01jtvtjm8wn0q6r9p3b7k2mvcl_hdz8kt.webp',
  },
  'Step21Template.tsx': {
    title: 'Transforme seu Guarda-Roupa Agora!',
    stepNumber: 21,
    progress: 100,
    description:
      'Com base no seu estilo, temos uma oferta especial para você começar sua transformação hoje mesmo.',
    image:
      'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838178/20250509_2157_Oferta_Especial_simple_compose_01jtvtkoxf9n4q6r7bnz5z4mvd_pnqrsm.webp',
  },
};

// 🔧 FUNÇÃO PARA CRIAR INTERFACE PADRÃO
function createStepInterface(stepNumber) {
  return `import React from "react";

export interface Step${stepNumber.toString().padStart(2, '0')}Props {
  onNext?: () => void;
  onBlockAdd?: (block: any) => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
}

export const Step${stepNumber.toString().padStart(2, '0')} = ({ onNext, onBlockAdd, onAnswer, userAnswers }: Step${stepNumber.toString().padStart(2, '0')}Props) => {
  return <div className="step-${stepNumber.toString().padStart(2, '0')}">{/* Conteúdo da Etapa ${stepNumber} renderizado aqui */}</div>;
};`;
}

// 🔧 FUNÇÃO PARA CRIAR TEMPLATE DE PERGUNTA
function createQuestionTemplate(config, stepNumber) {
  const stepId = stepNumber.toString().padStart(2, '0');
  return `
// 🎯 TEMPLATE DE BLOCOS DA ETAPA ${stepNumber} - ${config.question}
export const getStep${stepId}Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "quiz-header-step${stepId}",
      type: "quiz-header",
      properties: {
        logoUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: ${config.progress},
        progressMax: 100,
        showBackButton: true,
        showProgress: true,
        stepNumber: "${stepNumber} de 21",
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step${stepId}",
      type: "decorative-bar-inline",
      properties: {
        width: "100%",
        height: 3,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 2,
        marginTop: 6,
        marginBottom: 20,
        showShadow: true,
      },
    },

    // 📝 PERGUNTA PRINCIPAL
    {
      id: "question-text-step${stepId}",
      type: "text-inline",
      properties: {
        content: "${config.question}",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 24,
        lineHeight: "1.3",
      },
    },

    // 🖼️ IMAGEM DA PERGUNTA
    {
      id: "question-image-step${stepId}",
      type: "image-display-inline",
      properties: {
        src: "${config.image}",
        alt: "Imagem da pergunta ${stepNumber}",
        width: 400,
        height: 300,
        className: "object-cover w-full max-w-md h-64 rounded-lg mx-auto shadow-md",
        textAlign: "text-center",
        marginBottom: 24,
      },
    },

    // 🎯 OPÇÕES DE RESPOSTA
    ${config.options
      .map(
        (option, index) => `
    {
      id: "option-${index + 1}-step${stepId}",
      type: "quiz-option",
      properties: {
        optionId: "${option.value}",
        label: "${option.label}",
        value: "${option.value}",
        ${option.points ? `points: ${JSON.stringify(option.points)},` : ''}
        ${option.segment ? `segment: "${option.segment}",` : ''}
        ${option.goal ? `goal: "${option.goal}",` : ''}
        variant: "default",
        size: "large",
        textAlign: "text-left",
        marginBottom: 12,
        borderRadius: "rounded-lg",
        backgroundColor: "#ffffff",
        hoverColor: "#F8F4F1",
        selectedColor: "#B89B7A",
      },
    },`
      )
      .join('')}

    // 🎯 BOTÃO CONTINUAR
    {
      id: "continue-button-step${stepId}",
      type: "button-inline",
      properties: {
        text: "Continuar →",
        variant: "primary",
        size: "large",
        fullWidth: true,
        backgroundColor: "#B89B7A",
        textColor: "#ffffff",
        requiresSelection: true,
        textAlign: "text-center",
        borderRadius: "rounded-full",
        padding: "py-3 px-6",
        fontSize: "text-base",
        fontWeight: "font-semibold",
        marginTop: 24,
        disabled: true,
      },
    },
  ];
};

export default Step${stepId};`;
}

// 🔧 FUNÇÃO PARA CRIAR TEMPLATE DE TRANSIÇÃO
function createTransitionTemplate(config, stepNumber) {
  const stepId = stepNumber.toString().padStart(2, '0');
  return `
// 🎯 TEMPLATE DE BLOCOS DA ETAPA ${stepNumber} - ${config.title}
export const getStep${stepId}Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: "progress-header-step${stepId}",
      type: "quiz-header",
      properties: {
        logoUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
        logoAlt: "Logo Gisele Galvão",
        logoWidth: 80,
        logoHeight: 80,
        progressValue: ${config.progress},
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: "${stepNumber} de 21",
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: "decorative-bar-step${stepId}",
      type: "decorative-bar-inline",
      properties: {
        width: "100%",
        height: 4,
        color: "#B89B7A",
        gradientColors: ["#B89B7A", "#D4C2A8", "#B89B7A"],
        borderRadius: 3,
        marginTop: 8,
        marginBottom: 32,
        showShadow: true,
      },
    },

    // 📱 TÍTULO DA TRANSIÇÃO
    {
      id: "transition-title-step${stepId}",
      type: "text-inline",
      properties: {
        content: "${config.title}",
        fontSize: "text-3xl",
        fontWeight: "font-bold",
        fontFamily: "Playfair Display, serif",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 24,
        lineHeight: "1.2",
      },
    },

    // 🖼️ IMAGEM DE LOADING/TRANSIÇÃO
    {
      id: "transition-image-step${stepId}",
      type: "image-display-inline",
      properties: {
        src: "${config.image}",
        alt: "${config.title}",
        width: 500,
        height: 350,
        className: "object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg",
        textAlign: "text-center",
        marginBottom: 32,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: "transition-description-step${stepId}",
      type: "text-inline",
      properties: {
        content: "${config.description}",
        fontSize: "text-lg",
        textAlign: "text-center",
        color: "#432818",
        marginBottom: 40,
        lineHeight: "1.6",
      },
    },
  ];
};

export default Step${stepId};`;
}

// 📋 LISTA DE ARQUIVOS QUE PRECISAM DE CORREÇÃO
const filesToFix = [
  'Step08Template.tsx',
  'Step09Template.tsx',
  'Step10Template.tsx',
  'Step11Template.tsx',
  'Step12Template.tsx',
  'Step13Template.tsx',
  'Step14Template.tsx',
  'Step15Template.tsx',
  'Step16Template.tsx',
  'Step17Template.tsx',
  'Step18Template.tsx',
  'Step20Template.tsx',
  'Step21Template.tsx',
];

let correctedFiles = 0;
let errorFiles = 0;

// 🔧 PROCESSAR CADA ARQUIVO
for (const fileName of filesToFix) {
  const filePath = path.join(stepsDir, fileName);
  const stepNumber = parseInt(fileName.match(/Step(\d+)/)[1]);

  try {
    console.log(`🔧 Corrigindo ${fileName}...`);

    // Ler conteúdo atual
    const currentContent = fs.readFileSync(filePath, 'utf8');

    // Criar nova interface
    const newInterface = createStepInterface(stepNumber);

    // Criar novo template baseado no tipo
    let newTemplate = '';
    if (stepsConfig[fileName]) {
      // Pergunta do quiz
      newTemplate = createQuestionTemplate(stepsConfig[fileName], stepNumber);
    } else if (specialTemplates[fileName]) {
      // Transição ou resultado
      newTemplate = createTransitionTemplate(specialTemplates[fileName], stepNumber);
    }

    // Combinar interface + template
    const newContent = newInterface + newTemplate;

    // Escrever arquivo corrigido
    fs.writeFileSync(filePath, newContent, 'utf8');

    console.log(`✅ ${fileName} corrigido com sucesso!`);
    correctedFiles++;
  } catch (error) {
    console.log(`❌ Erro ao corrigir ${fileName}: ${error.message}`);
    errorFiles++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📋 RELATÓRIO DE CORREÇÃO:');
console.log(`✅ Arquivos corrigidos: ${correctedFiles}`);
console.log(`❌ Arquivos com erro: ${errorFiles}`);
console.log(`📊 Total processado: ${correctedFiles + errorFiles}`);

if (correctedFiles > 0) {
  console.log('\n🎯 CORREÇÕES APLICADAS:');
  console.log('   ✅ Interfaces TypeScript completas');
  console.log('   ✅ Props padronizadas (onNext, onBlockAdd, onAnswer, userAnswers)');
  console.log('   ✅ Templates com dados e imagens corretas');
  console.log('   ✅ Configuração de perguntas do quiz');
  console.log('   ✅ Sistema de pontuação por estilo');
  console.log('   ✅ Segmentação estratégica');
  console.log('   ✅ Etapas de transição com loading');
}

console.log('\n🚀 PRÓXIMO PASSO: Executar verificação final dos templates corrigidos');
