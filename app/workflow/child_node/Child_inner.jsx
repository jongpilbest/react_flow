import React from 'react'
import { Position,Handle } from '@xyflow/react';
import Chat_component from '../modal_chat_gpt/Chat_component';
import Child_Component from './Child_Component'
import { useNodeId } from '@xyflow/react';
function Child_inner({description,sql,data}) {
    const nodeId = useNodeId() +description.slice(2,5)+sql.slice(-1,-4);

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
      <Child_Component  description={description} sql={sql} step=''></Child_Component>

        </div>
  )
}
export default React.memo(Child_inner)

//   <DataTable_form tableData={[header,remain]}></DataTable_form>