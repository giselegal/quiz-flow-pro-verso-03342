import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface QuizWelcomeProps {
  onStart: (name: string) => void;
  title?: string;
  description?: string;
}

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-4 border rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[#B89B7A]"
  />
);

const QuizWelcome: React.FC<QuizWelcomeProps> = ({ onStart, title, description }) => {
  const [name, setName] = React.useState('');

  const handleSubmit = () => {
    if (name.trim() !== '') {
      onStart(name);
    } else {
      alert('Por favor, digite seu nome.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4"
    >
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative">
          <div className="absolute top-4 left-4 z-10">
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
              alt="Logo da Marca Gisele"
              className="h-12 w-auto object-contain"
              width={120}
              height={50}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{ objectFit: 'contain', maxWidth: '100%', aspectRatio: '120 / 50' }}
            />
          </div>
          
          <div className="relative z-20 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#432818] mb-6 leading-tight">
              {title || 'Descubra Seu Estilo Único'}
            </h1>
            
            <p className="text-xl text-[#5D4A3A] mb-8 max-w-2xl mx-auto leading-relaxed">
              {description || 'Um quiz personalizado para revelar seu estilo de moda e transformar sua forma de se vestir'}
            </p>
            
            <div className="mb-6">
              <Input
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <Button
              variant="primary"
              size="large"
              fullWidth={false}
              onClick={handleSubmit}
              className="bg-[#B89B7A] hover:bg-[#A68B6A] text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Quiz Agora
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#B89B7A] to-[#A68B6A] px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-white">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                alt="Logo"
                className="h-10 w-auto object-contain"
                width={80}
                height={40}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                id="footer-logo"
              />
              <div>
                <p className="font-medium">Gisele Oliveira</p>
                <p className="text-sm opacity-90">Consultora de Estilo</p>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-sm opacity-90">Tempo estimado:</p>
              <p className="font-medium">5-7 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizWelcome;
