// @ts-nocheck
import { StepTemplateIds } from '@/utils/semanticIdGenerator';
import Logo from '../ui/logo';

interface ResultHeaderProps {
  userName: string;
  customTitle?: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ userName, customTitle }) => {
  // 🎯 SISTEMA 1: ID Semântico para componente de resultado
  const componentId = StepTemplateIds.result.header(userName);

  return (
    <div className="text-center space-y-4 py-4" data-component-id={componentId}>
      <div>
        <Logo className="h-12 md:h-16 mx-auto" />
      </div>

      <h1 className="font-playfair text-xl md:text-3xl font-semibold text-[#432818] px-2">
        {customTitle || `Olá, ${userName}, seu Estilo Predominante é:`}
      </h1>

      <div className="w-24 h-1 mx-auto bg-gradient-to-r from-amber-300 to-amber-500 rounded-full" />
    </div>
  );
};

export default ResultHeader;
