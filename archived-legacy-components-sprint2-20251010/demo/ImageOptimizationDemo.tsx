// Update the import path if the file is located elsewhere, for example:
import EnhancedAutoFixedImages from '../ui/EnhancedAutoFixedImages';
// Or create the file at src/components/demo/ui/EnhancedAutoFixedImages.tsx if it doesn't exist.

/**
 * Componente exemplo que demonstra o uso do EnhancedAutoFixedImages
 * para resolver o problema de imagens borradas de forma otimizada.
 */
const ImageOptimizationDemo: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Demonstração de Otimização de Imagens</h1>

      <div className="flex flex-col space-y-8">
        {/* Seção com EnhancedAutoFixedImages */}
        <section>
          <h2 className="text-lg font-medium mb-2">Com otimização automática</h2>
          <p style={{ color: '#6B4F43' }}>
            Esta seção usa o componente EnhancedAutoFixedImages para corrigir automaticamente
            imagens borradas, com detecção inteligente do LCP e escopo limitado.
          </p>

          <EnhancedAutoFixedImages className="border border-[#B89B7A]/30 rounded-lg p-4 bg-[#B89B7A]/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Imagem do Cloudinary</h3>
                <img
                  src="https://res.cloudinary.com/demo/image/upload/q_auto,f_auto/sample"
                  alt="Exemplo do Cloudinary"
                  className="w-full h-auto rounded-md"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Imagem com Qualidade Baixa</h3>
                <img
                  src="https://res.cloudinary.com/demo/image/upload/q_30/sample"
                  alt="Exemplo com qualidade baixa"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </EnhancedAutoFixedImages>
        </section>

        {/* Seção sem EnhancedAutoFixedImages para comparação */}
        <section>
          <h2 className="text-lg font-medium mb-2">Sem otimização automática</h2>
          <p style={{ color: '#6B4F43' }}>
            Esta seção não usa o componente de correção, mostrando as imagens como seriam
            naturalmente carregadas sem otimização automática.
          </p>

          <div style={{ borderColor: '#E5DDD5' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Imagem do Cloudinary</h3>
                <img
                  src="https://res.cloudinary.com/demo/image/upload/q_auto,f_auto/sample"
                  alt="Exemplo do Cloudinary"
                  className="w-full h-auto rounded-md"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Imagem com Qualidade Baixa</h3>
                <img
                  src="https://res.cloudinary.com/demo/image/upload/q_30/sample"
                  alt="Exemplo com qualidade baixa"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div style={{ borderColor: '#E5DDD5' }}>
        <h2 className="text-lg font-medium mb-2">Como funciona</h2>
        <p style={{ color: '#6B4F43' }}>
          O componente EnhancedAutoFixedImages detecta precisamente quando o LCP ocorre, e otimiza
          as imagens de forma adaptativa às características do dispositivo, como densidade de pixels
          e capacidade de processamento. Isso resulta em imagens mais nítidas, sem sobrecarregar
          dispositivos de baixo desempenho.
        </p>
      </div>
    </div>
  );
};

export default ImageOptimizationDemo;
