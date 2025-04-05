import React from 'react'
import { RefreshCcw } from 'lucide-react'
import Chat_page from './Chat_page'
export default function Chat_layout() {
  return (
    <div className=' w-[30%] h-[100%] flex flex-col  bg-white'>
        <header className='  
        
        mt-4 m-6 flex justify-between h-10 items-center '>
            <p className='text-sm font-bold uppercase text-muted-foreground'> Chat : Db 01</p>
            <button className=' p-1 bg-blue-400 flex rounded-full text-xs w-32 justify-around items-center
            font-semibold 
            text-white uppercase '>
                <RefreshCcw size={18} className='stroke-white '></RefreshCcw>
                Restart
            </button>
        </header>
        {/* 여기서부터 chat 만드는 폼임임 */}
        <div className=' flex  flex-col w-full p-4  overflow-y-auto flex-grow-[9.5]'>
        <Chat_page></Chat_page>
        </div>
        
    

    </div>
  )
}
