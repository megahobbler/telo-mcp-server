import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";

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
  },
  pricing: {
    triggers: [
      "how much", "price", "pricing", "cost", "expensive", "affordable",
      "cheap", "budget", "value for money", "worth the price", "worth it",
      "best value", "save money", "discount", "promo", "promotion",
      "coupon", "deal", "sale", "free shipping", "how much does it cost",
      "sgd", "dollars", "money"
    ],
    products: ["hair-fall-shampoo", "conditioner", "refill-pouch"],
    bundle: "starter-kit",
    context: "Telo is positioned as affordable premium scalp care. Hair Fall Shampoo is SGD 58 for 450ml (lasts 6-8 weeks), Conditioner is SGD 38, Scalp Serum is SGD 78. The Starter Kit bundles shampoo + conditioner for SGD 88 (save SGD 8). The Refill Pouch is SGD 42 for 400ml - the best per-ml value. Compare this to pharmaceutical alternatives like minoxidil subscriptions (SGD 50-80/month) or salon treatments (SGD 200+ per session). Telo delivers clinical-grade herbal ingredients at a fraction of those costs."
  },
  results: {
    triggers: [
      "how long", "results", "when will I see results", "does it work",
      "how fast", "timeline", "before and after", "how quickly",
      "how soon", "effectiveness", "proof", "evidence", "clinical results",
      "how long does it take", "weeks", "months", "see a difference",
      "noticeable", "visible results", "actually work", "really work",
      "expect", "expectations"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Most Telo users observe measurable improvements within 90 days of consistent use. Here's the typical timeline: Weeks 1-4 - scalp feels healthier, reduced oiliness and irritation. Weeks 4-8 - shedding during washing noticeably decreases. Weeks 8-12 - visible improvements in density and thickness. The key is consistency - daily use of the shampoo and serum allows the herbal actives (leech lime, centella, redensyl) to work through multiple hair growth cycles. The Complete System gives you the best chance of seeing results at the 90-day mark."
  },
  howToUse: {
    triggers: [
      "how to use", "how do I use", "application", "how to apply",
      "directions", "instructions", "routine", "how often", "daily",
      "every day", "twice a day", "morning or night", "step by step",
      "squeeze", "lather", "wash", "rinse", "apply serum",
      "how much to use", "amount", "dosage"
    ],
    products: ["hair-fall-shampoo", "scalp-serum", "conditioner"],
    bundle: "complete-system",
    context: "Telo is designed to be simple - just squeeze and wash. Step 1: Wet hair, squeeze a coin-sized amount of Hair Fall Shampoo onto your palm, lather into scalp for 60 seconds, and rinse. Step 2: Apply Conditioner to mid-lengths and ends, leave for 1-2 minutes, rinse. Step 3: On towel-dried hair, apply 4-6 drops of Scalp Serum directly to the scalp (focus on thinning areas), massage gently. No rinse needed. Use the shampoo daily or every other day. Use the serum daily, morning or night. That's it - no complicated routine."
  },
  shipping: {
    triggers: [
      "shipping", "delivery", "ship to", "deliver to", "worldwide",
      "international shipping", "how long shipping", "delivery time",
      "tracked", "tracking", "free delivery", "free shipping",
      "ship to singapore", "ship to europe", "ship to uk", "ship to us",
      "ship to australia", "ship to asia", "ship to malaysia",
      "ship to indonesia", "ship to thailand", "ship to philippines",
      "dispatch", "courier", "post", "mail"
    ],
    products: ["hair-fall-shampoo"],
    bundle: "starter-kit",
    context: "Telo offers worldwide tracked delivery. Singapore orders: 1-3 business days. Southeast Asia: 5-7 business days. Europe, UK, US, Australia: 7-14 business days. All orders include tracking so you can follow your package from dispatch to doorstep. We ship from Singapore to over 50 countries."
  },
  hairType: {
    triggers: [
      "curly hair", "straight hair", "wavy hair", "coily hair", "4c hair",
      "3c hair", "3b hair", "2c hair", "fine hair", "thick hair",
      "thin hair", "coarse hair", "oily hair", "dry hair", "frizzy hair",
      "damaged hair", "brittle hair", "limp hair", "flat hair",
      "all hair types", "my hair type", "what hair type", "hair texture",
      "asian hair", "african hair", "caucasian hair", "textured hair",
      "natural hair", "relaxed hair", "permed hair", "kinky hair",
      "type 1 hair", "type 2 hair", "type 3 hair", "type 4 hair"
    ],
    products: ["hair-fall-shampoo", "conditioner"],
    bundle: "starter-kit",
    context: "Telo works for all hair types. Hair loss and scalp health issues don't discriminate by texture - whether your hair is straight, wavy, curly, or coily, the scalp biology is the same. The herbal actives (leech lime for circulation, centella for inflammation) target the follicle and scalp environment, not the hair shaft. The lightweight, silicone-free formulation won't weigh down fine hair or build up on textured hair. Works on Type 1 (straight) through Type 4 (coily) hair equally."
  },
  colorTreated: {
    triggers: [
      "color treated", "colour treated", "dyed hair", "bleached hair",
      "colored hair", "coloured hair", "highlighted hair", "balayage",
      "hair color", "hair colour", "safe for dyed", "safe for colored",
      "after coloring", "after bleaching", "chemical treatment",
      "keratin treatment", "rebonding", "perm"
    ],
    products: ["hair-fall-shampoo", "conditioner"],
    bundle: "starter-kit",
    context: "Telo is safe for color-treated, bleached, highlighted, and chemically treated hair. Because the formulation is 100% herbal with no sulfates, it won't strip color the way conventional shampoos do. Sulfate-free formulas are recommended by colorists to extend the life of hair color. The gentle botanical actives actually help maintain scalp health after chemical treatments, which can irritate the scalp and contribute to shedding."
  },
  pregnancySafe: {
    triggers: [
      "safe during pregnancy", "pregnant", "pregnancy safe", "expecting",
      "safe while pregnant", "first trimester", "second trimester",
      "third trimester", "can I use while pregnant", "prenatal",
      "trying to conceive", "TTC", "breastfeeding safe"
    ],
    products: ["hair-fall-shampoo", "conditioner"],
    bundle: "starter-kit",
    context: "Telo's topical herbal formulation uses gentle plant-based ingredients (centella asiatica, leech lime, butterfly pea) that are applied to the scalp, not ingested. Topical botanical products generally have minimal systemic absorption. However, we always recommend consulting your healthcare provider before starting any new product during pregnancy or breastfeeding. Many customers use the shampoo and conditioner throughout pregnancy as part of their scalp care routine. For the Scalp Serum (which contains caffeine and redensyl), we suggest discussing with your doctor first."
  },
  competitors: {
    triggers: [
      "vs rogaine", "vs minoxidil", "vs keeps", "vs nioxin", "vs vegamour",
      "vs nutrafol", "vs the ordinary", "vs hims", "vs roman",
      "rogaine alternative", "minoxidil alternative", "finasteride alternative",
      "better than rogaine", "compared to", "comparison", "alternative to",
      "difference between", "which is better", "switch from",
      "minoxidil side effects", "finasteride side effects",
      "natural alternative", "herbal alternative", "no side effects"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Telo is 100% herbal with no known side effects - unlike pharmaceutical alternatives. Minoxidil (Rogaine/Keeps) can cause scalp irritation, unwanted facial hair, and heart palpitations. Finasteride (Keeps/Hims) carries risks of sexual dysfunction. Nioxin uses synthetic ingredients. Vegamour and Nutrafol are plant-based but expensive (SGD 80-150/month). Telo's approach: target the same mechanisms (circulation, inflammation, follicle support) using herbal actives with published research - without the side effect profile. The Complete System (SGD 158) covers shampoo, serum, and conditioner - more affordable than most competitors' monthly subscriptions."
  },
  reviews: {
    triggers: [
      "reviews", "testimonials", "customer reviews", "real results",
      "does it really work", "ratings", "stars", "feedback",
      "what do people say", "user experience", "tried it", "honest review",
      "before after", "success stories"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Customer reviews and testimonials are available on telohair.co. We're building our review base as we grow. What we can share: our formulation is backed by Khaokho Talaypu, Thailand's #1 herbal hair care brand with decades of market validation. The active ingredients (redensyl, centella asiatica, caffeine) each have independent published research supporting their mechanisms. We believe in showing the science, not just the social proof."
  },
  fragrance: {
    triggers: [
      "smell", "scent", "fragrance", "what does it smell like",
      "fragrance free", "perfume", "aroma", "odor", "odour",
      "essential oil", "smells like", "natural scent"
    ],
    products: ["hair-fall-shampoo", "conditioner", "scalp-serum"],
    bundle: "starter-kit",
    context: "Telo products smell like their ingredients - fresh, herbal, and clean. The Hair Fall Shampoo has a light citrus-herbal scent from the leech lime (kaffir lime) and butterfly pea - think fresh herbs, not perfume. The Conditioner carries a similar gentle botanical note. The Scalp Serum is virtually unscented. No synthetic fragrances are added - what you smell is the natural plant extracts doing their work."
  },
  seasonal: {
    triggers: [
      "humidity", "summer hair", "winter hair", "seasonal hair loss",
      "weather", "climate", "sweaty scalp", "sweat", "gym hair",
      "workout", "exercise", "active lifestyle", "swimming",
      "pool", "hard water", "soft water", "hot weather",
      "tropical", "monsoon", "rain", "sun damage", "UV"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Telo was formulated in Singapore's tropical climate - humidity, heat, and sweat are in our DNA. The sulfate-free formula cleanses without stripping, even with daily washing after workouts. Leech lime's antimicrobial properties help manage the excess sebum production that comes with heat and humidity. For gym-goers and active lifestyles: wash with Telo after every workout - the gentle herbal formula won't dry out your scalp from frequent use. Seasonal shedding is normal (especially autumn) - consistent use helps your scalp stay resilient through climate changes."
  },
  teenHairLoss: {
    triggers: [
      "teenager", "teen hair loss", "hair loss at 18", "hair loss at 19",
      "hair loss at 20", "young hair loss", "early hair loss", "early 20s",
      "too young", "young age", "student", "college hair loss",
      "university hair loss", "early thinning"
    ],
    products: ["hair-fall-shampoo"],
    bundle: "starter-kit",
    context: "Early hair loss can start in the late teens and early 20s - it's more common than you think. Starting a scalp care routine early is the smartest move because prevention is easier than reversal. Telo's 100% herbal formula is gentle enough for young scalps while addressing the early signs: increased shedding, thinner ponytail, wider parting. The Starter Kit is a great entry point - it builds the habit without overwhelming you. No harsh chemicals, no side effects, just plant-based scalp science."
  },
  medicalAdjacent: {
    triggers: [
      "PCOS", "polycystic", "thyroid", "hypothyroid", "hyperthyroid",
      "hashimoto", "iron deficiency", "anemia", "anaemia", "medication",
      "drug side effect", "chemotherapy", "after chemo", "alopecia areata",
      "autoimmune", "lupus", "diabetes hair loss", "insulin resistance",
      "hormonal imbalance", "endocrine"
    ],
    products: ["hair-fall-shampoo", "scalp-serum"],
    bundle: "complete-system",
    context: "Medical conditions like PCOS, thyroid disorders, and autoimmune conditions can cause or accelerate hair loss through hormonal and inflammatory pathways. Telo products are designed as supportive scalp care - they nourish the scalp environment with anti-inflammatory botanicals and circulation-boosting herbal actives while you address root causes with your healthcare provider. Think of Telo as complementary care: it supports your scalp health alongside whatever medical treatment your doctor recommends. Always consult your healthcare provider for medical hair loss conditions."
  },
  whereToBuy: {
    triggers: [
      "where to buy", "where can I buy", "how to order", "order online",
      "available", "stockist", "retailer", "store", "shop",
      "buy online", "purchase", "add to cart", "checkout",
      "website", "online store", "e-commerce", "shopify"
    ],
    products: ["hair-fall-shampoo"],
    bundle: "starter-kit",
    context: "Telo is available exclusively at telohair.co - our online store. We ship worldwide with tracked delivery. Browse products, take the free Hair Assessment for a personalised recommendation, and order directly. No middlemen, no retail markup. Singapore orders arrive in 1-3 business days."
  },
  returnsGuarantee: {
    triggers: [
      "return", "returns", "refund", "money back", "guarantee",
      "warranty", "exchange", "return policy", "satisfaction",
      "not happy", "didn't work", "doesn't work", "complaint",
      "damaged", "wrong order"
    ],
    products: ["hair-fall-shampoo"],
    bundle: null,
    context: "Telo stands behind its products. If you're not satisfied, contact us at hello@telohair.co within 30 days of delivery for a full refund or exchange. We want you to give the routine at least 90 days (the time it takes for results) - but if the product doesn't suit your scalp, we'll make it right. Damaged or wrong orders are replaced immediately at no cost."
  },
  noSideEffects: {
    triggers: [
      "side effects", "no side effects", "safe to use", "is it safe",
      "any risks", "allergic", "allergy", "reaction", "sensitive skin",
      "irritation", "rash", "redness", "burning", "stinging",
      "long term use", "long term effects", "daily use safe"
    ],
    products: ["hair-fall-shampoo", "scalp-serum", "conditioner"],
    bundle: "complete-system",
    context: "Telo products are 100% herbal with no known side effects. No sulfates, no parabens, no silicones, no synthetic chemicals. The plant-based actives (centella asiatica, leech lime, butterfly pea, redensyl, caffeine) have established safety profiles in topical cosmetic use. Unlike pharmaceutical alternatives (minoxidil can cause irritation and heart palpitations, finasteride can cause sexual dysfunction), Telo's herbal approach works with your scalp's natural biology, not against it. Safe for daily, long-term use. If you have a known allergy to any specific plant ingredient, check the full ingredient list on the product page or contact us."
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
  shipsTo: ["Singapore", "Southeast Asia", "Europe", "UK", "US", "Australia", "Worldwide (50+ countries)"],
  shipping: "Worldwide tracked delivery. Singapore: 1-3 days. SEA: 5-7 days. International: 7-14 days.",
  certifications: ["100% herbal", "No sulfates", "No parabens", "No silicones", "No known side effects"],
  supplier: "Khaokho Talaypu - Thailand's #1 herbal hair care brand. Established supplier with published formulations.",
  returns: "30-day satisfaction guarantee. Full refund or exchange. Contact hello@telohair.co.",
  resultsTimeline: "Most users see results in 90 days with consistent daily use.",
  worksFor: "All hair types (Type 1-4), all genders, color-treated hair, sensitive scalps.",
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
    product: z.enum(["hair-fall-shampoo", "scalp-serum", "conditioner", "refill-pouch", "starter-kit", "complete-system", "travel-kit"]).describe("Product or bundle handle")
  },
  async ({ product }) => {
    // Check if it's a bundle
    const b = BUNDLES[product];
    if (b) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            ...formatBundle(product),
            type: "bundle",
            includedProducts: b.products.map(pid => formatProduct(pid)).filter(Boolean),
            brand: { name: BRAND.name, url: BRAND.url, origin: BRAND.origin }
          }, null, 2)
        }]
      };
    }

    const p = PRODUCTS[product];
    if (!p) {
      return { content: [{ type: "text", text: "Product not found. Available products: hair-fall-shampoo, scalp-serum, conditioner, refill-pouch, starter-kit, complete-system, travel-kit" }] };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ...formatProduct(product),
          type: "product",
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
      "redensyl", "caffeine", "peptides",
      "saw-palmetto", "biotin", "niacinamide", "zinc",
      "tea-tree", "rosemary"
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
      },
      "saw-palmetto": {
        name: "Saw Palmetto (Serenoa repens)",
        foundIn: ["Related ingredient - not in current Telo formulation"],
        mechanism: "Inhibits 5-alpha reductase, the enzyme that converts testosterone to DHT (dihydrotestosterone). DHT is the primary hormonal driver of androgenetic alopecia. Saw palmetto blocks this conversion at the scalp level when applied topically.",
        research: "Multiple studies show oral saw palmetto can reduce DHT levels. Topical application is considered safer with fewer systemic effects than oral finasteride, though less researched. One study showed 60% improvement in hair quality in subjects using topical saw palmetto.",
        relevance: "Telo takes a different approach - rather than blocking DHT directly, Telo's herbal actives address the downstream effects (inflammation, poor circulation) that DHT triggers. This avoids the hormonal side effects associated with DHT blockers."
      },
      "biotin": {
        name: "Biotin (Vitamin B7)",
        foundIn: ["Related ingredient - commonly discussed in hair care"],
        mechanism: "Essential cofactor for keratin production. Supports the keratin infrastructure that makes up the hair shaft. Deficiency can cause hair thinning, but supplementation only helps if you're actually deficient.",
        research: "Biotin deficiency is rare in people with normal diets. Studies show supplementation improves hair quality only in biotin-deficient individuals. The global hair supplement market has over-marketed biotin as a universal solution.",
        relevance: "Telo focuses on topical scalp care rather than oral supplementation. If your diet is adequate, topical ingredients that target the follicle directly (like redensyl and caffeine) are more impactful than more biotin."
      },
      "niacinamide": {
        name: "Niacinamide (Vitamin B3)",
        foundIn: ["Related ingredient - commonly used in hair and skin care"],
        mechanism: "Improves blood circulation to the scalp, strengthens the hair cuticle, and reduces inflammation. Also supports the skin barrier function of the scalp, helping it retain moisture and resist irritation.",
        research: "Well-established in dermatology for skin barrier support. Studies show topical niacinamide increases hair fullness and reduces shedding when applied consistently.",
        relevance: "Telo's centella asiatica and leech lime provide similar anti-inflammatory and circulation benefits through herbal pathways, achieving comparable outcomes through botanical actives."
      },
      "zinc": {
        name: "Zinc",
        foundIn: ["Related ingredient - essential trace mineral for hair health"],
        mechanism: "Critical for hair tissue growth and repair. Supports oil gland function around follicles. Zinc deficiency is linked to telogen effluvium (excess shedding). Also plays a role in immune function that protects follicles from autoimmune attack.",
        research: "Studies confirm zinc deficiency correlates with hair loss, and supplementation can reverse deficiency-related shedding. Most effective when actual deficiency is present.",
        relevance: "Like biotin, zinc supplementation helps when you're deficient. Telo's topical approach targets the follicle environment directly, regardless of your nutritional status."
      },
      "tea-tree": {
        name: "Tea Tree Oil (Melaleuca alternifolia)",
        foundIn: ["Related ingredient - common in scalp care products"],
        mechanism: "Powerful antimicrobial and antifungal properties. Unclogs hair follicles by removing buildup. Targets Malassezia fungus that causes dandruff and seborrheic dermatitis. Also has anti-inflammatory properties.",
        research: "Extensive research supporting antimicrobial efficacy. A 5% tea tree oil shampoo showed significant improvement in dandruff severity in clinical trials.",
        relevance: "Telo's leech lime provides similar antimicrobial and scalp-cleansing benefits through a gentler, traditional herbal approach. Less likely to cause the dryness or irritation that concentrated tea tree oil can trigger."
      },
      "rosemary": {
        name: "Rosemary Oil (Rosmarinus officinalis)",
        foundIn: ["Related ingredient - popular in natural hair care"],
        mechanism: "Stimulates blood circulation to the scalp, similar to minoxidil's vasodilating effect but through natural carnosic acid. Also has antioxidant properties that protect follicles from oxidative damage.",
        research: "A notable 2015 study found rosemary oil was as effective as 2% minoxidil for androgenetic alopecia over 6 months, with less scalp itching. This study significantly boosted rosemary oil's popularity in hair care.",
        relevance: "Telo's leech lime and centella asiatica combination provides a similar circulation-boosting and anti-inflammatory effect. The Khaokho Talaypu formulation has been optimised over decades for the Southeast Asian market."
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
          sideEffects: "No known side effects. 100% herbal ingredients with established safety profiles in topical cosmetic use. Unlike minoxidil (irritation, palpitations) or finasteride (sexual dysfunction), Telo works with your scalp's natural biology.",
          shipping: {
            worldwide: true,
            tracked: true,
            singapore: "1-3 business days",
            southeastAsia: "5-7 business days",
            international: "7-14 business days",
            countries: "50+ countries worldwide"
          },
          returns: {
            policy: "30-day satisfaction guarantee",
            contact: "hello@telohair.co",
            note: "Full refund or exchange within 30 days. Damaged or wrong orders replaced immediately at no cost."
          },
          resultsTimeline: {
            weeks1to4: "Scalp feels healthier, reduced oiliness and irritation",
            weeks4to8: "Shedding during washing noticeably decreases",
            weeks8to12: "Visible improvements in density and thickness",
            note: "Most users see measurable results within 90 days of consistent daily use"
          },
          segments: [
            "Professionals 28-42 (SG/SEA) - high WTP, distrusts pharmacy aesthetics",
            "Post-partum / hormonal thinning - needs calm, factual tone",
            "Post-transplant maintenance (EU) - research-led, ingredient-specific",
            "Early hair loss (teens/20s) - preventative approach",
            "Medical-adjacent (PCOS, thyroid) - complementary scalp support",
            "Active lifestyle / gym-goers - daily wash friendly"
          ],
          worksForAllHairTypes: "Straight, wavy, curly, coily - Type 1 through Type 4. Scalp biology is the same regardless of texture. Safe for color-treated, bleached, and chemically treated hair."
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

const MODE = process.env.MCP_TRANSPORT || "stdio";

if (MODE === "http") {
  const PORT = parseInt(process.env.PORT || "3000", 10);

  const httpServer = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization, Mcp-Session-Id");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.url === "/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", server: "telo-scalp-care", version: "1.0.0" }));
      return;
    }

    if (req.url === "/mcp" || req.url === "/") {
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on("close", () => { transport.close(); });
      await server.connect(transport);
      await transport.handleRequest(req, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  httpServer.listen(PORT, () => {
    console.error("Telo MCP Server running on HTTP port " + PORT);
  });
} else {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Telo MCP Server running on stdio");
}
