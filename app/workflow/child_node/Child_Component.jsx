import React from 'react'
import DataTable_form from '@/app/utils/DataTable_form '
export default function Child_Component({description,sql,tableData,step }) {
 console.log(tableData,'여기 child 에서')
  return (
    <div  className='p-3 bg-white max-w-[100%]  height-[200px] grid gap-2'>
   {step && <p className='text-xs font-bold uppercase my-4 text-blue-500'>  step {step}</p>}   

    <p className='text-xs font-bold uppercase text-muted-foreground '>description</p>
    <div className='py-4 px-3 text-xs bg-secondary w-[100%]'>
     {description}
     </div>

     {sql && <> <p className='text-xs font-bold uppercase text-muted-foreground '>SQL Query</p>
    <div className='py-4 px-3 text-xs  bg-secondary'>
    {sql}
     </div> </> }
    

     { Array.isArray(tableData) && 
      <>
          <p className='text-xs font-bold uppercase text-muted-foreground '>Result</p>
          {
               tableData.map((el,index)=>{
                return <DataTable_form    key={`step-${step}-table-${index}`} tableData={el}></DataTable_form>
        })      
  
          }
        
       </>
     
   }
    <div className='  bg-secondary'>
     </div>

     </div>
  )
}
