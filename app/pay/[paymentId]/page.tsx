'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, CreditCard, Loader2 } from 'lucide-react'
import { loadCloudPaymentsScript, openCloudPaymentsWidget } from '@/lib/cloudpayments'
import type { Payment } from '@/lib/types'

type PaymentStatus = 'loading' | 'ready' | 'processing' | 'success' | 'error'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params.paymentId as string
  
  const [payment, setPayment] = useState<Payment | null>(null)
  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  // Загружаем данные о платеже
  useEffect(() => {
    if (!paymentId) return

    fetch(`/api/payments/${paymentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
          setStatus('error')
        } else {
          setPayment(data)
          if (data.status === 'succeeded') {
            setStatus('success')
          } else {
            setStatus('ready')
          }
        }
      })
      .catch(err => {
        console.error('Error loading payment:', err)
        setError('Не удалось загрузить данные о платеже')
        setStatus('error')
      })
  }, [paymentId])

  // Загружаем скрипт CloudPayments
  useEffect(() => {
    if (status === 'ready') {
      loadCloudPaymentsScript().catch(err => {
        console.error('Error loading CloudPayments script:', err)
        setError('Не удалось загрузить платежную систему')
        setStatus('error')
      })
    }
  }, [status])

  const handlePayment = async () => {
    if (!payment) return

    const publicId = process.env.NEXT_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID
    if (!publicId) {
      setError('Платежная система не настроена. Проверьте переменную NEXT_PUBLIC_CLOUDPAYMENTS_PUBLIC_ID.')
      return
    }

    setStatus('processing')

    try {
      openCloudPaymentsWidget({
        publicId,
        amount: payment.amount,
        currency: payment.currency,
        invoiceId: payment.id,
        description: payment.description || 'Юридическая консультация',
        requireEmail: false,
        onSuccess: (options) => {
          console.log('Payment successful:', options)
          setStatus('success')
          // Через несколько секунд перенаправляем обратно в чат
          setTimeout(() => {
            window.close() // Если открыто в новой вкладке
          }, 3000)
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
      console.error('Error opening payment widget:', err)
      setError('Не удалось открыть форму оплаты')
      setStatus('ready')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Загрузка...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              Ошибка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="w-full mt-4"
            >
              Назад
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
              <div>Сумма: {payment?.amount} {payment?.currency}</div>
              <div>Описание: {payment?.description}</div>
            </div>
            <Button 
              onClick={() => window.close()} 
              className="w-full mt-4"
            >
              Закрыть
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
            Для продолжения работы с юридическим консультантом необходимо произвести оплату
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {payment && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Сумма:</span>
                <span className="font-medium">{payment.amount} {payment.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Описание:</span>
                <span className="font-medium">{payment.description}</span>
              </div>
            </div>
          )}
          
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handlePayment}
            disabled={status === 'processing'}
            className="w-full"
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
            onClick={() => router.back()} 
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