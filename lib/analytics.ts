// Константы для событий Яндекс.Метрики
export const YM_EVENTS = {
  // Показ предложения оплаты подборки дел
  SHOW_PAYMENT_OFFER: 'show_payment_offer',
  
  // Показ ссылки на оплату
  SHOW_PAY_LINK: 'show_pay_link',
  
  // Клик по ссылке оплаты
  CLICK_PAY_LINK: 'click_pay_link',
  
  // Начало диалога
  START_DIALOG: 'start_dialog',
  
  // Фокус на поле ввода
  FOCUS_MESSAGE_INPUT: 'focus_message_input'
} as const;

// ID счетчика Яндекс.Метрики
export const YM_COUNTER_ID = 102501372;

// Функция для отправки событий в Яндекс.Метрику
export function sendYMEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(YM_COUNTER_ID, 'reachGoal', eventName, params);
  }
}

// Функция для отправки событий с параметрами
export function trackPaymentOffer() {
  sendYMEvent(YM_EVENTS.SHOW_PAYMENT_OFFER);
}

export function trackShowPayLink() {
  sendYMEvent(YM_EVENTS.SHOW_PAY_LINK);
}

export function trackClickPayLink() {
  sendYMEvent(YM_EVENTS.CLICK_PAY_LINK);
}

export function trackStartDialog() {
  sendYMEvent(YM_EVENTS.START_DIALOG);
}

export function trackFocusMessageInput() {
  sendYMEvent(YM_EVENTS.FOCUS_MESSAGE_INPUT);
}
