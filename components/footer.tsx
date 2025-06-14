"use client"

import { Scale } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LegalModal } from "@/components/LegalModal"

export function Footer() {
  const [modal, setModal] = useState<null | "privacy" | "terms" | "offer">(null)

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">ИскИИ</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Генератор исковых заявлений на основе искусственного интеллекта. Быстро, бесплатно, юридически корректно.
            </p>
            <div className="text-sm text-gray-500">© 2025 ИскИИ — Генератор исковых заявлений</div>
          </div>

          {/* Ссылки */}
          <div>
            <h3 className="font-semibold mb-4">Документы</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button className="hover:text-white transition-colors underline" onClick={() => setModal("privacy")}>
                  Политика конфиденциальности
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors underline" onClick={() => setModal("terms")}>
                  Пользовательское соглашение
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors underline" onClick={() => setModal("offer")}>
                  Публичная оферта
                </button>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="mailto:help@iskii.ru" className="hover:text-white transition-colors">
                  help@aiisk.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            Сервис предоставляет информационную поддержку и не заменяет консультацию юриста. Перед подачей документов в
            суд рекомендуем проконсультироваться со специалистом.
          </p>
        </div>
      </div>
      <LegalModal open={modal === "privacy"} onClose={() => setModal(null)} title="Политика конфиденциальности">
        <p>Здесь будет текст политики конфиденциальности. Lorem ipsum dolor sit amet...</p>
      </LegalModal>
      <LegalModal open={modal === "terms"} onClose={() => setModal(null)} title="Пользовательское соглашение">
        <p>Здесь будет текст пользовательского соглашения. Lorem ipsum dolor sit amet...</p>
      </LegalModal>
      <LegalModal open={modal === "offer"} onClose={() => setModal(null)} title="Публичная оферта">
        <p>Здесь будет текст публичной оферты. Lorem ipsum dolor sit amet...</p>
      </LegalModal>
    </footer>
  )
}
