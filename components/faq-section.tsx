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
      question: "Узнает ли мой бывший супруг, что я составляла иск через ваш сервис?",
      answer: "Нет, наш сервис полностью конфиденциален. В готовом документе нет никаких упоминаний о том, где он был создан. Для бывшего супруга это будет выглядеть как обычное исковое заявление.",
    },
    {
      id: 2,
      question: "Действительно ли иск будет составлен правильно для семейных споров?",
      answer: "Да, наша нейросеть обучена на тысячах дел по семейному праву. Она учитывает все нюансы: размер алиментов, доходы супруга, интересы детей, раздел имущества и требования ГПК РФ.",
    },
    {
      id: 3,
      question: "Что если бывший супруг скрывает реальные доходы?",
      answer:
        "В иске будет указано требование о взыскании алиментов в долях от заработка И требование к суду запросить справки о доходах у работодателя ответчика. Суд сам выяснит реальные доходы.",
    },
    {
      id: 4,
      question: "Можно ли подать на алименты, если мы еще не разведены?",
      answer:
        "Да, алименты можно взыскивать независимо от развода. Вы можете подать отдельный иск о взыскании алиментов, даже находясь в браке.",
    },
    {
      id: 5,
      question: "Поможет ли это, если бывший супруг уже уехал в другую страну?",
      answer: "Да, наш сервис составит иск с учетом этих обстоятельств. В заявлении будет указано о розыске ответчика и возможности взыскания алиментов через международные соглашения.",
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
