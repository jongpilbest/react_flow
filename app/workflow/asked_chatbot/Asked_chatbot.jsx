import React from 'react'
import Nodecomponents from '../nodes/Nodecomponents'
import Asked_inner from './Asked_inner'
import {data_chat_gpt}from '../../../lib/Data/data'
const [IconComponent ,TextComponent ,labelComponent] =
 [data_chat_gpt.icon,data_chat_gpt.text,data_chat_gpt.label]
 

 //이거 모듈창이랑 겹치는거여서 ... 코드 정리를 다시해야될거 같은데 어떻게 해야될지 모르겠음...


 
export default function Asked_chatbot({data}) {
  return (
   <Nodecomponents IconComponent={IconComponent} TextComponent={TextComponent} labelComponent={labelComponent}>
    <Asked_inner data={data} >
    </Asked_inner>
   </Nodecomponents>
  )
}
