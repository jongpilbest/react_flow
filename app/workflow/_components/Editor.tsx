import React from 'react'
import { ReactFlow,  ReactFlowProvider, Background ,BackgroundVariant  } from '@xyflow/react'
import FlowEditor from './FlowEditor'
export default function Editor({}) {
  return (
    <ReactFlowProvider>
        <div className='flex flex-col h-full w-full overflow-hidden'>
            <section className='flex h-full overflow-auto'>
                <FlowEditor></FlowEditor>
            </section>
        </div>
    </ReactFlowProvider>
  )
}
