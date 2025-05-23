"use clinet"

import React, { memo } from 'react'
import Nodecard from '../nodes/Nodecard'

import Modal_inner from './Modal_inner'

import Nodecomponents from '../nodes/Nodecomponents'
import {data_chat_gpt}from '../../../lib/Data/data'
const IconComponent = data_chat_gpt.icon;
const TextComponent= data_chat_gpt.text;
const labelComponent= data_chat_gpt.label;

 const Modal_components= ({id ,description,setopen}) =>{

  return (
   <Nodecomponents IconComponent={IconComponent} TextComponent={TextComponent} labelComponent={labelComponent} >
     <Modal_inner description={description} setopen={setopen} id={id}></Modal_inner>
   </Nodecomponents>
   
  )
}
  
export default React.memo(Modal_components)