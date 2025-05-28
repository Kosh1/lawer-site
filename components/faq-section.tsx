"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const faqs = [
    {
      id: 1,
      question: "Это действительно бесплатно?",
      answer: "Да, создание искового заявления полностью бесплатно. Мы не берем денег ни на каком этапе.",
    },
    {
      id: 2,
      question: "Подойдет ли документ для суда?",
      answer:
        "Да, наши документы соответствуют требованиям ГПК РФ и принимаются судами. Все иски проверяются на соответствие законодательству.",
    },
    {
      id: 3,
      question: "Какие типы исков можно создать?",
      answer:
        "Любые гражданские иски: взыскание долгов, возмещение ущерба, защита прав потребителей, трудовые споры и другие.",
    },
    {
      id: 4,
      question: "Нужно ли знать законы?",
      answer:
        "Нет, просто опишите ситуацию своими словами. ИИ сам применит нужные статьи законов и составит юридически корректный документ.",
    },
    {
      id: 5,
      question: "Сколько времени занимает создание?",
      answer: "В среднем 1-2 минуты. Зависит от сложности вашего описания ситуации.",
    },
    {
      id: 6,
      question: "Можно ли редактировать готовый документ?",
      answer: "Да, вы получаете документ в формате Word, который можете отредактировать под свои нужды.",
    },
  ]

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="faq"
      ref={sectionRef}
      className={`py-20 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Частые вопросы</h2>
          <p className="text-xl text-gray-600">Ответы на самые популярные вопросы о нашем сервисе</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openItems.includes(faq.id)

            return (
              <Card key={faq.id} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
