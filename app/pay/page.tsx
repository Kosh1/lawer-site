'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, CreditCard, Loader2 } from 'lucide-react'
import { loadCloudPaymentsScript, openCloudPaymentsWidget, PAYMENT_CONFIG } from '@/lib/cloudpayments'

type PaymentStatus = 'ready' | 'processing' | 'success' | 'error'

export default function StaticPaymentPage() {
  const router = useRouter()
  const [status, setStatus] = useState<PaymentStatus>('ready')
  const [error, setError] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  // Загружаем скрипт CloudPayments при загрузке страницы
  useEffect(() => {
    loadCloudPaymentsScript().catch(err => {
      console.error('Error loading CloudPayments script:', err)
      setError('Не удалось загрузить платежную систему')
      setStatus('error')
    })
  }, [])

  const handlePayment = async () => {
    const publicId = process.env.NEXT_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID
    if (!publicId) {
      setError('Платежная система не настроена. Проверьте переменную NEXT_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID.')
      return
    }

    setStatus('processing')
    setError(null)

    try {
      // Получаем sessionId из localStorage (если есть) или создаем новый
      let sessionId = localStorage.getItem('chat_session_id')
      
      if (!sessionId) {
        // Создаем новую сессию чата
        const sessionResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'Инициализация оплаты' }]
          })
        })

        if (!sessionResponse.ok) {
          throw new Error('Не удалось создать сессию')
        }

        const sessionData = await sessionResponse.json()
        sessionId = sessionData.sessionId
        
        if (sessionId) {
          localStorage.setItem('chat_session_id', sessionId)
        }
      }

      // Создаем платеж
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          amount: PAYMENT_CONFIG.amount,
          description: PAYMENT_CONFIG.description
        })
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || 'Не удалось создать платеж')
      }

      const paymentData = await paymentResponse.json()
      setPaymentId(paymentData.paymentId)

      // Открываем виджет CloudPayments
      openCloudPaymentsWidget({
        publicId,
        amount: PAYMENT_CONFIG.amount,
        currency: PAYMENT_CONFIG.currency,
        invoiceId: paymentData.paymentId,
        description: PAYMENT_CONFIG.description,
        requireEmail: false,
        onSuccess: (options) => {
          console.log('Payment successful:', options)
          setStatus('success')
        },
        onFail: (reason, options) => {
          console.error('Payment failed:', reason, options)
          setError(`Ошибка оплаты: ${reason}`)
          setStatus('ready')
        },
        onComplete: (paymentResult, options) => {
          console.log('Payment completed:', paymentResult, options)
          if (paymentResult.success) {
            setStatus('success')
          }
        }
      })
    } catch (err) {
      console.error('Error processing payment:', err)
      setError(err instanceof Error ? err.message : 'Произошла ошибка при обработке платежа')
      setStatus('ready')
    }
  }

  if (status === 'error' && error?.includes('платежную систему')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              Ошибка настройки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => router.push('/')} 
              variant="outline" 
              className="w-full mt-4"
            >
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              Оплата успешна!
            </CardTitle>
            <CardDescription>
              Спасибо за оплату. Ваша консультация оплачена.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Сумма: {PAYMENT_CONFIG.amount} {PAYMENT_CONFIG.currency}</div>
              <div>Описание: {PAYMENT_CONFIG.description}</div>
              {paymentId && <div className="text-xs">ID платежа: {paymentId.slice(0, 8)}...</div>}
            </div>
            <Button 
              onClick={() => router.push('/')} 
              className="w-full mt-4"
            >
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Оплата консультации
          </CardTitle>
          <CardDescription>
            Для получения юридической консультации необходимо произвести оплату
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Сумма:</span>
              <span className="font-medium">{PAYMENT_CONFIG.amount} {PAYMENT_CONFIG.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Описание:</span>
              <span className="font-medium">{PAYMENT_CONFIG.description}</span>
            </div>
          </div>
          
          {error && !error.includes('платежную систему') && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handlePayment}
            disabled={status === 'processing'}
            className="w-full"
            size="lg"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Обработка...
              </>
            ) : (
              'Оплатить'
            )}
          </Button>



          <Button 
            onClick={() => router.push('/')} 
            variant="outline" 
            className="w-full"
          >
            Отмена
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 