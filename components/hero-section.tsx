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
            Не знаете, как поделить квартиру<br />
            и защитить права при разводе?
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ИИ-консультант проанализирует ваши права на имущество, алименты и детей за 2 минуты. Бесплатно и конфиденциально.
            </p>
          </div>

          {/* Форма генерации */}
          <div id="hero-form" className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {isLoading && <Progress value={80} className="mb-4" />}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <span role="img" aria-label="chat" className="mr-2">💬</span>
                    Расскажите о вашей ситуации
                  </h2>
                  <p className="text-base text-gray-600 mb-4">
                    Опишите простыми словами что происходит. ИИ разберет ваши права и даст конкретный план действий.
                  </p>
                  <Textarea
                    id="situation"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Например: Подаю на развод с мужем. У нас квартира в ипотеке на 2 млн, осталось доплатить 800 тыс. Есть дочь 7 лет. Муж работает программистом, зарплата 120 тысяч, но говорит что будет платить только 10 тысяч алиментов. Боюсь остаться без жилья и денег на ребенка..."
                    className="min-h-[120px] text-base resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white text-gray-900 outline-none"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !situation.trim()}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:opacity-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {isLoading ? "Открываем чат..." : (
                      <span className="flex items-center justify-center">
                        <span role="img" aria-label="rocket" className="mr-2">🚀</span>
                        ПОЛУЧИТЬ ПЛАН ЗАЩИТЫ ПРАВ
                      </span>
                    )}
                  </Button>
                  <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span role="img" aria-label="lock">🔒</span>
                      <span>100% конфиденциально</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span role="img" aria-label="bolt">⚡</span>
                      <span>Результат за 2 минуты</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span role="img" aria-label="money with wings">💸</span>
                      <span>Бесплатно</span>
                    </div>
                  </div>
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
