import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart } from 'lucide-react';

const TransformationBlock: React.FC = () => {
  return (
    <div className="py-10 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] text-center mb-6">
          Transforme Seu Visual
        </h2>

        <Card className="p-6 md:p-8 card-elegant overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911677/C%C3%B3pia_de_MOCKUPS_15_-_Copia_grstwl.webp"
                alt="Transformação Antes e Depois"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-medium text-[#aa6b5d]">
                Descubra o poder da imagem intencional
              </h3>

              <p className="text-[#3a3a3a]">
                Seu estilo não é apenas sobre roupas — é sobre comunicar quem você é e onde quer
                chegar. Aprenda a transmitir confiança, autoridade e autenticidade através das suas
                escolhas.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#aa6b5d] flex-shrink-0 mt-1" size={20} />
                  <span>Looks com propósito e intenção</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#aa6b5d] flex-shrink-0 mt-1" size={20} />
                  <span>Valorização da sua forma física natural</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#aa6b5d] flex-shrink-0 mt-1" size={20} />
                  <span>Expressão autêntica da sua personalidade</span>
                </div>
              </div>

              <Button
                className="btn-cta-green w-full py-3 text-lg font-medium"
                onClick={() =>
                  (window.location.href =
                    'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912')
                }
              >
                <ShoppingCart className="mr-2" />
                <span>Quero Meu Guia de Estilo</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransformationBlock;
