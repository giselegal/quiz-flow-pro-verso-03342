import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { LANDING_PAGE_AB_TEST, getABTestRedirectUrl } from "../utils/abtest";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Página de entrada que redireciona baseado no teste A/B
 */
const LandingPage: React.FC = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redireciona para uma das variantes do teste A/B
    const redirectUrl = getABTestRedirectUrl(LANDING_PAGE_AB_TEST);

    console.log(`🔄 Landing Page: Redirecionando para ${redirectUrl}`);

    // Pequeno delay para mostrar o loading
    setTimeout(() => {
      setLocation(redirectUrl);
    }, 500);
  }, [setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" color="#B89B7A" className="mx-auto" />
        <p className="mt-4 text-gray-600">
          Carregando sua experiência personalizada...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Ou acesse diretamente:{" "}
          <a href="/quiz" className="text-blue-600 hover:underline">
            Quiz Original
          </a>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
