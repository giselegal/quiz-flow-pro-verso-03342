const baseUrl = "http://localhost:3001/api/schema-driven";

async function testSaveExistingFunnel() {
  try {
    console.log("🔍 Testing save functionality for existing funnel...");

    // 1. Primeiro, listar funnels existentes
    console.log("\n1. Listing existing funnels...");
    const listResponse = await fetch(`${baseUrl}/funnels`);
    console.log(`List response status: ${listResponse.status}`);

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.log("❌ Failed to list funnels:", errorText);
      return;
    }

    const funnels = await listResponse.json();
    console.log("Raw response:", JSON.stringify(funnels, null, 2));

    if (!funnels || funnels.length === 0) {
      console.log("❌ No funnels found to test with");
      return;
    }

    console.log(`Found ${funnels.length} funnels`);

    // 2. Pegar o primeiro funil
    const existingFunnel = funnels[0];
    console.log(`\n2. Testing with funnel: ${existingFunnel.id} - "${existingFunnel.name}"`);

    // 3. Tentar fazer um PUT (update) como o frontend faria
    console.log("\n3. Attempting to save (PUT) the funnel...");
    const updateData = {
      ...existingFunnel,
      name: existingFunnel.name + " (Updated)",
      lastModified: new Date().toISOString(),
    };

    console.log(`PUT URL: ${baseUrl}/funnels/${existingFunnel.id}`);
    console.log("Request body preview:", {
      id: updateData.id,
      name: updateData.name,
      pagesCount: updateData.pages?.length || 0,
    });

    const saveResponse = await fetch(`${baseUrl}/funnels/${existingFunnel.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    console.log(`Response status: ${saveResponse.status} ${saveResponse.statusText}`);

    if (saveResponse.ok) {
      const result = await saveResponse.json();
      console.log("✅ Save successful!");
      console.log("Response data:", {
        id: result.data?.id,
        name: result.data?.name,
        lastModified: result.data?.lastModified,
      });
    } else {
      const errorText = await saveResponse.text();
      console.log("❌ Save failed!");
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

testSaveExistingFunnel();
