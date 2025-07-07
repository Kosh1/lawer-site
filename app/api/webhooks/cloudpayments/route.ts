import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyCloudPaymentsSignature } from '@/lib/cloudpayments'

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

    // Парсим form-encoded данные
    const formData = new URLSearchParams(body)
    const webhookData: Record<string, any> = {}
    
    for (const [key, value] of formData.entries()) {
      switch (key) {
        case 'TransactionId':
        case 'Amount':
        case 'PaymentAmount':
        case 'ReasonCode':
        case 'ErrorCode':
          const numValue = parseFloat(value)
          webhookData[key] = !isNaN(numValue) ? numValue : value
          break
        case 'TestMode':
          webhookData[key] = value.toLowerCase() === 'true' || value === '1'
          break
        default:
          webhookData[key] = value
      }
    }
    
    console.log('CloudPayments check webhook received:', {
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

    // Обрабатываем как check уведомление - всегда отклоняем платеж
    console.log('Processing check notification for payment:', payment.id)
    
    // Обновляем статус платежа на failed
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
      console.error('Error updating payment status to failed:', updateError)
      return NextResponse.json({ code: 13 }, { status: 500 })
    }

    console.log('Payment marked as failed:', {
      paymentId: payment.id,
      sessionId: payment.session_id,
      transactionId: webhookData.TransactionId
    })
    
    // Возвращаем код ошибки 20 - "Отклонен по другим причинам"
    return NextResponse.json({ code: 20 })
    
  } catch (error) {
    console.error('Error processing CloudPayments webhook:', error)
    return NextResponse.json({ code: 13 }, { status: 500 })
  }
} 