"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Users } from "lucide-react"
import { ChatDialog } from "@/components/chat-dialog"
import { Card, CardContent } from "@/components/ui/card"

interface CTASectionProps {
  title: string
  subtitle: string
  buttonText: string
  placeholder: string
  utm?: Record<string, string>
}

export function CTASection({ title, subtitle, buttonText, placeholder, utm }: CTASectionProps) {
  const [situation, setSituation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!situation.trim()) return

    // Яндекс.Метрика — цель "start_dialog"
    if (typeof window !== "undefined" && (window as any).ym) {
      (window as any).ym(102501372, "reachGoal", "start_dialog");
    }

    setIsLoading(true)
    // Сразу открываем чат
    setIsChatOpen(true)
    setIsLoading(false)
  }

  return (
    <>
      <section
        id="cta"
        ref={sectionRef}
        className={`py-20 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-xl text-gray-700 mb-8">{subtitle}</p>

            {/* Социальное доказательство */}
            <div className="inline-flex items-center bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 text-blue-900">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">Прямо сейчас 23 человек создают исковые заявления</span>
            </div>
          </div>

          {/* Форма */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="cta-situation" className="block text-lg font-semibold text-gray-900 mb-3">
                  Расскажите о вашей семейной ситуации:
                </label>
                <Textarea
                  id="cta-situation"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  onFocus={() => {
                    if (typeof window !== "undefined" && (window as any).ym) {
                      (window as any).ym(102501372, "reachGoal", "focus_message_input");
                    }
                  }}
                  placeholder={placeholder}
                  className="min-h-[120px] text-base resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none rounded-xl bg-white text-gray-900"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !situation.trim()}
                className="w-full py-4 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl"
              >
                {isLoading ? "Открываем чат..." : buttonText}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={situation}
        utm={utm}
      />
    </>
  )
}
