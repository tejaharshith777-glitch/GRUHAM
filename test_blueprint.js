import { generateBlueprint } from "./src/lib/blueprintEngine.js";

// Test Case 1: 30x40 Plot, 2 BHK, 2 Floors, Vastu Compliant
const testCase1 = generateBlueprint({
  plotLength: 40,
  plotWidth: 30,
  bhk: 2,
  floors: 2,
  facing: "E",
  vastuPreference: "strict",
  style: "traditional",
  budget: "standard",
  city: "Bengaluru",
});

console.log("=== TEST CASE 1: 30x40 Plot, 2 BHK, 2 Floors (Vastu Compliant) ===");
console.log(JSON.stringify(testCase1, null, 2));
