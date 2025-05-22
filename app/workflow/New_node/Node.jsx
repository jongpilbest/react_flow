
import { Handle, Position } from '@xyflow/react';
import { useSelector ,useDispatch} from 'react-redux';
import { Node_click } from '@/app/redux/Node_Store';
import Chat_component from '../modal_chat_gpt/Chat_component';
import { useNodeId } from '@xyflow/react';
import React from 'react';
function NewNode({ data,name,id }) {
  const dispatch = useDispatch();
  const nodeId = useNodeId() 
  return (
    <div 
    onClick={()=> dispatch(Node_click(data.sql))}
    className="w-auto h-12 bg-white flex items-center p-6 border-blue-400 border-2">
     
        <Chat_component description='' id={nodeId}></Chat_component>
     
      <Handle
   className="!w-3 !h-3 !bg-blue-400"
        type="target"
        position={Position.Top}
      />
      
      <Handle
        className="!w-3 !h-3 !bg-blue-400"
        type="source"
        position={Position.Bottom}
        id="a"
     
      />
      
       <p className='text-blue-400 font-bold '>{data.name}</p>
    </div>
  );
}
 

export default React.memo(NewNode)
