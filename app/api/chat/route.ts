import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { LAWYER_PROMPT } from '@/lib/prompts'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured")
    }

    const { messages, sessionId } = await req.json()

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      )
    }

    // Форматируем сообщения для OpenAI
    const formattedMessages = [
      { role: "system", content: LAWYER_PROMPT },
      ...messages
    ]

    console.log('Sending request to OpenAI with messages:', formattedMessages)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2000,
    })

    const assistantMessage = completion.choices[0]?.message?.content || ''

    let currentSessionId = sessionId

    // Создаем новую сессию только если её нет
    if (!currentSessionId) {
      const newSessionId = uuidv4() // Генерируем уникальный ID для сессии
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .insert([
          {
            id: newSessionId, // Используем сгенерированный ID
            initial_message: messages[0].content,
            created_at: new Date().toISOString(),
          },
        ])

      if (sessionError) {
        console.error('Error creating session:', sessionError)
      } else {
        currentSessionId = newSessionId
      }
    }

    // Сохраняем сообщения в базу данных
    if (currentSessionId) {
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: currentSessionId,
            role: 'user',
            content: messages[messages.length - 1].content,
            created_at: new Date().toISOString(),
          },
          {
            session_id: currentSessionId,
            role: 'assistant',
            content: assistantMessage,
            created_at: new Date().toISOString(),
          },
        ])

      if (messageError) {
        console.error('Error saving messages:', messageError)
      }
    }

    return NextResponse.json({ 
      message: assistantMessage,
      sessionId: currentSessionId // Возвращаем sessionId клиенту
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
} 