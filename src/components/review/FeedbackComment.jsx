import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { ReviewShell } from "./ReviewShell"

const MAX_CHARS = 500

async function submitReview({ webhookUrl, payload }) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Webhook failed")
  return payload
}

export function FeedbackComment({ companyConfig, rating, selectedAreas, isPositive, userName, userEmail, onBack, onDone, step, totalSteps }) {
  const [feedback, setFeedback] = useState("")
  const [name, setName] = useState(userName || "")
  const textareaRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => textareaRef.current?.focus(), 350)
    return () => clearTimeout(timer)
  }, [])

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => onDone({ feedback: feedback.trim(), name: name.trim() }),
    onError: () => {
      if (isPositive) {
        onDone({ feedback: feedback.trim(), name: name.trim() })
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name: name.trim() || "Anonymous",
      email: userEmail || "",
      rating,
      selectedAreas,
      feedback: feedback.trim(),
      company: companyConfig.id,
      companyName: companyConfig.name,
      timestamp: new Date().toISOString(),
      source: "Post-Installation Review App",
    }
    mutation.mutate({ webhookUrl: companyConfig.webhookUrl, payload })
  }

  const handleFeedbackChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setFeedback(e.target.value)
    }
  }

  return (
    <ReviewShell
      companyConfig={companyConfig}
      headline={isPositive ? "Almost there!" : "Tell us more"}
      step={step}
      totalSteps={totalSteps}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Selected areas summary */}
        {selectedAreas.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
            {selectedAreas.map((area) => (
              <span
                key={area}
                style={{
                  padding: "4px 12px",
                  borderRadius: "100px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor: `color-mix(in srgb, ${companyConfig.primaryColor} 10%, white)`,
                  color: companyConfig.primaryColor,
                  border: `1px solid color-mix(in srgb, ${companyConfig.primaryColor} 20%, transparent)`,
                }}
              >
                {area}
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: companyConfig.secondaryColor, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
              {isPositive ? "Anything else you'd like to share? (optional)" : "Additional details (optional)"}
            </label>
            <textarea
              ref={textareaRef}
              placeholder={isPositive ? "Tell us what made your experience great..." : "Help us understand what happened..."}
              value={feedback}
              onChange={handleFeedbackChange}
              maxLength={MAX_CHARS}
              rows={3}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: `1.5px solid color-mix(in srgb, ${companyConfig.secondaryColor} 15%, #e5e7eb)`,
                fontSize: "0.95rem",
                lineHeight: 1.6,
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 200ms, box-shadow 200ms",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = companyConfig.primaryColor
                e.target.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${companyConfig.primaryColor} 15%, transparent)`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `color-mix(in srgb, ${companyConfig.secondaryColor} 15%, #e5e7eb)`
                e.target.style.boxShadow = "none"
              }}
            />
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "right", marginTop: "4px" }}>
              {feedback.length}/{MAX_CHARS}
            </p>
          </div>

          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: `1.5px solid color-mix(in srgb, ${companyConfig.secondaryColor} 15%, #e5e7eb)`,
              fontSize: "0.95rem",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 200ms, box-shadow 200ms",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = companyConfig.primaryColor
              e.target.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${companyConfig.primaryColor} 15%, transparent)`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `color-mix(in srgb, ${companyConfig.secondaryColor} 15%, #e5e7eb)`
              e.target.style.boxShadow = "none"
            }}
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              width: "100%",
              borderRadius: "14px",
              backgroundColor: companyConfig.primaryColor,
              color: "white",
              padding: "16px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: mutation.isPending ? "wait" : "pointer",
              border: "none",
              boxShadow: `0 4px 14px color-mix(in srgb, ${companyConfig.primaryColor} 40%, transparent)`,
              transition: "all 200ms ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: mutation.isPending ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!mutation.isPending) {
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = `0 6px 20px color-mix(in srgb, ${companyConfig.primaryColor} 50%, transparent)`
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = `0 4px 14px color-mix(in srgb, ${companyConfig.primaryColor} 40%, transparent)`
            }}
          >
            {mutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Submit"
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={mutation.isPending}
            style={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              transition: "color 200ms",
              alignSelf: "center",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#64748b")}
            onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
          >
            ← Back
          </button>
        </form>
      </div>
    </ReviewShell>
  )
}
