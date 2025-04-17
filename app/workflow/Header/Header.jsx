import React from 'react'
import {Bot,Database} from "lucide-react"
export default function Header() {
  return (
    <div className=' w-20 flex flex-col   items-center h-full bg-white border border-gray-300 '>
       <div className='h-10  w-10 mt-4 bg-pink-400 rounded-md 
       
       flex justify-center items-center '>
       <Bot size={25} className='stroke-white '></Bot>
       </div>
       <div className='h-10  w-10 m-2 mt-10 bg-blue-400 rounded-md justify-center items-center flex '>
       <Database size={20} className='stroke-white' strokeWidth={2.5} ></Database>
       </div>
     
     
    </div>
  )
}
//<div className='h-10  w-10 m-2 mt-2 border-blue-400 border   justify-center  rounded-md items-center flex '>
//<Database size={20} className='stroke-slate-500 ' strokeWidth={2.5}></Database>
//</div>
// 미래에... 시간되면 db 2 개로 하는것도... 
