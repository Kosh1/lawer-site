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
      name: "Михаил К.",
      city: "Москва",
      result: "Взыскал 150,000₽",
      rating: 5,
      text: "За 2 минуты получил иск на возврат долга. Подал в суд - выиграл дело! Сэкономил 10 тысяч на юристе",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "Анна С.",
      city: "СПб",
      result: "Получила компенсацию",
      rating: 5,
      text: "Соседи затопили, думала придется нанимать юриста. Сделала иск здесь бесплатно, суд удовлетворил все требования!",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "Игорь П.",
      city: "Казань",
      result: "Вернул зарплату",
      rating: 5,
      text: "Работодатель не выплатил зарплату. Иск составился автоматически, добавил только даты. Деньги вернули через месяц",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 4,
      name: "Елена М.",
      city: "Новосибирск",
      result: "Обменяла товар",
      rating: 5,
      text: "Магазин отказывался менять бракованный товар. Благодаря иску решила вопрос за неделю",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 5,
      name: "Светлана В.",
      city: "Екатеринбург",
      result: "Взыскала долг",
      rating: 5,
      text: "Очень удобно! Иск составился за минуту, отправила в суд — выиграла дело. Спасибо сервису!",
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 6,
      name: "Артём Д.",
      city: "Ростов-на-Дону",
      result: "Вернул деньги за товар",
      rating: 5,
      text: "Не ожидал, что всё так просто. Иск приняли без вопросов, деньги вернули через две недели.",
      avatar: "/placeholder-user.jpg",
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
              <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              {/* Автор */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-gray-600">{testimonials[currentTestimonial].city}</div>
                </div>
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
