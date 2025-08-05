import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qikbokffxhofhjehpyxm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpa2Jva2ZmeGhvZmhqZWhweXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4NjQ2NDIsImV4cCI6MjA0OTQ0MDY0Mn0.DiqbhgHCOOOEGYsqXJlSllGOgx0M4hZ9S5OhTjGh85k",
  { auth: { persistSession: false } }
);

async function createTemplates() {
  console.log("🚀 Criando templates na base de dados...");

  // Template padrão de 21 etapas
  const defaultTemplate = {
    id: "template-default-21-steps",
    name: "Funil Completo de Descoberta Pessoal (TEMPLATE)",
    description: "Template completo para descoberta do estilo pessoal - 21 etapas modulares",
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {
      pages_count: 21,
      template_type: "default-21-steps",
      is_template: true,
      category: "personalidade",
      difficulty: "medium",
      estimated_time: 15,
      tags: ["descoberta", "personalidade", "completo"],
    },
  };

  // Template rápido
  const quickTemplate = {
    id: "template-quick-personality",
    name: "Quiz Rápido de Personalidade (TEMPLATE)",
    description: "Template curto e direto para descobrir traços básicos de personalidade",
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {
      pages_count: 7,
      template_type: "quick-personality",
      is_template: true,
      category: "personalidade",
      difficulty: "easy",
      estimated_time: 5,
      tags: ["rápido", "personalidade", "básico"],
    },
  };

  try {
    const { data: template1, error: error1 } = await supabase
      .from("funnels")
      .upsert(defaultTemplate)
      .select()
      .single();

    if (error1) {
      console.error("❌ Erro ao criar template 1:", error1);
    } else {
      console.log("✅ Template 1 criado:", template1.name);
    }

    const { data: template2, error: error2 } = await supabase
      .from("funnels")
      .upsert(quickTemplate)
      .select()
      .single();

    if (error2) {
      console.error("❌ Erro ao criar template 2:", error2);
    } else {
      console.log("✅ Template 2 criado:", template2.name);
    }

    console.log("🎉 Templates criados com sucesso!");
  } catch (error) {
    console.error("❌ Erro geral:", error);
  }
}

createTemplates();
