import { useState, useCallback } from "react"
import { ReviewShell } from "./ReviewShell"

const LABELS = {
  1: "Terrible",
  2: "Poor",
  3: "Okay",
  4: "Great",
  5: "Amazing",
}

const EMOJIS = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "🤩",
}

function Star({ index, filled, hovered, primaryColor, onHover, onLeave, onSelect }) {
  const isActive = filled || hovered

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
      style={{
        background: "none",
        border: "none",
        padding: "4px",
        cursor: "pointer",
        transition: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: isActive ? "scale(1.2)" : "scale(1)",
      }}
      aria-label={`Rate ${index} star${index > 1 ? "s" : ""}`}
    >
      <svg viewBox="0 0 24 24" style={{ width: "48px", height: "48px" }}>
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={isActive ? primaryColor : "transparent"}
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            transition: "fill 200ms ease, opacity 200ms ease",
            opacity: isActive ? 1 : 0.35,
          }}
        />
      </svg>
    </button>
  )
}

export function StarRating({ companyConfig, userName, onNext, step, totalSteps }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  const active = hovered || rating
  const label = active ? LABELS[active] : null
  const emoji = active ? EMOJIS[active] : null

  const handleSelect = useCallback((value) => {
    setRating(value)
  }, [])

  return (
    <ReviewShell companyConfig={companyConfig} headline="How did we do?" step={step} totalSteps={totalSteps}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <p style={{ textAlign: "center", fontSize: "1.05rem", color: companyConfig.secondaryColor, margin: 0, lineHeight: 1.6, opacity: 0.75 }}>
          {userName ? (
            <>Hi <strong style={{ opacity: 1 }}>{userName}</strong>, rate your experience</>
          ) : (
            "Rate your experience"
          )}
        </p>

        <div style={{ display: "flex", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              index={star}
              filled={star <= rating}
              hovered={hovered > 0 && star <= hovered}
              primaryColor={companyConfig.primaryColor}
              onHover={setHovered}
              onLeave={() => setHovered(0)}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div style={{ height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {label && (
            <span
              key={active}
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: companyConfig.secondaryColor,
                animation: "float-up 0.25s ease-out",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>{emoji}</span> {label}
            </span>
          )}
        </div>

        {rating > 0 && (
          <button
            onClick={() => onNext(rating)}
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "14px",
              backgroundColor: companyConfig.primaryColor,
              color: "white",
              padding: "16px",
              fontSize: "1rem",
              fontWeight: 600,
              animation: "float-up 0.3s ease-out",
              cursor: "pointer",
              border: "none",
              boxShadow: `0 4px 14px color-mix(in srgb, ${companyConfig.primaryColor} 40%, transparent)`,
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-1px)"
              e.target.style.boxShadow = `0 6px 20px color-mix(in srgb, ${companyConfig.primaryColor} 50%, transparent)`
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = `0 4px 14px color-mix(in srgb, ${companyConfig.primaryColor} 40%, transparent)`
            }}
          >
            Continue
          </button>
        )}
      </div>
    </ReviewShell>
  )
}
