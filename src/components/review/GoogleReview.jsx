import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { GoogleIcon } from "./GoogleIcon"
import { ReviewShell } from "./ReviewShell"

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
const MODELS = [
  { name: "gemini-2.5-flash", thinking: { thinkingBudget: 0 } },
  { name: "gemini-2.5-flash-lite" },
]

function buildPrompt({ companyName, rating, selectedAreas, feedback }) {
  const areasText = selectedAreas.length > 0
    ? `The customer particularly valued: ${selectedAreas.join(", ")}.`
    : ""
  const feedbackText = feedback ? `The customer also said: "${feedback}".` : ""

  return `Write a short Google review (maximum 3 lines, under 280 characters) for a solar company called "${companyName}". The customer gave ${rating} out of 5 stars. ${areasText} ${feedbackText}

Rules:
- Write in first person as the customer
- Sound natural and genuine, not robotic or overly enthusiastic
- Do NOT use hashtags, emojis, or exclamation marks excessively
- Keep it to 2-3 sentences max
- Do not wrap in quotes
- Just return the review text, nothing else`
}

async function callGemini(model, prompt) {
  const url = `${GEMINI_BASE}/${model.name}:generateContent?key=${GEMINI_API_KEY}`
  const config = { temperature: 0.8, maxOutputTokens: 300 }
  if (model.thinking) config.thinkingConfig = model.thinking

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: config,
    }),
  })

  if (!res.ok) throw new Error(`${model.name}: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.findLast(p => p.text)?.text?.trim()
  if (!text) throw new Error(`${model.name}: empty response`)
  return text
}

async function generateReview(params) {
  const prompt = buildPrompt(params)
  for (const model of MODELS) {
    try {
      return await callGemini(model, prompt)
    } catch {
      continue
    }
  }
  throw new Error("All models failed")
}

function StarDisplay({ count, color }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" style={{ width: "18px", height: "18px" }}>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i < count ? color : "#e5e7eb"}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  )
}

function SkeletonLines() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[100, 92, 60].map((w, i) => (
        <div
          key={i}
          style={{
            height: "14px",
            width: `${w}%`,
            borderRadius: "7px",
            background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite ease-in-out",
          }}
        />
      ))}
    </div>
  )
}

export function GoogleReview({ companyConfig, rating, selectedAreas, feedback, onDone, step, totalSteps }) {
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    generateReview({
      companyName: companyConfig.name,
      rating,
      selectedAreas: selectedAreas || [],
      feedback: feedback || "",
    })
      .then((text) => {
        if (!cancelled) {
          setReview(text)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [companyConfig.name, rating, selectedAreas, feedback])

  const handleCopyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(review)
      setCopied(true)
      toast.success("Review copied to clipboard!")
      setTimeout(() => {
        window.open(companyConfig.googleReviewsUrl, "_blank", "noopener,noreferrer")
        setTimeout(() => onDone(), 1000)
      }, 600)
    } catch {
      window.open(companyConfig.googleReviewsUrl, "_blank", "noopener,noreferrer")
      setTimeout(() => onDone(), 1000)
    }
  }

  const handleSkip = () => {
    window.open(companyConfig.googleReviewsUrl, "_blank", "noopener,noreferrer")
    setTimeout(() => onDone(), 1000)
  }

  return (
    <ReviewShell companyConfig={companyConfig} headline="You're awesome! 🎉" step={step} totalSteps={totalSteps}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <p style={{ textAlign: "center", fontSize: "1.05rem", color: companyConfig.secondaryColor, margin: 0, lineHeight: 1.6, opacity: 0.75 }}>
          {loading
            ? "Generating a review for you..."
            : "Here's a suggested review — feel free to copy and paste it on Google:"}
        </p>

        {/* Suggested review card */}
        <div
          style={{
            width: "100%",
            background: "#f8fafc",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #e2e8f0",
            minHeight: "100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <GoogleIcon className="size-5 shrink-0" />
            <span style={{ fontSize: "0.8rem", color: "#5f6368", fontWeight: 500 }}>Google Review</span>
            <div style={{ marginLeft: "auto" }}>
              <StarDisplay count={rating} color="#fbbc04" />
            </div>
          </div>

          {loading ? (
            <SkeletonLines />
          ) : error ? (
            <p style={{ fontSize: "0.925rem", color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              Couldn't generate a review — you can still write your own on Google!
            </p>
          ) : (
            <p style={{ fontSize: "0.925rem", color: "#1f2937", lineHeight: 1.7, margin: 0 }}>
              {review}
            </p>
          )}
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleCopyAndOpen}
          disabled={loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            borderRadius: "14px",
            backgroundColor: loading ? "#94a3b8" : "#1a73e8",
            color: "white",
            padding: "16px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            border: "none",
            boxShadow: loading ? "none" : "0 4px 14px rgba(26, 115, 232, 0.35)",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-1px)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(26, 115, 232, 0.45)"
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 14px rgba(26, 115, 232, 0.35)"
          }}
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <GoogleIcon className="size-5 shrink-0" />
              {copied ? "Copied! Opening Google..." : error ? "Open Google Reviews" : "Copy & Post on Google"}
            </>
          )}
        </button>

        {/* Secondary */}
        <button
          type="button"
          onClick={handleSkip}
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
          Skip, just open Google Reviews →
        </button>
      </div>
    </ReviewShell>
  )
}
