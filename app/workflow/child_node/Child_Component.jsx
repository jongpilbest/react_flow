import React from 'react'
import DataTable_form from '@/app/utils/DataTable_form '
import { useState } from 'react'

export default function Child_Component({description,sql,tableData,step }) {


  return (
    <div  className='p-3 bg-white max-w-[100%] w-auto height-[200px] h-auto grid gap-2'>
   {step && <p className='text-xs font-bold uppercase my-4 text-blue-500'>  step {step}</p>}   

    <p className='text-xs font-bold uppercase text-muted-foreground '>description</p>
    <div className='py-4 px-3 text-xs bg-secondary w-[100%]'>
     {description}
     </div>

     {sql && <> <p className='text-xs font-bold uppercase text-muted-foreground '>SQL Query</p>
    <div className='py-4 px-3 text-xs  bg-secondary'>
    {sql}
     </div> </> }
    
    
     </div>
  )
}
