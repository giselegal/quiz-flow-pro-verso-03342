import { Button } from '@/components/ui/button';
import { FunnelStepProps } from '@/types/funnel';

interface OfferTransitionStepProps extends FunnelStepProps {
  data?: {
    title?: string;
    subtitle?: string;
    resultSummary?: string;
    benefits?: Array<{
      title: string;
      description: string;
    }>;
    transitionMessage?: string;
    ctaText?: string;
  };
}

const OfferTransitionStep: React.FC<OfferTransitionStepProps> = ({ data, onNext }) => {
  const {
    title = 'Agora que você conhece seu estilo...',
    subtitle = 'É hora de colocá-lo em prática!',
    resultSummary = 'Baseado nas suas respostas, identificamos que você tem um estilo único que merece ser explorado.',
    benefits = [
      {
        title: 'Autoconfiança',
        description: 'Sinta-se confiante em qualquer ocasião',
      },
      { title: 'Economia', description: 'Pare de comprar peças que não usa' },
      { title: 'Praticidade', description: 'Monte looks incríveis em minutos' },
      {
        title: 'Estilo Único',
        description: 'Desenvolva sua identidade visual',
      },
    ],
    transitionMessage = 'Quer descobrir como elevar seu estilo para o próximo nível?',
    ctaText = 'SIM, QUERO ELEVAR MEU ESTILO!',
  } = data || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F7] to-white flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#432818] mb-6 leading-tight">
          {title}
        </h1>

        <p className="text-2xl text-[#B89B7A] mb-8 font-semibold">{subtitle}</p>

        {/* Result Summary */}
        <div className="bg-white rounded-lg p-8 mb-12 border-2 border-[#B89B7A] max-w-2xl mx-auto">
          <p className="text-[#8F7A6A] text-lg leading-relaxed">{resultSummary}</p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-[#B89B7A]/20 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#B89B7A] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#432818] text-xl mb-2">{benefit.title}</h3>
                  <p className="text-[#8F7A6A]">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#432818] mb-6">
            {transitionMessage}
          </h2>

          <p className="text-[#8F7A6A] text-lg mb-8">
            Temos uma solução especial que vai transformar completamente sua relação com a moda...
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={onNext}
          size="lg"
          className="bg-[#B89B7A] hover:bg-[#A68B6A] text-white font-bold py-4 px-12 text-xl"
        >
          {ctaText}
        </Button>

        <p className="text-[#8F7A6A] mt-4 text-sm">Clique para descobrir nossa solução exclusiva</p>

        {/* Visual Elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-4 h-4 bg-[#B89B7A] rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-[#B89B7A] rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-[#B89B7A] rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default OfferTransitionStep;
