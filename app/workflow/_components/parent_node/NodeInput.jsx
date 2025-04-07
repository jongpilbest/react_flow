import React from 'react'
import { Handle,Position } from '@xyflow/react'
import CSVUploader from '../files_upload/Uploade_files'
import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useDispatch,useSelector } from 'react-redux'
import Modal_components from '../modal_chat_gpt/Modal_components'
import { change_open } from "@/app/redux/Database";
import { useNodeId } from '@xyflow/react';

 function NodeInput() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.db.open); 
  const nodeId = useNodeId();



  
  return (
    <div className='flex justify-start relative p-3 bg-white w-full'
    >
     <CSVUploader  />
     {
      user &&
      <div className='absolute -right-10
      translate-x-full
       top-1/2 transform -translate-y-1/2'>
        
            <Modal_components id={nodeId} >
            </Modal_components>
         
        </div>
  
     }

     <button 
      onClick={(e) => {
        e.stopPropagation(); 
        console.log('선택이 되니')
          dispatch(change_open())
      }
      }

     className="absolute right-[-30px] z-40 top-1/2 transform
     rounded-xl
     -translate-y-1/2
     flex items-center justify-center
     hover:bg-blue-700
     bg-gray-400  border shadow-lg   w-8 h-8 ">
     <PlusCircle size={16} className='stroke-white '></PlusCircle>
     </button>
     

    <Handle
    type="target"
    className='hidden'
    position={Position.Right}
        >
    </Handle>
    </div>
  )
}

export default React.memo(NodeInput)