import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de autenticação
    console.log("Auth:", { email, password, isLogin });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Elementos de fundo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-brand-dark rounded-full opacity-10"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-brand rounded-full opacity-5"></div>
      </div>

      <div className="relative max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-brand/20">
        {/* Logo da Gisele Galvão */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-brand/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-brand/30 rounded-full"></div>

            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-3 border-brand">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                alt="Gisele Galvão - Personal Stylist & Business Coach"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-brand-dark">
              {isLogin ? "Bem-vindo de volta" : "Junte-se a nós"}
            </h1>
            <p className="text-lg font-medium text-gray-700">
              Acesse sua conta{" "}
              <span className="font-bold text-brand">QuizFlow</span>
            </p>
            <p className="text-sm text-gray-600">
              Plataforma oficial de conversão digital
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-brand-dark"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="border-2 border-gray-200 focus:border-brand focus:ring-brand/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-brand-dark"
            >
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="border-2 border-gray-200 focus:border-brand focus:ring-brand/20"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-brand/90"
          >
            {isLogin ? "Entrar na Plataforma" : "Criar Minha Conta"}
          </Button>
        </form>

        <div className="mt-8 text-center space-y-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-brand hover:underline transition-colors"
          >
            {isLogin
              ? "Não tem conta? Criar uma gratuita"
              : "Já tem conta? Entrar agora"}
          </button>

          <div className="flex items-center justify-center space-x-4 my-6">
            <div className="h-px w-12 bg-gray-300"></div>
            <div className="w-2 h-2 bg-brand rounded-full"></div>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide text-gray-600">
                Transforme dados em insights • Simplifique • Interaja • Converta
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 bg-brand rounded-full"></div>
                <p className="text-xs text-gray-500">
                  Powered by{" "}
                  <span className="font-semibold">Gisele Galvão</span>
                </p>
                <div className="w-1 h-1 bg-brand rounded-full"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-3 h-3 flex items-center justify-center bg-brand rounded-full text-xs font-bold text-white">
                  ©
                </div>
                <p className="text-xs text-gray-600">
                  2025 Gisele Galvão. Todos os direitos reservados.
                </p>
              </div>

              <p className="text-xs leading-relaxed max-w-sm mx-auto text-gray-500">
                <span className="font-semibold">QuizFlow</span> é uma marca
                registrada de
                <span className="font-semibold">
                  {" "}
                  Gisele Galvão Personal Stylist & Business Coach
                </span>
                . Plataforma especializada em conversão digital através de
                quizzes interativos.
              </p>

              <div className="flex items-center justify-center space-x-4 text-xs mt-3">
                <a
                  href="#"
                  className="text-brand hover:underline transition-colors"
                >
                  Termos de Uso
                </a>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <a
                  href="#"
                  className="text-brand hover:underline transition-colors"
                >
                  Política de Privacidade
                </a>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <a
                  href="#"
                  className="text-brand hover:underline transition-colors"
                >
                  Contato
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
