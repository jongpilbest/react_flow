"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSelector } from "react-redux";
import Parents_node from "./parent_node/Parent_node";
import Child_nodes from "./child_node/Child_nodes";
import ASked_node from "./asked_chatbot/Asked_chatbot";

const initialEdges = [];

const nodeTypes = {
  Node: Parents_node,
  Child: Child_nodes,
  Chat: ASked_node,
};

export default function FlowEditor() {
  const reduxNodes = useSelector((state) => state.node.nodes);
  const [nodes, setNodes] = useState(reduxNodes || []);
  const [edges, setEdges] = useState(initialEdges);


  // ✅ `useCallback`에서 불필요한 의존성 제거하여 onNodesChange 최적화
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  return (
    <main className="h-full w-full bg-slate-100">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
      >
        <Controls position="top-left" />
        <Background  variant={BackgroundVariant.Dots} gap={20} />
      </ReactFlow>
    </main>
  );
}
