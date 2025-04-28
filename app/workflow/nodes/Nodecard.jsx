import React, { useState } from 'react';

export default function Nodecard({children}) {

  return (
    <div
      className={`rounded-sm relative cursor-pointer bg-background 
        border-separate w-[550px] text-sm
        h-auto
        height-auto
        gap-1 flex flex-col `}
       // ✅ 클릭 시 상태 변경
    >
   {children}
    </div>
  );
}
