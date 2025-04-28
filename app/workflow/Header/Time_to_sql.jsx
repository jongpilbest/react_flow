'use client';

import React, { useState } from 'react';
import { Flow_chat } from './action';
import { useFormStatus } from 'react-dom';
import { useSelector ,useDispatch} from 'react-redux';
import { addChildNode,addFlowChildNode } from '@/app/redux/Node_Store';

export default function Time_to_sql() {
  const [input, setinput] = useState('');
  const reduxNodes = useSelector((state) => state.node.nodes);
  const dispatch = useDispatch();
  async function actionHandler(formData){


      const last_number_tree=Object.keys(reduxNodes).length+1;
      formData.append('numbers', String(last_number_tree)); 
      formData.append('initial_Tree', JSON.stringify(reduxNodes));
      const response= await Flow_chat(formData)
      // 으로 받은것
     //console.log(response,'응답')

         //dispatch(addChildNode({data:JSON.parse(response)}))
      dispatch(addFlowChildNode({data:JSON.parse(response), start:last_number_tree }))


  }

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        className="h-8 px-4 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        disabled={pending}
      >
        {pending ? 'Submitting...' : 'Sql Generate'}
      </button>
    );
  }

  return (
    <div className="react-flow__panel react-flow__controls vertical top-[5%] nopan absolute left-[20%] w-[60%] flex items-center bg-white rounded-xl shadow-md px-3 py-2 z-50">
      <form action={actionHandler} className="flex w-full items-center gap-3">
        <input
          className="flex-grow h-8  rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setinput(e.target.value)}
          name="productId"
          value={input}
          placeholder="Enter product ID"
        />
        <SubmitButton />
      </form>
    </div>
  );
}
