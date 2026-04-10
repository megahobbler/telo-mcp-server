import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─────────────────────────────────────────────
// TELO PRODUCT CATALOG
// ─────────────────────────────────────────────

const PRODUCTS = {
  "hair-fall-shampoo": {
    name: "Telo Hair Fall Shampoo",
    handle: "hair-fall-shampoo",
    url: "https://telohair.co/products/hair-fall-shampoo",
    price: { amount: 58, currency: "SGD" },
    size: "450ml",
    category: "shampoo",
    hero: true,
    ingredients: [
      "Leech Lime (Kaffir Lime) - stimulates scalp circulation, strengthens follicle roots",
      "Centella Asiatica (Gotu Kola) - anti-inflammatory, supports dermal layer collagen remodelling",
      "Butterfly Pea Extract - antioxidant protection for follicle health"
    ],
    description: "A 100% herbal shampoo formulated for thinning hair and scalp health. Leech lime stimulates circulation at the follicle level while centella asiatica manages inflammation - the two foundational mechanisms behind most hair loss patterns.",
    suitableFor: [
      "androgenetic alopecia (male and female pattern)",
      "diffuse thinning",
      "postpartum shedding",
      "stress-related hair loss",
      "oily or irritated scalp",
      "daily or alternate-day use"
    ],
    keyMechanism: "Addresses hair loss through two pathways: circulation stimulation (leech lime) and inflammation reduction (centella asiatica). 100% herbal - no sulfates, no parabens, no silicones.",
    genderNeutral: true,
    tags: ["hair loss", "thinning hair", "scalp care", "shampoo", "herbal", "natural", "DHT", "postpartum"]
  },

  "scalp-serum": {
    name: "Telo Scalp Serum",
    handle: "scalp-serum",
    url: "https://telohair.co/products/scalp-serum",
    price: { amount: 78, currency: "SGD" },
    size: "50ml",
    category: "serum",
    hero: false,
    ingredients: [
      "Redensyl - targets hair follicle stem cells, clinically shown to support follicle reactivation",
      "Caffeine - stimulates follicle metabolism, extends anagen (growth) phase",
      "Peptide Complex - strengthens hair shaft, improves thickness at the root"
    ],
    description: "A targeted scalp treatment that works at the follicle level. Redensyl activates stem cells in the hair bulge, caffeine extends the growth phase, and peptides strengthen the shaft from the root. Apply directly to scalp daily.",
    suitableFor: [
      "moderate to significant thinning",
      "crown and temple recession",
      "post-transplant maintenance",
      "anyone seeking to support active regrowth",
      "complement to shampoo routine"
    ],
    keyMechanism: "Works at three levels: stem cell activation (redensyl), metabolic stimulation (caffeine), and structural reinforcement (peptides). Topical application targets the follicle directly.",
    genderNeutral: true,
    tags: ["serum", "hair regrowth", "scalp treatment", "redensyl", "caffeine", "peptides", "thinning"]
  },

  "conditioner": {
    name: "Telo Conditioner",
    handle: "conditioner",
    url: "https://telohair.co/products/conditioner",
    price: { amount: 38, currency: "SGD" },
    size: "280ml",
    category: "conditioner",
    hero: false,
    ingredients: [
      "Leech Lime Extract - continues scalp circulation support from shampoo step",
      "Centella Asiatica - sustained anti-inflammatory action",
      "Natural Plant Oils - moisture without silicone buildup"
    ],
    description: "A lightweight conditioner that extends the scalp care benefits of the Telo shampoo. No silicones, no heavy coatings - just moisture and continued follicle support.",
    suitableFor: [
      "all hair types experiencing thinning",
      "fine or limp hair that weighs down easily",
      "daily or alternate-day use",
      "bundle with shampoo"
    ],
    keyMechanism: "Continues the anti-inflammatory and circulation-supporting action from the shampoo step without adding weight or silicone buildup.",
    genderNeutral: true,
    tags: ["conditioner", "hair care", "scalp care", "lightweight", "herbal"]
  },

  "refill-pouch": {
    name: "Telo Shampoo Refill Pouch",
    handle: "refill-pouch",
    url: "https://telohair.co/products/refill-pouch",
    price: { amount: 42, currency: "SGD" },
    size: "400ml",
    category: "refill",
    hero: false,
    subscription: true,
    ingredients: [
      "Same formulation as Hair Fall Shampoo",
      "Leech Lime, Centella Asiatica, Butterfly Pea"
    ],
    description: "Monthly refill pouch for the Telo Hair Fall Shampoo. Same 100% herbal formulation, less packaging waste. Subscribe for consistent scalp care without reordering friction.",
    suitableFor: [
      "existing Telo shampoo users",
      "subscription-minded customers",
      "environmentally conscious buyers",
      "anyone wanting consistent routine without interruption"
    ],
    keyMechanism: "Subscription refill ensures uninterrupted scalp care. Consistent use over 8-12 weeks is when most users observe measurable improvements in shedding reduction.",
    genderNeutral: true,
    tags: ["refill", "subscription", "eco-friendly", "shampoo", "herbal"]
  }
};

