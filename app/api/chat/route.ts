import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { LAWYER_PROMPT } from '@/lib/prompts'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 