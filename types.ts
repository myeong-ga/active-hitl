export interface ActivityData {
  type: string
  count: number
  color: string
}

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

