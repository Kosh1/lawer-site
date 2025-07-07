import crypto from 'crypto'

export const PAYMENT_CONFIG = {
  amount: 1000, // 1000 рублей - захардкоженная сумма
  currency: 'RUB',
  description: 'Юридическая консультация',
} as const

/**
 * Проверяет подпись HMAC для webhook от CloudPayments
 */
export function verifyCloudPaymentsSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body, 'utf8')
      .digest('base64')
    
    return signature === expectedSignature
  } catch (error) {
    console.error('Error verifying CloudPayments signature:', error)
    return false
  }
}

/**
 * Генерирует URL для оплаты
 */
export function generatePaymentUrl(paymentId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/pay/${paymentId}`
}

/**
 * Загружает скрипт CloudPayments виджета
 */
export function loadCloudPaymentsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Проверяем, если скрипт уже загружен
    if (typeof window !== 'undefined' && window.cp) {
      resolve()
      return
    }

    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load CloudPayments script'))
    
    document.head.appendChild(script)
  })
}

/**
 * Параметры для CloudPayments виджета
 */
export interface CloudPaymentsWidgetOptions {
  publicId: string
  amount: number
  currency: string
  invoiceId: string
  description: string
  requireEmail?: boolean
  onSuccess?: (options: any) => void
  onFail?: (reason: string, options: any) => void
  onComplete?: (paymentResult: any, options: any) => void
}

/**
 * Открывает виджет CloudPayments
 */
export function openCloudPaymentsWidget(options: CloudPaymentsWidgetOptions): void {
  if (!window.cp) {
    throw new Error('CloudPayments script is not loaded')
  }

  const widgetOptions = {
    publicId: options.publicId,
    amount: options.amount,
    currency: options.currency,
    invoiceId: options.invoiceId,
    description: options.description,
    requireEmail: options.requireEmail ?? false,
    data: {
      myProp: 'myProp value'
    },
    configuration: {
      common: {
        successRedirectUrl: '', // Не используем редирект
        failRedirectUrl: '', // Не используем редирект
      }
    },
    onSuccess: options.onSuccess,
    onFail: options.onFail,
    onComplete: options.onComplete
  }

  window.cp.CloudPayments.pay('charge', widgetOptions)
}

// Расширяем глобальный объект Window для TypeScript
declare global {
  interface Window {
    cp?: {
      CloudPayments: {
        pay: (operation: string, options: any) => void
      }
    }
  }
} 