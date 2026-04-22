import { useState } from "react"
import { ReviewShell } from "./ReviewShell"
import { DEFAULT_POSITIVE_CATEGORIES, DEFAULT_IMPROVEMENT_CATEGORIES } from "@/config/companies"

function CategoryChip({ label, selected, primaryColor, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        padding: "10px 18px",
        borderRadius: "100px",
        fontSize: "0.875rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 200ms ease",
        border: `1.5px solid ${selected ? primaryColor : "#e2e8f0"}`,
        backgroundColor: selected ? `color-mix(in srgb, ${primaryColor} 12%, white)` : "white",
        color: selected ? primaryColor : "#64748b",
        whiteSpace: "nowrap",
      }}
    >
      {selected && <span style={{ marginRight: "6px" }}>✓</span>}
      {label}
    </button>
  )
}

export function FeedbackCategories({ companyConfig, isPositive, onNext, onBack, step, totalSteps }) {
  const [selectedAreas, setSelectedAreas] = useState([])

  const categories = isPositive
    ? (companyConfig.positiveCategories || DEFAULT_POSITIVE_CATEGORIES)
    : (companyConfig.improvementCategories || DEFAULT_IMPROVEMENT_CATEGORIES)

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  return (
    <ReviewShell
      companyConfig={companyConfig}
      headline={isPositive ? "What did we do well?" : "What can we improve?"}
      step={step}
      totalSteps={totalSteps}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
        <p style={{ textAlign: "center", fontSize: "1.05rem", color: companyConfig.secondaryColor, margin: 0, lineHeight: 1.6, opacity: 0.75 }}>
          {isPositive
            ? "Select all that apply — your feedback helps us keep it up!"
            : "Select all that apply — it helps us get better."}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {categories.map((area) => (
            <CategoryChip
              key={area}
              label={area}
              selected={selectedAreas.includes(area)}
              primaryColor={companyConfig.primaryColor}
              onToggle={() => toggleArea(area)}
            />
          ))}
        </div>

        <button
          onClick={() => onNext(selectedAreas)}
          disabled={selectedAreas.length === 0}
          style={{
            width: "100%",
            maxWidth: "320px",
            borderRadius: "14px",
            backgroundColor: selectedAreas.length > 0 ? companyConfig.primaryColor : "#e2e8f0",
            color: selectedAreas.length > 0 ? "white" : "#94a3b8",
            padding: "16px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: selectedAreas.length > 0 ? "pointer" : "default",
            border: "none",
            boxShadow: selectedAreas.length > 0
              ? `0 4px 14px color-mix(in srgb, ${companyConfig.primaryColor} 40%, transparent)`
              : "none",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            if (selectedAreas.length > 0) {
              e.currentTarget.style.transform = "translateY(-1px)"
              e.currentTarget.style.boxShadow = `0 6px 20px color-mix(in srgb, ${companyConfig.primaryColor} 50%, transparent)`
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = selectedAreas.length > 0
              ? `0 4px 14px color-mix(in srgb, ${companyConfig.primaryColor} 40%, transparent)`
              : "none"
          }}
        >
          Continue
        </button>

        <button
          type="button"
          onClick={onBack}
          style={{
            fontSize: "0.875rem",
            color: "#94a3b8",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            transition: "color 200ms",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#64748b")}
          onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
        >
          ← Back
        </button>
      </div>
    </ReviewShell>
  )
}