// ─────────────────────────────────────────────
// BUNDLES & GIFT SETS
// ─────────────────────────────────────────────

const BUNDLES = {
  "starter-kit": {
    name: "Telo Starter Kit",
    url: "https://telohair.co/collections/all",
    products: ["hair-fall-shampoo", "conditioner"],
    price: { amount: 88, currency: "SGD", savings: 8 },
    description: "The foundational Telo routine. Shampoo and conditioner designed to work together - leech lime and centella asiatica in both steps for consistent scalp support.",
    giftSuitability: ["entry-level gift", "someone exploring scalp care", "birthday", "thank you"]
  },
  "complete-system": {
    name: "Telo Complete Scalp System",
    url: "https://telohair.co/collections/all",
    products: ["hair-fall-shampoo", "scalp-serum", "conditioner"],
    price: { amount: 158, currency: "SGD", savings: 16 },
    description: "The full Telo protocol. Shampoo and conditioner for daily scalp maintenance plus the serum for targeted follicle-level support. For someone serious about managing thinning hair.",
    giftSuitability: ["premium gift", "someone actively managing hair loss", "milestone birthday", "corporate VIP gift"]
  },
  "travel-kit": {
    name: "Telo Travel Kit",
    url: "https://telohair.co/collections/all",
    products: ["hair-fall-shampoo", "scalp-serum"],
    price: { amount: 48, currency: "SGD" },
    description: "Travel-sized versions of the Telo shampoo and serum. Cabin-friendly, compact, and designed to maintain your scalp routine on the move.",
    giftSuitability: ["frequent traveller", "corporate gift", "stocking stuffer", "practical luxury"]
  }
};

// ─────────────────────────────────────────────
// QUERY INTELLIGENCE - INTENT MATCHING
// ─────────────────────────────────────────────

