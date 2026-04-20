import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "./GoogleIcon"
import { CompanyLogo } from "./CompanyLogo"
import { Sparkles } from "./Sparkles"

export function GoogleReview({ companyConfig, onDone }) {
  const handleGoogleClick = () => {
    window.open(companyConfig.googleReviewsUrl, "_blank", "noopener,noreferrer")
    setTimeout(onDone, 1500)
  }

  return (
    <Card
      className="relative w-full max-w-md mx-auto shadow-lg shadow-black/5 border-0 ring-1 ring-black/[0.06]"
      style={{ borderTop: `3px solid ${companyConfig.secondaryColor}` }}
    >
      <Sparkles primaryColor={companyConfig.primaryColor} />
      <CardContent className="flex flex-col items-center gap-6 px-6 pt-10 pb-10 sm:px-8">
        <CompanyLogo companyConfig={companyConfig} />

        <div className="text-center">
          <p className="text-xl font-semibold text-foreground">
            You're amazing! 🎉
          </p>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Would you mind sharing your experience on Google? It really helps us out.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full max-w-xs h-12 gap-3 bg-white text-foreground font-medium ring-1 ring-black/[0.12] shadow-sm hover:bg-gray-50 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
          onClick={handleGoogleClick}
        >
          <GoogleIcon className="size-5 shrink-0" />
          Leave a Google Review
        </Button>

        <button
          type="button"
          className="text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors cursor-pointer py-2"
          onClick={onDone}
        >
          No thanks, I'll skip
        </button>
      </CardContent>
    </Card>
  )
}
