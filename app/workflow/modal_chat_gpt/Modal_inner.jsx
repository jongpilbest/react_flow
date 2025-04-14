'use client'

import React, { useState,useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSelector, useDispatch } from 'react-redux';
import { addChildNode } from '@/app/redux/Node_Store';


import {modal_struction} from './modal_struction'
import{Loader } from 'lucide-react'



export default function ModalInner({id,setopen,description}) {

  const reduxNodes = useSelector((state) => state.node.nodes);
  const[result,setResult]=useState([]);
  const [input,setinput]=useState("")

  const handleSubmit = async (e) => {
    e.stopPropagation();
    let input_result=input;  
    if(description) input_result=input_result+'+'+description
  
    usepending((el)=>!el);
    const res = await fetch('/api/workflow', {
      method: 'POST',
      body: JSON.stringify({ input_result ,id }),
    });
     const data = await res.json();
     setResult(data.messages);
  
     usepending((el)=>!el);
  };
 

  const dispatch = useDispatch();




 const [pending,usepending]=useState(false);






  const handleSubmit_2 = async (messages) => {

  
 

    const last_number_tree=Object.keys(reduxNodes).length+1;

  
      const newNode={
        [last_number_tree]: {
          id: last_number_tree.toString(),
          name:'',
          children: [],
          data:[messages[0], messages[1]],
          type:'Child'
        },
       }


      //api 호출 하느거 
      usepending((el)=>!el);
      let response=await modal_struction(reduxNodes,newNode )

      dispatch(addChildNode({data:JSON.parse(response)}))
      usepending((el)=>!el);
      setopen((el)=>!el)  
   

  };
  
  /// html 


  return (
    <div className='realtive'>

<div className="absolute p-3 w-full bottom-0 translate-y-full  flex
  border-separate
justify-end
z-50 bg-white">
    <Button
      disabled={pending}
      onClick={handleSubmit}
      className={`p-3 h-6 text-sm ${
        pending
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-pink-400 hover:bg-blue-700'
      }`}
    >
      Search
    </Button>
  </div>
    <div className='p-3 bg-pink      w-full grid gap-2'>
     
      <div className='w-full h-[500px]   overflow-y-auto  '>
      {pending && <Loader size={18} className='animate-spin stroke-blue-800' />}
      {result.map((e) => {
     const isUser =  e.id[2] === "HumanMessage";
     let e_message=''
      isUser==true?e_message=e.kwargs.content:e_message= JSON.parse(e.kwargs.content)      
  
           return (
         <div
         key={e.kwargs.id}
        className={`whitespace-pre-wrap my-2 w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}
         >
         <div
          className={`max-w-[70%] p-3 rounded-lg ${
        isUser
          ? 'bg-blue-400 text-white rounded-br-none'
          : 'bg-gray-200 text-black rounded-bl-none'
         }`}
         >
      <p className="text-xs font-semibold mb-1">{isUser ? 'User' : 'AI'}</p>
      <p className='break-words'>{ isUser==true?e_message:e_message.message[0] }</p>
      {
        e_message.questionType =='ANSWERABLE' && <Button  
        disabled={pending}
        onClick={()=>handleSubmit_2(e_message.message)}
        className='bg-pink-400 hover:bg-blue-700
        p-3 h-6 text-sm
        ' >  
          ADD query
        </Button>
      }
    </div>
  </div>
);
})}


      </div>
     
     <form className="w-full  flex-grow-[1] flex items-center py-4">
      <Textarea 
          value={input}
          name="prompt"
          onChange={(e) => {
            const newValue = e.target.value;
            setinput(newValue);  // 또는 setInput(newValue)
          }}

        placeholder="Please enter SQL query"
      />
     </form>
     </div>
    </div>
  );
}

