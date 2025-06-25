"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Brain, Download } from "lucide-react"

export function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Анимация появления шагов с задержкой
            setTimeout(() => setVisibleSteps([1]), 200)
            setTimeout(() => setVisibleSteps([1, 2]), 600)
            setTimeout(() => setVisibleSteps([1, 2, 3]), 1000)
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`py-20 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Всего 3 простых шага</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Никаких сложных форм и юридических терминов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Соединительные линии */}
          <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2"></div>
          <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-300 to-green-300 transform -translate-y-1/2"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-3xl font-bold shadow-lg mb-6">
              1
            </div>
            <div className="font-extrabold text-lg text-gray-900 mb-2 uppercase tracking-wide">РАССКАЖИТЕ ОБ ИМУЩЕСТВЕ</div>
            <div className="text-gray-500 mb-3">
              Опишите что есть в семье: квартира, машина, дача, бизнес. Когда и на что покупали — ИИ разберет детали.
            </div>
            <div className="text-indigo-600 font-semibold">~30 секунд</div>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-3xl font-bold shadow-lg mb-6">
              2
            </div>
            <div className="font-extrabold text-lg text-gray-900 mb-2 uppercase tracking-wide">ИИ АНАЛИЗИРУЕТ ПРАВА</div>
            <div className="text-gray-500 mb-3">
              Получите экспертное заключение о ваших правах на каждый объект с учетом семейного законодательства
            </div>
            <div className="text-indigo-600 font-semibold">~1 минута</div>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-3xl font-bold shadow-lg mb-6">
              3
            </div>
            <div className="font-extrabold text-lg text-gray-900 mb-2 uppercase tracking-wide">ПЛАН ЗАЩИТЫ ИНТЕРЕСОВ</div>
            <div className="text-gray-500 mb-3">
              Стратегия действий + документы при необходимости. Знания вместо страхов и сомнений.
            </div>
            <div className="text-indigo-600 font-semibold">~30 секунд</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
          Как проходит анализ ваших прав
        </h2>
        <p className="text-lg text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Простой процесс получения ясности о ваших правах на имущество
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-3xl font-bold shadow-lg mb-6">
              1
            </div>
            <div className="font-extrabold text-lg text-gray-900 mb-2 uppercase tracking-wide">РАССКАЖИТЕ ОБ ИМУЩЕСТВЕ</div>
            <div className="text-gray-500 mb-3">
              Опишите что есть в семье: квартира, машина, дача, бизнес. Когда и на что покупали — ИИ разберет детали.
            </div>
            <div className="text-indigo-600 font-semibold">~30 секунд</div>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-3xl font-bold shadow-lg mb-6">
              2
            </div>
            <div className="font-extrabold text-lg text-gray-900 mb-2 uppercase tracking-wide">ИИ АНАЛИЗИРУЕТ ПРАВА</div>
            <div className="text-gray-500 mb-3">
              Получите экспертное заключение о ваших правах на каждый объект с учетом семейного законодательства
            </div>
            <div className="text-indigo-600 font-semibold">~1 минута</div>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-3xl font-bold shadow-lg mb-6">
              3
            </div>
            <div className="font-extrabold text-lg text-gray-900 mb-2 uppercase tracking-wide">ПЛАН ЗАЩИТЫ ИНТЕРЕСОВ</div>
            <div className="text-gray-500 mb-3">
              Стратегия действий + документы при необходимости. Знания вместо страхов и сомнений.
            </div>
            <div className="text-indigo-600 font-semibold">~30 секунд</div>
          </div>
        </div>
      </div>
    </section>
  );
}
