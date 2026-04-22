import { CompanyLogo } from "./CompanyLogo"

function SolarRays({ primaryColor }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07 }}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ray-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="220" r="120" fill="url(#ray-glow)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const x1 = 200 + Math.cos(angle) * 60
        const y1 = 220 + Math.sin(angle) * 60
        const x2 = 200 + Math.cos(angle) * 200
        const y2 = 220 + Math.sin(angle) * 200
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        )
      })}
    </svg>
  )
}

function StepIndicator({ step, totalSteps, primaryColor }) {
  if (!step || !totalSteps) return null
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === step ? "24px" : "8px",
            height: "8px",
            borderRadius: "100px",
            backgroundColor: i + 1 <= step ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
            transition: "all 300ms ease",
          }}
        />
      ))}
    </div>
  )
}

export function ReviewShell({ companyConfig, headline, children, step, totalSteps }) {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Hero zone */}
      <div
        style={{
          height: "38vh",
          minHeight: "200px",
          background: `linear-gradient(135deg, ${companyConfig.secondaryColor} 0%, color-mix(in srgb, ${companyConfig.secondaryColor} 85%, ${companyConfig.primaryColor}) 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <SolarRays primaryColor={companyConfig.primaryColor} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              borderRadius: "50%",
              padding: "10px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CompanyLogo
              companyConfig={companyConfig}
              className="!max-h-[90px]"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
            />
          </div>

          <StepIndicator step={step} totalSteps={totalSteps} primaryColor={companyConfig.primaryColor} />

          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: "0.05em",
              margin: 0,
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            {headline}
          </p>
        </div>

        {/* Wave divider */}
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          height="60"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>

      {/* Content zone */}
      <div
        style={{
          flex: 1,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "40px 24px 40px",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
