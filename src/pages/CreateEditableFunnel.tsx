/**
 * 🎯 CRIAR FUNIL EDITÁVEL
 * 
 * Página para duplicar o template quiz21StepsComplete e criar um funil editável
 */

import { useState, useEffect } from 'react';
import { useNavigationSafe } from '@/hooks/useNavigationSafe';
import { supabase } from '@/services/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CreateEditableFunnel() {
  const [name, setName] = useState('Meu Quiz de Estilo');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { navigateTo } = useNavigationSafe();
  const { toast } = useToast();

  // Verificar autenticação ao montar
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateFunnel() {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para seu funil",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Gerar ID único para o funil
      const newFunnelId = `funnel_${Date.now()}_${nanoid(12)}`;

      // Chamar função RPC do Supabase para duplicar template
      const { data, error } = await supabase.rpc('duplicate_quiz_template', {
        template_slug: 'quiz21StepsComplete',
        new_name: name,
        new_funnel_id: newFunnelId,
      });

      if (error) throw error;

      toast({
        title: "🎉 Funil criado com sucesso!",
        description: `"${name}" está pronto para edição`,
      });

      // Redirecionar para o editor
      setTimeout(() => {
        navigateTo(`/editor?funnelId=${newFunnelId}`);
      }, 1000);

    } catch (error: any) {
      console.error('Erro ao criar funil:', error);
      
      toast({
        title: "Erro ao criar funil",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSignup() {
    // Redirecionar para página de cadastro no modo signup
    navigateTo('/auth?mode=signup');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF9F7] to-[#F3E8D3]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B89B7A]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF9F7] to-[#F3E8D3] p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#B89B7A]/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#B89B7A]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#432818]">
              Crie seu Quiz Editável
            </CardTitle>
            <CardDescription>
              Faça login para duplicar o template e ter um funil totalmente editável com 21 etapas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#F3E8D3]/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#432818]">21 etapas completas editáveis</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#432818]">Personalize textos, imagens e opções</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#432818]">Salve e publique quando quiser</p>
              </div>
            </div>
            <Button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] hover:opacity-90 text-white"
            >
              Fazer Login / Criar Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF9F7] to-[#F3E8D3] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#B89B7A]/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#B89B7A]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#432818]">
            Criar Funil Editável
          </CardTitle>
          <CardDescription>
            Duplique o template Quiz de Estilo e tenha total controle sobre as 21 etapas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="funnel-name" className="text-[#432818] font-medium">
              Nome do Funil
            </Label>
            <Input
              id="funnel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Meu Quiz de Estilo"
              className="border-[#B89B7A]/30 focus:border-[#B89B7A]"
              disabled={isCreating}
            />
          </div>

          <div className="bg-[#F3E8D3]/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-[#432818]">O que você vai ter:</p>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#432818]">21 etapas completas e editáveis</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#432818]">Editor visual intuitivo</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#B89B7A] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#432818]">Salvo automaticamente no backend</p>
            </div>
          </div>

          <Button
            onClick={handleCreateFunnel}
            disabled={isCreating || !name.trim()}
            className="w-full bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] hover:opacity-90 text-white"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Criando funil...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Criar Funil Agora
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
