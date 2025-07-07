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

    // Определяем тип уведомления
    const operationType = webhookData.OperationType?.toLowerCase()
    const status = webhookData.Status?.toLowerCase()
    
    if (operationType === 'payment' && status === 'declined') {
      // Это fail уведомление
      console.log('Processing fail notification:', {
        transactionId: webhookData.TransactionId,
        reasonCode: webhookData.ReasonCode,
        reason: webhookData.Reason
      })

      const errorMessage = `${webhookData.Reason || 'Payment failed'}`
      if (webhookData.CardType && webhookData.CardFirstSix && webhookData.CardLastFour) {
        errorMessage += ` | Card: ${webhookData.CardType} ${webhookData.CardFirstSix}****${webhookData.CardLastFour}`
      }

      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          cloudpayments_transaction_id: webhookData.TransactionId,
          error_code: webhookData.ReasonCode?.toString() || webhookData.ErrorCode?.toString(),
          error_message: errorMessage
        })
        .eq('id', payment.id)

      if (updateError) {
        console.error('Error updating payment status to failed:', updateError)
        return NextResponse.json({ code: 13 }, { status: 500 })
      }

      console.log('Payment failed:', {
        paymentId: payment.id,
        sessionId: payment.session_id,
        transactionId: webhookData.TransactionId,
        reason: webhookData.Reason
      })

    } else if ('PaymentAmount' in webhookData) {
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
    }

    // Возвращаем код успеха (0)
    return NextResponse.json({ code: 0 })
  } catch (error) {
    console.error('Error processing CloudPayments webhook:', error)
    return NextResponse.json({ code: 13 }, { status: 500 })
  }
} 