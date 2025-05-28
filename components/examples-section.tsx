"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, User, FileText } from "lucide-react"

export function ExamplesSection() {
  const [currentExample, setCurrentExample] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const examples = [
    {
      id: 1,
      title: "Залив квартиры",
      tag: "#ЗаливКвартиры",
      userInput:
        "Сосед сверху залил мою квартиру. Испорчен натяжной потолок и ламинат. Ущерб 150 тысяч рублей. Есть справка от управляющей компании.",
      result: {
        court: "Кунцевский районный суд г. Москвы",
        title: "ИСКОВОЕ ЗАЯВЛЕНИЕ",
        subtitle: "о возмещении ущерба от залива",
        preview: "В Кунцевский районный суд города Москвы\n\nИстец: Иванов Иван Иванович...",
      },
    },
    {
      id: 2,
      title: "Невозврат долга",
      tag: "#ВозвратДолга",
      userInput:
        "Дал в долг 100 тысяч рублей по расписке. Должник не возвращает уже полгода. Расписка есть, свидетели тоже.",
      result: {
        court: "Пресненский районный суд г. Москвы",
        title: "ИСКОВОЕ ЗАЯВЛЕНИЕ",
        subtitle: "о взыскании долга",
        preview: "В Пресненский районный суд города Москвы\n\nИстец: Петров Петр Петрович...",
      },
    },
    {
      id: 3,
      title: "Защита прав потребителя",
      tag: "#ПраваПотребителя",
      userInput:
        "Купил телефон в МВидео. Сломался через неделю. Магазин отказывается возвращать деньги, предлагают только ремонт.",
      result: {
        court: "Мировой суд судебного участка №123",
        title: "ИСКОВОЕ ЗАЯВЛЕНИЕ",
        subtitle: "о защите прав потребителей",
        preview: "В Мировой суд судебного участка №123\n\nИстец: Сидоров Сидор Сидорович...",
      },
    },
  ]

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length)
  }

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length)
  }

  const example = examples[currentExample]

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
      id="examples"
      ref={sectionRef}
      className={`py-20 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Смотрите, как просто</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Реальные примеры того, как обычное описание превращается в юридический документ
          </p>
        </div>

        <div className="relative">
          {/* Навигация */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" size="icon" onClick={prevExample} className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {examples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentExample(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentExample ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextExample} className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Пример */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Что написал пользователь */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Что написал пользователь</h3>
                </div>
                <Badge variant="secondary" className="mb-4">
                  {example.tag}
                </Badge>
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-700 leading-relaxed italic">"{example.userInput}"</p>
                </div>
              </CardContent>
            </Card>

            {/* Что получил */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Что получил</h3>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-inner">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600 mb-2">{example.result.court}</div>
                    <h4 className="text-lg font-bold text-gray-900">{example.result.title}</h4>
                    <div className="text-sm text-gray-600">{example.result.subtitle}</div>
                  </div>
                  <div className="border-t pt-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{example.result.preview}</pre>
                    <div className="text-center mt-4">
                      <Button variant="outline" size="sm">
                        Смотреть полный документ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Заголовок примера */}
          <div className="text-center mt-8">
            <h3 className="text-2xl font-bold text-gray-900">{example.title}</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
