import React from 'react'
import { Handle,Position } from '@xyflow/react'
import CSVUploader from '../files_upload/Uploade_files'
import { useDispatch,useSelector } from 'react-redux'
import Chat_Component from '../modal_chat_gpt/Chat_component'

import { useNodeId } from '@xyflow/react';


//import { OpenContext } from './LevelContext.js';
 function NodeInput() {
  const dispatch = useDispatch();
 // const user = useSelector((state) => state.db.open); 
  //여기서 provider 으로 수정하기 
  
  const nodeId = useNodeId();

  
  return (
    <div className='flex justify-start relative p-3 bg-white w-full'
    >
     <CSVUploader />
    <Chat_Component description='' id={nodeId}></Chat_Component>
     
    <Handle
  className="!w-3 !h-3 !bg-gray-400"
    type="source"
    id="bottom"
    position={Position.Bottom}
        >
    </Handle>
    </div>
  )
}

export default React.memo(NodeInput)