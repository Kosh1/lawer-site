"use client"

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

  const steps = [
    {
      id: 1,
      icon: FileText,
      title: "ОПИШИТЕ СЕМЕЙНУЮ СИТУАЦИЮ",
      description: "Расскажите о разводе, детях и доходах супруга простыми словами",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 2,
      icon: Brain,
      title: "ИИ СОСТАВИТ ЮРИДИЧЕСКИЙ ДОКУМЕНТ",
      description: "Нейросеть создаст исковое заявление с учетом всех нюансов семейного права",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: 3,
      icon: Download,
      title: "ПОДАЙТЕ ИСК В СУД",
      description: "Получите готовый документ и защитите права своих детей",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

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

          {steps.map((step) => {
            const Icon = step.icon
            const isVisible = visibleSteps.includes(step.id)

            return (
              <Card
                key={step.id}
                className={`relative transition-all duration-700 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } hover:shadow-xl border-2 border-gray-100 hover:border-gray-200`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-gray-200">
                    <span className="text-sm font-bold text-gray-600">{step.id}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  <div className="mt-4 text-sm text-gray-500">
                    {step.id === 1 && "~30 секунд"}
                    {step.id === 2 && "~1 минута"}
                    {step.id === 3 && "~10 секунд"}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