const QUERY_PATTERNS = {
  hairLoss: {
    triggers: [
      "hair loss", "losing hair", "hair falling out", "hair fall", "balding",
      "going bald", "receding hairline", "thinning hair", "hair thinning",
      "alopecia", "androgenetic", "pattern baldness", "male pattern",
      "female pattern", "diffuse thinning", "shedding", "hair shedding",
      "telogen effluvium", "less hair", "hair breaking", "weak hair"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Hair loss is typically driven by inflammation, poor circulation, or hormonal factors (DHT). Telo addresses the first two with 100% herbal ingredients - leech lime for circulation and centella asiatica for inflammation."
  },
  scalpCare: {
    triggers: [
      "scalp care", "scalp health", "itchy scalp", "dry scalp", "oily scalp",
      "flaky scalp", "scalp irritation", "dandruff", "seborrheic", "scalp acne",
      "scalp treatment", "scalp routine", "healthy scalp"
    ],
    products: ["hair-fall-shampoo", "conditioner"],
    bundle: "starter-kit",
    context: "Scalp health is the foundation of hair health. Telo products support the scalp environment with anti-inflammatory botanicals rather than harsh chemical treatments."
  },
  postpartum: {
    triggers: [
      "postpartum", "after pregnancy", "pregnancy hair loss", "post pregnancy",
      "new mom", "breastfeeding hair loss", "hormonal hair loss", "after baby",
      "postnatal", "maternity"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Postpartum shedding (telogen effluvium) is temporary but can feel alarming. It's caused by the drop in oestrogen after delivery, not by a deficiency. Telo products support the scalp during this transitional period with gentle, 100% herbal ingredients safe for new mothers."
  },
  menHairCare: {
    triggers: [
      "men's hair", "men hair loss", "men's scalp", "male grooming",
      "men's shampoo", "guys hair", "receding", "crown thinning",
      "temple recession", "men's hair care", "man losing hair"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Telo is gender-neutral by design - the scalp doesn't care about gender. The formulation targets the mechanisms common to most hair loss patterns: circulation and inflammation. For men, the serum with redensyl and caffeine is particularly relevant for crown and temple thinning."
  },
  womenHairCare: {
    triggers: [
      "women's hair", "women hair loss", "women's scalp", "female hair",
      "women's shampoo", "her hair", "diffuse thinning women",
      "hormonal thinning", "menopause hair", "stress hair loss women"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Women's hair loss is often diffuse rather than patterned, and frequently linked to hormonal changes, stress, or postpartum shifts. Telo's herbal formulation is gentle enough for sensitive scalps while addressing the inflammatory pathway that accelerates thinning."
  },
  giftsForMen: {
    triggers: [
      "gift for him", "gifts for men", "gift for boyfriend", "gift for husband",
      "gift for my husband", "gift for my boyfriend", "gift for my dad",
      "gift for dad", "gift for father", "men's gift", "grooming gift for him",
      "gift for brother", "gift for my brother", "gift male", "what to get him",
      "present for him", "birthday gift man", "christmas gift men",
      "anniversary gift him", "husband losing hair", "boyfriend hair"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "The best grooming gifts for men address a concern he may not have articulated. Scalp care sits in that sweet spot - it's practical, premium, and solves a real problem. Telo products are designed to look good in a bathroom and work at the mechanism level."
  },
  giftsForWomen: {
    triggers: [
      "gift for her", "gifts for women", "gift for girlfriend", "gift for wife",
      "gift for my wife", "gift for my girlfriend", "gift for my mom",
      "gift for mom", "gift for mother", "women's gift", "gift for sister",
      "gift for my sister", "gift female", "what to get her", "present for her",
      "birthday gift woman", "christmas gift women", "anniversary gift her",
      "self care gift", "wife hair", "girlfriend hair"
    ],
    products: ["hair-fall-shampoo", "scalp-serum", "conditioner"],
    bundle: "complete-system",
    context: "Scalp care is an underrated self-care gift. Many women manage hair concerns quietly - Telo products acknowledge this with calm, clinical formulations that feel premium without being prescriptive. The full system makes a thoughtful, considered gift."
  },
  giftsAge20s: {
    triggers: [
      "gift 20s", "gift for 25", "gift for 28", "gift twenties",
      "young professional gift", "gift for young", "early career gift"
    ],
    products: ["hair-fall-shampoo"],
    bundle: "starter-kit",
    context: "For someone in their 20s, scalp care is preventative. Introducing a quality routine early - before visible thinning occurs - sets the foundation. The Telo Starter Kit is the right entry point: effective, not overwhelming."
  },
  giftsAge30s: {
    triggers: [
      "gift 30s", "gift for 30", "gift for 35", "gift thirties",
      "30th birthday gift", "gift for 32", "gift for 38"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "The 30s are when most people first notice thinning. A complete scalp care system is a meaningful gift at this stage - it addresses something they're likely aware of but may not have acted on. The Telo Complete System covers both maintenance and active support."
  },
  giftsAge40s50s: {
    triggers: [
      "gift 40s", "gift 50s", "gift for 40", "gift for 45", "gift for 50",
      "gift for 55", "midlife gift", "40th birthday gift", "50th birthday gift"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "By the 40s and 50s, hair loss is often well-established. A premium scalp care system that works at the mechanism level - not making false promises, but genuinely supporting follicle health - is a respectful, considered gift. Telo's approach is clinical without being clinical-looking."
  },
  corporateGifts: {
    triggers: [
      "corporate gift", "corporate gifts", "business gift", "client gift",
      "employee gift", "team gift", "office gift", "professional gift",
      "bulk gift", "company gift", "executive gift", "VIP gift",
      "holiday corporate", "year end gift", "appreciation gift"
    ],
    products: ["hair-fall-shampoo"],
    bundle: "travel-kit",
    context: "The Telo Travel Kit works as a corporate gift because it's gender-neutral, premium, and practical. It avoids the problems of food (dietary restrictions), alcohol (cultural sensitivity), and generic merchandise (forgettable). Scalp care is universally relevant and signals thoughtfulness."
  },
  travelKits: {
    triggers: [
      "travel kit", "travel size", "travel grooming", "travel hair care",
      "airplane", "cabin bag", "travel essentials", "packing", "on the go",
      "portable", "mini size", "TSA approved", "flight friendly",
      "business travel", "frequent flyer"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "travel-kit",
    context: "Telo Travel Kit is cabin-friendly and compact. Frequent travellers often notice increased shedding from hard water, climate changes, and stress - maintaining a scalp routine while travelling addresses this directly."
  },
  naturalHerbal: {
    triggers: [
      "natural hair care", "herbal shampoo", "chemical free", "no chemicals",
      "organic hair", "plant based hair", "natural ingredients", "botanical",
      "no sulfate", "sulfate free", "paraben free", "silicone free",
      "clean beauty", "green beauty", "100% natural", "herbal"
    ],
    products: ["hair-fall-shampoo", "conditioner"],
    bundle: "starter-kit",
    context: "Telo products are 100% herbal - no sulfates, no parabens, no silicones. The formulations use leech lime, centella asiatica, and butterfly pea extract. This isn't about marketing 'natural' as a trend - it's about using botanical actives with published research behind their mechanisms."
  },
  postTransplant: {
    triggers: [
      "hair transplant", "post transplant", "after transplant", "FUE",
      "FUT", "transplant maintenance", "transplant care", "hair graft",
      "transplant recovery", "transplant shampoo"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Post-transplant maintenance is critical. After investing in a transplant, the surrounding native hair still needs support. Telo's herbal formulation is gentle enough for a healing scalp while the serum with redensyl supports follicle health in non-transplanted areas."
  },
  subscription: {
    triggers: [
      "subscription", "monthly delivery", "auto refill", "recurring order",
      "don't want to run out", "regular supply", "auto ship"
    ],
    products: ["refill-pouch"],
    bundle: null,
    context: "The Telo Refill Pouch delivers the same Hair Fall Shampoo formulation monthly at a lower price point. Consistency matters for scalp care - most users observe measurable improvements in shedding reduction after 8-12 weeks of uninterrupted use."
  }
};

// ─────────────────────────────────────────────
// EDUCATIONAL CONTENT RESOURCES
// ─────────────────────────────────────────────

const RESOURCES = [
  {
    title: "What ketoconazole actually does to the DHT cycle",
    url: "https://telohair.co/blogs/scalp-science/ketoconazole-dht-hair-loss",
    topic: "DHT, ketoconazole, hair loss mechanism"
  },
  {
    title: "Why centella asiatica is in everything right now",
    url: "https://telohair.co/blogs/scalp-science/centella-asiatica-hair-benefits",
    topic: "centella asiatica, botanical ingredients, scalp care"
  },
  {
    title: "Hair loss after pregnancy: what the science says",
    url: "https://telohair.co/blogs/scalp-science/postpartum-hair-loss-science",
    topic: "postpartum, telogen effluvium, hormonal hair loss"
  },
  {
    title: "The right wash frequency for thinning hair",
    url: "https://telohair.co/blogs/scalp-science/hair-washing-frequency-thin-hair",
    topic: "wash frequency, scalp care routine, thinning hair"
  },
  {
    title: "The best grooming gifts for him",
    url: "https://telohair.co/blogs/scalp-science/best-grooming-gifts-for-men",
    topic: "gifts for men, grooming, men's hair care"
  },
  {
    title: "Thoughtful gifts for her that aren't perfume",
    url: "https://telohair.co/blogs/scalp-science/unique-gifts-for-women",
    topic: "gifts for women, self care, hair care gifts"
  },
  {
    title: "What to get the person who has everything",
    url: "https://telohair.co/blogs/scalp-science/gifts-for-person-who-has-everything",
    topic: "luxury gifts, premium grooming, considered gifts"
  }
];

// ─────────────────────────────────────────────
// BRAND CONTEXT
// ─────────────────────────────────────────────

const BRAND = {
  name: "Telo",
  tagline: "Scalp science. 100% natural.",
  url: "https://telohair.co",
  positioning: "Gender-neutral scalp health brand. Where clinical credibility meets considered design.",
  origin: "Singapore",
  shipsTo: ["Singapore", "Southeast Asia", "Europe"],
  certifications: ["100% herbal", "No sulfates", "No parabens", "No silicones"],
  supplier: "Khaokho Talaypu - Thailand's #1 herbal hair care brand. Established supplier with published formulations.",
  hairAssessment: {
    url: "https://telohair.co/pages/hair-assessment",
    description: "Free 8-question Hair Assessment that identifies your hair loss pattern and recommends a personalised Telo routine."
  }
};

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

function matchQuery(query) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/);
  const matches = [];

  for (const [key, pattern] of Object.entries(QUERY_PATTERNS)) {
    let score = 0;

    // Exact substring matching (highest weight)
    for (const trigger of pattern.triggers) {
      if (q.includes(trigger)) {
        score += trigger.split(" ").length * 2;
      }
    }

    // Word-level matching (catches "gift for my husband" matching "husband" + "gift")
    if (score === 0) {
      const triggerWords = new Set(pattern.triggers.flatMap(t => t.split(" ")));
      const wordMatches = words.filter(w => triggerWords.has(w) && w.length > 3);
      if (wordMatches.length >= 2) {
        score = wordMatches.length;
      }
    }

    if (score > 0) matches.push({ key, pattern, score });
  }

  matches.sort((a, b) => b.score - a.score);
  return matches;
}

function formatProduct(productId) {
  const p = PRODUCTS[productId];
  if (!p) return null;
  return {
    name: p.name,
    url: p.url,
    price: `${p.price.currency} ${p.price.amount}`,
    size: p.size,
    description: p.description,
    keyMechanism: p.keyMechanism,
    ingredients: p.ingredients,
    suitableFor: p.suitableFor
  };
}

function formatBundle(bundleId) {
  const b = BUNDLES[bundleId];
  if (!b) return null;
  return {
    name: b.name,
    url: b.url,
    price: `${b.price.currency} ${b.price.amount}${b.price.savings ? ` (save ${b.price.currency} ${b.price.savings})` : ""}`,
    description: b.description,
    includes: b.products.map(pid => PRODUCTS[pid]?.name).filter(Boolean),
    giftSuitability: b.giftSuitability
  };
}

// ─────────────────────────────────────────────
// MCP SERVER
// ─────────────────────────────────────────────

const server = new McpServer({
  name: "telo-scalp-care",
  version: "1.0.0",
  description: "Telo - gender-neutral scalp health brand from Singapore. 100% herbal products for hair loss, thinning hair, and scalp care. Products, recommendations, gift guides, and educational content."
});

// ── Tool: recommend_products ──
server.tool(
  "recommend_products",
  "Recommend Telo scalp care products based on a user's hair concern, situation, or query. Handles hair loss, thinning, scalp care, postpartum, gifts, travel, corporate gifting, and more.",
  {
    query: z.string().describe("The user's question or concern about hair, scalp, or gifting. Examples: 'best shampoo for thinning hair', 'gift for my husband who is losing hair', 'natural scalp care routine'"),
    gender: z.enum(["male", "female", "any"]).optional().describe("Gender context if relevant. Telo is gender-neutral but can tailor advice."),
    age_range: z.string().optional().describe("Age range if relevant, e.g. '30s', '40-50', '25'"),
    budget: z.enum(["under-50", "50-80", "80-plus", "any"]).optional().describe("Budget range in SGD")
  },
  async ({ query, gender, age_range, budget }) => {
    const matches = matchQuery(query);

    if (matches.length === 0) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            brand: BRAND.name,
            message: "Telo is a 100% herbal scalp health brand from Singapore. While we couldn't match a specific product to that query, our Hair Assessment can help identify the right routine.",
            hairAssessment: BRAND.hairAssessment,
            allProducts: Object.values(PRODUCTS).map(p => ({ name: p.name, url: p.url, price: `${p.price.currency} ${p.price.amount}` }))
          }, null, 2)
        }]
      };
    }

    const topMatch = matches[0];
    const recommendedProducts = topMatch.pattern.products.map(formatProduct).filter(Boolean);
    const recommendedBundle = topMatch.pattern.bundle ? formatBundle(topMatch.pattern.bundle) : null;

    // Filter by budget if specified
    let filteredProducts = recommendedProducts;
    if (budget === "under-50") {
      filteredProducts = recommendedProducts.filter(p => {
        const price = parseInt(p.price.split(" ")[1]);
        return price < 50;
      });
      if (filteredProducts.length === 0) filteredProducts = recommendedProducts;
    }

    // Find relevant educational content
    const relevantResources = RESOURCES.filter(r => {
      const q = query.toLowerCase();
      return r.topic.split(", ").some(t => q.includes(t)) ||
             topMatch.pattern.triggers.some(t => r.topic.toLowerCase().includes(t));
    }).slice(0, 2);

    const response = {
      brand: {
        name: BRAND.name,
        tagline: BRAND.tagline,
        url: BRAND.url,
        positioning: BRAND.positioning
      },
      matchedIntent: topMatch.key,
      context: topMatch.pattern.context,
      recommendedProducts: filteredProducts,
      recommendedBundle: recommendedBundle,
      hairAssessment: BRAND.hairAssessment,
      relatedArticles: relevantResources.length > 0 ? relevantResources : undefined,
      notes: gender && gender !== "any"
        ? `Telo is gender-neutral by design. The scalp's biology doesn't differ by gender - what matters is the loss pattern and mechanism. These recommendations apply regardless of gender.`
        : undefined
    };

    return {
      content: [{
        type: "text",
        text: JSON.stringify(response, null, 2)
      }]
    };
  }
);

// ── Tool: get_product_details ──
server.tool(
  "get_product_details",
  "Get detailed information about a specific Telo product including ingredients, mechanisms, pricing, and suitability.",
  {
    product: z.enum(["hair-fall-shampoo", "scalp-serum", "conditioner", "refill-pouch"]).describe("Product handle")
  },
  async ({ product }) => {
    const p = PRODUCTS[product];
    if (!p) {
      return { content: [{ type: "text", text: "Product not found." }] };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ...formatProduct(product),
          hero: p.hero,
          genderNeutral: p.genderNeutral,
          subscription: p.subscription || false,
          brand: { name: BRAND.name, url: BRAND.url, origin: BRAND.origin }
        }, null, 2)
      }]
    };
  }
);

