"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { legalAssistantPrompt } from "@/lib/prompts"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatDialogProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

export function ChatDialog({ isOpen, onClose, initialMessage }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Автоматическая отправка начального сообщения
  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage)
    }
  }, [isOpen, initialMessage])

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Обработка нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        handleSendMessage(input)
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const newMessage: Message = { role: "user", content }
    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          prompt: legalAssistantPrompt
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Юридический ассистент</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg",
                message.role === "user"
                  ? "bg-blue-50 ml-12"
                  : "bg-gray-50 mr-12 border border-gray-200"
              )}
            >
              {message.role === "user" ? (
                <User className="w-6 h-6 text-blue-600 mt-1" />
              ) : (
                <Bot className="w-6 h-6 text-gray-600 mt-1" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {message.role === "user" ? "Вы" : "Юридический ассистент"}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите ваше сообщение..."
              className="min-h-[60px] resize-none border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white text-gray-900"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 