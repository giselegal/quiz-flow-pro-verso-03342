import { Card } from '@/components/ui/card';
import { CheckCircle2, Shield } from 'lucide-react';

interface GuaranteeProps {
  text?: string;
}

const Guarantee: React.FC<GuaranteeProps> = ({
  text = 'Garantia incondicional de 7 dias. Teste o guia completo e todos os bônus. Se não ficar satisfeita por qualquer motivo, devolvemos 100% do seu investimento. Sem perguntas.',
}) => {
  return (
    <Card className="p-6 md:p-8 my-8 glass-panel relative overflow-hidden border-[#B89B7A]/30">
      {/* Efeitos de gradiente animados */}
  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#B89B7A]/20 to-[#aa6b5d]/10 blur-xl opacity-60" />
  <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-tr from-[#aa6b5d]/15 to-[#B89B7A]/5 blur-xl opacity-60" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Círculo de gradiente animado atrás do escudo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#aa6b5d]/30 to-[#B89B7A]/20 blur-md" />

            {/* Escudo principal */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#aa6b5d] to-[#B89B7A] flex items-center justify-center text-white shadow-xl relative z-10">
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 mb-1" strokeWidth={1.5} />
                <div className="absolute">
                  <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium mt-1">7 DIAS</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-playfair font-medium text-[#432818] mb-2">
            Garantia Total de <span className="text-[#aa6b5d]">Satisfação</span>
          </h3>
          <p className="text-[#432818]/80 leading-relaxed">{text}</p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d]/80 mt-3 rounded-full"></div>
        </div>
      </div>
    </Card>
  );
};

export default Guarantee;
