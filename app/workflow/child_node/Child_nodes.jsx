import React from 'react'
import Nodecomponents from '../nodes/Nodecomponents'
import Child_inner from './Child_inner'
import {data_child}from '../../../lib/Data/data'
const [IconComponent ,TextComponent ,labelComponent] =
 [data_child.icon,data_child.text,data_child.label]
 
export default function Child_nodes({data}) {
  
  

  return (
   <Nodecomponents IconComponent={IconComponent} TextComponent={TextComponent} labelComponent={labelComponent}>
    <Child_inner data={data}  sql={data.data[0]} description={data.data[1]}>
    </Child_inner>
   </Nodecomponents>
  )
}
