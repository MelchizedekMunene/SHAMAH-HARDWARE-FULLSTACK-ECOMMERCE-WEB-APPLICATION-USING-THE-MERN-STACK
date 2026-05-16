// backend/services/imageService.js
// Calls Replicate to generate an image, then downloads and saves it
// to ./upload/images/ — the same folder multer uses in index.js.
// Returns a relative path like "upload/images/ai-abc123.webp" so MongoDB
// stores it identically to a manually uploaded image.

const fs   = require("fs");
const path = require("path");
const https = require("https");
const http  = require("http");
const crypto = require("crypto");
const Replicate = require("replicate");

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn("[imageService] WARNING: REPLICATE_API_TOKEN not set in .env");
}

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Must match multer's destination in index.js: './upload/images'
const UPLOADS_DIR = path.join(__dirname, "..", "upload", "images");

/**
 * Generate a product image via Replicate and save it to disk.
 * @param {{ name: string, category?: string }} product
 * @returns {Promise<string>} relative path e.g. "upload/images/ai-abc123.webp"
 */
const generateAndSaveProductImage = async ({ name, category }) => {
  const prompt = buildPrompt(name, category);
  const replicateUrl = await generateImageWithReplicate(prompt);
  const localPath = await downloadImageToDisk(replicateUrl);
  return localPath;
};

// ── Prompt ────────────────────────────────────────────────────────────────────
function buildPrompt(name, category) {
  const cat = category ? `, ${category}` : "";
  return `Professional product photo of ${name}${cat}, white background, studio lighting, sharp focus, commercial photography, high resolution, e-commerce`;
}

// ── Replicate call ────────────────────────────────────────────────────────────
async function generateImageWithReplicate(prompt) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN is not set in .env");
  }

  try {
    // replicate.run() blocks until the prediction is done (no manual polling needed)
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 90,
        num_inference_steps: 4, // flux-schnell is tuned for exactly 4 steps
      },
    });

    // Replicate returns an array of URLs (or ReadableStream objects in newer SDK versions)
    if (Array.isArray(output) && output.length > 0) {
      const item = output[0];
      // Newer replicate SDK wraps output in a ReadableStream-like object
      // that has a .url() method. Handle both cases.
      if (typeof item === "string") return item;
      if (item && typeof item.url === "function") return item.url().toString();
      if (item && typeof item.toString === "function") return item.toString();
    }

    throw new Error("Replicate did not return a usable image URL");
  } catch (error) {
    throw new Error(`Replicate API error: ${error.message || "Unknown error"}`);
  }
}

// ── Download to disk ──────────────────────────────────────────────────────────
function downloadImageToDisk(url) {
  return new Promise((resolve, reject) => {
    // Ensure the directory exists (multer creates it, but AI path might run first)
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Detect extension from URL; default to webp (what flux-schnell returns)
    const ext = url.includes(".webp") ? "webp" : "png";
    const filename = `ai-${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    const file = fs.createWriteStream(filepath);

    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (response) => {
        // Handle redirects (Replicate CDN sometimes redirects)
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          return downloadImageToDisk(response.headers.location)
            .then(resolve)
            .catch(reject);
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          // Return the relative path — matches how index.js serves /upload/images
          resolve(`upload/images/${filename}`);
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {}); // clean up broken partial file
        reject(new Error(`Failed to download image: ${err.message}`));
      });
  });
}

module.exports = { generateAndSaveProductImage };