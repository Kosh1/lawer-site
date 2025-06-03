import { NextResponse } from 'next/server'
import OpenAI from 'openai'
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
    const { messages, sessionId } = await req.json()

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      )
    }

    // Форматируем сообщения для API
    const formattedMessages = [
      {
        role: "system",
        content: LAWYER_PROMPT
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    console.log('Sending request to OpenAI with messages:', formattedMessages)

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 5000,
    })

    if (!completion.choices[0]?.message?.content) {
      console.error('No response content from OpenAI')
      throw new Error('No response from OpenAI')
    }

    console.log('Received response from OpenAI:', completion.choices[0].message.content)

    const assistantMessage = completion.choices[0].message.content
    const lastUserMessage = messages[messages.length - 1]
    
    // Если это первое сообщение, создаем новую сессию
    if (!sessionId) {
      const newSessionId = uuidv4()
      
      // Создаем сессию
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          id: newSessionId,
          initial_message: lastUserMessage.content,
        })

      if (sessionError) {
        console.error('Error creating session:', sessionError)
        throw sessionError
      }

      // Сохраняем сообщения
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: newSessionId,
            role: 'user',
            content: lastUserMessage.content,
          },
          {
            session_id: newSessionId,
            role: 'assistant',
            content: assistantMessage,
          },
        ])

      if (messagesError) {
        console.error('Error saving messages:', messagesError)
        throw messagesError
      }

      return NextResponse.json({ 
        message: assistantMessage,
        sessionId: newSessionId
      })
    }

    // Если сессия уже существует, сохраняем только новые сообщения
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: sessionId,
          role: 'user',
          content: lastUserMessage.content,
        },
        {
          session_id: sessionId,
          role: 'assistant',
          content: assistantMessage,
        },
      ])

    if (messagesError) {
      console.error('Error saving messages:', messagesError)
      throw messagesError
    }

    return NextResponse.json({ 
      message: assistantMessage,
      sessionId
    })
  } catch (error) {
    console.error('Detailed error in chat API:', error)
    
    // Более информативный ответ об ошибке
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 