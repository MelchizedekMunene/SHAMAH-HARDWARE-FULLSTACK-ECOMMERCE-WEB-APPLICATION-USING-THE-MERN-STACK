// backend/services/aiService.js
// Uses Groq API (free) with llama-3.3-70b-versatile to generate product descriptions.
// Runs server-side — GROQ_API_KEY is never exposed to the browser.

const Groq = require("groq-sdk");

// Client is instantiated once at module load.
// groq-sdk reads GROQ_API_KEY from process.env automatically.
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generate a product description using Groq (Llama 3.3-70B).
 * @param {{ name: string, category?: string, price?: string|number }} product
 * @returns {Promise<string>} plain-text description
 */
const generateProductDescription = async ({ name, category, price }) => {
  const contextParts = [
    name     && `Product name: ${name}`,
    category && `Category: ${category}`,
    price    && `Price: KES ${price}`,
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await client.chat.completions.create({
    // llama-3.3-70b-versatile = highest quality free model on Groq.
    // Fallback if you hit rate limits: "mixtral-8x7b-32768"
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are a professional e-commerce copywriter. Write concise, compelling product descriptions in 2–3 sentences. Lead with the key benefit. No bullet points, no markdown, plain prose only. Never mention the price in the description.",
      },
      {
        role: "user",
        content: `Write a product description for:\n${contextParts}\n\nMake it persuasive and suitable for an online store.`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Groq returned no text content");

  return content.trim();
};

module.exports = { generateProductDescription };