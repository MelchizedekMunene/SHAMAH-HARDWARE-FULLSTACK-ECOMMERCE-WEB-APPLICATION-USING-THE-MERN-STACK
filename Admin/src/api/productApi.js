// admin/src/api/productApi.js
// Centralised axios calls to the backend AI endpoints.
// Uses VITE_BACKEND_URL to match the existing api.js config convention.

import axios from "axios";

// Match the env var name used in api.js: VITE_BACKEND_URL (not VITE_API_URL)
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

/**
 * Generate a product description via Groq (server-side, free).
 * @param {{ name: string, category?: string, price?: string|number }} product
 * @returns {Promise<string>} description
 */
export const generateDescription = async ({ name, category, price }) => {
  const { data } = await axios.post(`${API_BASE}/api/products/ai/description`, {
    name,
    category,
    price,
  });
  return data.description;
};

/**
 * Generate a product image via Replicate (server-side) and save to disk.
 * @param {{ name: string, category?: string }} product
 * @returns {Promise<string>} relative image path e.g. "upload/images/ai-abc.webp"
 */
export const generateImage = async ({ name, category }) => {
  const { data } = await axios.post(`${API_BASE}/api/products/ai/image`, {
    name,
    category,
  });
  return data.imageUrl;
};