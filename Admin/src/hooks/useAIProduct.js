// admin/src/hooks/useAIProduct.js
// Encapsulates all AI generation state and logic.
// Both handler functions now RETURN the generated value so callers
// can forward it to parent components without relying on timing.

import { useState } from "react";
import { generateDescription, generateImage } from "../api/productApi";

export const useAIProduct = () => {
  const [description, setDescription] = useState("");
  const [descLoading, setDescLoading]   = useState(false);
  const [descError, setDescError]       = useState(null);

  const [imageUrl, setImageUrl]         = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError]     = useState(null);

  /**
   * Generates a description and sets internal state.
   * @returns {Promise<string|null>} the generated description, or null on error
   */
  const handleGenerateDescription = async ({ name, category, price }) => {
    if (!name?.trim()) {
      setDescError("Product name is required");
      return null;
    }
    setDescError(null);
    setDescLoading(true);
    try {
      const desc = await generateDescription({ name, category, price });
      setDescription(desc);
      return desc; // return so the panel can forward it to the parent form
    } catch (err) {
      setDescError(err?.response?.data?.message || "Failed to generate description");
      return null;
    } finally {
      setDescLoading(false);
    }
  };

  /**
   * Generates an image and sets internal state.
   * imageUrl propagation to parent is handled via useEffect in the panel.
   * @returns {Promise<string|null>} the relative image path, or null on error
   */
  const handleGenerateImage = async ({ name, category }) => {
    if (!name?.trim()) {
      setImageError("Product name is required");
      return null;
    }
    setImageError(null);
    setImageLoading(true);
    try {
      const url = await generateImage({ name, category });
      setImageUrl(url);
      return url;
    } catch (err) {
      setImageError(err?.response?.data?.message || "Failed to generate image");
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  const reset = () => {
    setDescription(""); setDescError(null);
    setImageUrl(""); setImageError(null);
  };

  return {
    description, setDescription, descLoading, descError, handleGenerateDescription,
    imageUrl, setImageUrl, imageLoading, imageError, handleGenerateImage,
    reset,
  };
};