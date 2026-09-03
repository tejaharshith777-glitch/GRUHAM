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
  console.log("=== TESTING IMAGE GENERATION & EDIT ENDPOINTS ===");

  // 1. Interior Image Request Test
  const reqInterior = {
    method: "POST",
    headers: { "x-forwarded-for": "test-ip-123" },
    body: {
      type: "interior",
      roomType: "Living Room",
      style: "modern_kerala",
      prompt: "Luxury Living Room with teakwood furniture and warm brass accent lights",
      count: 1,
    },
  };
  const resInterior = createMockRes();
  await generateImageHandler(reqInterior, resInterior);
  console.log("\n1. Interior Design Request:");
  console.log("Status:", resInterior.getStatusCode());
  console.log("Returned Image URL:", resInterior.getData()?.url);

  // 2. Exterior Image Request Test
  const reqExterior = {
    method: "POST",
    headers: { "x-forwarded-for": "test-ip-123" },
    body: {
      type: "exterior",
      style: "contemporary",
      prompt: "Modern 2-storey Indian villa facade with glass balconies and stone cladding",
      count: 1,
    },
  };
  const resExterior = createMockRes();
  await generateImageHandler(reqExterior, resExterior);
  console.log("\n2. Exterior Design Request:");
  console.log("Status:", resExterior.getStatusCode());
  console.log("Returned Image URL:", resExterior.getData()?.url);

  // 3. Compound Wall Image Request Test
  const reqCompound = {
    method: "POST",
    headers: { "x-forwarded-for": "test-ip-123" },
    body: {
      type: "compound",
      style: "contemporary",
      prompt: "Boundary wall with motorized sliding teakwood gate and pillar lanterns",
      count: 1,
    },
  };
  const resCompound = createMockRes();
  await generateImageHandler(reqCompound, resCompound);
  console.log("\n3. Compound / Boundary Wall Request:");
  console.log("Status:", resCompound.getStatusCode());
  console.log("Returned Image URL:", resCompound.getData()?.url);

  // 4. Edit Image Request Test
  const reqEdit = {
    method: "POST",
    headers: { "x-forwarded-for": "test-ip-123" },
    body: {
      imageUrl: resInterior.getData()?.url,
      editInstruction: "Change the living room accent wall to sage green and add warm ambient cove lights",
      styleToken: "modern_kerala",
    },
  };
  const resEdit = createMockRes();
  await editImageHandler(reqEdit, resEdit);
  console.log("\n4. Image Edit Request:");
  console.log("Status:", resEdit.getStatusCode());
  console.log("Edited Image URL:", resEdit.getData()?.editedImageUrl);
}

runTests();
