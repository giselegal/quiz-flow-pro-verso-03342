import { Card } from '@/components/ui/card';

const MotivationSection: React.FC = () => {
  return (
    <Card className="p-6 mb-10 bg-white shadow-md border border-[#B89B7A]/20 card-elegant">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-6 justify-center">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#B89B7A]"></div>
          <div className="w-2 h-2 bg-[#B89B7A] rounded-full animate-pulse"></div>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#B89B7A]"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div className="bg-[#fff7f3] p-4 rounded-lg border border-[#B89B7A]/10">
          <h3 className="font-medium text-[#aa6b5d] mb-2">Quando você não conhece seu estilo...</h3>
          <ul className="text-[#432818] space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Compra peças por impulso que não combinam entre si
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Sente que tem um guarda-roupa cheio, mas "nada para vestir"
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Investe em tendências que não valorizam sua imagem
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Tem dificuldade em criar uma imagem coerente e autêntica
            </li>
          </ul>
        </div>
        <div className="bg-[#f9f4ef] p-4 rounded-lg border border-[#B89B7A]/10">
          <h3 className="font-medium text-[#aa6b5d] mb-2">Quando você domina seu estilo...</h3>
          <ul className="text-[#432818] space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Economiza tempo e dinheiro em compras conscientes
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Projeta a imagem que realmente representa você
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Aumenta sua confiança em qualquer ambiente
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-4 h-4 flex items-center justify-center">
                <svg width="16" height="16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#B89B7A" strokeWidth="1.5" />
                  <path
                    d="M5.5 8.5l2 2 3-4"
                    stroke="#B89B7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Cria looks harmoniosos com menos peças
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default MotivationSection;
