import React from 'react'
import { Position,Handle } from '@xyflow/react';
import DataTable_form from '@/app/utils/DataTable_form '
function Child_inner({data}) {


  return (
    <div className='p-3 bg-white min-w-[420px]  grid gap-2'>
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
     
        </div>

  <Handle
    type="target"
    position={Position.Top}
        >
    </Handle>
    <Handle
    type="target"
    position={Position.Bottom}
        >
    </Handle>
        </div>
  )
}
export default React.memo(Child_inner)

//   <DataTable_form tableData={[header,remain]}></DataTable_form>