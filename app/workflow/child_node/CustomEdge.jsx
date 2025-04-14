import React from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
 
} from '@xyflow/react';
 
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
      <div
    style={{
      position: 'absolute',
      transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
      background: '#60A5FA',
      padding: '6px 10px',
    color:'white',
   fontWeight:'bold',
      borderRadius: '4px',
      fontSize: '15px',
      whiteSpace: 'nowrap',
      zIndex: 1000,
    }}
    className="edge-label-renderer__custom-edge nodrag nopan"
  >
    {data}
  </div>
      </EdgeLabelRenderer>
    </>
  );
};
 
export default CustomEdge;