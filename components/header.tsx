"use client"

import { Scale } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ИскИИ
          </span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/legal/TermsOfService" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Пользовательское соглашение
          </Link>
          <Link href="/legal/PrivacyPolicy" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Политика конфиденциальности
          </Link>
          <Link href="/legal/PublicOffer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Публичная оферта
          </Link>
        </nav>
      </div>
    </header>
  )
}
