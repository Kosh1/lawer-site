"use client"

import { Scale } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PrivacyPolicy from "@/components/legal/PrivacyPolicy"
import TermsOfService from "@/components/legal/TermsOfService"
import PublicOffer from "@/components/legal/PublicOffer"

export function Header() {
  const [modal, setModal] = useState<null | "privacy" | "terms" | "offer">(null)

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
          <button onClick={() => setModal("terms")}
            className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Пользовательское соглашение
          </button>
          <button onClick={() => setModal("privacy")}
            className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Политика конфиденциальности
          </button>
          <button onClick={() => setModal("offer")}
            className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
            Публичная оферта
          </button>
        </nav>
      </div>
      {/* Модальные окна */}
      <Dialog open={modal === "terms"} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Пользовательское соглашение</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto text-sm text-gray-800 text-left">
            <TermsOfService />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={modal === "privacy"} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Политика конфиденциальности</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto text-sm text-gray-800 text-left">
            <PrivacyPolicy />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={modal === "offer"} onOpenChange={() => setModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Публичная оферта</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto text-sm text-gray-800 text-left">
            <PublicOffer />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
