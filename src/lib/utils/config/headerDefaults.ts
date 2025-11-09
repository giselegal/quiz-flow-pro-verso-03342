import { Section } from '@/types/resultPageConfig';

export const createHeaderConfig = (): Section => ({
  visible: true,
  content: {
    title: 'VOCÊ DESCOBRIU SEU ESTILO',
    subtitle: 'Agora é hora de aplicar com clareza — e se vestir de você',
    logo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    logoAlt: 'Logo Gisele Galvão',
  },
  style: {
    textAlign: 'center',
    margin: '0 0 2rem 0',
  },
});
