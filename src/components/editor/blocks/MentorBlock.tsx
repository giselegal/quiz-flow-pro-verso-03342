// @ts-nocheck
import { cn } from '@/lib/utils';
import { Award, Users, BookOpen } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

interface MentorBlockProps extends BlockComponentProps {
  disabled?: boolean;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const MentorBlock: React.FC<MentorBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className,
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div style={{ borderColor: '#B89B7A' }}>
        <p style={{ color: '#432818' }}>Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  // Debug das propriedades recebidas
  console.log('🔍 [MentorBlock] Propriedades recebidas:', block.properties);

  const {
    title = 'Conheça Gisele Galvão',
    showCredentials = true,
    showImage = true,
    mentorImage = 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp',
    mentorName = 'Gisele Galvão',
  } = block?.properties || {};

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };
  // Dados reais sobre a mentora
  const credentials = [
    {
      icon: <Award className="w-5 h-5" />,
      text: 'Consultora de Imagem certificada',
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: 'Mais de 2.500 mulheres transformadas',
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: '15+ anos de experiência em estilo',
    },
  ];

  return (
    <div
      className={cn(
        'relative w-full p-4 rounded-lg border-2 border-dashed',
        isSelected ? 'border-[#B89B7A] bg-[#B89B7A]/10' : 'border-gray-300 bg-white',
        'cursor-pointer hover:border-gray-400 transition-colors',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={onClick}
    >
      <div className={cn('py-8')}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md border border-[#B89B7A]/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {showImage && (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={mentorImage}
                      alt={mentorName}
                      className="w-64 h-64 object-cover rounded-full shadow-lg"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#aa6b5d] mb-4">{title}</h2>
                  <p className="text-[#432818] leading-relaxed">
                    Especialista em consultoria de imagem e estilo pessoal, Gisele Galvão dedica sua
                    carreira a ajudar mulheres a descobrirem e expressarem sua autenticidade através
                    do vestir.
                  </p>
                </div>

                {showCredentials && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#aa6b5d]">
                      Por que confiar na Gisele?
                    </h3>
                    <div className="space-y-3">
                      {credentials.map((credential, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full flex items-center justify-center text-white">
                            {credential.icon}
                          </div>
                          <span className="text-[#432818] font-medium">{credential.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#f9f4ef] p-4 rounded-lg border border-[#B89B7A]/10">
                  <p className="text-sm text-[#432818] italic">
                    "Minha missão é mostrar para cada mulher que ela já possui tudo o que precisa
                    para ser elegante. Só precisamos despertar essa essência única que existe dentro
                    de você."
                  </p>
                  <p className="text-right text-[#aa6b5d] font-medium mt-2">- Gisele Galvão</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorBlock;
