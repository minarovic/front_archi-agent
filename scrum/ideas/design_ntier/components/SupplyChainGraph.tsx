'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { buildSupplyChainGraph } from '@/src/lib/graph-builder';
import type { SupplyChainData } from '@/src/types/api';
import SupplyChainNode from './SupplyChainNode';

// Register custom node types
const nodeTypes = {
  supplyChainNode: SupplyChainNode,
};

interface SupplyChainGraphProps {
  data: SupplyChainData;
}

export default function SupplyChainGraph({ data }: SupplyChainGraphProps) {
  // Build graph from supply chain data
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // Get tier3_suppliers from response (top-level field per MCOP-03F)
    const tier3Suppliers = data.tier3_suppliers || [];

    return buildSupplyChainGraph(
      data.focal_entity,
      data.tier2_suppliers,
      tier3Suppliers
    );
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    console.log('Node clicked:', node.data.label, node.data);
  }, []);

  return (
    <div className="w-full h-[800px] bg-white border border-gray-300 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={1}
        maxZoom={1}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
      </ReactFlow>
    </div>
  );
}
