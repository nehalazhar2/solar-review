import { AnimatedCheck } from "./AnimatedCheck"
import { ReviewShell } from "./ReviewShell"

export function ThankYou({ companyConfig, name, wasPositive }) {
  return (
    <ReviewShell companyConfig={companyConfig} headline="All done!">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <AnimatedCheck color={companyConfig.primaryColor} />

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 600, color: companyConfig.secondaryColor, margin: 0 }}>
            {name ? `Thank you, ${name}!` : "Thank you!"}
          </p>
          <p style={{ color: `color-mix(in srgb, ${companyConfig.secondaryColor} 65%, #9ca3af)`, marginTop: "8px", lineHeight: 1.6 }}>
            Your feedback means a lot to us.
          </p>
          <p style={{ fontSize: "0.875rem", color: `color-mix(in srgb, ${companyConfig.secondaryColor} 45%, #9ca3af)`, marginTop: "12px" }}>
            {wasPositive
              ? "We really appreciate you taking the time."
              : "Our team will be in touch if needed."}
          </p>
        </div>

        <p style={{ fontSize: "0.75rem", color: `color-mix(in srgb, ${companyConfig.secondaryColor} 30%, #d1d5db)`, marginTop: "24px" }}>
          Powered by <strong>{companyConfig.name}</strong>
        </p>
      </div>
    </ReviewShell>
  )
}
