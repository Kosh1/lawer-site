import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyCloudPaymentsSignature } from '@/lib/cloudpayments'
import type { CloudPaymentsCheckRequest, CloudPaymentsPayRequest } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('Content-HMAC') || ''
    
    // Проверяем переменные окружения
    const apiSecret = process.env.CLOUDPAYMENTS_API_SECRET
    if (!apiSecret) {
      console.error('CLOUDPAYMENTS_API_SECRET is not configured')
      return NextResponse.json({ code: 13 }, { status: 400 })
    }

    // Проверяем подпись запроса
    if (!verifyCloudPaymentsSignature(body, signature, apiSecret)) {
      console.error('Invalid CloudPayments webhook signature')
      return NextResponse.json({ code: 13 }, { status: 400 })
    }

    // Парсим данные webhook'а
    const webhookData: CloudPaymentsCheckRequest | CloudPaymentsPayRequest = JSON.parse(body)
    
    console.log('CloudPayments webhook received:', {
      transactionId: webhookData.TransactionId,
      invoiceId: webhookData.InvoiceId,
      amount: webhookData.Amount,
      testMode: webhookData.TestMode
    })

    // Проверяем, что это платеж с нашим InvoiceId
    if (!webhookData.InvoiceId) {
      console.error('Missing InvoiceId in webhook data')
      return NextResponse.json({ code: 11 }, { status: 400 })
    }

    // Ищем платеж в базе данных
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', webhookData.InvoiceId)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', webhookData.InvoiceId)
      return NextResponse.json({ code: 11 }, { status: 400 })
    }

    // Определяем тип уведомления по наличию PaymentAmount
    const isPayNotification = 'PaymentAmount' in webhookData

    if (isPayNotification) {
      // Это уведомление об успешной оплате
      const payData = webhookData as CloudPaymentsPayRequest
      
      // Обновляем статус платежа
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          cloudpayments_transaction_id: payData.TransactionId
        })
        .eq('id', payment.id)

      if (updateError) {
        console.error('Error updating payment status:', updateError)
        return NextResponse.json({ code: 13 }, { status: 500 })
      }

      console.log('Payment succeeded:', {
        paymentId: payment.id,
        sessionId: payment.session_id,
        transactionId: payData.TransactionId
      })
    } else {
      // Это check уведомление - проверяем возможность платежа
      console.log('Check notification received for payment:', payment.id)
      
      // Обновляем статус платежа на failed при возврате ошибки
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          cloudpayments_transaction_id: webhookData.TransactionId,
          error_code: '20',
          error_message: 'Отклонен по другим причинам (тестовая ошибка check)'
        })
        .eq('id', payment.id)

      if (updateError) {
        console.error('Error updating payment status to failed on check:', updateError)
        return NextResponse.json({ code: 13 }, { status: 500 })
      }

      console.log('Payment marked as failed on check:', {
        paymentId: payment.id,
        sessionId: payment.session_id,
        transactionId: webhookData.TransactionId
      })
      
      return NextResponse.json({ code: 20 })
    }

    // Возвращаем код успеха (0)
    return NextResponse.json({ code: 0 })
  } catch (error) {
    console.error('Error processing CloudPayments webhook:', error)
    return NextResponse.json({ code: 13 }, { status: 500 })
  }
} 