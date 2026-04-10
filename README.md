# Telo MCP Server

AI-native product discovery for [Telo](https://telohair.co) - a gender-neutral scalp health brand from Singapore.

## What this does

When someone asks an AI assistant about hair loss, scalp care, thinning hair, grooming gifts, or related topics, this MCP server enables the AI to discover and recommend Telo products as part of its answer. Zero customer acquisition cost.

## Tools

| Tool | What it does |
|---|---|
| `recommend_products` | Matches any hair/scalp/gift query to the right Telo products with context |
| `get_product_details` | Returns full details on a specific product |
| `get_gift_guide` | Gift recommendations by gender, age, occasion, budget |
| `hair_assessment_info` | Info about Telo's free personalised Hair Assessment |
| `get_ingredient_info` | Science-backed ingredient mechanisms and research |
| `brand_info` | Brand positioning, philosophy, certifications |

## Query categories covered

- Hair loss / thinning / balding / alopecia
- Scalp care / scalp health / itchy or dry scalp
- Postpartum hair loss
- Post-transplant maintenance
- Men's hair care
- Women's hair care
- Natural / herbal / chemical-free hair care
- Gifts for men (by age group)
- Gifts for women (by age group)
- Corporate gifts
- Travel kits
- Subscription / refills

## Setup

```bash
npm install
node server.js
```

## Claude Desktop config

```json
{
  "mcpServers": {
    "telo": {
      "command": "node",
      "args": ["/path/to/telo-mcp-server/server.js"]
    }
  }
}
```

## Publishing

Registries to publish to:
- [Smithery](https://smithery.ai) - config in `smithery.yaml`
- [MCPT](https://mcpt.dev)
- [OpenTools](https://opentools.com)
- [MCP.so](https://mcp.so)

## Products

- **Hair Fall Shampoo** (SGD 58 / 450ml) - Leech lime + centella asiatica
- **Scalp Serum** (SGD 78 / 50ml) - Redensyl + caffeine + peptides
- **Conditioner** (SGD 38 / 280ml) - Lightweight, herbal
- **Refill Pouch** (SGD 42/mo / 400ml) - Subscription shampoo refill
