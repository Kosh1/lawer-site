"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, DollarSign, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function HeroSection() {
  const [situation, setSituation] = useState("")
  const [agreement, setAgreement] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [documentsCount, setDocumentsCount] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // Анимация счетчика документов
  useEffect(() => {
    const timer = setInterval(() => {
      setDocumentsCount((prev) => {
        if (prev < 15000) {
          return prev + 150
        }
        return 15000
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

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
      alert("Документ создан! На ваш email отправлено уведомление со ссылкой на скачивание.")
    }, 2000)
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={`pt-24 pb-16 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
            Опишите проблему своими словами —<br />
            получите исковое заявление за 2 минуты
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Бесплатно. Без юристов. На основе искусственного интеллекта
          </p>

          {/* Бейджи доверия */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              {documentsCount.toLocaleString()} созданных исков
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-100 text-blue-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              Проверено юристами
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-purple-100 text-purple-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              100% бесплатно
            </Badge>
          </div>
        </div>

        {/* Форма генерации */}
        <div id="hero-form" className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            {isLoading && <Progress value={80} className="mb-4" />}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="situation" className="block text-lg font-semibold text-gray-900 mb-3">
                  Расскажите о вашей ситуации:
                </label>
                <Textarea
                  id="situation"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="Например: Сосед сверху залил мою квартиру 15 мая. Ущерб составил 150 тысяч рублей. Есть справка от управляющей компании и чеки на ремонт..."
                  className="min-h-[120px] text-base resize-none border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  required
                  minLength={50}
                  maxLength={2000}
                />
                <div className="text-sm text-gray-500 mt-2">{situation.length}/2000 символов</div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreement"
                  checked={agreement}
                  onCheckedChange={(checked) => setAgreement(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="agreement" className="text-sm text-gray-600 leading-relaxed">
                  Я согласен с{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    обработкой персональных данных
                  </a>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Загрузите файл (чек, справка, фото):</label>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {file && <div className="text-xs text-gray-500 mt-1">Файл: {file.name}</div>}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !agreement || situation.length < 50}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl"
              >
                {isLoading ? "Создаем документ..." : "СОЗДАТЬ ИСКОВОЕ ЗАЯВЛЕНИЕ"}
              </Button>
            </form>
          </div>
        </div>

        {/* Анимированные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{documentsCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">созданных документов</div>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1 мин 47 сек</div>
            <div className="text-sm text-gray-600">среднее время</div>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">от 5,000₽</div>
            <div className="text-sm text-gray-600">экономия на юристе</div>
          </div>
        </div>
      </div>
    </section>
  )
}
