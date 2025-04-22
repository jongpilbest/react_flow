import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
 
const { Top, Bottom, Left, Right } = Position;
 


const CustomNode = ({ data }) => {
  const { isSpouse, isSibling, label, direction } = data;

  const isTreeHorizontal = direction === 'LR';

  const getTargetPosition = () => {
    if (isSpouse) {
      return isTreeHorizontal ? Position.Top : Position.Left;
    } else if (isSibling) {
      return isTreeHorizontal ? Position.Bottom : Position.Right;
    }
    return isTreeHorizontal ? Position.Left : Position.Top;
  };

  const isRootNode = data?.isRoot;
  const hasChildren = !!data?.children?.length;
  const hasSiblings = !!data?.siblings?.length;
  const hasSpouses = !!data?.spouses?.length;

  return (
    <div className="bg-white flex justify-center">
      {hasChildren && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Position.Right : Position.Bottom}
          id={isTreeHorizontal ? Position.Right : Position.Bottom}
        />
      )}
      {hasSpouses && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Position.Bottom : Position.Right}
          id={isTreeHorizontal ? Position.Bottom : Position.Right}
        />
      )}
      {hasSiblings && (
        <Handle
          type="source"
          position={isTreeHorizontal ? Position.Top : Position.Left}
          id={isTreeHorizontal ? Position.Top : Position.Left}
        />
      )}
      {!isRootNode && (
        <Handle
          type="target"
          position={getTargetPosition()}
          id={getTargetPosition()}
        />
      )}
      <div>{label}</div>
    </div>
  );
};

CustomNode.displayName = 'CustomNode'; // 선택이지만 권장

export default memo(CustomNode);
