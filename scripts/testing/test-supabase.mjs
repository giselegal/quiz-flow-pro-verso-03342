import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qikbokffxhofhjehpyxm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpa2Jva2ZmeGhvZmhqZWhweXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjQ2NDIsImV4cCI6MjA0OTQ0MDY0Mn0.DiqbhgHCOOOEGYsqXJlSllGOgx0M4hZ9S5OhTjGh85k"
);

console.log("🧪 Testando conectividade com Supabase...");

try {
  // Testar se a tabela funnels existe
  const { data, error } = await supabase.from("funnels").select("*").limit(1);

  if (error) {
    console.error("❌ Erro ao acessar tabela funnels:", error);
  } else {
    console.log("✅ Tabela funnels acessível!");
    console.log("📊 Dados encontrados:", data?.length || 0, "registros");
  }

  // Testar criação de um usuário anônimo
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

  if (authError) {
    console.error("❌ Erro de autenticação:", authError);
  } else {
    console.log("✅ Usuário anônimo criado:", authData.user?.id);
  }
} catch (e) {
  console.error("❌ Erro geral:", e);
}
