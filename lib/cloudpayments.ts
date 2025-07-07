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
    if (typeof window !== 'undefined' && window.cp?.CloudPayments) {
      resolve()
      return
    }

    if (typeof window === 'undefined') {
      reject(new Error('Window is not available'))
      return
    }

    // Ждем загрузки скрипта если он уже добавлен в head
    const existingScript = document.querySelector('script[src="https://widget.cloudpayments.ru/bundles/cloudpayments.js"]')
    if (existingScript) {
      // Скрипт уже добавлен, ждем загрузки
      const checkLoaded = () => {
        if (window.cp?.CloudPayments) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    // Добавляем скрипт динамически, если его нет
    const script = document.createElement('script')
    script.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments.js'
    script.async = true
    script.onload = () => {
      const checkLoaded = () => {
        if (window.cp?.CloudPayments) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
    }
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
  if (!window.cp?.CloudPayments) {
    throw new Error('CloudPayments script is not loaded')
  }

  // Создаем экземпляр CloudPayments виджета
  const widget = new window.cp.CloudPayments({ language: 'ru-RU' })

  const paymentOptions = {
    publicId: options.publicId,
    amount: options.amount,
    currency: options.currency,
    invoiceId: options.invoiceId,
    description: options.description,
    requireEmail: options.requireEmail ?? false,
    skin: "modern" as const,
    data: {
      myProp: 'myProp value'
    },
    configuration: {
      common: {
        successRedirectUrl: '',
        failRedirectUrl: '',
      }
    }
  }

  // Используем charge метод вместо pay
  widget.charge(
    paymentOptions,
    // Callbacks как отдельные аргументы
    (cpOptions) => {
      console.log('CloudPayments onSuccess callback:', cpOptions)
      options.onSuccess?.(cpOptions)
    },
    (reason, cpOptions) => {
      console.error('CloudPayments onFail callback:', reason, cpOptions)
      options.onFail?.(reason, cpOptions)
    },
    (paymentResult, cpOptions) => {
      console.log('CloudPayments onComplete callback:', paymentResult, cpOptions)
      options.onComplete?.(paymentResult, cpOptions)
    }
  )
}

// Обновляем глобальные типы для правильного API
declare global {
  interface Window {
    cp?: {
      CloudPayments: new (options?: { language?: string }) => {
        charge: (
          options: {
            publicId: string
            description: string
            amount: number
            currency: string
            accountId?: string
            invoiceId?: string
            email?: string
            skin?: "classic" | "modern" | "mini"
            requireEmail?: boolean
            data?: Record<string, any>
            configuration?: Record<string, any>
            payer?: Record<string, any>
            autoClose?: number
          },
          onSuccess: (options: any) => void,
          onFail: (reason: string, options: any) => void,
          onComplete?: (paymentResult: any, options: any) => void
        ) => void
      }
    }
  }
} 