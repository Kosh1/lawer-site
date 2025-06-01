"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LAWYER_PROMPT } from "@/lib/prompts"

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
  initialMessage: string
}

export function ChatDialog({ isOpen, onClose, initialMessage }: ChatDialogProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Инициализируем чат с первым сообщением пользователя при открытии диалога
  React.useEffect(() => {
    if (isOpen && initialMessage) {
      setMessages([
        { role: 'user', content: initialMessage }
      ])
      // Автоматически отправляем первое сообщение
      handleInitialMessage(initialMessage)
    }
  }, [isOpen, initialMessage])

  const handleInitialMessage = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: LAWYER_PROMPT },
            { role: 'user', content: message }
          ]
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: LAWYER_PROMPT },
            ...messages,
            { role: 'user', content: userMessage }
          ]
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Чат с ИИ-юристом</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите ваше сообщение..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Отправка..." : "Отправить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 