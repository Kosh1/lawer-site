import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generatePaymentUrl, PAYMENT_CONFIG } from '@/lib/cloudpayments'
import type { CreatePaymentRequest, CreatePaymentResponse } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const body: CreatePaymentRequest = await req.json()
    
    // Валидация входных данных
    if (!body.sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    // Проверяем, что сессия существует
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', body.sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Проверяем, нет ли уже успешного платежа для этой сессии
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status')
      .eq('session_id', body.sessionId)
      .eq('status', 'succeeded')
      .single()

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment already completed for this session' },
        { status: 409 }
      )
    }

    // Создаем новый платеж
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          session_id: body.sessionId,
          amount: body.amount || PAYMENT_CONFIG.amount,
          currency: PAYMENT_CONFIG.currency,
          description: body.description || PAYMENT_CONFIG.description,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (paymentError || !payment) {
      console.error('Error creating payment:', paymentError)
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      )
    }

    // Генерируем URL для оплаты
    const paymentUrl = generatePaymentUrl(payment.id)

    const response: CreatePaymentResponse = {
      paymentId: payment.id,
      paymentUrl
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in payments API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 