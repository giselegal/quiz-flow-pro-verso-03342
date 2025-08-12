// Interface simplificada
interface GuaranteeSealProps {
  className?: string;
}

// Componente minimalista sem informações redundantes
const GuaranteeSeal: React.FC<GuaranteeSealProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-xl p-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-medium text-[#432818]">7 dias de garantia</h3>
      </div>
    </div>
  );
};

export default GuaranteeSeal;
