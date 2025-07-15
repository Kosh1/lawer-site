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

    // --- Описание функции для function calling ---
    const functions = [
      {
        name: "save_phone",
        description: "Сохраняет номер телефона и время для звонка юриста",
        parameters: {
          type: "object",
          properties: {
            phone: { type: "string", description: "Номер телефона пользователя" },
            call_time: { type: "string", description: "Удобное время для звонка" }
          },
          required: ["phone", "call_time"]
        }
      }
    ];

    // Форматируем сообщения для OpenAI
    const formattedMessages = [
      { role: "system", content: LAWYER_PROMPT },
      ...messages
    ];

    console.log('Sending request to OpenAI with messages:', formattedMessages)

    // --- Вызов OpenAI с поддержкой function_call ---
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1", 
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2000,
      functions,
      function_call: "auto"
    });

    const choice = completion.choices[0];
    let assistantMessage = choice.message?.content || '';
    let functionCall = choice.message?.function_call;

    let currentSessionId = sessionId;

    // Создаем новую сессию только если её нет
    if (!currentSessionId) {
      const newSessionId = uuidv4();
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .insert([
          {
            id: newSessionId,
            initial_message: messages[0].content,
            created_at: new Date().toISOString(),
          },
        ]);
      if (sessionError) {
        console.error('Error creating session:', sessionError);
      } else {
        currentSessionId = newSessionId;
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
        ]);
      if (messageError) {
        console.error('Error saving messages:', messageError);
      }

      // --- Обработка function_call save_phone ---
      if (functionCall && functionCall.name === "save_phone") {
        try {
          const args = JSON.parse(functionCall.arguments || '{}');
          if (args.phone && args.call_time) {
            // Проверяем, нет ли уже такой заявки для этой сессии
            const { data: existing, error: selectError } = await supabase
              .from('call_requests')
              .select('id')
              .eq('session_id', currentSessionId)
              .eq('phone', args.phone)
              .eq('call_time', args.call_time)
              .maybeSingle();
            if (!existing && !selectError) {
              const { error: callError } = await supabase
                .from('call_requests')
                .insert([
                  {
                    id: uuidv4(),
                    session_id: currentSessionId,
                    phone: args.phone,
                    call_time: args.call_time,
                    created_at: new Date().toISOString(),
                  },
                ]);
              if (callError) {
                console.error('Error saving call request:', callError);
              }
            }
          }
        } catch (e) {
          console.error('Error parsing function_call arguments:', e);
        }
      }
      // --- конец блока ---
    }

    // Если ассистент не вернул текст, но был вызван function_call — верните свой текст
    if (!assistantMessage && functionCall && functionCall.name === "save_phone") {
      assistantMessage = "Спасибо! Я записал ваш номер телефона и время для звонка. Юрист свяжется с вами в указанное время.";
    }

    return NextResponse.json({ 
      message: assistantMessage,
      sessionId: currentSessionId
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 