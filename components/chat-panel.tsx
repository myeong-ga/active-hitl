import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatPanelProps {
  className?: string
  onSendMessage: (message: string) => void
}

export function ChatPanel({ className, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  return (
    <div className={`w-full p-4 bg-gray-800 rounded-lg ${className}`}>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-gray-700 text-white border-gray-600"
        />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
          Send
        </Button>
      </form>
    </div>
  )
}

