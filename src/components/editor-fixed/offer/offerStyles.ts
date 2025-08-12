/**
 * 🎨 ESTILOS CUSTOMIZADOS PARA OFERTAS
 * Estilos otimizados e responsivos para páginas de oferta
 */

export const offerPageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
  
  :root {
    --primary: #B89B7A;
    --secondary: #432818;
    --accent: #aa6b5d;
    --background: #FFFBF7;
    --white: #ffffff;
    --text-dark: #432818;
    --text-medium: #6B4F43;
    --text-light: #8B7355;
    --success: #22c55e;
    --spacing: 2rem;
  }
  
  /* Layout e containers */
  .container-main { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 1rem; 
  }
  
  .section-gap { 
    margin-bottom: 4rem; 
  }
  
  .card-clean { 
    background: white; 
    border-radius: 16px; 
    padding: 2rem; 
    box-shadow: 0 4px 20px rgba(184, 155, 122, 0.1);
    border: 1px solid rgba(184, 155, 122, 0.1);
  }
  
  /* Botões */
  .btn-primary-clean {
    background: linear-gradient(135deg, var(--success) 0%, #16a34a 100%);
    color: white;
    font-weight: 700;
    border-radius: 12px;
    padding: 1rem 2rem;
    border: none;
    font-size: 1.125rem;
    transition: all 0.2s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-primary-clean:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
  }
  
  /* Tipografia */
  .text-hierarchy-1 { 
    font-size: 3rem; 
    font-weight: 700; 
    line-height: 1.1; 
  }
  
  .text-hierarchy-2 { 
    font-size: 2rem; 
    font-weight: 600; 
    line-height: 1.2; 
  }
  
  .text-hierarchy-3 { 
    font-size: 1.5rem; 
    font-weight: 600; 
    line-height: 1.3; 
  }
  
  .text-body { 
    font-size: 1.125rem; 
    line-height: 1.6; 
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .container-main { 
      padding: 0 1rem; 
    }
    
    .section-gap { 
      margin-bottom: 3rem; 
    }
    
    .card-clean { 
      padding: 1.5rem; 
    }
    
    .text-hierarchy-1 { 
      font-size: 2rem; 
    }
    
    .text-hierarchy-2 { 
      font-size: 1.5rem; 
    }
    
    .btn-primary-clean { 
      width: 100%; 
      justify-content: center; 
      padding: 1.25rem; 
    }
  }

  /* Animações */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Countdown timer específico */
  .countdown-timer {
    font-family: 'Courier New', monospace;
  }
  
  .countdown-digit {
    background: var(--secondary);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(67, 40, 24, 0.2);
  }

  /* FAQ accordion */
  .faq-item {
    transition: all 0.3s ease;
  }
  
  .faq-item:hover {
    transform: translateX(4px);
  }

  /* Pricing highlight */
  .pricing-highlight {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
`;

/**
 * Função para injetar os estilos na página
 */
export const injectOfferPageStyles = (): (() => void) => {
  const styleElement = document.createElement('style');
  styleElement.textContent = offerPageStyles;
  document.head.appendChild(styleElement);

  // Retorna função de limpeza
  return () => {
    if (styleElement.parentNode) {
      document.head.removeChild(styleElement);
    }
  };
};

export default offerPageStyles;
