// CORREÇÃO: Aceitar content como string OU objeto
const content = properties.content || {};

// Se content é string, usar diretamente
// Se content é objeto, usar content.text
const text =
  (typeof content === 'string' ? content : content.text) ||
  directText ||
  'Digite seu texto aqui...';
