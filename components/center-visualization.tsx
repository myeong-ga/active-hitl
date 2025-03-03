import type { Message } from "@/types"

interface CenterVisualizationProps {
  messages: Message[]
}

export function CenterVisualization({ messages }: CenterVisualizationProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 bg-gray-900">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 p-2 rounded ${message.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"} max-w-[70%]`}
        >
          <p className="text-white">{message.content}</p>
          <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  )
}

