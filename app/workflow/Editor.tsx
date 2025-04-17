import React from 'react'
import { ReactFlow,  ReactFlowProvider, Background ,BackgroundVariant  } from '@xyflow/react'
import FlowEditor from './FlowEditor'
import { useSelector, useDispatch } from 'react-redux';
import { addChildNode } from '@/app/redux/Node_Store';
export default function Editor({}) {

  return (
    <div className='w-full'>
     
   
    <ReactFlowProvider>
        <div className='flex flex-col h-full w-full overflow-hidden'>
            <section className='flex h-full overflow-auto'>
                <FlowEditor></FlowEditor>
            </section>
        </div>
    </ReactFlowProvider>
    </div>
  )
}
