"use client"; // ✅ Next.js에서 클라이언트 컴포넌트로 지정

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./Header/Header"
import ChatLayout from './Header/Chat/Chat_layout'
import { Button } from "react-day-picker";


export default function Layout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient()); // ✅ 오류 해결됨


  return (
    <QueryClientProvider client={queryClient}>
    
      <div className="flex flex-row w-full h-screen">
        <Header></Header>
        {children}
 
      </div>
    </QueryClientProvider>
  );
}
