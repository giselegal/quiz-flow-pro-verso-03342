// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FunnelStepProps } from '@/types/funnel';

interface FunnelProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const FunnelProgressBar: React.FC<FunnelProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-center mt-2">
        {currentStep} de {totalSteps}
      </p>
    </div>
  );
};

export interface FunnelIntroStepProps extends FunnelStepProps {
  data?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    logoUrl?: string;
    showProgressBar?: boolean;
    backgroundColor?: string;
  };
}

const FunnelIntroStep: React.FC<FunnelIntroStepProps> = ({
  id,
  className,
  style,
  stepNumber = 1,
  totalSteps = 7,
  isEditable = false,
  onNext,
  onPrevious,
  onEdit,
  data = {},
}) => {
  const {
    title = 'Bem-vindo ao Quiz',
    subtitle = 'Descubra seu estilo pessoal',
    buttonText = 'Começar Quiz',
    logoUrl,
    showProgressBar = true,
    backgroundColor = '#FFFAF0',
  } = data;

  return (
    <div
      id={id}
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${className || ''}`}
      style={{ backgroundColor, ...style }}
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {logoUrl && <img src={logoUrl} alt="Logo" className="h-16 mx-auto" />}

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#432818]">{title}</h1>
          <p className="text-xl text-[#8F7A6A]">{subtitle}</p>
        </div>

        <div className="space-y-6">
          <Button
            onClick={onNext}
            size="lg"
            className="bg-[#B89B7A] hover:bg-[#A38A69] text-white px-8 py-4 text-lg"
          >
            {buttonText}
          </Button>

          {showProgressBar && (
            <div className="w-full max-w-md mx-auto">
              <FunnelProgressBar currentStep={stepNumber} totalSteps={totalSteps} />
            </div>
          )}
        </div>
      </div>

      {isEditable && (
        <Button onClick={onEdit} variant="outline" className="fixed top-4 right-4">
          Edit
        </Button>
      )}
    </div>
  );
};

export default FunnelIntroStep;
