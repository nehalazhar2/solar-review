import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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

export function InternalReview({ companyConfig, rating, userName, userEmail, onBack, onDone }) {
  const [feedback, setFeedback] = useState("")
  const [name, setName] = useState(userName || "")
  const textareaRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => textareaRef.current?.focus(), 350)
    return () => clearTimeout(timer)
  }, [])

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => onDone(name.trim()),
    onError: () => toast.error("Something went wrong. Please try again."),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      webhookUrl: companyConfig.webhookUrl,
      payload: {
        name: name.trim() || "Anonymous",
        email: userEmail || "",
        rating,
        feedback: feedback.trim(),
        company: companyConfig.id,
        companyName: companyConfig.name,
        timestamp: new Date().toISOString(),
        source: "Post-Installation Review App",
      },
    })
  }

  const handleFeedbackChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setFeedback(e.target.value)
    }
  }

  return (
    <ReviewShell companyConfig={companyConfig} headline="We value your feedback">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <p style={{ textAlign: "center", fontSize: "1.1rem", color: companyConfig.secondaryColor, margin: 0, lineHeight: 1.6, opacity: 0.8 }}>
          We'd love to hear more about your experience.
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px", marginTop: "4px" }}>
          <div>
            <Textarea
              ref={textareaRef}
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={handleFeedbackChange}
              maxLength={MAX_CHARS}
              className="min-h-28 resize-none bg-white focus-visible:ring-[3px]"
              style={{
                "--tw-ring-color": `color-mix(in srgb, ${companyConfig.primaryColor} 25%, transparent)`,
                borderColor: `color-mix(in srgb, ${companyConfig.secondaryColor} 20%, #e5e7eb)`,
              }}
            />
            <p style={{ fontSize: "0.75rem", color: `color-mix(in srgb, ${companyConfig.secondaryColor} 40%, #9ca3af)`, textAlign: "right", marginTop: "6px" }}>
              {feedback.length}/{MAX_CHARS}
            </p>
          </div>

          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 bg-white focus-visible:ring-[3px]"
            style={{
              "--tw-ring-color": `color-mix(in srgb, ${companyConfig.primaryColor} 25%, transparent)`,
              borderColor: `color-mix(in srgb, ${companyConfig.secondaryColor} 20%, #e5e7eb)`,
            }}
          />

          <Button
            type="submit"
            size="lg"
            disabled={mutation.isPending}
            style={{
              width: "100%",
              borderRadius: "9999px",
              backgroundColor: companyConfig.primaryColor,
              color: "white",
              padding: "14px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: mutation.isPending ? "wait" : "pointer",
              border: "none",
            }}
            className="h-auto shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            {mutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Submit Feedback"
            )}
          </Button>

          <button
            type="button"
            onClick={onBack}
            disabled={mutation.isPending}
            style={{
              fontSize: "0.875rem",
              color: `color-mix(in srgb, ${companyConfig.secondaryColor} 50%, #9ca3af)`,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => (e.target.style.color = companyConfig.secondaryColor)}
            onMouseLeave={(e) => (e.target.style.color = `color-mix(in srgb, ${companyConfig.secondaryColor} 50%, #9ca3af)`)}
          >
            ← Change rating
          </button>
        </form>
      </div>
    </ReviewShell>
  )
}
