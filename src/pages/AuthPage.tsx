import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
// import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const AuthPage = () => {
  const { login, signup, user } = useAuth();
  // const { t } = useTranslation();
  const navigate = (path: string) => {
    // Para wouter, usamos window.location diretamente
    window.location.href = path;
  };

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        await login(email, password);
        setSuccess("Login realizado com sucesso!");
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        await signup(email, password, name);
        setSuccess("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => navigate("/admin"), 1000);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Editor visual drag-and-drop",
    "Templates profissionais inclusos",
    "Analytics em tempo real",
    "Integração com CRM",
    "Suporte 24/7",
    "LGPD Compliant",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-800/90"></div>
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">QuizFlow</h1>
              <p className="text-blue-100 text-sm">Interactive Marketing</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Transforme visitantes em
              <span className="text-blue-200 block">clientes engajados</span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Crie quizzes interativos e funnels de conversão que capturam leads qualificados e
              aumentam suas vendas.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-100 mb-6">O que você terá acesso:</h3>
            <div className="grid grid-cols-1 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center space-x-8 text-sm text-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10k+</div>
                <div>Empresas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">85%</div>
                <div>Conversão</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">12x</div>
                <div>Engajamento</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header Mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                QuizFlow
              </h1>
            </div>
            <p className="text-slate-600">Bem-vindo de volta!</p>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-slate-600 hover:text-slate-900 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Home
          </Button>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isLogin ? "Acesse sua conta" : "Crie sua conta grátis"}
                </Badge>
              </div>

              <CardTitle className="text-2xl font-bold text-slate-900">
                {isLogin ? "Entrar na plataforma" : "Começar gratuitamente"}
              </CardTitle>

              <CardDescription className="text-slate-600">
                {isLogin
                  ? "Acesse seu dashboard e continue criando experiências incríveis"
                  : "Crie sua conta e comece a converter mais em minutos"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">
                      Nome completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required={!isLogin}
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {!isLogin && <p className="text-xs text-slate-500">Mínimo 6 caracteres</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg text-base font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{isLogin ? "Entrar na plataforma" : "Criar conta grátis"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle Mode */}
              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-slate-600">
                  {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold p-0 h-auto"
                >
                  {isLogin ? "Criar conta grátis" : "Fazer login"}
                </Button>
              </div>

              {/* Security Note */}
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 pt-4">
                <Shield className="h-3 w-3" />
                <span>Seus dados estão protegidos e seguros</span>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="text-center mt-8 space-y-2">
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">
                Termos de Uso
              </a>
              <span>•</span>
              <a href="#" className="hover:text-slate-700 transition-colors">
                Política de Privacidade
              </a>
              <span>•</span>
              <a href="#" className="hover:text-slate-700 transition-colors">
                Suporte
              </a>
            </div>
            <p className="text-xs text-slate-400">
              © 2024 QuizFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
