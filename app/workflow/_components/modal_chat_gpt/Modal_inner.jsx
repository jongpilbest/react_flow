import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSelector, useDispatch } from 'react-redux';
import { fetchSQLSolution } from '../../../utils/Request_chatgpt'
import { Loader } from "lucide-react"
import { useReactFlow } from '@xyflow/react';
import { useMutation } from '@tanstack/react-query'
import Modal_check from './Modal_check'
import { change_open } from "@/app/redux/Database";
import { addChildNode } from '@/app/redux/Node_Store';
import { flushSync } from 'react-dom';

export default function ModalInner() {
  const [query, setQuery] = useState('');
  const [filterdata, setFilterData] = useState([]);
  const [check, setCheck] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.db.db); 
  const { getNode } = useReactFlow();



  const mutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const result = await fetchSQLSolution(user, query);
          resolve(result);
        }, 3000); 
      });
    },
    onSuccess: (data) => {
      if (JSON.stringify(data) !== JSON.stringify(filterdata)) {
        setFilterData(data);
      }
    }
  });

  const handleCheckboxChange = ((category) => {
    setCheck((prev) => 
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  });
  const find_parent_width = async function (parent_id) {
    return new Promise((resolve) => {
      const checkNode = () => {
        let node_start = getNode(parent_id);
        if (node_start !== undefined) {
          if(node_start.position==undefined || !node_start.measured) return;
          const parentWidth = node_start.position.x + node_start.measured.width;
          resolve(parentWidth);
        } else {
          setTimeout(checkNode, 10); // 10ms 후 다시 확인
        }
      };
      checkNode();
    });
  };
  
  //여기 다시 고쳐야됨 ㅠ ㅅㅂㄹ ㅠㅠ



  const handleSubmit = async () => {
    let parentId = "1"; // 부모 노드 ID를 가정
    let final_data = filterdata.filter((El) => check.includes(El.step)); // 선택한 데이터 필터링
  
    for (let i = 0; i < final_data.length + 1; i++) {
      let chat = {};
      if (i === 0) {
        // 첫 번째 노드: 쿼리 표시용
        const first_width = await find_parent_width(parentId);
  
        chat = {
          nodetype: "Chat",
          id: `${parentId}-${i}`,
          data: {
            description: query || "",
            step: "12",
          },
          position: first_width + 50,
        };
      } else {
        // 이후의 노드: final_data 기반
        const second_end_with = await find_parent_width(`${parentId}-${i-1}`);
        chat = {
          nodetype: "Child",
          id: `${parentId}-${i}`,
          data: { ...final_data[i - 1] }, // 인덱스 오류 수정
          position: second_end_with + 50,
        };
      }
  
      dispatch(addChildNode(chat));
  
      // 추가한 노드가 Redux 상태에 반영될 때까지 기다리기
      await find_parent_width(`${parentId}-${i}`);
    }
  
    dispatch(change_open()); // UI 갱신
  };
  
  
  return (
    <div className='p-3 bg-white w-full grid gap-2'>
      <Textarea 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Please enter SQL query"
      />
      <div className='flex justify-end'>
        <Button 
          onClick={() => mutation.mutate()}
          className="p-3 h-4 text-sm hover:bg-blue-700 bg-pink-400"
        >
          Search
        </Button>
      </div>
      {mutation.isPending && 
        <Loader size={18} className='animate-spin stroke-green-400' />
      } 
      {mutation.isSuccess && 
        <div className='grid gap-2'>
          <p className='text-xs font-bold uppercase text-muted-foreground'>answer</p>
          <div className='py-4 bg-secondary'>
            {filterdata.map((el) => (
              <Modal_check 
                check={check}
                key={el.step}
                data={el}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>
          <div className='flex justify-end'>
            <Button onClick={()=>handleSubmit()} className="p-3 h-4 text-sm hover:bg-blue-700 bg-pink-400">
              Check
            </Button>
          </div>
        </div>
      }
    </div>
  );
}
