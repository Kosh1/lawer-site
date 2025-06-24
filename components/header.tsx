"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Scale, Menu, X } from "lucide-react"
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import Head from "next/head"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ИскИИ
          </span>
          {/* Theme toggle */}
          <button
            className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Переключить тему"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Как работает
          </button>
          <button
            onClick={() => scrollToSection("examples")}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Примеры
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Отзывы
          </button>
          <Button
            onClick={() => scrollToSection("hero-form")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Создать документ
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg md:hidden">
            <nav className="flex flex-col p-4 space-y-4">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-gray-600 hover:text-blue-600 transition-colors"
              >
                Как работает
              </button>
              <button
                onClick={() => scrollToSection("examples")}
                className="text-left text-gray-600 hover:text-blue-600 transition-colors"
              >
                Примеры
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-left text-gray-600 hover:text-blue-600 transition-colors"
              >
                Отзывы
              </button>
              <Button
                onClick={() => scrollToSection("hero-form")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Создать документ
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
