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