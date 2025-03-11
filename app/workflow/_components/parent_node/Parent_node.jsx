import React from 'react'
import Nodecomponents from '../nodes/Nodecomponents'
import NodeInput from './NodeInput'
import {data_start_point}from '../../../../lib/Data/data'
const [IconComponent ,TextComponent ,labelComponent] =
 [data_start_point.icon,data_start_point.text,data_start_point.label]

export default function Parent_node({id}) {

  return (
    <Nodecomponents IconComponent={IconComponent} TextComponent={TextComponent}  labelComponent={labelComponent}>
    <NodeInput id={id}></NodeInput>
    </Nodecomponents>
  )
}
