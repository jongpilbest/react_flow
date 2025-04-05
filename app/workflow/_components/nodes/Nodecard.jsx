import React, { useState } from 'react';

export default function Nodecard({children}) {
  //const [isSelected, setIsSelected] = useState(false);
 // onClick={() => setIsSelected(!isSelected)}
  return (
    <div
      className={`rounded-sm cursor-pointer bg-background border-2 w-auto  border-separate min-w-[420px] text-sm
        gap-1 flex flex-col `}
       // ✅ 클릭 시 상태 변경
    >
   {children}
    </div>
  );
}
//${isSelected ? 'border-primary' : 'border-gray-300'}