'use client'

import React, { useState,useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSelector, useDispatch } from 'react-redux';

import {modal_struction} from './modal_structure'
import { change_open } from "@/app/redux/Database";

import{Loader } from 'lucide-react'


export default function ModalInner({id}) {
  const [result, setResult] = useState([]);
  const reduxNodes = useSelector((state) => state.node.nodes);



  const handleSubmit = async (e) => {
    e.stopPropagation(); 
    usepending((el)=>!el);
    const res = await fetch('/api/workflow', {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
     const data = await res.json();
     setResult(data.messages);

     usepending((el)=>!el);
  };
 

  const dispatch = useDispatch();
  const user = useSelector((state) => state.db.db); 

 const [input,setinput]=useState("")

 const [pending,usepending]=useState(false);






  const handleSubmit_2 = async (messages) => {

  
    //부모 노드에 해당하는아이디를 가져온다음 넣어야됨  우선은 아이디를 하드 코딩으로 넣음
    // 여기서 json 형태인 string 으로 받아왓으니 parse 을 이용해야된다. 


      let chat = {
        sql:messages[0],
        description:messages[1],
        parent_id:id,
        child_id:(parseInt(id)+1).toString(),
        
      };

      //api 호출 하느거 
     // const response=modal_struction(reduxNodes, )

       
  
     // dispatch(addChildNode(chat));
      //노드를 추가하기 

    dispatch(change_open()); // UI 갱신
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
     
      <div className='w-full h-[600px]   overflow-y-auto  '>
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


//   {mutation.isPending && 
//  <Loader size={18} className='animate-spin stroke-green-400' />
//} 
//{mutation.isSuccess && 
//  <div className='grid gap-2'>
//    <p className='text-xs font-bold uppercase text-muted-foreground'>answer</p>
//    <div className='py-4 bg-secondary'>
//      {filterdata.map((el) => (
//        <Modal_check 
//          check={check}
//          key={el.step}
//          data={el}
//          handleCheckboxChange={handleCheckboxChange}
//        />
//      ))}
//    </div>
//    <div className='flex justify-end'>
//      <Button onClick={()=>handleSubmit()} className="p-3 h-4 text-sm hover:bg-blue-700 bg-pink-400">
//        Check
//      </Button>
//    </div>
//  </div>
//}