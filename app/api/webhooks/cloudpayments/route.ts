import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyCloudPaymentsSignature } from '@/lib/cloudpayments'
import type { 
  CloudPaymentsCheckRequest, 
  CloudPaymentsPayRequest, 
  CloudPaymentsFailRequest,
  CloudPaymentsWebhookData 
} from '@/lib/types'

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
    
    console.log('CloudPayments webhook received:', {
      transactionId: webhookData.TransactionId,
      invoiceId: webhookData.InvoiceId,
      amount: webhookData.Amount,
      status: webhookData.Status,
      operationType: webhookData.OperationType,
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

    // Определяем тип уведомления по URL параметрам или содержимому
    const url = new URL(req.url)
    const notificationType = url.searchParams.get('type')
    
    // Если тип явно указан в URL, используем его
    if (notificationType === 'check') {
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
        return NextResponse.json({ code: 14 }, { status: 500 })
      }

      console.log('Payment marked as failed on check:', {
        paymentId: payment.id,
        sessionId: payment.session_id,
        transactionId: webhookData.TransactionId
      })
      
      return NextResponse.json({ code: 20 })
    }
    
    // Если тип не указан, определяем по содержимому
    // Check уведомление отличается от Pay тем, что приходит ДО попытки списания
    // В нашем случае, если Status не "Completed", это check
    const status = webhookData.Status?.toLowerCase()
    
    if (!status || status !== 'completed') {
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
        return NextResponse.json({ code: 14 }, { status: 500 })
      }

      console.log('Payment marked as failed on check:', {
        paymentId: payment.id,
        sessionId: payment.session_id,
        transactionId: webhookData.TransactionId
      })
      
      return NextResponse.json({ code: 20 })
    } else {
      // Это уведомление об успешной оплате (Status = "Completed")
      console.log('Pay notification received for payment:', payment.id)
      
      // Обновляем статус платежа
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          cloudpayments_transaction_id: webhookData.TransactionId
        })
        .eq('id', payment.id)

      if (updateError) {
        console.error('Error updating payment status:', updateError)
        return NextResponse.json({ code: 12 }, { status: 500 })
      }

      console.log('Payment succeeded:', {
        paymentId: payment.id,
        sessionId: payment.session_id,
        transactionId: webhookData.TransactionId
      })
    }

    // Возвращаем код успеха (0)
    return NextResponse.json({ code: 0 })
  } catch (error) {
    console.error('Error processing CloudPayments webhook:', error)
    return NextResponse.json({ code: 15 }, { status: 500 })
  }
} 