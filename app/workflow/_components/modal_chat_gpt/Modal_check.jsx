import React from 'react'
import { Check } from 'lucide-react'
import { Checkbox } from '@radix-ui/react-checkbox'
export default function Modal_check({data,handleCheckboxChange,check}) {
   
  const isChecked= check.includes(data.step)

  return (
    <div className='w-full h-25 flex justify-between items-center py-1 px-3 '>
    <p className='text-xs  text-gray-800'>{data.description}</p>
   <Checkbox></Checkbox>
    <Check 
    size={20}
    onClick={()=>handleCheckboxChange(data.step)}
     className={`stroke-${isChecked ? "green-400" : "gray-400"} active:bg-violet-700 cursor-pointer hover:stroke-red-700`}></Check>
    </div>
  )
}

