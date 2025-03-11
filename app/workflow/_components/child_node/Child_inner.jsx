import React from 'react'
import { Position,Handle } from '@xyflow/react';
import DataTable_form from '@/app/utils/DataTable_form '
function Child_inner({data}) {
  const [header,...remain]=data.expected_result;

  return (
    <div className='p-3 bg-white w-full  grid gap-2'>
       <p className='text-xs font-bold uppercase text-muted-foreground '>description</p>
       <div className='py-4 px-3 text-xs bg-secondary'>
        {data.description}
        </div>
        <p className='text-xs font-bold uppercase text-muted-foreground '>SQL Query</p>
       <div className='py-4 px-3 text-xs  bg-secondary'>
       {data.sql}
        </div>
        <p className='text-xs font-bold uppercase text-muted-foreground '>Result</p>
       <div className='  bg-secondary'>
        <DataTable_form tableData={[header,remain]}></DataTable_form>
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
export default React.memo(Child_inner)
