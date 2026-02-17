'use client'

import { useEffect } from 'react'

type TelegramWebApp = {
  ready: () => void
  expand: () => void
  setBackgroundColor?: (color: string) => void
  setHeaderColor?: (color: string) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export function TelegramMiniAppInit() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp

    if (!webApp) return

    webApp.ready()
    webApp.expand()
    webApp.setBackgroundColor?.('#0f1018')
    webApp.setHeaderColor?.('#121424')
  }, [])

  return null
}
