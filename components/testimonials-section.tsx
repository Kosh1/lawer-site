"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const testimonials = [
    {
      id: 1,
      name: "Марина К.",
      city: "Москва",
      result: "Взыскала +13,000₽ к алиментам",
      rating: 5,
      text: "Муж 2 года не платил нормальные алименты, говорил что у него маленькая зарплата. Через ваш сервис за 3 минуты составила иск. Суд обязал его платить 18,000₽ вместо 5,000₽. Дочь наконец-то может ходить на танцы!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "Алексей П, отец",
      city: "СПб",
      result: "Отстоял право видеться с детьми",
      rating: 5,
      text: "Жена при разводе хотела оставить меня ни с чем и ограничить общение с детьми. Составил иск через ваш сайт, подал в суд. Теперь дети живут со мной через выходные, а имущество разделили справедливо.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "Ольга М",
      city: "Казань",
      result: "Сэкономила 12,000₽ на юристе",
      rating: 5,
      text: "Боялась подавать на алименты, думала будет сложно и дорого. Здесь за пару минут получила готовый иск. Подала в суд сама - бывший муж теперь платит как положено по закону!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  // Автопрокрутка
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const nextTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`py-20 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">15,000 людей уже решили свои проблемы</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Реальные отзывы от людей, которые выиграли дела благодаря нашему сервису
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Навигация */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrentTestimonial(index)
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Отзыв */}
          <Card className="transition-all duration-500 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              {/* Звезды */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Текст отзыва */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold">
                    {testimonials[currentTestimonial].name[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-gray-600">{testimonials[currentTestimonial].city}</div>
                  </div>
                </div>
                <p className="text-gray-900">{testimonials[currentTestimonial].text}</p>
              </div>

              {/* Результат */}
              <div className="mt-6 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                {testimonials[currentTestimonial].result}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
