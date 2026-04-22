import { useState, useRef, useEffect } from "react"
import { StarRating } from "./StarRating"
import { FeedbackCategories } from "./FeedbackCategories"
import { FeedbackComment } from "./FeedbackComment"
import { GoogleReview } from "./GoogleReview"
import { ThankYou } from "./ThankYou"

export function ReviewFlow({ companyConfig, userName, userEmail }) {
  const [screen, setScreen] = useState("rating")
  const [rating, setRating] = useState(0)
  const [selectedAreas, setSelectedAreas] = useState([])
  const [feedback, setFeedback] = useState("")
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

  const isPositive = rating >= companyConfig.reviewThreshold

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
    setWasPositive(selectedRating >= companyConfig.reviewThreshold)
    transition("categories")
  }

  const handleCategoriesNext = (areas) => {
    setSelectedAreas(areas)
    if (isPositive) {
      transition("google", { wasPositive: true })
    } else {
      transition("comment")
    }
  }

  const handleCommentDone = ({ feedback: fb, name: n }) => {
    setFeedback(fb)
    setName(n)
    transition("thanks", { name: n, wasPositive: false })
  }

  const totalSteps = 3
  const currentStep =
    screen === "rating" ? 1 :
    screen === "categories" ? 2 :
    screen === "comment" ? 3 :
    screen === "google" ? 3 : null

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
          step={currentStep}
          totalSteps={totalSteps}
        />
      )}
      {screen === "categories" && (
        <FeedbackCategories
          companyConfig={companyConfig}
          isPositive={isPositive}
          onNext={handleCategoriesNext}
          onBack={() => transition("rating")}
          step={currentStep}
          totalSteps={totalSteps}
        />
      )}
      {screen === "comment" && (
        <FeedbackComment
          companyConfig={companyConfig}
          rating={rating}
          selectedAreas={selectedAreas}
          isPositive={isPositive}
          userName={userName}
          userEmail={userEmail}
          onBack={() => transition("categories")}
          onDone={handleCommentDone}
          step={currentStep}
          totalSteps={totalSteps}
        />
      )}
      {screen === "google" && (
        <GoogleReview
          companyConfig={companyConfig}
          rating={rating}
          selectedAreas={selectedAreas}
          feedback={feedback}
          onDone={() => transition("thanks", { name, wasPositive: true })}
          step={currentStep}
          totalSteps={totalSteps}
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
