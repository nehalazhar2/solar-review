import { useState } from "react"

export function CompanyLogo({ companyConfig, className = "", style = {} }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={`text-xl font-bold ${className}`}
        style={{ color: companyConfig.primaryColor }}
      >
        {companyConfig.name}
      </span>
    )
  }

  return (
    <img
      src={companyConfig.logo}
      alt={companyConfig.name}
      className={`max-h-[80px] w-auto object-contain ${className}`}
      style={style}
      onError={() => setFailed(true)}
    />
  )
}
