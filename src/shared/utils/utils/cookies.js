// Utilitários para manipulação de cookies

/**
 * Define um cookie no navegador
 * @param {string} name - Nome do cookie
 * @param {string} value - Valor do cookie
 * @param {number} days - Dias para expirar o cookie
 */
export const setCookie = (name, value, days = 30) => {
  if (typeof window === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();

  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
};

/**
 * Obtém o valor de um cookie
 * @param {string} name - Nome do cookie
 * @returns {string|null} - Valor do cookie ou null se não existir
 */
export const getCookie = name => {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }

  return null;
};

/**
 * Remove um cookie
 * @param {string} name - Nome do cookie a ser removido
 */
export const deleteCookie = name => {
  if (typeof window === 'undefined') return;

  document.cookie = name + '=; Max-Age=-99999999; path=/';
};
