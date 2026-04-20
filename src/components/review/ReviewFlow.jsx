import { useState, useRef, useEffect } from "react"
import { StarRating } from "./StarRating"
import { InternalReview } from "./InternalReview"
import { ThankYou } from "./ThankYou"

export function ReviewFlow({ companyConfig, userName, userEmail }) {
  const [screen, setScreen] = useState("rating")
  const [rating, setRating] = useState(0)
  const [name, setName] = useState(userName)
  const [wasPositive, setWasPositive] = useState(false)
  const [visible, setVisible] = useState(true)
  const timeoutRef = useRef(null)

  useEffect(() => {
    document.title = `Leave a Review — ${companyConfig.name}`

    let link = document.querySelector("link[rel='icon']")
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      document.head.appendChild(link)
    }
    link.href = companyConfig.logo

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [companyConfig])

  const transition = (nextScreen, opts = {}) => {
    setVisible(false)
    timeoutRef.current = setTimeout(() => {
      if (opts.name !== undefined) setName(opts.name)
      if (opts.wasPositive !== undefined) setWasPositive(opts.wasPositive)
      setScreen(nextScreen)
      setVisible(true)
    }, 300)
  }

  const handleRatingNext = (selectedRating) => {
    setRating(selectedRating)
    if (selectedRating >= companyConfig.reviewThreshold) {
      window.open(companyConfig.googleReviewsUrl, "_blank", "noopener,noreferrer")
      transition("thanks", { name: userName, wasPositive: true })
    } else {
      transition("internal")
    }
  }

  return (
    <div
      style={{
        transition: "opacity 300ms ease-out, transform 300ms ease-out",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      {screen === "rating" && (
        <StarRating
          companyConfig={companyConfig}
          userName={userName}
          onNext={handleRatingNext}
        />
      )}
      {screen === "internal" && (
        <InternalReview
          companyConfig={companyConfig}
          rating={rating}
          userName={userName}
          userEmail={userEmail}
          onBack={() => transition("rating")}
          onDone={(submittedName) =>
            transition("thanks", { name: submittedName || "", wasPositive: false })
          }
        />
      )}
      {screen === "thanks" && (
        <ThankYou
          companyConfig={companyConfig}
          name={name}
          wasPositive={wasPositive}
        />
      )}
    </div>
  )
}
