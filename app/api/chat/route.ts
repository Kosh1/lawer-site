import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "o4-mini",
      messages: [
        {
          role: "system",
          content: "Вы - опытный юрист, который помогает людям составлять исковые заявления. Отвечайте кратко и по существу, используя юридическую терминологию."
        },
        ...messages
      ],
    })

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 