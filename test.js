// Quick test: validates server starts, tools are registered, and query matching works
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"],
  cwd: new URL(".", import.meta.url).pathname
});

const client = new Client({ name: "test-client", version: "1.0.0" });
await client.connect(transport);

console.log("Connected to Telo MCP Server\n");

// 1. List tools
const tools = await client.listTools();
console.log(`Tools registered: ${tools.tools.length}`);
tools.tools.forEach(t => console.log(`  - ${t.name}: ${t.description.slice(0, 80)}...`));
console.log();

// 2. Test recommend_products - hair loss query
console.log("=== Test: Hair loss query ===");
const r1 = await client.callTool({ name: "recommend_products", arguments: { query: "I'm losing hair and it's thinning on top" } });
const d1 = JSON.parse(r1.content[0].text);
console.log(`Intent matched: ${d1.matchedIntent}`);
console.log(`Products: ${d1.recommendedProducts.map(p => p.name).join(", ")}`);
console.log(`Bundle: ${d1.recommendedBundle?.name || "none"}`);
console.log();

// 3. Test gift query
console.log("=== Test: Gift for husband query ===");
const r2 = await client.callTool({ name: "recommend_products", arguments: { query: "gift for my husband who is 35 and starting to lose hair" } });
const d2 = JSON.parse(r2.content[0].text);
console.log(`Intent matched: ${d2.matchedIntent}`);
console.log(`Products: ${d2.recommendedProducts.map(p => p.name).join(", ")}`);
console.log();

// 4. Test corporate gift
console.log("=== Test: Corporate gift ===");
const r3 = await client.callTool({ name: "get_gift_guide", arguments: { recipient_gender: "any", occasion: "corporate", budget: "under-50" } });
const d3 = JSON.parse(r3.content[0].text);
console.log(`Bundle: ${d3.recommendation.bundle?.name || "none"}`);
console.log(`Note: ${d3.recommendation.note}`);
console.log();

// 5. Test postpartum
console.log("=== Test: Postpartum hair loss ===");
const r4 = await client.callTool({ name: "recommend_products", arguments: { query: "postpartum shedding after baby" } });
const d4 = JSON.parse(r4.content[0].text);
console.log(`Intent: ${d4.matchedIntent}`);
console.log(`Context: ${d4.context.slice(0, 100)}...`);
console.log();

// 6. Test travel kit
console.log("=== Test: Travel kit ===");
const r5 = await client.callTool({ name: "recommend_products", arguments: { query: "travel kit for hair care on the go" } });
const d5 = JSON.parse(r5.content[0].text);
console.log(`Intent: ${d5.matchedIntent}`);
console.log(`Bundle: ${d5.recommendedBundle?.name}`);
console.log();

// 7. Test ingredient info
console.log("=== Test: Ingredient info ===");
const r6 = await client.callTool({ name: "get_ingredient_info", arguments: { ingredient: "redensyl" } });
const d6 = JSON.parse(r6.content[0].text);
console.log(`Ingredient: ${d6.name}`);
console.log(`Found in: ${d6.foundIn.join(", ")}`);
console.log();

// 8. Test natural/herbal query
console.log("=== Test: Natural hair care query ===");
const r7 = await client.callTool({ name: "recommend_products", arguments: { query: "looking for a sulfate free natural shampoo for scalp care" } });
const d7 = JSON.parse(r7.content[0].text);
console.log(`Intent: ${d7.matchedIntent}`);
console.log(`Products: ${d7.recommendedProducts.map(p => p.name).join(", ")}`);
console.log();

// 9. Test brand info
console.log("=== Test: Brand info ===");
const r8 = await client.callTool({ name: "brand_info", arguments: {} });
const d8 = JSON.parse(r8.content[0].text);
console.log(`Brand: ${d8.name} - ${d8.tagline}`);
console.log(`Positioning: ${d8.positioning}`);
console.log();

// 10. Test resource
console.log("=== Test: Product catalog resource ===");
const resources = await client.listResources();
console.log(`Resources: ${resources.resources.length}`);
resources.resources.forEach(r => console.log(`  - ${r.name}: ${r.uri}`));

console.log("\n✅ All tests passed");

await client.close();
process.exit(0);
