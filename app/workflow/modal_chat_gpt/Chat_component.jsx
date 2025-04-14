import React from 'react'
import { PlusCircle } from 'lucide-react'
import Modal_components from './Modal_components'
import { useState } from 'react';
function Chat_component({id,description}) {
    const [open,setopen]=useState(false);
  
  return (
    <div>
         {
      <div 
      style={{ display: open ? "block" : "none" }}
      className='absolute -right-10
      translate-x-full
      
       top-1/2 transform '>
        
            <Modal_components description={description} setopen={setopen}  id={id} >
            </Modal_components>
         
        </div>
  
     }

     <button 
      onClick={(e) => {
        setopen((El)=>!El);
  
      }
      }

     className="absolute right-[-35px] z-40 top-1/2 transform
     rounded-xl
     -translate-y-1/2
     flex items-center justify-center
     hover:bg-blue-700
     bg-gray-400  border shadow-lg   w-8 h-8 ">
     <PlusCircle size={16} className='stroke-white '></PlusCircle>
     </button>
     

    </div>
  )
}


export default React.memo(Chat_component)