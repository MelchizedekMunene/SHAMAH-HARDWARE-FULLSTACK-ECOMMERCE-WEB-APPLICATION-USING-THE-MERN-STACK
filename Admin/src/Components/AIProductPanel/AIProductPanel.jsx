// admin/src/Components/AIProductPanel/AIProductPanel.jsx
// Drop-in AI panel for AddProduct. Receives form state as props,
// writes generated values back via callbacks.

import { useEffect } from "react";
import { useAIProduct } from "../../hooks/useAIProduct";

const AIProductPanel = ({
  name,
  category,
  price,
  onDescriptionGenerated,
  onImageGenerated,
}) => {
  const {
    description,
    setDescription,
    descLoading,
    descError,
    handleGenerateDescription,
    imageUrl,
    imageLoading,
    imageError,
    handleGenerateImage,
  } = useAIProduct();

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

  // ── Propagate imageUrl to parent via useEffect (NOT during render) ──────────
  // The original version called onImageGenerated() directly in the render body,
  // which caused an infinite re-render loop: parent state update → re-render →
  // callback fires again → parent state update → ...
  useEffect(() => {
    if (imageUrl && imageUrl.length > 0) {
      onImageGenerated?.(`${API_BASE}/${imageUrl}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]); // only fire when imageUrl actually changes

  const onGenDesc = async () => {
    const desc = await handleGenerateDescription({ name, category, price });
    // handleGenerateDescription sets internal state; also propagate to parent
    if (desc) onDescriptionGenerated?.(desc);
  };

  const onGenImage = async () => {
    await handleGenerateImage({ name, category });
    // imageUrl propagation is handled by the useEffect above
  };

  const handleDescChange = (val) => {
    setDescription(val);
    onDescriptionGenerated?.(val);
  };

  return (
    <div style={styles.panel}>
      <div style={styles.sectionLabel}>AI-assisted fields</div>

      {/* ── Image generator ── */}
      <div style={styles.block}>
        <div style={styles.blockHeader}>
          <span style={styles.blockTitle}>Product image</span>
          <span style={styles.aiBadge}>AI · Replicate</span>
        </div>

        <div style={styles.imageArea}>
          {imageUrl ? (
            <img
              src={`${API_BASE}/${imageUrl}`}
              alt="Generated product"
              style={styles.generatedImage}
            />
          ) : (
            <div style={styles.imagePlaceholder}>
              {imageLoading ? "Generating image…" : "No image yet"}
            </div>
          )}
        </div>

        {imageError && <p style={styles.error}>{imageError}</p>}

        <div style={styles.buttonRow}>
          <button
            type="button"
            onClick={onGenImage}
            disabled={!name?.trim() || imageLoading}
            style={{
              ...styles.genBtn,
              opacity: !name?.trim() || imageLoading ? 0.6 : 1,
              cursor: !name?.trim() || imageLoading ? "not-allowed" : "pointer",
            }}
          >
            {imageLoading ? "Generating…" : imageUrl ? "Regenerate image" : "Generate image"}
          </button>
          <span style={styles.hint}>Uses product name + category</span>
        </div>
      </div>

      {/* ── Description generator ── */}
      <div style={styles.block}>
        <div style={styles.blockHeader}>
          <span style={styles.blockTitle}>Product description</span>
          <span style={styles.aiBadge}>AI · Groq (free)</span>
        </div>

        <textarea
          value={description}
          onChange={(e) => handleDescChange(e.target.value)}
          placeholder={
            descLoading
              ? "Writing description…"
              : "Generated description will appear here. You can edit it after."
          }
          rows={4}
          style={styles.textarea}
        />

        {descError && <p style={styles.error}>{descError}</p>}

        <div style={styles.buttonRow}>
          <button
            type="button"
            onClick={onGenDesc}
            disabled={!name?.trim() || descLoading}
            style={{
              ...styles.genBtn,
              opacity: !name?.trim() || descLoading ? 0.6 : 1,
              cursor: !name?.trim() || descLoading ? "not-allowed" : "pointer",
            }}
          >
            {descLoading
              ? "Writing…"
              : description
              ? "Regenerate description"
              : "Generate description"}
          </button>
          <span style={styles.hint}>Uses name, category + price</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  panel: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "16px",
    backgroundColor: "#fafafa",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#9ca3af",
    marginBottom: "16px",
  },
  block: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f0f0f0",
  },
  blockHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  blockTitle: { fontSize: "14px", fontWeight: 600, color: "#374151" },
  aiBadge: {
    fontSize: "10px",
    fontWeight: 600,
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
    borderRadius: "100px",
    padding: "2px 10px",
    letterSpacing: "0.04em",
  },
  imageArea: {
    width: "100%",
    height: "180px",
    background: "#f3f4f6",
    border: "1px dashed #d1d5db",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  generatedImage: { width: "100%", height: "100%", objectFit: "cover" },
  imagePlaceholder: { fontSize: "13px", color: "#9ca3af" },
  textarea: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    padding: "10px 12px",
    fontSize: "14px",
    lineHeight: "1.6",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: "10px",
  },
  buttonRow: { display: "flex", alignItems: "center", gap: "12px" },
  genBtn: {
    fontSize: "13px",
    fontWeight: 500,
    background: "#ffffff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "7px 16px",
    whiteSpace: "nowrap",
  },
  hint: { fontSize: "12px", color: "#9ca3af" },
  error: {
    fontSize: "12px",
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "6px 10px",
    marginBottom: "8px",
  },
};

export default AIProductPanel;