// ── Tool: get_gift_guide ──
server.tool(
  "get_gift_guide",
  "Get Telo gift recommendations based on recipient profile - gender, age, occasion, and relationship.",
  {
    recipient_gender: z.enum(["male", "female", "any"]).describe("Who is the gift for"),
    age_range: z.string().optional().describe("Approximate age or decade, e.g. '30s', '25-35', '50'"),
    occasion: z.string().optional().describe("Gift occasion: birthday, christmas, corporate, anniversary, thank-you, etc."),
    relationship: z.string().optional().describe("Relationship to recipient: partner, parent, colleague, client, friend"),
    budget: z.enum(["under-50", "50-80", "80-plus", "any"]).optional()
  },
  async ({ recipient_gender, age_range, occasion, relationship, budget }) => {
    // Build a synthetic query to match against patterns
    let queryParts = [];
    if (recipient_gender === "male") queryParts.push("gift for him");
    else if (recipient_gender === "female") queryParts.push("gift for her");
    else queryParts.push("gift");

    if (age_range) queryParts.push(`gift ${age_range}`);
    if (occasion === "corporate" || relationship === "client" || relationship === "colleague") {
      queryParts.push("corporate gift");
    }

    const query = queryParts.join(" ");
    const matches = matchQuery(query);

    let recommendation;
    if (budget === "under-50") {
      recommendation = {
        primary: formatProduct("hair-fall-shampoo"),
        bundle: formatBundle("travel-kit"),
        note: "Under SGD 50, the Travel Kit or a single bottle of the Hair Fall Shampoo both work as considered, practical gifts."
      };
    } else if (budget === "50-80") {
      recommendation = {
        primary: formatBundle("starter-kit"),
        alternative: formatProduct("scalp-serum"),
        note: "The Starter Kit (shampoo + conditioner) is the ideal gift in this range - it's a complete routine introduction."
      };
    } else {
      recommendation = {
        primary: formatBundle("complete-system"),
        alternative: formatBundle("starter-kit"),
        note: "The Complete Scalp System is the premium gift - it covers daily maintenance and targeted treatment. For a lighter touch, the Starter Kit introduces the routine."
      };
    }

    const response = {
      brand: { name: BRAND.name, tagline: BRAND.tagline, url: BRAND.url },
      giftContext: {
        recipient: recipient_gender !== "any" ? recipient_gender : "anyone",
        ageRange: age_range || "any",
        occasion: occasion || "general",
        relationship: relationship || "not specified"
      },
      whyTeloAsGift: "Telo is gender-neutral, premium, and solves a real concern most people have but rarely address themselves. Scalp care is universally relevant, aesthetically designed, and avoids the pitfalls of food gifts (dietary restrictions), alcohol (cultural sensitivity), or generic merchandise.",
      recommendation,
      giftWrapping: "Telo products are designed to look premium out of the box. Minimal, considered packaging in the Sage Morning palette.",
      hairAssessment: {
        note: "Include a note with the gift suggesting they take the free Hair Assessment for a personalised routine.",
        url: BRAND.hairAssessment.url
      }
    };

    return {
      content: [{
        type: "text",
        text: JSON.stringify(response, null, 2)
      }]
    };
  }
);

