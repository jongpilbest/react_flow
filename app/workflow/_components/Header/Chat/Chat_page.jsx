"use client"

import { useChat } from "@ai-sdk/react"
import { useCompletion } from '@ai-sdk/react';

import { CircleCheck } from "lucide-react";
import {SendIcon} from 'lucide-react'
import { useEffect } from "react"
function ChatDemo() {
  //const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
  //  api:'/api/workflow'
  //})
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
  useChat({api:'/api/workflow'});

  return (
    <div className="h-full flex flex-col mx-4">
      {/* 파랑색 박스 - flex-grow를 9로 설정 */}
      <div className="flex-grow-[9] w-full  flex-col  flex items-center justify-center">
        
      {messages.map((e) => {
     
       const isUser = e.role === "user";
  return (
    <div
      key={e.id}
      className={`whitespace-pre-wrap my-2 w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isUser
            ? 'bg-blue-400 text-white rounded-br-none'
            : 'bg-gray-200 text-black rounded-bl-none'
        }`}
      >
        <p className="text-xs font-semibold mb-1">{isUser ? 'User' : 'AI'}</p>
        <p>{e.content}</p>
      </div>
    </div>
  );
})}

      </div>
      
      {/* 초록색 입력창 - flex-grow를 1로 설정 */}
      <form onSubmit={handleSubmit} className="w-full  flex-grow-[1] flex items-center py-4">
        <input
          className="w-full h-[70%]  bg-gray-100  p-2  "
          value={input}
          name="prompt"
          onChange={handleInputChange}
        />
       <button type="submit" className="h-[70%]  bg-gray-100 items-center flex  justify-center px-5">
  <SendIcon className="stroke-blue-400" />
</button>
      </form>
    </div>
  )
}

export default ChatDemo
