
import React from 'react';

interface QuizDescubraSeuEstiloProps {
  userStyle: string;
  userName: string;
}

export const QuizDescubraSeuEstilo: React.FC<QuizDescubraSeuEstiloProps> = ({
  userStyle,
  userName
}) => {
  return (
    <div className="min-h-screen bg-[#faf8f5] p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-playfair text-[#432818] mb-4">
          Olá, {userName}!
        </h1>
        <p className="text-[#8F7A6A] text-lg mb-8">
          Seu estilo é: <span className="font-semibold text-[#B89B7A]">{userStyle}</span>
        </p>
      </div>
    </div>
  );
};
