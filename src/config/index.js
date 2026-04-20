import { config_365solar } from "./companies"
import { TOKEN_MAP } from "./tokens"

const configMap = {
  "365solar": config_365solar,
}

export function getCompanyConfig(token) {
  const companyKey = TOKEN_MAP[token]
  if (!companyKey) return null
  return configMap[companyKey] || null
}
