export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifySelectors: true,
          // Configurações avançadas para maior compressão
          reduceIdents: false, // Evitar problemas com keyframes
          zindex: false, // Não modificar z-index
          svgo: true, // Otimizar SVGs inline
          calc: {
            precision: 5,
          },
        }],
      },
    } : {}),
  },
};
