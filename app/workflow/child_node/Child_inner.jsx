import React from 'react'
import { Position,Handle } from '@xyflow/react';
import Chat_component from '../modal_chat_gpt/Chat_component';
import Child_Component from './Child_Component'
import { useState } from 'react';
import { useNodeId } from '@xyflow/react';
import DataTable_form from '@/app/utils/DataTable_form ';
function Child_inner({description,sql,data,tableData}) {
    const nodeId = useNodeId() 
   
    const { isSpouse, isSibling, label, direction } = data;
      const [click,setclick]=useState(false)

  // 'TB' 전용이므로 수평 트리 아님
  const isTreeHorizontal = false;

  const getTargetPosition = () => {
    if (isSpouse) return Position.Left;
    if (isSibling) return Position.Right;
    return Position.Top; // 기본: 부모 → 자식
  };

  const isRootNode = data?.isRoot;
  const hasChildren = !!data?.children?.length;
  const hasSiblings = !!data?.siblings?.length;
  const hasSpouses = !!data?.spouses?.length;

  return (
    <div key={nodeId}>
    <Chat_component description={description} id={nodeId}></Chat_component>
      {/* 자식 연결 (아래로) */}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
        />
      )}

      {/* 배우자 연결 (오른쪽으로) */}
      {hasSpouses && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
        />
      )}

      {/* 형제 연결 (왼쪽으로) */}
      {hasSiblings && (
        <Handle
          type="source"
          position={Position.Left}
          id="left"
        />
      )}

      {/* 부모 등 타겟 연결 */}
      {!isRootNode && (
        <Handle
          type="target"
          position={getTargetPosition()}
          id={getTargetPosition()}
        />
      )}
      <Child_Component tableData={tableData} description={description} sql={sql} step=''></Child_Component>
        <div className=' absolute h-10 -bottom-10 bg-white w-full   grid gap-2 '>
            <div className=' flex flex-col mx-3'>

  
           { Array.isArray(tableData) && 
            <>
                <p className='text-xs font-bold uppercase text-muted-foreground '>Result</p>
                <button className=' bg-blue-400 h-10 text-white text-bold' onClick={() => {
        setclick((prev) => !prev); // 기존 값을 가져와서 반전
      }}> 예시보기 </button>
                
                {click &&
                     tableData.map((el,index)=>{
                      return <DataTable_form    key={`step-${el}-table-${el}`} tableData={el}></DataTable_form>
              })      
        
                }
              
             </>
           
         }
                   </div>
            </div>
        </div>
  )
}
export default React.memo(Child_inner)

//   <DataTable_form tableData={[header,remain]}></DataTable_form>