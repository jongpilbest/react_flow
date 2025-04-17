"use client"; // ✅ Next.js에서 클라이언트 컴포넌트로 지정

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./Header/Header"
import Time_to from "./Header/Time_to_sql"
import Store  from '../redux/store'
import { Provider } from 'react-redux';


export default function Layout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient()); // ✅ 오류 해결됨


  return (
    <QueryClientProvider client={queryClient}>

   <Provider store={Store}>
    <Time_to></Time_to>
      <div className="flex flex-row w-full h-screen">
      <Header></Header>
        {children}
      </div>
      </Provider>
    </QueryClientProvider>
  );
}
