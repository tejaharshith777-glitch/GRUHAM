import generateImageHandler from "./api/generate-image.js";
import editImageHandler from "./api/edit-image.js";

// Helper to mock express res object
function createMockRes() {
  let statusCode = 200;
  let responseData = null;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    getStatusCode: () => statusCode,
    getData: () => responseData,
  };
}

async function runTests() {
  console.log("==================================================");
  console.log("=== TESTING IMAGE GENERATION & EDIT ENDPOINTS ===");
  console.log("==================================================\n");

  const testIp = "test-session-ip-" + Date.now();

  // 1. Interior Image Request Test
  const reqInterior = {
    method: "POST",
    headers: { "x-forwarded-for": testIp },
    body: {
      type: "interior",
      roomType: "Living Room",
      style: "traditional_indian",
      prompt: "Luxury Indian Living Room with teakwood furniture and warm ambient brass lighting",
      count: 1,
    },
  };
  const resInterior = createMockRes();
  await generateImageHandler(reqInterior, resInterior);
  const interiorData = resInterior.getData();
  console.log("1. INTERIOR DESIGN REQUEST:");
  console.log("   Status:", resInterior.getStatusCode());
  console.log("   Returned Image URL:", interiorData?.url);
  console.log("   Enhanced Prompt:", interiorData?.enhancedPrompt);
  console.log("");

  // 2. Exterior Image Request Test
  const reqExterior = {
    method: "POST",
    headers: { "x-forwarded-for": testIp },
    body: {
      type: "exterior",
      style: "contemporary",
      prompt: "Modern 2-storey Indian villa front elevation with stone cladding and teakwood portico",
      count: 1,
    },
  };
  const resExterior = createMockRes();
  await generateImageHandler(reqExterior, resExterior);
  const exteriorData = resExterior.getData();
  console.log("2. EXTERIOR DESIGN REQUEST:");
  console.log("   Status:", resExterior.getStatusCode());
  console.log("   Returned Image URL:", exteriorData?.url);
  console.log("   Enhanced Prompt:", exteriorData?.enhancedPrompt);
  console.log("");

  // 3. Compound / Boundary Wall Request Test
  const reqCompound = {
    method: "POST",
    headers: { "x-forwarded-for": testIp },
    body: {
      type: "compound",
      style: "south_indian",
      prompt: "Boundary wall with motorized sliding teakwood gate, pillar lanterns, and landscaping",
      count: 1,
    },
  };
  const resCompound = createMockRes();
  await generateImageHandler(reqCompound, resCompound);
  const compoundData = resCompound.getData();
  console.log("3. COMPOUND / BOUNDARY WALL REQUEST:");
  console.log("   Status:", resCompound.getStatusCode());
  console.log("   Returned Image URL:", compoundData?.url);
  console.log("   Enhanced Prompt:", compoundData?.enhancedPrompt);
  console.log("");

  // 4. Image Edit Request Test
  const reqEdit = {
    method: "POST",
    headers: { "x-forwarded-for": testIp },
    body: {
      imageUrl: interiorData?.url,
      editInstruction: "Change the accent wall to sage green and add warm ambient cove lights",
      styleToken: "traditional_indian",
    },
  };
  const resEdit = createMockRes();
  await editImageHandler(reqEdit, resEdit);
  const editData = resEdit.getData();
  console.log("4. IMAGE EDIT REQUEST:");
  console.log("   Status:", resEdit.getStatusCode());
  console.log("   Edited Image URL:", editData?.editedImageUrl);
  console.log("   Prompt Used:", editData?.promptUsed);
  console.log("");

  console.log("==================================================");
  console.log("SUMMARY OF TESTED IMAGE URLS:");
  console.log("Interior URL:", interiorData?.url);
  console.log("Exterior URL:", exteriorData?.url);
  console.log("Compound URL:", compoundData?.url);
  console.log("Edited URL:  ", editData?.editedImageUrl);
  console.log("==================================================");
}

runTests();
