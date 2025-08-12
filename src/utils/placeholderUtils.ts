// @ts-nocheck
// Utility functions for generating placeholder content

export const generatePlaceholderText = (length: number = 50): string => {
  const words = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
    'enim',
    'ad',
    'minim',
    'veniam',
    'quis',
    'nostrud',
  ];

  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }

  return result.join(' ');
};

export const generatePlaceholderImage = (width: number = 400, height: number = 300): string => {
  return `https://via.placeholder.com/${width}x${height}`;
};

export const generatePlaceholderTitle = (): string => {
  const titles = [
    'Título Principal',
    'Descubra Seu Estilo',
    'Transforme Sua Aparência',
    'Encontre Sua Essência',
    'Revele Sua Personalidade',
  ];

  return titles[Math.floor(Math.random() * titles.length)];
};

export default {
  generatePlaceholderText,
  generatePlaceholderImage,
  generatePlaceholderTitle,
};
