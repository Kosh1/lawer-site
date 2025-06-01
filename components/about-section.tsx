"use client"

import { useState, useEffect } from "react"

export function AboutSection() {
  const [documentsCount, setDocumentsCount] = useState(0)

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

  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">О сервисе ИскИИ</h2>
        <p className="text-xl text-gray-700 mb-8">
          ИскИИ — это сервис, который помогает составить исковое заявление с помощью искусственного интеллекта
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="text-3xl font-bold text-gray-900">{documentsCount.toLocaleString()}</div>
            <div className="text-gray-600">созданных документов</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="text-3xl font-bold text-gray-900">0₽</div>
            <div className="text-gray-600">без скрытых платежей</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <div className="text-3xl font-bold text-gray-900">100%</div>
            <div className="text-gray-600">документы соответствуют закону</div>
          </div>
        </div>
      </div>
    </section>
  )
} 