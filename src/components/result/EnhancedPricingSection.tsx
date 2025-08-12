// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Clock,
  Shield,
  Star,
  Award,
  CheckCircle,
  ArrowDown,
  Zap,
  Gift,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackButtonClick } from '@/utils/analytics';

// Design tokens otimizados
const tokens = {
  colors: {
    primary: '#B89B7A',
    secondary: '#aa6b5d',
    accent: '#4CAF50',
    accentDark: '#45a049',
    background: '#fffaf7',
    backgroundCard: '#ffffff',
    backgroundLight: '#fff7f3',
    backgroundAccent: '#f9f4ef',
    text: '#432818',
    textLight: '#8F7A6A',
    textMuted: '#6B5B4E',
    success: '#4CAF50',
    warning: '#ff6b35',
    border: 'rgba(184, 155, 122, 0.2)',
    borderLight: 'rgba(184, 155, 122, 0.1)',
  },
  shadows: {
    sm: '0 2px 4px rgba(184, 155, 122, 0.08)',
    md: '0 4px 8px rgba(184, 155, 122, 0.12)',
    lg: '0 8px 16px rgba(184, 155, 122, 0.16)',
    xl: '0 12px 24px rgba(184, 155, 122, 0.20)',
    cta: '0 8px 32px rgba(76, 175, 80, 0.4)',
    glow: '0 0 20px rgba(184, 155, 122, 0.3)',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
};

interface EnhancedPricingSectionProps {
  className?: string;
}

const EnhancedPricingSection: React.FC<EnhancedPricingSectionProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'avista' | 'parcelado'>('parcelado');

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if ((window as any).ctaClickProcessing) return;
    (window as any).ctaClickProcessing = true;

    trackButtonClick('checkout_button', 'Enhanced Pricing CTA', 'pricing_section');

    if (window.innerWidth >= 768) {
      window.open('https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912', '_blank');
    } else {
      window.location.href = 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912';
    }

    setTimeout(() => {
      (window as any).ctaClickProcessing = false;
    }, 1000);
  };

  return (
    <div className={`my-16 ${className}`}>
      {/* Título da Seção */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#B89B7A] to-transparent"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full shadow-sm"></div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-[#432818] mb-4">
          Investimento Especial
        </h2>
        <p className="text-lg md:text-xl text-[#8F7A6A] max-w-2xl mx-auto">
          Transforme seu estilo com um investimento que vale por uma vida inteira de confiança
        </p>
      </motion.div>

      {/* Card Principal de Pricing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        <Card
          className="relative overflow-hidden border-2 p-8 md:p-12"
          style={{
            borderColor: tokens.colors.primary,
            backgroundColor: tokens.colors.backgroundCard,
            boxShadow: tokens.shadows.xl,
          }}
        >
          {/* Badge de Oferta Limitada */}
          <motion.div
            className="absolute -top-4 -right-4 z-20"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div
              className="px-6 py-3 text-white text-sm font-bold rounded-full shadow-lg transform rotate-12"
              style={{ backgroundColor: tokens.colors.warning }}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              OFERTA POR TEMPO LIMITADO
            </div>
          </motion.div>

          {/* Elementos Decorativos */}
          <div
            className="absolute top-0 left-0 w-32 h-32 opacity-5 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${tokens.colors.primary} 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-40 h-40 opacity-5 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${tokens.colors.secondary} 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            {/* Breakdown de Produtos */}
            <motion.div
              className="p-6 md:p-8 rounded-xl mb-8 border"
              style={{
                backgroundColor: tokens.colors.backgroundLight,
                borderColor: tokens.colors.borderLight,
              }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#432818]">
                  Tudo que Você Vai Receber
                </h3>
                <p className="text-[#8F7A6A]">
                  Um pacote completo para sua transformação de imagem
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    item: 'Guia Completo de Estilo Personalizado',
                    description: 'Manual exclusivo baseado no seu perfil único',
                    value: 'R$ 97,00',
                    badge: 'PRINCIPAL',
                  },
                  {
                    item: 'Bônus: Manual de Peças Estratégicas',
                    description: 'Descubra as peças-chave do seu guarda-roupa',
                    value: 'R$ 47,00',
                    badge: 'BÔNUS',
                  },
                  {
                    item: 'Bônus: Guia de Visagismo Facial',
                    description: 'Cortes e acessórios ideais para seu rosto',
                    value: 'R$ 31,00',
                    badge: 'BÔNUS',
                  },
                ].map((product, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg border border-[#B89B7A]/10 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: tokens.shadows.md }}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-[#432818]">{product.item}</h4>
                          <span
                            className="px-2 py-1 text-xs font-bold rounded-full text-white"
                            style={{
                              backgroundColor:
                                product.badge === 'PRINCIPAL'
                                  ? tokens.colors.primary
                                  : tokens.colors.secondary,
                            }}
                          >
                            {product.badge}
                          </span>
                        </div>
                        <p className="text-sm text-[#8F7A6A]">{product.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 md:ml-4">
                      <span
                        className="text-lg font-bold"
                        style={{ color: tokens.colors.secondary }}
                      >
                        {product.value}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Total */}
                <motion.div
                  className="border-t-2 pt-6 mt-8"
                  style={{ borderColor: tokens.colors.border }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="flex justify-between items-center text-xl md:text-2xl">
                    <span className="font-bold text-[#432818]">Valor Total:</span>
                    <div className="relative">
                      <span
                        className="text-3xl font-bold line-through opacity-60"
                        style={{ color: tokens.colors.textMuted }}
                      >
                        R$ 175,00
                      </span>
                      <motion.div
                        style={{ backgroundColor: '#FAF9F7' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Seção de Preço */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Tabs de Pagamento */}
              <div className="flex justify-center mb-6">
                <div
                  style={{ backgroundColor: '#E5DDD5' }}
                  style={{ backgroundColor: tokens.colors.backgroundAccent }}
                >
                  {[
                    { key: 'parcelado', label: 'Parcelado' },
                    { key: 'avista', label: 'À Vista' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as 'avista' | 'parcelado')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.key
                          ? 'bg-white text-[#432818] shadow-sm'
                          : 'text-[#8F7A6A] hover:text-[#432818]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preço Dinâmico */}
              <AnimatePresence mode="wait">
                {activeTab === 'parcelado' ? (
                  <motion.div
                    key="parcelado"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-center">
                        <p style={{ color: '#8B7355' }}>De</p>
                        <p
                          className="text-2xl md:text-3xl line-through"
                          style={{ color: tokens.colors.textMuted }}
                        >
                          R$ 175,00
                        </p>
                      </div>

                      <ArrowDown className="w-8 h-8 text-green-500" />

                      <div className="text-center">
                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: tokens.colors.secondary }}
                        >
                          Por apenas
                        </p>
                        <div className="flex items-baseline gap-1 justify-center">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: tokens.colors.accent }}
                          >
                            5x R$
                          </span>
                          <span
                            className="text-4xl md:text-5xl font-bold"
                            style={{ color: tokens.colors.accent }}
                          >
                            8,83
                          </span>
                        </div>
                        <p className="text-sm text-[#8F7A6A] mt-1">sem juros no cartão</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="avista"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-lg">R$</span>
                      <span
                        className="text-5xl md:text-6xl font-bold"
                        style={{ color: tokens.colors.accent }}
                      >
                        39
                      </span>
                      <span className="text-2xl">,90</span>
                    </div>
                    <p className="text-sm text-[#8F7A6A] mt-1">pagamento único</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Badge de Economia */}
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold mb-6"
                style={{ backgroundColor: tokens.colors.success }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="w-5 h-5" />
                <span>💰 Economia de R$ 135,10 (77% OFF)</span>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleCTAClick}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full md:w-auto text-white font-bold py-6 px-12 rounded-xl text-lg md:text-xl shadow-lg transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${tokens.colors.accent}, ${tokens.colors.accentDark})`,
                    boxShadow: isHovered ? tokens.shadows.cta : tokens.shadows.lg,
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  <motion.span
                    className="flex items-center gap-3"
                    animate={isHovered ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Transformar Meu Estilo Agora
                  </motion.span>
                </Button>
              </motion.div>

              <p className="text-sm text-[#aa6b5d] font-medium mt-3">
                <Clock className="w-4 h-4 inline mr-1" />
                Oferta expira quando você sair desta página
              </p>
            </motion.div>

            {/* Elementos de Confiança */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {[
                {
                  icon: <Shield className="w-4 h-4" />,
                  text: 'Pagamento 100% Seguro',
                  color: 'text-green-500',
                },
                {
                  icon: <Award className="w-4 h-4" />,
                  text: 'Garantia de 7 dias',
                  color: 'text-yellow-500',
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  text: 'Acesso Imediato',
                  color: 'text-[#B89B7A]',
                },
                {
                  icon: <Star className="w-4 h-4" />,
                  text: 'Avaliação 5 estrelas',
                  color: 'text-purple-500',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-[#432818]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={item.color}>{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Métodos de Pagamento */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <p className="text-sm text-[#8F7A6A] mb-4">Métodos de pagamento aceitos:</p>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
                alt="Métodos de pagamento"
                className="w-full max-w-md mx-auto rounded-lg"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                loading="lazy"
              />
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedPricingSection;
