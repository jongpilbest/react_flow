import React from 'react'
import { Position,Handle } from '@xyflow/react';
import DataTable_form from '@/app/utils/DataTable_form '
function Child_inner({description,sql,data}) {
  

  return (
    <>
    
    <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="bg-blue-500 w-3 h-3"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="bg-green-500 w-3 h-3"
      />

    <div className='p-3 bg-white w-[420px] height-[200px] grid gap-2'>
       <p className='text-xs font-bold uppercase text-muted-foreground '>description</p>
       <div className='py-4 px-3 text-xs bg-secondary'>
        {description}
        </div>
        <p className='text-xs font-bold uppercase text-muted-foreground '>SQL Query</p>
       <div className='py-4 px-3 text-xs  bg-secondary'>
       {sql}
        </div>
        <p className='text-xs font-bold uppercase text-muted-foreground '>Result</p>
       <div className='  bg-secondary'>
        </div>

        </div>
        </>
  )
}
export default React.memo(Child_inner)

//   <DataTable_form tableData={[header,remain]}></DataTable_form>