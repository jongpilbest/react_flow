import React from 'react'
import { Handle,Position } from '@xyflow/react'
import CSVUploader from '../files_upload/Uploade_files'

import Chat_Component from '../modal_chat_gpt/Chat_component'

import { useNodeId } from '@xyflow/react';



 function NodeInput() {

  
  const nodeId = useNodeId();

  
  return (
    <div className='flex justify-start relative p-3 bg-white w-full'
    >

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