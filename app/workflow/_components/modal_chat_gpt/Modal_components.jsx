"use clinet"

import React, { memo } from 'react'
import Nodecard from '../nodes/Nodecard'

import Modal_inner from './modal_inner'

import Nodecomponents from '../nodes/Nodecomponents'
import {data_chat_gpt}from '../../../../lib/Data/data'
const IconComponent = data_chat_gpt.icon;
const TextComponent= data_chat_gpt.text;
const labelComponent= data_chat_gpt.label;

 const Modal_components= () =>{

  return (
   <Nodecomponents IconComponent={IconComponent} TextComponent={TextComponent} labelComponent={labelComponent} >
     <Modal_inner></Modal_inner>
   </Nodecomponents>
   
  )
}
  
export default React.memo(Modal_components)