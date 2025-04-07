'use client'

import React, { useState,useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSelector, useDispatch } from 'react-redux';

import { useReactFlow } from '@xyflow/react';
import{CheckCircle2} from 'lucide-react'
import { change_open } from "@/app/redux/Database";
import { addChildNode } from '@/app/redux/Node_Store';
import{Loader } from 'lucide-react'


export default function ModalInner({id}) {
  const [result, setResult] = useState([]);

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
  const { getNode } = useReactFlow();
  //const { messages, input, handleInputChange, handleSubmit, isLoading } =
  //useChat({ experimental_throttle: 50,api:'/api/workflow'});
 // 기존 코드는 여러개가 나온다고 가정했을때 for문을 여러개 돌렸지만. 여기서는 하나만 나오게 우선해보기 
 const [input,setinput]=useState("")

 const [pending,usepending]=useState(false);



  //const mutation = useMutation({
  //  mutationFn: async () => {
  //    return new Promise((resolve) => {
  //      setTimeout(async () => {
  //        const result = await fetchSQLSolution(user, query);
  //        resolve(result);
  //      }, 3000); 
  //    });
  //  },
  //  onSuccess: (data) => {
  //    if (JSON.stringify(data) !== JSON.stringify(filterdata)) {
  //      setFilterData(data);
  //    }
  //  }
  //});
  //

  const find_parent_width = async function (parent_id) {
    const node_start = getNode(id);
    console.log(node_start,'자식몇개?')
    
    if (
      !node_start ||
      !node_start.position ||
      !node_start.measured
    ) {
      return [0, 0]; // 
    }
  
    const parentWidth = node_start.position.x 
    const parentHeight = node_start.position.y + node_start.measured.height;
  
    return [parentWidth, parentHeight];
  };
  
  //useEffect(() => {
  ////console.log(messages,'useEffect 에서의 메세지 ')
  ////  // 응답 메시지가 도착했을 때 실행
  ////  if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
  ////    const lastMessage = messages[messages.length - 1].content;
  ////    //마지막 노드인지? 확인하는게 필요한거 같은데 
////
  ////    console.log('노드 생성하는거 react')
  ////    //  handleSubmit_2(lastMessage);  // 노드 생성 함수 호출
  ////  }
  //}, [result]);
  


  const handleSubmit_2 = async (messages) => {

    let parentId = "1"; // 부모 노드 ID를 가정
    //부모 노드에 해당하는아이디를 가져온다음 넣어야됨  우선은 아이디를 하드 코딩으로 넣음음
     
      let chat = {};
        // 첫 번째 노드: 쿼리 표시용
        const [first_width,first_height] = await find_parent_width(parentId);
        //데이터만 받아오면 될거같음 langr그래프에게 sql 문이랑 데이터도 같이 보내달라고 해야됨
      
        chat = {
          nodetype: "Child",
          id: `${parentId}-1`,
          data: {
            sql: messages[0],
            description:messages[1]
          },
          position: [first_width ,first_height+10],
        };
 
        //     const { data,nodetype,id,position } = action.payload
  
      dispatch(addChildNode(chat));
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
     
      <div className='w-full h-96    overflow-y-auto  '>
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