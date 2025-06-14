"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, DollarSign, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ChatDialog } from "@/components/chat-dialog"

export function HeroSection() {
  const [situation, setSituation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documentsCount, setDocumentsCount] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

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
    if (!situation.trim()) return

    // Яндекс.Метрика — цель "start_dialog"
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(102501372, "reachGoal", "start_dialog");
    }

    setIsLoading(true)
    // Открываем чат вместо имитации API запроса
    setIsChatOpen(true)
    setIsLoading(false)
  }

  return (
    <>
      <section
        id="hero"
        ref={sectionRef}
        className={`pt-24 pb-16 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
            Защитите свои права при разводе —<br />
              получите исковое заявление за 2 минуты
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Никаких судов, встреч с юристами и лишних трат. Просто опишите ситуацию — получите готовый документ для защиты ваших прав и прав детей
            </p>

            {/* Бейджи доверия */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                {documentsCount.toLocaleString()} созданных исков
              </Badge>
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                Экономия до 15,000₽ на юристах
              </Badge>
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                100% конфиденциально — никто не узнает
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
                    Расскажите о вашей семейной ситуации:
                  </label>
                  <Textarea
                    id="situation"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Например: Подаю на развод с мужем. У нас общий ребенок 8 лет. Муж работает в компании ООО 'Строй+', получает 80,000 рублей в месяц, но говорит, что будет платить только 5,000. Хочу подать на алименты в размере 25% от зарплаты..."
                    className="min-h-[120px] text-base resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white text-gray-900 outline-none"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !situation.trim()}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl"
                  >
                    {isLoading ? "Открываем чат..." : "ЗАЩИТИТЬ ПРАВА ДЕТЕЙ"}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Анимированные метрики */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{documentsCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">созданных документов</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1 мин 47 сек</div>
              <div className="text-sm text-gray-600">среднее время</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">от 15,000₽</div>
              <div className="text-sm text-gray-600">экономия на юристе</div>
            </div>
          </div>
        </div>
      </section>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={situation}
      />
    </>
  )
}
