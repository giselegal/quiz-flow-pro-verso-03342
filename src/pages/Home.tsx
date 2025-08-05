import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/context/AuthContext";

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirecionar para auth se não estiver logado
    if (!loading && !user) {
      setLocation("/auth");
    }
  }, [user, loading, setLocation]);

  const handleStartQuiz = () => {
    setLocation("/editor");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header com informações do usuário */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Quiz Quest</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Olá, {user.name || user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Quiz Quest Challenge Verse
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie quizzes interativos incríveis, funis de conversão e capture leads de forma
              inteligente.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleStartQuiz}>
              Criar Quiz
            </Button>
            <Button variant="outline" size="lg" onClick={() => setLocation("/admin/funis")}>
              Ver Funis
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-lg font-bold">Q</span>
              </div>
              <h3 className="text-lg font-semibold">Quizzes Inteligentes</h3>
              <p className="text-muted-foreground">
                Crie quizzes envolventes com lógica avançada e personalização completa.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-lg font-bold">F</span>
              </div>
              <h3 className="text-lg font-semibold">Funis de Conversão</h3>
              <p className="text-muted-foreground">
                Construa funis poderosos que convertem visitantes em leads qualificados.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <span className="text-primary-foreground text-lg font-bold">A</span>
              </div>
              <h3 className="text-lg font-semibold">Analytics Avançado</h3>
              <p className="text-muted-foreground">
                Acompanhe métricas detalhadas e otimize seus resultados em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
