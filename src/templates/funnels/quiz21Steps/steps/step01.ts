/**
 * 🎯 STEP 01 - Introdução do Quiz
 * 
 * Step de boas-vindas com captura de nome
 */

import type { Block } from '../../../schemas';

export const step01: Block[] = [
  {
    id: 'quiz-intro-header',
    type: 'quiz-intro-header',
    order: 0,
    properties: {
      logoUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_70,w_132,h_55,c_fit/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.png',
      logoAlt: 'Logo Gisele Galvão',
      showProgress: true,
      progressValue: 5,
    },
    content: {},
  },
  {
    id: 'intro-title',
    type: 'intro-title',
    order: 1,
    properties: {
      padding: 16,
      type: 'fade',
      duration: 300,
      animationType: 'fade',
      animationDuration: 300,
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: '700',
    },
    content: {
      title: '<span style="color: #B89B7A; font-weight: 700;">Chega</span> de um guarda-roupa lotado e da sensação de que <span style="color: #B89B7A; font-weight: 700;">nada combina com você</span>.',
    },
  },
  {
    id: 'intro-image',
    type: 'intro-image',
    order: 2,
    properties: {
      objectFit: 'contain',
      maxWidth: 300,
      borderRadius: '8px',
    },
    content: {
      src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
      alt: 'Descubra seu estilo predominante',
      width: 300,
      height: 204,
      imageUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/f_png,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.png',
    },
  },
  {
    id: 'intro-description',
    type: 'intro-description',
    order: 3,
    properties: {
      padding: 16,
      animationType: 'fade',
      animationDuration: 300,
      textAlign: 'center',
    },
    content: {
      text: 'Em poucos minutos, descubra seu <span class="font-semibold text-[#B89B7A]">Estilo Predominante</span> — e aprenda a montar looks que realmente refletem sua <span class="font-semibold text-[#432818]">essência</span>, com praticidade e <span class="font-semibold text-[#432818]">confiança</span>.',
    },
  },
  {
    id: 'intro-form',
    type: 'intro-form',
    order: 4,
    properties: {
      padding: 16,
      type: 'slideUp',
      duration: 300,
      animationType: 'fade',
      animationDuration: 300,
    },
    content: {
      label: 'Como posso te chamar?',
      placeholder: 'Digite seu primeiro nome aqui...',
      buttonText: 'Quero Descobrir meu Estilo Agora!',
      required: true,
      helperText: 'Seu nome é necessário para personalizar sua experiência.',
    },
  },
];

export default step01;
