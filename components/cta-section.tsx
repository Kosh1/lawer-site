"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Users } from "lucide-react"

export function CTASection() {
  const [situation, setSituation] = useState("")
  const [agreement, setAgreement] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreement || !situation.trim()) return

    setIsLoading(true)
    // Имитация API запроса
    setTimeout(() => {
      setIsLoading(false)
      alert("Документ создан! В реальном приложении здесь будет скачивание.")
    }, 2000)
  }

  return (
    <section
      id="cta"
      ref={sectionRef}
      className={`py-20 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Не откладывайте защиту своих прав</h2>
          <p className="text-xl text-blue-100 mb-8">Каждый день промедления может стоить вам денег</p>

          {/* Социальное доказательство */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">Прямо сейчас 47 человек создают исковые заявления</span>
          </div>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cta-situation" className="block text-lg font-semibold text-gray-900 mb-3">
                Расскажите о вашей ситуации:
              </label>
              <Textarea
                id="cta-situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Например: Сосед сверху залил мою квартиру 15 мая. Ущерб составил 150 тысяч рублей..."
                className="min-h-[120px] text-base resize-none border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                required
                minLength={50}
                maxLength={2000}
              />
              <div className="text-sm text-gray-500 mt-2">{situation.length}/2000 символов</div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="cta-agreement"
                checked={agreement}
                onCheckedChange={(checked) => setAgreement(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="cta-agreement" className="text-sm text-gray-600 leading-relaxed">
                Я согласен с{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  обработкой персональных данных
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agreement || situation.length < 50}
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl"
            >
              {isLoading ? "Создаем документ..." : "СОЗДАТЬ ИСКОВОЕ ЗАЯВЛЕНИЕ БЕСПЛАТНО"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