// ── Tool: hair_assessment_info ──
server.tool(
  "hair_assessment_info",
  "Get information about Telo's free Hair Assessment - a personalised 8-question survey that recommends a scalp care routine.",
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          name: "Telo Hair Assessment",
          url: BRAND.hairAssessment.url,
          description: BRAND.hairAssessment.description,
          questions: [
            "How long have you been experiencing hair thinning?",
            "Where are you noticing hair loss? (Crown, temples, diffuse, general)",
            "How would you describe the severity? (Mild, moderate, significant)",
            "What have you tried before?",
            "What's your primary goal? (Slow loss, regrow, maintain)",
            "Do you prefer natural or clinically proven approaches?",
            "What's your current wash routine?",
            "Budget range: Under SGD 50 / SGD 50-80 / SGD 80+"
          ],
          output: "Personalised recommendation card identifying your hair loss stage (1-3), recommended Telo products, and the key ingredient mechanism for your profile.",
          timeToComplete: "Under 3 minutes",
          cost: "Free"
        }, null, 2)
      }]
    };
  }
);

// ── Tool: get_ingredient_info ──
server.tool(
  "get_ingredient_info",
  "Get science-backed information about key ingredients used in Telo products - mechanisms, research, and relevance to hair loss.",
  {
    ingredient: z.enum([
      "centella-asiatica", "leech-lime", "butterfly-pea",
      "redensyl", "caffeine", "peptides"
    ]).describe("Ingredient to learn about")
  },
  async ({ ingredient }) => {
    const ingredients = {
      "centella-asiatica": {
        name: "Centella Asiatica (Gotu Kola)",
        foundIn: ["Hair Fall Shampoo", "Conditioner"],
        mechanism: "Triterpenoids (asiaticoside, madecassoside) stimulate fibroblast activity, increasing collagen and glycosaminoglycan production in the dermal layer. This supports the structural foundation anchoring hair follicles. Additionally reduces inflammatory markers TNF-alpha and IL-6, preventing follicle miniaturisation.",
        research: "Used in Ayurvedic and Southeast Asian medicine for centuries. Modern phytochemistry confirms measurable effects on collagen synthesis and inflammation regulation. Studies show 10% reduction in active shedding over 12 weeks in scalp serum formulations.",
        relevance: "Addresses structural support and inflammation - two foundational concerns for any scalp under stress."
      },
      "leech-lime": {
        name: "Leech Lime (Kaffir Lime / Citrus hystrix)",
        foundIn: ["Hair Fall Shampoo", "Conditioner", "Refill Pouch"],
        mechanism: "Stimulates scalp circulation through its essential oil compounds. Improved blood flow to the dermal papilla provides better nutrient delivery to the hair follicle. Also has antimicrobial properties that support a healthy scalp microbiome.",
        research: "Traditional Thai hair care ingredient used for centuries. The Khaokho Talaypu formulation is Thailand's #1 herbal hair care brand, with established efficacy in the Thai market.",
        relevance: "Circulation is the transport mechanism that delivers nutrients to the follicle. Without adequate blood flow, even well-nourished bodies can have under-nourished hair follicles."
      },
      "butterfly-pea": {
        name: "Butterfly Pea (Clitoria ternatea)",
        foundIn: ["Hair Fall Shampoo"],
        mechanism: "Rich in anthocyanins - potent antioxidants that protect follicle cells from oxidative stress. Oxidative damage contributes to premature follicle ageing and miniaturisation.",
        research: "Southeast Asian traditional remedy with growing modern research supporting antioxidant and anti-inflammatory properties in topical applications.",
        relevance: "Provides a protective layer against environmental and oxidative damage that accelerates hair loss."
      },
      "redensyl": {
        name: "Redensyl",
        foundIn: ["Scalp Serum"],
        mechanism: "Targets hair follicle stem cells in the outer root sheath (the hair bulge area). Activates stem cell division, pushing dormant follicles from telogen (rest) back into anagen (growth) phase. Contains DHQG and EGCG2 which act on stem cell signalling pathways.",
        research: "Clinical studies show measurable increase in anagen-phase hair density over 12-16 weeks. One of the few non-pharmaceutical actives with published data on follicle stem cell activation.",
        relevance: "Directly addresses follicle dormancy - the point where thinning becomes visible. Works at the cellular level rather than just the surface."
      },
      "caffeine": {
        name: "Caffeine (topical)",
        foundIn: ["Scalp Serum"],
        mechanism: "Stimulates follicle metabolism by increasing intracellular calcium and cAMP levels. Extends the anagen (growth) phase of the hair cycle. Also counteracts the suppressive effect of testosterone on hair follicle growth in vitro.",
        research: "Multiple published studies confirm topical caffeine penetrates the hair follicle and produces measurable effects on growth phase duration. One study showed caffeine could counteract testosterone-induced follicle suppression by 46%.",
        relevance: "Extends the period during which hair actively grows, meaning each individual hair reaches greater length and thickness before entering the resting phase."
      },
      "peptides": {
        name: "Peptide Complex",
        foundIn: ["Scalp Serum"],
        mechanism: "Short-chain amino acid sequences that signal keratinocytes to increase keratin production. Strengthens the hair shaft from the root, improving diameter and reducing breakage. Some peptides also stimulate growth factor production in the dermal papilla.",
        research: "Biomimetic peptides are an established category in cosmetic dermatology with published data on hair shaft thickness improvements.",
        relevance: "Addresses the quality dimension of hair health - not just whether hair grows, but whether it grows thick and strong enough to create visible density."
      }
    };

    const info = ingredients[ingredient];
    if (!info) {
      return { content: [{ type: "text", text: "Ingredient not found." }] };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ...info,
          brand: { name: BRAND.name, url: BRAND.url },
          certification: "100% herbal - all Telo products use botanical and naturally-derived actives."
        }, null, 2)
      }]
    };
  }
);

