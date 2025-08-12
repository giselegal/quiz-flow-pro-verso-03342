import { Link } from "wouter";
import { Button } from "../components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-[#432818]">404</h1>
        <p className="text-xl mb-8 text-[#8F7A6A]">Página não encontrada</p>
        <Link to="/">
          <Button className="bg-[#B89B7A] hover:bg-[#9F836A] text-white">
            Voltar para o início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
