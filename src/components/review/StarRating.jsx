import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ReviewShell } from "./ReviewShell"

const LABELS = {
  0.5: "Terrible",
  1: "Poor",
  1.5: "Poor",
  2: "Below Average",
  2.5: "Below Average",
  3: "Average",
  3.5: "Average",
  4: "Good",
  4.5: "Very Good",
  5: "Excellent",
}

function HalfStar({ starIndex, rating, hoverRating, primaryColor, onHover, onLeave, onSelect }) {
  const active = hoverRating || rating
  const leftFilled = active >= starIndex - 0.5
  const rightFilled = active >= starIndex
  const isActive = rightFilled || leftFilled

  return (
    <div
      style={{
        transition: "transform 150ms",
        transform: isActive ? "scale(1.12)" : "scale(1)",
      }}
      onMouseLeave={onLeave}
    >
      <svg viewBox="0 0 24 24" style={{ width: "52px", height: "52px" }}>
        <defs>
          <clipPath id={`left-${starIndex}`}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
          <clipPath id={`right-${starIndex}`}>
            <rect x="12" y="0" width="12" height="24" />
          </clipPath>
        </defs>

        <g clipPath={`url(#left-${starIndex})`}>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={leftFilled ? primaryColor : "transparent"}
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ transition: "all 200ms", opacity: leftFilled ? 1 : 0.4 }}
          />
          <rect
            x="0" y="0" width="12" height="24"
            fill="transparent"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => onHover(starIndex - 0.5)}
            onClick={() => onSelect(starIndex - 0.5)}
          />
        </g>

        <g clipPath={`url(#right-${starIndex})`}>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={rightFilled ? primaryColor : "transparent"}
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ transition: "all 200ms", opacity: rightFilled ? 1 : 0.4 }}
          />
          <rect
            x="12" y="0" width="12" height="24"
            fill="transparent"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => onHover(starIndex)}
            onClick={() => onSelect(starIndex)}
          />
        </g>
      </svg>
    </div>
  )
}

export function StarRating({ companyConfig, userName, onNext }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)

  const active = hovered || rating
  const label = active ? LABELS[active] : null

  const handleSelect = useCallback((value) => {
    setRating(value)
  }, [])

  return (
    <ReviewShell companyConfig={companyConfig} headline="How did we do?">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <p style={{ textAlign: "center", fontSize: "1.1rem", color: companyConfig.secondaryColor, margin: 0, lineHeight: 1.6, opacity: 0.8 }}>
          {userName ? (
            <>
              Hi <strong style={{ opacity: 1, color: companyConfig.secondaryColor }}>{userName}</strong>, how was your experience with{" "}
              <strong style={{ opacity: 1, color: companyConfig.secondaryColor }}><span style={{ whiteSpace: "nowrap" }}>{companyConfig.name}</span></strong>?
            </>
          ) : (
            <>
              How was your experience with{" "}
              <strong style={{ opacity: 1, color: companyConfig.secondaryColor }}><span style={{ whiteSpace: "nowrap" }}>{companyConfig.name}</span></strong>?
            </>
          )}
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <HalfStar
              key={star}
              starIndex={star}
              rating={rating}
              hoverRating={hovered}
              primaryColor={companyConfig.primaryColor}
              onHover={setHovered}
              onLeave={() => setHovered(0)}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div style={{ height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {label && (
            <span
              key={label}
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: companyConfig.secondaryColor,
                animation: "float-up 0.25s ease-out",
              }}
            >
              {label}
            </span>
          )}
        </div>

        {rating > 0 && (
          <Button
            size="lg"
            onClick={() => onNext(rating)}
            style={{
              width: "100%",
              maxWidth: "320px",
              borderRadius: "9999px",
              backgroundColor: companyConfig.primaryColor,
              color: "white",
              padding: "14px",
              fontSize: "1rem",
              fontWeight: 600,
              animation: "float-up 0.3s ease-out",
              cursor: "pointer",
              border: "none",
            }}
            className="h-auto shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            Next
          </Button>
        )}
      </div>
    </ReviewShell>
  )
}
