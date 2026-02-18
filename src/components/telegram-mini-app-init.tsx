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
    webApp.setBackgroundColor?.('#040d24')
    webApp.setHeaderColor?.('#071432')
  }, [])

  return null
}
