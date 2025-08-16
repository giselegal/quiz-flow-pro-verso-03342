const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function cleanDuplicatePages() {
  try {
    console.log("🧹 Limpando páginas duplicadas...");

    // Primeiro, vamos ver todas as páginas
    const { data: allPages, error: selectError } = await supabase.from("funnel_pages").select("*");

    if (selectError) {
      console.error("❌ Erro ao buscar páginas:", selectError);
      return;
    }

    console.log("📋 Total de páginas encontradas:", allPages?.length || 0);

    // Agrupar por ID para encontrar duplicatas
    const pageGroups = {};
    allPages?.forEach(page => {
      if (!pageGroups[page.id]) {
        pageGroups[page.id] = [];
      }
      pageGroups[page.id].push(page);
    });

    // Encontrar duplicatas
    const duplicates = Object.entries(pageGroups).filter(([id, pages]) => pages.length > 1);

    console.log("🔍 Páginas duplicadas encontradas:", duplicates.length);

    for (const [pageId, pages] of duplicates) {
      console.log(`\n📄 Página ID: ${pageId}`);
      console.log(`   Duplicatas: ${pages.length}`);

      // Manter apenas a primeira e deletar as outras
      const toDelete = pages.slice(1);

      for (const page of toDelete) {
        console.log(`   🗑️ Deletando duplicata: funnel_id=${page.funnel_id}, title=${page.title}`);

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
    }

    // Verificar se ainda há duplicatas
    const { data: remainingPages } = await supabase.from("funnel_pages").select("id");

    const remainingIds = remainingPages?.map(p => p.id) || [];
    const uniqueIds = [...new Set(remainingIds)];

    console.log("\n📊 Resultado final:");
    console.log(`   Total de páginas: ${remainingIds.length}`);
    console.log(`   IDs únicos: ${uniqueIds.length}`);
    console.log(`   Duplicatas restantes: ${remainingIds.length - uniqueIds.length}`);

    if (remainingIds.length === uniqueIds.length) {
      console.log("✅ Limpeza concluída com sucesso! Não há mais duplicatas.");
    } else {
      console.log("⚠️ Ainda há duplicatas restantes.");
    }
  } catch (error) {
    console.error("❌ Erro durante a limpeza:", error);
  }
}

cleanDuplicatePages();