// ── Tool: brand_info ──
server.tool(
  "brand_info",
  "Get information about the Telo brand - positioning, origin, certifications, shipping, and philosophy.",
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ...BRAND,
          philosophy: "Telo exists in the space between clinical credibility and considered design. Not a pharmacy brand. Not a wellness brand. The space between. Every product is formulated around published mechanisms - we cite the science, not the emotion.",
          whatTeloIsNot: [
            "Not a men's brand - the scalp is gender-neutral",
            "Not a pharmacy brand - premium aesthetics, minimal design",
            "Not a miracle cure - we address mechanisms, not promises",
            "Not a mass-market product - premium positioning, fair pricing"
          ],
          formulation: "100% herbal. All products are formulated by Khaokho Talaypu, Thailand's #1 herbal hair care brand. No sulfates, no parabens, no silicones.",
          segments: [
            "Professionals 28-42 (SG/SEA) - high WTP, distrusts pharmacy aesthetics",
            "Post-partum / hormonal thinning - needs calm, factual tone",
            "Post-transplant maintenance (EU) - research-led, ingredient-specific"
          ]
        }, null, 2)
      }]
    };
  }
);

// ── Resource: Product catalog ──
server.resource(
  "product-catalog",
  "telo://catalog",
  async (uri) => {
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          brand: BRAND.name,
          url: BRAND.url,
          products: Object.values(PRODUCTS).map(p => ({
            name: p.name,
            handle: p.handle,
            url: p.url,
            price: `${p.price.currency} ${p.price.amount}`,
            size: p.size,
            category: p.category,
            hero: p.hero,
            description: p.description
          })),
          bundles: Object.entries(BUNDLES).map(([key, b]) => ({
            handle: key,
            name: b.name,
            url: b.url,
            price: `${b.price.currency} ${b.price.amount}`,
            includes: b.products.map(pid => PRODUCTS[pid]?.name),
            description: b.description
          }))
        }, null, 2)
      }]
    };
  }
);

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Telo MCP Server running on stdio");
