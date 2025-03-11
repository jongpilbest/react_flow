import React from 'react'
import { Database } from "lucide-react"
import { Badge } from '@/components/ui/badge'

const NodeHeader = React.memo(({ IconComponent, labelComponent, TextComponent }) => {

  return (
    <div className='flex items-center gap-2 p-2'>
     <IconComponent size={16} className='stroke-pink-400'/>
      <div className='flex justify-between items-center w-full'>
        <p className='text-xs font-bold uppercase text-muted-foreground'>
            {labelComponent}
        </p>
        <div className='flex gap-1 items-center'>
          <Badge> {TextComponent}</Badge>
        </div>
      </div>
    </div>
  )
}
)
export default NodeHeader;

