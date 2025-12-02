'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { ComparisonResponse } from '@/src/types/comparison';
import SupplyChainNode from './SupplyChainNode';
import { cleanCompanyName } from '@/src/lib/graph-shared';

// Register custom node types
const nodeTypes = {
  supplyChainNode: SupplyChainNode,
};

interface ComparisonGraphProps {
  data: ComparisonResponse['data'];
}

export default function ComparisonGraph({ data }: ComparisonGraphProps) {
  const [companyA, companyB] = data.companies;

  const { nodes: initialGraphNodes, edges: initialGraphEdges } = useMemo(() => {
    const graphNodes: Node[] = [];
    const graphEdges: Edge[] = [];

    const cleanNameA = cleanCompanyName(companyA);
    const cleanNameB = cleanCompanyName(companyB);

    // Focal entities (Company A and Company B) - Top tier - Blue and Orange
    graphNodes.push({
      id: 'focal_a',
      type: 'supplyChainNode',
      data: {
        tier: companyA,
        company: cleanNameA,
        riskScore: 0,
        tierLevel: 1,
        riskColor: '#FFFFFF',
        bgColor: '#2563eb',
        borderColor: '#1e40af',
        borderWidth: 2,
        country: '',
        tier_level: 1,
        entity_id: 'focal_a',
      },
      position: { x: 0, y: 0 },
    });

    graphNodes.push({
      id: 'focal_b',
      type: 'supplyChainNode',
      data: {
        tier: companyB,
        company: cleanNameB,
        riskScore: 0,
        tierLevel: 1,
        riskColor: '#FFFFFF',
        bgColor: '#ea580c',
        borderColor: '#c2410c',
        borderWidth: 2,
        country: '',
        tier_level: 1,
        entity_id: 'focal_b',
      },
      position: { x: 0, y: 0 },
    });

    // Common suppliers (center, green) - Tier 2
    data.common_suppliers.forEach((supplier, idx) => {
      const nodeId = `common_${idx}`;
      const cleanName = cleanCompanyName(supplier.name);

      graphNodes.push({
        id: nodeId,
        type: 'supplyChainNode',
        data: {
          tier: 'COMMON',
          company: cleanName,
          riskScore: 0,
          tierLevel: 2,
          riskColor: '#FFFFFF',
          bgColor: '#ECFDF5',
          borderColor: '#4BA82E',
          borderWidth: 2,
          country: supplier.country,
          tier_level: 2,
          entity_id: nodeId,
        },
        position: { x: 0, y: 0 },
      });

      // Edges from both focal entities to common supplier
      graphEdges.push({
        id: `edge_a_${nodeId}`,
        source: 'focal_a',
        target: nodeId,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'straight',
        animated: false,
        style: { stroke: '#4BA82E', strokeWidth: 2 },
      });

      graphEdges.push({
        id: `edge_b_${nodeId}`,
        source: 'focal_b',
        target: nodeId,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'straight',
        animated: false,
        style: { stroke: '#4BA82E', strokeWidth: 2 },
      });
    });

    // Unique to Company A (left side, light blue)
    data.unique_to_a.forEach((supplier, idx) => {
      const nodeId = `unique_a_${idx}`;
      const cleanName = cleanCompanyName(supplier.name);

      graphNodes.push({
        id: nodeId,
        type: 'supplyChainNode',
        data: {
          tier: 'UNIQUE A',
          company: cleanName,
          riskScore: 0,
          tierLevel: 2,
          riskColor: '#FFFFFF',
          bgColor: '#EFF6FF',
          borderColor: '#3b82f6',
          borderWidth: 1,
          country: supplier.country,
          tier_level: 2,
          entity_id: nodeId,
        },
        position: { x: 0, y: 0 },
      });

      graphEdges.push({
        id: `edge_a_${nodeId}`,
        source: 'focal_a',
        target: nodeId,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'straight',
        animated: false,
        style: { stroke: '#D1D5DB', strokeWidth: 1 },
      });
    });

    // Unique to Company B (right side, light orange)
    data.unique_to_b.forEach((supplier, idx) => {
      const nodeId = `unique_b_${idx}`;
      const cleanName = cleanCompanyName(supplier.name);

      graphNodes.push({
        id: nodeId,
        type: 'supplyChainNode',
        data: {
          tier: 'UNIQUE B',
          company: cleanName,
          riskScore: 0,
          tierLevel: 2,
          riskColor: '#FFFFFF',
          bgColor: '#FFF7ED',
          borderColor: '#ea580c',
          borderWidth: 1,
          country: supplier.country,
          tier_level: 2,
          entity_id: nodeId,
        },
        position: { x: 0, y: 0 },
      });

      graphEdges.push({
        id: `edge_b_${nodeId}`,
        source: 'focal_b',
        target: nodeId,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        type: 'straight',
        animated: false,
        style: { stroke: '#D1D5DB', strokeWidth: 1 },
      });
    });

    // Split-tree layout: Company A (left) | Common (center) | Company B (right)
    const canvasWidth = 1103;
    const nodeWidth = 70;
    const nodeHeight = 100;
    const tier1Y = 80;
    const tier2Y = 200;

    const uniqueACount = data.unique_to_a.length;
    const commonCount = data.common_count;
    const uniqueBCount = data.unique_to_b.length;

    // Calculate column widths based on node counts
    const leftColNodes = uniqueACount;
    const centerColNodes = commonCount;
    const rightColNodes = uniqueBCount;

    const totalNodes = leftColNodes + centerColNodes + rightColNodes;
    const spacing = 8; // Gap between nodes

    // Distribute space proportionally
    const leftWidth = totalNodes > 0 ? (leftColNodes / totalNodes) * canvasWidth : canvasWidth / 3;
    const centerWidth = totalNodes > 0 ? (centerColNodes / totalNodes) * canvasWidth : canvasWidth / 3;
    const rightWidth = totalNodes > 0 ? (rightColNodes / totalNodes) * canvasWidth : canvasWidth / 3;

    const layoutedNodes = graphNodes.map((node) => {
      if (node.id === 'focal_a') {
        // Company A - top left center of its column
        const centerX = leftWidth / 2 - 50; // Center 100px node
        return { ...node, position: { x: centerX, y: tier1Y } };
      }

      if (node.id === 'focal_b') {
        // Company B - top right center of its column
        const centerX = leftWidth + centerWidth + (rightWidth / 2) - 50; // Center 100px node
        return { ...node, position: { x: centerX, y: tier1Y } };
      }

      if (node.data.tier === 'UNIQUE A') {
        // Left column - distribute evenly
        const idx = parseInt(node.id.split('_')[2]);
        const availableWidth = leftWidth - nodeWidth;
        const xPos = uniqueACount > 1
          ? (idx / (uniqueACount - 1)) * availableWidth
          : availableWidth / 2;
        return { ...node, position: { x: xPos, y: tier2Y } };
      }

      if (node.data.tier === 'COMMON') {
        // Center column - distribute evenly
        const idx = parseInt(node.id.split('_')[1]);
        const startX = leftWidth;
        const availableWidth = centerWidth - nodeWidth;
        const xPos = commonCount > 1
          ? startX + (idx / (commonCount - 1)) * availableWidth
          : startX + availableWidth / 2;
        return { ...node, position: { x: xPos, y: tier2Y } };
      }

      if (node.data.tier === 'UNIQUE B') {
        // Right column - distribute evenly
        const idx = parseInt(node.id.split('_')[2]);
        const startX = leftWidth + centerWidth;
        const availableWidth = rightWidth - nodeWidth;
        const xPos = uniqueBCount > 1
          ? startX + (idx / (uniqueBCount - 1)) * availableWidth
          : startX + availableWidth / 2;
        return { ...node, position: { x: xPos, y: tier2Y } };
      }

      return node;
    });

    return { nodes: layoutedNodes, edges: graphEdges };
  }, [data, companyA, companyB]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraphEdges);

  return (
    <div className="w-full h-[800px] bg-white border border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={1}
        maxZoom={1}
        zoomOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
