"use client";

import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  addEdge,
  useNodesState,
  useEdgesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSelector } from "react-redux";
import Parents_node from "./parent_node/Parent_node";
import Child_nodes from "./child_node/Child_nodes";
import ASked_node from "./asked_chatbot/Asked_chatbot";
import { treeRootId } from '../redux/Intial_node';
import { layoutElements } from '../redux/layout-element';
import CustomNode_ex from './parent_node/CustomNode_ex';
import CustomEdge from  "./child_node/CustomEdge";
import NewNode from './New_node/Node';
const nodeTypes = {
  Node: Parents_node,
  Child: Child_nodes,
  Chat: ASked_node,
  custom:CustomNode_ex,
  NewNL : NewNode
};

const edgeTypes = {
  custom: CustomEdge,
}

export default function FlowEditor() {
  const reduxNodes = useSelector((state) => state.node.nodes); // 실제 트리 형식의 node 데이터
  const reduxEdges=  useSelector((state) => state.node.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );

  // ✅ Redux 상태가 바뀔 때마다 position 포함한 nodes 재계산
  useEffect(() => {
    if (!reduxNodes || Object.keys(reduxNodes).length === 0) return;
//
   // const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(
   //   reduxNodes,
   //   treeRootId,
   //   'TB'
   // );
  
    setNodes(reduxNodes);
    setEdges(reduxEdges);
    //setEdges(layoutedEdges); // 필요하면 같이 업데이트
  }, [reduxNodes, setNodes, setEdges]);

  return (
    <main className="h-full w-full bg-slate-100">
      <ReactFlow
        nodes={nodes}
        edgeTypes={edgeTypes}
        edges={edges}
  
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Controls position="top-left" />
        <Background variant={BackgroundVariant.Dots} gap={20} />
      </ReactFlow>
    </main>
  );
}
