import React from 'react'
import { Position,Handle } from '@xyflow/react';
import Chat_component from '../modal_chat_gpt/Chat_component';

import { useNodeId } from '@xyflow/react';
function Child_inner({description,sql,data}) {
    const nodeId = useNodeId();
    const { isSpouse, isSibling, label, direction } = data;
    

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
    <div className='p-3 bg-white w-[420px] height-[200px] grid gap-2'>
       <p className='text-xs font-bold uppercase text-muted-foreground '>description</p>
       <div className='py-4 px-3 text-xs bg-secondary'>
        {description}
        </div>
        <p className='text-xs font-bold uppercase text-muted-foreground '>SQL Query</p>
       <div className='py-4 px-3 text-xs  bg-secondary'>
       {sql}
        </div>
        <p className='text-xs font-bold uppercase text-muted-foreground '>Result</p>
       <div className='  bg-secondary'>
        </div>

        </div>
        </div>
  )
}
export default React.memo(Child_inner)

//   <DataTable_form tableData={[header,remain]}></DataTable_form>