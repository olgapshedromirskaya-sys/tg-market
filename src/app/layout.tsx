import type { Metadata } from 'next'
import Script from 'next/script'
import { TelegramMiniAppInit } from '@/components/telegram-mini-app-init'
import './globals.css'

export const metadata: Metadata = {
  title: 'Свой собственный маркетплейс | Telegram Mini App',
  description: 'Интернет-магазин и витрина товаров для Telegram Mini App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#071432" />
      </head>
      <body className="antialiased">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <TelegramMiniAppInit />
        {children}
      </body>
    </html>
  )
}
