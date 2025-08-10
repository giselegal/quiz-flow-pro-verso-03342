const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkSpecificPage() {
  try {
    console.log("🔍 Verificando página específica: etapa-1-intro");

    // Buscar todas as páginas com esse ID
    const { data: pages, error } = await supabase
      .from("funnel_pages")
      .select("*")
      .eq("id", "etapa-1-intro");

    if (error) {
      console.error("❌ Erro ao buscar página:", error);
      return;
    }

    console.log('📋 Páginas encontradas com ID "etapa-1-intro":', pages?.length || 0);

    if (pages && pages.length > 0) {
      pages.forEach((page, index) => {
        console.log(`\n📄 Página ${index + 1}:`);
        console.log(`   ID: ${page.id}`);
        console.log(`   Funnel ID: ${page.funnel_id}`);
        console.log(`   Title: ${page.title}`);
        console.log(`   Page Type: ${page.page_type}`);
        console.log(`   Page Order: ${page.page_order}`);
      });

      // Se há mais de uma, deletar todas exceto a primeira
      if (pages.length > 1) {
        console.log("\n🗑️ Deletando páginas duplicadas...");

        for (let i = 1; i < pages.length; i++) {
          const page = pages[i];
          console.log(`   Deletando página ${i + 1}: funnel_id=${page.funnel_id}`);

          const { error: deleteError } = await supabase
            .from("funnel_pages")
            .delete()
            .eq("id", page.id)
            .eq("funnel_id", page.funnel_id);

          if (deleteError) {
            console.error(`   ❌ Erro ao deletar: ${deleteError.message}`);
          } else {
            console.log(`   ✅ Deletado com sucesso`);
          }
        }
      } else {
        console.log("✅ Apenas uma página encontrada, não há duplicatas.");
      }
    } else {
      console.log("ℹ️ Nenhuma página encontrada com esse ID.");
    }

    // Verificar novamente após limpeza
    const { data: remainingPages } = await supabase
      .from("funnel_pages")
      .select("*")
      .eq("id", "etapa-1-intro");

    console.log("\n📊 Resultado final:");
    console.log(`   Páginas restantes com ID "etapa-1-intro": ${remainingPages?.length || 0}`);
  } catch (error) {
    console.error("❌ Erro durante a verificação:", error);
  }
}

checkSpecificPage();
