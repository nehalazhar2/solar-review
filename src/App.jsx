import { useEffect, useMemo } from 'react'
import { Toaster } from 'sonner'
import { getCompanyConfig } from './config'
import { ReviewFlow } from './components/review/ReviewFlow'

function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-8xl font-extralight text-gray-300 select-none">404</p>
        <p className="text-gray-400 mt-3 text-sm tracking-wide">
          This page doesn't exist.
        </p>
      </div>
    </div>
  )
}

function App() {
  const { config, userName, userEmail } = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('t')
    return {
      config: token ? getCompanyConfig(token) : null,
      userName: params.get('n') || '',
      userEmail: params.get('e') || '',
    }
  }, [])

  useEffect(() => {
    if (config?.favicon) {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = config.favicon
    }
  }, [config])

  return (
    <>
      <Toaster position="top-center" richColors />
      {config ? (
        <ReviewFlow companyConfig={config} userName={userName} userEmail={userEmail} />
      ) : (
        <NotFound />
      )}
    </>
  )
}

export default App
