"use client"

import { useState, useEffect, useCallback ,useRef, FormEvent} from "react"
import { LeftPanel } from "@/components/left-panel"
import { CenterVisualization } from "@/components/center-visualization"
import { RightPanel } from "@/components/right-panel"


import { Message, useChat } from '@ai-sdk/react';

import { APPROVAL, getToolsRequiringConfirmation } from "./api/use-chat-human-in-the-loop/utils"
import { tools } from "./api/use-chat-human-in-the-loop/tools"

const generateNewActivities = () => {
  const types = ["Issue", "Push", "Create", "Fork", "Download"]
  const colors = ["#00ffcc", "#8844ff", "#ff44aa", "#ff4444", "#ff8844"]
  return types.map((type, index) => ({
    type,
    count: Math.floor(Math.random() * 50) + 1,
    color: colors[index],
    timestamp: Date.now(),
  }))
}
    
const generateNewDataStream = () => {
  return [{ id: Date.now(), value: Math.random() * 100 }]
}

type DataType = {
  forkedProjects: number;
  trendingDevelopers: never[];
  activities: {
      type: string;
      count: number;
      color: string;
      timestamp: number;
  }[];
}
export default function Dashboard() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [data, setData]  = useState<DataType>({
    forkedProjects: 204,
    trendingDevelopers: [],
    activities: generateNewActivities(),
    // dataStream: [],
  })
  const [isMessageUpdated, setIsMessageUpdated] = useState(false)
  const [intervalSpeed, setIntervalSpeed] = useState(1000)
  const [totalInput, setTotalInput] = useState(0) // Updated initial value
  const [totalOutput, setTotalOutput] = useState(0) // Updated initial value
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      api: '/api/use-chat-human-in-the-loop',
      maxSteps: 5,
    });
    const updateData = useCallback(() => {
      setData((prev) => ({
        ...prev,
        activities: generateNewActivities(),
        dataStream: generateNewDataStream()
      }))
    }, [])
    useEffect(() => {
      const interval = setInterval(updateData, intervalSpeed)
      return () => clearInterval(interval)
    }, [intervalSpeed, updateData])

  useEffect(() => {
    if (isMessageUpdated) {
      setIntervalSpeed(333) // 3배 빠른 속도 (1000ms / 3)
      const timer = setTimeout(() => {
        setIsMessageUpdated(false)
        setIntervalSpeed(1000) // 원래 속도로 복귀
      }, 9000) // 6초 후에 모션 속도를 낮춤

      return () => clearTimeout(timer)
    }
  }, [isMessageUpdated])
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault() // 기본 폼 제출 동작 방지

    setIsMessageUpdated(true)
    setTotalInput((prev) => prev + 2234) // Updated increment value
    setTotalOutput((prev) => prev + 1234) // Updated increment value
    handleSubmit(e) 
  }


  const toolsRequiringConfirmation = getToolsRequiringConfirmation(tools);

  const pendingToolCallConfirmation = messages.some((m: Message) =>
    m.parts?.some(
      part =>
        part.type === 'tool-invocation' &&
        part.toolInvocation.state === 'call' &&
        toolsRequiringConfirmation.includes(part.toolInvocation.toolName),
    ),
  );

  return (
    <div className="relative w-full h-screen bg-[#000510] text-gray-300 overflow-hidden font-mono">
      <div className="grid grid-cols-[300px_1fr_300px]  h-full gap-4 p-4">
        <div className="overflow-y-auto h-full">
          <LeftPanel
            forkedProjects={data.forkedProjects}
            trendingDevelopers={data.trendingDevelopers}
            activities={data.activities}
            isMessageUpdated={isMessageUpdated}
            totalInput={totalInput}  // Add this prop
            totalOutput={totalOutput}  // Add this prop
          />
        </div>
        <div className="flex flex-col w-full max-w-md mx-auto h-full relative overflow-hidden">
          <div className="flex-1 overflow-y-auto pb-16">
            {messages?.map((m: Message) => (
              <div key={m.id} className="whitespace-pre-wrap">
                <strong>{`${m.role}: `}</strong>
                {m.parts?.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={i}>{part.text}</div>;
                    case 'tool-invocation':
                      const toolInvocation = part.toolInvocation;
                      const toolCallId = toolInvocation.toolCallId;
                      const dynamicInfoStyles = 'font-mono bg-gray-100 p-1 text-sm';

                      // render confirmation tool (client-side tool with user interaction)
                      if (
                        toolsRequiringConfirmation.includes(
                          toolInvocation.toolName,
                        ) &&
                        toolInvocation.state === 'call'
                      ) {
                        return (
                          <div key={toolCallId} className="text-gray-500">
                            Run{' '}
                            <span className={dynamicInfoStyles}>
                              {toolInvocation.toolName}
                            </span>{' '}
                            with args:{' '}
                            <span className={dynamicInfoStyles}>
                              {JSON.stringify(toolInvocation.args)}
                            </span>
                            <div className="flex gap-2 pt-2">
                              <button
                                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                                onClick={() =>
                                  addToolResult({
                                    toolCallId,
                                    result: APPROVAL.YES,
                                  })
                                }
                              >
                                Yes
                              </button>
                              <button
                                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                                onClick={() =>
                                  addToolResult({
                                    toolCallId,
                                    result: APPROVAL.NO,
                                  })
                                }
                              >
                                No
                              </button>
                            </div>
                          </div>
                        );
                      }
                  }
                })}
              <br />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="absolute bottom-0 w-full mb-8">
            <input
              disabled={pendingToolCallConfirmation}
              className="w-full p-2 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
        </div>
        <div className="overflow-y-auto h-full">
            <RightPanel />
        </div>
      </div>
    </div>
  );
}

