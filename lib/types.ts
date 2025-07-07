export interface ChatSession {
  id: string
  created_at: string
  initial_message: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// Типы для платежной системы
export interface Payment {
  id: string
  session_id: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
  cloudpayments_transaction_id?: number | null
  description?: string | null
  created_at: string
  updated_at: string
}

export interface CreatePaymentRequest {
  sessionId: string
  amount: number
  description?: string
}

export interface CreatePaymentResponse {
  paymentId: string
  paymentUrl: string
}

// Типы для CloudPayments webhook
export interface CloudPaymentsWebhookData {
  TransactionId: number
  Amount: number
  Currency: string
  InvoiceId: string
  Status: string
  PaymentAmount?: number
  PaymentCurrency?: string
  DateTime: string
  CardFirstSix?: string
  CardLastFour?: string
  CardType?: string
  CardExpDate?: string
  TestMode: number
  OperationType?: string
}

export interface CloudPaymentsCheckRequest {
  TransactionId: number
  Amount: number
  Currency: string
  InvoiceId: string
  AccountId?: string
  Email?: string
  DateTime: string
  IpAddress?: string
  TestMode: number
}

export interface CloudPaymentsPayRequest extends CloudPaymentsCheckRequest {
  PaymentAmount: number
  PaymentCurrency: string
  CardFirstSix: string
  CardLastFour: string
  CardType: string
  CardExpDate: string
} 