import React from 'react'
import { Position,Handle } from '@xyflow/react';
export default function Asked_inner({data}) {
  return (
    <div className='p-3 bg-white w-full  grid gap-2'>
     <p className='text-xs font-bold uppercase text-muted-foreground '>Asked a chatbot </p>
       <div className='py-4 px-3 text-xs bg-secondary'>
        {data.description}
        </div>
    <Handle
        type="target"
        position={Position.Right}
            >
        </Handle>
        <Handle
        type="target"
        position={Position.Left}
            >
        </Handle>
    </div>
  )
}

//여기도 같은 형태니까 componet hook 으로 따로 빼놓는게 날거 같은데 ..우선은 만들어놓고 내일 고치는걸로 하자 

//물어봣던 내역도 node  에 연결하는걸로 해야됨..!!